import os
import zipfile
import pandas as pd
import logging

logger = logging.getLogger("energy_agent")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATASETS_DIR = os.path.join(BASE_DIR, "datasets")
EXTRACTED_DIR = os.path.join(DATASETS_DIR, "extracted")
ZIP_PATH = os.path.join(DATASETS_DIR, "archive.zip")

class DatasetLoader:
    def __init__(self):
        self.extracted_path = EXTRACTED_DIR
        self.zip_path = ZIP_PATH
        self._ensure_extracted()

    def _ensure_extracted(self):
        """Extracts archive.zip if it has not been extracted already."""
        if not os.path.exists(self.zip_path):
            logger.error(f"archive.zip not found at {self.zip_path}")
            raise FileNotFoundError(f"archive.zip not found at {self.zip_path}")

        os.makedirs(self.extracted_path, exist_ok=True)
        
        # Check if extracted folder is empty
        files_in_extracted = os.listdir(self.extracted_path)
        if not files_in_extracted or "metadata.csv" not in files_in_extracted:
            logger.info(f"Extracting {self.zip_path} to {self.extracted_path}...")
            with zipfile.ZipFile(self.zip_path, 'r') as zip_ref:
                # To optimize, we extract only the core files we need
                target_files = [
                    "metadata.csv",
                    "weather.csv",
                    "electricity.csv",
                    "water.csv",
                    "chilledwater.csv"
                ]
                for file_info in zip_ref.infolist():
                    basename = os.path.basename(file_info.filename)
                    if basename in target_files or file_info.filename in target_files:
                        logger.info(f"Extracting essential file: {file_info.filename}")
                        zip_ref.extract(file_info, self.extracted_path)
                        # If extracted in a subdirectory, move it to root of extracted/
                        extracted_file_path = os.path.join(self.extracted_path, file_info.filename)
                        if file_info.filename != basename:
                            dest_path = os.path.join(self.extracted_path, basename)
                            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                            os.rename(extracted_file_path, dest_path)
            logger.info("Extraction completed successfully.")

    def find_csv_file(self, pattern: str) -> str:
        """Finds a CSV file matching the pattern in the extracted folder."""
        for root, dirs, files in os.walk(self.extracted_path):
            for file in files:
                if pattern.lower() in file.lower() and file.endswith(".csv"):
                    return os.path.join(root, file)
        return ""

    def get_common_buildings(self) -> list:
        """Returns list of building IDs common across electricity, water, and chilledwater (HVAC)."""
        elec_path = self.find_csv_file("electricity")
        water_path = self.find_csv_file("water")
        hvac_path = self.find_csv_file("chilledwater")

        if not elec_path:
            logger.error("Electricity file not found.")
            return []

        # Read only headers
        try:
            elec_cols = set(pd.read_csv(elec_path, nrows=0).columns)
            water_cols = set(pd.read_csv(water_path, nrows=0).columns) if water_path else set()
            hvac_cols = set(pd.read_csv(hvac_path, nrows=0).columns) if hvac_path else set()
            
            common = elec_cols.intersection(water_cols)
            if hvac_cols:
                common = common.intersection(hvac_cols)
            
            # Remove timestamp column
            common.discard("timestamp")
            return sorted(list(common))
        except Exception as e:
            logger.error(f"Error finding common buildings: {e}")
            return []

    def load_facility_data(self, building_id: str = None) -> pd.DataFrame:
        """Loads and merges electricity, water, hvac, and weather data for a single building."""
        elec_path = self.find_csv_file("electricity")
        water_path = self.find_csv_file("water")
        hvac_path = self.find_csv_file("chilledwater")
        weather_path = self.find_csv_file("weather")
        metadata_path = self.find_csv_file("metadata")

        if not elec_path:
            raise FileNotFoundError("electricity.csv not found in datasets/extracted")

        if not building_id:
            common = self.get_common_buildings()
            if common:
                # Default to a representative building
                # Let's prefer 'Panther_office_Graham' or first office building if available
                office_buildings = [b for b in common if "office" in b.lower()]
                building_id = office_buildings[0] if office_buildings else common[0]
            else:
                # Fallback to first column in electricity
                cols = pd.read_csv(elec_path, nrows=0).columns.tolist()
                building_id = cols[1] if len(cols) > 1 else ""

        logger.info(f"Loading telemetry data for target building: {building_id}")

        # Load only timestamp and target building column to optimize speed/RAM
        df_elec = pd.read_csv(elec_path, usecols=["timestamp", building_id])
        df_elec.rename(columns={building_id: "electricity"}, inplace=True)

        # Merge water if available
        if water_path:
            try:
                water_cols = pd.read_csv(water_path, nrows=0).columns
                if building_id in water_cols:
                    df_water = pd.read_csv(water_path, usecols=["timestamp", building_id])
                    df_water.rename(columns={building_id: "water"}, inplace=True)
                    df_elec = pd.merge(df_elec, df_water, on="timestamp", how="left")
            except Exception as e:
                logger.warning(f"Failed to merge water data: {e}")

        # Merge hvac if available
        if hvac_path:
            try:
                hvac_cols = pd.read_csv(hvac_path, nrows=0).columns
                if building_id in hvac_cols:
                    df_hvac = pd.read_csv(hvac_path, usecols=["timestamp", building_id])
                    df_hvac.rename(columns={building_id: "hvac"}, inplace=True)
                    df_elec = pd.merge(df_elec, df_hvac, on="timestamp", how="left")
            except Exception as e:
                logger.warning(f"Failed to merge hvac data: {e}")

        # Ensure columns exist (with NaN fallback if missing)
        if "water" not in df_elec.columns:
            df_elec["water"] = pd.NA
        if "hvac" not in df_elec.columns:
            df_elec["hvac"] = pd.NA

        # Merge weather if available
        if weather_path:
            try:
                df_weather = pd.read_csv(weather_path)
                # Filter weather by site_id if available in metadata
                site_id = building_id.split('_')[0] if '_' in building_id else "Panther"
                df_site_weather = df_weather[df_weather["site_id"] == site_id].copy()
                if not df_site_weather.empty:
                    df_site_weather.drop(columns=["site_id"], inplace=True, errors="ignore")
                    df_elec = pd.merge(df_elec, df_site_weather, on="timestamp", how="left")
            except Exception as e:
                logger.warning(f"Failed to merge weather data: {e}")

        # Attach building metadata to the dataframe attributes
        if metadata_path:
            try:
                df_meta = pd.read_csv(metadata_path)
                building_meta = df_meta[df_meta["building_id"] == building_id]
                if not building_meta.empty:
                    df_elec.attrs["metadata"] = building_meta.iloc[0].to_dict()
                else:
                    df_elec.attrs["metadata"] = {"building_id": building_id}
            except Exception as e:
                logger.warning(f"Failed to load metadata: {e}")
                df_elec.attrs["metadata"] = {"building_id": building_id}
        else:
            df_elec.attrs["metadata"] = {"building_id": building_id}

        return df_elec

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    loader = DatasetLoader()
    common_b = loader.get_common_buildings()
    print("Common buildings count:", len(common_b))
    print("Sample common buildings:", common_b[:5])
    df = loader.load_facility_data()
    print("Dataframe sample:")
    print(df.head())
    print("Metadata:", df.attrs.get("metadata"))

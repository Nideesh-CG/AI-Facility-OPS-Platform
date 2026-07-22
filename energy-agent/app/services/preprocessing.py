import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("energy_agent")

class DataPreprocessor:
    def __init__(self):
        pass

    def preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        """Cleans and aligns the raw merged dataset."""
        logger.info("Starting dataset preprocessing...")
        
        # 1. Copy to avoid modifying original
        df_clean = df.copy()

        # 2. Fix timestamps
        df_clean["timestamp"] = pd.to_datetime(df_clean["timestamp"])
        df_clean.sort_values("timestamp", inplace=True)
        df_clean.drop_duplicates(subset=["timestamp"], inplace=True)
        df_clean.reset_index(drop=True, inplace=True)

        # 3. Clean invalid readings (e.g. negative readings to NaN)
        for col in ["electricity", "water", "hvac"]:
            if col in df_clean.columns:
                # Count negative values to log
                neg_count = (df_clean[col] < 0).sum()
                if neg_count > 0:
                    logger.warning(f"Found {neg_count} negative values in {col}. Setting to NaN.")
                    df_clean.loc[df_clean[col] < 0, col] = np.nan

        # 4. Interpolate missing values
        # Numeric columns list
        num_cols = df_clean.select_dtypes(include=[np.number]).columns.tolist()
        
        # Linearly interpolate missing values for time series continuity
        df_clean[num_cols] = df_clean[num_cols].interpolate(method="linear", limit_direction="both")
        
        # If any NaNs remain (e.g., at edges), forward/backward fill them
        df_clean[num_cols] = df_clean[num_cols].ffill().bfill()
        
        # Fill any completely empty/all-NaN columns with 0
        df_clean.fillna(0, inplace=True)

        logger.info("Preprocessing complete. Data shape: %s", df_clean.shape)
        
        # Preserve original df metadata attributes
        if hasattr(df, "attrs"):
            df_clean.attrs = df.attrs

        return df_clean

if __name__ == "__main__":
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from dataset_loader import DatasetLoader
    
    logging.basicConfig(level=logging.INFO)
    loader = DatasetLoader()
    df_raw = loader.load_facility_data()
    preprocessor = DataPreprocessor()
    df_clean = preprocessor.preprocess(df_raw)
    print("Preprocessed columns:", df_clean.columns.tolist())
    print("Null count:\n", df_clean.isnull().sum())

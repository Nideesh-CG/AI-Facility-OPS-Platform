import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("energy_agent")

class ConsumptionService:
    def __init__(self):
        # Default conversion factors
        self.carbon_intensity_factor = 0.40  # kg CO2 per kWh
        self.peak_tariff = 0.15              # USD per kWh (08:00 - 18:00 weekdays)
        self.off_peak_tariff = 0.08          # USD per kWh

    def calculate_cost(self, row, peak_tariff=None, off_peak_tariff=None) -> float:
        """Calculates energy cost based on peak vs off-peak rates."""
        hour = row["timestamp"].hour
        weekday = row["timestamp"].weekday()
        is_weekend = weekday >= 5
        
        p_rate = peak_tariff if peak_tariff is not None else self.peak_tariff
        o_rate = off_peak_tariff if off_peak_tariff is not None else self.off_peak_tariff
        
        # Peak: 08:00 to 18:00 on weekdays
        if 8 <= hour <= 18 and not is_weekend:
            return float(row["electricity"] * p_rate)
        else:
            return float(row["electricity"] * o_rate)

    def analyze_consumption(self, df: pd.DataFrame, peak_tariff=None, off_peak_tariff=None) -> dict:
        """Computes current, aggregate, and intensity metrics for the facility."""
        logger.info("Analyzing consumption metrics...")
        
        if df.empty:
            return {}

        # Get metadata
        meta = df.attrs.get("metadata", {})
        sqm = meta.get("sqm", 4000.0)
        if pd.isna(sqm) or sqm <= 0:
            sqm = 4000.0
            
        floors = meta.get("numberoffloors", 3.0)
        if pd.isna(floors) or floors <= 0:
            floors = 3.0

        # Latest record represents 'live' telemetry
        latest_row = df.iloc[-1]
        latest_time = latest_row["timestamp"]
        
        # Current (latest hour) metrics
        current_electricity = float(latest_row["electricity"])
        current_water = float(latest_row["water"]) if "water" in latest_row else 0.0
        current_hvac = float(latest_row["hvac"]) if "hvac" in latest_row else 0.0
        
        # Make sure water and hvac are valid floats
        if pd.isna(current_water): current_water = 0.0
        if pd.isna(current_hvac): current_hvac = 0.0

        # Calculated fields for latest row
        current_carbon = current_electricity * self.carbon_intensity_factor
        current_cost = self.calculate_cost(latest_row, peak_tariff, off_peak_tariff)

        # Baseline & Base Load / Peak Load over the last 30 days (720 hours)
        recent_df = df.iloc[-720:] if len(df) > 720 else df
        
        peak_load = float(recent_df["electricity"].max())
        # Base load estimated as the 10th percentile of electricity consumption (minimum standby load)
        base_load = float(recent_df["electricity"].quantile(0.10))
        
        # Cumulative consumption aggregates
        # Today (last 24 hours)
        today_df = df.iloc[-24:] if len(df) > 24 else df
        today_electricity = float(today_df["electricity"].sum())
        today_water = float(today_df["water"].sum()) if "water" in today_df.columns else 0.0
        today_hvac = float(today_df["hvac"].sum()) if "hvac" in today_df.columns else 0.0
        
        # Calculate costs and carbon for last 24h
        today_costs = sum(self.calculate_cost(r, peak_tariff, off_peak_tariff) for _, r in today_df.iterrows())
        today_carbon = today_electricity * self.carbon_intensity_factor

        # Weekly (last 168 hours)
        week_df = df.iloc[-168:] if len(df) > 168 else df
        weekly_electricity = float(week_df["electricity"].sum())
        weekly_water = float(week_df["water"].sum()) if "water" in week_df.columns else 0.0
        
        # Monthly (last 720 hours)
        monthly_electricity = float(recent_df["electricity"].sum())
        monthly_water = float(recent_df["water"].sum()) if "water" in recent_df.columns else 0.0
        
        # Energy Intensity (kWh / sqm)
        energy_intensity_monthly = monthly_electricity / sqm

        # Floor consumption breakdown (proportionately distributed based on floor count)
        # Floor 1: 45%, Floor 2: 35%, Floor 3: 20% (or equal split if many floors)
        floor_distribution = {}
        if floors == 3.0:
            pcts = [0.45, 0.35, 0.20]
        else:
            pcts = [1.0 / floors] * int(floors)
            
        for f in range(int(floors)):
            floor_distribution[f"Floor {f+1}"] = {
                "electricity": float(current_electricity * pcts[f % len(pcts)]),
                "water": float(current_water * pcts[f % len(pcts)]),
                "hvac": float(current_hvac * pcts[f % len(pcts)])
            }

        result = {
            "building_id": meta.get("building_id", "Facility-BMS-Node"),
            "timestamp": latest_time.isoformat(),
            "current": {
                "electricity": current_electricity,
                "water": current_water,
                "hvac": current_hvac,
                "carbon": current_carbon,
                "cost": current_cost
            },
            "today": {
                "electricity": today_electricity,
                "water": today_water,
                "hvac": today_hvac,
                "cost": today_costs,
                "carbon": today_carbon
            },
            "weekly": {
                "electricity": weekly_electricity,
                "water": weekly_water
            },
            "monthly": {
                "electricity": monthly_electricity,
                "water": monthly_water
            },
            "peak_load": peak_load,
            "base_load": base_load,
            "energy_intensity_eui": energy_intensity_monthly,
            "floor_breakdown": floor_distribution
        }

        return result

if __name__ == "__main__":
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from dataset_loader import DatasetLoader
    from preprocessing import DataPreprocessor
    
    logging.basicConfig(level=logging.INFO)
    loader = DatasetLoader()
    df_raw = loader.load_facility_data()
    df_clean = DataPreprocessor().preprocess(df_raw)
    
    service = ConsumptionService()
    analysis = service.analyze_consumption(df_clean)
    print("Consumption Analysis:")
    import json
    print(json.dumps(analysis, indent=2))

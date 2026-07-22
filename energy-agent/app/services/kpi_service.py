import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("energy_agent")

class KPIService:
    def __init__(self):
        pass

    def calculate_kpis(self, df: pd.DataFrame, max_carbon: float = 45.0, hvac_cop: float = 4.2) -> dict:
        """Calculates energy score indices, load stats, and percentage trends for display."""
        logger.info("Calculating KPI indexes...")
        
        if df.empty:
            return {}

        # 30 days = 720 hours
        recent_df = df.iloc[-720:] if len(df) > 720 else df
        latest_row = df.iloc[-1]
        
        # Load stats for final stats dictionary
        peak_load = float(recent_df["electricity"].max())
        base_load = float(recent_df["electricity"].quantile(0.10))
        
        current_elec = float(latest_row["electricity"])
        mean_elec_recent = float(recent_df["electricity"].mean())
        std_elec_recent = float(recent_df["electricity"].std())
        if std_elec_recent == 0:
            std_elec_recent = 1.0

        # 1. Energy Score (Higher is better, meaning lower consumption than average)
        # Calculate how many standard deviations current consumption is from mean
        z_score = (current_elec - mean_elec_recent) / std_elec_recent
        # If z_score is negative, current is less than mean (good!). If positive, current is high (bad).
        energy_score = 85.0 - (z_score * 5.0)  # Center around 85
        energy_score = float(max(60.0, min(99.0, energy_score)))

        # 2. HVAC COP and Efficiency Score
        # Outdoor air temperature from sensor data
        temp = float(latest_row["airTemperature"]) if "airTemperature" in latest_row and not pd.isna(latest_row["airTemperature"]) else 22.0
        # Calculate dynamic actual HVAC COP based on ambient temperature
        actual_hvac_cop = 4.3 - (temp - 15.0) * 0.04
        actual_hvac_cop = float(max(2.8, min(4.8, actual_hvac_cop)))
        
        # Efficiency score depends on how close we are to our configured COP target
        cop_ratio = actual_hvac_cop / hvac_cop if hvac_cop > 0 else 1.0
        if cop_ratio >= 1.0:
            efficiency_score = 90.0 + (cop_ratio - 1.0) * 20.0
        else:
            # Drops significantly if target is missed
            efficiency_score = 90.0 - (1.0 - cop_ratio) * 150.0
        efficiency_score = float(max(10.0, min(99.0, efficiency_score)))

        # 3. Carbon Score
        monthly_electricity = float(recent_df["electricity"].sum())
        monthly_carbon_tons = monthly_electricity * 0.40 / 1000
        
        carbon_ratio = monthly_carbon_tons / max_carbon if max_carbon > 0 else 1.0
        if carbon_ratio <= 1.0:
            carbon_score = 92.0 + (1.0 - carbon_ratio) * 7.0
        else:
            carbon_score = 92.0 - (carbon_ratio - 1.0) * 120.0
        carbon_score = float(max(10.0, min(99.0, carbon_score)))

        # 4. Utility Score
        # Cost-efficiency metric
        utility_score = 88.0 - (z_score * 3.0)
        utility_score = float(max(70.0, min(97.0, utility_score)))

        # 5. Consumption Trend (vs same hour yesterday)
        # Comparing the latest hour to 24 hours ago
        electricity_trend = "0.0%"
        electricity_trend_type = "neutral"
        if len(df) > 24:
            val_now = float(df.iloc[-1]["electricity"])
            val_yesterday = float(df.iloc[-25]["electricity"])
            if val_yesterday > 0:
                diff_pct = ((val_now - val_yesterday) / val_yesterday) * 100
                electricity_trend = f"{diff_pct:+.1f}%"
                electricity_trend_type = "good" if diff_pct < 0 else "bad"

        # Today's cost trend
        cost_trend = "0.0%"
        cost_trend_type = "neutral"
        if len(df) > 48:
            # Last 24 hours vs previous 24 hours
            val_now = float(df["electricity"].iloc[-24:].sum())
            val_prev = float(df["electricity"].iloc[-48:-24].sum())
            if val_prev > 0:
                diff_pct = ((val_now - val_prev) / val_prev) * 100
                cost_trend = f"{diff_pct:+.1f}%"
                cost_trend_type = "good" if diff_pct < 0 else "bad"

        result = {
            "energy_score": round(energy_score, 1),
            "efficiency_score": round(efficiency_score, 1),
            "carbon_score": round(carbon_score, 1),
            "utility_score": round(utility_score, 1),
            "hvac_cop": round(actual_hvac_cop, 2),
            "trends": {
                "electricity": {
                    "value": electricity_trend,
                    "type": electricity_trend_type
                },
                "cost": {
                    "value": cost_trend,
                    "type": cost_trend_type
                }
            },
            "stats": {
                "peak_demand_kw": round(peak_load, 1),
                "average_load_kw": round(mean_elec_recent, 1),
                "base_load_kw": round(base_load, 1)
            }
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
    
    service = KPIService()
    kpi = service.calculate_kpis(df_clean)
    print("Calculated KPIs:")
    import json
    print(json.dumps(kpi, indent=2))

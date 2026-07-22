import pandas as pd
import logging

logger = logging.getLogger("energy_agent")

class RecommendationService:
    def __init__(self):
        pass

    def generate_recommendations(self, df: pd.DataFrame, max_carbon: float = 45.0, hvac_cop: float = 4.2) -> list:
        """Evaluates telemetry data against optimization rules to trigger actionable recommendations."""
        logger.info("Generating optimization recommendations...")
        
        if df.empty:
            return []

        latest_row = df.iloc[-1]
        hour = int(latest_row["hour"])
        is_weekend = int(latest_row["is_weekend"])
        electricity = float(latest_row["electricity"])
        
        # Safe float checks
        water = float(latest_row["water"]) if "water" in latest_row and not pd.isna(latest_row["water"]) else 0.0
        hvac = float(latest_row["hvac"]) if "hvac" in latest_row and not pd.isna(latest_row["hvac"]) else 0.0

        # Dynamic HVAC COP computation
        temp = float(latest_row["airTemperature"]) if "airTemperature" in latest_row and not pd.isna(latest_row["airTemperature"]) else 22.0
        actual_hvac_cop = 4.3 - (temp - 15.0) * 0.04
        actual_hvac_cop = float(max(2.8, min(4.8, actual_hvac_cop)))

        recommendations = []

        # Rule 1: High HVAC ratio
        if electricity > 0 and (hvac / electricity) > 0.45:
            recommendations.append({
                "id": "REC-HVAC-01",
                "category": "HVAC",
                "title": "High HVAC Cooling Load Detected",
                "reason": f"HVAC chiller units represent {hvac/electricity*100:.1f}% of total building power draw.",
                "suggestedAction": "Increase zone setpoints by 2°C and verify return air temperature offsets.",
                "priority": "High",
                "savings": "$420 / month",
                "carbonSavings": "1.2 Tons CO2 / mo"
            })

        # Rule 2: Night-time idle loading (Off-hours lighting/equipment)
        if (hour >= 21 or hour <= 5) and electricity > 60.0:
            recommendations.append({
                "id": "REC-LIGHT-02",
                "category": "Lighting",
                "title": "Unoccupied Hours Baseload Violation",
                "reason": f"Active power draw remains elevated at {electricity:.1f} kW during unoccupied night hours.",
                "suggestedAction": "Verify sweep lighting schedules and enforce auto-shutdown policies for workstations.",
                "priority": "Medium",
                "savings": "$280 / month",
                "carbonSavings": "0.8 Tons CO2 / mo"
            })

        # Rule 3: Weekend scheduling override
        if is_weekend == 1 and electricity > 50.0:
            recommendations.append({
                "id": "REC-EQUIP-03",
                "category": "Equipment",
                "title": "Unexpected Weekend Equipment Load",
                "reason": f"Weekend base load ({electricity:.1f} kW) exceeds baseline unoccupied standard.",
                "suggestedAction": "Inspect floor scheduling overrides and confirm chiller/air handling unit weekend shutdown cycles.",
                "priority": "High",
                "savings": "$350 / month",
                "carbonSavings": "1.0 Tons CO2 / mo"
            })

        # Rule 4: Water consumption anomaly
        if water > 150.0:
            recommendations.append({
                "id": "REC-WATER-04",
                "category": "Utilities",
                "title": "Abnormal Water Usage Alert",
                "reason": f"Live water telemetry shows an elevated flow rate of {water:.1f} Liters/hour.",
                "suggestedAction": "Inspect main lines for pressure drops indicating potential leaks, and check cooling tower make-up valves.",
                "priority": "High",
                "savings": "$150 / month",
                "carbonSavings": "N/A"
            })

        # Rule 5: HVAC COP threshold check against settings
        hvac_below_target = actual_hvac_cop < hvac_cop
        recommendations.append({
            "id": "REC-MAINT-05",
            "category": "Maintenance",
            "title": "HVAC Chiller Preventive Tuning",
            "reason": f"HVAC coefficient of performance ({actual_hvac_cop:.2f} COP) is below your configured target of {hvac_cop:.2f} COP." if hvac_below_target else f"HVAC COP is stable at {actual_hvac_cop:.2f} (above target threshold {hvac_cop:.2f}).",
            "suggestedAction": "Clean condenser tubes and schedule refrigeration charge verification." if hvac_below_target else "Perform scheduled filter and fan belt wear checks.",
            "priority": "Critical" if hvac_below_target else "Low",
            "savings": "$340 / month" if hvac_below_target else "$110 / month",
            "carbonSavings": "1.0 Tons CO2 / mo" if hvac_below_target else "0.3 Tons CO2 / mo"
        })

        recommendations.append({
            "id": "REC-SOLAR-06",
            "category": "Sustainability",
            "title": "Optimize Peak Shaving Strategy",
            "reason": "Utility peak demand periods are forecast to trigger higher demand charges next week.",
            "suggestedAction": "Adjust automated battery storage dispatch to discharge during peak window (14:00 - 17:00).",
            "priority": "Low",
            "savings": "$180 / month",
            "carbonSavings": "0.5 Tons CO2 / mo"
        })

        # Rule 6: Carbon Emissions Target Breach
        recent_df = df.iloc[-720:] if len(df) > 720 else df
        monthly_electricity = float(recent_df["electricity"].sum())
        monthly_carbon_tons = monthly_electricity * 0.40 / 1000
        if monthly_carbon_tons > max_carbon:
            recommendations.insert(0, {
                "id": "REC-CARBON-01",
                "category": "Sustainability",
                "title": "Carbon Emission Target Exceeded",
                "reason": f"Monthly carbon footprint ({monthly_carbon_tons:.1f} Tons) exceeds your configured target of {max_carbon:.1f} Tons.",
                "suggestedAction": "Enforce strict low-carbon operational profile: dim public lighting by 20% and shift heavy loads to off-peak hours.",
                "priority": "Critical",
                "savings": "$480 / month",
                "carbonSavings": f"{monthly_carbon_tons - max_carbon:.1f} Tons CO2 / mo"
            })

        return recommendations

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
    
    # Let's force a weekend hour to trigger rule 3
    df_clean.loc[df_clean.index[-1], "is_weekend"] = 1
    df_clean.loc[df_clean.index[-1], "hour"] = 22
    df_clean.loc[df_clean.index[-1], "electricity"] = 85.0
    df_clean.loc[df_clean.index[-1], "hvac"] = 45.0
    
    service = RecommendationService()
    recs = service.generate_recommendations(df_clean)
    print(f"Generated {len(recs)} recommendations:")
    for r in recs[:3]:
        print(f"- {r['title']} [{r['priority']}] (Savings: {r['savings']})")

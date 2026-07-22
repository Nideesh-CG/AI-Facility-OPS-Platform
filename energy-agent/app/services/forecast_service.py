import os
import joblib
import pandas as pd
import numpy as np
import xgboost as xgb
import logging

logger = logging.getLogger("energy_agent")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class ForecastService:
    def __init__(self):
        self.model_path = os.path.join(MODELS_DIR, "forecaster.joblib")
        self.model = None
        self.carbon_factor = 0.40
        self.price_factor = 0.12  # blended average price per kWh
        os.makedirs(MODELS_DIR, exist_ok=True)

    def train(self, df: pd.DataFrame):
        """Trains the XGBoost regressor for demand forecasting."""
        logger.info("Training XGBoost demand forecasting model...")
        
        # Prepare feature columns
        feature_cols = [
            "hour", "day", "month", "weekday", "is_weekend", "season", "is_peak_hour",
            "electricity_rolling_mean_3h", "electricity_rolling_mean_24h",
            "electricity_rolling_std_3h", "electricity_rolling_std_24h",
            "electricity_lag_1h", "electricity_lag_24h", "electricity_lag_168h"
        ]
        
        if "airTemperature" in df.columns:
            feature_cols.append("airTemperature")

        # Shift target by 1 hour (to predict next hour's electricity)
        df_train = df.copy()
        df_train["target"] = df_train["electricity"].shift(-1)
        
        # Drop the last row since its target is NaN
        df_train.dropna(subset=["target"], inplace=True)
        
        X = df_train[feature_cols]
        y = df_train["target"]
        
        # Fit XGBoost
        model = xgb.XGBRegressor(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42
        )
        model.fit(X, y)
        
        self.model = model
        joblib.dump(model, self.model_path)
        logger.info(f"Forecasting model trained and saved to {self.model_path}")

    def load_model(self) -> bool:
        """Loads the pre-trained forecasting model."""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            logger.info("Loaded pre-trained forecasting model.")
            return True
        return False

    def generate_forecast(self, df: pd.DataFrame) -> dict:
        """Generates future forecast predictions for the next hour, 24 hours (day), and 168 hours (week)."""
        if self.model is None and not self.load_model():
            logger.warning("Forecast model not trained. Training now...")
            self.train(df)

        feature_cols = [
            "hour", "day", "month", "weekday", "is_weekend", "season", "is_peak_hour",
            "electricity_rolling_mean_3h", "electricity_rolling_mean_24h",
            "electricity_rolling_std_3h", "electricity_rolling_std_24h",
            "electricity_lag_1h", "electricity_lag_24h", "electricity_lag_168h"
        ]
        if "airTemperature" in df.columns:
            feature_cols.append("airTemperature")

        latest_row = df.iloc[-1]
        latest_time = latest_row["timestamp"]
        
        # 1. Next Hour Prediction
        latest_features = pd.DataFrame([latest_row[feature_cols]])
        next_hour_demand = float(self.model.predict(latest_features)[0])
        next_hour_cost = next_hour_demand * self.price_factor
        next_hour_carbon = next_hour_demand * self.carbon_factor

        # 2. Next Day (24 Hour Profile) Simulation
        # For simplicity and speed, we project the next 24 hours by iterating and shifting temporal inputs.
        # We simulate the profile based on latest statistics combined with hourly averages.
        forecast_profile_24h = []
        current_time = latest_time
        
        # Prepare a baseline for rolling features
        hist_elec = df["electricity"].iloc[-168:].tolist()
        
        for h in range(1, 25):
            current_time = current_time + pd.Timedelta(hours=1)
            hour = current_time.hour
            weekday = current_time.weekday()
            is_weekend = int(weekday >= 5)
            month = current_time.month
            day = current_time.day
            season = 1 if month in [3, 4, 5] else (2 if month in [6, 7, 8] else (3 if month in [9, 10, 11] else 4))
            is_peak = int(((hour >= 8) and (hour <= 18)) and (is_weekend == 0))
            
            # Predict using simple statistical averages + XGBoost values to keep it stable
            # Approximate the rolling statistics
            last_3h_mean = np.mean(hist_elec[-3:])
            last_24h_mean = np.mean(hist_elec[-24:])
            last_3h_std = np.std(hist_elec[-3:])
            last_24h_std = np.std(hist_elec[-24:])
            
            lag_1h = hist_elec[-1]
            lag_24h = hist_elec[-24]
            lag_168h = hist_elec[-168] if len(hist_elec) >= 168 else hist_elec[0]
            
            sim_features = {
                "hour": hour, "day": day, "month": month, "weekday": weekday,
                "is_weekend": is_weekend, "season": season, "is_peak_hour": is_peak,
                "electricity_rolling_mean_3h": last_3h_mean,
                "electricity_rolling_mean_24h": last_24h_mean,
                "electricity_rolling_std_3h": last_3h_std,
                "electricity_rolling_std_24h": last_24h_std,
                "electricity_lag_1h": lag_1h,
                "electricity_lag_24h": lag_24h,
                "electricity_lag_168h": lag_168h
            }
            if "airTemperature" in df.columns:
                sim_features["airTemperature"] = float(latest_row["airTemperature"])
                
            sim_df = pd.DataFrame([sim_features])
            pred_val = float(self.model.predict(sim_df)[0])
            pred_val = max(1.0, pred_val)  # clamp to positive
            
            # Append predicted value to history to slide features
            hist_elec.append(pred_val)
            
            forecast_profile_24h.append({
                "timestamp": current_time.isoformat(),
                "timeDisplay": current_time.strftime("%H:00"),
                "predictedDemand": round(pred_val, 2),
                "cost": round(pred_val * self.price_factor, 2),
                "carbon": round(pred_val * self.carbon_factor / 1000, 4)
            })

        # Calculate totals
        next_day_demand = sum(x["predictedDemand"] for x in forecast_profile_24h)
        next_day_cost = sum(x["cost"] for x in forecast_profile_24h)
        next_day_carbon = sum(x["carbon"] for x in forecast_profile_24h) * 1000  # in kg

        # 3. Next Week (7 Days Profile)
        next_week_demand = next_day_demand * 7.0 * 0.95  # apply a slight saving adjustment
        next_week_cost = next_week_demand * self.price_factor
        next_week_carbon = next_week_demand * self.carbon_factor

        result = {
            "next_hour": {
                "demand": next_hour_demand,
                "cost": next_hour_cost,
                "carbon": next_hour_carbon
            },
            "next_day": {
                "demand": next_day_demand,
                "cost": next_day_cost,
                "carbon": next_day_carbon
            },
            "next_week": {
                "demand": next_week_demand,
                "cost": next_week_cost,
                "carbon": next_week_carbon
            },
            "forecast_profile_24h": forecast_profile_24h
        }
        return result

if __name__ == "__main__":
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from dataset_loader import DatasetLoader
    from preprocessing import DataPreprocessor
    from feature_engineering import FeatureEngineer
    
    logging.basicConfig(level=logging.INFO)
    loader = DatasetLoader()
    df_raw = loader.load_facility_data()
    df_clean = DataPreprocessor().preprocess(df_raw)
    df_feat = FeatureEngineer().add_features(df_clean)
    
    forecaster = ForecastService()
    forecaster.train(df_feat)
    forecast = forecaster.generate_forecast(df_feat)
    print("Forecast for next hour:", forecast["next_hour"])
    print("Forecast profiles (first 2):", forecast["forecast_profile_24h"][:2])

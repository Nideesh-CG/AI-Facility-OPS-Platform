import pandas as pd
import numpy as np
import logging

logger = logging.getLogger("energy_agent")

class FeatureEngineer:
    def __init__(self):
        pass

    def add_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Generates ML and statistical features from the preprocessed dataframe."""
        logger.info("Starting feature engineering...")
        df_feat = df.copy()

        # 1. Datetime Features
        df_feat["hour"] = df_feat["timestamp"].dt.hour
        df_feat["day"] = df_feat["timestamp"].dt.day
        df_feat["month"] = df_feat["timestamp"].dt.month
        df_feat["weekday"] = df_feat["timestamp"].dt.weekday
        df_feat["is_weekend"] = (df_feat["weekday"] >= 5).astype(int)
        
        # Season classification (Northern Hemisphere)
        # Spring: 3,4,5; Summer: 6,7,8; Autumn: 9,10,11; Winter: 12,1,2
        df_feat["season"] = df_feat["month"].map(
            lambda m: 1 if m in [3, 4, 5] else (2 if m in [6, 7, 8] else (3 if m in [9, 10, 11] else 4))
        )
        
        # Peak Hour (Standard business peak electricity load: 08:00 - 18:00 on weekdays)
        df_feat["is_peak_hour"] = (((df_feat["hour"] >= 8) & (df_feat["hour"] <= 18)) & (df_feat["is_weekend"] == 0)).astype(int)

        # 2. Rolling Statistics (on Electricity)
        df_feat["electricity_rolling_mean_3h"] = df_feat["electricity"].rolling(window=3, min_periods=1).mean()
        df_feat["electricity_rolling_mean_24h"] = df_feat["electricity"].rolling(window=24, min_periods=1).mean()
        df_feat["electricity_rolling_std_3h"] = df_feat["electricity"].rolling(window=3, min_periods=1).std().fillna(0)
        df_feat["electricity_rolling_std_24h"] = df_feat["electricity"].rolling(window=24, min_periods=1).std().fillna(0)

        # 3. Lag Features
        df_feat["electricity_lag_1h"] = df_feat["electricity"].shift(1)
        df_feat["electricity_lag_24h"] = df_feat["electricity"].shift(24)
        df_feat["electricity_lag_168h"] = df_feat["electricity"].shift(168)  # 1 week ago

        # Fill lag NaNs with mean or current value to ensure no null values are sent to model
        df_feat["electricity_lag_1h"] = df_feat["electricity_lag_1h"].fillna(df_feat["electricity"])
        df_feat["electricity_lag_24h"] = df_feat["electricity_lag_24h"].fillna(df_feat["electricity"])
        df_feat["electricity_lag_168h"] = df_feat["electricity_lag_168h"].fillna(df_feat["electricity"])

        # 4. Aggregations (Rolling sums representing daily, weekly, monthly totals)
        df_feat["daily_consumption"] = df_feat["electricity"].rolling(window=24, min_periods=1).sum()
        df_feat["weekly_consumption"] = df_feat["electricity"].rolling(window=168, min_periods=1).sum()
        # Roughly 30 days = 720 hours
        df_feat["monthly_consumption"] = df_feat["electricity"].rolling(window=720, min_periods=1).sum()

        logger.info("Feature engineering complete. Generated columns: %s", list(df_feat.columns[-10:]))
        
        # Preserve original attributes
        if hasattr(df, "attrs"):
            df_feat.attrs = df.attrs

        return df_feat

if __name__ == "__main__":
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from dataset_loader import DatasetLoader
    from preprocessing import DataPreprocessor
    
    logging.basicConfig(level=logging.INFO)
    loader = DatasetLoader()
    df_raw = loader.load_facility_data()
    preprocessor = DataPreprocessor()
    df_clean = preprocessor.preprocess(df_raw)
    
    engineer = FeatureEngineer()
    df_feat = engineer.add_features(df_clean)
    print("Shape with features:", df_feat.shape)
    print("Features sample (first 5 columns):")
    print(df_feat[["timestamp", "electricity", "hour", "is_weekend", "daily_consumption"]].head())

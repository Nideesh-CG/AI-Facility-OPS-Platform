import os
import joblib
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import logging

logger = logging.getLogger("energy_agent")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class AnomalyDetectionService:
    def __init__(self):
        self.model_path = os.path.join(MODELS_DIR, "anomaly_detector.joblib")
        self.model = None
        os.makedirs(MODELS_DIR, exist_ok=True)

    def train(self, df: pd.DataFrame):
        """Trains the Isolation Forest model on historical features and saves it."""
        logger.info("Training Isolation Forest anomaly detection model...")
        
        # Select features for anomaly detection
        features = ["electricity", "hour", "weekday"]
        if "airTemperature" in df.columns:
            features.append("airTemperature")
            
        X = df[features].copy()
        
        # Fit Isolation Forest
        # contamination represents expected percentage of anomalies in training data (e.g. 2%)
        clf = IsolationForest(n_estimators=100, contamination=0.02, random_state=42)
        clf.fit(X)
        
        # Save model
        self.model = clf
        joblib.dump(clf, self.model_path)
        logger.info(f"Anomaly model trained and saved to {self.model_path}")

    def load_model(self):
        """Loads the pre-trained Isolation Forest model."""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            logger.info("Loaded pre-trained anomaly model.")
            return True
        return False

    def detect_anomalies(self, df: pd.DataFrame) -> list:
        """Runs the anomaly detection engine on the dataset, returning a list of anomalies."""
        logger.info("Detecting anomalies...")
        
        if self.model is None and not self.load_model():
            logger.warning("Anomaly model not trained. Training now...")
            self.train(df)

        features = ["electricity", "hour", "weekday"]
        if "airTemperature" in df.columns:
            features.append("airTemperature")

        X = df[features].copy()
        
        # Isolation Forest prediction: -1 = anomaly, 1 = normal
        scores = self.model.decision_function(X)
        predictions = self.model.predict(X)
        
        # Identify index positions where prediction is -1
        anomaly_indices = np.where(predictions == -1)[0]
        
        anomalies_list = []
        
        # To avoid returning too many historic anomalies, we focus on the last 30 days
        # and limit to the top 20 most critical anomalies (highest anomaly scores)
        recent_cutoff = len(df) - 720 if len(df) > 720 else 0
        
        for idx in anomaly_indices:
            if idx < recent_cutoff:
                continue
                
            row = df.iloc[idx]
            timestamp = row["timestamp"]
            electricity = float(row["electricity"])
            score = float(scores[idx])
            
            # Convert decision score to a confidence percentage (e.g. 70% to 99%)
            # Isolation forest decision score is negative for anomalies (lower is more anomalous)
            confidence = float(min(0.98, max(0.65, 0.5 + abs(score) * 2)))

            # Rule engine to analyze why the anomaly was flagged
            reason = "Abnormal energy usage pattern detected by AI Core."
            severity = "Warning"
            suggested_action = "Inspect primary utility meters and check building sub-panels."
            
            hour = int(row["hour"])
            is_weekend = int(row["is_weekend"])
            
            # Check 1: Off-hours / Night consumption
            if (hour >= 22 or hour <= 5) and is_weekend == 0:
                reason = f"High power draw ({electricity:.1f} kW) during building unoccupied hours."
                severity = "Warning"
                suggested_action = "Verify lighting controls, shutdown idle computers, and check server room cooling cycling."
            
            # Check 2: Weekend abnormal usage
            elif is_weekend == 1:
                reason = f"Unexpected weekend load peak of {electricity:.1f} kW."
                severity = "Warning"
                suggested_action = "Audit scheduled weekend HVAC overrides and verify base load equipment shutdowns."

            # Check 3: Critical spikes (exceeding rolling threshold)
            if "electricity_rolling_mean_24h" in df.columns:
                mean_24h = float(row["electricity_rolling_mean_24h"])
                std_24h = float(row["electricity_rolling_std_24h"]) if "electricity_rolling_std_24h" in row else 0.0
                if electricity > mean_24h + 2.5 * std_24h:
                    reason = f"Critical power consumption spike of {electricity:.1f} kW (exceeded 24h threshold by >2.5 SD)."
                    severity = "Critical"
                    suggested_action = "Immediate inspection required: check main chiller chiller compressor current draw and backup generator start logs."
            
            # Check 4: Unexpected HVAC load compared to weather
            if "hvac" in row and "airTemperature" in row:
                hvac = float(row["hvac"]) if not pd.isna(row["hvac"]) else 0.0
                temp = float(row["airTemperature"])
                if temp < 15.0 and hvac > electricity * 0.5:
                    reason = f"High HVAC cooling load ({hvac:.1f} kW) during cool weather ({temp:.1f}°C)."
                    severity = "Info"
                    suggested_action = "Inspect economizer damper actuators and ensure free cooling mode is engaged."

            anomalies_list.append({
                "id": f"AL-{timestamp.strftime('%y%m%d%H%M')}",
                "timestamp": timestamp.isoformat(),
                "timeDisplay": timestamp.strftime("%b %d, %H:%M"),
                "electricity": electricity,
                "score": score,
                "confidence": round(confidence * 100, 1),
                "severity": severity,
                "reason": reason,
                "action": suggested_action,
                "status": "active"
            })
            
        # Sort anomalies: newest first
        anomalies_list.sort(key=lambda x: x["timestamp"], reverse=True)
        return anomalies_list[:20]  # Return top 20 recent anomalies

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
    
    detector = AnomalyDetectionService()
    detector.train(df_feat)
    anomalies = detector.detect_anomalies(df_feat)
    print(f"Detected {len(anomalies)} anomalies in recent data.")
    if anomalies:
        print("Latest anomaly:")
        print(anomalies[0])

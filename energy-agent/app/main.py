from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os
import sys

# Setup base logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("energy_agent")

# Append energy-agent directory to sys path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.dataset_loader import DatasetLoader
from app.services.preprocessing import DataPreprocessor
from app.services.feature_engineering import FeatureEngineer
from app.services.anomaly_service import AnomalyDetectionService
from app.services.forecast_service import ForecastService
from app.api.energy import router as energy_router

app = FastAPI(
    title="Agentic FacilityOps AI Platform - Energy Agent API",
    description="REST backend service representing Milestone 1: Energy Intelligence analytics core.",
    version="1.0.0"
)

# CORS configurations allowing local development integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(energy_router)

@app.get("/health")
async def health_check():
    """Simple status check for container orchestration and uptime alerts."""
    return {
        "status": "healthy",
        "service": "energy-agent",
        "timestamp": os.getenv("CURRENT_TIME", "2026-07-08T19:57:00Z")
    }

@app.on_event("startup")
async def startup_event():
    """Startup initialization: unzips datasets, engineers features, and fits ML pipelines."""
    logger.info("Initializing Energy Agent API service...")
    try:
        # 1. Load Data
        loader = DatasetLoader()
        df_raw = loader.load_facility_data()
        
        # 2. Preprocess Time-Series
        preprocessor = DataPreprocessor()
        df_clean = preprocessor.preprocess(df_raw)
        
        # 3. Engineer ML Features
        engineer = FeatureEngineer()
        df_feat = engineer.add_features(df_clean)
        
        # Store processed dataframe in app context state for quick routing lookups
        app.state.df = df_feat
        app.state.metadata = df_raw.attrs.get("metadata", {})
        
        # 4. Initialize and fit Anomaly Detection model (Isolation Forest)
        anomaly_svc = AnomalyDetectionService()
        if not anomaly_svc.load_model():
            logger.info("Anomaly detection model not found. Starting training...")
            anomaly_svc.train(df_feat)
        app.state.anomaly_svc = anomaly_svc
        
        # 5. Initialize and fit Forecasting model (XGBoost)
        forecast_svc = ForecastService()
        if not forecast_svc.load_model():
            logger.info("Forecasting model not found. Starting training...")
            forecast_svc.train(df_feat)
        app.state.forecast_svc = forecast_svc
        
        logger.info("Energy Agent API initialization completed successfully. Ready for requests.")
    except Exception as e:
        logger.error(f"Critical error during service startup sequence: {e}", exc_info=True)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

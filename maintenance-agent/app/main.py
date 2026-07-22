from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.api.maintenance import router as maintenance_router

app = FastAPI(
    title="FacilityOps AI - Maintenance Agent API",
    description="REST backend microservice for Maintenance Agent (Assets, Work Orders, Schedules).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(maintenance_router)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "maintenance-agent", "port": 8001}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)

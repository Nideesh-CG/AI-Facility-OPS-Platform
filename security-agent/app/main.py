from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.api.security import router as security_router

app = FastAPI(
    title="FacilityOps AI - Security Agent API",
    description="REST backend microservice for Security Agent (Security alerts, CCTV feeds, door access control).",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(security_router)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "security-agent", "port": 8003}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8003, reload=True)

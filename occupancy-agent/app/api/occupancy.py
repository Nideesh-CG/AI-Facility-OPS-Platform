from fastapi import APIRouter
from app.services.occupancy_service import OccupancyService

router = APIRouter(prefix="/api/occupancy", tags=["occupancy"])
occ_service = OccupancyService()

@router.get("/status")
async def get_status():
    return {
        "status": "healthy",
        "agent": "Occupancy Agent",
        "kpis": occ_service.get_kpis()
    }

@router.get("/metrics")
async def get_metrics():
    return {
        "kpis": occ_service.get_kpis(),
        "zones": occ_service.get_zones(),
        "hourly": occ_service.get_hourly_trend()
    }

@router.get("/zones")
async def get_zones():
    return {
        "zones": occ_service.get_zones()
    }

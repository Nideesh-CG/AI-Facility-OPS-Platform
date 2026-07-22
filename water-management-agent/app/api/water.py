from fastapi import APIRouter
from app.services.water_service import WaterService

router = APIRouter(prefix="/api/water", tags=["water"])
water_svc = WaterService()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "agent": "Water Management Agent", "summary": water_svc.get_summary()}

@router.get("/meters")
async def get_meters():
    return {"summary": water_svc.get_summary(), "meters": water_svc.get_meters(), "hourly_flow": water_svc.get_flow()}

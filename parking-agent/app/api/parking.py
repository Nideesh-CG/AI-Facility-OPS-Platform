from fastapi import APIRouter
from app.services.parking_service import ParkingService

router = APIRouter(prefix="/api/parking", tags=["parking"])
parking_svc = ParkingService()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "agent": "Parking Agent", "summary": parking_svc.get_summary()}

@router.get("/bays")
async def get_bays():
    return {"summary": parking_svc.get_summary(), "bays": parking_svc.get_bays()}

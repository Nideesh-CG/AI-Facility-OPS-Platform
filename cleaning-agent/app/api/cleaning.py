from fastapi import APIRouter
from app.services.cleaning_service import CleaningService

router = APIRouter(prefix="/api/cleaning", tags=["cleaning"])
cleaning_svc = CleaningService()

@router.get("/status")
async def get_status():
    return {"status": "healthy", "agent": "Cleaning Agent", "summary": cleaning_svc.get_summary()}

@router.get("/zones")
async def get_zones():
    return {"summary": cleaning_svc.get_summary(), "zones": cleaning_svc.get_zones()}

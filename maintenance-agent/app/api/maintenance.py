from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from app.services.maintenance_service import MaintenanceService

router = APIRouter(prefix="/api/maintenance", tags=["maintenance"])
maint_service = MaintenanceService()

@router.get("/status")
async def get_status():
    return {
        "status": "healthy",
        "agent": "Maintenance Agent",
        "summary": maint_service.get_summary()
    }

@router.get("/assets")
async def get_assets():
    return {
        "summary": maint_service.get_summary(),
        "assets": maint_service.get_assets()
    }

@router.get("/work-orders")
async def get_work_orders():
    return {
        "work_orders": maint_service.get_work_orders(),
        "total": len(maint_service.get_work_orders())
    }

@router.post("/work-orders")
async def create_work_order(data: Dict[str, Any]):
    work_order = maint_service.create_work_order(data)
    return {"status": "success", "work_order": work_order}

@router.get("/schedules")
async def get_schedules():
    return {
        "schedules": maint_service.get_schedules()
    }

@router.post("/schedules")
async def create_schedule(data: Dict[str, Any]):
    schedule = maint_service.create_schedule(data)
    return {"status": "success", "schedule": schedule}

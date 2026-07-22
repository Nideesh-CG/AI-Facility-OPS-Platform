from fastapi import APIRouter
from app.services.security_service import SecurityService

router = APIRouter(prefix="/api/security", tags=["security"])
sec_service = SecurityService()

@router.get("/status")
async def get_status():
    return {
        "status": "healthy",
        "agent": "Security Agent",
        "summary": sec_service.get_summary()
    }

@router.get("/alerts")
async def get_alerts():
    return {
        "summary": sec_service.get_summary(),
        "alerts": sec_service.get_alerts()
    }

@router.delete("/alerts/{alert_id}")
async def dismiss_alert(alert_id: str):
    sec_service.dismiss_alert(alert_id)
    return {"status": "dismissed", "id": alert_id}

@router.get("/integrations")
async def get_integrations():
    return {
        "integrations": sec_service.get_integrations()
    }

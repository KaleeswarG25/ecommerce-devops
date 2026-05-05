from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_admin_user

router = APIRouter()

@router.get("/")
async def get_metrics(current_user: dict = Depends(get_current_admin_user)):
    # Basic metrics endpoint - can be expanded with Prometheus metrics
    return {
        "service": "ecommerce-backend",
        "version": "0.1.0",
        "status": "running"
    }
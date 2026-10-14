from fastapi import APIRouter
from app.api.v1 import auth, containers, services, metrics, alerts

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(containers.router, prefix="/containers", tags=["containers"])
api_router.include_router(services.router, prefix="/services", tags=["services"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["metrics"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["alerts"])

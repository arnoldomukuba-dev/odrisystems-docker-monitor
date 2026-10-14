from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.metric import SystemMetric
from app.schemas.metric import SystemMetricOut
from app.services.docker_service import docker_service

router = APIRouter()


@router.get("/system")
async def get_current_system_metrics():
    """Get instant live host system statistics."""
    return docker_service.get_host_system_stats()


@router.get("/history", response_model=List[SystemMetricOut])
async def get_metrics_history(limit: int = 50, db: AsyncSession = Depends(get_db)):
    """Fetch historical metric snapshots from PostgreSQL for plotting graphs."""
    result = await db.execute(select(SystemMetric).order_by(SystemMetric.timestamp.desc()).limit(limit))
    metrics = result.scalars().all()
    return list(reversed(metrics))

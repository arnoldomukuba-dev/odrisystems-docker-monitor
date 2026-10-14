from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.alert import AlertLog
from app.schemas.alert import AlertLogOut

router = APIRouter()


@router.get("", response_model=List[AlertLogOut])
async def list_alerts(limit: int = 50, db: AsyncSession = Depends(get_db)):
    """Retrieve system and service alert log history."""
    result = await db.execute(select(AlertLog).order_by(AlertLog.created_at.desc()).limit(limit))
    return result.scalars().all()

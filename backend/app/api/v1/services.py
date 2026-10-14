from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.service import ServiceCheck
from app.schemas.service import ServiceCheckCreate, ServiceCheckOut

router = APIRouter()


@router.get("", response_model=List[ServiceCheckOut])
async def list_services(db: AsyncSession = Depends(get_db)):
    """List all configured service health monitors."""
    result = await db.execute(select(ServiceCheck).order_by(ServiceCheck.created_at.desc()))
    return result.scalars().all()


@router.post("", response_model=ServiceCheckOut, status_code=status.HTTP_201_CREATED)
async def create_service(service_in: ServiceCheckCreate, db: AsyncSession = Depends(get_db)):
    """Add a new service to monitor."""
    service = ServiceCheck(
        name=service_in.name,
        target_url=service_in.target_url,
        check_type=service_in.check_type,
        interval_seconds=service_in.interval_seconds,
        expected_status_code=service_in.expected_status_code
    )
    db.add(service)
    await db.commit()
    await db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(service_id: UUID, db: AsyncSession = Depends(get_db)):
    """Remove a service monitor."""
    result = await db.execute(select(ServiceCheck).where(ServiceCheck.id == service_id))
    service = result.scalars().first()
    if not service:
        raise HTTPException(status_code=404, detail="Service check not found")
    await db.delete(service)
    await db.commit()

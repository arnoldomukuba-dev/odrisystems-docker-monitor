from pydantic import BaseModel, HttpUrl
from uuid import UUID
from datetime import datetime
from typing import Optional


class ServiceCheckBase(BaseModel):
    name: str
    target_url: str
    check_type: str = "HTTP"  # HTTP, TCP
    interval_seconds: int = 30
    expected_status_code: int = 200


class ServiceCheckCreate(ServiceCheckBase):
    pass


class ServiceCheckOut(ServiceCheckBase):
    id: UUID
    status: str
    last_response_time_ms: Optional[float] = None
    last_check_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class AlertLogOut(BaseModel):
    id: UUID
    severity: str
    target: str
    message: str
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True

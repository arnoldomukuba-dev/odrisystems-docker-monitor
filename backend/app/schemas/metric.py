from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class SystemMetricOut(BaseModel):
    id: UUID
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    disk_percent: float
    active_containers: int
    running_containers: int
    stopped_containers: int
    timestamp: datetime

    class Config:
        from_attributes = True

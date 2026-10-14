import uuid
from datetime import datetime
from sqlalchemy import Column, Float, Integer, DateTime, UUID
from app.core.database import Base


class SystemMetric(Base):
    __tablename__ = "system_metrics"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cpu_percent = Column(Float, nullable=False)
    memory_percent = Column(Float, nullable=False)
    memory_used_mb = Column(Float, nullable=False)
    disk_percent = Column(Float, nullable=False)
    active_containers = Column(Integer, default=0)
    running_containers = Column(Integer, default=0)
    stopped_containers = Column(Integer, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

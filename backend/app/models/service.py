import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, UUID
from app.core.database import Base


class ServiceCheck(Base):
    __tablename__ = "service_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    target_url = Column(String(255), nullable=False)
    check_type = Column(String(20), default="HTTP")  # HTTP, TCP
    interval_seconds = Column(Integer, default=30)
    expected_status_code = Column(Integer, default=200)
    status = Column(String(20), default="UNKNOWN")  # ONLINE, OFFLINE, DEGRADED, UNKNOWN
    last_response_time_ms = Column(Float, nullable=True)
    last_check_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

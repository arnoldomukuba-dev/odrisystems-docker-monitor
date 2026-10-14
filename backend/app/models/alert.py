import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, UUID, Boolean
from app.core.database import Base


class AlertLog(Base):
    __tablename__ = "alert_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    severity = Column(String(20), default="INFO")  # INFO, WARNING, CRITICAL
    target = Column(String(100), nullable=False)
    message = Column(String(255), nullable=False)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

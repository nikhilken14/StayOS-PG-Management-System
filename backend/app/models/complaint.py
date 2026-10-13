from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime

from app.models.base import Base


class Complaint(Base):
    __tablename__ = "complaint"

    id = Column(Integer, primary_key=True, index=True)

    resident_id = Column(Integer, ForeignKey("resident.id"))

    title = Column(String(100), nullable=False)
    description = Column(String(500), nullable=False)

    status = Column(String(20), default="Open")

    created_at = Column(DateTime, default=datetime.utcnow)
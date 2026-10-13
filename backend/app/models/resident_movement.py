from sqlalchemy import Column, Integer, DateTime, String, ForeignKey
from sqlalchemy.sql import func

from app.models.base import Base


class ResidentMovement(Base):
    __tablename__ = "resident_movement"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    resident_id = Column(
        Integer,
        ForeignKey("resident.id"),
        nullable=False
    )

    exit_time = Column(
        DateTime,
        nullable=True
    )

    entry_time = Column(
        DateTime,
        nullable=True
    )

    status = Column(
        String(20),
        default="INSIDE"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )
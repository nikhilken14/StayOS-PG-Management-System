from sqlalchemy import ForeignKey, Column, Integer, String, DateTime
from datetime import datetime

from app.models.base import Base


class Visitor(Base):

    __tablename__ = "visitors"
    owner_id = Column(Integer, ForeignKey("admin.id"), nullable=False, index=True)


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    name = Column(
        String,
        nullable=False
    )


    phone = Column(
        String,
        nullable=False,
        index=True
    )


    reason = Column(
        String,
        nullable=False
    )


    visiting = Column(
        String,
        nullable=False
    )


    check_in = Column(
        DateTime,
        default=datetime.utcnow
    )


    check_out = Column(
        DateTime,
        nullable=True
    )


    status = Column(
        String,
        default="inside"
    )
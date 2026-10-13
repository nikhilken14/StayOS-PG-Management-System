from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from datetime import datetime
from app.models.base import Base


class Admin(Base):
    __tablename__ = "admin"

    id = Column(Integer, primary_key=True)

    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)

    password_hash = Column(String(255), nullable=False)

    security_question = Column(String(255), nullable=False)
    security_answer_hash = Column(String(255), nullable=False)

    role = Column(String(10), nullable=False, default="OWNER")
    owner_id = Column(Integer, ForeignKey("admin.id"), nullable=True)
    full_name = Column(String(150), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    smtp_sender_email = Column(String(100), nullable=True)
    smtp_app_password = Column(String(500), nullable=True)
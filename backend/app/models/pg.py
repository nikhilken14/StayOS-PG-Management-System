from sqlalchemy import ForeignKey, Column, Integer, String
from app.models.base import Base


class PG(Base):
    __tablename__ = "pg"
    owner_id = Column(Integer, ForeignKey("admin.id"), nullable=False, index=True)

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    total_rooms = Column(Integer, nullable=False)
from sqlalchemy import ( Column, Integer, Numeric, ForeignKey, Date)
from app.models.base import Base

class Allocation(Base):
    __tablename__ = "allocation"

    id = Column( Integer, primary_key=True, index=True)

    resident_id = Column( Integer, ForeignKey("resident.id"), nullable=False)

    room_id = Column( Integer, ForeignKey("room.id"), nullable=False)

    deposit = Column( Numeric(10,2), nullable=False)

    monthly_rent = Column( Numeric(10,2), nullable=False)

    joining_date = Column( Date, nullable=False)

    leaving_date = Column( Date, nullable=True)
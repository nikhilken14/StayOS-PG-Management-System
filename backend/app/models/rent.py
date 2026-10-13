from sqlalchemy import ( Column, Integer, Numeric, ForeignKey, UniqueConstraint, Date, String)
from app.models.base import Base

class Rent(Base):
    __tablename__ = "rent"

    __table_args__ = (
        UniqueConstraint(
            "resident_id",
            "month",
            "year",
            name="unique_monthly_rent"
        ),
    )

    id = Column( Integer, primary_key=True, index=True )

    resident_id = Column( Integer, ForeignKey("resident.id"), nullable=False )

    room_id = Column( Integer, ForeignKey("room.id"), nullable=False )

    month = Column( Integer, nullable=False )

    year = Column( Integer, nullable=False )

    rent_amount = Column( Numeric(10, 2), nullable=False )

    generated_date = Column( Date, nullable=False )

    due_date = Column( Date, nullable=False )

    status = Column( String(20), default="Pending" )
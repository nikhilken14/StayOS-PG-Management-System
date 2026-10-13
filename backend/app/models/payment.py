from sqlalchemy import ( Column, Integer, Numeric, ForeignKey, Date)
from app.models.base import Base


class Payment(Base):
    __tablename__ = "payment"

    id = Column( Integer, primary_key=True, index=True)

    resident_id = Column( Integer, ForeignKey("resident.id"), nullable=False)

    rent_id = Column( Integer, ForeignKey("rent.id"), nullable=False)

    amount_paid = Column( Numeric(10,2), nullable=False)

    pay_date = Column( Date, nullable=False)
from sqlalchemy import ( Column, Integer, Numeric, ForeignKey, Date, String )
from app.models.base import Base


class Bill(Base):
    __tablename__ = "bill"

    id = Column( Integer, primary_key=True, index=True )

    pg_id = Column( Integer, ForeignKey("pg.id"), nullable=False )

    bill_date = Column( Date, nullable=False )

    bill_amount = Column( Numeric(10,2), nullable=False )
    
    bill_type = Column( String(50), nullable=False )
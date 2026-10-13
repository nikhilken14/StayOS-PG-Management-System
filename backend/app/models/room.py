from sqlalchemy import ( Column, Integer, ForeignKey, UniqueConstraint, Numeric )
from app.models.base import Base


class Room(Base):
    __tablename__ = "room"

    __table_args__ = (  UniqueConstraint(
            "pg_id",
            "room_number",
            name="unique_room_number_per_pg"
        ),
    )

    id = Column( Integer, primary_key=True, index=True)

    pg_id = Column( Integer, ForeignKey( "pg.id", ondelete="CASCADE" ), nullable=False)

    room_number = Column( Integer, nullable=False)

    capacity = Column( Integer, nullable=False)

    rent_amount = Column( Numeric( 10, 2), nullable=False)
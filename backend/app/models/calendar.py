from sqlalchemy import ForeignKey, Column, Integer, Date, Text
from app.models.base import Base


class CalendarMemo(Base):
    __tablename__ = "calendar_memo"
    owner_id = Column(Integer, ForeignKey("admin.id"), nullable=False, index=True)

    id = Column(Integer, primary_key=True, index=True)

    memo_date = Column(Date, nullable=False)

    description = Column(Text, nullable=False)
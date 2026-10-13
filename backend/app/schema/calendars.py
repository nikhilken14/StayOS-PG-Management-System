from pydantic import BaseModel
from datetime import date


class CalendarMemoCreate(BaseModel):

    memo_date: date
    description: str


class CalendarMemoUpdate(BaseModel):

    memo_date: date
    description: str
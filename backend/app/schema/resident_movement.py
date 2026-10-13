from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ResidentExitRequest(BaseModel):
    resident_id: int


class ResidentEntryRequest(BaseModel):
    resident_id: int


class ResidentMovementResponse(BaseModel):

    id: int
    resident_id: int
    exit_time: Optional[datetime]
    entry_time: Optional[datetime]
    status: str

    class Config:
        from_attributes = True
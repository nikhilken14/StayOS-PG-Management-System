from pydantic import BaseModel, Field
from datetime import date

class AllocationUpload(BaseModel):

    resident_id: int = Field(gt=0)
    room_id: int = Field(gt=0)
    deposit: float = Field(gt=0)
    monthly_rent: float = Field(gt=0)
    joining_date: date
    leaving_date: date | None = None
from pydantic import BaseModel
from datetime import datetime


class VisitorCreate(BaseModel):

    name: str
    phone: str
    reason: str
    visiting: str



class VisitorCheckout(BaseModel):

    phone: str



class VisitorResponse(BaseModel):

    id: int
    name: str
    phone: str
    reason: str
    visiting: str
    check_in: datetime
    check_out: datetime | None
    status: str

    class Config:
        from_attributes = True
from pydantic import BaseModel


class ComplaintCreate(BaseModel):
    resident_id: int
    title: str
    description: str


class ComplaintUpdate(BaseModel):
    title: str
    description: str


class ComplaintStatusUpdate(BaseModel):
    status: str
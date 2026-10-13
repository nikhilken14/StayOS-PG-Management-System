from pydantic import BaseModel, Field
from datetime import date

class BillUpload(BaseModel):

    pg_id: int = Field(gt=0)
    bill_date: date
    bill_amount: float = Field( gt=0, le=10000000 )
    bill_type: str
from pydantic import BaseModel, Field
from datetime import date


class PaymentUpload(BaseModel):

    resident_id: int = Field(gt=0)

    amount_paid: float = Field(
        gt=0,
        le=1000000
    )

    payment_date: date
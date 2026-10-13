from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.payment_service import *
from app.schema.payments import *

router = APIRouter(
    prefix="/payment",
    tags=["Payment"]
)

@router.post("/")
def create_payment(
    request: PaymentUpload,
    db: Session = Depends(get_db)
):
    return add_payment(db, request)

@router.get("/status/{rent_id}")
def payment_status(rent_id: int, db: Session = Depends(get_db)):
    return get_payment_status(db, rent_id)

@router.get("/due/{resident_id}")
def due_rent(resident_id: int, db: Session = Depends(get_db)):
    return calculate_due_rent(db, resident_id)
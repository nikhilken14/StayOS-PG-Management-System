from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.rent_service import *
from app.schema.rents import *

router = APIRouter(
    prefix="/rent",
    tags=["Rent"]
)

@router.post("/generate")
def generate( request: GenerateRentRequest, db: Session = Depends(get_db)):
    return generate_rent( db, request )

@router.get("/status/{rent_id}")
def rent_status( rent_id: int, db: Session = Depends(get_db)):
    return get_rent_status( db, rent_id )

@router.get("/history/{resident_id}")
def history( resident_id: int, db: Session = Depends(get_db)):
    return rent_history( db, resident_id )

@router.get("/due/{resident_id}")
def due( resident_id: int, db: Session = Depends(get_db)):
    return resident_due( db, resident_id )

@router.get("/collection")
def collection( db: Session = Depends(get_db)):
    return rent_collection(db)
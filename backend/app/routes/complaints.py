from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schema.complaints import *
from app.services.complaint_service import *

router = APIRouter(
    prefix="/complaint",
    tags=["Complaint"]
)

@router.post("/create")
def create(
    request: ComplaintCreate,
    db: Session = Depends(get_db)
):
    return create_complaint(db, request)

@router.put("/update/{complaint_id}")
def update(
    complaint_id: int,
    request: ComplaintUpdate,
    db: Session = Depends(get_db)
):
    return update_complaint(db, complaint_id, request)

@router.get("/list")
def list_complaints(
    db: Session = Depends(get_db)
):
    return get_complaints(db)

@router.get("/resident/{resident_id}")
def resident_complaints(
    resident_id: int,
    db: Session = Depends(get_db)
):
    return get_resident_complaints(db, resident_id)

@router.put("/status/{complaint_id}")
def update_status(
    complaint_id: int,
    request: ComplaintStatusUpdate,
    db: Session = Depends(get_db)
):
    return update_complaint_status(db, complaint_id, request)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db

from app.schema.allocations import AllocationUpload
from app.services.allocation_service import *

router = APIRouter(
    prefix="/allocation",
    tags=["Allocation"]
)


@router.post("/upload")
def allocation_upload( request: AllocationUpload, db: Session = Depends(get_db)):
    return allocate_bed(db, request)


@router.put("/vacate/{resident_id}")
def vacate(resident_id: int,db: Session = Depends(get_db)):
    return vacate_bed(db, resident_id)


@router.get("/occupancy/{room_id}")
def occupancy( room_id: int, db: Session = Depends(get_db)):
    return room_occupancy(db, room_id)


@router.get("/list")
def allocation_list_api( db: Session = Depends(get_db)):
    return allocation_list(db)
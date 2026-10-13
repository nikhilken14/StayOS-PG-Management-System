from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schema.rooms import RoomCreate, RoomUpdate
from app.services.room_service import *

router = APIRouter(
    prefix="/room",
    tags=["Room"]
)


@router.post("/add")
def create_room(
    request: RoomCreate,
    db: Session = Depends(get_db)
):
    return add_room(db, request)


@router.put("/edit/{room_id}")
def update_room(
    room_id: int,
    request: RoomUpdate,
    db: Session = Depends(get_db)
):
    return edit_room(db, room_id, request)


@router.delete("/delete/{room_id}")
def remove_room(
    room_id: int,
    db: Session = Depends(get_db)
):
    return delete_room(db, room_id)


@router.get("/list")
def room_list(
    db: Session = Depends(get_db)
):
    return get_room_list(db)


@router.get("/availability")
def room_availability(
    db: Session = Depends(get_db)
):
    return get_room_availability(db)
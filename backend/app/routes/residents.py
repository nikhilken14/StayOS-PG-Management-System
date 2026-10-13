from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schema.residents import *
from app.services.resident_service import *

router = APIRouter(prefix="/resident", tags=["Resident"])


@router.post("/add")
def create_resident(
    request: ResidentCreate,
    db: Session = Depends(get_db)
):
    return add_resident(db, request)


@router.get("/all")
def get_list(db: Session = Depends(get_db)):
    return get_all(db)


@router.get("/search")
def search(
    keyword: str,
    db: Session = Depends(get_db)
):
    return search_resident(db, keyword)


@router.get("/status/{status}")
def get_status(
    status: str,
    db: Session = Depends(get_db)
):
    return get_by_status(db, status)


@router.put("/update/{id}")
def update_details(
    id: int,
    request: ResidentUpdate,
    db: Session = Depends(get_db)
):
    return update_resident(db, id, request)


@router.delete("/delete/{id}")
def remove_resident(
    id: int,
    db: Session = Depends(get_db)
):
    return delete_resident(db, id)


@router.get("/{id}")
def resident_details(
    id: int,
    db: Session = Depends(get_db)
):
    return get_resident_details(db, id)
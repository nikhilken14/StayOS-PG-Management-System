from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schema.pgs import PGUpload
from app.services.pg_service import *

router = APIRouter(prefix="/pg", tags=["PG"])

@router.post("/upload")
def pg_upload(request: PGUpload, db: Session = Depends(get_db)):
    return upload_pg(db, request)

@router.get("/list")
def get_list(db: Session = Depends(get_db)):
    return get_pg_list(db)

@router.delete("/delete/{id}")
def pg_delete(id: int, db: Session = Depends(get_db)):
    return delete_pg(db,id)
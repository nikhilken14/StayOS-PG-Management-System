from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

from app.config.database import get_db
from app.schema.calendars import (
    CalendarMemoCreate,
    CalendarMemoUpdate
)
from app.services.calendar_service import (
    create_memo,
    get_memos_by_date,
    update_memo,
    delete_memo,
    delete_all
)

router = APIRouter(
    prefix="/calendar",
    tags=["Calendar Memo"]
)


@router.post("/memo")
def create_memo_api(
    request: CalendarMemoCreate,
    db: Session = Depends(get_db)
):
    return create_memo(db, request)


@router.get("/memo/{memo_date}")
def get_memo_by_date_api(
    memo_date: date,
    db: Session = Depends(get_db)
):
    return get_memos_by_date(db, memo_date)


@router.put("/memo/{memo_id}")
def update_memo_api(
    memo_id: int,
    request: CalendarMemoUpdate,
    db: Session = Depends(get_db)
):
    return update_memo(
        db,
        memo_id,
        request
    )


@router.delete("/memo/{memo_id}")
def delete_memo_api(
    memo_id: int,
    db: Session = Depends(get_db)
):
    return delete_memo(
        db,
        memo_id
    )

@router.delete("/memo/date/{memo_date}")
def delete_all_memo(
    memo_date: date,
    db: Session = Depends(get_db)
):
    return delete_all(
        db,
        memo_date
    )
from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.report_service import *


router = APIRouter(
    prefix="/report",
    tags=["Reports"]
)



@router.get("/monthly/{year}/{month}")
def monthly_report(
    year:int = Path(ge=2000, le=2100),
    month:int = Path(ge=1, le=12),
    db:Session = Depends(get_db)
):

    return get_monthly_report(
        db,
        year,
        month
    )



@router.get("/monthly/{year}/{month}/pdf")
def monthly_pdf(
    year:int = Path(ge=2000, le=2100),
    month:int = Path(ge=1, le=12),
    db:Session = Depends(get_db)
):

    return generate_monthly_report_pdf(
        db,
        year,
        month
    )




@router.get("/yearly/{year}")
def yearly_report(
    year:int = Path(ge=2000, le=2100),
    db:Session = Depends(get_db)
):

    return get_yearly_report(
        db,
        year
    )



@router.get("/yearly/{year}/pdf")
def yearly_pdf(
    year:int = Path(ge=2000, le=2100),
    db:Session = Depends(get_db)
):

    return generate_report_pdf(
        db,
        year
    )

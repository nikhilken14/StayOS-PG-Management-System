from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.services.bill_service import (
    get_total_bill,
    get_all_bills,
    upload_bill
)

from app.schema.bills import BillUpload


router = APIRouter(
    prefix="/bill",
    tags=["Bill"]
)



@router.get("/total")
def bill_total_api(
    db:Session=Depends(get_db)
):

    return get_total_bill(db)





@router.get("/list")
def bill_list_api(
    db:Session=Depends(get_db)
):

    return get_all_bills(db)






@router.post("/upload")
def bill_upload(
    request:BillUpload,
    db:Session=Depends(get_db)
):

    return upload_bill(
        db,
        request
    )
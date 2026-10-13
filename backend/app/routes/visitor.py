from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.schema.visitor import (
    VisitorCreate,
    VisitorCheckout
)

from app.services.visitor_service import (
    create_visitor,
    checkout_visitor,
    get_all_visitors,
    get_inside_visitors
)


router = APIRouter( prefix="/visitor", tags=["Visitor"])

@router.post("/check-in")
def check_in(   data: VisitorCreate,    db: Session = Depends(get_db)):
    visitor = create_visitor( db, data)

    return {
        "message":"Visitor checked in",
        "visitor":visitor
    }

@router.put("/check-out")
def check_out(  data: VisitorCheckout, db: Session = Depends(get_db)):
    visitor = checkout_visitor( db, data.phone)

    if not visitor:
        raise HTTPException( status_code=404,detail="Active visitor not found")


    return {
        "message":"Visitor checked out",
        "visitor":visitor
    }


@router.get("/list")
def visitors(   db:Session=Depends(get_db)):
    return get_all_visitors(db)


@router.get("/inside")
def inside_visitors( db:Session=Depends(get_db)):
    return get_inside_visitors(db)
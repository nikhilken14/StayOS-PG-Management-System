from decimal import Decimal
from sqlalchemy import func
from app.models.bill import Bill
from app.models.pg import PG



ALLOWED_BILL_TYPES = {
    "Electricity",
    "Water",
    "Wifi",
    "Maintenance"
}


def get_total_bill(db):

    total = (
        db.query(
            func.sum(Bill.bill_amount)
        )
        .scalar()
        or 0
    )

    electricity = (
        db.query(
            func.sum(Bill.bill_amount)
        )
        .filter(
            Bill.bill_type=="Electricity"
        )
        .scalar()
        or 0
    )

    water = (
        db.query(
            func.sum(Bill.bill_amount)
        )
        .filter(
            Bill.bill_type=="Water"
        )
        .scalar()
        or 0
    )

    wifi = (
        db.query(
            func.sum(Bill.bill_amount)
        )
        .filter(
            Bill.bill_type=="Wifi"
        )
        .scalar()
        or 0
    )

    maintenance = (
        db.query(
            func.sum(Bill.bill_amount)
        )
        .filter(
            Bill.bill_type=="Maintenance"
        )
        .scalar()
        or 0
    )

    return {
        "total": float(total),
        "electricity": float(electricity),
        "water": float(water),
        "wifi": float(wifi),
        "maintenance": float(maintenance)
    }


def upload_bill(db, request):

    pg = (
        db.query(PG)
        .filter(
            PG.id == request.pg_id
        )
        .first()
    )

    if not pg:
        return { "message": "PG record not found" }

    if request.bill_amount <= 0:
        return { "message": "Bill amount must be greater than zero" }

    if request.bill_type not in ALLOWED_BILL_TYPES:
        return {
            "message": "Invalid bill type",
            "allowed_types": list(ALLOWED_BILL_TYPES)
        }

    bill = Bill(
        pg_id=request.pg_id,
        bill_date=request.bill_date,
        bill_amount=Decimal(
            str(request.bill_amount)
        ),
        bill_type=request.bill_type
    )

    try:
        db.add(bill)
        db.commit()
        db.refresh(bill)

    except Exception as e:
        db.rollback()
        raise e

    return {
        "message": "Bill uploaded successfully",
        "bill_id": bill.id
    }

def get_all_bills(db):

    bills = (
        db.query(Bill)
        .order_by(
            Bill.id.desc()
        )
        .all()
    )


    return [

        {
            "id": bill.id,
            "pg_id": bill.pg_id,
            "bill_type": bill.bill_type,
            "bill_amount": float(
                bill.bill_amount
            ),
            "bill_date": str(
                bill.bill_date
            )
        }

        for bill in bills

    ]
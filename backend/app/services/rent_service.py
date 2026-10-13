from datetime import date
from sqlalchemy import func
from app.models.rent import Rent
from app.models.payment import Payment
from app.models.allocation import Allocation

def generate_rent(db, request):

    allocations = (
        db.query(Allocation)
        .filter(
            Allocation.leaving_date == None
        )
        .all()
    )

    generated_count = 0

    for allocation in allocations:

        existing = (
            db.query(Rent)
            .filter(
                Rent.resident_id == allocation.resident_id,
                Rent.month == request.month,
                Rent.year == request.year
            )
            .first()
        )

        if existing:
            continue

        rent = Rent(
            resident_id=allocation.resident_id,
            room_id=allocation.room_id,
            month=request.month,
            year=request.year,
            rent_amount=allocation.monthly_rent,
            generated_date=date.today(),
            due_date=date(
                request.year,
                request.month,
                5
            ),
            status="Pending"
        )

        db.add(rent)

        generated_count += 1

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise

    return {
        "message": "Rent generated successfully",
        "generated_count": generated_count
    }

def get_rent_status(db, rent_id):

    rent = (
        db.query(Rent)
        .filter(
            Rent.id == rent_id
        )
        .first()
    )

    if not rent:

        return {
            "message": "Rent not found"
        }

    paid_amount = (

        db.query(
            func.sum(Payment.amount_paid)
        )

        .filter(
            Payment.rent_id == rent_id
        )

        .scalar()

        or 0
    )

    due_amount = max(
        float(rent.rent_amount) - float(paid_amount),
        0
    )

    if paid_amount == 0:

        status = "Pending"

    elif due_amount > 0:

        status = "Partial"

    else:

        status = "Paid"

    rent.status = status

    db.commit()

    return {

        "rent_id": rent.id,

        "resident_id": rent.resident_id,

        "month": rent.month,

        "year": rent.year,

        "rent_amount": float(rent.rent_amount),

        "paid_amount": float(paid_amount),

        "due_amount": due_amount,

        "status": status

    }

def rent_history(db, resident_id):

    rents = (

        db.query(Rent)

        .filter(
            Rent.resident_id == resident_id
        )

        .order_by(
            Rent.year.desc(),
            Rent.month.desc()
        )

        .all()

    )

    result = []

    for rent in rents:

        paid = (

            db.query(
                func.sum(Payment.amount_paid)
            )

            .filter(
                Payment.rent_id == rent.id
            )

            .scalar()

            or 0

        )

        result.append({

            "rent_id": rent.id,

            "month": rent.month,

            "year": rent.year,

            "rent_amount": float(rent.rent_amount),

            "paid_amount": float(paid),

            "due_amount":
            float(rent.rent_amount) - float(paid),

            "status": rent.status

        })

    return result

def resident_due(db, resident_id):

    rents = (

        db.query(Rent)

        .filter(
            Rent.resident_id == resident_id
        )

        .all()

    )

    total_due = 0

    for rent in rents:

        paid = (

            db.query(
                func.sum(Payment.amount_paid)
            )

            .filter(
                Payment.rent_id == rent.id
            )

            .scalar()

            or 0

        )

        total_due += max(
            float(rent.rent_amount) - float(paid),
            0
        )

    return {

        "resident_id": resident_id,

        "total_due": total_due

    }

def rent_collection(db):

    expected = (
        db.query(
            func.sum(Rent.rent_amount)
        )
        .scalar()
        or 0
    )

    collected = (
        db.query(
            func.sum(Payment.amount_paid)
        )
        .scalar()
        or 0
    )

    return {

        "expected_rent":
        float(expected),

        "collected":
        float(collected),

        "pending":
        float(expected) - float(collected)

    }
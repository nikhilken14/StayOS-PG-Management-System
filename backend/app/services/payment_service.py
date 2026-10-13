from decimal import Decimal
from sqlalchemy import func
from app.models.payment import Payment
from app.models.rent import Rent

def add_payment(db, request):

    rent = (
        db.query(Rent)
        .filter(
            Rent.resident_id == request.resident_id,
            Rent.status == "Pending"
        )
        .order_by(
            Rent.year.desc(),
            Rent.month.desc()
        )
        .first()
    )


    if not rent:
        return {
            "message": "No pending rent found"
        }


    already_paid = (
        db.query(
            func.sum(Payment.amount_paid)
        )
        .filter(
            Payment.rent_id == rent.id
        )
        .scalar()
        or Decimal("0")
    )


    rent_amount = Decimal(str(rent.rent_amount))

    payment_amount = Decimal(
        str(request.amount_paid)
    )


    pending_amount = rent_amount - already_paid


    if payment_amount > pending_amount:
        return {
            "message": "Payment exceeds pending amount",
            "pending_amount": float(pending_amount)
        }


    payment = Payment(
        resident_id=request.resident_id,
        rent_id=rent.id,
        amount_paid=payment_amount,
        pay_date=request.payment_date
    )


    db.add(payment)


    # update rent status
    if payment_amount == pending_amount:
        rent.status = "Paid"


    try:
        db.commit()
        db.refresh(payment)

    except Exception as e:
        db.rollback()
        raise e


    return {
        "message": "Payment recorded successfully",
        "payment_id": payment.id,
        "rent_id": rent.id,
        "paid_amount": float(payment_amount),
        "remaining": float(
            pending_amount-payment_amount
        )
    }


def get_payment_status(db, rent_id):

    rent = (
        db.query(Rent)
        .filter(
            Rent.id == rent_id
        )
        .first()
    )

    if not rent:
        return { "message": "Rent record not found" }

    total_paid = (
        db.query(
            func.sum(Payment.amount_paid)
        )
        .filter(
            Payment.rent_id == rent_id
        )
        .scalar()
        or Decimal("0")
    )

    rent_amount = Decimal( str(rent.rent_amount))

    due_amount = max( rent_amount - total_paid, Decimal("0"))

    if total_paid == 0:
        status = "Pending"

    elif due_amount > 0:
        status = "Partial"

    else:
        status = "Paid"


    return {
        "rent_id": rent.id,
        "resident_id": rent.resident_id,
        "rent_amount": float(rent_amount),
        "paid_amount": float(total_paid),
        "due_amount": float(due_amount),
        "status": status
    }


def calculate_due_rent(db, resident_id):

    rents = (
        db.query(Rent)
        .filter(
            Rent.resident_id == resident_id
        )
        .all()
    )

    if not rents:
        return { "message": "No rent records found" }

    total_due = Decimal("0")
    rent_details = []

    for rent in rents:
        paid_amount = (
            db.query(
                func.sum(Payment.amount_paid)
            )
            .filter(
                Payment.rent_id == rent.id
            )
            .scalar()
            or Decimal("0")
        )

        rent_amount = Decimal( str(rent.rent_amount))

        due_amount = max( rent_amount - paid_amount, Decimal("0"))

        total_due += due_amount

        rent_details.append({
            "rent_id": rent.id,
            "month": rent.month,
            "year": rent.year,
            "rent_amount": float(rent_amount),
            "paid_amount": float(paid_amount),
            "due_amount": float(due_amount)
        })

    return {
        "resident_id": resident_id,
        "total_due": float(total_due),
        "rent_details": rent_details
    }


def get_payment_history(db, resident_id):

    payments = (
        db.query(Payment)
        .filter(
            Payment.resident_id == resident_id
        )
        .order_by(
            Payment.pay_date.desc()
        )
        .all()
    )

    return [
        {
            "payment_id": payment.id,
            "rent_id": payment.rent_id,
            "amount_paid": float(payment.amount_paid),
            "payment_date": payment.pay_date
        }
        for payment in payments
    ]
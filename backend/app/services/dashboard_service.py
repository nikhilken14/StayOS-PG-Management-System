from sqlalchemy import func
from app.models.payment import Payment
from app.models.resident import Resident
from app.models.room import Room
from app.models.complaint import Complaint
from app.models.pg import PG
from app.models.allocation import Allocation


def get_dashboard_data(db):

    total_collection = db.query(
        func.sum(Payment.amount_paid)
    ).scalar() or 0

    residents = db.query(
        func.count(Resident.id)
    ).scalar() or 0

    rooms = db.query(
        func.count(Room.id)
    ).scalar() or 0

    total_capacity = db.query(
        func.sum(Room.capacity)
    ).scalar() or 0

    occupied = db.query(
        func.count(Allocation.id)
    ).filter(
        Allocation.leaving_date.is_(None)
    ).scalar() or 0

    available_beds = max(total_capacity - occupied, 0)

    complaints = db.query(
        func.count(Complaint.id)
    ).filter(
        Complaint.status.notin_(["Resolved", "Closed"])
    ).scalar() or 0

    pgs = db.query(
        func.count(PG.id)
    ).scalar() or 0

    return {
        "residents": residents,
        "rooms": rooms,
        "totalBeds": total_capacity,
        "occupiedBeds": occupied,
        "availableBeds": available_beds,
        "complaints": complaints,
        "pgs": pgs,
        "collection": total_collection
    }

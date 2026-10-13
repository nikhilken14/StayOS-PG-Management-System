from datetime import date
from decimal import Decimal
from sqlalchemy import func
from app.models.room import Room
from app.models.resident import Resident
from app.models.allocation import Allocation


def allocate_bed(db, request):

    resident = (
        db.query(Resident)
        .filter(
            Resident.id == request.resident_id
        )
        .first()
    )

    if not resident:
        return { "message":"Resident not found"}

    room = (
        db.query(Room)
        .filter(
            Room.id == request.room_id
        )
        .first()
    )

    if not room:
        return { "message":"Room not found"}

    existing = (
        db.query(Allocation)
        .filter(
            Allocation.resident_id == request.resident_id,
            Allocation.leaving_date == None
        )
        .first()
    )

    if existing:
        return { "message": "Resident already allocated"}

    occupied = (
        db.query(
            func.count(Allocation.id)
        )
        .filter(
            Allocation.room_id == request.room_id,
            Allocation.leaving_date == None
        )
        .scalar()
    )

    if occupied >= room.capacity:
        return { "message": "Room is full" }

    if request.deposit < 0 or request.monthly_rent <= 0:
        return { "message": "Invalid rent or deposit amount" }

    if request.leaving_date:
        if request.leaving_date < request.joining_date:
            return { "message": "Leaving date cannot be before joining date" }

    allocation = Allocation(
        resident_id=request.resident_id,
        room_id=request.room_id,
        deposit=Decimal(str(request.deposit)),
        monthly_rent=Decimal(str(request.monthly_rent)),
        joining_date=request.joining_date,
        leaving_date=None
    )

    try:
        db.add(allocation)
        resident.status="Active"
        db.commit()
        db.refresh(allocation)

    except Exception as e:
        db.rollback()
        raise e

    return {
        "message": "Bed allocated successfully",
        "allocation_id": allocation.id
    }


def vacate_bed(db, resident_id):

    allocation = (
        db.query(Allocation)
        .filter(
            Allocation.resident_id == resident_id,
            Allocation.leaving_date == None
        )
        .first()
    )

    if not allocation:
        return { "message": "No active allocation found" }

    allocation.leaving_date=date.today()

    resident = (
        db.query(Resident)
        .filter(
            Resident.id==resident_id
        )
        .first()
    )

    if resident:
        resident.status="Inactive"

    try:
        db.commit()

    except Exception as e:
        db.rollback()
        raise e

    return { "message": "Bed vacated successfully"}


def room_occupancy(db, room_id):

    room = (
        db.query(Room)
        .filter(
            Room.id==room_id
        )
        .first()
    )

    if not room:
        return { "message": "Room not found"}

    occupied = (
        db.query(
            func.count(Allocation.id)
        )
        .filter(
            Allocation.room_id==room_id,
            Allocation.leaving_date==None
        )
        .scalar()
    )

    return {
        "room_id":room.id,
        "room_number":room.room_number,
        "capacity":room.capacity,
        "occupied":occupied,
        "available":room.capacity - occupied
    }


def allocation_list(db):

    allocations = (
        db.query(Allocation)
        .filter(
            Allocation.leaving_date == None
        )
        .all()
    )
    
    return allocations
from sqlalchemy import func, or_
from app.models.room import Room
from app.models.pg import PG
from app.models.allocation import Allocation



def add_room(db, request):

    pg = db.query(PG).filter( PG.id == request.pg_id ).first()

    if not pg:
        return { "message":"PG not found" }

    existing_room = db.query(Room).filter(
                        Room.pg_id == request.pg_id,
                        Room.room_number == request.room_number).first()

    if existing_room:
        return {"message":"Room number already exists in this PG"}

    room = Room(
        pg_id=request.pg_id,
        room_number=request.room_number,
        capacity=request.capacity,
        rent_amount=request.rent_amount
    )

    db.add(room)
    db.commit()
    db.refresh(room)

    return {
        "message":"Room added successfully",
        "room_id": room.id
    }


def edit_room(db, room_id, request):

    room = db.query(Room).filter( Room.id == room_id ).first()

    if not room:
        return { "message":"Room not found"}

    if request.room_number is not None:

        duplicate = db.query(Room).filter(
            Room.pg_id == room.pg_id,
            Room.room_number == request.room_number,
            Room.id != room_id
        ).first()

        if duplicate:
            return { "message": "Room number already exists"}

        room.room_number = request.room_number

    if request.capacity is not None:
        occupied = db.query( func.count(Allocation.id)).filter(
            Allocation.room_id == room_id,
            Allocation.leaving_date == None ).scalar()

        if request.capacity < occupied:
            return { "message": "Capacity cannot be less than current occupants"}
        
        room.capacity = request.capacity


    if request.rent_amount is not None:
        room.rent_amount = request.rent_amount


    db.commit()
    db.refresh(room)

    return { "message": "Room updated successfully"}


def delete_room(db, room_id):

    room = db.query(Room).filter( Room.id == room_id ).first()

    if not room:
        return { "message":"Room not found"}

    allocation = db.query(Allocation).filter( Allocation.room_id == room_id ).first()


    if allocation:
        return { "message": "Room has allocation history and cannot be deleted"}

    db.delete(room)
    db.commit()

    return {
        "message": "Room deleted successfully"
    }



def get_room_list(db):

    rooms = db.query(Room).all()

    return [
        {
            "room_id":room.id,
            "pg_id":room.pg_id,
            "room_number":room.room_number,
            "capacity":room.capacity,
            "rent_amount":float(room.rent_amount)
        }
        for room in rooms
    ]

def get_room_availability(db):

    rooms = db.query(Room).all()
    result = []

    for room in rooms:

        occupied = db.query(
            func.count(Allocation.id)
        ).filter(
            Allocation.room_id == room.id,
            Allocation.joining_date <= func.current_date(),
            or_(
                Allocation.leaving_date.is_(None),
                Allocation.leaving_date >= func.current_date()
            )
        ).scalar()

        available = room.capacity - occupied

        result.append({
            "room_id": room.id,
            "room_number": room.room_number,
            "capacity": room.capacity,
            "occupied": occupied,
            "available": available,
            "status": "Available" if available > 0 else "Full"
        })

    return result
from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime

from app.models.resident import Resident
from app.models.resident_movement import ResidentMovement



def resident_exit(
        db: Session,
        resident_id: int
):

    resident = (
        db.query(Resident)
        .filter(
            Resident.id == resident_id
        )
        .first()
    )

    if not resident:
        raise HTTPException(
            status_code=404,
            detail="Resident not found"
        )


    if resident.status == "OUTSIDE":
        raise HTTPException(
            status_code=400,
            detail="Resident already outside"
        )


    movement = ResidentMovement(
        resident_id=resident_id,
        exit_time=datetime.now(),
        status="OUTSIDE"
    )


    resident.presence = "OUTSIDE"


    db.add(movement)
    db.commit()
    db.refresh(movement)


    return movement




def resident_entry(
        db: Session,
        resident_id: int
):

    resident = (
        db.query(Resident)
        .filter(
            Resident.id == resident_id
        )
        .first()
    )


    if not resident:
        raise HTTPException(
            status_code=404,
            detail="Resident not found"
        )


    if resident.status == "INSIDE":
        raise HTTPException(
            status_code=400,
            detail="Resident already inside"
        )


    movement = (
        db.query(ResidentMovement)
        .filter(
            ResidentMovement.resident_id == resident_id,
            ResidentMovement.entry_time == None
        )
        .order_by(
            ResidentMovement.id.desc()
        )
        .first()
    )


    if movement:

        movement.entry_time = datetime.now()
        movement.status = "INSIDE"

    else:

        movement = ResidentMovement(
            resident_id=resident_id,
            entry_time=datetime.now(),
            status="INSIDE"
        )

        db.add(movement)


    resident.presence = "INSIDE"


    db.commit()
    db.refresh(movement)


    return movement

def movement_status(db):

    residents = (
        db.query(Resident)
        .all()
    )


    inside = []
    outside = []


    for resident in residents:

        data = {
            "id":resident.id,
            "name":resident.full_name,
            "status":resident.status
        }


        if resident.status == "INSIDE":
            inside.append(data)

        else:
            outside.append(data)



    return {

        "inside_count":len(inside),

        "outside_count":len(outside),

        "inside":inside,

        "outside":outside

    }


def movement_history(
        db,
        resident_id
):

    movements = (

        db.query(
            ResidentMovement
        )

        .filter(
            ResidentMovement.resident_id
            ==
            resident_id
        )

        .order_by(
            ResidentMovement.id.desc()
        )

        .all()

    )


    return movements

def today_movement(db):

    today = datetime.now().date()


    movements=(

        db.query(
            ResidentMovement
        )

        .filter(
            ResidentMovement.exit_time >= today
        )

        .all()

    )


    return movements
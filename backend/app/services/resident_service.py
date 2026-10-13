from app.models.resident import Resident


def add_resident(db, request):

    resident = Resident(
        full_name=request.full_name,
        mobile_no=request.mobile_no,
        email=request.email,
        DOB=request.DOB,
        permenant_address=request.permenant_address,
        aadhar=request.aadhar,
        status=request.status
    )

    db.add(resident)
    db.commit()
    db.refresh(resident)

    return {
        "message": "resident added successfully",
        "resident_id": resident.id
    }


def update_resident(db, resident_id, request):

    resident = db.query(Resident).filter(
        Resident.id ==resident_id
    ).first()

    if not resident:
        return {"message": "resident not found"}

    resident.full_name = request.full_name
    resident.mobile_no = request.mobile_no
    resident.email = request.email
    resident.DOB = request.DOB
    resident.permenant_address = request.permenant_address
    resident.aadhar = request.aadhar
    resident.status = request.status

    db.commit()

    return {
        "message": "resident updated successfully"
    }


def delete_resident(db, resident_id):

    resident = db.query(Resident).filter(
        Resident.id == resident_id
    ).first()

    if not resident:
        return {"message": "resident not found"}

    db.delete(resident)
    db.commit()

    return {
        "message": "resident deleted successfully"
    }


def search_resident(db, keyword):

    resident = db.query(Resident).filter(
        Resident.full_name.ilike(f"%{keyword}%")
    ).all()

    if not resident :
        return {"message": "resident not found"}

    return resident


def get_resident_details(db, resident_id):

    resident = db.query(Resident).filter(
        Resident.id == resident_id
    ).first()

    if not resident:
        return {"message": "resident not found"}

    return resident

def get_all(db):

    residents = db.query(Resident).all()

    return [
        {
            "id":res.id,
            "name": res.full_name,
            "mobile" : res.mobile_no,
            "email": res.email,
            "DOB" : res.DOB,
            "address": res.permenant_address,
            "aadhar" : res.aadhar,
            "status" : res.status
        }
        for res in residents
    ]

def get_by_status(db, status):
    residents = (
        db.query(Resident)
        .filter(Resident.status == status)
        .all()
    )

    return [
        {
            "id": res.id,
            "name": res.full_name,
            "mobile": res.mobile_no,
            "email": res.email,
            "DOB": res.DOB,
            "address": res.permenant_address,
            "aadhar": res.aadhar,
            "status": res.status
        }
        for res in residents
    ]
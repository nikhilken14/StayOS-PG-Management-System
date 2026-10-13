from app.models.complaint import Complaint

def create_complaint(db, request):

    complaint = Complaint(
        resident_id=request.resident_id,
        title=request.title,
        description=request.description
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "message": "Complaint created successfully",
        "complaint_id": complaint.id
    }

def update_complaint(db, complaint_id, request):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        return {"message": "Complaint not found"}

    complaint.title = request.title
    complaint.description = request.description

    db.commit()

    return {
        "message": "Complaint updated successfully"
    }

def get_complaints(db):
    return db.query(Complaint).all()

def get_resident_complaints(db, resident_id):

    return db.query(Complaint).filter(
        Complaint.resident_id == resident_id
    ).all()

def update_complaint_status(db, complaint_id, request):

    complaint = db.query(Complaint).filter(
        Complaint.id == complaint_id
    ).first()

    if not complaint:
        return {"message": "Complaint not found"}

    complaint.status = request.status

    db.commit()

    return {
        "message": "Complaint status updated successfully"
    }
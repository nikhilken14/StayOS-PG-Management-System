from fastapi import HTTPException

from app.models.admin import Admin
from app.config.security import encrypt
from app.services.tenant import owner_context 


def set_smtp_config(db, request, owner_id):

    admin = db.query(Admin).filter(Admin.id == owner_id).first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    admin.smtp_sender_email = request.sender_email
    if request.app_password:
        admin.smtp_app_password = encrypt(request.app_password)

    db.commit()

    return {
        "message": "SMTP configuration saved successfully"
    }


def get_smtp_status(db, owner_id):

    admin = db.query(Admin).filter(Admin.id == owner_id).first()

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    return {
        "sender_email": admin.smtp_sender_email,
        "is_configured": bool(admin.smtp_sender_email and admin.smtp_app_password)
    }
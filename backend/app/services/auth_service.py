from fastapi import HTTPException

from app.models.admin import Admin
from app.config.security import (
    hash_password,
    verify_password,
    verify_answer
)
from app.services.jwt_service import create_access_token


def sign_up(db, request):

    if db.query(Admin).filter((Admin.username == request.username) | (Admin.email == request.email)).first():
        raise HTTPException(status_code=409, detail="Username or email already exists")

    admin = Admin(
        username=request.username,
        role="OWNER",
        full_name=request.username,
        email=request.email,
        password_hash=hash_password(request.password),
        security_question=request.security_question,
        security_answer_hash=hash_password(request.security_answer)
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return {
        "message": "Owner workspace created successfully",
        "owner_id": admin.id
    }


def login(db, request):

    admin = db.query(Admin).filter(
        Admin.username == request.username
    ).first()

    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not admin.is_active:
        raise HTTPException(403, "Account disabled")
    token = create_access_token(admin.id)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id":admin.id,"username":admin.username,"full_name":admin.full_name or admin.username,"role":admin.role,"owner_id":admin.id if admin.role=="OWNER" else admin.owner_id}
    }


def get_security_question(db, request):

    admin = db.query(Admin).filter(
        Admin.username == request.username
    ).first()

    if not admin:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "security_question": admin.security_question
    }


def reset_password(db, request):

    admin = db.query(Admin).filter(
        Admin.username == request.username
    ).first()

    if not admin:
        raise HTTPException(status_code=404, detail="User not found")

    if admin.role != "OWNER" or not admin.security_question or not admin.security_answer_hash:
        raise HTTPException(403,"Security-question reset is unavailable for this account")
    if not verify_answer(request.security_answer, admin.security_answer_hash):
        raise HTTPException(status_code=401, detail="Incorrect security answer")

    admin.password_hash = hash_password(request.new_password)

    db.commit()

    return {
        "message": "Password reset successful"
    }


def delete_admin(db, request):

    admin = db.query(Admin).filter(Admin.username == request.username).first()

    if not admin or not verify_password(request.password, admin.password_hash):
        raise HTTPException(status_code=404, detail="Admin not found")

    if request.confirm != "DELETE":
        raise HTTPException(
            status_code=400,
            detail="Type DELETE to confirm admin deletion"
        )

    raise HTTPException(403, "Account deletion is disabled. Contact workspace owner.")

    return {
        "message": "Admin deleted successfully"
    }

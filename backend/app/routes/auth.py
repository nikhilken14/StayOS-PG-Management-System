from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.schema.auth import *
from app.services.auth_service import *
from app.services.smtp_service import (
    set_smtp_config,
    get_smtp_status
)
from app.services.jwt_service import require_admin, require_owner

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup_api(request: SignUpRequest, db: Session = Depends(get_db)):
    return sign_up(db, request)


@router.post("/login")
def login_api(request: LoginRequest, db: Session = Depends(get_db)):
    return login(db, request)


@router.post("/security-question")
def question_api(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return get_security_question(db, request)


@router.post("/reset-password")
def reset_api(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    return reset_password(db, request)


@router.delete("/delete", dependencies=[Depends(require_owner)])
def delete_admin_api(request: DeleteAdminRequest, db: Session = Depends(get_db)):
    return delete_admin(db, request)

@router.post("/smtp/set")
def set_smtp_api(
    request: SMTPConfigRequest,
    admin_id: int = Depends(require_owner),
    db: Session = Depends(get_db),
):
    return set_smtp_config(db, request, admin_id)

@router.get("/smtp/status")
def smtp_status_api(owner_id: int = Depends(require_owner), db: Session = Depends(get_db)):
    return get_smtp_status(db, owner_id)

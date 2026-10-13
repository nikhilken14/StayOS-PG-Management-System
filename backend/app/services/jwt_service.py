import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from app.config.database import SessionLocal
from app.models.admin import Admin
from app.services.tenant import owner_context

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
bearer = HTTPBearer(auto_error=False)

def create_access_token(admin_id: int):
    if not SECRET_KEY:
        raise RuntimeError("JWT_SECRET_KEY is required")
    payload = {
        "sub": str(admin_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def require_admin(request: Request, credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    if not SECRET_KEY:
        raise HTTPException(status_code=503, detail="Authentication is not configured")
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = int(payload["sub"])
    except (JWTError, KeyError, TypeError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid or expired token", headers={"WWW-Authenticate": "Bearer"})
    with SessionLocal() as db:
        user = db.query(Admin).filter(Admin.id == admin_id).first()
        if not user or not user.is_active:
            raise HTTPException(401, "Account disabled or deleted")
        path=request.url.path
        method=request.method
        if path.startswith("/auth/smtp") or (path.startswith("/pg/") and method in ("POST","PUT","PATCH","DELETE")):
            if user.role != "OWNER":raise HTTPException(403,"Owner role required")
        elif method in ("POST","PUT","PATCH","DELETE") and not path.startswith(("/auth/","/admins")) and not path.startswith(("/room/","/calendar/","/pg/")):
            if user.role != "ADMIN" and os.getenv("OWNER_CAN_OPERATE","false").lower()!="true":
                raise HTTPException(403,"Admin role required")
        request.state.owner_id = user.id if user.role == "OWNER" else user.owner_id
        return user.id

def current_user_id(user_id: int = Depends(require_admin)):
    return user_id

def require_owner(user_id: int = Depends(require_admin)):
    with SessionLocal() as db:
        user=db.get(Admin,user_id)
        if not user or user.role != "OWNER":
            raise HTTPException(403,"Owner role required")
    return user_id

def require_operator(user_id: int = Depends(require_admin)):
    with SessionLocal() as db:
        user=db.get(Admin,user_id)
        if not user or (user.role != "ADMIN" and os.getenv("OWNER_CAN_OPERATE","false").lower() != "true"):
            raise HTTPException(403,"Admin role required")
    return user_id

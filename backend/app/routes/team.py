from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.config.security import hash_password, verify_password
from app.models.admin import Admin
from app.services.jwt_service import require_admin, require_owner

router=APIRouter(tags=["Workspace"])
def view(u):
    return {"id":u.id,"username":u.username,"email":u.email,"full_name":u.full_name or u.username,
            "role":u.role,"owner_id":u.id if u.role=="OWNER" else u.owner_id,"is_active":u.is_active}

@router.get("/auth/me")
def me(uid:int=Depends(require_admin), db:Session=Depends(get_db)):
    return view(db.get(Admin,uid))

class PasswordChange(BaseModel):
    old_password:str
    new_password:str=Field(min_length=8)

@router.post("/auth/change-password")
def change_password(data:PasswordChange,uid:int=Depends(require_admin),db:Session=Depends(get_db)):
    u=db.get(Admin,uid)
    if not verify_password(data.old_password,u.password_hash): raise HTTPException(400,"Current password incorrect")
    u.password_hash=hash_password(data.new_password);db.commit()
    return {"message":"Password updated"}

class TeamCreate(BaseModel):
    username:str=Field(min_length=3)
    email:str
    full_name:str=""
    password:str=Field(min_length=8)

@router.get("/admins")
def admins(uid:int=Depends(require_owner),db:Session=Depends(get_db)):
    return [view(u) for u in db.query(Admin).filter(Admin.owner_id==uid).order_by(Admin.id.desc()).all()]

@router.post("/admins",status_code=201)
def add_admin(data:TeamCreate,uid:int=Depends(require_owner),db:Session=Depends(get_db)):
    if db.query(Admin).filter((Admin.username==data.username)|(Admin.email==data.email)).first():raise HTTPException(409,"Username or email already in use")
    u=Admin(username=data.username,email=data.email,full_name=data.full_name or data.username,role="ADMIN",owner_id=uid,password_hash=hash_password(data.password),security_question="",security_answer_hash="",is_active=True)
    db.add(u);db.commit();db.refresh(u);return view(u)

class TeamUpdate(BaseModel):
    full_name:str|None=None
    is_active:bool|None=None

def owned(db,uid,id):
    u=db.query(Admin).filter(Admin.id==id,Admin.owner_id==uid,Admin.role=="ADMIN").first()
    if not u:raise HTTPException(404,"Admin not found in workspace")
    return u

@router.put("/admins/{id}")
def update_admin(id:int,data:TeamUpdate,uid:int=Depends(require_owner),db:Session=Depends(get_db)):
    u=owned(db,uid,id)
    for field,val in data.model_dump(exclude_none=True).items():setattr(u,field,val)
    db.commit();return view(u)

class ResetAdminPassword(BaseModel):
    password:str=Field(min_length=8)
@router.post("/admins/{id}/reset-password")
def reset_admin(id:int,data:ResetAdminPassword,uid:int=Depends(require_owner),db:Session=Depends(get_db)):
    u=owned(db,uid,id);u.password_hash=hash_password(data.password);db.commit();return {"message":"Temporary password set"}

@router.delete("/admins/{id}")
def delete_admin(id:int,uid:int=Depends(require_owner),db:Session=Depends(get_db)):
    u=owned(db,uid,id);db.delete(u);db.commit();return {"message":"Admin removed"}

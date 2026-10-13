"""Row-level application tenancy. All ORM reads and writes are scoped on the server.
DB migrations must be applied before this module is used with existing data.
"""
from contextvars import ContextVar
from fastapi import HTTPException
from sqlalchemy import event, select
from sqlalchemy.orm import Session, with_loader_criteria
from app.models.pg import PG
from app.models.resident import Resident
from app.models.visitor import Visitor
from app.models.calendar import CalendarMemo
from app.models.room import Room
from app.models.allocation import Allocation
from app.models.rent import Rent
from app.models.payment import Payment
from app.models.bill import Bill
from app.models.complaint import Complaint
from app.models.resident_movement import ResidentMovement

owner_context = ContextVar("owner_context", default=None)
# Query filters cover nested resources, including multi-level relationships.
def visibility(owner):
    owned_pg = select(PG.id).where(PG.owner_id == owner)
    owned_res = select(Resident.id).where(Resident.owner_id == owner)
    return [(PG, PG.owner_id == owner), (Resident, Resident.owner_id == owner),
            (Visitor, Visitor.owner_id == owner), (CalendarMemo, CalendarMemo.owner_id == owner),
            (Room, Room.pg_id.in_(owned_pg)),
            (Allocation, Allocation.resident_id.in_(owned_res)),
            (Rent, Rent.resident_id.in_(owned_res)),
            (Payment, Payment.resident_id.in_(owned_res)),
            (Bill, Bill.pg_id.in_(owned_pg)),
            (Complaint, Complaint.resident_id.in_(owned_res)),
            (ResidentMovement, ResidentMovement.resident_id.in_(owned_res))]

@event.listens_for(Session, "do_orm_execute")
def tenant_select(state):
    owner = state.session.info.get("owner_id")
    if owner is None or not state.is_select or state.execution_options.get("skip_tenant"):
        return
    for model, expression in visibility(owner):
        state.statement = state.statement.options(with_loader_criteria(model, expression, include_aliases=True))

@event.listens_for(Session, "before_flush")
def tenant_write(session, flush_context, instances):
    owner = session.info.get("owner_id")
    if owner is None:
        return
    owned_pg = select(PG.id).where(PG.owner_id == owner)
    owned_res = select(Resident.id).where(Resident.owner_id == owner)
    rules = {Room:("pg_id",owned_pg), Allocation:("resident_id",owned_res),
             Rent:("resident_id",owned_res),Payment:("resident_id",owned_res),
             Bill:("pg_id",owned_pg),Complaint:("resident_id",owned_res),
             ResidentMovement:("resident_id",owned_res)}
    for obj in session.new.union(session.dirty).union(session.deleted):
        if isinstance(obj,(PG,Resident,Visitor,CalendarMemo)):
            if obj in session.new:
                obj.owner_id=owner
            elif obj.owner_id != owner:
                raise HTTPException(403,"Cross-workspace write denied")
        for cls,(field,query) in rules.items():
            if isinstance(obj,cls) and getattr(obj,field,None) is not None:
                if session.execute(select(getattr(obj,field)).where(getattr(obj,field).in_(query)).execution_options(skip_tenant=True)).scalar_one_or_none() is None:
                    raise HTTPException(403,"Referenced record belongs to another workspace")
        if isinstance(obj,(Allocation,Rent)) and getattr(obj,"room_id",None) is not None:
            if session.execute(select(Room.id).where(Room.id==obj.room_id,Room.pg_id.in_(owned_pg)).execution_options(skip_tenant=True)).scalar_one_or_none() is None:
                raise HTTPException(403,"Room belongs to another workspace")
        if isinstance(obj,Payment) and getattr(obj,"rent_id",None) is not None:
            if session.execute(select(Rent.id).where(Rent.id==obj.rent_id,Rent.resident_id.in_(owned_res)).execution_options(skip_tenant=True)).scalar_one_or_none() is None:
                raise HTTPException(403,"Rent belongs to another workspace")

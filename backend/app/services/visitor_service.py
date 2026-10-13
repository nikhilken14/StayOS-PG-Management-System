from datetime import datetime
from sqlalchemy.orm import Session
from app.models.visitor import Visitor
from app.schema.visitor import VisitorCreate


def create_visitor( db: Session,data: VisitorCreate):

    visitor = Visitor(
        name=data.name,
        phone=data.phone,
        reason=data.reason,
        visiting=data.visiting
    )

    db.add(visitor)
    db.commit()
    db.refresh(visitor)

    return visitor



def checkout_visitor( db: Session, phone:str):

    visitor = (
        db.query(Visitor)
        .filter(
            Visitor.phone == phone,
            Visitor.status == "inside"
        )
        .first()
    )

    if not visitor:
        return None

    visitor.check_out = datetime.utcnow()
    visitor.status = "left"

    db.commit()
    db.refresh(visitor)

    return visitor




def get_all_visitors( db: Session):

    return (
        db.query(Visitor)
        .order_by(
            Visitor.id.desc()
        )
        .all()
    )



def get_inside_visitors(db: Session):

    return (
        db.query(Visitor)
        .filter(
            Visitor.status=="inside"
        )
        .all()
    )
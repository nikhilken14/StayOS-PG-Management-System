from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.database import SessionLocal
from app.schema.notification import NotificationRequest
from app.services.notification import send_bulk_email


async def send_bulk_email_task(subject: str, messages: list[str]):
    # Background tasks run after the request dependency has closed its session.
    with SessionLocal() as session:
        await send_bulk_email(session, subject, messages)

router = APIRouter(prefix="/notification", tags=["Notification"])


@router.post("/send")
async def send_notification(
    request: NotificationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):

    background_tasks.add_task(
        send_bulk_email_task,
        request.subject,
        request.messages
    )

    return {
        "success": True,
        "message": "Notifications queued"
    }

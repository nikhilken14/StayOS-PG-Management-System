from pydantic import BaseModel
from typing import List


class NotificationRequest(BaseModel):
    subject: str
    messages: List[str]   # admin sends list of messages
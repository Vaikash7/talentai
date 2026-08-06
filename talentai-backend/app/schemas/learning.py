import uuid
from typing import Optional
from pydantic import BaseModel

from app.db.models.learning import ResourceLevel


class LearningResourceOut(BaseModel):
    id: uuid.UUID
    title: str
    provider: Optional[str] = None
    url: Optional[str] = None
    skill_name: str
    level: ResourceLevel
    explanation: Optional[str] = None

    class Config:
        from_attributes = True
import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.models.learning import ResourceLevel


class CareerTrackOut(BaseModel):
    key: str
    display_name: str


class CareerStageOut(BaseModel):
    role: str
    required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    readiness_score: int
    is_current_stage: bool
    is_recommended_next: bool


class RecommendedLearningOut(BaseModel):
    id: uuid.UUID
    title: str
    provider: Optional[str] = None
    url: Optional[str] = None
    skill_name: str
    level: ResourceLevel


class CareerPathOut(BaseModel):
    track_key: str
    track_display_name: str
    stages: List[CareerStageOut]
    generated_at: Optional[datetime] = None
    readiness_score: int
    recommended_next_role: str
    current_skills: List[str] = []
    missing_skills: List[str] = []
    rationale: str
    recommended_learning: List[RecommendedLearningOut] = []
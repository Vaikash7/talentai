import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class CareerTrackOut(BaseModel):
    key: str
    display_name: str


class CareerStageOut(BaseModel):
    role: str
    required_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    readiness_score: int  # 0-100, how ready the candidate is for this stage
    is_current_stage: bool
    is_recommended_next: bool


class CareerPathOut(BaseModel):
    track_key: str
    track_display_name: str
    stages: List[CareerStageOut]
    generated_at: Optional[datetime] = None
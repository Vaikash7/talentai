import uuid
from typing import List, Optional
from pydantic import BaseModel

from app.db.models.user import UserRole


class UserSummaryOut(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole

    class Config:
        from_attributes = True


class AdminStatsOut(BaseModel):
    total_users: int
    total_candidates: int
    total_recruiters: int
    total_jobs: int
    total_open_jobs: int
    total_skills: int
    total_learning_resources: int


class SkillDemandOut(BaseModel):
    skill_id: uuid.UUID
    skill_name: str
    category: Optional[str] = None
    demand_count: int
    supply_count: int
    internal_supply_count: int
    gap: int
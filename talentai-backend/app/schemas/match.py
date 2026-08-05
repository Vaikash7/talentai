import uuid
from typing import List, Optional
from pydantic import BaseModel

from app.db.models.candidate import EmployeeType


class MatchOut(BaseModel):
    match_id: uuid.UUID
    job_id: uuid.UUID
    candidate_profile_id: uuid.UUID
    score: int
    matched_skills: List[str] = []
    gap_skills: List[str] = []
    ai_rationale: Optional[str] = None
    job_title: Optional[str] = None
    candidate_summary: Optional[str] = None
    candidate_employee_type: Optional[EmployeeType] = None
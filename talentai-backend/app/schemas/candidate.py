import uuid
from typing import List, Optional
from pydantic import BaseModel

from app.db.models.candidate import EmployeeType


class SkillOut(BaseModel):
    id: uuid.UUID
    name: str
    category: Optional[str] = None

    class Config:
        from_attributes = True


class ResumeUploadResponse(BaseModel):
    profile_id: uuid.UUID
    resume_blob_url: Optional[str] = None
    summary: Optional[str] = None
    experience_years: Optional[int] = None
    extracted_skills: List[str] = []
    message: str = "Resume uploaded and processed successfully."


class CandidateProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    resume_blob_url: Optional[str] = None
    summary: Optional[str] = None
    experience_years: Optional[int] = None
    employee_type: EmployeeType
    open_to_internal_opportunities: bool = False
    skills: List[SkillOut] = []

    class Config:
        from_attributes = True


class OpenToInternalUpdate(BaseModel):
    open_to_internal_opportunities: bool
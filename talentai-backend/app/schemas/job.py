import uuid
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

from app.db.models.job import JobType, JobStatus


class JobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    job_type: JobType = JobType.job
    experience_required: Optional[int] = None
    required_skills: List[str] = []
    mandatory_skills: Optional[List[str]] = None
    status: JobStatus = JobStatus.draft


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    job_type: Optional[JobType] = None
    experience_required: Optional[int] = None
    required_skills: Optional[List[str]] = None
    mandatory_skills: Optional[List[str]] = None
    status: Optional[JobStatus] = None


class RequiredSkillOut(BaseModel):
    id: uuid.UUID
    name: str
    is_mandatory: bool

    class Config:
        from_attributes = True


class JobOut(BaseModel):
    id: uuid.UUID
    posted_by: uuid.UUID
    title: str
    description: str
    job_type: JobType
    experience_required: Optional[int] = None
    status: JobStatus
    created_at: datetime
    required_skills: List[RequiredSkillOut] = []

    class Config:
        from_attributes = True
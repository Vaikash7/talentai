import enum
import uuid

from sqlalchemy import Column, String, Integer, Text, Enum, ForeignKey, DateTime, func, UniqueConstraint, Boolean
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class JobType(str, enum.Enum):
    job = "job"
    project = "project"


class JobStatus(str, enum.Enum):
    draft = "draft"
    open = "open"
    closed = "closed"


class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    posted_by = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    job_type = Column(Enum(JobType), nullable=False, default=JobType.job)
    experience_required = Column(Integer, nullable=True)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.draft)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    posted_by_user = relationship("User", back_populates="jobs_posted")
    required_skills = relationship(
        "JobRequiredSkill",
        back_populates="job",
        cascade="all, delete-orphan",
    )
    matches = relationship(
        "Match",
        back_populates="job",
        cascade="all, delete-orphan",
    )


class JobRequiredSkill(Base):
    __tablename__ = "job_required_skills"
    __table_args__ = (
        UniqueConstraint("job_id", "skill_id", name="uq_job_skill"),
    )

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    job_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
    )
    skill_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
    )
    is_mandatory = Column(Boolean, nullable=False, default=True)

    # Relationships
    job = relationship("Job", back_populates="required_skills")
    skill = relationship("Skill", back_populates="job_links")
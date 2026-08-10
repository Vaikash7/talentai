import enum
import uuid

from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, func, UniqueConstraint, Enum
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class ApplicationStatus(str, enum.Enum):
    not_applied = "not_applied"
    applied = "applied"
    withdrawn = "withdrawn"


class Match(Base):
    __tablename__ = "matches"
    __table_args__ = (
        UniqueConstraint("job_id", "candidate_profile_id", name="uq_job_candidate_match"),
    )

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    job_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("jobs.id", ondelete="NO ACTION"),
        nullable=False,
    )
    candidate_profile_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("candidate_profiles.id", ondelete="NO ACTION"),
        nullable=False,
    )
    score = Column(Integer, nullable=False)
    matched_skills_json = Column(Text, nullable=True)
    gap_skills_json = Column(Text, nullable=True)
    ai_rationale = Column(Text, nullable=True)
    application_status = Column(Enum(ApplicationStatus), nullable=False, default=ApplicationStatus.not_applied)
    applied_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="matches")
    candidate_profile = relationship("CandidateProfile", back_populates="matches")
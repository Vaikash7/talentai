import enum
import uuid

from sqlalchemy import Column, String, Integer, Text, Enum, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class ProficiencyLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"
    expert = "expert"


class EmployeeType(str, enum.Enum):
    internal = "internal"
    external = "external"


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    resume_blob_url = Column(String(1000), nullable=True)
    summary = Column(Text, nullable=True)
    experience_years = Column(Integer, nullable=True)
    employee_type = Column(Enum(EmployeeType), nullable=False, default=EmployeeType.external)
    open_to_internal_opportunities = Column(Boolean, nullable=False, default=False)

    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    skills = relationship(
        "CandidateSkill",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    matches = relationship(
        "Match",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )
    career_paths = relationship(
        "CareerPath",
        back_populates="candidate_profile",
        cascade="all, delete-orphan",
    )


class CandidateSkill(Base):
    __tablename__ = "candidate_skills"
    __table_args__ = (
        UniqueConstraint("candidate_profile_id", "skill_id", name="uq_candidate_skill"),
    )

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    candidate_profile_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("candidate_profiles.id", ondelete="CASCADE"),
        nullable=False,
    )
    skill_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
    )
    proficiency_level = Column(Enum(ProficiencyLevel), nullable=True)

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="skills")
    skill = relationship("Skill", back_populates="candidate_links")
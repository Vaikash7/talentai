import uuid

from sqlalchemy import Column, String
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    name = Column(String(255), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=True)

    # Relationships (populated once related model files exist)
    candidate_links = relationship(
        "CandidateSkill",
        back_populates="skill",
        cascade="all, delete-orphan",
    )
    job_links = relationship(
        "JobRequiredSkill",
        back_populates="skill",
        cascade="all, delete-orphan",
    )
    learning_resources = relationship(
        "LearningResource",
        back_populates="skill",
    )
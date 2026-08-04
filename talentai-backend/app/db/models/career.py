import uuid

from sqlalchemy import Column, String, Text, ForeignKey, DateTime, func
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class CareerPath(Base):
    __tablename__ = "career_paths"

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
    target_role = Column(String(255), nullable=False)
    path_steps_json = Column(Text, nullable=True)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="career_paths")
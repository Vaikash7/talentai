import enum
import uuid

from sqlalchemy import Column, String, Enum, DateTime, func
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    candidate = "candidate"
    recruiter = "recruiter"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships (populated once related model files exist)
    candidate_profile = relationship(
        "CandidateProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    jobs_posted = relationship(
        "Job",
        back_populates="posted_by_user",
        cascade="all, delete-orphan",
    )
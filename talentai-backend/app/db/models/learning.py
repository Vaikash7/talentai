import enum
import uuid

from sqlalchemy import Column, String, Enum, ForeignKey
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship

from app.db.base import Base


class ResourceLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id = Column(
        UNIQUEIDENTIFIER,
        primary_key=True,
        default=uuid.uuid4,
    )
    title = Column(String(255), nullable=False)
    provider = Column(String(255), nullable=True)
    url = Column(String(1000), nullable=True)
    skill_id = Column(
        UNIQUEIDENTIFIER,
        ForeignKey("skills.id", ondelete="CASCADE"),
        nullable=False,
    )
    level = Column(Enum(ResourceLevel), nullable=False, default=ResourceLevel.beginner)

    # Relationships
    skill = relationship("Skill", back_populates="learning_resources")
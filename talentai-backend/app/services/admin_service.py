from typing import List
from sqlalchemy.orm import Session

from app.db.models.user import User, UserRole
from app.db.models.job import Job, JobStatus
from app.db.models.skill import Skill
from app.db.models.learning import LearningResource


class AdminService:
    def __init__(self, db: Session):
        self.db = db

    def list_all_users(self) -> List[User]:
        return self.db.query(User).order_by(User.created_at.desc()).all()

    def get_stats(self) -> dict:
        return {
            "total_users": self.db.query(User).count(),
            "total_candidates": self.db.query(User).filter(User.role == UserRole.candidate).count(),
            "total_recruiters": self.db.query(User).filter(User.role == UserRole.recruiter).count(),
            "total_jobs": self.db.query(Job).count(),
            "total_open_jobs": self.db.query(Job).filter(Job.status == JobStatus.open).count(),
            "total_skills": self.db.query(Skill).count(),
            "total_learning_resources": self.db.query(LearningResource).count(),
        }
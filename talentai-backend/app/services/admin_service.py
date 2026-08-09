from typing import List
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.db.models.user import User, UserRole
from app.db.models.job import Job, JobStatus, JobRequiredSkill
from app.db.models.skill import Skill
from app.db.models.candidate import CandidateSkill, CandidateProfile, EmployeeType
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

    def get_skill_demand_heatmap(self) -> List[dict]:
        """
        For every skill required by at least one open job, computes:
        - demand_count: number of open jobs requiring this skill
        - supply_count: number of candidates who have this skill
        - internal_supply_count: of those, how many are internal employees
        - gap: demand_count - supply_count (positive = shortage)

        Pure aggregate SQL over existing tables — no AI, no new schema,
        consistent with the platform's deterministic, explainable design.
        """
        demand_rows = (
            self.db.query(
                Skill.id,
                Skill.name,
                Skill.category,
                func.count(func.distinct(JobRequiredSkill.job_id)).label("demand_count"),
            )
            .join(JobRequiredSkill, JobRequiredSkill.skill_id == Skill.id)
            .join(Job, Job.id == JobRequiredSkill.job_id)
            .filter(Job.status == JobStatus.open)
            .group_by(Skill.id, Skill.name, Skill.category)
            .all()
        )

        results = []
        for skill_id, name, category, demand_count in demand_rows:
            supply_count = (
                self.db.query(func.count(func.distinct(CandidateSkill.candidate_profile_id)))
                .filter(CandidateSkill.skill_id == skill_id)
                .scalar()
            ) or 0

            internal_supply_count = (
                self.db.query(func.count(func.distinct(CandidateSkill.candidate_profile_id)))
                .join(CandidateProfile, CandidateProfile.id == CandidateSkill.candidate_profile_id)
                .filter(
                    CandidateSkill.skill_id == skill_id,
                    CandidateProfile.employee_type == EmployeeType.internal,
                )
                .scalar()
            ) or 0

            results.append({
                "skill_id": skill_id,
                "skill_name": name,
                "category": category,
                "demand_count": demand_count,
                "supply_count": supply_count,
                "internal_supply_count": internal_supply_count,
                "gap": demand_count - supply_count,
            })

        results.sort(key=lambda r: r["gap"], reverse=True)
        return results
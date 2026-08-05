from typing import Optional, List
from sqlalchemy.orm import Session

from app.db.models.job import Job, JobRequiredSkill, JobStatus
from app.db.models.skill import Skill
from app.repositories.base_repository import BaseRepository


class JobRepository(BaseRepository[Job]):
    def __init__(self, db: Session):
        super().__init__(Job, db)

    def get_by_recruiter(self, recruiter_id) -> List[Job]:
        return (
            self.db.query(Job)
            .filter(Job.posted_by == recruiter_id)
            .order_by(Job.created_at.desc())
            .all()
        )

    def get_open_jobs(self) -> List[Job]:
        return (
            self.db.query(Job)
            .filter(Job.status == JobStatus.open)
            .order_by(Job.created_at.desc())
            .all()
        )

    def get_or_create_skill(self, skill_name: str) -> Skill:
        skill_name_clean = skill_name.strip()
        skill = (
            self.db.query(Skill)
            .filter(Skill.name.ilike(skill_name_clean))
            .first()
        )
        if skill:
            return skill

        skill = Skill(name=skill_name_clean, category=None)
        self.db.add(skill)
        self.db.flush()
        return skill

    def replace_required_skills(
        self, job: Job, skill_names: List[str], mandatory_skill_names: Optional[List[str]] = None
    ) -> None:
        """
        Clears this job's existing required-skill links and creates
        fresh ones. mandatory_skill_names (subset of skill_names) are
        marked is_mandatory=True; all others default to True as well
        unless explicitly excluded.
        """
        mandatory_set = set(mandatory_skill_names or skill_names)

        self.db.query(JobRequiredSkill).filter(
            JobRequiredSkill.job_id == job.id
        ).delete()

        for skill_name in skill_names:
            skill = self.get_or_create_skill(skill_name)
            link = JobRequiredSkill(
                job_id=job.id,
                skill_id=skill.id,
                is_mandatory=skill_name in mandatory_set,
            )
            self.db.add(link)

        self.db.commit()
        self.db.refresh(job)
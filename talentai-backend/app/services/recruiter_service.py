from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.models.job import Job
from app.repositories.job_repository import JobRepository
from app.schemas.job import JobCreate, JobUpdate


class RecruiterService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = JobRepository(db)

    def create_job(self, recruiter_id, data: JobCreate) -> Job:
        job = Job(
            posted_by=recruiter_id,
            title=data.title,
            description=data.description,
            job_type=data.job_type,
            experience_required=data.experience_required,
            status=data.status,
        )
        self.db.add(job)
        self.db.flush()

        if data.required_skills:
            self.repo.replace_required_skills(
                job, data.required_skills, data.mandatory_skills
            )
        else:
            self.db.commit()
            self.db.refresh(job)

        return job

    def update_job(self, recruiter_id, job_id, data: JobUpdate) -> Job:
        job = self.repo.get_by_id(job_id)
        if not job:
            raise ValueError("Job not found.")
        if job.posted_by != recruiter_id:
            raise PermissionError("You can only edit your own job postings.")

        if data.title is not None:
            job.title = data.title
        if data.description is not None:
            job.description = data.description
        if data.job_type is not None:
            job.job_type = data.job_type
        if data.experience_required is not None:
            job.experience_required = data.experience_required
        if data.status is not None:
            job.status = data.status

        if data.required_skills is not None:
            self.repo.replace_required_skills(
                job, data.required_skills, data.mandatory_skills
            )
        else:
            self.db.commit()
            self.db.refresh(job)

        return job

    def get_job(self, job_id) -> Job:
        job = self.repo.get_by_id(job_id)
        if not job:
            raise ValueError("Job not found.")
        return job

    def list_my_jobs(self, recruiter_id) -> List[Job]:
        return self.repo.get_by_recruiter(recruiter_id)

    def list_open_jobs(self) -> List[Job]:
        return self.repo.get_open_jobs()

    def delete_job(self, recruiter_id, job_id) -> None:
        job = self.repo.get_by_id(job_id)
        if not job:
            raise ValueError("Job not found.")
        if job.posted_by != recruiter_id:
            raise PermissionError("You can only delete your own job postings.")
        self.repo.delete(job)
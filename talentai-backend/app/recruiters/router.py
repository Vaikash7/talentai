from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import require_role
from app.db.models.user import User
from app.services.recruiter_service import RecruiterService
from app.schemas.job import JobCreate, JobUpdate, JobOut, RequiredSkillOut

router = APIRouter(prefix="/jobs", tags=["Recruiters"])


def _to_job_out(job) -> JobOut:
    return JobOut(
        id=job.id,
        posted_by=job.posted_by,
        title=job.title,
        description=job.description,
        job_type=job.job_type,
        experience_required=job.experience_required,
        status=job.status,
        created_at=job.created_at,
        required_skills=[
            RequiredSkillOut(
                id=link.skill.id,
                name=link.skill.name,
                is_mandatory=link.is_mandatory,
            )
            for link in job.required_skills
        ],
    )


@router.post("", response_model=JobOut, status_code=201)
def create_job(
    data: JobCreate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    service = RecruiterService(db)
    job = service.create_job(current_user.id, data)
    return _to_job_out(job)


@router.get("/mine", response_model=List[JobOut])
def list_my_jobs(
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    service = RecruiterService(db)
    jobs = service.list_my_jobs(current_user.id)
    return [_to_job_out(job) for job in jobs]


@router.get("/open", response_model=List[JobOut])
def list_open_jobs(db: Session = Depends(get_db)):
    service = RecruiterService(db)
    jobs = service.list_open_jobs()
    return [_to_job_out(job) for job in jobs]


@router.get("/{job_id}", response_model=JobOut)
def get_job(job_id: str, db: Session = Depends(get_db)):
    service = RecruiterService(db)
    try:
        job = service.get_job(job_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    return _to_job_out(job)


@router.put("/{job_id}", response_model=JobOut)
def update_job(
    job_id: str,
    data: JobUpdate,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    service = RecruiterService(db)
    try:
        job = service.update_job(current_user.id, job_id, data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    return _to_job_out(job)


@router.delete("/{job_id}", status_code=204)
def delete_job(
    job_id: str,
    current_user: User = Depends(require_role("recruiter")),
    db: Session = Depends(get_db),
):
    service = RecruiterService(db)
    try:
        service.delete_job(current_user.id, job_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
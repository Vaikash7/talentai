from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import require_role
from app.db.models.user import User
from app.services.candidate_service import CandidateService
from app.schemas.candidate import ResumeUploadResponse, CandidateProfileOut, SkillOut

router = APIRouter(prefix="/candidates", tags=["Candidates"])


@router.post("/resume", response_model=ResumeUploadResponse, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    file_bytes = await file.read()

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    service = CandidateService(db)

    try:
        profile = service.upload_resume(
            user_id=current_user.id,
            file_bytes=file_bytes,
            filename=file.filename,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    db.commit()
    db.refresh(profile)

    extracted_skill_names = [link.skill.name for link in profile.skills]

    return ResumeUploadResponse(
        profile_id=profile.id,
        resume_blob_url=profile.resume_blob_url,
        summary=profile.summary,
        experience_years=profile.experience_years,
        extracted_skills=extracted_skill_names,
    )


@router.get("/profile", response_model=CandidateProfileOut)
def get_my_profile(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    service = CandidateService(db)
    try:
        profile = service.get_profile(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return CandidateProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        resume_blob_url=profile.resume_blob_url,
        summary=profile.summary,
        experience_years=profile.experience_years,
        skills=[
            SkillOut(id=link.skill.id, name=link.skill.name, category=link.skill.category)
            for link in profile.skills
        ],
    )
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import require_role
from app.db.models.user import User
from app.services.candidate_service import CandidateService
from app.services.matching_service import MatchingService
from app.services.learning_service import LearningService
from app.services.career_service import CareerService
from app.repositories.match_repository import MatchRepository
from app.schemas.candidate import ResumeUploadResponse, CandidateProfileOut, SkillOut, OpenToInternalUpdate
from app.schemas.match import MatchOut, ApplyRequest
from app.schemas.learning import LearningResourceOut
from app.schemas.career import CareerTrackOut, CareerPathOut, CareerStageOut, RecommendedLearningOut

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
        employee_type=profile.employee_type,
        open_to_internal_opportunities=profile.open_to_internal_opportunities,
        skills=[
            SkillOut(id=link.skill.id, name=link.skill.name, category=link.skill.category)
            for link in profile.skills
        ],
    )


@router.put("/open-to-internal", response_model=CandidateProfileOut)
def update_open_to_internal(
    data: OpenToInternalUpdate,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    service = CandidateService(db)
    try:
        profile = service.set_open_to_internal_opportunities(
            current_user.id, data.open_to_internal_opportunities
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return CandidateProfileOut(
        id=profile.id,
        user_id=profile.user_id,
        resume_blob_url=profile.resume_blob_url,
        summary=profile.summary,
        experience_years=profile.experience_years,
        employee_type=profile.employee_type,
        open_to_internal_opportunities=profile.open_to_internal_opportunities,
        skills=[
            SkillOut(id=link.skill.id, name=link.skill.name, category=link.skill.category)
            for link in profile.skills
        ],
    )


@router.get("/matches", response_model=List[MatchOut])
def get_my_matches(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    service = CandidateService(db)
    try:
        profile = service.get_profile(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    matching_service = MatchingService(db)
    results = matching_service.get_matches_for_candidate(profile.id)
    return [MatchOut(**r) for r in results]


@router.post("/matches/apply", response_model=MatchOut)
def apply_to_match(
    data: ApplyRequest,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    match_repo = MatchRepository(db)
    match = match_repo.get_by_id(data.match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    candidate_service = CandidateService(db)
    profile = candidate_service.get_profile(current_user.id)
    if match.candidate_profile_id != profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This match does not belong to you.")

    updated = match_repo.set_application_status(data.match_id, "applied")

    matching_service = MatchingService(db)
    return MatchOut(**matching_service._match_to_dict(updated, job=updated.job))


@router.post("/matches/withdraw", response_model=MatchOut)
def withdraw_application(
    data: ApplyRequest,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    match_repo = MatchRepository(db)
    match = match_repo.get_by_id(data.match_id)
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")

    candidate_service = CandidateService(db)
    profile = candidate_service.get_profile(current_user.id)
    if match.candidate_profile_id != profile.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This match does not belong to you.")

    updated = match_repo.set_application_status(data.match_id, "withdrawn")

    matching_service = MatchingService(db)
    return MatchOut(**matching_service._match_to_dict(updated, job=updated.job))


@router.get("/learning-recommendations", response_model=List[LearningResourceOut])
def get_learning_recommendations(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    service = CandidateService(db)
    try:
        profile = service.get_profile(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    learning_service = LearningService(db)
    results = learning_service.get_recommendations_for_candidate(profile.id)
    return [LearningResourceOut(**r) for r in results]


@router.get("/career-tracks", response_model=List[CareerTrackOut])
def list_career_tracks(
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    service = CareerService(db)
    tracks = service.list_tracks()
    return [CareerTrackOut(**t) for t in tracks]


@router.get("/career-path/{track_key}", response_model=CareerPathOut)
def get_career_path(
    track_key: str,
    current_user: User = Depends(require_role("candidate")),
    db: Session = Depends(get_db),
):
    candidate_service = CandidateService(db)
    try:
        profile = candidate_service.get_profile(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    career_service = CareerService(db)
    try:
        result = career_service.get_career_path(profile.id, track_key)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

    return CareerPathOut(
        track_key=result["track_key"],
        track_display_name=result["track_display_name"],
        stages=[CareerStageOut(**s) for s in result["stages"]],
        generated_at=result["generated_at"],
        readiness_score=result["readiness_score"],
        recommended_next_role=result["recommended_next_role"],
        current_skills=result["current_skills"],
        missing_skills=result["missing_skills"],
        rationale=result["rationale"],
        recommended_learning=result["recommended_learning"],
    )
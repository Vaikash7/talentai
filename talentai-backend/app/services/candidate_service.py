from typing import List
from sqlalchemy.orm import Session

from app.db.models.candidate import CandidateProfile
from app.repositories.candidate_repository import CandidateRepository
from app.storage import get_storage_service
from app.utils.file_parser import extract_text_from_file
from app.db.models.skill import Skill


class CandidateService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = CandidateRepository(db)
        self.storage = get_storage_service()

    def upload_resume(
        self, user_id, file_bytes: bytes, filename: str
    ) -> CandidateProfile:
        # 1. Extract raw text from the file
        resume_text = extract_text_from_file(file_bytes, filename)

        # 2. Find or create this candidate's profile
        profile = self.repo.get_by_user_id(user_id)
        is_new = profile is None

        # 3. If replacing an existing resume, delete the old file first
        if profile and profile.resume_blob_url:
            try:
                self.storage.delete(profile.resume_blob_url)
            except Exception:
                # Don't block the upload if the old file was already
                # missing/inaccessible — log-worthy, but not fatal.
                pass

        # 4. Save the new file via the active storage backend
        blob_url = self.storage.upload(file_bytes, filename)

        # 5. Extract skills (PLACEHOLDER — replaced with Claude in Step 9)
        extracted_skill_names = self._extract_skills_placeholder(resume_text)

        # 6. Create or update the profile record
        if is_new:
            profile = CandidateProfile(
                user_id=user_id,
                resume_blob_url=blob_url,
                summary=resume_text[:500] if resume_text else None,
            )
            self.db.add(profile)
            self.db.flush()
        else:
            profile.resume_blob_url = blob_url
            profile.summary = resume_text[:500] if resume_text else None

        # 7. Replace skill links based on the newly extracted skills
        self.repo.replace_skills(profile, extracted_skill_names)

        return profile

    def get_profile(self, user_id) -> CandidateProfile:
        profile = self.repo.get_by_user_id(user_id)
        if not profile:
            raise ValueError("Candidate profile not found.")
        return profile

    def _extract_skills_placeholder(self, resume_text: str) -> List[str]:
        """
        TEMPORARY placeholder for Claude-based skill extraction (Step 9).
        Does simple case-insensitive substring matching against the
        master skills list, just to make the end-to-end flow testable
        before AI integration is built.
        """
        if not resume_text:
            return []

        resume_text_lower = resume_text.lower()
        all_skills = self.db.query(Skill).all()

        matched = [
            skill.name
            for skill in all_skills
            if skill.name.lower() in resume_text_lower
        ]
        return matched
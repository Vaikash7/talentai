from typing import List
from sqlalchemy.orm import Session

from app.db.models.candidate import CandidateProfile
from app.repositories.candidate_repository import CandidateRepository
from app.storage import get_storage_service
from app.utils.file_parser import extract_text_from_file
from app.db.models.skill import Skill

# Common abbreviations/synonyms mapped to their canonical skill name
# (must match a name in the seeded `skills` table). This improves
# recognition beyond exact substring matches without requiring an
# external AI provider.
SKILL_SYNONYMS = {
    "javascript": "JavaScript",
    "nodejs": "Node.js",
    "node.js": "Node.js",
    "reactjs": "React",
    "react.js": "React",
    "postgresql": "PostgreSQL",
    "postgres": "PostgreSQL",
    "kubernetes": "Kubernetes",
    "ci/cd": "CI/CD",
    "continuous integration": "CI/CD",
    "machine learning": "Machine Learning",
    "scrum master": "Agile/Scrum",
    "project management": "Project Management",
    "stakeholder management": "Stakeholder Management",
}


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

        # 5. Extract skills using rule-based matching against the
        #    master skills list (see extract_skills_rule_based below).
        extracted_skill_names = self.extract_skills_rule_based(resume_text)

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

    def extract_skills_rule_based(self, resume_text: str) -> List[str]:
        """
        Deterministic, rule-based skill extraction. Matches resume text
        against the master skills list (case-insensitive substring match),
        plus a small synonym map for common abbreviations.

        This is the application's permanent skill-extraction method —
        TalentAI runs entirely on rule-based logic with no dependency
        on any external AI API. See app/ai/README.md for details on
        how an AI-based extractor could be added later without
        changing anything outside this method.
        """
        if not resume_text:
            return []

        resume_text_lower = resume_text.lower()
        all_skills = self.db.query(Skill).all()
        matched = set()

        # Direct matches against the master skills list
        for skill in all_skills:
            if skill.name.lower() in resume_text_lower:
                matched.add(skill.name)

        # Synonym matches — map abbreviations to canonical skill names
        for synonym, canonical_name in SKILL_SYNONYMS.items():
            if synonym in resume_text_lower:
                # Only add if the canonical name actually exists in
                # the master skills list — avoids inserting unknown names.
                canonical_skill = next(
                    (s for s in all_skills if s.name.lower() == canonical_name.lower()),
                    None,
                )
                if canonical_skill:
                    matched.add(canonical_skill.name)

        return list(matched)
from typing import List
from sqlalchemy.orm import Session

from app.db.models.candidate import CandidateProfile
from app.repositories.candidate_repository import CandidateRepository
from app.storage import get_storage_service
from app.utils.file_parser import extract_text_from_file
from app.db.models.skill import Skill
from app.ai.gemini_client import call_gemini_json, call_gemini, GeminiUnavailableError

# Common abbreviations/synonyms mapped to their canonical skill name
# (must match a name in the seeded `skills` table). Used by the
# rule-based fallback extractor.
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
                pass

        # 4. Save the new file via the active storage backend
        blob_url = self.storage.upload(file_bytes, filename)

        # 5. Extract skills and summary — try Gemini first, fall back to
        #    rule-based extraction if AI is unavailable for any reason.
        ai_summary = None
        experience_years = None
        try:
            ai_result = self.extract_with_ai(resume_text)
            extracted_skill_names = ai_result["matched_skill_names"]
            ai_summary = ai_result.get("professional_summary")
            experience_years = ai_result.get("years_of_experience")
        except GeminiUnavailableError:
            extracted_skill_names = self.extract_skills_rule_based(resume_text)

        # 6. Create or update the profile record.
        summary_to_store = ai_summary or (resume_text[:500] if resume_text else None)

        if is_new:
            profile = CandidateProfile(
                user_id=user_id,
                resume_blob_url=blob_url,
                summary=summary_to_store,
                experience_years=experience_years,
            )
            self.db.add(profile)
            self.db.flush()
        else:
            profile.resume_blob_url = blob_url
            profile.summary = summary_to_store
            if experience_years is not None:
                profile.experience_years = experience_years

        # 7. Replace skill links based on the newly extracted skills
        self.repo.replace_skills(profile, extracted_skill_names)

        return profile

    def get_profile(self, user_id) -> CandidateProfile:
        profile = self.repo.get_by_user_id(user_id)
        if not profile:
            raise ValueError("Candidate profile not found.")
        return profile

    def set_open_to_internal_opportunities(self, user_id, value: bool) -> CandidateProfile:
        profile = self.repo.get_by_user_id(user_id)
        if not profile:
            raise ValueError("Candidate profile not found.")
        profile.open_to_internal_opportunities = value
        self.db.commit()
        self.db.refresh(profile)
        return profile

    def extract_with_ai(self, resume_text: str) -> dict:
        """
        Uses Gemini to extract structured resume data: technical skills,
        soft skills, certifications, education, years of experience,
        and a professional summary. Skill names returned by the model
        are matched against our existing master skills list (case-
        insensitive), exactly like the rule-based extractor does, so
        we never insert AI-invented skill names that don't correspond
        to a real taxonomy entry.

        Raises GeminiUnavailableError on any failure — callers must
        catch this and fall back to extract_skills_rule_based().
        """
        if not resume_text:
            raise GeminiUnavailableError("Empty resume text.")

        all_skills = self.db.query(Skill).all()
        skill_names_list = ", ".join(s.name for s in all_skills)

        prompt = f"""You are analyzing a resume. Extract the following information
and return ONLY a valid JSON object (no markdown, no explanation) with these exact keys:

- "technical_skills": list of technical skill names found in the resume
- "soft_skills": list of soft skill names found in the resume
- "certifications": list of certification names found (empty list if none)
- "education": short string summarizing education (empty string if none found)
- "years_of_experience": integer estimate of total professional years of experience (null if it cannot be determined)
- "professional_summary": a 2-3 sentence professional summary of this candidate written in third person

For technical_skills and soft_skills, prefer matching to these known skill names where applicable: {skill_names_list}
You may include additional skills not in that list if clearly present in the resume.

Resume text:
{resume_text[:4000]}
"""

        result = call_gemini_json(prompt)

        ai_skill_names = (
            result.get("technical_skills", []) + result.get("soft_skills", [])
        )

        matched_skill_names = []
        for ai_name in ai_skill_names:
            match = next(
                (s.name for s in all_skills if s.name.lower() == str(ai_name).lower()),
                None,
            )
            if match:
                matched_skill_names.append(match)

        return {
            "matched_skill_names": list(set(matched_skill_names)),
            "professional_summary": result.get("professional_summary"),
            "years_of_experience": result.get("years_of_experience"),
            "certifications": result.get("certifications", []),
            "education": result.get("education", ""),
        }

    def extract_skills_rule_based(self, resume_text: str) -> List[str]:
        """
        Deterministic, rule-based skill extraction. Matches resume text
        against the master skills list (case-insensitive substring match),
        plus a small synonym map for common abbreviations.

        This is the application's permanent FALLBACK skill-extraction
        method — used automatically whenever the Gemini AI extraction
        (extract_with_ai) is unavailable for any reason. See
        app/ai/README.md for details.
        """
        if not resume_text:
            return []

        resume_text_lower = resume_text.lower()
        all_skills = self.db.query(Skill).all()
        matched = set()

        for skill in all_skills:
            if skill.name.lower() in resume_text_lower:
                matched.add(skill.name)

        for synonym, canonical_name in SKILL_SYNONYMS.items():
            if synonym in resume_text_lower:
                canonical_skill = next(
                    (s for s in all_skills if s.name.lower() == canonical_name.lower()),
                    None,
                )
                if canonical_skill:
                    matched.add(canonical_skill.name)

        return list(matched)
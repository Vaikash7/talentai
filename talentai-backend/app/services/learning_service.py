import json
from typing import List
from sqlalchemy.orm import Session

from app.repositories.learning_repository import LearningRepository
from app.repositories.match_repository import MatchRepository
from app.repositories.candidate_repository import CandidateRepository
from app.ai.gemini_client import call_gemini, GeminiUnavailableError


class LearningService:
    def __init__(self, db: Session):
        self.db = db
        self.learning_repo = LearningRepository(db)
        self.match_repo = MatchRepository(db)
        self.candidate_repo = CandidateRepository(db)

    def get_recommendations_for_candidate(self, candidate_profile_id) -> List[dict]:
        profile = self.candidate_repo.get_by_id(candidate_profile_id)
        if not profile:
            raise ValueError("Candidate profile not found.")

        matches = self.match_repo.get_matches_for_candidate(candidate_profile_id)

        all_gap_skills = set()
        for match in matches:
            if match.gap_skills_json:
                gaps = json.loads(match.gap_skills_json)
                all_gap_skills.update(gaps)

        if not all_gap_skills:
            return []

        resources = self.learning_repo.get_by_skill_names(list(all_gap_skills))

        results = []
        for r in resources:
            try:
                explanation = self._generate_explanation_ai(r.title, r.skill.name)
            except GeminiUnavailableError:
                explanation = self._generate_explanation(r.title, r.skill.name)

            results.append({
                "id": r.id,
                "title": r.title,
                "provider": r.provider,
                "url": r.url,
                "skill_name": r.skill.name,
                "level": r.level,
                "explanation": explanation,
            })

        return results

    def _generate_explanation_ai(self, resource_title: str, skill_name: str) -> str:
        """
        Uses Gemini to generate a short explanation of why this
        learning resource will help close a candidate's skill gap.
        Raises GeminiUnavailableError on any failure so the caller
        falls back to _generate_explanation() below.
        """
        prompt = f"""Write ONE short sentence (max 20 words) explaining why the resource
"{resource_title}" would help someone build their "{skill_name}" skill. Write it directly
to the learner. No markdown. Return ONLY the sentence."""

        return call_gemini(prompt).strip()

    def _generate_explanation(self, resource_title: str, skill_name: str) -> str:
        """
        Deterministic, rule-based explanation — TalentAI's permanent
        FALLBACK learning-explanation generator, used automatically
        when Gemini is unavailable. See app/ai/README.md for details.
        """
        return f"Recommended to help you build your {skill_name} skill, based on gaps identified in your current job matches."
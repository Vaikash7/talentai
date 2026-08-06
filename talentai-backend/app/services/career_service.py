import json
from typing import List, Optional
from sqlalchemy.orm import Session

from app.repositories.candidate_repository import CandidateRepository
from app.repositories.career_repository import CareerRepository
from app.repositories.learning_repository import LearningRepository
from app.matching.scorer import calculate_match_score
from app.matching.career_tracks import CAREER_TRACKS
from app.ai.gemini_client import call_gemini, GeminiUnavailableError

READINESS_THRESHOLD = 70


class CareerService:
    def __init__(self, db: Session):
        self.db = db
        self.candidate_repo = CandidateRepository(db)
        self.career_repo = CareerRepository(db)
        self.learning_repo = LearningRepository(db)

    def list_tracks(self) -> List[dict]:
        return [
            {"key": key, "display_name": track["display_name"]}
            for key, track in CAREER_TRACKS.items()
        ]

    def get_career_path(self, candidate_profile_id, track_key: str) -> dict:
        profile = self.candidate_repo.get_by_id(candidate_profile_id)
        if not profile:
            raise ValueError("Candidate profile not found.")

        track = CAREER_TRACKS.get(track_key)
        if not track:
            raise ValueError(f"Unknown career track: '{track_key}'.")

        candidate_skills = [link.skill.name for link in profile.skills]

        stage_results = []
        current_stage_index = -1

        for idx, stage in enumerate(track["stages"]):
            required = [{"name": s, "is_mandatory": True} for s in stage["required_skills"]]
            result = calculate_match_score(candidate_skills, required)

            stage_results.append({
                "role": stage["role"],
                "required_skills": stage["required_skills"],
                "matched_skills": result.matched_skills,
                "missing_skills": result.gap_skills,
                "readiness_score": result.score,
            })

            if result.score >= READINESS_THRESHOLD:
                current_stage_index = idx

        recommended_next_index = current_stage_index + 1
        for idx, stage_result in enumerate(stage_results):
            stage_result["is_current_stage"] = (idx == current_stage_index)
            stage_result["is_recommended_next"] = (
                idx == recommended_next_index and idx < len(stage_results)
            )

        headline_index = min(recommended_next_index, len(stage_results) - 1)
        headline_stage = stage_results[headline_index]

        # Try Gemini for a richer explanation first; fall back to the
        # deterministic rule-based rationale (unchanged) if unavailable.
        try:
            rationale = self._generate_rationale_ai(
                track["display_name"], headline_stage, current_stage_index
            )
        except GeminiUnavailableError:
            rationale = self._generate_rationale(
                track["display_name"], headline_stage, current_stage_index
            )

        recommended_learning = []
        if headline_stage["missing_skills"]:
            resources = self.learning_repo.get_by_skill_names(headline_stage["missing_skills"])
            recommended_learning = [
                {
                    "id": r.id,
                    "title": r.title,
                    "provider": r.provider,
                    "url": r.url,
                    "skill_name": r.skill.name,
                    "level": r.level,
                }
                for r in resources
            ]

        target_role = track["display_name"]
        self.career_repo.create_recommendation(
            candidate_profile_id=profile.id,
            target_role=target_role,
            path_steps_json=json.dumps(stage_results),
        )

        return {
            "track_key": track_key,
            "track_display_name": track["display_name"],
            "stages": stage_results,
            "generated_at": None,
            "readiness_score": headline_stage["readiness_score"],
            "recommended_next_role": headline_stage["role"],
            "current_skills": headline_stage["matched_skills"],
            "missing_skills": headline_stage["missing_skills"],
            "rationale": rationale,
            "recommended_learning": recommended_learning,
        }

    def get_top_recommendations(self, candidate_profile_id, limit: int = 3) -> List[dict]:
        all_results = []
        for track_key in CAREER_TRACKS.keys():
            try:
                result = self.get_career_path(candidate_profile_id, track_key)
                all_results.append(result)
            except ValueError:
                continue

        all_results.sort(key=lambda r: r["readiness_score"], reverse=True)
        return all_results[:limit]

    def _generate_rationale_ai(self, track_name: str, headline_stage: dict, current_stage_index: int) -> str:
        """
        Uses Gemini to generate a natural-language explanation of why
        a career path/stage is recommended, given the same readiness
        data the deterministic logic already computed. Raises
        GeminiUnavailableError on any failure so the caller falls back
        to _generate_rationale() below.
        """
        matched = ", ".join(headline_stage["matched_skills"]) if headline_stage["matched_skills"] else "none yet"
        missing = ", ".join(headline_stage["missing_skills"]) if headline_stage["missing_skills"] else "none"
        status = "just starting out on" if current_stage_index == -1 else "progressing well on"

        prompt = f"""Write a brief (2-3 sentence), encouraging, professional explanation for
why the "{track_name}" career path is recommended for this candidate, who is {status} this path.

They are {headline_stage['readiness_score']}% ready for the role "{headline_stage['role']}".
Current strengths: {matched}
Skills to develop: {missing}

Write it directly to the candidate. Do not use markdown formatting. Return ONLY the
explanation text, nothing else."""

        return call_gemini(prompt).strip()

    def _generate_rationale(self, track_name: str, headline_stage: dict, current_stage_index: int) -> str:
        """
        Deterministic, rule-based explanation — TalentAI's permanent
        FALLBACK career rationale generator, used automatically when
        Gemini (_generate_rationale_ai) is unavailable. See
        app/ai/README.md for details.
        """
        score = headline_stage["readiness_score"]
        matched = ", ".join(headline_stage["matched_skills"]) if headline_stage["matched_skills"] else "none yet"
        missing = ", ".join(headline_stage["missing_skills"]) if headline_stage["missing_skills"] else "none"

        if current_stage_index == -1:
            opening = f"You're at the start of the {track_name} path."
        else:
            opening = f"You're progressing well on the {track_name} path."

        return (
            f"{opening} You're {score}% ready for '{headline_stage['role']}'. "
            f"Current strengths: {matched}. To advance, focus on: {missing}."
        )
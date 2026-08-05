import json
from typing import List, Optional
from sqlalchemy.orm import Session

from app.repositories.candidate_repository import CandidateRepository
from app.repositories.career_repository import CareerRepository
from app.matching.scorer import calculate_match_score
from app.matching.career_tracks import CAREER_TRACKS

READINESS_THRESHOLD = 70


class CareerService:
    def __init__(self, db: Session):
        self.db = db
        self.candidate_repo = CandidateRepository(db)
        self.career_repo = CareerRepository(db)

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
        current_stage_index = -1  # -1 means "not yet qualified for stage 1"

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

        # Mark current stage and recommended next stage
        recommended_next_index = current_stage_index + 1
        for idx, stage_result in enumerate(stage_results):
            stage_result["is_current_stage"] = (idx == current_stage_index)
            stage_result["is_recommended_next"] = (
                idx == recommended_next_index and idx < len(stage_results)
            )

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
            "generated_at": None,  # set fresh each call; history is in the DB if needed later
        }
import json
from typing import List
from sqlalchemy.orm import Session

from app.repositories.learning_repository import LearningRepository
from app.repositories.match_repository import MatchRepository
from app.repositories.candidate_repository import CandidateRepository


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

        # Collect the union of all gap skills across every job match
        all_gap_skills = set()
        for match in matches:
            if match.gap_skills_json:
                gaps = json.loads(match.gap_skills_json)
                all_gap_skills.update(gaps)

        if not all_gap_skills:
            return []

        resources = self.learning_repo.get_by_skill_names(list(all_gap_skills))

        return [
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
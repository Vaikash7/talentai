import json
from typing import Optional, List
from sqlalchemy.orm import Session

from app.db.models.match import Match
from app.repositories.base_repository import BaseRepository


class MatchRepository(BaseRepository[Match]):
    def __init__(self, db: Session):
        super().__init__(Match, db)

    def get_by_job_and_candidate(self, job_id, candidate_profile_id) -> Optional[Match]:
        return (
            self.db.query(Match)
            .filter(
                Match.job_id == job_id,
                Match.candidate_profile_id == candidate_profile_id,
            )
            .first()
        )

    def upsert(
        self,
        job_id,
        candidate_profile_id,
        score: int,
        matched_skills: List[str],
        gap_skills: List[str],
        ai_rationale: Optional[str] = None,
    ) -> Match:
        existing = self.get_by_job_and_candidate(job_id, candidate_profile_id)

        if existing:
            existing.score = score
            existing.matched_skills_json = json.dumps(matched_skills)
            existing.gap_skills_json = json.dumps(gap_skills)
            if ai_rationale is not None:
                existing.ai_rationale = ai_rationale
            self.db.commit()
            self.db.refresh(existing)
            return existing

        new_match = Match(
            job_id=job_id,
            candidate_profile_id=candidate_profile_id,
            score=score,
            matched_skills_json=json.dumps(matched_skills),
            gap_skills_json=json.dumps(gap_skills),
            ai_rationale=ai_rationale,
        )
        self.db.add(new_match)
        self.db.commit()
        self.db.refresh(new_match)
        return new_match

    def get_matches_for_candidate(self, candidate_profile_id) -> List[Match]:
        return (
            self.db.query(Match)
            .filter(Match.candidate_profile_id == candidate_profile_id)
            .order_by(Match.score.desc())
            .all()
        )

    def get_matches_for_job(self, job_id) -> List[Match]:
        return (
            self.db.query(Match)
            .filter(Match.job_id == job_id)
            .order_by(Match.score.desc())
            .all()
        )
import json
from typing import List
from sqlalchemy.orm import Session

from app.db.models.job import Job
from app.db.models.candidate import CandidateProfile
from app.db.models.match import Match
from app.repositories.job_repository import JobRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.match_repository import MatchRepository
from app.matching.scorer import calculate_match_score


class MatchingService:
    def __init__(self, db: Session):
        self.db = db
        self.job_repo = JobRepository(db)
        self.candidate_repo = CandidateRepository(db)
        self.match_repo = MatchRepository(db)

    def _get_candidate_skill_names(self, profile: CandidateProfile) -> List[str]:
        return [link.skill.name for link in profile.skills]

    def _get_job_required_skills(self, job: Job) -> List[dict]:
        return [
            {"name": link.skill.name, "is_mandatory": link.is_mandatory}
            for link in job.required_skills
        ]

    def compute_match(self, job: Job, profile: CandidateProfile) -> Match:
        candidate_skills = self._get_candidate_skill_names(profile)
        required_skills = self._get_job_required_skills(job)

        result = calculate_match_score(candidate_skills, required_skills)

        return self.match_repo.upsert(
            job_id=job.id,
            candidate_profile_id=profile.id,
            score=result.score,
            matched_skills=result.matched_skills,
            gap_skills=result.gap_skills,
        )

    def get_matches_for_candidate(self, candidate_profile_id) -> List[dict]:
        profile = self.candidate_repo.get_by_id(candidate_profile_id)
        if not profile:
            raise ValueError("Candidate profile not found.")

        open_jobs = self.job_repo.get_open_jobs()

        results = []
        for job in open_jobs:
            match = self.compute_match(job, profile)
            results.append(self._match_to_dict(match, job=job))

        results.sort(key=lambda m: m["score"], reverse=True)
        return results

    def get_matches_for_job(self, job_id) -> List[dict]:
        job = self.job_repo.get_by_id(job_id)
        if not job:
            raise ValueError("Job not found.")

        all_profiles = self.db.query(CandidateProfile).all()

        results = []
        for profile in all_profiles:
            match = self.compute_match(job, profile)
            results.append(self._match_to_dict(match, candidate_profile=profile))

        results.sort(key=lambda m: m["score"], reverse=True)
        return results

    def _match_to_dict(self, match: Match, job: Job = None, candidate_profile: CandidateProfile = None) -> dict:
        return {
            "match_id": match.id,
            "job_id": match.job_id,
            "candidate_profile_id": match.candidate_profile_id,
            "score": match.score,
            "matched_skills": json.loads(match.matched_skills_json) if match.matched_skills_json else [],
            "gap_skills": json.loads(match.gap_skills_json) if match.gap_skills_json else [],
            "ai_rationale": match.ai_rationale,
            "job_title": job.title if job else None,
            "candidate_summary": candidate_profile.summary if candidate_profile else None,
        }
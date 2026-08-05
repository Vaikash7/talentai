import json
from typing import List
from sqlalchemy.orm import Session

from app.db.models.job import Job
from app.db.models.candidate import CandidateProfile
from app.db.models.match import Match
from app.repositories.job_repository import JobRepository
from app.repositories.candidate_repository import CandidateRepository
from app.repositories.match_repository import MatchRepository
from app.matching.scorer import calculate_match_score, ScoreResult


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
        rationale = self._generate_rationale(result, required_skills)

        return self.match_repo.upsert(
            job_id=job.id,
            candidate_profile_id=profile.id,
            score=result.score,
            matched_skills=result.matched_skills,
            gap_skills=result.gap_skills,
            ai_rationale=rationale,
        )

    def _generate_rationale(self, result: ScoreResult, required_skills: List[dict]) -> str:
        """
        Deterministic, rule-based explanation of a match score — built
        from the same data the scorer already computed. This is
        TalentAI's permanent rationale generator; no external AI
        provider is used. See app/ai/README.md for how an AI-based
        rationale generator could be plugged in here in the future
        without changing anything else in this file.
        """
        mandatory_names = {r["name"] for r in required_skills if r.get("is_mandatory", True)}
        matched_set = set(result.matched_skills)
        gap_set = set(result.gap_skills)

        missing_mandatory = sorted(gap_set & mandatory_names)
        missing_optional = sorted(gap_set - mandatory_names)

        matched_list = ", ".join(sorted(result.matched_skills)) if result.matched_skills else "none"

        if result.score >= 90:
            opening = "Excellent match."
        elif result.score >= 70:
            opening = "Strong match."
        elif result.score >= 40:
            opening = "Partial match."
        else:
            opening = "Limited match."

        parts = [opening, f"Matched skills: {matched_list}."]

        if missing_mandatory:
            parts.append(
                f"Missing required skill(s): {', '.join(missing_mandatory)}."
            )
        if missing_optional:
            parts.append(
                f"Missing preferred (optional) skill(s): {', '.join(missing_optional)}."
            )
        if not missing_mandatory and not missing_optional:
            parts.append("Candidate meets all listed requirements.")

        return " ".join(parts)

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

        # Internal Mobility: for internal project postings, surface internal
        # employees first (same scores are preserved — this only reorders
        # the list, it never changes or filters the underlying scores).
        if job.job_type.value == "project":
            results.sort(
                key=lambda m: (m["candidate_employee_type"] != "internal", -m["score"])
            )
        else:
            results.sort(key=lambda m: m["score"], reverse=True)

        return results

    def _match_to_dict(self, match: Match, job: Job = None, candidate_profile: CandidateProfile = None) -> dict:
        # candidate_employee_type is resolved either from the profile passed
        # directly (recruiter-facing view) or looked up via the match's
        # own candidate_profile relationship (candidate-facing view), so
        # both directions expose this field consistently.
        resolved_profile = candidate_profile or match.candidate_profile
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
            "candidate_employee_type": resolved_profile.employee_type if resolved_profile else None,
        }
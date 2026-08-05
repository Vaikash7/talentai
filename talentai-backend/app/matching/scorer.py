from typing import List, Dict
from dataclasses import dataclass


@dataclass
class ScoreResult:
    score: int  # 0-100
    matched_skills: List[str]
    gap_skills: List[str]


def calculate_match_score(
    candidate_skills: List[str],
    required_skills: List[Dict],  # each: {"name": str, "is_mandatory": bool}
) -> ScoreResult:
    """
    Computes a 0-100 skill-overlap score between a candidate and a job.

    Mandatory required skills are weighted 2x, optional required skills
    weighted 1x, so covering "must-haves" matters more than covering
    a larger number of "nice-to-haves".
    """
    if not required_skills:
        # A job with no listed requirements can't be meaningfully scored.
        return ScoreResult(score=0, matched_skills=[], gap_skills=[])

    candidate_skills_lower = {s.strip().lower() for s in candidate_skills}

    matched_skills = []
    gap_skills = []
    total_weight = 0.0
    earned_weight = 0.0

    for req in required_skills:
        skill_name = req["name"]
        is_mandatory = req.get("is_mandatory", True)
        weight = 2.0 if is_mandatory else 1.0
        total_weight += weight

        if skill_name.strip().lower() in candidate_skills_lower:
            matched_skills.append(skill_name)
            earned_weight += weight
        else:
            gap_skills.append(skill_name)

    score = round((earned_weight / total_weight) * 100) if total_weight > 0 else 0

    return ScoreResult(score=score, matched_skills=matched_skills, gap_skills=gap_skills)
from typing import Optional, List
from sqlalchemy.orm import Session

from app.db.models.candidate import CandidateProfile, CandidateSkill
from app.db.models.skill import Skill
from app.repositories.base_repository import BaseRepository


class CandidateRepository(BaseRepository[CandidateProfile]):
    def __init__(self, db: Session):
        super().__init__(CandidateProfile, db)

    def get_by_user_id(self, user_id) -> Optional[CandidateProfile]:
        return (
            self.db.query(CandidateProfile)
            .filter(CandidateProfile.user_id == user_id)
            .first()
        )

    def get_or_create_skill(self, skill_name: str) -> Skill:
        skill_name_clean = skill_name.strip()
        skill = (
            self.db.query(Skill)
            .filter(Skill.name.ilike(skill_name_clean))
            .first()
        )
        if skill:
            return skill

        skill = Skill(name=skill_name_clean, category=None)
        self.db.add(skill)
        self.db.flush()  # get generated id without full commit yet
        return skill

    def replace_skills(
        self, candidate_profile: CandidateProfile, skill_names: List[str]
    ) -> None:
        """
        Clears this candidate's existing skill links and creates fresh
        ones based on the newly parsed resume. Master skill rows are
        never deleted — only the candidate's links to them.
        """
        # Remove existing links for this profile
        self.db.query(CandidateSkill).filter(
            CandidateSkill.candidate_profile_id == candidate_profile.id
        ).delete()

        for skill_name in skill_names:
            skill = self.get_or_create_skill(skill_name)
            link = CandidateSkill(
                candidate_profile_id=candidate_profile.id,
                skill_id=skill.id,
            )
            self.db.add(link)

        self.db.commit()
        self.db.refresh(candidate_profile)
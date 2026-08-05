from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.models.learning import LearningResource
from app.db.models.skill import Skill
from app.repositories.base_repository import BaseRepository


class LearningRepository(BaseRepository[LearningResource]):
    def __init__(self, db: Session):
        super().__init__(LearningResource, db)

    def get_by_skill_names(self, skill_names: List[str]) -> List[LearningResource]:
        """
        Returns learning resources tagged with any of the given skill
        names (case-insensitive). Used to recommend courses that
        address a candidate's skill gaps.
        """
        if not skill_names:
            return []

        skill_names_lower = [s.strip().lower() for s in skill_names]

        return (
            self.db.query(LearningResource)
            .join(Skill, LearningResource.skill_id == Skill.id)
            .filter(func.lower(Skill.name).in_(skill_names_lower))
            .all()
        )
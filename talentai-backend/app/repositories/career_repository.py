from typing import Optional
from sqlalchemy.orm import Session

from app.db.models.career import CareerPath
from app.repositories.base_repository import BaseRepository


class CareerRepository(BaseRepository[CareerPath]):
    def __init__(self, db: Session):
        super().__init__(CareerPath, db)

    def get_latest_for_candidate(
        self, candidate_profile_id, target_role: str
    ) -> Optional[CareerPath]:
        return (
            self.db.query(CareerPath)
            .filter(
                CareerPath.candidate_profile_id == candidate_profile_id,
                CareerPath.target_role == target_role,
            )
            .order_by(CareerPath.generated_at.desc())
            .first()
        )

    def create_recommendation(
        self, candidate_profile_id, target_role: str, path_steps_json: str
    ) -> CareerPath:
        career_path = CareerPath(
            candidate_profile_id=candidate_profile_id,
            target_role=target_role,
            path_steps_json=path_steps_json,
        )
        self.db.add(career_path)
        self.db.commit()
        self.db.refresh(career_path)
        return career_path
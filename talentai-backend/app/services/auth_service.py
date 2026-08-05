from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.models.user import User, UserRole
from app.db.models.candidate import CandidateProfile, EmployeeType
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, data: RegisterRequest) -> User:
        if self.user_repo.email_exists(data.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email already exists.",
            )

        new_user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            full_name=data.full_name,
            role=data.role,
        )
        created_user = self.user_repo.create(new_user)

        # Candidates get their profile created immediately at registration
        # (rather than on first resume upload), so employee_type can be
        # captured up front as required by the platform's internal/external
        # mobility model.
        if created_user.role == UserRole.candidate:
            profile = CandidateProfile(
                user_id=created_user.id,
                employee_type=data.employee_type or EmployeeType.external,
            )
            self.db.add(profile)
            self.db.commit()

        return created_user

    def authenticate(self, data: LoginRequest) -> User:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
            )
        return user

    def create_token_for_user(self, user: User) -> str:
        return create_access_token(
            data={"sub": str(user.id), "role": user.role.value}
        )
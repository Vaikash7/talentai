import uuid
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

from app.db.models.user import UserRole
from app.db.models.candidate import EmployeeType


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1, max_length=255)
    role: UserRole
    employee_type: Optional[EmployeeType] = None  # only meaningful when role == candidate


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: UserRole

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
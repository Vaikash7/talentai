from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.security import require_role
from app.db.models.user import User
from app.services.admin_service import AdminService
from app.schemas.admin import UserSummaryOut, AdminStatsOut

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users", response_model=List[UserSummaryOut])
def list_users(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    service = AdminService(db)
    return service.list_all_users()


@router.get("/stats", response_model=AdminStatsOut)
def get_stats(
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
):
    service = AdminService(db)
    return service.get_stats()
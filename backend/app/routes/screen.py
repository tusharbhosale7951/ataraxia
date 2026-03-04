from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.core.database import get_db
from app.models.user import User
from app.models.session import ScreenSession
from app.schemas.screen import SessionCreate, ScreenStatsOut
from app.core.security import get_current_user

router = APIRouter()

@router.post("/session")
async def log_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check if a session already exists for this date
    existing = db.query(ScreenSession).filter(
        ScreenSession.user_id == current_user.id,
        ScreenSession.date == session_data.date
    ).first()
    if existing:
        existing.total_minutes += session_data.total_minutes
    else:
        new_session = ScreenSession(
            user_id=current_user.id,
            date=session_data.date,
            total_minutes=session_data.total_minutes
        )
        db.add(new_session)
    db.commit()
    return {"message": "Session logged"}

@router.get("/stats", response_model=ScreenStatsOut)
async def get_screen_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()
    # Get today's session
    today_session = db.query(ScreenSession).filter(
        ScreenSession.user_id == current_user.id,
        ScreenSession.date == today
    ).first()
    today_minutes = today_session.total_minutes if today_session else 0

    # Get last 7 days average
    week_ago = today - timedelta(days=7)
    weekly_sessions = db.query(ScreenSession).filter(
        ScreenSession.user_id == current_user.id,
        ScreenSession.date >= week_ago
    ).all()
    total_week_minutes = sum(s.total_minutes for s in weekly_sessions)
    weekly_average = total_week_minutes / 7 if total_week_minutes > 0 else 0

    return ScreenStatsOut(
        today_minutes=today_minutes,
        goal_minutes=current_user.screen_time_goal,
        weekly_average=weekly_average
    )
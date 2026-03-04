from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.core.database import get_db
from app.models.user import User
from app.models.forest_session import ForestSession
from app.schemas.forest import ForestSessionCreate, ForestSessionOut
from app.core.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/session")
async def log_forest_session(
    session_data: ForestSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a forest bathing session."""
    new_session = ForestSession(
        user_id=current_user.id,
        duration_minutes=session_data.duration_minutes,
        soundscape=session_data.soundscape
    )
    db.add(new_session)
    db.commit()
    return {"message": "Forest session logged", "id": new_session.id}

@router.get("/stats")
async def get_forest_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get forest bathing statistics."""
    today = date.today()
    week_ago = today - timedelta(days=7)
    
    weekly = db.query(ForestSession).filter(
        ForestSession.user_id == current_user.id,
        ForestSession.created_at >= week_ago
    ).all()
    
    total_minutes = sum(s.duration_minutes for s in weekly)
    sessions_count = len(weekly)
    
    favorite = db.query(
        ForestSession.soundscape,
        func.count(ForestSession.soundscape).label('count')
    ).filter(
        ForestSession.user_id == current_user.id
    ).group_by(ForestSession.soundscape).order_by(func.count().desc()).first()
    
    return {
        "weekly_minutes": total_minutes,
        "sessions_count": sessions_count,
        "favorite_soundscape": favorite[0] if favorite else None
    }
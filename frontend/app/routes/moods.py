from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.mood import Mood
from app.models.user import User
from app.schemas.mood import MoodCreate, MoodOut
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=dict)
async def log_mood(
    mood_data: MoodCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Log a new mood entry for the authenticated user.
    """
    new_mood = Mood(
        user_id=current_user.id,
        mood=mood_data.mood,
        note=mood_data.note or ""
    )
    db.add(new_mood)
    db.commit()
    db.refresh(new_mood)
    return {"id": new_mood.id, "message": "Mood logged successfully"}

@router.get("/", response_model=List[MoodOut])
async def get_moods(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 50
):
    """
    Retrieve recent mood entries for the authenticated user.
    """
    moods = db.query(Mood).filter(Mood.user_id == current_user.id).order_by(Mood.created_at.desc()).limit(limit).all()
    
    # Convert SQLAlchemy objects to response dicts with UTC indicator
    result = []
    for mood in moods:
        # Append 'Z' to ISO datetime to indicate UTC (prevents frontend timezone misinterpretation)
        created_at_iso = mood.created_at.isoformat() + 'Z'
        result.append({
            "id": mood.id,
            "mood": mood.mood,
            "note": mood.note,
            "created_at": created_at_iso
        })
    return result
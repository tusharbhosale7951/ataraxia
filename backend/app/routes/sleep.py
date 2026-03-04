from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter()

@router.get("/debt")
async def get_sleep_debt(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Calculate sleep debt based on last 7 days."""
    # Mock calculation – in real app, would use actual sleep data
    recommended = current_user.sleep_goal_hours or 8
    last_week = [7.5, 6.2, 8.1, 5.5, 7.8, 6.9, 8.2]  # Mock data
    
    total = sum(last_week)
    avg = total / 7
    debt = recommended - avg
    
    if debt > 1:
        feedback = "You're running low on sleep. Try to rest 30 min earlier tonight."
    elif debt > 0:
        feedback = "Small sleep debt. A quick power nap could help."
    else:
        feedback = "Great sleep consistency! You're in the optimal range."
    
    return {
        "debt_hours": round(debt, 1),
        "avg_hours": round(avg, 1),
        "recommended": recommended,
        "feedback": feedback,
        "stability_score": 85
    }
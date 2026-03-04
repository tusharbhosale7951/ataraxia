from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.core.database import get_db
from app.models.user import User
from app.models.mood import Mood
from app.models.session import ScreenSession
from app.core.security import get_current_user
from app.services.nvidia import get_insight_from_nvidia
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/overview")
async def get_period_overview(
    period: str = Query(..., pattern="^(week|month|year)$"),  # ✅ fixed here
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get mood and screen time overview for a given period (week/month/year).
    """
    today = date.today()
    
    if period == "week":
        start_date = today - timedelta(days=7)
    elif period == "month":
        start_date = today - timedelta(days=30)
    else:  # year
        start_date = today - timedelta(days=365)
    
    moods = db.query(Mood).filter(
        Mood.user_id == current_user.id,
        Mood.created_at >= start_date
    ).order_by(Mood.created_at).all()
    
    screen_data = db.query(
        ScreenSession.date,
        func.sum(ScreenSession.total_minutes).label('total_minutes')
    ).filter(
        ScreenSession.user_id == current_user.id,
        ScreenSession.date >= start_date
    ).group_by(ScreenSession.date).order_by(ScreenSession.date).all()
    
    # Prepare mood data by day
    mood_by_day = {}
    for mood in moods:
        day = mood.created_at.date().isoformat()
        if day not in mood_by_day:
            mood_by_day[day] = {'calm':0, 'happy':0, 'neutral':0, 'anxious':0, 'sad':0}
        mood_by_day[day][mood.mood] += 1
    
    mood_chart = [{'date': day, **counts} for day, counts in mood_by_day.items()]
    screen_chart = [{'date': s.date.isoformat(), 'minutes': s.total_minutes} for s in screen_data]
    
    total_moods = len(moods)
    avg_screen = sum(s.total_minutes for s in screen_data) / len(screen_data) if screen_data else 0
    
    # Generate insight
    mood_summary = [{'date': m.created_at.isoformat(), 'mood': m.mood, 'note': m.note} for m in moods]
    screen_summary = [{'date': s.date.isoformat(), 'minutes': s.total_minutes} for s in screen_data]
    
    insight = "You're doing great! Keep up the consistency."
    if mood_summary or screen_summary:
        try:
            insight = await get_insight_from_nvidia(mood_summary, screen_summary)
        except Exception as e:
            logger.error(f"Insight generation failed: {e}")
    
    return {
        "period": period,
        "start_date": start_date.isoformat(),
        "end_date": today.isoformat(),
        "total_moods": total_moods,
        "avg_screen_minutes": round(avg_screen, 1),
        "mood_chart": mood_chart,
        "screen_chart": screen_chart,
        "insight": insight
    }
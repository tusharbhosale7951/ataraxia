from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.core.database import get_db
from app.models.user import User
from app.models.habit import Habit
from app.models.habit_log import HabitLog
from app.schemas.habit import HabitCreate, HabitOut, HabitLogCreate
from app.core.security import get_current_user
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/habits", response_model=HabitOut)
async def create_habit(
    habit_data: HabitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new habit."""
    habit = Habit(
        user_id=current_user.id,
        title=habit_data.title,
        category=habit_data.category,
        target_minutes=habit_data.target_minutes
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit

@router.get("/habits", response_model=list[HabitOut])
async def get_habits(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all habits for user."""
    habits = db.query(Habit).filter(
        Habit.user_id == current_user.id,
        Habit.is_active == True
    ).all()
    
    # Calculate streaks
    for habit in habits:
        logs = db.query(HabitLog).filter(
            HabitLog.habit_id == habit.id
        ).order_by(HabitLog.completed_date.desc()).all()
        
        # Simple streak calculation (consecutive days)
        streak = 0
        check_date = date.today()
        while True:
            log = next((l for l in logs if l.completed_date == check_date), None)
            if log:
                streak += 1
                check_date -= timedelta(days=1)
            else:
                break
        habit.current_streak = streak
        
    db.commit()
    return habits

@router.post("/habits/log")
async def log_habit(
    log_data: HabitLogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log habit completion."""
    habit = db.query(Habit).filter(Habit.id == log_data.habit_id).first()
    if not habit or habit.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    log = HabitLog(
        habit_id=habit.id,
        completed_date=log_data.completed_date,
        minutes_spent=log_data.minutes_spent,
        notes=log_data.notes
    )
    db.add(log)
    db.commit()
    
    # Update streak
    logs = db.query(HabitLog).filter(
        HabitLog.habit_id == habit.id
    ).order_by(HabitLog.completed_date.desc()).all()
    
    streak = 0
    check_date = date.today()
    while True:
        log_entry = next((l for l in logs if l.completed_date == check_date), None)
        if log_entry:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break
    
    habit.current_streak = streak
    if streak > habit.longest_streak:
        habit.longest_streak = streak
    
    db.commit()
    return {"message": "Habit logged", "streak": streak}
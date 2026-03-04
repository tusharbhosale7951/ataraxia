from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional, List

class HabitLogCreate(BaseModel):
    habit_id: int
    minutes_spent: int
    notes: Optional[str] = None
    completed_date: date = date.today()

class HabitLogOut(BaseModel):
    id: int
    completed_date: date
    minutes_spent: int
    notes: Optional[str]
    
    class Config:
        from_attributes = True

class HabitCreate(BaseModel):
    title: str
    category: str
    target_minutes: int = 5

class HabitOut(BaseModel):
    id: int
    title: str
    category: str
    target_minutes: int
    current_streak: int
    longest_streak: int
    is_active: bool
    logs: List[HabitLogOut] = []
    
    class Config:
        from_attributes = True
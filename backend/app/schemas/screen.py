from pydantic import BaseModel
from datetime import date

class SessionCreate(BaseModel):
    total_minutes: int
    date: date

class SessionOut(BaseModel):
    id: int
    date: date
    total_minutes: int

class ScreenStatsOut(BaseModel):
    today_minutes: int
    goal_minutes: int
    weekly_average: float
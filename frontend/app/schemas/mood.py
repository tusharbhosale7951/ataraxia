from pydantic import BaseModel
from typing import Optional

class MoodCreate(BaseModel):
    mood: str  # 'calm', 'happy', 'neutral', 'anxious', 'sad'
    note: Optional[str] = ""

class MoodOut(BaseModel):
    id: str
    mood: str
    note: Optional[str]
    created_at: str
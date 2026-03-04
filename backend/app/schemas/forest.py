from pydantic import BaseModel
from datetime import datetime

class ForestSessionCreate(BaseModel):
    duration_minutes: int
    soundscape: str

class ForestSessionOut(BaseModel):
    id: int
    duration_minutes: int
    soundscape: str
    created_at: datetime

    class Config:
        from_attributes = True
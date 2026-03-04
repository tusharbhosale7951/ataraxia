from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class ForestSession(Base):
    __tablename__ = "forest_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    duration_minutes = Column(Integer)
    soundscape = Column(String(50))  # 'forest', 'stream', 'rain', 'wind'
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="forest_sessions")
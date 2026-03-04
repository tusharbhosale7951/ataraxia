from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    screen_time_goal = Column(Integer, default=30)
    sleep_goal_hours = Column(Integer, default=8)
    avg_sleep_hours = Column(Integer, default=0)
    sleep_stability = Column(Integer, default=0)  # 0-100 score

    moods = relationship("Mood", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("ScreenSession", back_populates="user", cascade="all, delete-orphan")
    forest_sessions = relationship("ForestSession", back_populates="user", cascade="all, delete-orphan")   # ✅ New
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
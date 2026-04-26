from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, moods, chat, screen, insights, forest, habits, sleep
from app.core.database import init_db
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database with retries
try:
    init_db()
except Exception as e:
    logger.error(f"FATAL: Could not initialize database: {e}")
    # Don't exit - let the app start anyway, but endpoints will fail
    # This allows Render to keep the service alive

app = FastAPI(title="Ataraxia API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ataraxia-rouge.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(moods.router, prefix="/api/moods", tags=["moods"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(screen.router, prefix="/api/screen", tags=["screen"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(forest.router, prefix="/api/forest", tags=["forest"])
app.include_router(habits.router, prefix="/api/habits", tags=["habits"])
app.include_router(sleep.router, prefix="/api/sleep", tags=["sleep"])

@app.get("/")
def root():
    return {"message": "Welcome to Ataraxia API"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, moods, chat, screen, insights, forest   # ✅ Added forest
from app.core.database import engine, Base
from app.routes import habits
from app.routes import sleep
# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Ataraxia API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
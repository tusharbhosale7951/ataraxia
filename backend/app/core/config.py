from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str  # MySQL connection string
    JWT_SECRET: str
    GEMINI_API_KEY: str = ""  # Optional, default empty
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields in .env (like old MONGODB_URI if present)

settings = Settings()
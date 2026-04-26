import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import time
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

# Optimized engine for Railway MySQL (external proxy)
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=3,               # Smaller pool for free tier
    max_overflow=5,            # Limit extra connections
    pool_timeout=30,           # Wait 30 seconds for a connection
    pool_recycle=180,          # Recycle every 3 minutes (important for proxy)
    pool_pre_ping=True,        # Test connection before using (CRITICAL)
    connect_args={
        "connect_timeout": 10,    # Don't wait forever for connection
        "read_timeout": 30,       # Read timeout
        "write_timeout": 30,      # Write timeout
        "charset": "utf8mb4",     # Proper charset
    }
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db(max_retries=5):
    """Initialize database with retry logic"""
    for attempt in range(max_retries):
        try:
            logger.info(f"Connecting to database (attempt {attempt + 1}/{max_retries})...")
            # Test connection
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            logger.info("✅ Database connection successful!")
            
            # Create tables
            Base.metadata.create_all(bind=engine)
            logger.info("✅ Tables created/verified!")
            return True
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # 1, 2, 4, 8 seconds
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                logger.error("❌ Failed to connect after all retries")
                raise
    return False
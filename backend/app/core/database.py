import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL contains a relative path for ssl_ca, replace it with absolute path
if DATABASE_URL and 'ssl_ca=backend/' in DATABASE_URL:
    # Get the absolute path to the backend directory (where ca.pem resides)
    # __file__ is /opt/render/project/src/backend/app/core/database.py
    # We need to go up three levels: core/ -> app/ -> backend/
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ca_path = os.path.join(base_dir, "ca.pem")
    # Replace the relative part with the absolute path
    DATABASE_URL = DATABASE_URL.replace('ssl_ca=backend/ca.pem', f'ssl_ca={ca_path}')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from .config import settings
from app.core.database import get_db
from app.models.user import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    print(f"🔐 Received token: {token[:20]}...")  # Print first 20 chars for debugging

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id_str = payload.get("sub")
        print(f"✅ Decoded payload: {payload}")
        print(f"👤 User ID from token: {user_id_str}")

        if user_id_str is None:
            print("❌ No 'sub' in token")
            raise HTTPException(status_code=401, detail="Invalid token")

        # Convert to int (since MySQL uses integer IDs)
        try:
            user_id = int(user_id_str)
        except ValueError:
            print(f"❌ User ID conversion error: {user_id_str} is not an integer")
            raise HTTPException(status_code=401, detail="Invalid token")

        print(f"🔍 Looking up user with ID: {user_id}")
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            print(f"❌ User with ID {user_id} not found in database")
            raise HTTPException(status_code=401, detail="User not found")

        print(f"✅ User found: {user.email}")
        return user

    except JWTError as e:
        print(f"❌ JWT decode error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid token")
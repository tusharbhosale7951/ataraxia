from datetime import datetime
from app.core.database import db
from bson import ObjectId

async def create_mood(user_id: str, mood: str, note: str = ""):
    mood_entry = {
        "user_id": ObjectId(user_id),
        "mood": mood,
        "note": note,
        "created_at": datetime.utcnow()
    }
    result = await db.db.moods.insert_one(mood_entry)
    return result.inserted_id

async def get_moods_by_user(user_id: str, limit: int = 50):
    cursor = db.db.moods.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).limit(limit)
    moods = await cursor.to_list(length=limit)
    for mood in moods:
        mood["_id"] = str(mood["_id"])
        mood["user_id"] = str(mood["user_id"])


async def get_user_by_id(user_id: str):
    from bson import ObjectId
    return await db.db.users.find_one({"_id": ObjectId(user_id)})
    
    return moods
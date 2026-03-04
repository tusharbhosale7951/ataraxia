import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def test():
    uri = "DATABASE_URL=mysql+pymysql://root:Siddu@1234@localhost:3306/ataraxia"
    client = AsyncIOMotorClient(uri)
    try:
        # The ping command is cheap and does not require auth
        await client.admin.command('ping')
        print("✅ MongoDB connection successful!")
    except Exception as e:
        print("❌ Connection failed:", e)
    finally:
        client.close()

asyncio.run(test())
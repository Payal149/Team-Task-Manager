import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "team_task_manager")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
projects_collection = db["projects"]
tasks_collection = db["tasks"]


async def init_indexes():
    await users_collection.create_index("email", unique=True)
    await projects_collection.create_index("createdBy")
    await projects_collection.create_index("members")
    await tasks_collection.create_index("projectId")
    await tasks_collection.create_index("assignedTo")

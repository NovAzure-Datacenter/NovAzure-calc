import motor.motor_asyncio
from app.core.config import settings

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        print("Connecting to MongoDB...")
        self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DETAILS)
        self.db = self.client[settings.DATABASE_NAME]
        print(f"Successfully connected to database: {settings.DATABASE_NAME}")

    def disconnect(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

    def get_database(self):
        return self.db

# Create a single, importable instance of the database manager
db_manager = Database()

def get_db():
    return db_manager.get_database() 
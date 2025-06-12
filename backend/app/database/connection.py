import motor.motor_asyncio
from app.core.config import settings

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self):
        """
        Establishes the connection to the MongoDB database.
        This should be called when the FastAPI application starts up.
        """
        print("Connecting to MongoDB...")
        self.client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_DETAILS)
        self.db = self.client[settings.DATABASE_NAME]
        print(f"Successfully connected to database: {settings.DATABASE_NAME}")

    def disconnect(self):
        """
        Closes the database connection.
        This should be called when the FastAPI application shuts down.
        """
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

    def get_database(self):
        """
        Returns the database instance.
        """
        return self.db

# Create a single, importable instance of the database manager
db_manager = Database()

def get_db():
    """
    Dependency function to be used in FastAPI routes to get a database instance.
    """
    return db_manager.get_database() 
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .database.connection import db_manager, get_db
from .routes.calculations import router as calculations_router
from motor.motor_asyncio import AsyncIOMotorDatabase

# Create the FastAPI app instance
app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
)

# Configure CORS
origins = [
    settings.CLIENT_ORIGIN_URL,
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
]
# You can add more origins from a comma-separated string in your .env if needed
# origins.extend(settings.ADDITIONAL_ORIGINS.split(','))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(calculations_router)


@app.on_event("startup")
async def startup_event():
    db_manager.connect()


@app.on_event("shutdown")
async def shutdown_event():
    db_manager.disconnect()


@app.get("/collections", tags=["Database Test"])
async def list_collections(db: AsyncIOMotorDatabase = Depends(get_db)):
    """
    A temporary endpoint to list all collections (tables) in the database
    to verify the connection is working.
    """
    try:
        collection_names = await db.list_collection_names()
        if not collection_names:
            return {"message": "Database is connected, but it has no collections yet."}
        return {"collections": collection_names}
    except Exception as e:
        # This will catch authentication errors etc.
        return {"error": f"An error occurred: {e}"}


@app.get("/", tags=["Root"])
async def read_root():
    """
    A simple endpoint to check if the API is running.
    """
    return {"message": f"Welcome to the {settings.APP_TITLE}!"}
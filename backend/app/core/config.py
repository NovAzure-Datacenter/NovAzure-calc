from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # MongoDB
    MONGO_DETAILS: str = os.getenv("MONGO_DETAILS", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "novazure-dev")

    # Application Info
    APP_TITLE: str = os.getenv("APP_TITLE", "NovAzure API")
    APP_VERSION: str = os.getenv("APP_VERSION", "0.1.0")
    APP_DESCRIPTION: str = os.getenv("APP_DESCRIPTION", "Backend API for NovAzure")

    # CORS
    CLIENT_ORIGIN_URL: str = os.getenv("CLIENT_ORIGIN_URL", "http://localhost:3000")

    # Security (for future JWT)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

# Create a single, importable instance of the settings
settings = Settings() 
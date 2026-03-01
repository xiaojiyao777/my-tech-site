from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://admin:admin123@localhost:5432/mytechsite"
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    APP_ENV: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "ODRISYSTEMS Dockerized Service Monitor"
    ENV: str = "development"
    
    # Database
    POSTGRES_USER: str = "odri_admin"
    POSTGRES_PASSWORD: str = "odri_secure_password_123"
    POSTGRES_DB: str = "odri_monitor_db"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: int = 5432
    DATABASE_URL: str = "postgresql+asyncpg://odri_admin:odri_secure_password_123@postgres:5432/odri_monitor_db"

    # Security
    SECRET_KEY: str = "super_secret_jwt_key_change_in_production_987654321"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Docker Socket / Host
    DOCKER_HOST: str = "unix://var/run/docker.sock"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

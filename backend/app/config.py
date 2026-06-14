from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Robo shop"
    debug: bool = True
    database_url: str = "postgresql+psycopg://postgres:admin@127.0.0.1:15432/postgres"
    cors_origins: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    static_dir: str = "static"
    images_dir: str = "static/images"

    class Config:
        env_file = ".env"

settings = Settings()
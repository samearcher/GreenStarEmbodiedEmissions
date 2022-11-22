from functools import lru_cache

from pydantic import BaseSettings


class Settings(BaseSettings):
    sqlalchemy_database_uri: str
    access_token_expire_minutes: float = 30
    refresh_token_expire_minutes: float = 60 * 24 * 7
    algorithm: str = "HS256"
    jwt_secret_key: str
    jwt_refresh_secret_key:str
    salt: str
    
    class Config:
        env_file = '~/Documents/fastApi_React/back_end/.env'


@lru_cache()
def get_settings():
    return Settings()

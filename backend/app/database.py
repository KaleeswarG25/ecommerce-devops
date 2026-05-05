from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import redis
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:new_password@localhost:5432/ecommerce"
)
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

# SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=False)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Redis client
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    try:
        # Test database connection
        with engine.connect() as conn:
            print("[db] PostgreSQL connected")

        # Test Redis connection
        redis_client.ping()
        print("[db] Redis connected")

    except Exception as e:
        print(f"[db] connection error: {e}")
        raise
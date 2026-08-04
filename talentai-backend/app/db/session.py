import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL is not set. Make sure you have a .env file "
        "with DATABASE_URL configured (see .env.example)."
    )

# echo=False keeps SQL query logs quiet in normal operation.
# pool_pre_ping=True checks that a connection is still alive before
# using it — important for Azure SQL Serverless, which can pause
# and drop idle connections after inactivity.
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """
    FastAPI dependency that provides a database session per request.
    Ensures the session is always closed, even if an error occurs.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
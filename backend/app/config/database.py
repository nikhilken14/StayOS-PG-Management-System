import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import Request
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Add it to your .env file, e.g.\n"
        "DATABASE_URL=postgresql+psycopg2://pguser:pgpassword@localhost:5432/pgmanagement"
    )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


from app.services import tenant  # Register SQLAlchemy tenant guards

def get_db(request: Request):
    db = SessionLocal()
    db.info["owner_id"] = getattr(request.state, "owner_id", None)
    try:
        yield db
    finally:
        db.close()
        tenant.owner_context.set(None)

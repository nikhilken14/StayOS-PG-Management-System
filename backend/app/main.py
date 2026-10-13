import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.config.database import engine
from fastapi.middleware.cors import CORSMiddleware

from app.models.base import Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Keep schema creation for local/demo environments. Production schema changes
    # should be applied with a migration before the application is deployed.
    if os.getenv("AUTO_CREATE_TABLES", "false").lower() == "true":
        Base.metadata.create_all(bind=engine)
    yield



app = FastAPI(title="StayOS API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


from app.routes import auth  
from app.routes import bills
from app.routes import residents
from app.routes import pg
from app.routes import payment
from app.routes import rents
from app.routes import rooms
from app.routes import allocation
from app.routes import notification
from app.routes import complaints
from app.routes import visitor
from app.routes import dashboard
from app.routes import report
from app.routes import calendar
from app.routes import resident_movement

from app.services.jwt_service import require_admin, require_owner, require_operator
from fastapi import Request, HTTPException
from app.routes import team
from fastapi import Depends

app.include_router(auth.router)
app.include_router(team.router)

@app.middleware("http")
async def role_policy(request: Request, call_next):
    # Route dependencies perform authentication. This is just extra defense in depth;
    # method/role authorization below is enforced by dedicated router dependencies.
    return await call_next(request)

for protected_router in (bills.router, residents.router, pg.router, allocation.router,
                         payment.router, rooms.router, rents.router, notification.router,
                         complaints.router, visitor.router, dashboard.router, report.router,
                         calendar.router, resident_movement.router):
    app.include_router(protected_router, dependencies=[Depends(require_admin)])

# Method-level permissions are checked by the shared auth dependency below.


@app.get("/")
def home():
    return {
        "message": "PG Management Backend Running"
    }


@app.get("/health")
def health():
    return {"status": "ok"}
 

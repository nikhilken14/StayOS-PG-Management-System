# StayOS backend

FastAPI + SQLAlchemy backend for the StayOS PG management application.

## Local setup

1. Create a PostgreSQL database named `pgmanagement`.
2. Copy `.env.example` to `.env`; set `DATABASE_URL`, a private random `JWT_SECRET_KEY`, and a generated Fernet `ENCRYPTION_KEY`.
3. Install Python 3.11+ and dependencies: `python -m pip install -r requirements.txt`.
4. Start the API from this directory: `uvicorn app.main:app --reload`.
5. Open `http://localhost:8000/docs`. Create the first admin with `/auth/signup`, then sign in via `/auth/login`.

`AUTO_CREATE_TABLES=true` is intended only for local setup. Production deployments should use a database migration workflow, set this to `false`, use TLS for the database connection, and configure `CORS_ORIGINS` as a comma-separated list of exact frontend origins. Do not commit `.env` or reuse local secrets in production.

The API returns `/health` for deployment health checks. All business routes require a valid bearer token; signup, login, password recovery, and reset remain public. Protect password recovery with a verified email flow before exposing this service to the public internet.

## Frontend API URL

The Vite development server proxies `/api` to `http://localhost:8000`. For a deployed frontend, set `VITE_API_BASE_URL` to the backend URL (for example `https://api.example.com`).

# StayOS — PG & Property Management Platform

**StayOS** is a web-based management platform for paying guest (PG) accommodations and rental properties. It brings property administration, resident operations, rent collection, and reporting into a single workspace.

> **Project status:** Active development. The owner/admin workspace model and operational modules are implemented, but production hardening and end-to-end security testing remain necessary.

## Features

- **Owner workspaces:** Create an owner account and manage properties in an isolated workspace.
- **Team & access:** Owners create, deactivate, reset passwords for, and remove admin accounts.
- **Properties & rooms:** Maintain PG locations, room inventory, capacity, and availability.
- **Residents & allocations:** Manage resident records, room/bed assignments, and vacancies.
- **Entry, exit & visitors:** Track resident movement and visitor check-in/check-out.
- **Finance:** Manage rent, payment records, bills, and collection overviews.
- **Complaints & notifications:** Track issues and send email notifications (SMTP setup required).
- **Dashboard & reports:** Review occupancy, collections, and operational data; export supported reports.
- **Calendar:** Existing calendar and memo functionality is preserved.
- **Responsive interface:** Shared sidebar, navigation, cards, and styling across the application.

## Tech stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | React 19, Vite 8, React Router 7, Axios, CSS |
| Backend        | Python, FastAPI, SQLAlchemy 2, Pydantic      |
| Database       | PostgreSQL (psycopg2)                        |
| Authentication | JWT bearer tokens, password hashing          |
| Email          | SMTP, encrypted stored SMTP credentials      |
| Reports        | ReportLab PDF generation                     |

## Project structure

```text
pg-management/
├── frontend/
│   ├── src/
│   │   ├── api/           # Configured Axios client
│   │   ├── components/    # Shared layout and UI elements
│   │   ├── pages/         # Dashboard and operational screens
│   │   └── styles/        # Application styling
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app/
│   │   ├── config/        # Database and security configuration
│   │   ├── models/        # SQLAlchemy models
│   │   ├── routes/        # FastAPI endpoints
│   │   ├── services/      # Business logic
│   │   └── main.py        # API application
│   ├── migrations/
│   │   └── 001_workspace.sql
│   └── requirements.txt
└── README.md
```

## Getting started

### Prerequisites

- Python 3.11 or newer
- Node.js compatible with Vite 8 and npm
- PostgreSQL server and a database for StayOS
- Git (optional)

### 1. Configure PostgreSQL

Create a dedicated local database, for example `pgmanagement`, and a database user with the appropriate permissions.

**New development database:** You can use automatic model table creation (`AUTO_CREATE_TABLES=true`) for local experiments only.

**Existing database:** Back up your data and review/run the workspace migration before starting the updated application:

```powershell
psql -h localhost -U postgres -d pgmanagement -v ON_ERROR_STOP=1 -f backend/migrations/001_workspace.sql
```

The migration is designed for the documented legacy schema and includes special handling for a **single** existing administrator. Do not apply it blindly to an unrelated, already-migrated, or production database.

### 2. Configure and start the backend

Open a terminal in the project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Create `backend/.env` with values appropriate for your environment:

```dotenv
DATABASE_URL=postgresql+psycopg2://pguser:YOUR_DB_PASSWORD@localhost:5432/pgmanagement
JWT_SECRET_KEY=REPLACE_WITH_A_LONG_RANDOM_SECRET
ENCRYPTION_KEY=REPLACE_WITH_A_VALID_FERNET_KEY
CORS_ORIGINS=http://localhost:5173
AUTO_CREATE_TABLES=true
OWNER_CAN_OPERATE=false
```

Generate secrets locally (do **not** use the example placeholders):

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Keep these values private. Preserve the original encryption key if data has already been encrypted with it. Set `AUTO_CREATE_TABLES=false` in production and apply reviewed schema migrations instead.

Start FastAPI:

```powershell
uvicorn app.main:app --reload
```

Backend endpoints:

- API: http://localhost:8000
- Swagger documentation: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 3. Configure and start the frontend

Open a **second** terminal from the project root:

```powershell
cd frontend
npm ci
npm run dev
```

Open **http://localhost:5173**. During local development, Vite proxies `/api` requests to `http://localhost:8000`.

For an explicitly configured API URL, create `frontend/.env.local`:

```dotenv
VITE_API_BASE_URL=http://localhost:8000
```

Do not put server secrets in `VITE_` variables; frontend environment variables are exposed to the browser bundle.

## Owner and admin workflow

1. **Owner signs up** through the public signup page and creates a workspace.
2. **Owner signs in** and can manage properties, rooms, team access, and SMTP configuration.
3. **Owner opens Team & Access** to create administrator accounts with initial credentials.
4. **Admin signs in** using the credentials supplied by the owner; admin self-registration is not part of the intended workflow.
5. **Admin manages operations** including residents, allocations, visitors, rent, payments, bills, and complaints.
6. **Owner supervises the workspace** through dashboards and reports. By default, many operational writes are admin-only; `OWNER_CAN_OPERATE=true` allows additional owner operations where implemented.

Both roles use the same login page. Backend authorization—not menu visibility alone—controls who may access or change data.

## Useful development commands

Frontend:

```powershell
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

Backend:

```powershell
cd backend
uvicorn app.main:app --reload
```

## Deployment overview

A possible hosting setup is **Netlify (frontend) + Render (FastAPI) + managed PostgreSQL**.

### Backend

- Set `DATABASE_URL`, `JWT_SECRET_KEY`, `ENCRYPTION_KEY`, and `CORS_ORIGINS` in the hosting platform's **secret/environment settings**.
- Run reviewed migrations against the production database, then set `AUTO_CREATE_TABLES=false`.
- Install backend requirements and start the ASGI service, for example:

  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
  ```

- Configure health checks to use `/health`.
- Use HTTPS and a secure managed database connection.

### Frontend

- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_BASE_URL` to your deployed **HTTPS backend URL** before building.
- Configure an SPA rewrite so browser refreshes on React Router routes serve `index.html`.
- Set backend `CORS_ORIGINS` to the exact deployed frontend origin.

## Security notes

- Passwords should be **hashed**, not reversibly encrypted.
- The application uses signed JWT bearer tokens and stores access tokens in browser local storage in the inspected source. For public production use, assess the XSS risk and consider an HttpOnly-cookie/session design.
- SMTP credentials are intended to be stored with encryption; protect `ENCRYPTION_KEY` and plan safe key rotation.
- Use tenant/workspace authorization on every business operation; test cross-workspace access before release.
- Do not commit `.env`, `.env.local`, backups, credentials, or private keys.
- Add rate limiting, verified-email account recovery, audit logging, automated tests, and a managed migration workflow before wide public release.

## Troubleshooting

**`column admin.role does not exist`** — Your PostgreSQL database still has the old schema. Confirm `DATABASE_URL` points to the expected database, back it up, and apply the reviewed workspace migration. SQLAlchemy `create_all()` does **not** update existing tables.

**Signup returns HTTP 500** — Check the backend traceback, schema state, and environment configuration. Do not delete production tables to resolve migration errors.

**Frontend cannot reach backend** — Ensure FastAPI is running on port 8000, the Vite proxy or `VITE_API_BASE_URL` is correct, and `CORS_ORIGINS` includes the frontend origin.

**Owner cannot access Team & Access** — Check that the account's `role` is `OWNER`, sign out and back in, then inspect the `/admins` response in browser developer tools.

**Vite fails parsing JSX** — Run `npm run build` and inspect the specific component and reported line for a syntax error.

## Roadmap

- Fully unify forms, tables, dialogs, and empty/loading states across operational pages.
- Add automated frontend/backend tests and CI checks.
- Introduce Alembic-managed schema migrations.
- Harden session management and account recovery.
- Expand financial reporting and audit trails.

## License

No license is specified in the inspected project. Add a `LICENSE` file before publishing the repository with an explicit open-source license.

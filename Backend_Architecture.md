# Backend Architecture: CommuniAble AI

## 1. Core Framework
- **Framework**: FastAPI (Python 3.11+)
- **Server**: Uvicorn running via Gunicorn workers for production scaling.
- **Database ORM/Client**: Supabase Python Client (PostgreSQL).

## 2. Modular Structure
The application follows a domain-driven modular structure:
```text
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py
│   │   │   ├── speech.py
│   │   │   ├── writing.py
│   │   │   └── ...
│   ├── core/           # Config, Security, Logging
│   ├── db/             # Supabase client initialization
│   ├── models/         # Pydantic schema validations
│   ├── services/       # Core business logic, AI integrations
│   ├── workers/        # Celery background tasks
│   └── main.py         # FastAPI application entrypoint
```

## 3. Dependency Injection
FastAPI's dependency injection system is used for:
- **Authentication**: `get_current_user` extracts and validates the JWT from headers.
- **Authorization**: `require_role(["trainer", "institution"])` checks RBAC.
- **Database**: Injecting Supabase client instances.

## 4. Background Processing (Celery)
Heavy AI tasks (e.g., audio transcription, deep semantic analysis of long text) are offloaded to **Celery**:
- **Broker**: Redis.
- **Result Backend**: Redis/PostgreSQL.
- Endpoints return `202 Accepted` with a `task_id` for long-running operations. Client polls or receives real-time updates via Supabase Subscriptions.

## 5. Security & Middleware
- **CORS**: Configured strictly in `core/config.py` to allow only the Next.js frontend origin.
- **Rate Limiting**: Integrated using `slowapi` to prevent abuse on heavy endpoints (like AI analysis).
- **Logging**: Structlog configured for JSON output in production to integrate easily with Datadog/CloudWatch.

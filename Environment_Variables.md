# Environment Variables: CommuniAble AI

## 1. Frontend (`frontend/.env.example`)
```env
# Next.js Public Variables
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
NEXT_PUBLIC_API_BASE_URL="https://api.communiable.ai/v1"

# Analytics / Monitoring
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN="token"
NEXT_PUBLIC_SENTRY_DSN="dsn-string"
```

## 2. Backend (`backend/.env.example`)
```env
# API Configuration
ENVIRONMENT="development"
DEBUG="True"
CORS_ORIGINS="http://localhost:3000,https://app.communiable.ai"

# Supabase Admin access for backend operations
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
JWT_SECRET="your-jwt-secret-from-supabase"

# Database Connection (for raw SQL access if needed)
DATABASE_URL="postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres"

# Celery / Redis
REDIS_URL="redis://localhost:6379/0"

# External AI Services (e.g., OpenAI, Anthropic, or specialized NLP)
AI_SERVICE_API_KEY="sk-..."
```

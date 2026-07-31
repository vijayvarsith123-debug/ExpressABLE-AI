# Complete Folder Structure: CommuniAble AI

```text
communiable-ai/
├── frontend/                     # Next.js Application
│   ├── public/                   # Static assets, icons
│   ├── src/
│   │   ├── app/                  # App Router pages and layouts
│   │   │   ├── (auth)/           # Login, signup routes
│   │   │   ├── dashboard/        # Learner dashboard
│   │   │   ├── trainer/          # Trainer specific views
│   │   │   └── api/              # Next.js API Routes (if used as BFF)
│   │   ├── components/
│   │   │   ├── ui/               # Reusable atomic UI elements
│   │   │   ├── assessments/      # Audio recorder, text analyzer
│   │   │   └── visualizations/   # Charts and progress graphs
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility functions, API clients
│   │   ├── store/                # Zustand state definitions
│   │   ├── styles/               # Global CSS and tokens
│   │   └── types/                # TypeScript interface definitions
│   ├── package.json
│   └── next.config.js
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── api/                  # Route definitions
│   │   ├── core/                 # App configuration
│   │   ├── models/               # Pydantic schemas
│   │   ├── services/             # Business logic and AI orchestration
│   │   └── workers/              # Celery tasks
│   ├── tests/                    # Pytest test suite
│   ├── requirements.txt
│   └── main.py
├── database/                     # Supabase local config & schemas
│   ├── migrations/               # SQL migration scripts
│   ├── seed.sql                  # Seed data for development
│   └── config.toml               # Supabase CLI config
├── shared/                       # Shared configurations
│   └── types/                    # Protocol Buffers or shared JSON schemas if bridging
├── .github/                      # GitHub Actions workflows
├── docker-compose.yml            # Local development orchestration
└── README.md
```

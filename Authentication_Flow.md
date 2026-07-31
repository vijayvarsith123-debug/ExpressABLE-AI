# Authentication Flow: CommuniAble AI

## 1. Provider
Authentication is powered by **Supabase Auth** (GoTrue), providing secure, standard-compliant JWT generation and session management.

## 2. Registration Flow
1. User submits email, password, and requested `role` via Next.js frontend.
2. Frontend calls FastAPI `POST /auth/signup`.
3. FastAPI invokes Supabase Admin API to create the user in `auth.users`.
4. A database trigger automatically creates a corresponding record in the `public.profiles` and `public.accessibility_profiles` tables.
5. Email confirmation loop is initiated.

## 3. Login Flow
1. User submits credentials.
2. FastAPI `POST /auth/login` validates via Supabase.
3. Supabase issues `access_token` (JWT) and `refresh_token`.
4. The JWT is returned to the frontend and stored securely (HttpOnly cookies preferred for web, secure storage for native wrappers).

## 4. Token Lifecycle & Middleware
- **Next.js Middleware**: Intercepts requests to protected routes (`/dashboard`, `/trainer`). Checks for valid session cookie. If absent, redirects to `/login`.
- **FastAPI Dependency**: Extracts Bearer token, validates signature against Supabase JWT secret, and attaches the user identity to the request context.

## 5. Advanced Security
- **MFA (Multi-Factor Authentication)**: Available via Supabase for Trainer and Institution roles to protect sensitive learner reports.
- **Social Logins**: OAuth integrations (Google, Microsoft) configured for seamless enterprise onboarding.

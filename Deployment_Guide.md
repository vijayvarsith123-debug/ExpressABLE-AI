# Deployment Guide: CommuniAble AI

## 1. Version Control & CI/CD
- **Git Provider**: GitHub.
- **CI/CD Pipeline**: GitHub Actions.
  - **PR Checks**: Runs ESLint, Prettier, TypeScript checks, Pytest suite, and standard dependency audits.
  - **Main Branch**: Merges to `main` trigger automated deployments to staging, and subsequently to production upon manual approval.

## 2. Frontend Deployment (Vercel)
- The Next.js application is deployed on **Vercel** to take advantage of Edge networking and seamless Serverless function integration.
- Environment variables are managed securely in the Vercel dashboard.
- Custom domain routing and SSL handled automatically by Vercel.

## 3. Backend Deployment (Railway / Render)
- The FastAPI application and Celery workers are containerized using Docker.
- **Dockerfile**: Utilizes a multi-stage Python 3.11 slim image for minimal footprint.
- Deployed on **Railway**.
- Includes automatic scaling configurations based on CPU utilization to handle intermittent heavy AI assessment loads.

## 4. Database (Supabase)
- Database schema changes are managed via Supabase CLI migrations.
- `supabase db push` is integrated into the CI/CD pipeline to deploy schema updates synchronously with backend rollouts.

## 5. Monitoring & Logging
- Datadog integrated for APM, log aggregation, and error tracking across both Vercel and Railway environments.

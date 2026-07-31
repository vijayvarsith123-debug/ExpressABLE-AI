# API Documentation: CommuniAble AI

This document specifies the FastAPI backend endpoints for the CommuniAble AI platform.

## Authentication
- **`POST /auth/signup`**: Register a new user profile. (Body: `email`, `password`, `role`) -> Returns JWT and User ID.
- **`POST /auth/login`**: Authenticate user. (Body: `email`, `password`) -> Returns JWT.
- **`POST /auth/logout`**: Invalidate current session.
- **`POST /auth/forgot-password`**: Request password reset link. (Body: `email`)
- **`GET /profile`**: Retrieve current user's profile and accessibility settings. Requires Auth.
- **`PATCH /profile`**: Update user profile attributes. (Body: Partial Profile Object).

## Assessment
- **`POST /assessment/speech`**: Submit a new speech assessment task. (Body: `audio_file`, `context`)
- **`POST /assessment/writing`**: Submit text for writing assessment. (Body: `text`, `prompt`)
- **`GET /assessment/history`**: Retrieve past assessments for the user. (Query params: `limit`, `offset`)

## Speech
- **`POST /speech/analyze`**: Run full AI analysis on speech input.
- **`POST /speech/pronunciation`**: Extract specific pronunciation metrics from audio.
- **`POST /speech/fluency`**: Analyze pacing, filler words, and fluency metrics.

## Writing
- **`POST /writing/analyze`**: Comprehensive analysis of written text (tone, structure).
- **`POST /grammar/check`**: Focused grammar and syntax verification.
- **`POST /email/analyze`**: Specialized endpoint for assessing professional email drafts.

## Vocabulary
- **`GET /vocabulary`**: Get user's vocabulary list and mastery levels.
- **`GET /vocabulary/category`**: List all available vocabulary categories.
- **`POST /vocabulary/quiz`**: Submit quiz answers and update mastery levels.

## Interview
- **`POST /mock-interview/start`**: Initialize a new mock interview session based on job role context.
- **`POST /mock-interview/answer`**: Submit an answer (text/audio) for a specific question.
- **`POST /mock-interview/end`**: Finalize session and generate aggregate feedback.

## Simulation
- **`POST /simulation/start`**: Begin a workplace scenario simulation.
- **`POST /simulation/respond`**: Submit an action/response in the scenario.
- **`POST /simulation/end`**: Conclude simulation and receive empathy/effectiveness scores.

## Recommendation
- **`GET /recommendations`**: Fetch AI-driven personalized actionable recommendations.
- **`GET /learning-path`**: Retrieve user's current structured learning path and goals.

## Progress
- **`GET /progress`**: Fetch historical tracking data for specific metrics.
- **`GET /dashboard`**: Aggregate overview of user stats, recent activity, and achievements.

## Trainer
- **`GET /trainer/students`**: List all learners assigned to the trainer.
- **`GET /trainer/reports`**: Fetch aggregate reports for trainer's cohort.
- **`GET /trainer/student/{id}`**: Detailed view of a specific learner's progress and assessments.

## Institution
- **`GET /institution/analytics`**: High-level platform usage and success metrics for the organization.
- **`GET /institution/reports`**: Exportable organizational reports (CSV/PDF generation).

*All endpoints returning sensitive data require a valid JWT Bearer token and enforce Role-Based Access Control (RBAC).*

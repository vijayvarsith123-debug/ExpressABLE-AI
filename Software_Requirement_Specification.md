# Software Requirement Specification (SRS)

## 1. Introduction
This SRS defines the architectural and technical requirements for CommuniAble AI, a cloud-native platform with edge-AI capabilities designed for accessibility and real-time communication training.

## 2. System Architecture
The system follows a modern, decoupled architecture:
- **Frontend Layer (Next.js)**: Handles the UI/UX, accessibility adaptations, state management, and client-side rendering. Deployed via Vercel or standard Node.js containers.
- **API Gateway & Business Logic (FastAPI)**: Serves as the high-performance backend, managing user sessions, business rules, and routing requests to the database or AI engines.
- **Database Layer (Supabase)**: Provides PostgreSQL database, authentication, and secure row-level security (RLS) for data isolation between institutions, trainers, and learners.
- **AI Inference Engine (Ollama)**: Runs open-weights models locally or on dedicated cloud instances to ensure low latency and privacy for speech and text analysis.

## 3. Technology Integration Details
### Next.js & FastAPI Integration
- **Communication**: RESTful APIs via HTTPS.
- **Authentication**: Supabase JWT tokens passed in the `Authorization` header. FastAPI validates tokens against Supabase JWKS.
- **Real-time**: WebSockets used for live speech analysis and workplace simulation streaming.

### FastAPI & Ollama Integration
- **Inference**: FastAPI acts as a proxy, sending sanitized user inputs and contextual prompts to the Ollama REST API.
- **Streaming**: FastAPI streams LLM responses back to Next.js using Server-Sent Events (SSE) to reduce perceived latency.

## 4. System Constraints
- **Privacy & Compliance**: Voice data must not be stored longer than necessary for analysis unless explicitly opted-in by the user for model improvement.
- **Latency**: AI interactions must feel conversational. Total round-trip time for text should be < 2 seconds; voice < 4 seconds.
- **Accessibility**: The frontend framework must support dynamic ARIA attributes, keyboard navigation, and custom focus management across all components.
- **Local AI Limits**: When deploying Ollama locally, models must be quantized (e.g., 4-bit) to run efficiently on standard consumer hardware.

## 5. Data Model (High-Level)
- `users`: id, role, accessibility_preferences
- `simulations`: id, user_id, scenario_type, status, created_at
- `interactions`: id, simulation_id, user_input, ai_response, feedback_score
- `trainer_assignments`: trainer_id, learner_id, institution_id

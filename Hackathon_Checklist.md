# Hackathon Checklist: SmartAbility 2026

## Pre-Hackathon Preparation
- [ ] Initialize Next.js and FastAPI repositories.
- [ ] Setup Supabase project with initial database schema and Row Level Security (RLS).
- [ ] Configure local Ollama environment with the target quantized model.
- [ ] Establish CI/CD pipelines with accessibility (axe-core) checks.

## MVP Development (During Hackathon)
- [ ] **Accessibility First**: Implement the dynamic Accessibility Profile context in Next.js (High contrast, text scaling).
- [ ] **Auth**: Connect Supabase authentication for Learner and Trainer roles.
- [ ] **Core Flow 1**: Build the Workplace Simulation UI (chat/voice interface).
- [ ] **AI Integration**: Connect FastAPI to Ollama and stream responses back to the frontend.
- [ ] **Core Flow 2**: Implement the Speech Analysis Whisper pipeline for pronunciation feedback.
- [ ] **Dashboards**: Build basic progress views for Learners and monitoring views for Trainers.

## Validation & Testing
- [ ] Run full keyboard navigation test on all primary flows.
- [ ] Verify Screen Reader compatibility on the Simulation view.
- [ ] Test the "Simple Language" toggle to ensure the LLM alters its response complexity.
- [ ] Load test the local FastAPI -> Ollama pipeline (verify < 3s latency).

## Presentation Prep
- [ ] Prepare a live demo highlighting the Accessibility Profile switching.
- [ ] Showcase a Mock HR Interview demonstrating real-time constructive AI feedback.
- [ ] Display the Trainer Dashboard overriding an AI score.
- [ ] Emphasize the platform's avoidance of traditional "e-learning" paradigms (no courses, no fail states).
- [ ] Review all documentation for terminology compliance (ensure no mention of "Courses" or "Enrollments").

# Non-Functional Requirements

## 1. Accessibility Compliance (Crucial)
- **NFR1.1**: The platform MUST comply with WCAG 2.2 AA standards at a minimum, targeting AAA for critical user flows.
- **NFR1.2**: All interactive elements must be fully navigable via keyboard.
- **NFR1.3**: Screen reader compatibility must be tested and verified (NVDA, JAWS, VoiceOver).
- **NFR1.4**: The UI must support up to 200% text scaling without loss of functionality.

## 2. Performance & Latency
- **NFR2.1**: AI text responses (Mock Interview/Simulation) must stream back to the user with a Time-to-First-Token (TTFT) of < 1.5 seconds.
- **NFR2.2**: Audio processing and transcription must return results within 4 seconds of recording completion.
- **NFR2.3**: Page load times must be under 2 seconds on standard broadband to prevent cognitive load/frustration.

## 3. Security & Privacy
- **NFR3.1**: All data at rest and in transit must be encrypted (TLS 1.3, AES-256).
- **NFR3.2**: Voice recordings must NOT be stored permanently unless the user provides explicit, informed consent.
- **NFR3.3**: AI analysis (especially if using local Ollama) must ensure sensitive PII entered during simulations is not retained in model memory.

## 4. Scalability
- **NFR4.1**: The backend architecture (FastAPI) must support horizontal scaling.
- **NFR4.2**: The platform must support 1,000 concurrent users without degradation of AI response times.

## 5. Availability
- **NFR5.1**: The platform should guarantee 99.9% uptime for core services (excluding local AI nodes which may failover to cloud).
- **NFR5.2**: Offline mode (progressive web app capabilities) should allow viewing of previously downloaded Social Stories and Vocabulary if connectivity drops.

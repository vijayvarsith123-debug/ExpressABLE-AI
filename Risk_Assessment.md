# Risk Assessment and Mitigation

## 1. Compliance Risks
**Risk**: Failure to meet strict WCAG 2.2 AA/AAA accessibility standards.
**Impact**: High. Alienates the target user base and violates the core premise of the platform.
**Mitigation**: Integrate automated accessibility testing (axe-core) into the CI/CD pipeline. Conduct manual audits with actual screen readers (NVDA/VoiceOver) during every sprint. Include PwD in usability testing.

## 2. Technical Risks (AI Deployment)
**Risk**: Local LLM deployment (Ollama) experiences high latency on lower-end devices.
**Impact**: Medium. Degrades the real-time simulation experience.
**Mitigation**: Use highly optimized, quantized models (e.g., Llama 3 8B 4-bit). Implement a hybrid fallback architecture where requests automatically route to a secure cloud API if local inference exceeds 3 seconds.

## 3. Data Privacy Risks
**Risk**: Accidental exposure of sensitive voice recordings or PII shared during mock interviews.
**Impact**: High. Breach of trust and potential legal ramifications.
**Mitigation**: Process voice-to-text entirely in-memory and discard audio buffers immediately unless the user explicitly opts into data collection. Enforce strict Row-Level Security (RLS) in Supabase.

## 4. Operational / Business Risks
**Risk**: AI generates inappropriate or discouraging feedback.
**Impact**: High. Can severely impact the confidence of a vulnerable user base.
**Mitigation**: Implement a strict "guardrail" system prompt that forces the AI to use constructive, positive framing. Allow Trainer overrides. Implement keyword filtering on AI outputs to block negative terminology (e.g., "Fail", "Terrible").

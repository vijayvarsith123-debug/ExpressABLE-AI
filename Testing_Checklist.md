# Testing Checklist

This document details the comprehensive testing strategy for the CommuniAble AI platform, ensuring reliability, accuracy, and accessibility prior to deployment.

## 1. Unit Testing

*   [ ] **LanguageTool Wrapper**: Verify that the Python wrapper correctly parses LanguageTool JSON responses and extracts actionable grammar suggestions.
*   [ ] **WPM Calculator**: Ensure the algorithm accurately calculates Words Per Minute given a specific audio duration and transcript word count, handling edge cases (zero words, rapid speech).
*   [ ] **Weakness Log Aggregator**: Test the logic that flags a sub-skill as a "weakness" if the score drops below the 75/100 threshold for three consecutive scenarios.
*   [ ] **JSON Parser**: Validate that the backend strictly enforces and correctly parses the structured JSON output from the Ollama LLM, handling malformed responses gracefully.

## 2. Integration Testing

*   [ ] **Pipeline Sequence**: Verify the data flow: Text Input -> FastAPI -> LanguageTool -> Ollama -> FastAPI -> Dashboard. Ensure data is correctly transformed at each stage.
*   [ ] **Browser Audio to STT**: Test the connection between the frontend MediaRecorder/SpeechRecognition API and the backend transcription service.
*   [ ] **Recommendation Engine Generation**: Verify that specific flags in the Weakness Logs successfully trigger the generation of appropriately tailored practice scenarios.

## 3. API Testing

*   [ ] **Endpoint Validation**: Test all FastAPI endpoints (`/api/v1/...`) for correct status codes (200 OK, 400 Bad Request, 401 Unauthorized, 500 Internal Error).
*   [ ] **Rate Limiting**: Verify that the API correctly returns a 429 status code when the request limit is exceeded to protect the Ollama inference server.
*   [ ] **Payload Sanitization**: Ensure endpoints reject excessively large text payloads or invalid JSON structures.

## 4. Accessibility Testing (Axe-core)

As a platform for persons with disabilities, WCAG 2.1 AA compliance is mandatory.

*   [ ] **Automated Scanning**: Run Axe-core integration in the CI/CD pipeline to catch contrast errors, missing ARIA labels, and structural HTML issues.
*   [ ] **Keyboard Navigation**: Manually verify that all dashboard elements, scenario selection, and feedback panels are fully navigable using only the `Tab` and `Enter` keys.
*   [ ] **Screen Reader Compatibility**: Test the interface with NVDA and VoiceOver to ensure dynamic updates (like live LLM feedback appearing) are correctly announced to the user via ARIA live regions.
*   [ ] **Visual Modifiers**: Ensure the UI supports high-contrast modes and text scaling up to 200% without breaking layout.

## 5. AI Inference Reliability Testing

*   [ ] **Prompt Adherence**: Run 100 test prompts against the Ollama models and verify that 99%+ return strictly formatted JSON as requested in the system prompt.
*   [ ] **Tone Consistency**: Evaluate LLM feedback across various scenarios to ensure the coaching tone remains professional, constructive, and free of bias or generic platitudes.

## 6. Performance Testing

*   [ ] **Inference Latency**: Measure the response time of the Ollama server. Goal: Pass 1 (LanguageTool) < 500ms; Pass 2 (LLM) < 3000ms.
*   [ ] **Concurrent Users**: Simulate 50 concurrent users submitting text for evaluation to test the queuing mechanism and resource utilization on the inference server.

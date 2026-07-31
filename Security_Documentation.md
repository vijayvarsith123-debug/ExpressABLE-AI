# Security Documentation

This document outlines the security architecture and data protection strategies for the CommuniAble AI platform, prioritizing the privacy of persons with disabilities and securing sensitive workplace communication data.

## 1. Threat Modeling

We utilize the STRIDE methodology (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) to identify potential threats:

*   **Information Disclosure (High Risk):** Unauthorized access to a user's practice emails, voice recordings, or weakness logs.
    *   *Mitigation*: End-to-end encryption of data in transit. Zero-persistence architecture for audio data. Local inference via Ollama prevents text data from leaving the internal network.
*   **Tampering (Medium Risk):** Malicious modification of the Recommendation Engine's weakness logs, skewing user profiles.
    *   *Mitigation*: Strict Role-Based Access Control (RBAC) and JWT-based API authentication.
*   **Denial of Service (Medium Risk):** Overloading the local Ollama inference server with excessive requests.
    *   *Mitigation*: API rate limiting at the FastAPI gateway level.

## 2. PII (Personally Identifiable Information) Handling

The platform processes sensitive data that may reveal a user's identity or disability status.

*   **Anonymization**: All user profiles are pseudo-anonymized in the database using UUIDs.
*   **Data Minimization**: The platform only collects data strictly necessary for communication evaluation. We do not collect demographics unless explicitly opted-in for accessibility research.
*   **No Third-Party AI Sharing**: By utilizing a local Ollama server, we guarantee that no PII, transcribed text, or practice emails are transmitted to external APIs (like OpenAI or Anthropic), satisfying strict corporate data compliance requirements.

## 3. Secure Audio Recording Storage (Zero-Persistence Architecture)

Audio capture poses the highest privacy risk. The architecture is designed as a "Zero-Persistence" system:

1.  Audio is captured via the Browser Speech API.
2.  Audio data is kept entirely in RAM (memory) during the transcription process.
3.  Once the Speech-to-Text engine generates the text transcript and acoustic metadata, the raw audio buffer is immediately flushed and destroyed.
4.  **No audio files (.wav, .mp3) are ever written to the disk or stored in any database.** Only the text transcript and numeric metadata (WPM, pause duration) are retained for the Recommendation Engine.

## 4. OWASP Top 10 Mitigation Strategies

*   **A01:2021-Broken Access Control**: Implemented strict JWT validation on all API endpoints. Users can only access their own UUID-keyed weakness logs.
*   **A02:2021-Cryptographic Failures**: All data in transit uses TLS 1.3. Any persisted database fields containing sensitive scenario data are encrypted at rest using AES-256.
*   **A03:2021-Injection**: All user input (text drafts) sent to the LLM or database is strictly sanitized. We use parameterized queries (ORM) for all database interactions to prevent SQL injection.
*   **A07:2021-Identification and Authentication Failures**: Implementation of multi-factor authentication (MFA) for administrative access and robust password hashing (Argon2) for user accounts.

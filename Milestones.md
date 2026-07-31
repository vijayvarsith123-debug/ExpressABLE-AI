# Project Milestones

This document details the key project milestones for the CommuniAble AI platform, including specific deliverables and strict validation criteria for each phase.

## Milestone 1: Architectural Foundation Complete
*   **Description:** The underlying infrastructure, database, and local AI serving environment are fully established and communicating.
*   **Deliverables:**
    *   FastAPI backend repository initialized.
    *   Ollama server running locally with Llama 3.2 and Qwen pulled.
    *   Database schema created for Users, Weakness Logs, and Session Data.
*   **Validation Criteria:**
    *   Backend can successfully ping the local Ollama API.
    *   Zero critical security vulnerabilities in the base image.

## Milestone 2: Audio & Text Ingestion Pipeline Operational
*   **Description:** The platform can successfully capture, securely process, and transcribe audio and text inputs from the browser.
*   **Deliverables:**
    *   Functional frontend interface for audio recording.
    *   Speech-to-Text pipeline integrated.
    *   LanguageTool (Pass 1) integrated for real-time text checking.
*   **Validation Criteria:**
    *   Audio is transcribed with >85% accuracy in a quiet environment.
    *   Audio buffer is successfully flushed from RAM post-transcription (Zero-Persistence verified).
    *   LanguageTool returns basic grammar corrections in < 500ms.

## Milestone 3: Semantic Analysis Engine Ready
*   **Description:** The core AI logic is functioning, providing professional communication feedback via local LLMs based on strict prompt engineering.
*   **Deliverables:**
    *   Modelfiles (e.g., `communiable-llama-coach`) deployed.
    *   System prompts finalized and integrated into the backend.
    *   JSON response parsers implemented.
*   **Validation Criteria:**
    *   LLM correctly rewrites casual chat into professional language.
    *   100% of LLM responses adhere to the required JSON schema without breaking the parser.
    *   Inference latency for Pass 2 (Semantic) is under 3000ms.

## Milestone 4: Adaptive Recommendation System Active
*   **Description:** The platform intelligently tracks user performance and alters practice scenarios based on identified weaknesses.
*   **Deliverables:**
    *   Weakness Log database logic active.
    *   Communication Assessment metric calculator (WPM, Fluency) implemented.
    *   Daily Action Plan generation algorithm deployed.
*   **Validation Criteria:**
    *   Scoring below 75 on a metric 3 times consecutively successfully triggers a Weakness Flag.
    *   The Daily Action Plan dynamically updates based on active flags.

## Milestone 5: MVP Release Candidate
*   **Description:** A fully integrated, accessible, and tested version of the platform ready for beta users.
*   **Deliverables:**
    *   Completed user Dashboard with progress visualization.
    *   Full suite of QA test cases executed.
    *   Accessibility audit completed.
*   **Validation Criteria:**
    *   Pass all 30+ QA Test Cases.
    *   Zero critical or serious Axe-core accessibility violations.
    *   System successfully handles simulated concurrent load without crashing.

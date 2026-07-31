# Grammar & Writing Coach Engine

This document outlines the design and implementation of the Grammar & Writing Coach for the CommuniAble AI platform, focusing on enhancing professional written communication (emails, chat messages, reports).

## Overview

The Grammar & Writing Coach employs a highly efficient, double-pass analysis system. This architecture ensures rapid response times for basic errors while leveraging advanced semantic models for complex stylistic and tone improvements.

## Double-Pass Architecture

### Pass 1: Syntactic Check (LanguageTool)

The first pass acts as a high-speed, rule-based filter.

*   **Engine**: LanguageTool API (Self-hosted or local instance).
*   **Function**: Instantly scans text for structural errors that do not require deep semantic understanding.
*   **Target Metrics**:
    *   Basic spelling mistakes.
    *   Fundamental grammatical errors (subject-verb agreement, incorrect tense).
    *   Punctuation errors.
    *   Basic typographical errors (double spaces, missing capitalization).
*   **Benefit**: Offloads simple corrections from the LLM, drastically reducing token usage and computational overhead, while providing immediate feedback to the user as they type.

### Pass 2: Semantic & Stylistic Check (Qwen / Llama 3.2)

The second pass focuses on the nuance and appropriateness of the communication for a professional workplace environment.

*   **Engine**: Local LLMs (Qwen or Llama 3.2) served via Ollama.
*   **Function**: Analyzes the context, tone, and clarity of the pre-processed text (from Pass 1).
*   **Target Metrics**:
    *   **Professional Tone**: Ensures the language is appropriate for workplace communication (e.g., converting overly casual phrasing to professional alternatives).
    *   **Clarity and Conciseness**: Identifies run-on sentences, jargon, or overly complex structures, suggesting more direct alternatives.
    *   **Inclusivity**: Flags potentially exclusionary language and suggests inclusive alternatives.
    *   **Contextual Appropriateness**: Evaluates if the response makes sense given the simulated workplace scenario (e.g., responding to a manager's request vs. a peer's message).

## Integration Workflow

1.  User inputs text into the simulated email or chat interface.
2.  On `debounce` (e.g., 500ms after the user stops typing), the text is sent to LanguageTool (Pass 1).
3.  LanguageTool returns immediate, inline corrections for basic grammar and spelling.
4.  Upon user submission (e.g., clicking "Send" in the simulation), the text, along with its context (the prompt or prior messages), is sent to the Ollama API (Pass 2).
5.  Qwen or Llama 3.2 evaluates the text using specific system prompts designed for professional communication coaching.
6.  The LLM returns structured feedback (JSON format) detailing tone analysis, structural suggestions, and rewritten examples.
7.  The Dashboard displays the comprehensive feedback, allowing the user to review and apply suggestions.

## Example Scenario

*   **User Input**: "hey im gonna be late today traffic is bad."
*   **Pass 1 (LanguageTool)**: Suggests capitalizing "Hey", changing "im" to "I'm", and adding a period after "today".
    *   *Resulting Text*: "Hey, I'm gonna be late today. Traffic is bad."
*   **Pass 2 (LLM)**: Analyzes tone and professionalism. Suggests alternatives.
    *   *Feedback*: "The tone is too casual for a workplace message to a manager."
    *   *Suggestion*: "Hi [Manager Name], I am running a bit late today due to heavy traffic. I expect to be online by [Time]. I will make up the time this evening."

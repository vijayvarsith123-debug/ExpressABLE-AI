# Recommendation Engine Specification

This document details the Recommendation Engine for the CommuniAble AI platform, an Adaptive Learning Path system designed to personalize communication training based on empirical performance data.

## Engine Purpose

The Recommendation Engine analyzes user performance across various communication scenarios, identifies specific weaknesses, and dynamically generates targeted practice paths. It ensures that the user spends time improving the areas that require the most attention, rather than following a static, generic progression.

## Core Data Inputs

The engine relies on three primary data streams:

1.  **Weakness Logs**: A persistent database tracking specific errors made by the user over time (e.g., frequent use of filler words, consistently casual tone in formal emails, low WPM).
2.  **Daily Recommendation Scores**: An aggregated score calculated at the end of each daily session, summarizing overall performance across all tested metrics.
3.  **Progress Tracker**: Historical data showing the trajectory of improvement or regression in specific sub-skills over weeks or months.

## Processing Logic

### 1. Data Aggregation and Normalization
- The engine collects raw scores from the Communication Assessment layer.
- Scores are normalized onto a standard 0-100 scale for each sub-skill (e.g., Clarity, Tone, Fluency, Grammar).

### 2. Weakness Identification Algorithm
- The system employs a weighted moving average to identify chronic weaknesses.
- If a user's score in a specific sub-skill falls below the target threshold (e.g., 75/100) for three consecutive practice scenarios, that sub-skill is flagged in the Weakness Logs.
- **Example**: If the user consistently scores low on "Filler Words," the flag `FLAG_HIGH_FILLERS` is activated.

### 3. Adaptive Path Generation
- Based on the active flags in the Weakness Logs, the Recommendation Engine queries a library of communication scenarios.
- The engine dynamically weights scenarios that address the flagged weaknesses.
- **Example**: If `FLAG_HIGH_FILLERS` is active, the engine will prioritize simulated scenarios that require spontaneous, unscripted speech (where filler words are most likely to occur), such as "Impromptu Project Update."

## Output Mechanisms

### 1. Daily Action Plan
- Upon logging into the dashboard, the user is presented with a customized "Daily Action Plan."
- This plan lists 2-3 specific practice scenarios explicitly chosen to target their current Weakness Logs.

### 2. Real-time Scenario Adjustment
- The engine can adjust the difficulty of scenarios on the fly. If a user is excelling in email etiquette, subsequent email scenarios will feature more complex professional situations (e.g., conflict resolution, declining a request).

### 3. Progress Visualization
- The engine feeds data to the Dashboard's Progress Tracker, visualizing the improvement in flagged areas over time, reinforcing positive development.

## LLM Integration

The Recommendation Engine utilizes the local LLM (via Ollama) to generate the *context* for the recommended scenarios.

- **Prompting the LLM**: "Generate a workplace scenario requiring verbal de-escalation for a user who needs practice reducing filler words and maintaining a slow, measured pace."
- **Output**: A custom-tailored scenario description and role-play setup that perfectly matches the user's required adaptive learning path.

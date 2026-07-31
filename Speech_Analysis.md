# Speech Analysis Engine Design

This document details the architecture and operational mechanics of the Speech Analysis Engine for the CommuniAble AI platform.

## Overview

The Speech Analysis Engine is responsible for evaluating the user's spoken communication in simulated workplace scenarios. It combines browser-native audio capture with advanced transcription and large language model evaluation to provide comprehensive feedback on vocal delivery.

## Core Components

### 1. Audio Capture (Browser Speech API)
- Utilizes the Web Speech API (specifically `SpeechRecognition` or `MediaRecorder` depending on browser support) to capture high-fidelity audio directly in the client.
- Performs client-side Voice Activity Detection (VAD) to segment speech and ignore prolonged silence.

### 2. Transcription & Feature Extraction
- **Text Transcription**: Converts spoken words into text strings.
- **Acoustic Feature Extraction**: Extracts critical metadata necessary for vocal delivery analysis:
  - Word timestamps.
  - Duration of phonemes and words.
  - Identification of non-lexical vocables (filler words).

### 3. Analysis Modules

The engine evaluates spoken input across five primary dimensions:

#### A. Pronunciation
- **Mechanism**: Compares the transcribed text against expected phonetic models. Whisper-based analysis can provide confidence scores at the word level.
- **Output**: Highlights specific words or phonemes that were mispronounced or mumbled, providing phonetic spelling corrections.

#### B. Fluency
- **Mechanism**: Analyzes the continuous flow of speech. Evaluates the frequency and duration of mid-sentence pauses.
- **Output**: A fluency index score (0-100) indicating the smoothness of the delivery.

#### C. Speed (Words Per Minute - WPM)
- **Mechanism**: Calculates the total number of spoken words divided by the total duration of active speech (excluding long pauses).
- **Output**: WPM metric. The system flags if the speed is outside the optimal workplace communication range (typically 130-160 WPM), indicating if the user is speaking too quickly (anxiety) or too slowly.

#### D. Fillers and Pauses
- **Mechanism**: Identifies filler words (e.g., "um," "ah," "like," "you know") and excessive silent pauses.
- **Output**: A specific count of filler words used per minute. Highlights instances where filler words detracted from the clarity of the message.

#### E. Confidence Scoring
- **Mechanism**: A composite metric derived from volume consistency, lack of filler words, optimal pace, and declarative sentence structures (analyzed via Llama 3.2).
- **Output**: A confidence rating that helps users understand how their delivery might be perceived by colleagues or managers.

## Workflow Integration

1. User speaks into the microphone during a practice scenario.
2. The Browser Speech API streams data to the processing backend.
3. Transcription and feature extraction occur simultaneously.
4. Data is fed into the analytical modules.
5. The local LLM (via Ollama) reviews the transcript for contextual appropriateness.
6. The combined metrics (Pronunciation, Fluency, WPM, Fillers, Confidence) are pushed to the Communication Assessment layer for final scoring.

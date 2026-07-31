# QA Test Cases

This document outlines 30+ detailed Quality Assurance (QA) test cases for the core modules of the CommuniAble AI platform.

## Module 1: Browser Speech API & Audio Capture

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_01 | Microphone Permission Granted | 1. Navigate to practice scenario. 2. Click "Start Recording". 3. Allow mic access. | User Action: Allow | Recording indicator activates; audio stream begins. |
| TC_02 | Microphone Permission Denied | 1. Navigate to practice scenario. 2. Click "Start Recording". 3. Deny mic access. | User Action: Deny | Clear error message explaining how to enable access. |
| TC_03 | VAD Silence Detection | 1. Start recording. 2. Remain silent for 10 seconds. | 10s of silence | System does not transmit data; may prompt "We didn't hear you." |
| TC_04 | Background Noise Rejection | 1. Start recording with loud background fan noise. 2. Speak normally. | Audio + Fan Noise | Speech is transcribed accurately despite noise. |
| TC_05 | Audio Buffer Flush (Privacy) | 1. Complete a recording. 2. Verify backend logs. | Completed Audio | No .wav or .mp3 files exist on the server post-transcription. |

## Module 2: Grammar & Writing Coach (Double-Pass)

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_06 | Basic Spelling (Pass 1) | 1. Type in chat interface. | "teh project is dn" | Immediate inline correction to "The project is done". |
| TC_07 | Basic Punctuation (Pass 1) | 1. Type in chat interface. | "hello how are you" | Immediate inline correction to "Hello, how are you?" |
| TC_08 | Tone Adjustment (Pass 2) | 1. Submit draft to manager. | "gonna be late traffic sucks." | LLM returns JSON with professional rewrite (e.g., "Running late due to traffic"). |
| TC_09 | Overly Complex Sentence (Pass 2) | 1. Submit long draft. | [3-line run-on sentence] | LLM flags for clarity and suggests breaking into two sentences. |
| TC_10 | Missing Subject (Pass 1) | 1. Type in chat interface. | "Will do that now." | Suggestion to add pronoun: "I will do that now." |

## Module 3: Speech Analysis Engine

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_11 | WPM Calculation (Optimal) | 1. Speak 140 words in 60s. | Speech Audio | WPM metric = 140; Status = Optimal. |
| TC_12 | WPM Calculation (Too Fast) | 1. Speak 200 words in 60s. | Speech Audio | WPM metric = 200; Status = Flagged as too fast. |
| TC_13 | Filler Word Detection | 1. Speak scenario using "um". | "Um, the, ah, report..." | Filler count accurately reflects the spoken vocables. |
| TC_14 | Pronunciation Flagging | 1. Mispronounce "specifically" | Audio input | Word flagged with phonetic correction suggestion. |
| TC_15 | Long Pause Detection | 1. Speak, pause for 5s, speak. | Speech Audio | Fluency score drops; pause duration logged. |

## Module 4: Ollama Local Inference

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_16 | Model Load Verification | 1. Start backend server. | System Start | Llama 3.2 model loads into memory successfully. |
| TC_17 | Strict JSON Enforcement | 1. Send evaluation prompt. | Text Prompt | Response strictly adheres to required JSON schema; no plain text. |
| TC_18 | Fallback on LLM Timeout | 1. Simulate server load/timeout. | Heavy API traffic | Graceful error handling in UI; no app crash. |
| TC_19 | Contextual Understanding | 1. Submit response for specific scenario. | Text + Scenario Context | Feedback specifically references the provided scenario parameters. |
| TC_20 | Rate Limiting Trigger | 1. Send 50 requests/sec. | API spam | API returns 429 Too Many Requests. |

## Module 5: Recommendation Engine & Dashboard

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_21 | Weakness Flag Trigger | 1. Score < 75 in grammar 3x. | 3 low grammar scores | Weakness Log adds FLAG_GRAMMAR. |
| TC_22 | Scenario Generation | 1. Login with FLAG_GRAMMAR. | Dashboard Load | Daily Action Plan suggests writing-heavy scenarios. |
| TC_23 | Score Normalization | 1. Complete assessment. | Raw backend scores | Dashboard displays metrics mapped to 0-100 scale. |
| TC_24 | Progress Chart Render | 1. View historical data. | JSON metrics history | Charts render correctly without layout breaks. |
| TC_25 | Resolution of Weakness | 1. Score > 85 in grammar 3x. | 3 high grammar scores | FLAG_GRAMMAR removed from Weakness Log. |

## Module 6: Accessibility (Axe-core/WCAG)

| TC ID | Test Case Name | Steps to Execute | Inputs | Expected Outcome |
|---|---|---|---|---|
| TC_26 | Keyboard Navigation | 1. Navigate via Tab/Enter. | Keyboard only | Focus indicators visible; all actions reachable. |
| TC_27 | Screen Reader Announcement | 1. Trigger LLM feedback. | Feedback JSON | ARIA live region announces the new feedback text. |
| TC_28 | High Contrast Mode | 1. Enable OS high contrast. | OS Setting | Text remains legible against background colors. |
| TC_29 | Text Scaling (200%) | 1. Zoom browser to 200%. | Browser Zoom | No overlap or text clipping in dashboard panels. |
| TC_30 | ARIA Labels Verification | 1. Run Axe-core scanner. | HTML DOM | 0 critical/serious ARIA violations found. |

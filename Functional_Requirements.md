# Functional Requirements

## 1. Speech Assessment
- **FR1.1**: The system must record user audio using the browser's MediaRecorder API.
- **FR1.2**: Audio must be transcribed securely using a Whisper-based model (preferably local).
- **FR1.3**: The system shall evaluate the transcription against expected clarity and pacing metrics.
- **FR1.4**: Results must be presented visually without using the word "Fail."

## 2. Writing Assessment (Grammar & Email Coach)
- **FR2.1**: The system must provide a text input area for practicing professional emails.
- **FR2.2**: AI must analyze text for tone, professionalism, and grammar.
- **FR2.3**: Feedback must highlight specific phrases with constructive suggestions.

## 3. Vocabulary Practice
- **FR3.1**: The system must present industry-specific terms with definitions and audio pronunciation.
- **FR3.2**: Users must be able to practice using the vocabulary in a sentence and receive AI validation.

## 4. Mock Interviews & Workplace Simulations
- **FR4.1**: The system must allow users to select from predefined workplace scenarios (e.g., asking for accommodations, reporting an error).
- **FR4.2**: The AI persona must respond contextually to the user's input (text or speech).
- **FR4.3**: The system must allow the user to pause, restart, or ask for a hint at any time during the simulation.

## 5. Progress Tracking
- **FR5.1**: The system must calculate a non-punitive "Communication Score" based on consistency and improvement, not raw correctness.
- **FR5.2**: The dashboard must display daily and weekly goal completion streaks.

## 6. Accessibility & AI Recommendations
- **FR6.1**: The system must apply user accessibility preferences immediately upon login.
- **FR6.2**: The AI must adapt its response length and complexity based on the user's cognitive profile setting.

## 7. Trainer Monitoring & Institution Analytics
- **FR7.1**: The system must allow Trainers to view their assigned Learners' activity logs and AI feedback.
- **FR7.2**: The system must allow Trainers to override AI feedback.
- **FR7.3**: The system must generate aggregated, anonymized reports for Institution Administrators.

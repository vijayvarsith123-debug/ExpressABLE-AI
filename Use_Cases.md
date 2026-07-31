# Use Cases

## Use Case 1: Conduct Workplace Simulation
**Actors**: Learner, AI Engine
**Preconditions**: Learner is logged in and has selected a workplace scenario (e.g., "Requesting PTO").
**Main Flow**:
1. Learner selects the scenario.
2. System displays the context and the AI persona's opening statement.
3. Learner responds via text or voice.
4. AI analyzes the response for appropriateness, tone, and clarity.
5. AI replies contextually.
6. Steps 3-5 repeat until the scenario concludes.
7. System provides a constructive summary and a Communication Score.
**Alternative Flow**: Learner clicks "Hint" at step 3; system provides a suggested response template.
**Exception Flow**: Learner's voice is unintelligible. System gently asks the Learner to repeat or offers to switch to text input.

## Use Case 2: Override AI Feedback
**Actors**: Trainer
**Preconditions**: Trainer is logged in and viewing an assigned Learner's simulation history.
**Main Flow**:
1. Trainer selects a completed simulation from the Learner's dashboard.
2. Trainer reviews the transcript and the AI's feedback.
3. Trainer clicks "Override Feedback".
4. Trainer inputs their custom feedback and adjusts the score.
5. System saves the override and updates the Learner's dashboard.
**Exception Flow**: Learner has deleted the simulation data. System informs the Trainer the data is unavailable.

## Use Case 3: Update Accessibility Profile
**Actors**: Learner
**Preconditions**: Learner is logged in.
**Main Flow**:
1. Learner clicks the Accessibility icon in the navigation bar.
2. System displays toggle options (High Contrast, Large Text, Simple Language, Screen Reader).
3. Learner toggles "Simple Language" ON.
4. System immediately refreshes the interface, rewriting complex text to a B1 reading level.
5. System saves the preference to the user profile.

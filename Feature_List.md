# Feature List

## 1. Mandatory Features

### 1.1 Accessibility Profile
- **Purpose**: Tailors the platform UI/UX to specific disabilities.
- **Supported Disabilities**: All (Visual, Cognitive, Speech, Hearing).
- **Accessibility Adaptations**: High contrast, font scaling, text-to-speech, simple language toggle.
- **User Flow**: Onboarding -> Select Preferences -> UI updates globally.
- **Frontend**: Next.js Context API for global state, Tailwind theme switching.
- **Backend**: FastAPI endpoint to save preferences in `users` table.
- **Database Tables**: `user_profiles`.

### 1.2 AI Workplace Communication Assessment
- **Purpose**: Baseline evaluation of professional communication skills.
- **Supported Disabilities**: Speech, Cognitive.
- **Acceptance Criteria**: Must generate a baseline Communication Score without using 'Fail'.

### 1.3 Speech, Pronunciation & Fluency Analysis
- **Purpose**: Real-time evaluation of vocal clarity, pacing, and pronunciation.
- **Supported Disabilities**: Speech, Hearing.
- **AI Workflow**: Audio captured -> Whisper model -> Transcription -> LLM analysis for fluency.
- **Validation Rules**: Must handle diverse accents and speech impediments gracefully.

### 1.4 Workplace Vocabulary & Contextual Learning
- **Purpose**: Interactive practice of industry-specific terms and context.
- **Backend Logic**: FastAPI serves domain-specific vocabulary lists.

### 1.5 Social Stories
- **Purpose**: Visual and textual narratives explaining workplace norms.
- **Supported Disabilities**: Cognitive, Learning.

### 1.6 Mock Interview & HR Interview Simulations
- **Purpose**: AI-driven roleplay for interview preparation.
- **User Flow**: Select scenario -> AI initiates -> User responds -> Real-time constructive feedback.

### 1.7 Workplace Simulation
- **Purpose**: Navigating daily scenarios (e.g., asking for help, reporting to a manager).

### 1.8 Personalized Learning & Adaptive Feedback
- **Purpose**: System adjusts difficulty based on past performance.
- **Business Rule**: AI feedback must always be constructive.

### 1.9 Gamification & Progress Dashboard
- **Purpose**: Motivation through visual progress tracking.

### 1.10 Trainer & Institution Dashboards
- **Purpose**: Monitoring and reporting tools for oversight without exposing raw sensitive data unnecessarily.

---

## 2. Additional Features
- **Grammar Coach**: Real-time professional writing assistance.
- **Email Coach**: Templates and AI review for workplace emails.
- **Communication Score**: Aggregate metric of progress over time.
- **Voice Navigation**: Hands-free platform usage.
- **Simple Language Mode**: Rewrites all platform text to B1 reading level.
- **Daily/Weekly Goals**: Goal setting.
- **Notifications & Certificates**: Encouragement and proof of capability.
- **Admin Dashboard**: Platform-wide metrics.

---

## 3. Future Features
- **Resume Analyzer & AI Resume Builder**: Parsing and generating ATS-friendly resumes.
- **Emotion Detection & Video Interview Analysis**: Facial expression analysis (opt-in).
- **Sign Language & Gesture Recognition**: Advanced computer vision integration.
- **Mobile App & Offline Mode**: For users with limited connectivity.

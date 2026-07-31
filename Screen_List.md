# Screen List

## 1. Learner Screens (15+)
### L01: Learner Dashboard
- **Components:** Welcome Banner, Daily Goals Widget, Quick Start Simulation Card, Progress Summary Chart.
- **API Calls:** `GET /api/learner/profile`, `GET /api/learner/metrics/daily`.
- **Accessibility:** High-contrast widgets, keyboard navigable goal lists.

### L02: Speech Assessment Interface
- **Components:** Audio Visualizer, Record Button, Prompt Text, Timer.
- **API Calls:** `POST /api/assessment/speech/upload`.
- **Accessibility:** Large touch targets, ARIA live regions for timer updates.

### L03: Writing Assessment Interface
- **Components:** Rich Text Editor, Real-time Grammar/Tone Suggestions, Submit Button.
- **API Calls:** `POST /api/assessment/writing/analyze`.
- **Accessibility:** Screen reader compatible editor, error notifications via assertive ARIA.

### L04: Mock Interview Simulation
- **Components:** AI Avatar View, Subtitles Panel, User Camera Feed (optional), Dialogue History.
- **API Calls:** `WebSocket /ws/simulation/interview`.
- **Accessibility:** Auto-captions for AI speech, option to type responses instead of speaking.

## 2. Trainer Screens (10+)
### T01: Trainer Dashboard
- **Components:** Cohort Overview Metrics, Alerts Panel, Recent Learner Activity Feed.
- **API Calls:** `GET /api/trainer/cohort-summary`.

### T02: Learner Profile View
- **Components:** Learner Info Card, Historical Progress Charts, Recent Assessments List.
- **API Calls:** `GET /api/trainer/learners/{id}`.

## 3. Institution Screens (8+)
### I01: Institution Analytics
- **Components:** Aggregate Performance Graphs, Active Users KPI, Trainer Efficiency Metrics.
- **API Calls:** `GET /api/institution/analytics`.

## 4. Admin Screens (7+)
### A01: System Health Dashboard
- **Components:** Server Uptime, API Latency, Active Sessions.
- **API Calls:** `GET /api/admin/health`.

# State Management: CommuniAble AI

## 1. Global Client State (Zustand)
Zustand is utilized for lightweight, fast access to global UI states that do not depend on constant server synchronization.
- **`useAccessibilityStore`**: Manages current UI theme, text size, and contrast preferences. Persisted to `localStorage` for immediate application on load, synced to backend `accessibility_profiles` asynchronously.
- **`useSimulationStore`**: Maintains active state during a workplace scenario simulation (current step, selected choices, local timer).
- **`useAuthStore`**: Holds the current JWT, user role, and basic profile info to dictate UI rendering immediately.

## 2. Server State (React Query / TanStack Query)
Data fetched from the FastAPI backend is managed by React Query to handle caching, background fetching, and stale data logic.
- **`useProgressData`**: Fetches and caches progress metrics. Revalidates automatically when window refocuses.
- **`useAssessmentHistory`**: Handles pagination and caching of past speech/writing reports.
- **Mutations**: Utilized for submitting new assessments, handling loading states (isSubmitting), and triggering query invalidation (e.g., updating the dashboard after a successful mock interview).

## 3. URL State Management
For shareable or deep-linkable states, URL search parameters are used instead of React state:
- Filtering and sorting criteria in the Trainer's Learner List.
- Active tabs in the Dashboard view.
- Pagination offsets.

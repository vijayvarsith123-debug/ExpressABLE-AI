# Navigation Map

## 1. Route Definitions

### Public Routes
- `/` : Landing Page
- `/login` : Authentication
- `/register` : Registration
- `/forgot-password` : Password Recovery

### Dynamic Routes
- `/learner/simulations/[scenarioId]` : Specific simulation environment
- `/trainer/learners/[learnerId]` : Specific learner profile view
- `/institution/reports/[reportId]` : Specific generated report

## 2. Role-Based Redirects

### Authentication Flow
Upon successful authentication at `/login`, users are redirected based on their role:
- **Learner:** Redirected to `/learner/dashboard`
- **Trainer:** Redirected to `/trainer/dashboard`
- **Institution:** Redirected to `/institution/dashboard`
- **Admin:** Redirected to `/admin/dashboard`

### Unauthorized Access
- If a user attempts to access a route outside their role permissions (e.g., Learner accessing `/trainer/dashboard`), they are redirected to a `403 Forbidden` page with a link to their respective dashboard.
- Unauthenticated users attempting to access protected routes are redirected to `/login?redirect=[intended_path]`.

## 3. Navigation Structures

### Global Header (Authenticated)
- **Brand Logo:** Links to Role Dashboard
- **Accessibility Menu:** Contrast toggles, Text Size, Screen Reader Mode
- **User Profile:** Settings, Logout

### Sidebar (Learner)
- Home (Dashboard)
- Vocabulary
- Assessments (Speech, Writing)
- Simulations (Interview, Workplace)
- Progress
- Settings

### Sidebar (Trainer)
- Dashboard
- My Learners
- Review Feedback
- Scenario Builder
- Settings

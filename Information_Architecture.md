# Information Architecture

## 1. Overview
CommuniAble AI is an AI-powered Workplace Communication Training Platform designed for Persons with Disabilities (PwD). The information architecture (IA) structures content and interactions around skill development, personalized assessment, and institutional oversight without utilizing traditional e-learning models.

## 2. Sitemap Hierarchy

### 2.1 Public & Authentication
- `/` - Landing Page
- `/login` - Unified Login (Learner, Trainer, Admin, Institution)
- `/register` - Account Registration
- `/onboarding` - Accessibility Profile Configuration

### 2.2 Learner Portal
- `/learner/dashboard` - Personalized Overview & Daily Goals
- `/learner/vocabulary` - Workplace Vocabulary Builder
- `/learner/assessments`
  - `/learner/assessments/speech` - Voice & Articulation Evaluation
  - `/learner/assessments/writing` - Professional Written Communication
- `/learner/simulations`
  - `/learner/simulations/interview` - Mock Interview Scenarios
  - `/learner/simulations/workplace` - Office Interaction Roleplay
- `/learner/progress` - Skill Mastery & Analytics
- `/learner/settings` - Accessibility & Preferences

### 2.3 Trainer Portal
- `/trainer/dashboard` - Cohort Overview
- `/trainer/learners` - Trainee List & Profiles
  - `/trainer/learners/[id]/progress` - Detailed Trainee Analytics
- `/trainer/feedback` - Pending Manual Reviews & AI Overrides
- `/trainer/scenarios` - Custom Scenario Builder

### 2.4 Institution Portal
- `/institution/dashboard` - High-level Analytics & ROI
- `/institution/trainers` - Trainer Management
- `/institution/reports` - Exportable Compliance & Progress Reports

### 2.5 Admin Portal
- `/admin/dashboard` - System Health & Usage
- `/admin/users` - Global User Management
- `/admin/settings` - Global Platform Configurations

## 3. Meta Tagging Schemas
- **User Personas:** `learner`, `trainer`, `institution_admin`, `sys_admin`
- **Accessibility Profiles:** `visual_impaired`, `hearing_impaired`, `neurodivergent`, `motor_impaired`, `standard`
- **Skill Domains:** `verbal_clarity`, `written_professionalism`, `interview_readiness`, `workplace_etiquette`
- **Assessment Types:** `ai_automated`, `trainer_reviewed`, `hybrid`

## 4. Accessibility Landmarks Mapping
- `<header>`: Main navigation and quick accessibility toggles (contrast, text size).
- `<nav>`: Primary navigation menus, distinct for each portal.
- `<main>`: Primary content area containing the specific views (dashboard, assessments).
- `<aside>`: Secondary tools, AI suggestions, contextual help.
- `<footer>`: Legal, support links, system status.

# Product Requirements Document (PRD)

## 1. Core Objectives
- Empower Persons with Disabilities (PwD) to master workplace communication.
- Provide a highly accessible, AI-driven environment for practicing professional interactions.
- Equip trainers and institutions with actionable insights into user progress without relying on traditional grading systems.
- Ensure strict adherence to WCAG 2.2 AA/AAA accessibility standards.

## 2. Target User Personas
### Persona 1: The Learner (Primary)
- **Profile**: Individual with a speech or cognitive disability seeking employment or career growth.
- **Needs**: Safe space to practice interviews, clear and constructive feedback, simple UI, adaptive difficulty.
- **Pain Points**: Overwhelmed by complex navigation, discouraged by negative feedback in traditional systems.

### Persona 2: The Trainer / Job Coach
- **Profile**: Professional assisting PwD in finding and retaining employment.
- **Needs**: Ability to monitor progress, customize scenarios for specific learners, provide manual overrides to AI feedback.
- **Pain Points**: Lack of data on how learners perform outside of 1-on-1 sessions.

### Persona 3: The Institution Administrator
- **Profile**: NGO or inclusive hiring agency manager.
- **Needs**: Aggregated analytics to measure program efficacy, user management, accessibility compliance reporting.

## 3. MVP Scope
The Minimum Viable Product will focus on:
- **Accessibility Profile Setup**: Dynamic UI adaptation based on disability type.
- **Mock Interview Simulator**: AI-driven text and voice-based interview practice.
- **Speech & Fluency Analysis**: Basic feedback on clarity and pacing.
- **Progress Dashboard**: Simple visualization of communication score trends.
- **Trainer Dashboard**: Basic assignment and monitoring of learners.

## 4. Release Criteria
- **Accessibility**: 100% compliance with WCAG 2.2 AA (aiming for AAA where feasible).
- **Performance**: AI response time under 3 seconds using local Ollama deployment.
- **Quality**: Zero critical bugs in user onboarding and core simulation flows.
- **Security**: Data encryption at rest and in transit; secure handling of voice data.

## 5. Platform KPIs
- **Monthly Active Users (MAU)**
- **Average Session Length**
- **Simulation Completion Rate**
- **Trainer Feedback Override Rate** (lower indicates better AI performance)
- **Accessibility Profile Satisfaction Score**

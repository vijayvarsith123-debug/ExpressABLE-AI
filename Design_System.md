# Design System

## 1. Atoms
- **Color Tokens:** References `Color_System.md`.
- **Typography Tokens:** References `UI_UX_Guidelines.md`.
- **Spacing:** Base 8px scale (`spacing-1` = 8px, `spacing-2` = 16px).
- **Icons:** SVG based, stroke-width 2px, scalable.

## 2. Molecules
- **Form Inputs:** Label + Input Field + Validation Text.
- **Buttons:** Icon + Text + Container.
- **Progress Bars:** Track + Indicator + Percentage Text.
- **Avatars:** Image + Fallback Initials + Status Indicator.

## 3. Organisms
- **Vocabulary Card:** Word + Pronunciation + Definition + Example Sentence + Audio Play Button.
- **Feedback Panel:** Score Header + AI Strengths/Weaknesses Lists + Trainer Note Section.
- **Navigation Bar:** Logo + Main Links + Accessibility Dropdown + Profile.

## 4. Templates
- **Dashboard Layout:** Sidebar + Header + Main Content Grid (Cards).
- **Assessment Layout:** Focused center content, minimized distractions, clear exit/submit paths.

## 5. Implementation Strategy
- Built using React components or Web Components.
- CSS Variables for theme switching.
- Strict Prop typing for variants (e.g., `<Button variant="primary" size="large" />`).

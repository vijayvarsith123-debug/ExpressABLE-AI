# Accessibility Guidelines

## 1. WCAG 2.2 AA Compliance Mapping
- **1.1.1 Non-text Content:** All images, icons, and charts must have descriptive `alt` attributes or `aria-labels`.
- **1.4.3 Contrast (Minimum):** Minimum 4.5:1 for normal text, 3:1 for large text. Checked in Color System.
- **2.1.1 Keyboard:** All interactive elements must be fully operable via keyboard (Tab, Enter, Space).
- **2.4.7 Focus Visible:** Clear, highly visible focus rings (min 2px solid border) on all interactive elements.

## 2. Screen Reader Optimization
- Use semantic HTML (`<main>`, `<nav>`, `<article>`).
- Hide decorative elements via `aria-hidden="true"`.
- Use `aria-live="polite"` or `"assertive"` for dynamic content updates (e.g., Assessment timer completing, AI feedback arriving).

## 3. Cognitive Accessibility
- Avoid walls of text; use bullet points and ample whitespace.
- Consistent navigation across all screens.
- Use clear, literal language. Avoid idioms in UI copy.
- Provide clear error messaging describing exactly how to fix the issue.

## 4. Voice & Speech Accommodations
- Auto-captions are mandatory for any audio output (Simulations).
- Stutter and speech delay tolerance built into the AI speech recognition models. Users can adjust pacing expectations in their Accessibility Profile.
- Option to type responses in Mock Interviews instead of speaking.

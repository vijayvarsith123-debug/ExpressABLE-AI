# Component Inventory

## 1. Layout & Navigation
### Navbar
- **Description:** Top application navigation containing branding, profile, and accessibility toggles.
- **States:** Default, Scrolled (elevation added), Mobile (hamburger menu).
- **ARIA:** `role="navigation"`, `aria-label="Main Navigation"`.

### Sidebar
- **Description:** Vertical navigation for module access.
- **States:** Expanded, Collapsed, Mobile Drawer.
- **ARIA:** `role="navigation"`, `aria-label="Sidebar Navigation"`.

## 2. Interactive Elements
### Primary Button
- **Description:** Main action trigger (e.g., "Start Assessment").
- **States:** Normal, Hover (brightness +10%), Active (scale 0.98), Disabled (opacity 50%), Focus (2px solid outline).
- **ARIA:** `role="button"`, `aria-disabled` managed.

### Speech Recorder
- **Description:** Interface for capturing audio input.
- **Components:** Mic Icon, Pulsing Animation, Time Indicator.
- **States:** Idle, Recording, Processing, Error.
- **ARIA:** `aria-live="polite"` for status changes.

## 3. Data Display
### Progress Card
- **Description:** Displays metrics for skill domains (e.g., Verbal Clarity).
- **Components:** Circular Progress SVG, Domain Title, Trend Indicator (Arrow up/down).
- **Accessibility:** `aria-valuenow`, `aria-valuemin`, `aria-valuemax` on progress elements.

### Interview Feedback Dialog
- **Description:** Modal displaying AI analysis post-simulation.
- **Components:** Score Badge, Strengths List, Areas for Improvement List.
- **ARIA:** `role="dialog"`, `aria-modal="true"`, focus trapped within.

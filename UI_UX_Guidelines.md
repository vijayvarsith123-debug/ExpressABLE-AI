# UI/UX Guidelines

## 1. Design Philosophy
The design prioritizes clarity, cognitive ease, and high accessibility. Interfaces are clean, avoiding unnecessary visual clutter to support neurodivergent users, while maintaining robust contrast and scalable typography for visually impaired users.

## 2. Typography
- **Primary Font:** Inter (Sans-serif, highly legible).
- **Scale:**
  - H1: 32px (Mobile: 28px) / Line Height 1.2
  - H2: 24px (Mobile: 22px) / Line Height 1.3
  - Body: 16px (Mobile: 16px) / Line Height 1.5
  - Small: 14px / Line Height 1.5
- **Accessibility:** Users can scale typography up to 200% without breaking the layout or losing functionality (WCAG 1.4.4).

## 3. Spacing & Grid System
- **Base Unit:** 8px.
- **Grid:** 12-column responsive grid.
  - Desktop (>= 1024px): 24px margins, 24px gutters.
  - Tablet (>= 768px): 16px margins, 16px gutters.
  - Mobile (< 768px): 16px margins, 16px gutters (1 column).

## 4. Motion & Animation
- **Curves:** Ease-in-out (`cubic-bezier(0.4, 0, 0.2, 1)`) for natural transitions.
- **Duration:** Short (150ms-250ms) to avoid feeling sluggish.
- **Accessibility:** Respects `prefers-reduced-motion` media query. All non-essential animations are disabled when true.

## 5. Touch Targets
- Minimum touch target size: 44x44px (WCAG 2.5.5 AAA compliant).

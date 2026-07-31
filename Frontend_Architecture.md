# Frontend Architecture: CommuniAble AI

## 1. Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (CSS Modules) / TailwindCSS (if configured, focused on high-contrast accessibility).
- **State**: Zustand (Global), React Query (Server State)

## 2. Client vs. Server Components (RSC)
- **Server Components**: Used by default for layouts, dashboards, and pages fetching initial report data. Ensures fast initial load and SEO (where applicable).
- **Client Components**: Designated with `"use client"`. Used for interactive components: audio recorders for speech assessments, rich text editors for writing practice, and complex stateful interactive graphs for progress tracking.

## 3. Caching and Revalidation
- **Next.js Cache**: Route segment caching utilized for static content (e.g., standard social stories, application metadata).
- **On-Demand Revalidation**: Server actions trigger `revalidatePath` when a user completes a new assessment or updates their accessibility profile, ensuring the UI reflects fresh data immediately.
- **React Query**: Used on the client side for polling background task status (e.g., waiting for a speech analysis report).

## 4. Accessibility First (a11y)
The architecture mandates strict adherence to WCAG 2.1 AA+ standards.
- Semantic HTML.
- ARIA labels on all interactive elements.
- Keyboard navigability enforced via ESLint rules (`eslint-plugin-jsx-a11y`).
- Dynamic theme application driven by the `accessibility_profiles` table.

# ExpressAble AI — Developer Onboarding Guide

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Git

### Setup

```bash
git clone <repo-url>
cd sah/frontend
cp .env.example .env.local
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Project Structure

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router pages (each folder = a route) |
| `src/components/ui/` | Design system primitives (Button, Switch, FormControls) |
| `src/components/common/` | Shared feature widgets (SpeechRecorder, EmptyState, FeedbackWidgets) |
| `src/components/layout/` | NavigationLayout, Sidebar, Header |
| `src/components/accessibility/` | AccessibilityToolbar, KeyboardHelper |
| `src/contexts/` | React Contexts (AccessibilityContext, AuthContext) |
| `src/hooks/` | Custom hooks (useApiQuery, useMicrophone, useAccessibility) |
| `src/lib/` | Core infrastructure (apiClient, errors, logger, cache, ai, supabase, fileUpload) |
| `src/providers/` | Provider wrappers (QueryProvider) |
| `src/services/` | API service modules (apiService, trainerService, adminService, etc.) |
| `src/store/` | Zustand stores (auth, communication, notifications, UI) |
| `src/types/` | TypeScript type definitions |
| `src/utils/` | Utilities (api.ts fetch wrapper, motion.ts animation presets, cn helper) |
| `src/styles/` | Global CSS and design tokens |
| `src/constants/` | App-wide constants |

## Key Patterns

### Adding a New Page
1. Create `src/app/your-route/page.tsx`
2. Add `"use client"` directive
3. Import `NavigationLayout` and wrap your content
4. Import `AccessibilityToolbar` and `KeyboardHelper`
5. Use `useAccessibility()` for reduced motion checks
6. Add `headingRef` with `tabIndex={-1}` for accessible focus management

### Adding a New API Service
1. Create `src/services/yourService.ts`
2. Import `apiFetch` from `@/utils/api`
3. Define typed interfaces for request/response
4. Export a service object with methods matching your FastAPI endpoints

### Adding a New Zustand Store
1. Create `src/store/useYourStore.ts`
2. Import `create` from `zustand`
3. Define the state interface and actions
4. Export the hook: `export const useYourStore = create<YourState>(...)`

### Adding a TanStack Query Hook
1. Add to `src/hooks/useApiQuery.ts`
2. Use `useQuery` with a unique `queryKey` array
3. Set `enabled: Boolean(token)` to gate on auth
4. Set `staleTime: 5 * 60 * 1000` for standard caching

## Accessibility Checklist for New Components

- [ ] All interactive elements are keyboard focusable
- [ ] Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-ring`)
- [ ] Proper ARIA labels on buttons without visible text
- [ ] `role="progressbar"` with `aria-valuenow/min/max` on progress indicators
- [ ] `aria-live="polite"` regions for dynamic content updates
- [ ] Semantic HTML (`<nav>`, `<main>`, `<section>`, `<h1>`-`<h6>`)
- [ ] Color contrast ratio ≥ 4.5:1 for text, ≥ 3:1 for large text
- [ ] Animations respect `settings.reducedMotion` via `fadePreset(isReduced)`
- [ ] Form fields have associated `<label>` elements

## Running Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npx tsc --noEmit     # Type check
```

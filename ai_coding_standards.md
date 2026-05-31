# FinEzy AI Coding Standards & Copilot Instructions

You are an AI coding assistant working on **FinEzy**, a premium CA and Compliance Portal built on Next.js, React, Vanilla CSS, and Supabase.

When writing or editing code for this repository, you **MUST** strictly adhere to the following rules:

---

## 1. Technology Stack Constraints
- **Framework**: Next.js 14 (App Router, standard layout structure).
- **Core Libraries**: React 18, `@supabase/supabase-js` (for direct database/auth client calls), and `lucide-react` (for icons).
- **Styling**: Vanilla CSS. **DO NOT** install TailwindCSS, Bootstrap, or any other UI framework unless explicitly requested.

---

## 2. Design System & CSS Rules
All styling must strictly conform to the system defined in [design_guidelines.md](file:///c:/Coading - Seperate folder/Landing page/landing-page/design_guidelines.md):

- **No Hardcoded Hex/RGB Colors**: Every color declaration must reference a CSS variable (e.g., `var(--bg-surface)`, `var(--primary)`). Hardcoded colors break Light/Dark theme switching.
- **Theme Variables**:
  - Main background: `var(--bg)`
  - Card/Component background: `var(--bg-surface)`
  - Primary blue: `var(--primary)`
- **Fonts**: Use `--font-heading` (`Outfit`) for titles/headings and `--font-body` (`Inter`) for text/labels.
- **Spacing/Radius**: Use existing variables: `--radius-sm` (6px), `--radius-md` (10px), `--radius-lg` (16px), `--radius-xl` (24px).
- **Transitions**: Every interactive element (hover, focus, active states) must animate smoothly using:
  - `--transition-fast` (0.15s)
  - `--transition-normal` (0.25s)
  - `--transition-slow` (0.4s)
- **Glassmorphism**: When implementing sticky navigation or floating modals, use `background-color: var(--glass-bg)` and `backdrop-filter: blur(var(--glass-blur))`.

---

## 3. React & Next.js Best Practices
- **Hydration & Directives**: Use `"use client"` at the top of files that utilize React hooks (`useState`, `useEffect`) or DOM-only APIs. Keep layouts and static content as Server Components where possible.
- **State Management**: Prefer local component state or URL state (using hashes/query params) for UI navigation/filters to preserve deep-linkability.
- **Component Modularity**: Keep components clean, reusable, and small. Do not bundle entire multi-page applications into a single massive file unless replicating existing dashboard views.

---

## 4. Supabase & Database Integrations
- **Credentials**: Import variables dynamically using `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. Do not hardcode secret keys.
- **Error Handling**: Wrap Supabase requests in `try-catch` blocks and display clean Toast alerts indicating success or failure.
- **Row Level Security (RLS)**: Design database operations keeping RLS policies in mind. Client-side database inserts (via anon key) must have an explicit `anon` write policy.

---

## 5. SEO & Accessibility
- **Semantic HTML**: Always use appropriate layout containers (`<nav>`, `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **Headings**: Ensure each page has exactly one `<h1>` tag and builds a proper hierarchy downwards (`h2`, `h3`, `h4`).
- **Interactive Element IDs**: Ensure all buttons, forms, and interactive nodes have unique, descriptive `id` or `class` attributes to facilitate automated testing.

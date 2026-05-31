# FinEzy Design Guidelines & Style Guide

This document defines the core design system, typography, colors, and layout guidelines for the FinEzy application. All new features and components must adhere to this system to maintain visual consistency, premium aesthetics, and responsive layout standards.

---

## 1. Design Philosophy
- **Rich Aesthetics**: High-end styling using curated, harmonious color palettes, smooth gradient fills, and subtle borders.
- **Glassmorphism**: Layered glass effects on sticky navigations and overlays, leveraging `backdrop-filter` for a premium, clean desktop/mobile transition.
- **Micro-interactions**: Interactive components (cards, links, buttons) should respond to hover, focus, and state updates using custom transition curves.
- **Semantic Structure**: Maintain clean HTML5 nesting (`<nav>`, `<main>`, `<section>`, `<footer>`) with unique IDs for layout blocks and forms.

---

## 2. Typography

All text elements must use CSS variable font families. Do not hardcode typography values.

| Element | Font Family | Variable | Standard Sizes / Weights |
| :--- | :--- | :--- | :--- |
| **Headings** (`h1`, `h2`, `h3`, `h4`) | `Outfit` | `--font-heading` | **Bold (700/800)**: `h1` (2.2rem / 3.2rem in Hero), `h2` (1.75rem / 2rem), `h3` (1.3rem) |
| **Body / UI** (`p`, `span`, `button`, etc.) | `Inter` | `--font-body` | **Regular/Medium (400/500/600)**: 15px base size, 1.6 line height |

---

## 3. Colors & Theme System

We use HSL color tokens to easily transition between Light and Dark themes. The active theme is controlled by the `[data-theme="light|dark"]` attribute on the root HTML tag.

### A. Theme Colors

```css
/* Light (Default) */
--bg: hsl(210, 40%, 99%);             /* Slate-tinted off-white background */
--bg-alt: hsl(210, 40%, 96%);         /* Subtle gray-blue layout panels */
--bg-surface: hsl(0, 0%, 100%);       /* Card backgrounds */
--bg-surface-alt: hsl(210, 40%, 97%);  /* Section fills / tables */
--border: hsl(214, 32%, 91%);         /* Default border */
--border-focus: hsl(224, 76%, 60%);   /* Active form border */

/* Dark Theme */
--bg: hsl(224, 71%, 4%);
--bg-alt: hsl(224, 71%, 6%);
--bg-surface: hsl(224, 71%, 8%);
--bg-surface-alt: hsl(224, 71%, 11%);
--border: hsl(224, 30%, 16%);
--border-focus: hsl(217, 91%, 60%);
```

### B. Typography Colors

- **Primary Text** (`--text-primary`): `hsl(222, 47%, 12%)` (Light) / `hsl(210, 40%, 98%)` (Dark)
- **Secondary Text** (`--text-secondary`): `hsl(215, 16%, 40%)` (Light) / `hsl(215, 20%, 75%)` (Dark)
- **Tertiary/Muted Text** (`--text-tertiary`): `hsl(215, 13%, 62%)` (Light) / `hsl(215, 15%, 52%)` (Dark)

### C. Branding & Semantic Colors

- **Primary Brand Color** (`--primary`): `hsl(224, 76%, 48%)` (Light Blue) / `hsl(217, 91%, 56%)` (Dark Accent)
- **Primary Light** (`--primary-light`): `hsl(220, 95%, 96%)` / `hsl(217, 91%, 12%)`
- **Primary Dark** (`--primary-dark`): `hsl(224, 76%, 36%)` / `hsl(217, 91%, 75%)`

| Semantic Meaning | Color Variable | Light Hex/HSL | Dark Hex/HSL |
| :--- | :--- | :--- | :--- |
| **Success** (Safe status, GST, complete check) | `--success` | `hsl(142, 72%, 29%)` | `hsl(142, 68%, 45%)` |
| **Warning** (Filing soon, MCA, alert updates) | `--warning` | `hsl(38, 92%, 46%)` | `hsl(38, 92%, 52%)` |
| **Danger** (Overdue/Urgent status, SEBI alerts) | `--danger` | `hsl(0, 84%, 55%)` | `hsl(0, 84%, 60%)` |

---

## 4. Spacing, Borders, & Shadows

Consistent dimensions and radii are critical to keeping the interface looking polished.

### Border Radii
- **Small Corners** (`--radius-sm`): `6px` (e.g. Logo containers, micro buttons)
- **Medium Corners** (`--radius-md`): `10px` (e.g. Buttons, filter pills, smaller input controls)
- **Large Corners** (`--radius-lg`): `16px` (e.g. Standard cards, tables, dashboard panels)
- **Extra Large Corners** (`--radius-xl`): `24px` (e.g. Hero panels, marketing cards)
- **Pill/Circle** (`--radius-full`): `9999px` (e.g. Badges, tags, toggle controls)

### Shadows
- **Small** (`--shadow-sm`): `0 1px 2px 0 rgba(15, 23, 42, 0.05)` (Default card resting state)
- **Medium** (`--shadow-md`): `0 4px 6px -1px rgba(15, 23, 42, 0.05)` (Focus/active panel container)
- **Large** (`--shadow-lg`): `0 10px 15px -3px rgba(15, 23, 42, 0.05)` (Hover active cards/menus)
- **Extra Large** (`--shadow-xl`): `0 20px 25px -5px rgba(15, 23, 42, 0.06)` (Modals, popup dropdowns)

---

## 5. UI Elements & Component Standards

### A. Navigation Bar (`.glass-nav`)
- Must remain sticky at the top (`top: 0`, `z-index: 100`).
- Background uses `--glass-bg` with a backdrop filter (`blur(16px)`).
- Borders use `--glass-border` with a bottom edge separator.
- Contains high-contrast text and a brand logo styled with `--primary`.

### B. Interactive Buttons
- **Primary Buttons** (`.btn-primary`): Solid primary color, bold white text, subtle hover lift (`translateY(-1px)`), and primary-colored box-shadows.
- **Secondary Buttons** (`.btn-secondary`): Outlined container, background matches surface. Hover transitions to `--bg-alt` and includes right-facing transitions on nested icons (e.g., arrow SVG shifts `translateX(4px)`).
- **Toggles & Icon buttons** (`.icon-btn-toggle`): Single icon with dynamic border and light background transition.

### C. Cards (`.feature-card`, `.stat-card`)
- Card structures must use flex layouts to vertically distribute footer metadata.
- Borders default to `--border` but transition to `--primary` on hover.
- Must include a subtle transform transition (`translateY(-4px)`) and a shadow expansion (`--shadow-lg`) when hovered.

### D. Form Elements
- Inputs, selects, and textareas must have their custom focus outlines disabled.
- On focus, borders must highlight to `--border-focus` or `--primary` with a light border-shadow ring.
- Labels should always be clearly structured using standard tags with a color of `--text-secondary`.

---

## 6. Transitions & Animations

For a cohesive experience, all hover, active states, and page navigation must use standard timing variables.

- **Fast** (`--transition-fast`): `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (Used for hover states, color changes, and buttons)
- **Normal** (`--transition-normal`): `0.25s cubic-bezier(0.4, 0, 0.2, 1)` (Used for layouts, theme switching, and accordion cards)
- **Slow** (`--transition-slow`): `0.4s cubic-bezier(0.4, 0, 0.2, 1)` (Used for hero animations, multi-step sections, and large panels)

---

## 7. Scalability & Development Best Practices

1. **Class-based Utilities over Inline Styles**: Always leverage predefined global utility classes (e.g., `.text-center`, `.rounded-lg`, `.flex-center-y`) before defining custom component rules.
2. **Never Hardcode Theme Hexes**: Always write color rules referencing CSS variables (e.g., `background-color: var(--bg-surface)`). Hardcoded colors will break the dark/light toggle.
3. **Responsive Media Queries**: Build layouts using CSS Grid and Flexbox with responsive column variables (e.g., `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`). Avoid hardcoding pixel widths on containers.
4. **Unique Semantic IDs**: Provide clear and unique `id` attributes for important sections, interactive buttons, and input fields to simplify automation and layout testing.

# Nexus AI Horizon — Website

A static, premium-feel multi-page site for Nexus AI Horizon. No build step. Open `index.html` in a browser or serve the folder with any static server.

## Local preview

```bash
# any static server, pick one
python -m http.server 8080
# or
npx serve .
```

Then visit `http://localhost:8080`.

## Structure

```
nexus-site/
├── index.html                           Homepage
├── services.html                        Platform / 4 services
├── about.html                           NYC story + principles
├── contact.html                         Form + studio info
├── niches/
│   ├── emergency-services.html          Plumbing · HVAC · Electrical · Restoration
│   ├── property-management.html         Tenant intake + lease tours
│   ├── moving.html                      Quote intake + booking
│   └── financial-services.html          Compliance-ready advisor intake
├── assets/
│   ├── css/styles.css                   Single design system, ~600 lines
│   └── js/main.js                       Sticky header, mobile menu, scroll reveal
└── README.md
```

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F4EE` | Warm paper background |
| `--ink` | `#0A0A0F` | Primary text |
| `--ink-2` | `#2C2C36` | Secondary text |
| `--muted` | `#6E6E78` | Tertiary text, captions |
| `--hairline` | `#E4E1D9` | Soft dividers |
| `--accent` | `#FF4B1A` | Signature warm accent |

**Type:** Instrument Serif (display & italic accents) · Inter 300/400/500/600 (body) · JetBrains Mono (eyebrows, monospace flourishes). All loaded from Google Fonts.

**Layout:** 1240px container, fluid section padding via `clamp(80px, 12vh, 160px)`, mobile-first responsive at 900px and 700px.

## Imagery

All hero and section images use Unsplash direct URLs (free for commercial use). Each section is annotated with an `<!-- Image suggestion: -->` comment so you can swap in custom photography or licensed stock without hunting for the right slot. To swap an image, replace the `src` of the relevant `<img>` and update the `alt`.

Recommended swap-ins for production:
- Hero: a custom NYC photograph at golden hour
- Niche cards: real customer-environment photography (with permission)
- Founder/team quote: actual portrait of leadership

## Sections per page

### Homepage (`index.html`)
1. Sticky header
2. Hero (headline, lede, CTAs, stat strip, full-bleed image)
3. Marquee strip (industry names)
4. Feature row 01 — Voice agent
5. Niche grid (4 cards)
6. Process (3 steps)
7. Stat row (4 proof points)
8. Customer quote
9. CTA banner
10. Footer

### Niche pages
1. Page hero with eyebrow + serif italic accent
2. Two-column problem statement
3. Solution feature row (image + bulleted features)
4. 6-card feature grid
5. 4-stat outcomes row
6. 3-tier pricing (middle tier featured/inverted)
7. CTA banner
8. Footer

### Services (`services.html`)
1. Page hero
2. 4 alternating service blocks (Voice agents, SMS, Lead follow-up, Internal automation)
3. Integration grid (per-industry stack)
4. 3-step process
5. CTA banner

### About (`about.html`)
1. Page hero
2. Two-col story
3. Full-bleed NYC image
4. 6-card principles grid
5. Stat row
6. Closing quote
7. CTA banner

### Contact (`contact.html`)
1. Page hero
2. Two-column: studio info (left) + form (right)
3. Closing CTA banner

## Form

The form on `contact.html` posts to `#`. Wire it to your backend, Formspree, Netlify Forms, or your CRM endpoint. Required fields are marked with the `required` attribute.

## Accessibility & performance

- Semantic HTML throughout (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`).
- All images have `alt` text; lazy-loaded below the fold.
- `prefers-reduced-motion` disables transitions and reveal animations.
- No JS framework. Total JS payload ~1KB.
- Fonts preconnected. Single CSS file.

## Migrating to React / Next.js

The HTML is designed to translate cleanly. Suggested mapping:

- Header / footer → shared `<Layout>` component
- Niche card → `<NicheCard>` component (image, tag, title, copy, link)
- Service block → `<Service>` component (alternating image/text)
- Pricing card → `<PriceCard>` with a `featured` prop
- Form → keep as a controlled component, post to your endpoint

The CSS is plain and framework-agnostic. Move tokens into `globals.css` or a Tailwind config; component styles can stay as-is.

## Copy tone reference

Direct, confident, NYC-specific. Lead with the customer's loss ("every missed call is a customer your competitor just won"), prove with numbers, close with a 20-minute commitment. Avoid: "leverage", "synergy", "AI-powered", "revolutionary", emoji.

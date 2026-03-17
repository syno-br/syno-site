# CLAUDE.md — Frontend Website Rules

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label: `node screenshot.mjs http://localhost:3000 label` → `screenshot-N-label.png`
- After screenshotting, read the PNG with the Read tool and analyze it directly.
- Do at least **2 screenshot + review rounds** per build. Stop only when the result looks production-ready or user says so.
- When reviewing, be specific: "heading is 32px but should be 24px", "gap is 16px but should be 24px", "color is #333 but should be #1a1a1a"
- Check every pass: spacing, font size/weight/line-height, exact colors, alignment, border-radius, shadows, image sizing, animation triggers

## Reference Images
- If provided: match layout, spacing, typography, color exactly. Use placeholder content (`https://placehold.co/`). Do not improve or add to the design.
- If not provided: design from scratch with maximum craft (see Design System below).
- Compare screenshot vs reference until no visible differences remain.

## Output Defaults
- Single `index.html` unless told otherwise — all styles and scripts inline
- **Tailwind CSS via CDN:** `<script src="https://cdn.tailwindcss.com"></script>`
- Extend Tailwind config inline with `tailwind.config` for custom tokens
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive, tested at 375px, 768px, 1280px, 1920px

## Brand Assets
- Always check `brand_assets/` before designing — logos, color guides, style guides, images
- Use real assets when present. Never use placeholders where real assets exist.
- If a color palette is defined, use exact values. Do not invent brand colors.

---

## Design System — The Standard to Hit

The goal is agency-quality work: fluid, cinematic, intentional. Reference benchmark: hugeinc.com.

### Motion & Animation
- **Page load:** Stagger-reveal key elements (hero heading word-by-word, then subtext, then CTA) using `opacity` + `transform: translateY` with delays
- **Scroll-driven:** Use `IntersectionObserver` to trigger reveals. Elements enter from slight offset (`translateY(40px)` → `0`) with `opacity 0` → `1`
- **Cursor:** Implement a custom cursor — a small dot + larger trailing circle. The trailing circle should scale up on hover over links/buttons
- **Magnetic buttons:** On hover, buttons should slightly follow the cursor using JS mouse tracking (`transform: translate(x, y)`)
- **Parallax:** Hero background / large images move at 0.3–0.6x scroll speed via `requestAnimationFrame`
- **Smooth scroll:** Use `Lenis`-style smooth scrolling via vanilla JS (lerp the scroll position)
- **Transitions:** Page sections cross-fade or slide in on scroll. Never use `transition-all`. Only animate `transform` and `opacity`.
- **Easing:** Use spring-style easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `cubic-bezier(0.7, 0, 0.84, 0)` for exits
- **Hover on cards/images:** Subtle scale (`1.03`) + shadow deepening + color shift. Image zoom inside container via `overflow:hidden`

### Typography
- Never use the same font for headings and body — always pair a display/serif with a clean sans
- Load from Google Fonts (3 families max for performance)
- Large headings: tight tracking (`letter-spacing: -0.03em`), bold weight (700–900)
- Body: generous line-height (`1.7`), regular weight, slightly muted color
- Hero text: oversized (`clamp(60px, 10vw, 140px)`), full-bleed, possibly split into animated words
- Use fluid type scaling via `clamp()` everywhere — no fixed px breakpoints for font sizes

### Color & Surfaces
- Never use default Tailwind palette (indigo-500, blue-600, etc.)
- Define a custom brand palette in the Tailwind config with at least: `primary`, `surface`, `elevated`, `muted`, `accent`
- Dark mode by default unless brand assets suggest otherwise
- Layered surface system: `background` → `surface` (cards) → `elevated` (modals/tooltips) — each step lighter/darker
- Backgrounds: layer 2–3 radial gradients at different positions/colors with low opacity, not flat fills
- Add grain/texture via an SVG `feTurbulence` noise filter overlaid at 3–6% opacity for depth

### Shadows & Depth
- Never use flat `shadow-md`
- Use layered, color-tinted shadows: e.g. `0 4px 6px rgba(0,0,0,0.04), 0 20px 40px rgba(0,0,0,0.12), 0 0 80px rgba(BRAND_COLOR, 0.08)`
- Floating elements (nav, modals) should have a visible blur backdrop: `backdrop-filter: blur(16px)`
- Use `z-index` intentionally — establish a clear layering system in the CSS

### Layout & Spacing
- Use a consistent spacing token system — define in Tailwind config: `4, 8, 16, 24, 32, 48, 64, 96, 128px`
- Section padding: generous vertical rhythm (`padding: 120px 0` on desktop)
- Asymmetric or editorial grid layouts — avoid boring equal-column grids
- Full-bleed sections with content constrained to max-width container (`max-w-7xl mx-auto px-6`)
- Hero: full viewport height (`100svh`), centered or offset composition

### Interactions
- **Every clickable element** must have `hover`, `focus-visible`, and `active` states — no exceptions
- Nav links: underline-draw-in on hover (pseudo-element `scaleX` from 0→1)
- Buttons: magnetic pull + background fill sweep on hover (use `::before` pseudo with clip-path or transform)
- Images: gradient overlay (`bg-gradient-to-t from-black/60`) + optional color treatment with `mix-blend-multiply`
- Form inputs: animated floating labels, focus glow matching brand color

### Navigation
- Sticky nav with `backdrop-filter: blur` + subtle border-bottom on scroll
- Logo on left, links center or right, optional CTA button
- Mobile: full-screen overlay menu with staggered link reveal animation
- Nav should hide on scroll down, reappear on scroll up (via JS scroll direction detection)

### Sections to Consider (use what fits the project)
- **Hero** — full viewport, bold headline, subtext, CTA, background video or gradient motion
- **Marquee/ticker** — horizontally scrolling text or logo strip (CSS animation, `animation: scroll linear infinite`)
- **Work/Case Studies grid** — large image cards, hover reveals project name + category
- **Stats/Numbers** — count-up animation on scroll into view
- **About/Philosophy** — editorial layout, large pull quote, offset image
- **Process** — numbered steps with scroll-triggered progression
- **Testimonials** — horizontal scroll or auto-rotating carousel
- **Footer** — dark, full-width, with nav links, social icons, legal text

---

## Hard Rules
- Do not add sections or content not in the reference
- Do not "improve" a reference — match it exactly
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary
- Do not use the same font for headings and body
- Do not ship flat, static pages — motion and interactivity are baseline, not optional
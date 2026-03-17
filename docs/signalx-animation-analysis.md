# SignalX Webflow — Animation Analysis
> Source: https://signalx.webflow.io/

Use this as reference to recreate these animations in your own site.

---

## Stack

- **Webflow IX2** — all scroll/hover/tab interactions
- **Lottie / bodymovin v5.12.1** — all curve and feature animations
- **jQuery 3.5.1** — loaded by Webflow
- No GSAP, no ScrollMagic, no IntersectionObserver, no Canvas

---

## 1. SVG Curve Animation

### Hero Left/Right Lines

Lottie files: `hero-left-line` and `hero-right-line`
Canvas: **196×677px** — auto-play, loop, 3s duration, 60fps

**How it works:**
- A static dark S-curve acts as the "rail" (`stroke: #1d1e36`)
- A white-to-transparent gradient stroke slides along the same path via `TrimPaths` (start→end properties animating 0→100 over 180 frames)
- Loop is infinite

**Recreate in pure SVG/CSS:**
```html
<svg width="196" height="677" viewBox="-98 -338 196 677">
  <defs>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="white" stop-opacity="0"/>
      <stop offset="50%"  stop-color="white" stop-opacity="1"/>
      <stop offset="100%" stop-color="white" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Static dark rail -->
  <path
    d="M -87.5,-338.75 C -87.5,-331.81 -87.5,-73.345 -78.004,-49.389
       C -68.508,-25.433 68.101,23.245 78.004,46.889
       C 87.907,70.533 87.5,330.814 87.5,338.75"
    fill="none" stroke="#1d1e36" stroke-width="1.5"/>

  <!-- Animated gradient stroke -->
  <path
    d="M -87.5,-338.75 C -87.5,-331.81 -87.5,-73.345 -78.004,-49.389
       C -68.508,-25.433 68.101,23.245 78.004,46.889
       C 87.907,70.533 87.5,330.814 87.5,338.75"
    fill="none" stroke="url(#lineGrad)" stroke-width="1.5"
    stroke-dasharray="700" stroke-dashoffset="700">
    <animate attributeName="stroke-dashoffset"
      from="700" to="-700"
      dur="3s" repeatCount="indefinite" calcMode="linear"/>
  </path>
</svg>
```

**Right line** = same path, horizontally mirrored (`transform="scale(-1,1)"`).

---

### Simple Section Curve (self-drawing)

Lottie file: `simple-lottie` (7.2 KB)
Canvas: **1440×881px** — scroll-triggered, no loop, ~2s, ease-out

**How it works:**
- 3 curved paths drawn from left to right via `TrimPaths` (e: 0→100, 120 frames, easing 0.6,1)
- Stroke: `rgb(101,106,225)` (indigo), 9px wide
- **Gaussian Blur of 34px** applied to the stroke — this creates the glow effect
- A filled triangular gradient polygon sits behind as background

**Recreate in CSS/SVG:**
```html
<svg width="1440" height="881" viewBox="-720 -440 1440 881">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="34" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <path
    d="M -196.419,-336.25 C -609.293,-185.05 -64.049,-50.566 426,336.25"
    fill="none" stroke="#656ae1" stroke-width="9"
    filter="url(#glow)"
    stroke-dasharray="1200" stroke-dashoffset="1200">
    <animate attributeName="stroke-dashoffset"
      from="1200" to="0"
      dur="2s" fill="freeze"
      calcMode="spline" keySplines="0.6 0 1 1"/>
  </path>
</svg>
```

---

## 2. Glow Effects

| Element | Technique | Value |
|---|---|---|
| Curve (simple-lottie) | SVG Gaussian Blur | `stdDeviation="34"` |
| `.perks-circle` | CSS `filter: blur` | `blur(86.6px)`, color `#4448b81a` |
| `.cta-circle-two` | CSS `filter: blur` | `blur(64px)` + gradient |
| `.features-card-inner-shadow` | `box-shadow inset` | `inset 0 0 14px #18182f` |
| Support tabs (active) | Multi `box-shadow inset` | `inset 0 15px 20px -10px #acaefc99, inset 0 8px 19px 1px #8d8dffb3` |
| Hero shadow | Pre-rendered `.avif` image | Radial glow texture |

**Perks card hover glow (IX2 controlled):**
```css
.perks-circle {
  border-radius: 100%;
  background-color: #4448b81a;
  opacity: 0;
  filter: blur(86.6px);
  width: 400px;
  height: 320px;
  position: absolute;
  pointer-events: none;
  transition: opacity 500ms ease, transform 500ms ease;
}
/* On hover: opacity → 1, translateY(50px → 0) */
```

---

## 3. Scroll-Triggered Animations (IX2)

All via Webflow IX2. Pattern used for ~100 elements:

**Initial state (set inline via IX2):**
```css
transform: translateY(35px);
filter: blur(5px);
opacity: 0;
```

**On scroll into view:**
```css
transform: translateY(0);
filter: blur(0);
opacity: 1;
transition: all 600ms ease;
/* Staggered: delay 100ms, 200ms, 300ms... per element */
```

**Brands marquee (infinite ticker):**
```css
/* .brands-list loops translateX(0% → -100%) in 40s, then resets to 0% instantly */
animation: marquee 40s linear infinite;

@keyframes marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}
```

**Statistics counter:**
```css
/* .upper slides from translateY(400%→0), .lower from translateY(-400%→0) */
/* Duration: 1000ms, easing: outQuad */
```

**Integrations parallax (scroll progress):**
```css
/* Icons 1-5 staggered: translateY(60px→0) + blur(10px→0) + opacity(0→1) */
/* Triggered continuously as section scrolls into viewport */
```

---

## 4. Lottie Animations

| Element | Size | Autoplay | Loop | Trigger |
|---|---|---|---|---|
| `hamburger-menu` | small | No | No | IX2 NAVBAR events |
| `ai-line` | — | Yes | Yes | — |
| `hero-left-line` | 196×677 | Yes | Yes | — |
| `hero-right-line` | 196×677 | Yes | Yes | — |
| `features-lottie-01` | 623 KB | No | No | Scroll 10% offset |
| `features-lottie-02` | 446 KB | No | No | Scroll 10% offset |
| `grow-lottie` | 515 KB | No | No | Scroll 10% offset |
| `simple-lottie` | 7.2 KB | No | No | Scroll |

**Webflow Lottie HTML pattern:**
```html
<div
  data-animation-type="lottie"
  data-src="YOUR_FILE.json"
  data-loop="1"
  data-direction="1"
  data-autoplay="1"
  data-renderer="svg"
  data-duration="3"
  data-w-id="WEBFLOW_IX2_ID">
</div>
```

---

## 5. Design Tokens

```css
:root {
  --colors--primary:        #4448b8;     /* indigo */
  --colors--dark:           #020207;
  --colors--dark-bg:        #060610;
  --colors--dark-light-bg:  #101131;
  --colors--primary-10:     #4448b81a;   /* glow blobs */
  --colors--stroke-01:      #1d1e36;
  --colors--stroke-02:      #cdcfff33;
}
```

---

## 6. IX2 Event Summary

- 130× `SCROLL_INTO_VIEW`
- 10× `MOUSE_OVER` / 10× `MOUSE_OUT`
- 4× `TAB_ACTIVE` / 4× `TAB_INACTIVE`
- 3× `SCROLLING_IN_VIEW` (continuous parallax)
- 1× `NAVBAR_OPEN` / 1× `NAVBAR_CLOSE`

---

## 7. Visual Composition Deep Dive

### Hero Lines — Layer Stack

Same S-curve path, 2 layers:

| Layer | Color | Stroke | Role |
|---|---|---|---|
| `Vector 8086` (bottom) | `#1d1e36` (navy) | 1px solid | Static dark rail |
| `Vector 8087` (top) | white→transparent | 2px gradient | Animated glow dot |

**How the glow dot moves:**
- TrimPaths: 15% segment visible (frames 0–16)
- TrimPaths offset: 0°→360° continuously (frames 16–180) → the segment orbits the path
- Gradient (white center, transparent edges) = "glowing drop" illusion
- Loop: infinite

**Right line = left line with `scaleX: -100` (horizontal mirror)**

---

### Simple Lottie — 4-Layer Visual Stack

```
┌─────────────────────────────────────────────┐
│  comp_1: Triangle fill #656ae1→transparent  │  ← bluish shadow below curve
├─────────────────────────────────────────────┤
│  comp_0 / Vector 2: #1d1e36, 9px stroke     │  ← dark rail
├─────────────────────────────────────────────┤
│  comp_0 / Vector 6: #656ae1, 9px stroke     │  ← crisp indigo line
├─────────────────────────────────────────────┤
│  comp_0 / Vector 7: #656ae1 + blur(34px)    │  ← glow halo ~80px wide
└─────────────────────────────────────────────┘
```

**The "bluish shadow" (sombra azulada):**
- `comp_1 / Vector 5`: closed triangular polygon
- Follows the curve on top + rectangular edges below
- `fill: linear-gradient(#656ae1 opaque → #656ae1 transparent)`
- Direction: top-right to bottom-left (diagonal)
- Creates the "light bleeding below the curve" atmospheric effect

**Curve self-draw animation:**
- TrimPaths `end`: 0→100% over 120 frames (2s), easing `cubic-bezier(0.6, 0, 1, 1)`
- All 3 curve layers animate simultaneously
- The triangle (comp_1) appears statically — no TrimPaths, full opacity from frame 0

**Exact colors:**
```css
--indigo:      #656ae1;  /* rgb(101, 106, 225) */
--dark-rail:   #1d1e36;  /* rgb(29, 30, 54)   */
--glow-blur:   34px;     /* Gaussian blur stdDeviation */
--stroke-width: 9px;
```

**Recreate in CSS/SVG:**
```html
<svg width="1440" height="881" viewBox="0 0 1440 881">
  <defs>
    <filter id="curve-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="34"/>
    </filter>
    <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#656ae1" stop-opacity="0"/>
      <stop offset="50%"  stop-color="#656ae1" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#656ae1" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="shadowGrad" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#656ae1" stop-opacity="1"/>
      <stop offset="100%" stop-color="#656ae1" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="drawClip">
      <rect x="-300" y="-500" width="0" height="1400">
        <animate attributeName="width" from="0" to="1400"
          dur="2s" fill="freeze" calcMode="spline" keySplines="0.6 0 1 1"/>
      </rect>
    </clipPath>
  </defs>

  <!-- Bluish shadow below curve -->
  <path d="M 386,105 C 410,480 1005,595 1268,617 L 1268,881 L 0,881 Z"
    fill="url(#shadowGrad)" opacity="0.4"/>

  <!-- Dark rail -->
  <path d="M 386,105 C 410,480 1005,595 1268,617"
    fill="none" stroke="#1d1e36" stroke-width="9" stroke-linecap="round"/>

  <!-- Crisp indigo line -->
  <path d="M 386,105 C 410,480 1005,595 1268,617"
    fill="none" stroke="url(#curveGrad)" stroke-width="9"
    stroke-linecap="round" clip-path="url(#drawClip)"/>

  <!-- Glow layer -->
  <path d="M 386,105 C 410,480 1005,595 1268,617"
    fill="none" stroke="url(#curveGrad)" stroke-width="9"
    stroke-linecap="round" filter="url(#curve-glow)"
    clip-path="url(#drawClip)"/>
</svg>
```

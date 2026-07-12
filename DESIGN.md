# DESIGN.md — Roller 3D Portfolio

## 1. Visual Theme & Atmosphere

**Depth-Scrolling Diorama** — A dark, volumetric portfolio that treats the browser as a 3D stage. The page is a single continuous scroll where each section is a distinct "depth layer" — content cards float at different Z planes, the background model orbits at a fixed depth, and particles stream past like depth-of-field dust motes. The color palette is monochrome warm (`#1a1410` → `#f5f0e8`) with a single cyan energy accent (`#00d4ff`) that acts as a "light source" — buttons glow, borders catch light, and the 3D model's edge-lighting shifts as it rotates.

The metaphor is an architect's workshop at dusk: warm ambient shadows, one bright task light, and physical materials (paper, glass, metal) arranged across a broad table. Every section feels like a physical card you could pick up — rounded corners, subtle top-edge highlights, soft drop shadows that shift with scroll angle.

**Vibe keywords:** Cinematic depth, warm-dark, volumetric, single-light-source, diorama, architect-workshop, scroll-driven narrative.

---

## 2. Color Palette & Roles

### Surface colors

| Token | Hex | Role |
|-------|-----|------|
| `--depth-bg-0` | `#0d0d0d` | Far background (3D stage void) |
| `--depth-bg-1` | `#1a1410` | Page surface — warm dark brown |
| `--depth-bg-2` | `#2a221c` | Section alternate, card surface |
| `--depth-bg-3` | `#3a322a` | Elevated cards, hover state |
| `--surface-white` | `#f5f0e8` | Text on dark, card content bg |
| `--surface-soft` | `#e8e0d6` | Secondary text, muted surfaces |

### Light-source accent

| Token | Hex | Role |
|-------|-----|------|
| `--cyan-light` | `#00d4ff` | Primary accent — "task light" glow |
| `--cyan-mid` | `#00a8cc` | Button bg, link hover |
| `--cyan-glow` | `rgba(0,212,255,0.08)` | Subtle surface glow, card rim light |
| `--cyan-beam` | `rgba(0,212,255,0.04)` | Large area ambient glow |

### Glass tokens

| Token | Value | Role |
|-------|-------|------|
| `--glass-bg` | `rgba(245,240,232,0.04)` | Glass surface |
| `--glass-border` | `rgba(245,240,232,0.08)` | Glass rim |
| `--glass-blur` | `12px` | Backdrop blur |
| `--glass-radius` | `20px` | Card corner radius |

### Depth tokens

| Token | Value | Role |
|-------|-------|------|
| `--z-void` | `-2` | 3D scene background |
| `--z-scene` | `-1` | 3D model layer |
| `--z-content` | `1` | Section content |
| `--z-glass` | `2` | Floating glass cards |
| `--z-float` | `10` | Floating particles, decorations |
| `--z-nav` | `100` | Navigation overlay |

---

## 3. Typography Rules

### Font stack

- **Display:** `'Space Grotesk', system-ui, sans-serif` — geometric, sharp, technical warmth
- **Body:** `'Inter', system-ui, sans-serif` — clean, highly readable at small sizes
- **Mono:** `'JetBrains Mono', 'Fira Code', monospace` — for metrics, tags, data points

### Type scale with depth mapping

| Token | Size | Weight | Letter-spacing | Depth | Usage |
|-------|------|--------|----------------|-------|-------|
| Depth hero | `clamp(4rem, 12vw, 9rem)` | 700 | `-0.06em` | Z-1 (behind glass) | "SHIVAM" — giant outline, scroll-parallax |
| Hero name | `clamp(2.4rem, 5vw, 4rem)` | 600 | `-0.03em` | Z1 (on glass) | Foreground name overlay |
| Section number | `clamp(5rem, 10vw, 8rem)` | 800 | `-0.04em` | Z-0.5 | 01, 02, 03 — positioned behind title |
| Section title | `clamp(1.8rem, 3.5vw, 3rem)` | 600 | `-0.02em` | Z1 | Section headings |
| Card title | `1.25rem` | 600 | `normal` | Z1 | Card headings |
| Body | `15px` | 400 | `0.01em` | Z1 | Descriptions, content |
| Mono metric | `13px` | 500 | `0.08em` | Z1 | Stats, years, tags |
| Tiny mono | `11px` | 400 | `0.12em` | Z1 | Footers, labels |

### Line height

- Hero outline: `0.85` (tight, monumental)
- Section numbers: `0.9`
- Body: `1.7`
- Cards: `1.6`

### Gradient text

Only one element uses gradient: the hero name-on-glass uses a subtle warm gradient (`#f5f0e8` → `#c4b8a8`) for a "light catching the top edge" effect. All other text is solid color.

---

## 4. Component Stylings

### Depth Camera (3D Scene Container)

- Fixed viewport canvas behind all content at `z-index: var(--z-scene)`
- Three distinct Z layers rendered at different parallax rates:
  - **Far (Z-2):** Slow-rotating torus knot, ambient particles, depth fog — scrolls at 0.1× speed
  - **Mid (Z-1):** The primary GLB model (suited figure) with rim-lighting — scrolls at 0.3× speed, rotates on mouse position
  - **Near (Z0):** Fast floating particles, caustic light shafts — scrolls at 0.6× speed
- Scroll-driven depth dissolve: as user scrolls, each layer independently fades based on its own scroll threshold
- Mouse-driven parallax: camera orbits slightly toward cursor position (subtle — max 2° offset)

### Glass Card

```
glass-bg: rgba(245,240,232,0.04)
border: 1px solid rgba(245,240,232,0.08)
border-radius: 20px
backdrop-filter: blur(12px)
box-shadow: 
  0 2px 0 0 rgba(245,240,232,0.03) inset (top-edge highlight)
  0 20px 60px rgba(0,0,0,0.5)
transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1)
```

On hover:
- Border brightens to `rgba(0,212,255,0.2)`
- Top-edge highlight intensifies
- Card lifts `-6px` Y with `scale(1.01)`
- Box shadow deepens

### Navigation Pill

- Fixed bottom-center: `translateX(-50%)`, bottom `32px`
- Glass pill: same glass tokens, `60px` height, `auto` width
- Items: horizontal row of section names with active indicator
- Active item: cyan dot + white text
- Inactive: `rgba(245,240,232,0.4)` text
- Hover: text → white, subtle background tint
- Auto-hides on scroll-down, reappears on scroll-up (threshold: 100px)
- Mobile: collapses to icon dots only

### Hero Stack (Depth-Fused)

An arrangement of elements at different Z positions that create a parallax stack:

```
Layer -1 (far): "SHIVAM" — giant outline text, letter-spacing -0.06em,
                color: transparent, -webkit-text-stroke: 1px rgba(245,240,232,0.08),
                positioned to scroll at 0.2× rate, acts as watermark

Layer 0 (mid):  3D model visible through transparent hero bg,
                mouse-parallax + slow rotation

Layer 1 (glass): Glass panel overlay containing:
  - Badge: "Full Stack · 4+ Years" with pulsing cyan dot
  - Name: "Shivam Kumar Divaker" in Space Grotesk
  - Tagline: "Architecting systems that move data, money, and decisions."
  - CTA buttons row
  
Layer 2 (near):  Floating decorative elements — small geometric shapes
                that drift at 1.2× scroll rate, catching the cyan light
```

### Section Entry (Depth Reveal)

Each section enters with a multi-layered animation:
1. **Background section number** (01, 02...) slides in from Z-0.5, large, muted opacity
2. **Glass cards** fade-up from Z1 with a 0.3s stagger per card
3. **Content text** reveals with a character-level blur-to-clear transition

The CSS for each section:

```css
.section {
  position: relative;
  z-index: var(--z-content);
  padding: 140px 0;
  background: transparent;
  min-height: 100vh;
  display: flex;
  align-items: center;
}
```

Sections alternate by adding a subtle gradient overlay:
- Even: `background: linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.02) 100%)`
- Odd: `background: transparent`

### Stat Block (Depth Metric)

Used in hero and about sections. Each stat has:
- Number: Space Grotesk, `3rem`, weight 700, `--cyan-light` color with a subtle text-shadow glow
- Label: JetBrains Mono, `11px`, letter-spacing `0.15em`, uppercase, `rgba(245,240,232,0.5)`
- Bottom border: `1px solid rgba(0,212,255,0.1)` — animates to full width on hover

### Project Card (Depth Layer Card)

```
Glass card with:
  - Top-right: year badge (mono, cyan)
  - Title: Space Grotesk, 1.25rem
  - Description: Inter 15px, rgba(245,240,232,0.7)
  - Tech tags: row of glass pills with cyan border on hover
  - Bottom edge: subtle cyan glow line that animates left-to-right on hover
```

Project cards appear in a `repeat(auto-fill, minmax(340px, 1fr))` grid with `20px` gap.

### Timeline (Depth Path)

A vertical line that traces the left side, made of connected glowing dots:
- Line: `2px` wide, gradient from cyan → transparent over the full height
- Each milestone: glass card with mono year (cyan), title (white), company (warm), description (muted)
- Active milestone (in viewport): card has brighter border, dot pulses
- Lines between milestones: drawn via CSS gradient, animates height as user scrolls

### Contact Portal (Depth Terminal)

A full-height section that feels like stepping into a different depth layer:
- Background deepens to `--depth-bg-0` (`#0d0d0d`)
- Terminal window floating at center: dark glass surface with cyan border
- Prompt lines: `➜` in cyan, commands in white, outputs in `rgba(245,240,232,0.6)`
- Blinking cursor at the end
- Orb decorations on either side: floating radial gradients that pulse slowly
- Social links hover: emit a brief cyan glow line toward the link

### Footer

- Minimal: just "SHIVAM KUMAR DIVAKER — Built with Angular & Three.js" in mono `11px`
- Center-aligned, `rgba(245,240,232,0.3)`
- Above it, a single horizontal rule that's a gradient from transparent → cyan → transparent

---

## 5. Layout Principles

### Depth Grid

The page is organized along a Z-axis, not just X/Y:

```
Z ranges:
  -2: Void background (particles, fog, torus knot)
  -1: 3D model, giant section numbers
   0: Page base (section backgrounds)
  +1: Glass cards, content text
  +2: Floating decorative elements, tooltips
  +10: Floating particles, mouse-trail effects
  +100: Navigation pill
```

### Section flow

Each section is `min-height: 100vh` with centered vertical alignment. The rhythm:
1. Transparent hero (3D model visible)
2. Even sections: subtle cyan top-glow gradient
3. Odd sections: transparent (shows void depth)

### Container

- Content within sections is constrained to `max-width: 1100px`, centered
- Glass cards extend to the container edges
- Section padding: `140px 0` (creates breathing room between sections)
- Container padding: `0 40px` desktop, `0 20px` mobile

---

## 6. Depth & Elevation

### Shadow system

```
--shadow-glass:   0 20px 60px rgba(0,0,0,0.5)
--shadow-glass-sm: 0 8px 30px rgba(0,0,0,0.3)
--shadow-card:    0 4px 0 0 rgba(245,240,232,0.03) inset
--shadow-float:   0 30px 80px rgba(0,0,0,0.6)
--shadow-glow:    0 0 30px rgba(0,212,255,0.08)
```

### Surface hierarchy

| Level | Element | Treatment |
|-------|---------|-----------|
| Void | 3D background | No shadow, pure dark |
| Scene | 3D model + particles | Ambient light only |
| Section | Page content | Transparent base |
| Glass | Cards | `--shadow-glass` + `--shadow-card` inset |
| Hover | Hovered card | `--shadow-float` + brighter border |
| Float | Decorations, tooltips | `--shadow-glow`, scroll-rate offset |
| Nav | Navigation pill | `--shadow-glass` + blur |

---

## 7. Do's and Don'ts

### Do

- Use the Z-layer system for every element — assign each component a depth layer and parallax rate
- Keep the single-light-source metaphor: cyan accent should always feel like it's emanating from one direction (top-left by default)
- Use the glass card format for all content blocks to maintain the "floating in depth" feel
- Let the 3D model be interactive (mouse orbit) — it's the centerpiece of the depth concept
- Use scroll-driven animation for entrance reveals (layer-based fade + slide)
- Make the giant section number (01, 02) a design element — it adds depth and wayfinding
- Use the depth dissolve on scroll — sections fade the void particles as they enter view

### Don't

- Don't use flat surfaces — every block should have glass or depth treatment
- Don't use multiple accent colors — cyan is the single light source; all else is warm monochrome
- Don't add solid background fills to sections — let the depth layers show through (use transparent or thin gradient)
- Don't make the parallax too aggressive — subtle (0.1–0.6× rates) keeps it readable
- Don't use bright white (#fff) anywhere — the warmest white is `#f5f0e8`
- Don't crowd the Z-space — max 6 elements per depth layer per viewport
- Don't over-animate — let scroll and mouse be the primary drivers

---

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| 1024px | Reduce 3D model scale, simplify particles to 60% count |
| 768px | Collapse grids to single column, stack depth layers into flat sequence |
| 480px | Disable 3D scene entirely on low-power devices (media query: `prefers-reduced-motion` or battery) |

### Mobile depth flattening (≤768px)

On mobile, the Z-layer system collapses to a flat scroll:
- Cards lose the glass effect (revert to `rgba(245,240,232,0.06)` solid fill)
- Parallax rates set to 0 (all layers scroll at normal speed)
- Giant section numbers reduce to `3rem` and move inline with titles
- 3D model visibility: keep but reduce pixel ratio and polygon complexity
- Navigation pill shrinks, labels hidden (icon dots only)

### Container

- Desktop: `padding: 0 40px`
- Mobile: `padding: 0 20px`
- Section padding: `140px` → `80px` mobile

### Grids

- All `auto-fill` grids: `minmax` values adjusted so mobile gets 1 column
- Timeline: line moves to far left, dots shift inline

---

## 9. Agent Prompt Guide

When generating new screens or components for this portfolio, follow these constraints:

```
SYSTEM CONTEXT: You are designing a depth-layered 3D engineering portfolio. The visual
metaphor is an architect's workshop at dusk with a single cyan task light.

DEPTH SYSTEM: Every element must be assigned a Z-layer (-2 to +100). Far elements
scroll slower (0.1-0.3x), near elements scroll faster (0.6-1.2x). Cards float at Z+1
with glass styling. The 3D model lives at Z-1 with mouse-orbit interaction.

COLORS: Background is --depth-bg-1 (#1a1410). The only accent is --cyan-light (#00d4ff)
which acts as a single directional light source. Text is --surface-white (#f5f0e8)
or --surface-soft (#e8e0d6). Do not introduce other accent colors.

SURFACES: All content blocks use glass card styling (glass-bg, glass-border, glass-blur,
glass-radius). Cards have a top-edge highlight via inset box-shadow and soften on hover
with brighter border and lift.

TYPOGRAPHY: Space Grotesk for display/headings, Inter for body, JetBrains Mono for
metrics/tags. Giant section numbers (01, 02, 03) at 5-8rem behind the title as a
depth element. Hero name is a two-layer parallax stack.

3D SCENE: The fixed Three.js canvas has three depth layers (far: torus knot + fog,
mid: GLB model with rim-lighting, near: fast particles). Model rotates on mouse
position. All layers fade on scroll using independent thresholds.

ANIMATIONS: Entry animations use a 3-stage depth reveal (section number, then glass
cards, then text). Scroll drives parallax and depth dissolve. Do not use auto-play
animations — let user interaction drive the motion.

NEW SECTIONS: When adding a section, give it min-height:100vh, position:relative,
z-index:var(--z-content), and a transparent background. Add a section number as a
background depth element. Use glass cards for content. Alternate section gradient
overlays (even: cyan tint, odd: transparent).

RESPONSIVE: At 768px, collapse Z-layers to flat scroll (parallax=0, no glass effect,
section numbers inline). At 480px or prefers-reduced-motion, disable the 3D scene.
```

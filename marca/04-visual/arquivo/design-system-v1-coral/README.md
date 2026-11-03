# Hattie Design System

Your personal designer. Brand out of the hat.

---

## Brand Foundation

**Hattie** is a brand platform that democratizes access to strategic branding through a combination of AI guidance and human expertise. The visual identity carries this duality: serious strategy beneath a playful, accessible surface.

### Archetype & Personality

**Primary:** The Creator — builds and creates with intention and care  
**Secondary:** The Magician — transforms the complex into something delightful

The visual language is **lúdica, amigável e divertida** — playful, friendly, and fun — without sacrificing strategic depth. Every choice reflects both the magic (the delight) and the craft (the thinking) behind brand-building.

### Core Values Reflected Visually

- **Democratização do Branding** — accessible, warm, not intimidating
- **Combinação Humano e Máquina** — human-centered in tone, tech-enabled in delivery
- **Cérebro de Marca** — strategic, intentional, never arbitrary
- **Entrega Consistente** — reliable patterns, clear systems

---

## Visual Foundations

### Color Palette

The palette balances playfulness (warm corals, amber) with trust (deep blues, black) and breathing room (generous white). Each color carries a functional role in layouts—never as mere decoration.

| Token | Hex | RGB | Usage |
|---|---|---|---|
| **white** | #FFFFFF | 255, 255, 255 | Primary background; breathing room |
| **preto** | #000000 | 0, 0, 0 | Headlines, primary text, trust |
| **coral** | #FF6237 | 255, 98, 55 | Primary accent; warm, energetic |
| **ambar** | #FFB530 | 255, 181, 48 | Secondary accent; optimistic, bright |
| **azul-claro** | #7EC4FF | 126, 196, 255 | Tertiary accent; friendly, open |
| **azul-vivo** | #4164FE | 65, 100, 254 | Strong accent; confidence, depth |

**Accessibility note:** Âmbar and Azul claro do not work as text on white—use only as shape fills. Azul vivo, Coral, and Preto are safe for small text and icons.

**Color application principle:** Text is always dark (preto/black). Color lives in blocks, cards, shapes, and decorative elements. One solid color per shape—never gradients or color mixing within a single graphic element.

---

### Typography System

The type system uses a **Perfect Fourth scale (1.333)** starting at 16px, creating strong visual hierarchy without excessive inflation.

#### Families

**DM Sans** (Google Fonts, OFL License)
- Variable font covering opsz (9–40) and weight (100–1000)
- Serves platform UI, headlines, body text, and system labels
- One family handles all text needs through size and weight variation
- Fallback: system-ui, sans-serif

**Darumadrop One** (Google Fonts, OFL License; marketing/materials use only)
- Display-only, inflated letterforms, genuine playfulness
- Never used in body text or continuous reading
- Headlines in promotional materials, landing pages

#### Scale

| Level | Size | Weight | Line-height | Use Case |
|---|---|---|---|---|
| **Display** | 64px | 800 | 1.05 | Hero statements, brand declarations |
| **H1** | 48px | 700 | 1.1 | Page titles, section intros |
| **H2** | 36px | 700 | 1.15 | Subsection headers |
| **H3** | 27px | 600 | 1.2 | Section dividers, emphasis |
| **H4** | 20px | 600 | 1.3 | Subheadings, card titles |
| **Body** | 16px | 400 | 1.6 | Main copy, paragraph text |
| **Small** | 13px | 400 | 1.5 | Secondary text, metadata |
| **Caption** | 11px | 500 | 1.4 | Captions, helper text |
| **Label** | 11px | 700 | 1.3 | System labels, button text (tracking +0.06em) |

**Principle:** Typography hierarchy should feel effortless to understand—size and weight do the talking, not technical terms.

---

### Spacing & Layout

#### Spacing Scale

White space is generous and intentional. Breathing room between elements makes the interface feel calm and friendly.

| Token | Value | Use |
|---|---|---|
| **space-4** | 4px | Micro spacing between related elements |
| **space-8** | 8px | Small gaps, icon padding |
| **space-12** | 12px | Component internal spacing |
| **space-16** | 16px | Card padding, content blocks |
| **space-20** | 20px | Larger gaps between elements |
| **space-24** | 24px | Section spacing, block margins |
| **space-32** | 32px | Major section breaks |
| **space-40** | 40px | Large block separation |
| **space-48** | 48px | Page-level spacing |
| **space-56** | 56px | Hero sections |
| **space-64** | 64px | Large whitespace, breathing room |

#### Radius Scale

Rounded corners are generous and consistent—a core visual rule. No harsh corners anywhere on the interface.

| Token | Value | Use |
|---|---|---|
| **radius-sm** | 4px | Subtle rounding on small elements |
| **radius-md** | 8px | Default for most UI components (inputs, cards) |
| **radius-lg** | 12px | Buttons, larger cards |
| **radius-xl** | 16px | Prominent containers |
| **radius-xxl** | 20px | Feature cards, standout blocks |
| **radius-full** | 9999px | Pills, badges, fully rounded |

---

### Shapes & Graphic Elements

#### Functional Icons

**Lucide Icons** (ISC License, lucide.dev)  
Used for platform/functional purposes: buttons, navigation, status indicators. 24×24 grid, rounded stroke terminals by default. Aligns with the requirement for rounded corners throughout the interface.

Library integration: Use `lucide-react` for React projects, or SVG exports from lucide.dev for other contexts.

#### Brand Signature Shapes

Custom, hand-drawn shapes in the Hattie style—never from icon libraries. Each shape:
- One solid color from the palette per shape
- Thick strokes, never delicate lines
- Intentional asymmetry (one arm longer, one point offset, one side wider)
- Variations in sparkle/star proportions—no identical repeats
- Used as loose "stickers" overlaying content, not as containers

**Shapes in the kit:**
- Blob (asymmetric, organic)
- Faísca/Sparkle (varied points)
- Faísca Diagonal
- Laço Cruzado (crossed ribbon)
- Espiral (spiral)
- Rabisco (scribble)
- Redemoinho (swirl)
- Flor de Pontas (pointed flower)

**Usage:** Rotated at loose angles, overlapping card edges or image corners—always with sufficient contrast against text.

---

### Layout Principles

**Containers:** Organic blob shapes instead of pure rectangles. Never rigid grids alone.

**Stickers & Badges:** Rotated pills/badges in brand colors, overlapping card or image edges, creating visual interest and personality.

**Text:** Headlines always in dark text (preto). Color lives in the blocks and cards, not in type.

**Cards:** Generously rounded corners mandatory. Can be dense and colorful in showcase contexts (grids, galleries), but maintain breathing room between cards.

**White space:** Generous and intentional—space between dense color blocks creates rhythm and calm.

**Typography placement:** Always legible, always in service of hierarchy, never decorative.

---

### Image Treatment

**Approach:** Real photography in natural color—no duotone, no elliptical masks.

**Character:** Bright, modern environments. Real people, authentic moments. Color-neutral light (never warm, never cold).

**Brand elements:** Custom shapes (part 2) applied in corners/edges of photos as "stickers," adding personality without overworking the image.

**Photography direction** (Phase 6 guidance):
- Studio or bright creative spaces (white/light walls)
- Subjects using or near brand-color elements
- Wide angle, light and airy
- Color-neutral studio lighting

---

## Component Patterns

### Buttons & CTAs

- Minimum 44px height for touch targets
- Radius: **radius-lg** (12px)
- Padding: **space-12** vertical, **space-16** horizontal
- Text weight: 600
- Clear affordance: color contrast 4.5:1

### Cards & Containers

- Radius: **radius-lg** or **radius-xl** (12–16px)
- Padding: **space-16** to **space-24**
- Shadows: soft, subtle (not dramatic)
- Can have one background color from palette

### Input Fields

- Radius: **radius-md** (8px)
- Border: 2px in color palette (not gray)
- Focus state: Azul vivo outline, 2px
- Height: 44px minimum

### Navigation

- Simple, clear, always readable
- Icons from Lucide where functional
- Text in dark (preto)

---

## Tone & Voice in Visual Design

The visual system communicates through **spacing, scale, and color—not decoration.** Nothing is precious. Everything serves clarity while maintaining warmth.

- **Playful:** Generous use of color and space, rotated elements, custom shapes
- **Accessible:** Large, clear typography; sufficient whitespace; high contrast
- **Strategic:** Every choice has a reason; nothing is arbitrary
- **Consistent:** Same shapes, same scales, same palette everywhere

---

## Using This System

1. **Colors:** Stick to the palette. When combining colors, prioritize contrast and hierarchy. Text is preto; color is in blocks.
2. **Typography:** Use the scale as written. Don't skip levels. Hierarchy comes from size and weight, not style variations.
3. **Spacing:** Use tokens, never arbitrary values. Generous spacing is the default.
4. **Radius:** Every corner is rounded. **radius-md** is the default.
5. **Icons:** Lucide for functional, custom shapes for brand personality.
6. **Shapes:** Rotated, overlapping, asymmetric. Never perfectly centered or perfectly symmetric.

---

## Integration Points

- **Frontend code:** Import `tokens.json` for CSS variables or use as design tokens in Figma, Penpot, or your design tool
- **React projects:** `lucide-react` for icons; tokens can be converted to a CSS-in-JS system
- **Design tools:** Load `tokens.json` as a library; export `tokens.css` for variables
- **Slides/Decks:** Use the type scale and color palette directly; custom shapes from the asset library

---

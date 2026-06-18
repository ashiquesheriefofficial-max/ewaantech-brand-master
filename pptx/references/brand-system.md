# Brand System Reference

Canonical values pulled from `Corporate_Guideline_2026.pdf`. Safe to copy-paste from this file. If values ever disagree with the PDF, the **PDF wins** — re-read it with `project_knowledge_search` to confirm.

---

## Color Palette

### Primary (always on)

| Token           | HEX       | CMYK               | RGB          | Use |
|-----------------|-----------|--------------------|--------------|-----|
| Brand Red       | `CE202F`  | C13 M100 Y91 K3    | 206, 32, 47  | CTAs, logo chevron, accent lines, number badges, red-block headers |
| Dark Red        | `AC1F24`  | C22 M100 Y98 K15   | 172, 31, 36  | Hover states, name highlight in email sig, darker chevron shadow |
| Near-Black      | `221E1F`  | C70 M68 Y64 K74    | 34, 30, 31   | Primary text on light; dark-section backgrounds |

### Secondary (accents only — never as primary backgrounds per PDF)

| Token           | HEX       | CMYK               | RGB          | Use |
|-----------------|-----------|--------------------|--------------|-----|
| Gold            | `C1A068`  | C25 M35 Y68 K1     | 193, 160, 104 | Eyebrow labels and metadata on **dark** backgrounds only |
| Charcoal        | `242424`  | C71 M65 Y64 K71    | 36, 36, 36   | Secondary dark surfaces (callout boxes inside dark sections) |
| Cream           | `EFEBE3`  | C5 M5 Y9 K0        | 239, 235, 227 | Light content backgrounds, card fills |

### Utility (not in guideline, derived)

| Token           | HEX       | Use |
|-----------------|-----------|-----|
| White           | `FFFFFF`  | Clean content backgrounds (often cleaner than cream for reports) |
| Gray            | `727272`  | Muted body copy, subheadings (matches proposal spec) |
| Light Gray      | `E6E6E6`  | Thin divider lines, card borders |

### Color decision logic

**Primary red →** CTA buttons, logo chevron, 40–60px accent lines, eyebrow labels **on light bg**, step-number badges. Never a full-page background except on closing slides, business-card backs, or hiring posters.

**Dark red →** hover states, the name in an email signature, accent where primary red would vibrate against adjacent red.

**Near-black →** primary text on light, and dark-section backgrounds (hero, divider, closer). This is the "canvas" of serious brand communication.

**Gold →** dark backgrounds only. Section labels, metadata, page numbers on dark slides. **Never on cream or white.** Violating this is the most common brand mistake.

**Charcoal →** secondary dark surfaces — typically a callout box inside a dark section to create subtle variation from near-black.

**Cream →** light page backgrounds and cards-inside-white-sections. Don't default to cream for everything — white is often cleaner for reports.

### Forbidden

- Gradients as primary backgrounds. The brand is flat color.
- Any accent outside the palette — blue, green, purple, orange. Even in charts. Use tints/shades of red, gold, charcoal for data visualization.
- Logo on a background matching its own color (red logo on red).
- Logo on photography without an 80%-opacity overlay.

---

## Typography

| Role           | Typeface         | Weights used        | Primary use |
|----------------|------------------|---------------------|-------------|
| **Primary (display)**  | Cera Pro         | Light, Regular, Bold, ExtraBold | Headlines, titles, hero type, large numerals |
| **Secondary (editorial)** | EB Garamond   | Regular, Medium, Bold + italics | Italic accents, pull quotes, big section numerals on covers/dividers |
| **Tertiary (UI / body)** | Calibri       | Light, Regular, Bold | Body copy, PowerPoint text, emails, letterheads, UI labels |
| **Arabic**     | Noto Sans Arabic | Light, Regular, Bold | All Arabic-language content |

### Typography rules

- Look up specific sizes, weights, and line-heights in the PDF for each artifact (letterhead, proposal, email body, etc.). Use this table to know which font goes where, not what size.
- Create **strong scale contrast** — 14pt body next to a 48pt headline feels professional, 14pt body next to a 20pt "headline" feels like a draft.
- Use EB Garamond italic for numerals and editorial accents on divider/cover slides — it adds warmth and signals premium.
- Calibri is digital/office only. Never use it as a display headline on a branded page where Cera Pro applies.
- Do not substitute Arial, Roboto, Inter, or any generic sans-serif for Cera Pro. Use the actual font name and let the target system fall back naturally on machines without it.

### Canonical sizes (from PDF)

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Letterhead footer | Calibri | 9pt | Light | Default |
| Email body | Calibri | 12pt | Regular | `000000` |
| Proposal heading | Calibri | 30pt | Bold | `000000` |
| Proposal sub-heading | Calibri | 24pt | Light | `727272` |
| Proposal body | Calibri | 12pt | Regular | `000000` |

### Presentation typography scale (validated in production)

| Slide element | Font | Size | Notes |
|---------------|------|------|-------|
| Cover title | Cera Pro | 56–64pt Bold | Two lines max |
| Cover subtitle | EB Garamond | 20pt Italic | |
| Section divider numeral | EB Garamond | 120–130pt Italic | **Never go beyond 130pt** — overflows text box |
| Section divider title | Cera Pro | 48–56pt Bold | |
| Content slide title | Cera Pro | 32–44pt Bold | |
| Content subtitle | EB Garamond | 14–16pt Italic | In gray `727272` |
| Card label | Cera Pro | 14–16pt Bold | |
| Card body | Calibri | 11–14pt Regular | |
| Eyebrow label | Calibri | 10–11pt Bold | `charSpacing: 5–6` uppercase |
| Page number | Calibri | 9pt | Right-aligned |

---

## Logo Rules

### Variants

- **Dark logo** — use on white, cream, gold, and light photography (with overlay).
- **White logo** — use on near-black, dark red, charcoal, and dark photography (with overlay).
- The `›` chevron is **always** red (`CE202F`). Never recolor.

### Clear space

Give the logo generous breathing room. When in doubt, give it more than you think it needs. A rough minimum is the height of the "e" glyph on all sides.

### Photography overlay

Before placing the logo or white text over a photograph, apply a solid-color overlay:

- `#252525` at **80% opacity** (neutral overlay), or
- `#CE202F` at **80% opacity** (branded red overlay)

Never drop a logo onto raw photography.

### The eight "Wrong Applications" (PDF page to check before shipping)

1. Changed logo brand color
2. Logo on same brand-element color background
3. Logo color changed to something other than brand red/black/white
4. Logo color changed according to background color
5. Logo color similar to the tone of an image underneath
6. Logo on a gradient background
7. Logo on a dark background (when using the dark variant — need the white variant)
8. Logo on any image without overlay

Treat this as a pre-flight checklist.

---

## Imagery

- **Style**: clean, in-focus, sharp. Authentic over staged.
- **Subjects**: people fully visible — never crop body parts.
- **Overlay**: always 80% opacity of `#252525` or `#CE202F` when placing white text or a logo.
- **Composition**: portrait-lens depth of field; strong leading lines.
- **Mixing**: commit to photography OR flat illustration per deliverable. Never mix in a single document.

---

## Iconography

- Clean geometric, single-color, consistent stroke weight.
- Fill brand red on light backgrounds, white on dark.
- One icon family per document (don't mix FontAwesome with Material with Heroicons).
- Test legibility at 16px minimum.

### For pptxgenjs builds

Use `react-icons` → `sharp` → base64 PNG (see `build-skeleton.js`). Preferred sets: `react-icons/fa` (FontAwesome) for most concepts, `react-icons/bs` (Bootstrap) as fallback. `react-icons/si` (SimpleIcons) does **not** include Microsoft product brand marks — use semantic stand-ins (e.g., `FaFileExcel` for Excel, `FaServer` for SQL Server, `BsCloudFill` for Azure).

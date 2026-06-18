# Brand System — Ewaantech Reference

Canonical snapshot of the values that produced the approved INTDC and Attnd builds. Pull fresh from `Corporate_Guideline_2026.pdf` if the brand has evolved — but this is safe to copy-paste from as a starting point.

---

## Palette

| Token | HEX | RGB | CMYK | Use |
|-------|-----|-----|------|-----|
| **Primary Red** | `#CE202F` | 206, 32, 47 | 0, 100, 95, 5 | Logo chevron, CTAs, eyebrow accents, short accent lines, table header rows, page numbers, design accents |
| **Dark Red** | `#AC1F24` | 172, 31, 36 | 0, 100, 95, 25 | Hover states, h3 sub-section headings, secondary accents |
| **Near-Black** | `#221E1F` | 34, 30, 31 | 0, 0, 0, 95 | Primary body text on light surfaces, dark section backgrounds |
| **Charcoal** | `#242424` | 36, 36, 36 | 0, 0, 0, 90 | Secondary dark surfaces, photography overlays |
| **Grey (Title)** | `#727272` | 114, 114, 114 | 0, 0, 0, 55 | Section title eyebrow text, light captions |
| **Grey (Body)** | `#4A4A4A` | 74, 74, 74 | 0, 0, 0, 70 | Secondary body text, metadata |
| **Grey (Rule)** | `#D9D9D9` | 217, 217, 217 | 0, 0, 0, 15 | Table internal rules, faint dividers |
| **Cream** | `#EFEBE3` | 239, 235, 227 | 3, 4, 8, 0 | Callout backgrounds, label cells, alternating table rows |
| **Gold** | `#C1A068` | 193, 160, 104 | 21, 35, 65, 5 | DARK BACKGROUNDS ONLY — eyebrow labels, metadata on dark sections |
| **White** | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Standard light surface |

**Application logic:**

- Primary Red → CTAs, logo chevron, accent lines, eyebrow labels on light, table headers, page numbers.
- Dark Red → h3 headings, hover/highlight on red-adjacent surfaces.
- Near-Black → primary body text. Default for any paragraph copy.
- Gold → dark backgrounds only. Using gold on cream or white breaks the brand.
- Cream → callout box backgrounds, alternating table rows, label-cell shading.

Never introduce blue, green, purple, or orange — even for data viz. Use tints of red, gold, and charcoal for charts.

---

## Typography

| Role | Font | Use |
|------|------|-----|
| Display | Cera Pro | Headlines, titles, hero numerals (where installed; Calibri Bold is the universal fallback) |
| Editorial | EB Garamond | Italic accents, pull quotes, large display numerals, italic subtitles |
| Body / UI | Calibri | Body copy, table content, captions, footnotes — the default for system rendering |
| Arabic | Noto Sans Arabic | All Arabic-language content |

**Size scale used in the approved builds:**

| Element | Font | Size (pt) | Weight | Color |
|---|---|---|---|---|
| Cover title (single-line) | Calibri | 48 | Bold | `#221E1F` |
| Cover title (multi-line) | Calibri | 40 | Bold | `#221E1F` |
| Cover subtitle | Calibri | 18 | Bold | `#727272` |
| Cover EB Garamond accent | EB Garamond | 14 | Italic | `#CE202F` |
| Section title eyebrow | Calibri | 16 | Regular, letter-spaced | `#727272` |
| Section title headline | Calibri | 24 | Bold | `#221E1F` |
| h2 (sub-section heading) | Calibri | 13 | Bold | `#221E1F` |
| h3 (callout title, minor heading) | Calibri | 11.5 | Bold | `#AC1F24` |
| Body | Calibri | 11 | Regular | `#221E1F` |
| Table header | Calibri | 11 | Bold | `#FFFFFF` (on red fill) |
| Table cell | Calibri | 10.5 | Regular | `#221E1F` |
| Page number | Calibri | 10 | Bold | `#CE202F` |

In docx-js these sizes are doubled (`size: 48` = 24pt, `size: 22` = 11pt).

**Scale contrast principle:** make headlines dramatically larger than body. A 24pt headline next to 11pt body reads professional. Anything in the 14–16pt range as a "headline" reads draft.

---

## Page geometry

A4 portrait, 21 × 29.7 cm (8.27 × 11.69 in):

| Setting | Value (DXA) | Equivalent |
|---|---|---|
| Page width | 11906 | 21.0 cm |
| Page height | 16838 | 29.7 cm |
| Cover margin — top | 1600 | ~1.13 in |
| Cover margin — left | 1600 | ~1.13 in |
| Cover margin — right | 1100 | ~0.78 in |
| Cover margin — bottom | 1100 | ~0.78 in |
| Content margin — top | 1700 | ~1.18 in (leaves header space) |
| Content margin — left | 1700 | ~1.18 in |
| Content margin — right | 1000 | ~0.69 in |
| Content margin — bottom | 1300 | ~0.9 in (leaves footer space) |

These match the proposal template's "don't write in this area" zones. Don't widen further — content needs to clear the bottom strip and the page number.

---

## Logo rules

| Rule | Detail |
|---|---|
| **Aspect ratio** | 5.09 : 1 (original is 1568 × 308 px). For height = 32 use width = 165. Never stretch. |
| **Variants** | Dark wordmark (`EWT_LOGO_ORIGINAL_*.png`) on light backgrounds. White wordmark (`EWT_LOGO_WHITE_*.png`) on dark backgrounds. The proposal template uses the dark variant on every page (the design is light-canvas throughout). |
| **Placement** | Top-right of every page, anchored to the page (not the margin), at ~5.3M / 0.54M offset. |
| **Clear space** | Minimum 1× chevron width on every side. The proposal template gives more. |
| **Wrong applications** | Never on photography without an 80%-opacity overlay. Never on a background matching its own color (red logo on red, etc.). Never recolored. Never rotated. Never inside a shape outline. Don't add effects (drop shadow, glow, bevel). |

Always ask the user which variant to use. Never assume.

---

## Decision logic — which helper to reach for

| Source content | Output |
|---|---|
| Heading like "1. Overview" or "Section X: Y" | `sectionTitleBlock(eyebrow, headline)` — eyebrow `SECTION 01`, headline `OVERVIEW` |
| Sub-heading like "1.1 What Is Being Built" | `h2()` |
| Minor heading like "List View", "Detail View", "Sales / Business Analyst" | `h3()` |
| Bulleted item | `bullet()` or `bullet_runs(node)` to preserve runs |
| Plain paragraph | `p()` or `p_runs(node)` |
| Table with column headers in row 0 | `brandTable(headers, rows, widths)` |
| Table that's just key/value pairs (no header row) | `labelValueTable(rows)` |
| 1×2 table with empty cell 0, content in cell 1 | `callout(title, lines)` — title from first line of cell 1, body from remaining |
| Document info / sign-off / metadata | `labelValueTable(rows)` |
| "Purpose of This Document", "How X Works", "Rule" | `callout()` |

---

## Voice for cover meta-fields

When a source doesn't supply a cover subtitle / classification / prepared-for line, choose something restrained and professional:

| Field | Example phrasing |
|---|---|
| Subtitle (grey) | "Business Requirements Document" / "Department Responsibilities" / "Statement of Work" |
| EB Garamond italic accent | "Phase 1 — Internal Use" / "Reference document — internal use" / "Confidential" |
| Classification | "Confidential — Internal Use Only" / "Internal — Operational Reference" |

Avoid marketing flourish on internal documents. The brand voice is professional, empathetic, direct.

# Slide Patterns

Five validated layouts that produced the approved Ewaantech deck. Each shows the structural skeleton, coordinate math, and why elements sit where they do. Clone the pattern that matches the content type — don't invent a new layout unless the content genuinely doesn't fit any of these.

Slide dimensions: **13.33 × 7.5 inches** (`LAYOUT_WIDE`).

---

## Pattern 1 · Dark Cover

**Use for:** opening slide of every deck.

```
┌─────────────────────────────────────┬──────────┐
│ ewaan>tech                           │  [red    │
│                                      │   chevron│
│                                      │   stack] │
│  ─── (red 0.6" line)                 │          │
│  CORPORATE TRAINING · 2026 (gold)    │          │
│                                      │          │
│  Getting Started                     │          │
│  with Power BI    (Cera Pro 56pt)   │          │
│                                      │          │
│  A practical guide to...             │          │
│  (EB Garamond italic 20pt)           │          │
│                                      │          │
│  EWAANTECH · ewaantech.com       01  │          │
└─────────────────────────────────────┴──────────┘
```

**Background:** solid `221E1F` (near-black).

**The red chevron motif** (right side) is two overlapping right-triangle shapes:
```js
s.addShape(pres.shapes.RIGHT_TRIANGLE, {
  x: 9.2, y: 0, w: 4.2, h: 7.5,
  fill: { color: "AC1F24" }, line: { color: "AC1F24" },
  flipH: true,
});
s.addShape(pres.shapes.RIGHT_TRIANGLE, {
  x: 10.6, y: 0, w: 2.8, h: 7.5,
  fill: { color: "CE202F" }, line: { color: "CE202F" },
  flipH: true,
});
```

**Element stack on the left (x: 0.6, typical):**

| Element | y | h | Font | Size | Color |
|---------|---|---|------|------|-------|
| Logo (white) | 0.55 | 0.375 | image | w: 1.9 | — |
| Red accent line | 2.4 | 0.05 | shape | w: 0.6 | `CE202F` |
| Eyebrow label | 2.55 | 0.35 | Calibri bold, `charSpacing: 6` | 11pt | `C1A068` (gold) |
| Title | 3.0 | 2.4 | Cera Pro bold | 56–60pt | `FFFFFF` |
| Subtitle | 5.5 | 0.6 | EB Garamond italic | 20pt | `EFEBE3` (cream) |
| Footer (left) | 6.85 | 0.35 | Calibri bold, `charSpacing: 4` | 9pt | `C1A068` |
| Page number (right) | 6.85 | 0.35 | Calibri, align right | 10pt | `C1A068` |

**Why it works:** the chevron on the right gives the brand red real estate without overwhelming the dark canvas. The gold eyebrow signals "this is a premium branded surface" and is only visible because of the dark background. The title dominates because it's 60pt against 11pt eyebrow and 20pt subtitle — dramatic scale contrast.

---

## Pattern 2 · Light Content + Number-Card Column

**Use for:** overview slides, bullet lists, "What is X?" slides, feature summaries.

```
┌─────────────────────────────────────────────────┐
│ ewaan>tech                   01 · OVERVIEW      │
│ ───────────────────────────────────────────     │
│                                                  │
│  01                     ┌──┬──────────────────┐  │
│  (EB Garamond italic)   │01│ Bullet 1...      │  │
│  ─── (red line)         ├──┼──────────────────┤  │
│                         │02│ Bullet 2...      │  │
│  What is                ├──┼──────────────────┤  │
│  Power BI?              │03│ Bullet 3...      │  │
│  (Cera Pro bold)        ├──┼──────────────────┤  │
│                         │04│ Bullet 4...      │  │
│  Supporting copy in     ├──┼──────────────────┤  │
│  EB Garamond italic...  │05│ Bullet 5...      │  │
│                         └──┴──────────────────┘  │
│  BRAND IDENTITY 2026                        02  │
└─────────────────────────────────────────────────┘
```

**Background:** `FFFFFF` or `EFEBE3` (cream).

**Header pattern (reusable helper):**

```js
function header(slide, sectionLabel) {
  slide.addImage({ path: LOGO_DARK, x: 0.6, y: 0.45, w: 1.35, h: 0.266 });
  slide.addText(sectionLabel, {
    x: 10.3, y: 0.48, w: 2.43, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, color: "CE202F",
    charSpacing: 5, align: "right", margin: 0,
  });
  slide.addShape(pres.shapes.LINE, {
    x: 0.6, y: 0.95, w: 12.13, h: 0,
    line: { color: "E6E6E6", width: 0.75 },
  });
}
```

**Left column (x: 0.6):** italic numeral (EB Garamond 72pt red) → 0.6" red accent line → title (Cera Pro 44pt bold near-black) → supporting copy (EB Garamond 16pt italic gray `727272`).

**Right column (x: 6.7, w: 6.1):** five cards stacked. Each card is a red number pill (`0.75" × 1.03"`, white number badge) + a cream body panel holding the bullet text. Gap between cards: `0.12"`.

**Why it works:** the italic numeral on the left reads as editorial signature (EB Garamond), while the UI on the right stays tight and readable (Calibri). The red number pills repeat the brand signature on every card, creating a motif.

---

## Pattern 3 · Icon Grid (3×2)

**Use for:** data sources, capabilities, product features, service tiles.

```
┌─────────────────────────────────────────────────┐
│ ewaan>tech                   02 · DATA SOURCES  │
│ ───────────────────────────────────────────     │
│                                                  │
│                    ┌─────┐ ┌─────┐ ┌─────┐       │
│  02                │ ▓   │ │ ▓   │ │ ▓   │       │
│  ─── (red line)    │icon │ │icon │ │icon │       │
│                    │label│ │label│ │label│       │
│  Connecting        │ sub │ │ sub │ │ sub │       │
│  to Data           └─────┘ └─────┘ └─────┘       │
│                    ┌─────┐ ┌─────┐ ┌─────┐       │
│  Supporting copy   │ ▓   │ │ ▓   │ │ ▓   │       │
│  in EB Garamond... │icon │ │icon │ │icon │       │
│                    │label│ │label│ │label│       │
│                    │ sub │ │ sub │ │ sub │       │
│                    └─────┘ └─────┘ └─────┘       │
│  BRAND IDENTITY 2026                        03  │
└─────────────────────────────────────────────────┘
```

**Background:** cream (`EFEBE3`) lets white cards stand out.

**Card geometry:** 3 columns × 2 rows starting at `x: 6.6, y: 1.3`. Card `w: 2.05, h: 2.55`, gap `0.15"` both axes.

**Each card:**
1. Top red tab — `RECTANGLE` 0.08" tall in `CE202F` (brand signature bar).
2. White card body — `RECTANGLE` with `line: { color: "E6E6E6", width: 0.75 }` and a soft shadow (`makeSoftShadow()`).
3. Icon centered horizontally at `y: +0.4`, `0.9 × 0.9"`.
4. Label (Cera Pro 14pt bold) centered at `y: +1.45`.
5. Sub-label (Calibri 10pt gray) centered at `y: +1.85`.

**Why it works:** the red top tab turns every card into a branded mini-poster. The icons all being brand red on white means no color distraction — the differentiation is semantic, not chromatic.

---

## Pattern 4 · Dark Section Divider

**Use for:** breaking a long deck into chapters. One divider every 3–5 content slides.

```
┌─────────────────────────────────────┬──────────┐
│ ewaan>tech                           │          │
│                                      │          │
│                                      │  [red    │
│  04                                  │   chevron│
│  (EB Garamond italic 130pt red)      │   stack] │
│                                      │          │
│  ─── (red line)                      │          │
│  SECTION FOUR (gold eyebrow)         │          │
│                                      │          │
│  Building                            │          │
│  Visualizations  (Cera Pro 52pt)     │          │
│                                      │          │
│  EWAANTECH · BRAND IDENTITY 2026  05 │          │
└─────────────────────────────────────┴──────────┘
```

**Background:** near-black with red-chevron stack on the right (same shapes as cover).

**Critical constraint:** the italic numeral must be capped at **130pt** with a tall text box. Previous builds tried 220pt and the glyph rendered outside its container, colliding with the logo and title. Safe values:

```js
s.addText("04", {
  x: 0.6, y: 2.0, w: 5, h: 2.4,
  fontFace: "EB Garamond", fontSize: 130,
  italic: true, color: "CE202F",
  margin: 0, valign: "top",
});
```

Then red line → gold eyebrow at `y: 4.75` → Cera Pro 52pt title at `y: 5.15`.

**Why it works:** the big italic numeral reads as premium editorial signage. The chevron block on the right repeats the cover motif, tying the closer back visually. Gold on dark is the only gold rule you're allowed to use — leverage it here.

---

## Pattern 5 · Closing / Thank You

**Use for:** last slide of every deck.

```
┌──────────┬─────────────────────────────────────┐
│          │                                      │
│  [red    │  CLOSING (gold eyebrow)              │
│   chevron│  ─── (red line)                      │
│   mirror │                                      │
│   of     │  Thank You.  (Cera Pro 88pt bold)   │
│   cover] │                                      │
│          │  We listen before we act. We build  │
│          │  with empathy, craftsmanship...     │
│          │  (EB Garamond italic 18pt cream)    │
│          │                                      │
│          │  ─── (gold line)                    │
│          │                                      │
│          │  W  ewaantech.com                   │
│          │  E  info@ewaantech.com              │
│ ewaan>   │  UAE · KSA · HONG KONG · INDIA      │
│  tech    │                                  07 │
└──────────┴─────────────────────────────────────┘
```

**Background:** near-black.

**Mirror of the cover:** chevron stack is now on the LEFT (not right), logo sits bottom-left over the red. This visually bookends the deck.

**Content block on the right (x: 5.0):** gold eyebrow → red line → massive title → italic brand-voice line → gold divider line → contact block (W / E with red labels, UAE · KSA · HONG KONG · INDIA in gold).

**The brand voice line** is mandatory on the closer. It's the Ewaantech values in one sentence — "We listen before we act." variants. This isn't decoration; it's the brand signature.

---

## Composition rules that apply to all patterns

**Margins.** No element within 0.3" of a slide edge. The header line sits at `y: 0.95`, the footer text at `y: 7.15`. Content lives between `y: 1.2` and `y: 7.0`.

**Motif repetition.** Every slide should carry at least one red element — number pill, top-tab, chevron, line, icon. If a slide has no red, it doesn't belong to the deck.

**Whitespace.** Cramped slides feel cheap. When in doubt, remove content — don't shrink type.

**Asymmetry over symmetry.** Off-center titles, unequal columns, deliberate overhangs. Perfectly centered everything reads as a 2005 template.

**Shadow discipline.** Elevation shadows only on cards (opacity 0.08–0.15, blur 12–18, offset 2–3). Never on text. Never on flat shapes that represent backgrounds.

**Chart colors.** Never go outside `CE202F`, `AC1F24`, `C1A068`, `242424`, and tints/shades of those. Data visualization is the #1 place brand palettes get violated.

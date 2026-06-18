# Brand System — Ewaantech XLSX Reference

Canonical snapshot of the values that produced the approved UAT Findings Bookly build. Pull fresh from `Corporate_Guideline_2026.pdf` if the brand has evolved — but this is safe to copy-paste from as a starting point.

---

## Palette

| Token | HEX | RGB | Use in XLSX |
|-------|-----|-----|-------------|
| **Primary Red** | `#CE202F` | 206, 32, 47 | Header rows, cover red accent line, "Open" status pill, chevron icons, eyebrow labels on cream, tab color for hero sheets |
| **Dark Red** | `#AC1F24` | 172, 31, 36 | "In-Progress" status pill, hover-equivalent accents |
| **Near-Black** | `#221E1F` | 34, 30, 31 | Body text on light surfaces, dark hero strip background, total-hours card background, "Review" pill background |
| **Charcoal** | `#242424` | 36, 36, 36 | "Closed" pill background, secondary dark surfaces, tab color for normal sheets |
| **Gold** | `#C1A068` | 193, 160, 104 | DARK BACKGROUNDS ONLY — eyebrow labels in cards, "Done" pill background (text is near-black there), category pills for Completed |
| **Cream** | `#EFEBE3` | 239, 235, 227 | Light card backgrounds, label cells, "Closed" pill text color (against charcoal), placeholder backgrounds |
| **Pale Cream** | `#F8F5EE` | 248, 245, 238 | Half-strength cream — alternating data rows for zebra striping, end-of-findings marker background |
| **Subtle Grey** | `#DDD8CF` | 221, 216, 207 | Thin row borders (the "almost invisible" rule below each data row) |
| **White** | `#FFFFFF` | 255, 255, 255 | Default light surface, alternating data rows (the lighter one) |

**Application logic:**

- Primary Red → table header rows, "Open" status, chevrons, eyebrow accent labels, hero tab color.
- Dark Red → "In-Progress" status, secondary accents where primary red would be too loud.
- Near-Black → body text, dark hero strip, total-hours card, dark KPI tiles.
- Charcoal → "Closed" status, charcoal KPI tiles, table tab color.
- Gold → DARK BACKGROUNDS ONLY. Eyebrow labels on dark cards. "Done" pill background.
- Cream → light backgrounds, callout cells, label-cell shading, alternating data rows.
- Pale Cream → the alternate-row color for table zebra striping.
- Subtle Grey → 1-pixel bottom borders on data rows. Never thicker.

**Never introduce blue, green, purple, or orange** — even for data viz, even for "intuitive" status colors (green ≠ Done, red is not Open — well, primary red *is* Open, by deliberate brand choice). Use tints of red, gold, and charcoal for chart series.

---

## Typography

| Role | Font | Use in XLSX |
|------|------|-------------|
| Body / UI | Calibri | Everything — cell text, headers, KPI numerals, eyebrow labels |
| Display | Cera Pro | If available, for large hero numerals (Calibri Bold is the safe universal fallback that ships on Windows, macOS, and LibreOffice) |
| Editorial | EB Garamond | Reserved — XLSX rendering of EB Garamond is unreliable across viewers, prefer Calibri for spreadsheet output |
| Arabic | Noto Sans Arabic | All Arabic-language cells |

**Size scale used in the approved Bookly build:**

| Element | Font | Size (pt) | Weight | Color |
|---|---|---|---|---|
| Cover hero title | Calibri | 48 | Bold | `#FFFFFF` |
| Cover hero subtitle | Calibri | 16 | Regular | `#EFEBE3` |
| Cover hero eyebrow | Calibri | 11 | Bold | `#C1A068` |
| Cover hero description | Calibri | 11 | Regular | `#EFEBE3` |
| KPI tile eyebrow | Calibri | 9 | Bold | brand color (gold on dark, red on cream) |
| KPI tile numeral | Calibri | 44–64 | Bold | white on dark, near-black on cream |
| KPI tile subtitle | Calibri | 9 | Regular | cream on dark, charcoal on cream |
| Title-bar headline | Calibri | 14 | Bold | `#FFFFFF` |
| Section eyebrow (editorial) | Calibri | 10 | Bold | `#CE202F` |
| Table header | Calibri | 10 | Bold | `#FFFFFF` |
| Data row text | Calibri | 10 | Regular | `#221E1F` |
| Status pill | Calibri | 10 | Bold | varies (see SKILL.md table) |
| Manual body | Calibri | 11.5 | Regular | `#221E1F` |
| Footer "TOTAL HOURS" eyebrow | Calibri | 9 | Bold | `#C1A068` (on dark) |
| Footer total numeral | Calibri | 36 | Bold | `#FFFFFF` |
| End-of-findings marker | Calibri | 10 | Bold italic | `#242424` |

Never substitute Arial / Roboto / Inter / Tahoma — even when Cera Pro isn't available. Calibri is the universal fallback.

---

## Logo rules in XLSX

- **White wordmark on every sheet** — top-right of the dark title bar (row 1). Re-anchor the image to a column that exists in the data range, otherwise the embed silently disappears.
- **Pre-resize the logo** to ~36px tall before embedding. Excel embeds the source image at full resolution, which bloats the file and renders blurry at small sizes. Use Pillow:

  ```python
  from PIL import Image
  img = Image.open(src)
  w, h = img.size
  ratio = 36 / h
  img.resize((int(w * ratio), 36), Image.LANCZOS).save(dst, "PNG", optimize=True)
  ```

- **Aspect ratio 5.09 : 1.** Original is 1568 × 308. Never override the ratio when resizing.
- **Dark wordmark** only used in light-background contexts (rare in XLSX since the title bar is always dark). The Cover's KPI strip and the editorial sheets use the white logo on the dark title bar; no dark logo placement is needed for the standard archetypes.

---

## Sheet archetypes — geometry

The four archetypes from the SKILL.md, with their exact specs:

### A · Cover

```
Canvas: 12 columns, each width 12
Hero block: rows 2–12, cols B–K, fill near-black
  Row 4 (h=22)  · eyebrow at col 3, 11pt bold gold
  Row 6 (h=56)  · title at col 3, 48pt bold white
  Row 7 (h=56)  · subtitle at col 3, 16pt cream
  Row 10–11     · description at col 3, 11pt cream wrap
  White logo embedded at I3 (top-right of hero)
Row 13 (h=4)    · red accent line, cols B–D only (short — the brand motif)

KPI tiles: rows 15 (eyebrow, h=20), 16 (numeral, h=56), 17 (subtitle, h=22), 18 (red strip, h=6)
  Tile 1: cols B–C, dark (gold eyebrow, white num)
  Tile 2: cols D–E, cream (red eyebrow, near-black num)
  Tile 3: cols F–G, cream (red eyebrow, near-black num)
  Tile 4: cols H–I, dark (gold eyebrow, white num)

Contents block: from row 20
  Row 20 · "CONTENTS" eyebrow in red
  Row 21 · short red accent line (cols B–C only)
  Row 22+ · alternating white / pale-cream rows
    Col B (chevron ›) — red 14pt bold center
    Cols C–E (sheet name, hyperlinked)
    Cols F–J (description, charcoal 10pt)
```

### B · Summary

```
Standard title bar (row 1 dark h=44, row 2 red h=4, row 3 spacer h=8)
Row 4–7 hero numbers:
  Row 4 (h=18) eyebrow
  Row 5 (h=70) hero numeral (64pt bold)
  Row 6 (h=22) subtitle
  Row 7 (h=4)  red strip
  Cols 1–4: dark hero card ("TOTAL HOURS LOGGED" / "108")
  Cols 5–8: cream card split into two ("COMPLETED" 27.5 + "AWAITING APPROVAL" 80.5)

Row 9+ breakdown table:
  Eyebrow "HOURS BREAKDOWN" in red
  Short red accent line
  Row 12: red header (Category / Sprint / Hours / Notes)
  Rows 13+: data with category pills (gold for Completed, charcoal for Awaiting)
  Subtotal rows (pale cream, italic)
  Final row: dark TOTAL band with gold label + white numeral
```

### C · Data table (findings)

```
Row 1 (h=44) · dark hero strip, eyebrow + title + white logo at right
Row 2 (h=4)  · red accent line
Row 3 (h=8)  · spacer
Row 4 (h=38) · red header row, 10pt bold white, center wrap
Rows 5+: data rows
  Alternating: white (even-indexed) / pale-cream (odd-indexed)
  Each row h=38, wrap_text on
  Sl-No column: center, bold
  Date columns: center, format dd mmm yyyy
  Status column: pill (see status mapping)
  Other columns: left wrap top, indent 1
  Bottom border: 1px subtle-grey
Spacer row h=14
Footer block (rows F to F+3):
  Cols 1–3: dark total-hours card
    Row F (h=18)   eyebrow "TOTAL HOURS" in gold 9pt
    Row F+1 (h=50) numeral 36pt bold white
    Row F+2 (h=18) subtitle 9pt cream
    Row F+3 (h=4)  red strip
  Cols 5–onward: cream sprint-details card
    Row F (h=18)   eyebrow "SPRINT DETAILS" in red 9pt
    Rows F+1–F+2  details text (UAT Sprint X / Submitted End / Sprint Start / Sprint End)
End-of-findings marker row (pale cream): centered italic "— END OF FINDINGS LIST —"
Freeze panes at A5, auto-filter on A4:lastcol-end
Print setup: A4 landscape, fit-to-width-1 / fit-to-height-0, repeat rows 1:4
```

### D · Editorial sheet

```
Wide single-column layout (col A=4, col B=110, col C=4)
Standard title bar
Each section:
  Row R   (h=22) · 10pt bold red eyebrow
  Row R+1 (h=3)  · short red accent line (col B only)
  Row R+2 (h=6)  · spacer
  Row R+3 (h=48) · body paragraph, 11.5pt near-black, wrap top
  Row R+4 (h=12) · spacer
For glossary blocks, alternate term-cell (cream pill, 11pt bold) with definition (10.5pt charcoal indent).
```

---

## Page setup (every sheet)

```python
ws.page_setup.orientation = ws.ORIENTATION_LANDSCAPE  # or PORTRAIT for editorial
ws.page_setup.paperSize = ws.PAPERSIZE_A4
ws.page_setup.fitToWidth = 1
ws.page_setup.fitToHeight = 0     # 1 for cover/manual to force one-page
ws.sheet_properties.pageSetUpPr.fitToPage = True
ws.page_margins.left = 0.3
ws.page_margins.right = 0.3
ws.page_margins.top = 0.4
ws.page_margins.bottom = 0.4
ws.print_title_rows = "1:4"       # repeat title bar + header on each printed page
ws.sheet_view.showGridLines = False
```

---

## Tab colors

- Cover and Summary → primary red `#CE202F`
- All other sheets → charcoal `#242424`

This subtle navigation cue lets users see the workbook's two "hero" sheets in the tab strip.

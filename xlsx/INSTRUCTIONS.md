# Ewaantech XLSX Builder — Instructions Module

You're producing an Excel workbook that should feel like Ewaantech's design
studio made it. This module encodes the validated workflow that produced the
approved UAT Findings rebuild (Bookly). Follow it.

> **Path convention.** All paths below use `${EWT_XLSX_DIR}` which the master
> skill router has set to this sub-skill's bundle folder (default
> `/mnt/skills/user/ewaantech-brand-master/xlsx`). If the variable is not set
> in your shell, substitute the absolute path.

The two non-negotiables of this module:

1. **Always ask the user for the brand logo before building.** Even if you
   find a logo in the project, ask. Different workbooks may carry different
   sub-brands, partner co-marks, or special editions — never assume.
2. **Reproduce the source content verbatim.** This module rebrands
   presentation; it does not rewrite content, rename rows, "tidy" wording,
   or drop oddly-named sheets. If a paragraph is awkward in the source, it's
   awkward in the output. (Exception: trim wholly-empty trailing rows —
   they're authoring artifacts, not content.)

---

## The 7-step workflow

Don't skip the visual QA pass — spreadsheets render unpredictably across
columns and rows, and a layout that looks right on inspection of code can
ship with `###` truncation, overlap, or status pills with wrong colors.

### 1 · Ask for the logo

Always start with this — before reading the source, before searching the
guideline. Ask the user to share or confirm the logo. Required answer covers:

- Which logo variant? Original (dark wordmark) for light backgrounds, white
  wordmark for dark backgrounds. The XLSX archetype uses the **white
  wordmark** on the dark title bar at the top of every sheet — but confirm
  anyway.
- Is there a specific logo file they want used? (Filename or upload.)

If the user references "the usual logo" or "the brand logo" and the project
clearly has it (e.g., a `Corporate_Guideline` PDF or an uploaded logo),
still confirm once: "I'll use `EWT_LOGO_WHITE_2026.png` from the project —
confirm?" Then proceed.

If no logo is available and the user can't share one, do not invent one or
fall back to text. Stop and tell the user the skill requires a logo image.

### 2 · Pull brand values from the guideline

Call `project_knowledge_search` on `Corporate_Guideline_2026.pdf` (or
whichever guideline is in the project) for:

- `"primary colors HEX CMYK"` — the canonical palette
- `"typography Calibri"` — the digital body font spec
- `"secondary colors gold cream charcoal"` — chart / table accents
- `"logo wrong applications"` — disallowed logo placements

Never reuse hex codes from memory across sessions. Read them fresh each run.

A canonical snapshot of the values that produced the approved build lives in
`${EWT_XLSX_DIR}/references/brand-system.md`. If it ever disagrees with the
PDF, the PDF wins — but it's safe to copy-paste from as a starting point.

### 3 · Inspect the source workbook

Before designing anything, understand the structure. For each sheet, find
the true data extent (sources often have inflated `max_row` / `max_column`
because of formatting artifacts) and classify what archetype it is:

```python
from openpyxl import load_workbook
wb = load_workbook(src_path, data_only=True)
for name in wb.sheetnames:
    ws = wb[name]
    # walk the actual content, not max_row/max_col
    last_row, last_col = 0, 0
    for r in range(1, min(ws.max_row, 200) + 1):
        for c in range(1, min(ws.max_column, 60) + 1):
            v = ws.cell(row=r, column=c).value
            if v is not None and str(v).strip():
                last_row = max(last_row, r); last_col = max(last_col, c)
    print(name, last_row, last_col)
```

Then assign one of the four archetypes (see step 6) to each source sheet.
Some sheets may be empty by design (a `Messages` reserve sheet, for instance)
— preserve them.

**Critical — scan for embedded images in the same pass.** openpyxl's
`load_workbook(data_only=True)` does NOT surface embedded images in its
public API. You must read the .xlsx as a zip and parse
`xl/drawings/drawing*.xml` to find every image, what cell it's anchored to,
and which sheet it belongs to. UAT logs, issue trackers, and findings sheets
routinely have screenshot evidence pasted directly into cells (not as URLs)
— missing them silently strips the evidence out of the rebuild. Use
`lib.extract_source_images()` for this. See step 6.5.

### 4 · Read the public xlsx skill first

Before writing any openpyxl code, read `/mnt/skills/public/xlsx/SKILL.md`. It
documents the recalculation script (`scripts/recalc.py`) and the
formula-error checks used by the QA pass in this module.

### 5 · Clone the scaffold

Start from `${EWT_XLSX_DIR}/scripts/lib.py` — it contains the brand tokens,
style helpers (`fill`, `font`, `apply_title_bar`, `apply_header_row`,
`apply_data_rows`), the status-pill mapping, and the page-setup helper. Drop
in your content from the source inspection using a build script modeled on
`${EWT_XLSX_DIR}/scripts/build_skeleton.py`.

Copy them into your working directory at the start of every build:

```bash
mkdir -p /home/claude/work
cp ${EWT_XLSX_DIR}/scripts/lib.py /home/claude/work/
cp ${EWT_XLSX_DIR}/scripts/build_skeleton.py /home/claude/work/build.py
cp <user-logo> /home/claude/work/logo_white.png
cd /home/claude/work
```

Don't rewrite `lib.py` — extend it. The four helpers in there are the same
four helpers across every Ewaantech XLSX deliverable.

### 6 · Build each sheet from its archetype

Every Ewaantech workbook is composed of these four archetypes. Identify the
right one for each source sheet, then build accordingly:

#### A · Cover

A single dark hero strip on the left of the page, KPI tiles below, and a
chevron-led navigation list pointing at every other sheet in the workbook.
Used as sheet 1 of any multi-sheet workbook.

```
┌─────────────────────────────────────────────────────────┐
│ ░░ DARK NEAR-BLACK HERO BLOCK ░░       [white logo]    │
│   UAT FINDINGS / 2026   (gold eyebrow, 11pt)            │
│   Bookly                (white, 48pt bold)              │
│   Mobile App · UAT Log  (cream, 16pt subtitle)          │
│   Short description, wrapped.                           │
│ ░░ ─── red accent line (4px) ░░                         │
├─────────────────────────────────────────────────────────┤
│ [TOTAL HRS][COMPLETED ][AWAITING][SPRINTS] tile band    │
│   108         27.5       80.5      5     (big numerals) │
│ ─── red strip under tiles                               │
├─────────────────────────────────────────────────────────┤
│ CONTENTS                                                │
│ ─                                                       │
│ › Summary             — Hours by sprint and approval    │
│ › Findings-22-01-2026 — UAT Sprint 1 · Migration        │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘
```

KPI tiles alternate dark/cream — dark tiles use gold eyebrow + white numeral;
cream tiles use red eyebrow + near-black numeral. The chevron `›` is brand
red, and every contents row is a real hyperlink to its sheet.

#### B · Summary

A "hero numbers" page. One huge primary number on near-black with a gold
eyebrow, plus 2–3 supporting tiles on cream. Below that, a clean breakdown
table with red header row and category pills in gold (success) / charcoal
(pending).

The summary's job is to be readable from across the room. If the viewer
can't tell which number is the headline within one second, the hierarchy is
too flat — make the hero numeral 48–64pt and the supporting numerals 36–44pt.

#### C · Data table (the "findings" sheet)

The bread-and-butter of UAT logs, issue trackers, punch lists, test reports.
Every column from the source is preserved exactly as written. Layout:

```
Row 1 (h=44) · Dark hero strip with eyebrow + title + white logo on right
Row 2 (h=4)  · Red accent line
Row 3 (h=8)  · Spacer
Row 4 (h=38) · Red header row, white bold text, centered + wrap
Row 5+       · Data rows, alternating white/pale-cream, h=38, wrap_text
End-of-data  · Total-hours dark card (left) + Sprint-details cream card (right)
Last row     · Centered "— END OF FINDINGS LIST —" marker in pale cream
```

Status pills, dates, and the Sl-No column get special treatment (see
"Status pill mapping" and "Column-type formatting" below).

Apply `freeze_panes = "A5"` so the header stays visible when scrolling, and
`auto_filter` on the header range so users can filter the table.

#### D · Editorial sheet

For manuals, intros, reference content. Brief, no tabular data. Each section
gets a red 10pt eyebrow, a 3px red accent line beneath it, and a body
paragraph in 11–12pt near-black. Optional sub-table for column glossaries —
use cream pills for the term and indented paragraph below for the definition.

This is the same pattern as the brand guideline's section pages and the
docx module's callout blocks. Keep generous whitespace.

### 6.5 · Re-embed source screenshots

UAT logs and trackers commonly have screenshot evidence pasted directly into
cells of the Screenshot column. These images live inside the workbook zip
under `xl/media/` and are anchored to cells via `xl/drawings/drawing*.xml`.
They are NOT exposed by `openpyxl.load_workbook(data_only=True)` — if you
skip this step, the rebuild ships with empty Screenshot cells and the user
loses their evidence.

Use the helpers in `lib.py`:

```python
from lib import extract_source_images, embed_screenshot

placements = extract_source_images(SRC, extract_dir="/home/claude/tmp/imgs")
# Returns: {sheet_name: [{source_row, source_col, image, image_path}, ...]}

# After you've built each data-table sheet, embed every image:
for sheet_name, items in placements.items():
    if sheet_name not in wb.sheetnames:
        continue
    ws = wb[sheet_name]
    # Each data row in the rebuild sits at (source_row + 3) because the
    # branded title bar occupies 3 rows above the header. Verify the offset
    # if you've changed the title-bar layout.
    for it in items:
        embed_screenshot(
            ws, image_path=it["image_path"],
            target_row=it["source_row"] + 3,
            target_col_header="Screenshot",       # resolved against row-4 headers
            max_w_px=140, max_h_px=130,
        )
```

`embed_screenshot()` does three things:
1. Pre-resizes the image to fit within a 140×130 px bounding box (Pillow),
   preserving aspect ratio. Mobile-portrait screenshots end up ~60×130;
   landscape screens ~140×55.
2. Widens the Screenshot column to width 22 (≈ 155 px display) so the image
   has padding inside the cell.
3. Bumps that row's height to fit the image + 4 px padding. Other rows stay
   at the default 38 pt — only image-bearing rows grow.

**Never substitute an image with placeholder text** like `[Screenshot]`. If
the image fails to extract (corrupt, unsupported format), log a warning and
leave the cell empty — the surrounding row still tells the reviewer what the
finding is.

### 7 · Render + visual QA

Always render to PDF and look at every sheet before delivering:

```bash
cd /home/claude/work
python3 build.py
# 1. Recalculate formulas and check for errors
python3 /mnt/skills/public/xlsx/scripts/recalc.py <output>.xlsx 60
# 2. Convert to PDF for visual inspection
cp <output>.xlsx preview.xlsx
libreoffice --headless --convert-to pdf preview.xlsx
pdftoppm -r 90 preview.pdf page -png
```

Then `view` every `page-NN.png`. Look specifically for:

- **`###` in any cell.** A column is too narrow for its content. Widen it.
  Common offenders: Date Added, Due Date, Sprint Name. Set widths to ≥ 15
  for short date columns, ≥ 16 for sprint names.
- **Status pill not colored.** Means the value didn't match any case in
  `status_style()`. Add the new status to the helper. Brand-palette only —
  never invent a color.
- **Logo invisible.** Means the embed position fell outside the sheet's
  column range. Re-anchor to a column that's inside the data range.
- **One sheet spilling to multiple pages on print.** Set landscape A4 +
  fit-to-width-1 / fit-to-height-0. The lib helper does this; if you skipped
  it, add it back.
- **Total-hours card showing "—".** The footer-detection regex didn't find
  the number. Either the source has the total on a row with no "total" word
  — handled by the single-numeric-row fallback in `lib.split_findings_data`
  — or there's no total at all (sample sheets). The "—" placeholder is
  correct for the no-total case.
- **Sprint name showing as "Sprint Name:".** The label was captured as the
  value. The helper now skips strings ending in `:` — if it still appears,
  the source has the label and value glued together; manual split required.
- **Gold appearing on a light surface.** Brand violation. Gold is
  dark-backgrounds only.
- **Empty Screenshot cells where the source had images.** You forgot step
  6.5 — embedded images aren't surfaced by openpyxl. Run
  `extract_source_images()` and re-embed.
- **Screenshot image too tall (whole row 300+ pt) or distorted.** The
  max-box wasn't enforced. Use `embed_screenshot()` rather than raw
  `XLImage` — it caps the size and sets the row height.

Fix, re-render, re-check. Stop after one fix-and-verify pass — don't chase
sub-pixel positioning.

---

## Status pill mapping

This is the single most common place a junior would introduce off-brand
color. Memorize the mapping (it lives in
`${EWT_XLSX_DIR}/scripts/lib.py:status_style()` too):

| Status string | Background | Text color | Why |
|---|---|---|---|
| `Closed` | Charcoal `#242424` | Cream `#EFEBE3` | "Sealed / archived" — somber and final |
| `Done` | Gold `#C1A068` | Near-black `#221E1F` | Premium achievement — gold is the reward color |
| `Open`, `Re-Open`, `Reopen` | Primary Red `#CE202F` | White `#FFFFFF` | Active / needs attention |
| `In-Progress`, `In Progress`, `In-progress` | Dark Red `#AC1F24` | White `#FFFFFF` | Moving — slightly less urgent than Open |
| `Review` | Near-Black `#221E1F` | Gold `#C1A068` | Premium pause — under scrutiny |
| `On-Hold`, `Not an Issue` | Cream `#EFEBE3` | Charcoal `#242424` | Quiet / passive |
| Anything else | Cream | Charcoal | Safe default |

**Never use green for "Done" or "Closed".** Green is not in the Ewaantech
palette. The same applies to yellow for "In Progress", blue for "Review",
etc. Stay inside the palette — the result still reads as clearly as a
traffic-light scheme because the values are encoded in luminance contrast,
not hue.

---

## Column-type formatting

Apply these inside the data-row loop so each column reads correctly:

| Column type | Width | Format | Alignment | Notes |
|---|---|---|---|---|
| `Sl No` | 7 | (number) | center, bold | The row index — small and tight |
| `Milestone` | 14 | (text) | left wrap | |
| `Section` | 20 | (text) | left wrap | |
| `Findings` / `Description` | 46 | (text) | left wrap top | Widest column — the actual content |
| `Screenshot` | 18 | (text) | left wrap | URLs go here |
| `Client Comment` | 22 | (text) | left wrap | |
| `Date Added`, `Due Date` | 15 | `dd mmm yyyy` | center | NEVER leave at default; you'll get `###` |
| `Finding Type` | 18 | (text) | left | |
| `Enhancement Task(s) Approval` | 22 | `dd mmm yyyy` if date | left | Source-dependent — can be a date or "Yes"/"Approved" |
| `Sprint Name` | 16 | (text) | left | |
| `Estimated Hours` | 15 | `0.0` | left wrap | |
| `Status` | 14 | (pill) | center | See status-pill mapping above |
| `Ewaantech Comment`, `QC Comment`, `Dev Comment` | 22–26 | (text) | left wrap top | |

Row height should be 38 for data rows — this fits ~2 lines of 10pt wrapped
Calibri without clipping. Header rows are 38 too (with 10pt bold center-wrap
text).

---

## Non-negotiables

These came from the approved UAT Findings Bookly build. Breaking them
produces off-brand output:

1. **Verbatim content.** This module rebrands presentation; it does not edit
   words, row counts, sheet names, or column headers. Preserve them exactly.
2. **Always ask for the logo.** Never assume, never invent.
3. **Logo aspect ratio fixed at 5.09 : 1.** Original is 1568 × 308 px. For a
   36-pixel-tall placement, width = 184. Squashed logos are the most-flagged
   brand violation.
4. **Palette traceable to the brand PDF.** No gradients, no accent
   blues/greens/purples — even for data viz. Use tints of brand red, gold,
   and charcoal for charts.
5. **Gold (`#C1A068`) on dark backgrounds only.** Never on cream or white.
   Most common brand-color violation in spreadsheets — easy to slip up when
   you want a "success" color for closed items, but gold-on-cream still
   breaks the rule. Use charcoal-bg for "Closed", reserve gold for "Done"
   (which is dark-background) and for dark-bg accent labels.
6. **Calibri throughout.** Never Arial / Roboto / Inter / Tahoma. Cera Pro
   is the display font but installed inconsistently — Calibri is the safe
   universal fallback for the spreadsheet context.
7. **Dark sections as punctuation.** The title bar on each sheet is the only
   dark element. Don't make the body rows dark too. Dark is for the hero
   strip and the total-hours card; everything else is white/cream.
8. **No gridlines.** Always set `ws.sheet_view.showGridLines = False`.
   Borders are subtle 1px in `#DDD8CF` (a cream tint), not the default Excel
   grey.

---

## Common pitfalls

**Hardcoded hex values across the file.** Define brand tokens once at the
top of `lib.py` (or import from there). Pulling colors from memory mid-build
is the fastest way to ship off-brand.

**Status-pill detection on case-mismatched strings.** Some source data has
`Open` and some has `open`; some has `In Progress` and some has
`In-progress`. The `status_style()` helper lowercases before matching and
accepts hyphen / space variants. If the user introduces a new state
("Awaiting QA", "Blocked", etc.), add it to the mapping — never invent a
color outside the palette.

**Trusting `ws.max_row`.** openpyxl reports inflated maxes for spreadsheets
that had merged ranges, comments, or formatting in long-deleted cells. Walk
the actual content (see step 3) to find the true data extent.

**Hardcoded total-hours value.** Don't sum in Python and write the number.
Use an Excel formula (`=SUM(C5:C20)`) so the workbook recalculates when the
user edits a row. The `scripts/recalc.py` step verifies the formula
resolves.

**Dropping the empty `Messages` sheet.** Some workbooks have reserved sheets
with no content. Keep them — show a polite "reserved for future
communications" message inside the branded shell. Removing them is content
editing, not rebranding.

**Stripping embedded screenshots.** This is the most expensive miss — UAT
logs lose their evidence entirely. openpyxl's `data_only=True` doesn't
surface images; you have to parse the zip yourself. Always run
`extract_source_images()` on any source workbook that might contain visual
evidence (UAT logs, issue trackers, design review sheets, QA reports). If
the source has zero images, the helper returns an empty dict and you move on
— no cost.

**Forgetting page setup.** A sheet that looks fine on screen can print
across 8 pages with cut-off columns. Always: `orientation = LANDSCAPE`,
`fitToWidth = 1`, `fitToHeight = 0`, `print_title_rows = "1:4"`. Run a PDF QA
before delivery.

**Naming the workbook with a date.** Use the convention
`Ewaantech_<DocumentType>_<Topic>.xlsx`. No dates in filenames — they fall
out of date and create version-control friction. (Sheet names can carry
dates; filenames shouldn't.)

---

## Reference files

Read these when you need detail:

- **`${EWT_XLSX_DIR}/references/brand-system.md`** — Canonical palette with
  HEX/CMYK/RGB, typography hierarchy, logo rules, page geometry, and the
  four sheet archetypes with their exact dimensions. Pulls directly from
  the brand PDF.
- **`${EWT_XLSX_DIR}/scripts/lib.py`** — Ready-to-use openpyxl helper
  library: brand tokens, `fill()` and `font()` shortcuts,
  `apply_title_bar()`, `apply_header_row()`, `apply_data_rows()` with date /
  status / serial handling, `status_style()` mapping, `apply_print_setup()`,
  plus `extract_source_images()` and `embed_screenshot()` for preserving
  embedded image evidence from source workbooks. Don't rewrite — extend.
- **`${EWT_XLSX_DIR}/scripts/build_skeleton.py`** — Ready-to-fill build
  script: reads a source workbook, classifies each sheet by archetype,
  builds the rebranded output. Clone, fill in any source-specific overrides,
  ship.

---

## Output naming

Use the convention from project instructions:

```
Ewaantech_<DocumentType>_<Topic>.xlsx
```

Examples: `Ewaantech_UAT_Findings_Bookly_2026.xlsx`,
`Ewaantech_Tracker_Q2Marketing.xlsx`,
`Ewaantech_HoursSummary_INTDC.xlsx`. Place in `/mnt/user-data/outputs/` and
call `present_files` with the path. Keep the chat summary short — 2–4 lines
describing what was produced and the archetypes applied. The user will open
the file themselves.

---

## Remember

This module captures what produced the approved UAT Findings Bookly rebuild.
Follow the workflow, use the scaffold, ask for the logo, preserve content
verbatim, check your renders. When the user says "recreate this xlsx
on-brand," they're asking for the same quality again — not a generic Excel
template.

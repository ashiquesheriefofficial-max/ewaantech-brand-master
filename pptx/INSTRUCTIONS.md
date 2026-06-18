# Ewaantech PPT Builder — Instructions Module

You are producing a PowerPoint deck that must feel like it was made by
Ewaantech's own design studio. Don't default to generic slide layouts. This
module encodes the specific patterns — code, typography, color, motif — that
produced the approved Ewaantech Power BI rebuild. Follow them.

> **Path convention.** All paths below use `${EWT_PPTX_DIR}` which the master
> skill router has set to this sub-skill's bundle folder (default
> `/mnt/skills/user/ewaantech-brand-master/pptx`). If the variable is not set
> in your shell, substitute the absolute path.

The two non-negotiables of this module:

1. **Always ask the user for the brand logo before building, and use only the
   logo the user supplies.** Even if you find a logo in the project, ask. Never
   fall back to the bundled sample logos for the output — they exist only as a
   visual reference. Different decks may carry different sub-brands, partner
   co-marks, or special editions — never assume.
2. **Reproduce the source content verbatim.** This module rebrands
   presentation; it does not rewrite content. If you find yourself
   paraphrasing, summarizing, or "improving" a sentence, stop — preserve the
   words exactly as written.

---

## The 8-step workflow

Do these in order. Don't skip the QA pass — it's what separates a deck that
renders cleanly from one that ships with overlapping text.

### 1 · Ask for the logo

Always start with this — before reading the source, before searching the
guideline. Ask the user to share or confirm the logo. Required answer covers:

- Which logo variant(s)? A deck's sandwich structure uses the **dark wordmark**
  on light content slides and the **white wordmark** on dark cover / divider /
  closing slides, so a typical deck needs both. Ask for both variants (or
  confirm a single one is enough if the deck has no dark slides). Don't
  fabricate the white version from the dark one — request it from the user.
- Is there a specific logo file they want used? (Filename or upload.)

If the user references "the usual logo" or "the brand logo" and the project
clearly has it (e.g., a `Corporate_Guideline` PDF or an uploaded logo), still
confirm once: "I'll use `EWT_LOGO_ORIGINAL_2026.png` / `EWT_LOGO_WHITE_2026.png`
from the project — confirm?" Then proceed.

Use only the logo the user supplies. If no logo is available and the user
can't share one, do not invent one, do not fall back to the bundled sample
logos, and do not fall back to text. Stop and tell the user the skill requires
a logo image.

### 2 · Understand the source

If the user uploads a .pptx, read its content before designing anything:

```bash
extract-text /mnt/user-data/uploads/<file>.pptx
python3 /mnt/skills/public/pptx/scripts/thumbnail.py /mnt/user-data/uploads/<file>.pptx
```

The thumbnail grid tells you the visual structure (which slides are titles,
dividers, grids, etc.). The text extract tells you content to preserve.
Never paraphrase content away — preserve the user's intent.

### 3 · Pull brand values from the guideline

Call `project_knowledge_search` on `Corporate_Guideline_2026.pdf` for:

- `"primary colors HEX CMYK"` — exact palette values
- `"typography Cera Pro EB Garamond"` — font roles and weights
- `"powerpoint template slide"` — deck-specific rules (imagery, grid, layout)
- `"logo wrong applications"` — disallowed logo placements
- `"photography overlay"` — rules for placing text/logo over images

Never reuse hex codes or specs from memory across sessions. Read them fresh.

For a copy-paste reference of the current canonical values (so you don't
search the same queries every time), see
`${EWT_PPTX_DIR}/references/brand-system.md`. If it ever disagrees with the
PDF, the PDF wins.

### 4 · Stage the user's logo in the working directory

Use only the logo the user supplied in Step 1. Copy it into your build
directory under the filenames the scaffold expects (`logo-dark.png` for the
dark wordmark used on light slides, `logo-white.png` for the white wordmark
used on dark slides):

```bash
mkdir -p /home/claude/work
cp <path-to-user-dark-logo>  /home/claude/work/logo-dark.png
cp <path-to-user-white-logo> /home/claude/work/logo-white.png
```

If the user uploads a deck that already contains the logo, unpack it with
`python3 /mnt/skills/public/pptx/scripts/office/unpack.py` and grab the logo
PNG from `unpacked/ppt/media/`.

Do **not** copy the bundled `${EWT_PPTX_DIR}/assets/logo-*.png` files into the
output build — they are reference samples only. If the user supplied only one
variant and the deck needs the other, go back to Step 1 and ask rather than
substituting a bundled logo.

### 5 · Read the format skill first

Before writing any pptxgenjs code, read `/mnt/skills/public/pptx/SKILL.md` →
`pptxgenjs.md`. It documents format quirks (shadow color length,
`ROUNDED_RECTANGLE` accent bug, shared-option mutation bug) that will bite
you if ignored.

### 6 · Build from the scaffold

Start from `${EWT_PPTX_DIR}/references/build-skeleton.js` — it has the brand
tokens, font constants, icon helper, shadow helpers, and header/footer
builders already set up correctly. Then drop in slides using the archetypes
in `${EWT_PPTX_DIR}/references/slide-patterns.md`.

Every deck should follow the sandwich:

```
Slide 1 · Dark cover        (chevron motif, eyebrow, display title)
Slide 2…N · Light content   (number column + cards / two-column / icon grid)
Slide M · Dark divider      (italic big numeral, section title)
Slide M+1…P · Light content
Slide last · Dark closing   (mirror of cover, contact block)
```

### 7 · Render + visual QA

Never trust the first render. Convert and look:

```bash
cd /home/claude/work
NODE_PATH=$(npm root -g) node build.js
python3 /mnt/skills/public/pptx/scripts/office/soffice.py --headless --convert-to pdf deck.pptx
rm -f slide-*.jpg
pdftoppm -jpeg -r 110 deck.pdf slide
```

Then view every `slide-N.jpg` with the `view` tool. Look specifically for:

- Text overflowing its container (most common defect — oversized italic
  numerals are the repeat offender)
- Elements colliding with the logo in the top-left
- Subtitles bleeding into card grids below them
- Icons rendering at the wrong size or wrong color
- Contrast failures (light text on light, dark on dark)

Fix, re-render, re-check. Stop after one fix-and-verify cycle — don't chase
sub-pixel positioning.

### 8 · Deliver

```bash
cp deck.pptx /mnt/user-data/outputs/Ewaantech_Deck_<Topic>.pptx
```

Then call `present_files`. Keep the chat summary short — 3–4 lines covering
what was produced and the brand patterns applied. The user will open the file
themselves.

---

## Non-negotiables

These came from the approved build. Breaking them produces off-brand output:

1. **Always ask for the logo, use only the user's.** Ask before building;
   never assume, never invent, never ship the bundled sample logos in the
   output.
2. **Layout**: Always `LAYOUT_WIDE` (13.33 × 7.5 in). Never 16:9 at the
   default 10 × 5.625.
3. **Palette**: Only values traced to the brand PDF. No gradients anywhere.
   No accent blues/greens/purples — even in charts.
4. **Typography**: Cera Pro for display, EB Garamond for italic accents and
   big numerals, Calibri for body/UI, Noto Sans Arabic for Arabic. Use the
   actual font names and let systems fall back naturally.
5. **Gold (`#C1A068`)**: Only on dark backgrounds. Never on white or cream.
   This is the single most common brand violation to avoid.
6. **Logo placement**: Dark logo on light, white logo on dark. Never on
   photography without an 80%-opacity overlay. Never on a background matching
   its own color.
7. **Sandwich structure**: Dark slides work as punctuation (cover, divider,
   closer). Using them for every slide flattens the narrative.
8. **Every slide has a visual element**: icon, shape, numeral, card, image.
   Title-plus-bullets is a draft, not a deliverable.

---

## Common pitfalls (learned from real defects)

**Oversized italic numerals on divider slides.** Setting `fontSize: 220` on a
section numeral makes it render beyond its text box and collide with the logo
and title below. Cap at 130pt with a tall text box (`h: 2.4` or more) and
`valign: "top"`.

**Subtitle bleeding into card grid.** If you put a two-line subtitle at
`y: 3.55` and cards starting at `y: 4.05`, the second line will sit on top of
the first card. Either shorten to one line, give the subtitle `h: 0.9+`, or
move the grid to `y: 4.25`.

**Microsoft brand icons (Excel, Azure, SQL Server).** `react-icons/si` doesn't
include Microsoft product icons for licensing reasons. Use `FaFileExcel`,
`FaFileCsv`, `FaServer`, `BsCloudFill`, `FaFolderOpen` as semantic stand-ins
— or rasterize from official brand SVGs if the user supplies them.

**Shared shadow objects across shapes.** pptxgenjs mutates option objects in
place. Define a `makeShadow()` factory function that returns a fresh object
per call. Sharing a single `shadow` const between two shapes corrupts the
second.

**`ROUNDED_RECTANGLE` with accent bars.** Rectangular accent overlays don't
cover rounded corners. Use `RECTANGLE` for any element that needs a clean
accent strip along one edge.

**Hex colors with `#`.** pptxgenjs requires 6-char hex without `#`.
`color: "#CE202F"` silently breaks; use `color: "CE202F"`.

---

## Reference files

Read these when you need the detail:

- **`${EWT_PPTX_DIR}/references/brand-system.md`** — Canonical palette with
  HEX/CMYK/RGB, typography hierarchy, logo rules, photography overlay spec,
  decision logic for when to use which color/font/logo. Pulls directly from
  the brand PDF and is safe to copy-paste from.
- **`${EWT_PPTX_DIR}/references/slide-patterns.md`** — The five proven slide
  archetypes (Cover, Content+Cards, Icon Grid, Dark Section Divider, Closing)
  with their x/y/w/h coordinates, why each element is where it is, and code
  snippets ready to paste.
- **`${EWT_PPTX_DIR}/references/build-skeleton.js`** — A ready-to-run
  pptxgenjs starter with brand tokens, font constants, icon helper
  (react-icons → base64 PNG via sharp), shadow helper factories, and
  header/footer builders. Clone it, fill in the slides, ship.

---

## Assets

- **`${EWT_PPTX_DIR}/assets/logo-dark.png`** — Dark wordmark **reference
  sample**. Shows the correct aspect ratio and the variant to use on
  cream/white/gold/light backgrounds. Do not ship it in the output — use the
  user-supplied logo from Step 1.
- **`${EWT_PPTX_DIR}/assets/logo-white.png`** — White wordmark **reference
  sample** (red chevron preserved), for near-black/dark-red/charcoal/
  photography-with-overlay backgrounds. Do not ship it in the output — use the
  user-supplied logo from Step 1.

These bundled files are visual references only. The working directory
(`/home/claude/work/`) should contain the **user's** logo, copied in under
`logo-dark.png` / `logo-white.png` (Step 4) — pptxgenjs needs file paths for
`addImage({ path: ... })`.

---

## Remember

This module captures what produced an approved output. Follow the workflow,
use the scaffold, check your renders. When the user says "rebuild this deck
on-brand" they're asking for the same quality again — not a generic template.

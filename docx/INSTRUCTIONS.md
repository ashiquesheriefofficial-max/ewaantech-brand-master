# Ewaantech DOCX Builder — Instructions Module

You're producing a Word document that should feel like Ewaantech's design
studio made it. This module encodes the validated workflow that produced the
approved INTDC proposal rebuild and the Attnd BRD rebuild. Follow it.

> **Path convention.** All paths below use `${EWT_DOCX_DIR}` which the master
> skill router has set to this sub-skill's bundle folder (default
> `/mnt/skills/user/ewaantech-brand-master/docx`). If the variable is not set
> in your shell, substitute the absolute path.

The two non-negotiables of this module:

1. **Always ask the user for the brand logo before building.** Even if you
   find a logo in the project, ask. Different documents may carry different
   sub-brands, partner co-marks, or special editions — never assume.
2. **Reproduce the source content verbatim.** This module rebrands
   presentation; it does not rewrite content. If you find yourself
   paraphrasing, summarizing, or "improving" a sentence, stop — preserve the
   words exactly as written.

---

## The 7-step workflow

Don't skip the visual QA pass — Word documents reflow unpredictably and a
layout that looks right on inspection of code can ship with broken page
breaks.

### 1 · Ask for the logo

Always start with this — before reading the source, before searching the
guideline. Ask the user to share or confirm the logo. Required answer covers:

- Which logo variant? Original (dark wordmark) for light backgrounds, white
  wordmark for dark backgrounds. The proposal template uses the original on
  every page (light backgrounds throughout) — but confirm anyway.
- Is there a specific logo file they want used? (Filename or upload.)

If the user references "the usual logo" or "the brand logo" and the project
clearly has it (e.g., a `Corporate_Guideline` PDF or an uploaded logo),
still confirm once: "I'll use `EWT_LOGO_ORIGINAL_2026.png` from the project
— confirm?" Then proceed.

If no logo is available and the user can't share one, do not invent one or
fall back to text. Stop and tell the user the skill requires a logo image.

### 2 · Pull brand values from the guideline

Call `project_knowledge_search` on `Corporate_Guideline_2026.pdf` (or
whichever guideline is in the project) for:

- `"primary colors HEX CMYK"` — the canonical palette
- `"typography Calibri EB Garamond"` — fonts and weights
- `"proposal template"` — page geometry and margins
- `"letterhead margins dimensions"` — supplementary layout rules
- `"logo wrong applications"` — disallowed logo placements

Never reuse hex codes from memory across sessions. Read them fresh each run.

A canonical snapshot of the values that produced the approved builds lives in
`${EWT_DOCX_DIR}/references/brand-system.md`. If it ever disagrees with the
PDF, the PDF wins — but it's safe to copy-paste from as a starting point.

### 3 · Read the source document content verbatim

Parse the source .docx to extract every paragraph, bullet, and table exactly
as written. Use the parser script:

```bash
python3 ${EWT_DOCX_DIR}/scripts/parse_docx.py /mnt/user-data/uploads/<source>.docx > content.json
```

This produces a JSON content tree with paragraphs (preserving heading styles,
list levels, and bold/italic runs) and tables (preserving every cell). You
then build from this — never from memory of what the source said.

Critical: the parser captures the source's authoring style, including any
wholesale bold or italic applied across entire sections. These are usually
source artifacts, not intentional emphasis. Normalize: render bullets in
regular weight, preserve italic only when used sparingly within otherwise
plain text. Headings get the brand styling regardless of the source's
formatting.

### 4 · Read the format skill first

Before writing any docx-js code, read `/mnt/skills/public/docx/SKILL.md`. It
documents the docx-js conventions, validation script, and PDF conversion for
QA used by this module.

### 5 · Generate the brand graphics

The proposal template uses two brand graphics: a top-left hexagonal red flag
(generated fresh each build with Pillow) and a tapered red strip across the
page foot (bundled as a hand-crafted vector asset at
`${EWT_DOCX_DIR}/assets/bottom_strip.png`). (An earlier design also carried a
bottom-right cover triangle — the revised design drops it.) Stage them both
in your working directory:

```bash
mkdir -p /home/claude/work
cp ${EWT_DOCX_DIR}/scripts/make_graphics.py /home/claude/work/
cp ${EWT_DOCX_DIR}/assets/bottom_strip.png /home/claude/work/
cd /home/claude/work
cp <path-to-user-logo> logo.png
python3 make_graphics.py
```

This produces `top_left_flag.png` and `section_marker.png` from Pillow, and
copies the pre-made `bottom_strip.png` from the bundled assets. The Pillow
script reads brand red from `${EWT_DOCX_DIR}/references/brand-system.md`;
don't hardcode hex values.

### 6 · Build from the scaffold

Start from `${EWT_DOCX_DIR}/scripts/lib.js` — it has brand tokens,
headers/footers with floating images, section title blocks, the four table
archetypes (brand table, label/value table, callout, plain), bullet styling,
and the heading helpers. Drop in your content from `content.json` using a
build script modeled on `${EWT_DOCX_DIR}/scripts/build_skeleton.js`.

Every doc follows this structure:

```
Page 1 · Cover
  ├─ hexagonal top-left flag, tapered bottom strip
  ├─ logo top-right
  ├─ big bold black title
  ├─ grey subtitle, optional EB Garamond italic accent in red
  └─ contact block at foot (optional, e.g. for proposals)

Page 2+ · Content sections, each starts with:
  ├─ red top-left flag (shorter than cover version)
  ├─ logo top-right
  ├─ section title block: grey eyebrow + bold black headline + thin red rule
  └─ body content (h2 / h3 / bullets / paragraphs / tables / callouts)

Every page (except cover) carries the red bottom strip with brand-red page number.
```

The four table archetypes:

- **Brand table** — multi-row table with red header row, white text, cream
  alternating rows, thin grey rules. Use for any tabular data where the first
  row is a header.
- **Label/value table** — for borderless key-value layouts (e.g., document
  info, sign-off). First column cream + bold, second column white + regular.
  No red header.
- **Callout** — a one-row cream box with a thick red left border. First line
  bold red as title, remaining lines as body. Use for purpose statements,
  rules, exceptions, "how this works" boxes.
- **Plain** — fallback for simple tabular layouts. Only use if none of the
  above fit.

In the source .docx, callouts are typically encoded as 1×2 tables with cell 0
empty (the visual red panel) and cell 1 holding the title + body lines. The
parser preserves this so your build code can detect them as
`tbl.rows.length === 1 && tbl.rows[0].length === 2`.

### 7 · Render + visual QA

Always convert to PDF and look at every page before delivering:

```bash
cd /home/claude/work
NODE_PATH=$(npm root -g) node build.js
python3 /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf <name>.docx
rm -f qa-*.jpg
pdftoppm -jpeg -r 90 <name>.pdf qa
```

Then view every `qa-N.jpg` with the `view` tool. Look specifically for:

- **Phantom blank pages between sections.** Caused by trailing `PB()`
  page-breaks colliding with `pageBreakBefore: true` on the next section.
  Fix: use `pageBreakBefore` on the section title block, drop the trailing
  PB.
- **Section title eyebrow overlapping the headline.** Increase `line: 320`
  and `spacing.after` between the eyebrow and headline paragraphs.
- **Orphan table rows.** A single row landing alone on a page after the rest
  of the table. Set `cantSplit: true` on table rows (already default in
  `brandTable`) and accept the natural break — or shorten content above.
- **Logo aspect ratio.** The original wordmark is 5.09 : 1 (1568 × 308 px).
  For height = 32 use width = 165. Squashed logos are the most visible brand
  violation.
- **Callout missing its red title.** Means the parser saw cell 0 as
  containing the title instead of cell 1. Verify with `parse_docx.py` output
  that the empty cell is cell 0.

Fix, re-render, re-check. Stop after one fix-and-verify pass — don't chase
sub-pixel positioning.

---

## Non-negotiables

These came from the approved INTDC and Attnd builds. Breaking them produces
off-brand output:

1. **Verbatim content.** This is the single most important rule. The module
   rebrands presentation; it does not edit words. If a paragraph is awkward
   in the source, it's awkward in the output. (Exception: drop empty padding
   rows from tables — they're authoring artifacts, not content.)
2. **Always ask for the logo.** Never assume, never invent.
3. **Logo aspect ratio fixed at 5.09 : 1.** Original is 1568 × 308. Squashed
   logos are the most-flagged brand violation.
4. **Palette traceable to the brand PDF.** No gradients, no accent
   blues/greens/purples. Even data accents use tints of brand red, gold,
   charcoal.
5. **Gold (`#C1A068`) on dark backgrounds only.** Never on cream or white.
   Most common brand-color violation.
6. **Logo placement.** Dark wordmark on light backgrounds, white wordmark on
   dark. Never on photography without an 80%-opacity overlay. Never on a
   background matching its own color.
7. **Sandwich structure on long docs.** Cover (light, accented) → content →
   optional dark dividers → content → optional closing. Don't make every
   page a "dark section" — punctuation only.
8. **Typography.** Calibri for body and UI, EB Garamond for italic accents
   and pull quotes, Cera Pro for display where available (Calibri is the
   safe fallback that ships everywhere). Never substitute Arial / Roboto /
   Inter.

---

## Common pitfalls

**Hardcoded hex values.** Pulling colors from memory is the fastest way to
ship off-brand. Use `${EWT_DOCX_DIR}/references/brand-system.md` or
`project_knowledge_search` every run.

**Treating row 0 as a header.** Many source `.docx` tables have no formal
header — they're key-value pairs (e.g., the document-information table).
Render those as `labelValueTable`, not `brandTable`. Heuristic: if column 0
reads like a label series ("Document Version", "Status", "Date"), it's a
label/value table.

**Bold-everywhere bullets.** Some sources have entire sections in bold or
italic. That's authoring noise, not emphasis. Normalize bullets to regular
Calibri body weight when more than ~70% of a section's bullets share the
same emphasis.

**Empty padding rows in tables.** Sources often have tables with 10 rows but
only 3 filled. Drop the empty rows — they're not content, they're spacing.

**Trying to recreate the corner shapes as Word drawings.** Don't. Word's
drawing primitives render inconsistently across viewers. Use the PNG images
generated by `make_graphics.py` as floating anchored images. They render
identically everywhere Word, LibreOffice, or PDF can read a PNG.

**Forgetting `pageBreakBefore: true` on section titles.** The first section
after the cover needs `pageBreakBefore: false` (the section break does it).
Every subsequent section needs `pageBreakBefore: true` on its first
paragraph (the eyebrow).

---

## Reference files

Read these when you need detail:

- **`${EWT_DOCX_DIR}/references/brand-system.md`** — Canonical palette with
  HEX/CMYK/RGB, typography hierarchy, logo rules, design-element specs (flag
  dimensions, strip geometry), page geometry. Pulls directly from the brand
  PDF.
- **`${EWT_DOCX_DIR}/references/design-elements.md`** — The proposal
  template's recurring shapes (hexagonal top-left flag, tapered bottom strip,
  optional section marker) with their exact dimensions, colors, and placement
  offsets. Read this before generating graphics for the first time on a new
  format.
- **`${EWT_DOCX_DIR}/scripts/lib.js`** — Ready-to-use docx-js helper library:
  brand tokens, header/footer builders, section title block, brand table,
  label/value table, callout, h2/h3/bullet helpers. Don't rewrite — extend.
- **`${EWT_DOCX_DIR}/scripts/parse_docx.py`** — Parses any .docx into a
  structured JSON content tree. Preserves heading styles, list levels, table
  cells, and bold/italic run information.
- **`${EWT_DOCX_DIR}/scripts/make_graphics.py`** — Generates the top-left
  flag and optional section marker PNGs from a brand-red constant. The
  bottom strip is a hand-crafted vector asset (bundled at
  `${EWT_DOCX_DIR}/assets/bottom_strip.png`) and is NOT regenerated by this
  script — copy it into the working directory separately.
- **`${EWT_DOCX_DIR}/scripts/build_skeleton.js`** — Ready-to-fill build
  script: reads `content.json`, walks the nodes, applies header/footer and
  section title blocks, emits the final `.docx`. Clone, fill in any
  source-specific overrides, ship.

---

## Output naming

Use the convention from project instructions:

```
Ewaantech_<DocumentType>_<Topic>.docx
```

Examples: `Ewaantech_BRD_Attnd_RFP_Phase1.docx`,
`Ewaantech_Proposal_INTDC_WebsiteRevamp.docx`,
`Ewaantech_Responsibilities.docx`. Place in `/mnt/user-data/outputs/` and
call `present_files` with the path. Keep the chat summary short — 2–4 lines
describing what was produced and any brand patterns applied. The user will
open the file themselves.

---

## Remember

This module captures what produced two approved outputs (the Attnd BRD and
the Department Responsibilities reference). Follow the workflow, use the
scaffold, ask for the logo, preserve content verbatim, check your renders.
When the user says "rebuild this on-brand," they're asking for the same
quality again — not a generic template.

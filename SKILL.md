---
name: ewaantech-brand-master
description: >
  Master Ewaantech brand-kit skill. Unifies the validated PPTX, DOCX (new
  hexagonal-flag template) and XLSX builders behind one interactive format
  picker. Use whenever the user asks for an "Ewaantech branded" deliverable,
  "apply our brand", "use the brand guidelines", "make this on-brand",
  "rebuild this on-brand", or hands over any document for rebranding.
  Triggers even when the target format is unclear — the skill asks
  PowerPoint / Word / Excel and dispatches to the correct sub-workflow
  (slide deck, Word doc, or workbook). When the user uploads a .pptx /
  .docx / .xlsx / .xlsm / .csv / .tsv, OR names a format ("rebrand this
  pptx", "branded Excel", "Word doc"), skip the picker and route directly.
  Always prefer this master over guessing — one tap beats wrong-format
  routing. CONTENT IS REPRODUCED VERBATIM — every sub-skill changes
  presentation only, never wording.
---

# Ewaantech Brand Master Skill

This is the unified entry point for producing on-brand Ewaantech
deliverables across PowerPoint, Word, and Excel. It bundles three validated
sub-skills behind one interactive picker and dispatches to the appropriate
workflow once the user selects a format and provides a source file.

The sub-skills behave exactly as the standalone Ewaantech PPT, DOCX (new
template), and XLSX builders did — same workflows, same scaffolds, same QA
loops, same outputs. The only difference is that you reach them through one
picker instead of three separate triggers.

---

## The master workflow

Follow these steps in order on every invocation. Don't skip step 1 — the
picker is the whole point of this skill.

### Step 1 · Detect or ask for the format

Before asking, check whether the user has **already** told you the format:

| Signal | Format |
|---|---|
| Uploaded `.pptx` | PowerPoint |
| Uploaded `.docx` | Word |
| Uploaded `.xlsx`, `.xlsm`, `.csv`, or `.tsv` | Excel |
| Said "pptx" / "ppt" / "slides" / "deck" / "presentation" | PowerPoint |
| Said "docx" / "word doc" / "proposal" / "BRD" / "report" / "letterhead" | Word |
| Said "xlsx" / "excel" / "spreadsheet" / "tracker" / "UAT log" / "findings" | Excel |

If any of these match unambiguously, **skip the picker** and go to Step 3
with the detected format. If multiple formats fit (e.g. "make me a branded
deliverable") or none do, call the picker:

```
ask_user_input_v0(questions=[{
  "question": "Which format do you want me to build?",
  "type": "single_select",
  "options": ["PowerPoint (PPT)", "Word (DOC)", "Excel"]
}])
```

Phrase the lead-in briefly. No preamble paragraphs — the picker is the
point.

### Step 2 · Wait for the user's selection

The user's choice arrives as their next message. Don't continue writing in
the same turn after calling `ask_user_input_v0`.

### Step 3 · Resolve the sub-skill path

Map the format to a sub-folder and set the env var that the INSTRUCTIONS
module expects:

| Format | Sub-skill folder | Env var |
|---|---|---|
| PowerPoint | `pptx/` | `EWT_PPTX_DIR` |
| Word | `docx/` | `EWT_DOCX_DIR` |
| Excel | `xlsx/` | `EWT_XLSX_DIR` |

The absolute path is this skill's install path + `/<folder>`. Default
install location:

```
/mnt/skills/user/ewaantech-brand-master/pptx
/mnt/skills/user/ewaantech-brand-master/docx
/mnt/skills/user/ewaantech-brand-master/xlsx
```

If the skill is installed elsewhere, discover the install path by locating
the folder containing this SKILL.md and append the sub-folder name.

Export the env var so the placeholders inside INSTRUCTIONS.md resolve in
shell commands:

```bash
export EWT_PPTX_DIR=/mnt/skills/user/ewaantech-brand-master/pptx
# or
export EWT_DOCX_DIR=/mnt/skills/user/ewaantech-brand-master/docx
# or
export EWT_XLSX_DIR=/mnt/skills/user/ewaantech-brand-master/xlsx
```

### Step 4 · Confirm the source (if not already provided)

After the format is locked in, check whether the user already shared a
matching source file in this conversation:

- PowerPoint → look for `.pptx` in `/mnt/user-data/uploads/` or context
- Word → look for `.docx`
- Excel → look for `.xlsx` / `.xlsm` / `.csv` / `.tsv`

If a matching file is already present, **proceed without asking** — confirm
briefly in your reply ("I'll use `<filename>` as the source") and move on
to Step 5.

If no matching source is in the conversation, ask in a single line:

> "Got it — please share the source file you'd like me to rebrand."

If the user explicitly says they want to build from scratch (no source),
that's allowed. Skip to Step 5 with a brief outline of what you'll produce.

### Step 5 · Read INSTRUCTIONS.md and follow it verbatim

Read the matching sub-skill's INSTRUCTIONS module **before** doing any
other work:

```
view <sub-skill folder>/INSTRUCTIONS.md
```

Then **follow the INSTRUCTIONS module verbatim**. Every step — including
the "ask for the logo" gate at the top of PPTX, DOCX, and XLSX (each now
asks for the logo and uses only the user-supplied logo) — every QA check,
and every non-negotiable in the module applies in full. This master skill
changes nothing about how the underlying workflows run; it only routes you
to the right one.

The INSTRUCTIONS modules reference their bundle paths using the
`${EWT_*_DIR}` placeholder. When you see a command like
`cp ${EWT_PPTX_DIR}/references/build-skeleton.js /home/claude/work/`, it
resolves to the absolute path under this skill's bundle. If the shell doesn't
expand the variable for any reason, substitute the absolute path by hand.

### Step 6 · Deliver via `present_files`

Each sub-skill workflow ends with a `present_files` call and a short
summary. Use the file-naming convention from the project instructions:

```
Ewaantech_<DocumentType>_<Topic>.<ext>
```

Place the final file in `/mnt/user-data/outputs/`. Keep the chat summary
short — 2–4 lines covering what was produced and the brand patterns
applied. The user will open the file themselves.

---

## Bundled sub-skills

```
ewaantech-brand-master/
├── SKILL.md                          ← (this file: the router)
├── pptx/                             ← Ewaantech PPT builder bundle
│   ├── INSTRUCTIONS.md               ← workflow, archetypes, QA loop
│   ├── assets/                       ← logo-dark.png, logo-white.png (reference samples only — output uses the user's logo)
│   └── references/                   ← brand-system, slide-patterns, build-skeleton
├── docx/                             ← Ewaantech DOCX builder bundle (new template)
│   ├── INSTRUCTIONS.md               ← workflow, table archetypes, QA loop
│   ├── assets/                       ← bottom_strip.png
│   ├── references/                   ← brand-system, design-elements
│   └── scripts/                      ← lib.js, parse_docx.py, make_graphics.py, build_skeleton.js
└── xlsx/                             ← Ewaantech XLSX builder bundle
    ├── INSTRUCTIONS.md               ← workflow, four archetypes, status-pill mapping
    ├── references/                   ← brand-system
    └── scripts/                      ← lib.py, build_skeleton.py
```

Each sub-skill is self-contained. None of them reads files from the others
— they only read from their own bundle, `/mnt/skills/public/<format>/SKILL.md`,
and the project's brand guideline PDF.

The DOCX bundle here uses the **new** template design (hexagonal top-left
flag + tapered bottom red strip + brand-red page numbers), not the older
red-flag template.

---

## Non-negotiables (inherited from every sub-skill)

These rules apply across PPT, DOC, and XLSX builds. Each sub-skill has
additional rules on top.

1. **Verbatim content.** Rebranding changes presentation, not wording. Never
   paraphrase, never "tidy", never summarize. Empty padding rows in tables
   and trailing blank rows are the only allowed drops.
2. **Always ask for the logo, and use only the user's.** Across PPT, DOC, and
   XLSX, ask for the logo before building — even if the project clearly has
   one, confirm once. Use only the logo the user supplies; never fall back to
   a bundled default. Different deliverables may carry different sub-brands.
3. **Logo aspect ratio is 5.09 : 1.** Original is 1568 × 308 px. Squashed
   logos are the most-flagged brand violation.
4. **Palette traceable to the brand PDF.** No gradients, no blues / greens /
   purples / yellows — even in data viz. Use tints of brand red, gold, and
   charcoal for charts.
5. **Gold (`#C1A068`) on dark backgrounds only.** Never on cream or white.
   The single most common brand-color violation.
6. **Logo placement.** Dark wordmark on light, white wordmark on dark.
   Never on photography without an 80%-opacity overlay. Never on a
   background matching its own color.
7. **Typography by format.**
   - PPTX: Cera Pro display, EB Garamond italic accents and big numerals,
     Calibri body, Noto Sans Arabic for Arabic.
   - DOCX: Calibri body, EB Garamond italic accents, Cera Pro for display
     where available.
   - XLSX: Calibri throughout (Cera Pro renders inconsistently in Excel).
8. **Visual QA before delivery.** Every PPT and DOC build converts to PDF
   and reviews each page; every XLSX build runs through `recalc.py` and
   renders to PDF for layout review. Skipping QA is how off-brand output
   ships.

---

## When to ask vs proceed

**Proceed without asking when:**
- The user named one of the three formats unambiguously in their current
  request.
- The user has already uploaded a source file of a matching type.
- The user has answered the format picker (you're past Step 2).

**Ask when:**
- The user said "brand this document" with no format clue.
- The user uploaded an ambiguous file (a `.pdf`, an image, a `.txt`
  description of what they want built).
- The user invoked the skill explicitly ("use the brand master") with no
  other detail.

Don't ask questions the brand guideline or the sub-skill INSTRUCTIONS
already answer (margins, palette values, logo specs, dimensions, etc.).
Look them up.

---

## Remember

This skill exists to give the user one front door for three validated
workflows. The picker is the user's choice; everything after the picker is
the same disciplined sub-skill that produced the approved Power BI deck,
the approved INTDC proposal (new template), and the approved UAT Findings
workbook. Don't downgrade the work because it's coming through the master
skill — the bar is the same.

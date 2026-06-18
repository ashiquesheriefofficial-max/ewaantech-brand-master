// lib.js — Ewaantech docx-js brand template library.
// Encodes the proposal-template design language: brand tokens, headers/footers
// with floating brand graphics, section title blocks, four table archetypes,
// callouts, and typography helpers.
//
// Required PNGs in the working directory (relative to the build script):
//   logo.png                    — dark wordmark, original aspect ratio
//   top_left_flag.png           — hexagonal flag (from make_graphics.py)
//   bottom_strip.png            — tapered red strip (from make_graphics.py)
// Optional (used if present):
//   logo_white.png              — white wordmark for dark sections
//   section_marker.png          — small red square fallback

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, PageBreak, HeightRule,
  TabStopType, TabStopPosition, SectionType, HorizontalPositionAlign,
  VerticalPositionAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom,
  TextWrappingType, TextWrappingSide,
} = require('docx');

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS — pulled from Corporate_Guideline_2026.pdf
// Always verify against the guideline fresh; this is a starting snapshot.
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  RED:        'CE202F', // primary red
  DARK_RED:   'AC1F24',
  BLACK:      '221E1F', // near-black
  CHARCOAL:   '242424',
  GREY_TITLE: '727272', // proposal-template title light grey
  GREY_BODY:  '4A4A4A',
  CREAM:      'EFEBE3',
  WHITE:      'FFFFFF',
  GOLD:       'C1A068',
};

// Page geometry — A4 portrait (matches proposal template)
const PAGE_W = 11906; // DXA
const PAGE_H = 16838;
const MARGIN_TOP    = 1700;
const MARGIN_BOTTOM = 1300;
const MARGIN_LEFT   = 1700;
const MARGIN_RIGHT  = 1000;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;

// Read brand images. Logo, the top flag, and bottom strip are required;
// logo_white and section_marker are optional fallbacks for special layouts.
function readIfExists(path) {
  return fs.existsSync(path) ? fs.readFileSync(path) : null;
}
const logo       = fs.readFileSync('logo.png');
const topFlag    = fs.readFileSync('top_left_flag.png');
const strip      = fs.readFileSync('bottom_strip.png');
const logoWhite  = readIfExists('logo_white.png');
const sectionMk  = readIfExists('section_marker.png');

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Calibri body run
function body(text, opts = {}) {
  return new TextRun({
    text,
    font: 'Calibri',
    size: opts.size ?? 22,   // 11pt default for tighter long doc
    bold: opts.bold ?? false,
    italics: opts.italics ?? false,
    color: opts.color ?? C.BLACK,
    break: opts.break ?? 0,
  });
}
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 100, line: 290 },
    alignment: opts.align,
    children: Array.isArray(text) ? text : [body(text, opts)],
  });
}
function blank(after = 100) {
  return new Paragraph({ spacing: { after }, children: [new TextRun('')] });
}

// Section-title block (light grey "EYEBROW" + bold black headline, mimics proposal template)
// pageBreakBefore: true on the first paragraph to start each section cleanly on its own page
function sectionTitleBlock(eyebrow, headline, opts = {}) {
  return [
    new Paragraph({
      spacing: { before: 0, after: 80, line: 320 },
      pageBreakBefore: opts.pageBreakBefore !== false,
      children: [
        new TextRun({ text: eyebrow, font: 'Calibri', size: 36, color: C.GREY_TITLE, characterSpacing: 40 }),
      ],
    }),
    new Paragraph({
      spacing: { before: 0, after: 420, line: 320 },
      children: [
        new TextRun({ text: headline, font: 'Calibri', size: 48, bold: true, color: C.BLACK }),
      ],
    }),
  ];
}

// H2 — sub-section heading (e.g. "1.1 What Is Being Built")
function h2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 120, line: 280 },
    children: [
      new TextRun({ text, font: 'Calibri', size: 26, bold: true, color: C.BLACK }),
    ],
  });
}
// H3 — for "List View", "Detail View" etc.
function h3(text) {
  return new Paragraph({
    spacing: { before: 180, after: 80, line: 280 },
    children: [
      new TextRun({ text, font: 'Calibri', size: 23, bold: true, color: C.DARK_RED }),
    ],
  });
}

// Bullet list — uses bullets numbering reference
function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 30, after: 30, line: 280 },
    children: [body(text)],
  });
}

// Cell rule borders & padding — used by both labelValueTable and brandTable.
const cellPad = { top: 100, bottom: 100, left: 140, right: 140 };
const rule = { style: BorderStyle.SINGLE, size: 4, color: 'D9D9D9' };
const ruleBorders = { top: rule, bottom: rule, left: rule, right: rule };

// Borderless label / value table — no red header row.
// First column is bold black on cream, second column regular on white.
function labelValueTable(rows) {
  const cols = [Math.round(CONTENT_W * 0.32), CONTENT_W - Math.round(CONTENT_W * 0.32)];
  const tableRows = rows.map((row, rIdx) => new TableRow({
    cantSplit: true,
    children: row.map((cell, cIdx) => new TableCell({
      width: { size: cols[cIdx], type: WidthType.DXA },
      shading: { fill: cIdx === 0 ? C.CREAM : C.WHITE, type: ShadingType.CLEAR },
      margins: cellPad,
      borders: ruleBorders,
      verticalAlign: VerticalAlign.CENTER,
      children: [new Paragraph({
        spacing: { before: 0, after: 0, line: 260 },
        children: [new TextRun({
          text: cell,
          font: 'Calibri',
          size: 21,
          bold: cIdx === 0,
          color: C.BLACK,
        })],
      })],
    })),
  }));
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: cols,
    rows: tableRows,
  });
}

function brandTable(headers, rows, columnWidthsPct) {
  // columnWidthsPct: array summing to 100, e.g. [25,75]
  const pct = columnWidthsPct ?? new Array(headers.length).fill(100 / headers.length);
  const cols = pct.map(x => Math.round(CONTENT_W * x / 100));
  // adjust last col so they sum exactly
  const diff = CONTENT_W - cols.reduce((a, b) => a + b, 0);
  cols[cols.length - 1] += diff;

  const headerCells = headers.map((h, i) => new TableCell({
    width: { size: cols[i], type: WidthType.DXA },
    shading: { fill: C.RED, type: ShadingType.CLEAR },
    margins: cellPad,
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 4, color: C.RED },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: C.RED },
      left:   { style: BorderStyle.SINGLE, size: 4, color: C.RED },
      right:  { style: BorderStyle.SINGLE, size: 4, color: C.RED },
    },
    children: [
      new Paragraph({
        spacing: { before: 0, after: 0, line: 260 },
        children: [
          new TextRun({ text: h, font: 'Calibri', size: 21, bold: true, color: C.WHITE }),
        ],
      }),
    ],
  }));

  const bodyRows = rows.map((row, rIdx) => new TableRow({
    cantSplit: true,
    children: row.map((cell, cIdx) => {
      const isAlt = rIdx % 2 === 1;
      // cell may be a string OR { text, bold, color }
      const children = Array.isArray(cell)
        ? cell.map(seg => new Paragraph({
            spacing: { before: 0, after: 30, line: 260 },
            children: [new TextRun({
              text: seg.text,
              font: 'Calibri',
              size: 20,
              bold: !!seg.bold,
              italics: !!seg.italics,
              color: seg.color || C.BLACK,
            })],
          }))
        : [new Paragraph({
            spacing: { before: 0, after: 0, line: 260 },
            children: [new TextRun({
              text: typeof cell === 'string' ? cell : cell.text,
              font: 'Calibri',
              size: 20,
              bold: typeof cell === 'object' ? !!cell.bold : false,
              color: typeof cell === 'object' ? (cell.color || C.BLACK) : C.BLACK,
            })],
          })];
      return new TableCell({
        width: { size: cols[cIdx], type: WidthType.DXA },
        shading: { fill: isAlt ? C.CREAM : C.WHITE, type: ShadingType.CLEAR },
        margins: cellPad,
        borders: ruleBorders,
        verticalAlign: VerticalAlign.CENTER,
        children,
      });
    }),
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: cols,
    rows: [new TableRow({ tableHeader: true, children: headerCells }), ...bodyRows],
  });
}

// Callout box — for "Purpose of This Document", "The Two Flows", etc.
// Cream background with a thick red left border and a bold red title.
function callout(title, lines) {
  const inner = [
    new Paragraph({
      spacing: { before: 0, after: 100, line: 280 },
      children: [
        new TextRun({ text: title, font: 'Calibri', size: 23, bold: true, color: C.RED }),
      ],
    }),
    ...lines.map(line => new Paragraph({
      spacing: { before: 0, after: 60, line: 280 },
      children: [new TextRun({ text: line, font: 'Calibri', size: 21, color: C.BLACK })],
    })),
  ];

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill: C.CREAM, type: ShadingType.CLEAR },
            margins: { top: 200, bottom: 200, left: 280, right: 240 },
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 4, color: C.CREAM },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: C.CREAM },
              left:   { style: BorderStyle.SINGLE, size: 36, color: C.RED },
              right:  { style: BorderStyle.SINGLE, size: 4, color: C.CREAM },
            },
            children: inner,
          }),
        ],
      }),
    ],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// HEADERS & FOOTERS
// ─────────────────────────────────────────────────────────────────────────────

// Logo anchored to top-right of page (used on every page including cover).
// Aspect ratio fixed at the original 5.09:1 (1568x308 source).
function logoFloater() {
  return new ImageRun({
    data: logo,
    type: 'png',
    transformation: { width: 165, height: 32 },  // 5.09:1 — original ratio
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 5300000 },
      verticalPosition:   { relative: VerticalPositionRelativeFrom.PAGE, offset: 540000 },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: false,
    },
  });
}

// Top-left red flag (hexagonal — left edge full-height, both right corners
// chamfered). Same shape on cover and content pages; content version is
// shortened so it doesn't overlap the section title block.
// Source PNG: 60 × 303 px. EMU sizing in docx-js uses 9525 EMU per pixel.
function coverTopFlag() {
  return new ImageRun({
    data: topFlag,
    type: 'png',
    transformation: { width: 42, height: 212 },   // ~0.58 × 2.92 in — matches reference doc
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition:   { relative: VerticalPositionRelativeFrom.PAGE,  offset: 0 },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: true,
    },
  });
}

// Content-page top flag — slightly shorter so the section title block clears it
function contentTopFlag() {
  return new ImageRun({
    data: topFlag,
    type: 'png',
    transformation: { width: 38, height: 150 },
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 0 },
      verticalPosition:   { relative: VerticalPositionRelativeFrom.PAGE,  offset: 0 },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: true,
    },
  });
}

// Bottom red strip — tapered to a point at both ends, runs nearly full-width
// just above the page foot. Per reference doc: ~8.5 in wide, ~0.087 in tall,
// inset ~0.04 in from the page-left edge so the left taper is visible.
function bottomStrip() {
  return new ImageRun({
    data: strip,
    type: 'png',
    transformation: { width: 820, height: 8 },
    floating: {
      horizontalPosition: { relative: HorizontalPositionRelativeFrom.PAGE, offset: 38100 },
      verticalPosition:   { relative: VerticalPositionRelativeFrom.PAGE, offset: 10622280 },
      wrap: { type: TextWrappingType.NONE },
      behindDocument: false,
    },
  });
}

// Build header for cover page — flag + logo only. The earlier design had a
// bottom-right corner triangle; the revised design removes it.
const coverHeader = new Header({
  children: [new Paragraph({ children: [coverTopFlag(), logoFloater()] })],
});
// Footer for cover (red strip only — no page number)
const coverFooter = new Footer({
  children: [new Paragraph({ children: [bottomStrip()] })],
});

// Content header — short red flag + logo
const contentHeader = new Header({
  children: [new Paragraph({ children: [contentTopFlag(), logoFloater()] })],
});

// Content footer — red strip + page number (red, right-aligned)
const contentFooter = new Footer({
  children: [
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 0, after: 0 },
      children: [
        new TextRun({ children: [PageNumber.CURRENT], font: 'Calibri', size: 20, bold: true, color: C.RED }),
        bottomStrip(),
      ],
    }),
  ],
});

// ─────────────────────────────────────────────────────────────────────────────
// COVER PAGE BUILDER
// Pass a config object describing the cover. All fields optional except `title`.
//
//   title        — main display title (string, rendered very large bold)
//   subtitle     — grey supporting line below the title
//   accent       — EB Garamond italic accent line in brand red (optional)
//   meta         — array of {label, value} pairs (e.g. PREPARED FOR / CLASSIFICATION)
//   contactLine  — array of strings to render at the foot (e.g. phone/email/site)
// ─────────────────────────────────────────────────────────────────────────────
function makeCover({ title, subtitle = '', accent = '', meta = [], contactLine = [] }) {
  const children = [
    new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: '', size: 4 })] }),
    new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ break: 10, text: '' })] }),
    new Paragraph({
      spacing: { before: 0, after: 240, line: 380 },
      children: [new TextRun({ text: title, font: 'Calibri', size: 96, bold: true, color: C.BLACK })],
    }),
  ];
  if (subtitle) {
    children.push(new Paragraph({
      spacing: { before: 0, after: 180, line: 320 },
      children: [new TextRun({ text: subtitle, font: 'Calibri', size: 36, bold: true, color: C.GREY_TITLE })],
    }));
  }
  if (accent) {
    children.push(new Paragraph({
      spacing: { before: 0, after: 360, line: 320 },
      children: [new TextRun({ text: accent, font: 'EB Garamond', size: 28, italics: true, color: C.RED })],
    }));
  }
  for (const { label, value } of meta) {
    children.push(new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: label, font: 'Calibri', size: 24, bold: true, color: C.BLACK })],
    }));
    children.push(new Paragraph({
      spacing: { before: 0, after: 60 },
      children: [new TextRun({ text: value, font: 'Calibri', size: 22, color: C.GREY_BODY })],
    }));
    children.push(blank(120));
  }
  // Push contact line to the foot of the page
  if (contactLine.length) {
    children.push(new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ break: 14, text: '' })] }));
    children.push(new Paragraph({
      spacing: { before: 0, after: 80, line: 280 },
      children: contactLine.map((s, i) => new TextRun({
        text: i > 0 ? '       ' + s : s,
        font: 'Calibri', size: 20, color: C.BLACK,
      })),
    }));
    children.push(new Paragraph({
      spacing: { before: 0, after: 0 },
      border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.BLACK, space: 6 } },
      children: [new TextRun({ text: '', size: 4 })],
    }));
  }
  return children;
}

module.exports = {
  Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType,
  PageOrientation, LevelFormat, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak, SectionType, HorizontalPositionRelativeFrom,
  VerticalPositionRelativeFrom, TextWrappingType,
  C, PAGE_W, PAGE_H, MARGIN_TOP, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT, CONTENT_W,
  body, p, blank, sectionTitleBlock, h2, h3, bullet, brandTable, labelValueTable, callout,
  coverHeader, coverFooter, contentHeader, contentFooter, makeCover,
};

// build_skeleton.js — assemble a branded Ewaantech .docx from a parsed source.
// Clone, fill in cover meta + node→element handling, ship.
//
// Expected working directory layout:
//   ./logo.png                — user-supplied brand logo (always ask for this)
//   ./top_left_flag.png       — from make_graphics.py
//   ./bottom_right_triangle.png
//   ./bottom_strip.png
//   ./content.json            — from parse_docx.py
//   ./lib.js                  — from this skill
//
// Run with:
//   NODE_PATH=$(npm root -g) node build_skeleton.js

const fs = require('fs');
const L = require('./lib.js');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat, PageBreak,
  BorderStyle, SectionType, PageOrientation,
  C, PAGE_W, PAGE_H, MARGIN_TOP, MARGIN_BOTTOM, MARGIN_LEFT, MARGIN_RIGHT, CONTENT_W,
  body, p, blank, sectionTitleBlock, h2, h3, bullet, brandTable, labelValueTable, callout,
  coverHeader, coverFooter, contentHeader, contentFooter, makeCover,
} = L;

// ─── Load the parsed source ─────────────────────────────────────────────────
const nodes = JSON.parse(fs.readFileSync('./content.json', 'utf8'));

// ─── Helpers ────────────────────────────────────────────────────────────────
function nodeText(n) { return (n.text || '').replace(/\u00A0/g, ' ').trim(); }

function cellTextOf(cell) {
  return cell.map(par => par.runs.map(r => r.text).join('')).filter(Boolean).join(' ').trim();
}
function cellLinesOf(cell) {
  return cell.map(par => par.runs.map(r => r.text).join('')).filter(s => s.length > 0);
}

// Render a paragraph honouring inline bold/italic runs
function p_runs(node, opts = {}) {
  const runs = node.runs || [];
  const children = runs.length
    ? runs.map(r => new TextRun({
        text: r.text, font: 'Calibri', size: opts.size ?? 22,
        bold: !!r.bold, italics: !!r.italic, color: opts.color ?? C.BLACK,
      }))
    : [new TextRun('')];
  return new Paragraph({
    spacing: { before: opts.before ?? 0, after: opts.after ?? 100, line: 290 },
    alignment: opts.align, children,
  });
}

function bullet_plain(node, level = 0) {
  const text = (node.runs || []).map(r => r.text).join('');
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { before: 30, after: 30, line: 280 },
    children: [new TextRun({ text, font: 'Calibri', size: 22, color: C.BLACK })],
  });
}

// 1×2 table where cell 0 is empty (the visual red panel) and cell 1 holds
// title + body — the source authoring pattern for callouts.
function isCallout(tbl) {
  return tbl.rows.length === 1 && tbl.rows[0].length === 2;
}
function calloutFromTable(tbl) {
  const c1 = tbl.rows[0][1];
  const lines = cellLinesOf(c1);
  return callout(lines[0] || '', lines.slice(1));
}

// Heuristic: table where col 0 looks like a label series → labelValueTable
function looksLikeLabelValue(tbl) {
  if (tbl.rows.length < 2 || tbl.rows[0].length !== 2) return false;
  // If the first cell of every row is short (< 30 chars) and ends without
  // punctuation, treat it as labels.
  return tbl.rows.every(r => {
    const t = cellTextOf(r[0]);
    return t.length > 0 && t.length < 30 && !/[.!?]$/.test(t);
  });
}

function tableFromNode(tbl) {
  if (!tbl.rows.length) return null;
  if (looksLikeLabelValue(tbl)) {
    return labelValueTable(tbl.rows.map(r => r.map(cellTextOf)));
  }
  const headers = tbl.rows[0].map(cellTextOf);
  const dataRows = tbl.rows.slice(1)
    .map(r => r.map(cellTextOf))
    .filter(r => r.some(c => c && c.length > 0));   // drop empty padding rows
  const cols = headers.length;
  // Width heuristics — tweak per-doc if needed
  let widths;
  if (cols === 2)      widths = [30, 70];
  else if (cols === 3) widths = [10, 35, 55];
  else if (cols === 4) widths = [10, 50, 22, 18];
  else                 widths = new Array(cols).fill(100 / cols);
  return brandTable(headers, dataRows, widths);
}

// ─── Walk the parsed source and emit branded content ────────────────────────
// REPLACE this section with your source-specific logic. The example below
// covers the common pattern: paragraphs styled Heading1/2/3, ListParagraph
// bullets, and tables.
const contentBody = [];
let firstSectionTitleEmitted = false;

// Optional manual first-section title — if your source doesn't have a
// "DOCUMENT INFORMATION" heading, you may want one for cover continuity.
//
// contentBody.push(...sectionTitleBlock('DOCUMENT', 'INFORMATION',
//                                      { pageBreakBefore: false }));

for (const node of nodes) {
  if (node.type === 'table') {
    if (isCallout(node)) {
      contentBody.push(calloutFromTable(node));
    } else {
      const tbl = tableFromNode(node);
      if (tbl) contentBody.push(tbl);
    }
    contentBody.push(blank(160));
    continue;
  }
  // node.type === 'p'
  const text = nodeText(node);
  if (!text) continue;

  const style = node.style;
  if (style === 'Heading1') {
    // Split "1. Overview" → eyebrow "SECTION 01" + headline "OVERVIEW"
    const m = text.match(/^(\d+)\.\s*(.+)$/);
    const eyebrow  = m ? `SECTION ${m[1].padStart(2, '0')}` : '';
    const headline = m ? m[2].toUpperCase() : text.toUpperCase();
    contentBody.push(...sectionTitleBlock(eyebrow, headline, {
      pageBreakBefore: firstSectionTitleEmitted,
    }));
    firstSectionTitleEmitted = true;
    continue;
  }
  if (style === 'Heading2') { contentBody.push(h2(text)); continue; }
  if (style === 'Heading3') { contentBody.push(h3(text)); continue; }
  if (node.list_lvl !== null) {
    contentBody.push(bullet_plain(node, node.list_lvl || 0));
    continue;
  }
  contentBody.push(p_runs(node));
}

// ─── Cover page ─────────────────────────────────────────────────────────────
// Fill these in from the source content or ask the user. Always ask before
// inventing values for PREPARED FOR / CLASSIFICATION fields.
const coverChildren = makeCover({
  title:    'TITLE',
  subtitle: 'Subtitle goes here',
  accent:   'Optional italic accent line',
  meta: [
    { label: 'PREPARED FOR',   value: 'Recipient name' },
    { label: 'CLASSIFICATION', value: 'Confidential — Internal Use Only' },
  ],
  contactLine: [
    '☎  +971 55 691 45 24',
    '✉  info@ewaantech.com',
    '🔗  ewaantech.com',
  ],
});

// ─── Assemble ───────────────────────────────────────────────────────────────
const doc = new Document({
  creator: 'Ewaantech',
  title: 'Document title',
  description: 'Description',
  styles: { default: { document: { run: { font: 'Calibri', size: 22 } } } },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 240 } },
                     run: { font: 'Calibri', color: C.RED } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 780, hanging: 240 } },
                     run: { font: 'Calibri', color: C.RED } } },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: 1600, right: 1100, bottom: 1100, left: 1600 },
        },
      },
      headers: { default: coverHeader },
      footers: { default: coverFooter },
      children: coverChildren,
    },
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: PAGE_W, height: PAGE_H, orientation: PageOrientation.PORTRAIT },
          margin: { top: MARGIN_TOP, right: MARGIN_RIGHT, bottom: MARGIN_BOTTOM, left: MARGIN_LEFT },
          pageNumbers: { start: 1 },
        },
      },
      headers: { default: contentHeader },
      footers: { default: contentFooter },
      children: contentBody,
    },
  ],
});

const OUT = './Ewaantech_Document.docx';   // rename per project convention
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(OUT, buf);
  console.log(`Wrote ${OUT} (${buf.length} bytes)`);
});

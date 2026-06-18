// Ewaantech PPT build skeleton — clone this file and fill in the slides.
// Validated with pptxgenjs@4.0.1, react-icons@5.6.0, sharp@0.34.5.
//
//   NODE_PATH=$(npm root -g) node build.js
//
// Logo paths expect logo-dark.png and logo-white.png in the working directory.
// Use ONLY the logo the user supplied (see INSTRUCTIONS Step 1 & 4) — copy it
// in under those filenames:
//   cp <path-to-user-dark-logo>  ./logo-dark.png
//   cp <path-to-user-white-logo> ./logo-white.png
// Do NOT use the bundled assets/logo-*.png samples in output.
// Then update LOGO_DARK / LOGO_WHITE below to match where you placed them.

const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// Common icon imports. Add more as needed.
// NOTE: react-icons/si does NOT include Microsoft product icons for licensing
// reasons. Use FontAwesome (Fa*) or Bootstrap (Bs*) stand-ins instead.
const {
  FaFileExcel, FaFileCsv, FaServer, FaFolderOpen,
  FaChartBar, FaChartPie, FaUsers, FaBriefcase,
  FaCheckCircle, FaArrowRight, FaFilter, FaLink,
  FaEdit, FaBroom,
} = require("react-icons/fa");
const { BsCloudFill } = require("react-icons/bs");

// ── Brand tokens (from brand-system.md) ───────────────────
const C = {
  red:        "CE202F",
  darkRed:    "AC1F24",
  nearBlack:  "221E1F",
  gold:       "C1A068",
  charcoal:   "242424",
  cream:      "EFEBE3",
  white:      "FFFFFF",
  gray:       "727272",
  lightGray:  "E6E6E6",
};

const F = {
  display: "Cera Pro",      // headlines, titles
  body:    "EB Garamond",   // italic editorial, big numerals
  ui:      "Calibri",       // body, UI labels, captions
  arabic:  "Noto Sans Arabic",
};

// ── Logo paths (adjust if your working dir differs) ───────
const LOGO_DARK  = "./logo-dark.png";   // on light bg — user-supplied logo
const LOGO_WHITE = "./logo-white.png";  // on dark bg  — user-supplied logo

// ── Shadow factories (NEW OBJECT PER CALL — don't share!) ─
// pptxgenjs mutates shadow options in place; sharing a single const
// between shapes corrupts the second shape.
const makeSoftShadow = () => ({
  type: "outer", blur: 12, offset: 2, angle: 90,
  color: "000000", opacity: 0.08,
});
const makeCardShadow = () => ({
  type: "outer", blur: 18, offset: 3, angle: 90,
  color: "000000", opacity: 0.12,
});

// ── Icon helper: react-icons → base64 PNG ─────────────────
async function icon(IconComponent, color = C.red, size = 256) {
  const hex = color.startsWith("#") ? color : "#" + color;
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color: hex, size: String(size) })
  );
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + png.toString("base64");
}

// ── Main build ────────────────────────────────────────────
(async () => {
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_WIDE";   // 13.33 × 7.5 in — always this
  pres.title   = "Ewaantech Deck";
  pres.author  = "Ewaantech";
  pres.company = "Ewaantech";

  const W = 13.33;
  const H = 7.5;

  // Pre-rasterize every icon you'll use up front.
  const ic = {
    excel:  await icon(FaFileExcel,  C.red),
    csv:    await icon(FaFileCsv,    C.red),
    // add more here...
    check:      await icon(FaCheckCircle,  C.red),
    checkWhite: await icon(FaCheckCircle,  C.white),
    arrow:      await icon(FaArrowRight,   C.red),
  };

  // ╔══════════════════════════════════════════════════════╗
  // ║ Helper: content-slide header (logo + section label)  ║
  // ╚══════════════════════════════════════════════════════╝
  function header(slide, sectionLabel) {
    slide.addImage({ path: LOGO_DARK, x: 0.6, y: 0.45, w: 1.35, h: 0.266 });
    slide.addText(sectionLabel, {
      x: W - 4.5, y: 0.48, w: 3.9, h: 0.3,
      fontFace: F.ui, fontSize: 10, bold: true, color: C.red,
      charSpacing: 5, align: "right", margin: 0,
    });
    slide.addShape(pres.shapes.LINE, {
      x: 0.6, y: 0.95, w: W - 1.2, h: 0,
      line: { color: C.lightGray, width: 0.75 },
    });
  }

  function footer(slide, pageNum) {
    slide.addText("BRAND IDENTITY 2026  ·  EWAANTECH", {
      x: 0.6, y: 7.15, w: 6, h: 0.3,
      fontFace: F.ui, fontSize: 8, color: C.gray,
      charSpacing: 3, margin: 0,
    });
    slide.addText(String(pageNum).padStart(2, "0"), {
      x: W - 1.1, y: 7.15, w: 0.5, h: 0.3,
      fontFace: F.ui, fontSize: 9, color: C.gray,
      align: "right", margin: 0,
    });
  }

  // ╔══════════════════════════════════════════════════════╗
  // ║ SLIDE 1 — Dark cover (Pattern 1)                     ║
  // ╚══════════════════════════════════════════════════════╝
  {
    const s = pres.addSlide();
    s.background = { color: C.nearBlack };

    // Red chevron motif (right side)
    s.addShape(pres.shapes.RIGHT_TRIANGLE, {
      x: 9.2, y: 0, w: 4.2, h: 7.5,
      fill: { color: C.darkRed }, line: { color: C.darkRed }, flipH: true,
    });
    s.addShape(pres.shapes.RIGHT_TRIANGLE, {
      x: 10.6, y: 0, w: 2.8, h: 7.5,
      fill: { color: C.red }, line: { color: C.red }, flipH: true,
    });

    s.addImage({ path: LOGO_WHITE, x: 0.6, y: 0.55, w: 1.9, h: 0.375 });

    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 2.4, w: 0.6, h: 0.05,
      fill: { color: C.red }, line: { color: C.red },
    });
    s.addText("EYEBROW LABEL · YEAR", {
      x: 0.6, y: 2.55, w: 8, h: 0.35,
      fontFace: F.ui, fontSize: 11, bold: true, color: C.gold,
      charSpacing: 6, margin: 0,
    });

    s.addText("Deck Title\nGoes Here", {
      x: 0.6, y: 3.0, w: 8.5, h: 2.4,
      fontFace: F.display, fontSize: 60, bold: true, color: C.white,
      lineSpacingMultiple: 1.0, margin: 0,
    });

    s.addText("One-line italic subtitle in EB Garamond", {
      x: 0.6, y: 5.5, w: 8.5, h: 0.6,
      fontFace: F.body, fontSize: 20, italic: true, color: C.cream,
      margin: 0,
    });

    s.addText("EWAANTECH  ·  ewaantech.com", {
      x: 0.6, y: 6.85, w: 6, h: 0.35,
      fontFace: F.ui, fontSize: 9, bold: true, color: C.gold,
      charSpacing: 4, margin: 0,
    });
    s.addText("01", {
      x: 12.4, y: 6.85, w: 0.5, h: 0.35,
      fontFace: F.ui, fontSize: 10, color: C.gold,
      align: "right", margin: 0,
    });
  }

  // ╔══════════════════════════════════════════════════════╗
  // ║ SLIDE 2 — Example content slide (Pattern 2)          ║
  // ╚══════════════════════════════════════════════════════╝
  {
    const s = pres.addSlide();
    s.background = { color: C.white };
    header(s, "01  ·  SECTION LABEL");

    // Left column: italic numeral + title + supporting copy
    s.addText("01", {
      x: 0.6, y: 1.3, w: 1.5, h: 0.9,
      fontFace: F.body, fontSize: 72, italic: true, color: C.red, margin: 0,
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.6, y: 2.35, w: 0.6, h: 0.05,
      fill: { color: C.red }, line: { color: C.red },
    });
    s.addText("Section\nTitle", {
      x: 0.6, y: 2.55, w: 5.5, h: 2.0,
      fontFace: F.display, fontSize: 44, bold: true, color: C.nearBlack,
      lineSpacingMultiple: 1.0, margin: 0,
    });
    s.addText("Editorial supporting copy in EB Garamond italic...", {
      x: 0.6, y: 5.0, w: 5.4, h: 1.6,
      fontFace: F.body, fontSize: 16, italic: true, color: C.gray,
      lineSpacingMultiple: 1.25, margin: 0,
    });

    // Right column: 5 stacked number-card bullets
    const bullets = [
      "Bullet one.",
      "Bullet two.",
      "Bullet three.",
      "Bullet four.",
      "Bullet five.",
    ];
    const colX = 6.7, colW = 6.1, startY = 1.3, rowH = 1.03, gap = 0.12;

    bullets.forEach((t, i) => {
      const y = startY + i * (rowH + gap);
      // Red number pill
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX, y, w: 0.75, h: rowH,
        fill: { color: C.red }, line: { color: C.red },
      });
      s.addText(String(i + 1).padStart(2, "0"), {
        x: colX, y, w: 0.75, h: rowH,
        fontFace: F.display, fontSize: 22, bold: true,
        color: C.white, align: "center", valign: "middle", margin: 0,
      });
      // Cream body card
      s.addShape(pres.shapes.RECTANGLE, {
        x: colX + 0.75, y, w: colW - 0.75, h: rowH,
        fill: { color: C.cream }, line: { type: "none" },
      });
      s.addText(t, {
        x: colX + 0.95, y: y + 0.05, w: colW - 0.95, h: rowH - 0.1,
        fontFace: F.ui, fontSize: 14, color: C.nearBlack,
        valign: "middle", margin: 0,
      });
    });

    footer(s, 2);
  }

  // Add more slides below using patterns 3, 4, 5 from slide-patterns.md.

  await pres.writeFile({ fileName: "Ewaantech_Deck.pptx" });
  console.log("✅ Written: Ewaantech_Deck.pptx");
})();

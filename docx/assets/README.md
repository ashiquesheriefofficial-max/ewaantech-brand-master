# Assets

## `bottom_strip.png`

A hand-crafted vector PNG of the brand bottom strip — the thin tapered red bar that sits just above the page foot on every page of the proposal template.

| Spec | Value |
|---|---|
| Source resolution | 1640 × 16 px |
| Aspect ratio | 102.5 : 1 |
| Shape | Trapezoid — flat bottom, top edge tapers to a single-pixel point at each end |
| Fill | Brand red `#CE202F` |
| Display size in docx | 820 × 8 px (~8.54 × 0.083 in) |

To use, copy into your working directory before the build:

```bash
cp $SKILL_PATH/assets/bottom_strip.png /home/claude/work/
```

`lib.js` reads `bottom_strip.png` from the working directory at build time. If you ever need to regenerate this strip from scratch (e.g. for a brand-red palette change), there's a `make_bottom_strip()` function preserved in `scripts/make_graphics.py` that produces the same geometry.

To swap in a different strip design, just replace this file. Match the aspect ratio if you want a drop-in (no `lib.js` changes); otherwise also adjust the `transformation: { width, height }` in `bottomStrip()` inside `scripts/lib.js`.

## Logo — not bundled

**No logo files are bundled in this skill — by design.**

The skill's first instruction is to always ask the user for the brand logo before building. Bundling a logo would tempt Claude to skip that step. Different documents may carry:

- A different sub-brand (e.g., a partner co-mark for a joint proposal)
- A special-edition variant
- The white wordmark for a darker-themed doc

So at build time the user shares the logo (or confirms which one in the project to use), and Claude copies it into the working directory as `logo.png`. Then `make_graphics.py` runs alongside it to produce the flag, and `bottom_strip.png` is copied in from this `assets/` folder.

If your build needs `logo_white.png` (the white wordmark for dark sections), drop it in the working directory alongside `logo.png`; `lib.js` will pick it up automatically.

"""Generate the Ewaantech proposal-template brand graphic PNGs (revised 2026).

Run once in your working directory before each build:

    python3 make_graphics.py

Outputs:
    top_left_flag.png   — hexagonal flag (left edge full-height, both right corners chamfered)
    section_marker.png  — small red square (fallback for layouts that suppress the flag)

Note: bottom_strip.png is NOT generated here — it ships as a bundled asset
at `assets/bottom_strip.png` (a hand-crafted vector strip). Copy it into the
working directory before the build, e.g.:

    cp $SKILL_PATH/assets/bottom_strip.png .

If the brand strip ever needs regenerating from scratch, see the
`make_bottom_strip()` function preserved at the bottom of this file.

Brand red is read from a single constant — update it (and references/brand-system.md)
if the brand palette evolves.
"""
from PIL import Image, ImageDraw

# Brand red — primary, per Corporate_Guideline_2026.pdf
RED         = (206, 32, 47, 255)    # #CE202F
TRANSPARENT = (0, 0, 0, 0)


def make_top_left_flag(width=60, height=303, angle_depth=60,
                       out="top_left_flag.png"):
    """Hexagonal red flag — bleeds from the page top-left.

    Shape: the LEFT edge runs the full height (0 to height). The RIGHT edge
    is shorter, with the TOP-RIGHT and BOTTOM-RIGHT corners chamfered with
    diagonal cuts. `angle_depth` controls how far inward the chamfers reach.

    Polygon vertices (clockwise):
        (0, 0)                          - top-left point
        (width, angle_depth)            - end of top chamfer
        (width, height - angle_depth)   - start of bottom chamfer
        (0, height)                     - bottom-left point
    """
    img = Image.new("RGBA", (width, height), TRANSPARENT)
    d = ImageDraw.Draw(img)
    points = [
        (0, 0),
        (width, angle_depth),
        (width, height - angle_depth),
        (0, height),
    ]
    d.polygon(points, fill=RED)
    img.save(out)


def make_section_marker(width=70, height=200, out="section_marker.png"):
    """Small red square - fallback for layouts that suppress the top-left flag."""
    img = Image.new("RGBA", (width, height), RED)
    img.save(out)


def make_bottom_strip(width=1640, height=16, taper=15, out="bottom_strip.png"):
    """Preserved for reference - re-generates the tapered strip if the bundled
    asset is ever unavailable. Not called from __main__ by default; the
    standard workflow uses the bundled asset at assets/bottom_strip.png.
    """
    img = Image.new("RGBA", (width, height), TRANSPARENT)
    d = ImageDraw.Draw(img)
    points = [
        (0, height - 1),
        (taper, 0),
        (width - taper, 0),
        (width - 1, height - 1),
    ]
    d.polygon(points, fill=RED)
    img.save(out)


if __name__ == "__main__":
    make_top_left_flag()
    make_section_marker()
    print("Generated: top_left_flag.png, section_marker.png")
    print("Note: copy bottom_strip.png from $SKILL_PATH/assets/ into the working dir.")

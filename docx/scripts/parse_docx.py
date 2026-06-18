"""Parse a .docx file into a structured JSON content tree.

Usage:
    python3 parse_docx.py <source.docx> > content.json

Output is a list of nodes:
    {"type": "p",  "style": "Heading1|Heading2|Heading3|Normal|null",
                   "list_lvl": 0|1|null, "runs": [...], "text": "..."}
    {"type": "table", "rows": [[ [cell_paragraphs], ... ], ...]}

Each run preserves bold/italic flags so the builder can decide whether to honour
them (intentional emphasis on a few items) or normalize them (wholesale source
artifacts across entire sections).

The point is to capture every word verbatim — the builder never paraphrases.
"""
import json
import sys
import xml.etree.ElementTree as ET
import zipfile

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
W = '{%s}' % NS['w']


def style_of(p):
    pPr = p.find(f'{W}pPr')
    if pPr is None:
        return None
    pStyle = pPr.find(f'{W}pStyle')
    if pStyle is None:
        return None
    return pStyle.get(f'{W}val')


def numpr_of(p):
    pPr = p.find(f'{W}pPr')
    if pPr is None:
        return None, None
    numPr = pPr.find(f'{W}numPr')
    if numPr is None:
        return None, None
    ilvl = numPr.find(f'{W}ilvl')
    numId = numPr.find(f'{W}numId')
    return (
        int(ilvl.get(f'{W}val')) if ilvl is not None else 0,
        int(numId.get(f'{W}val')) if numId is not None else None,
    )


def runs_of_paragraph(p):
    """Return ordered list of {text, bold, italic} for each run in the paragraph."""
    out = []
    for r in p.findall(f'.//{W}r'):
        rPr = r.find(f'{W}rPr')
        bold = False
        italic = False
        if rPr is not None:
            b = rPr.find(f'{W}b')
            i = rPr.find(f'{W}i')
            if b is not None and b.get(f'{W}val') != '0':
                bold = True
            if i is not None and i.get(f'{W}val') != '0':
                italic = True
        parts = []
        for child in r:
            tag = child.tag
            if tag == f'{W}t':
                parts.append(child.text or '')
            elif tag == f'{W}tab':
                parts.append('\t')
            elif tag == f'{W}br':
                parts.append('\n')
        text = ''.join(parts)
        if text:
            out.append({'text': text, 'bold': bold, 'italic': italic})
    return out


def parse_table(tbl):
    rows = []
    for tr in tbl.findall(f'{W}tr'):
        cells = []
        for tc in tr.findall(f'{W}tc'):
            cell_paras = []
            for p in tc.findall(f'{W}p'):
                runs = runs_of_paragraph(p)
                cell_paras.append({'runs': runs, 'list_lvl': None})
            cells.append(cell_paras)
        rows.append(cells)
    return rows


def parse_doc(path):
    with zipfile.ZipFile(path) as z:
        with z.open('word/document.xml') as f:
            tree = ET.parse(f)
    root = tree.getroot()
    body = root.find(f'{W}body')
    nodes = []
    for child in body:
        tag = child.tag
        if tag == f'{W}p':
            runs = runs_of_paragraph(child)
            style = style_of(child)
            ilvl, numId = numpr_of(child)
            text = ''.join(r['text'] for r in runs)
            nodes.append({
                'type': 'p',
                'style': style,
                'list_lvl': ilvl if numId else None,
                'runs': runs,
                'text': text,
            })
        elif tag == f'{W}tbl':
            nodes.append({'type': 'table', 'rows': parse_table(child)})
    return nodes


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 parse_docx.py <source.docx>", file=sys.stderr)
        sys.exit(1)
    nodes = parse_doc(sys.argv[1])
    print(json.dumps(nodes, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()

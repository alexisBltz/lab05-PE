from pathlib import Path
from hashlib import sha256
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.style import WD_STYLE_TYPE
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from PIL import Image

LAB = Path(__file__).resolve().parents[1]
TEMPLATE = LAB.parent / 'PLANTILLA.docx'
assert sha256(TEMPLATE.read_bytes()).hexdigest().upper() == '3113082634B297AFA12CBE8881752043FA3F2DF0D40A4273FB6411046D921895'
OUT = LAB / 'informe/LAB05_INFORME_FINAL.docx'
OUT.parent.mkdir(parents=True, exist_ok=True)
doc = Document(TEMPLATE)

def cell_text(cell, text, bold=False):
    cell.text = text
    for p in cell.paragraphs:
        p.paragraph_format.space_after = Pt(2)
        for r in p.runs: r.font.name = 'Arial'; r.font.size = Pt(9); r.bold = bold

t = doc.tables[0]
seen = set()
for row in t.rows:
    for cell in row.cells:
        if cell._tc in seen: continue
        seen.add(cell._tc)
        for p in cell.paragraphs:
            for r in p.runs: r.font.name = 'Arial'; r.font.size = Pt(9)
for r in t.cell(0,0).paragraphs[0].runs: r.font.size = Pt(11)
cell_text(t.cell(1, 1), 'Plataformas Emergentes (E)')
cell_text(t.cell(2, 1), 'Laboratorio 05 Aplicaciones Multiplataforma\nUniBudget Social para la organización financiera universitaria')
cell_text(t.cell(3, 1), '05')
cell_text(t.cell(3, 2), 'PERIODO GUÍA:', True)
cell_text(t.cell(3, 3), '2024B')
cell_text(t.cell(3, 5), 'No indicado')
cell_text(t.cell(4, 0), 'FECHA DE ELABORACIÓN:', True)
cell_text(t.cell(4, 1), '31/10/2026')
cell_text(t.cell(4, 3), 'No indicada')
cell_text(t.cell(5, 0), 'INTEGRANTE (s):\nMAMANI MAMANI, Alexis Baltazar', True)
cell_text(t.cell(5, 5), '')
cell_text(t.cell(6, 0), 'DOCENTE (s):\nM. Sc. Ing. R. Fabrizio Calienes Rodriguez')
body = doc._body._body
keep = {body[0], t._element}
for element in list(body):
    if element not in keep and element.tag != qn('w:sectPr'): body.remove(element)

normal = doc.styles['normal']
normal.font.name = 'Arial'; normal.font.size = Pt(10)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.15
for name, size in [('Heading 1', 12), ('Heading 2', 10.5)]:
    style = doc.styles[name]; style.font.name = 'Arial'; style.font.size = Pt(size); style.font.bold = True
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.space_before = Pt(12); style.paragraph_format.space_after = Pt(7)
    style.paragraph_format.keep_with_next = True
if 'Caption' not in [s.name for s in doc.styles]: doc.styles.add_style('Caption', WD_STYLE_TYPE.PARAGRAPH)
cap = doc.styles['Caption']; cap.font.name = 'Arial'; cap.font.size = Pt(8)
cap.paragraph_format.space_after = Pt(6); cap.paragraph_format.keep_with_next = True

def field(p, instruction, cached=''):
    r = p.add_run(); node = OxmlElement('w:fldChar'); node.set(qn('w:fldCharType'), 'begin'); r._r.append(node)
    node = OxmlElement('w:instrText'); node.set(qn('xml:space'), 'preserve'); node.text = instruction; r._r.append(node)
    node = OxmlElement('w:fldChar'); node.set(qn('w:fldCharType'), 'separate'); r._r.append(node)
    p.add_run(cached)
    r = p.add_run(); node = OxmlElement('w:fldChar'); node.set(qn('w:fldCharType'), 'end'); r._r.append(node)

def para(text=''):
    p = doc.add_paragraph(text, style='normal')
    p.paragraph_format.widow_control = True
    return p

def heading(text, level=1, toc=True):
    p = doc.add_paragraph(text, style=f'Heading {level}' if toc else 'normal')
    if level == 1:
        node = OxmlElement('w:shd'); node.set(qn('w:fill'), 'BF2F0C'); p._p.get_or_add_pPr().append(node)
        p.paragraph_format.left_indent = Cm(.15)
        p.paragraph_format.space_before = Pt(14); p.paragraph_format.space_after = Pt(9)
        p.paragraph_format.keep_with_next = True
        for r in p.runs: r.font.color.rgb = RGBColor(255,255,255); r.bold = True; r.font.size = Pt(12)
    return p

fig = 0
tab = 0
def caption(kind, title):
    global fig, tab
    if kind == 'Figura': fig += 1; number = fig
    else: tab += 1; number = tab
    p = doc.add_paragraph(style='Caption')
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER if kind == 'Figura' else WD_ALIGN_PARAGRAPH.LEFT
    p.add_run(kind + ' '); field(p, ' SEQ ' + kind + ' \\* ARABIC ', str(number)); p.add_run(' ' + title)
    return p

def picture(relative, title, explanation, width=16.5, height=12.5):
    file = LAB / relative
    with Image.open(file) as image: w,h = image.size
    scale = min(width/w, height/h)
    p = doc.add_paragraph(); p.alignment = WD_ALIGN_PARAGRAPH.CENTER; p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(str(file), width=Cm(w*scale), height=Cm(h*scale))
    caption('Figura', title); para(explanation)

def table(title, headers, rows, widths):
    caption('Tabla', title)
    tbl = doc.add_table(rows=1, cols=len(headers)); tbl.alignment = WD_TABLE_ALIGNMENT.CENTER; tbl.autofit = False
    total = sum(widths)
    tbl._tbl.tblPr.find(qn('w:tblW')).set(qn('w:w'), str(int(Cm(total).twips)))
    tbl._tbl.tblPr.find(qn('w:tblW')).set(qn('w:type'), 'dxa')
    for col, width in zip(tbl._tbl.tblGrid.gridCol_lst, widths): col.set(qn('w:w'), str(int(Cm(width).twips)))
    borders = OxmlElement('w:tblBorders')
    for edge in ('top','left','bottom','right','insideH','insideV'):
        node = OxmlElement('w:'+edge); node.set(qn('w:val'),'single'); node.set(qn('w:sz'),'4'); node.set(qn('w:color'),'D9D9D9'); borders.append(node)
    tbl._tbl.tblPr.append(borders)
    for values in [headers] + list(rows):
        cells = tbl.rows[0].cells if values is headers else tbl.add_row().cells
        for i, value in enumerate(values):
            cells[i].width = Cm(widths[i]); cells[i].text = str(value); cells[i].vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            for p in cells[i].paragraphs:
                p.paragraph_format.space_after = Pt(3); p.paragraph_format.space_before = Pt(3)
                for r in p.runs: r.font.name='Arial'; r.font.size=Pt(8); r.bold=values is headers
            if values is headers:
                node=OxmlElement('w:shd'); node.set(qn('w:fill'),'EEE6E2'); cells[i]._tc.get_or_add_tcPr().append(node)
        no_split=OxmlElement('w:cantSplit'); cells[0]._tc.getparent().get_or_add_trPr().append(no_split)
    tbl.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    for row in tbl.rows[:-1]:
        for cell in row.cells:
            for p in cell.paragraphs: p.paragraph_format.keep_with_next = True
    para()
    return tbl

def link(label, url):
    p=para(); p.add_run(label+' ')
    rel = p.part.relate_to(url, RT.HYPERLINK, is_external=True)
    node=OxmlElement('w:hyperlink');node.set(qn('r:id'),rel)
    r=OxmlElement('w:r');pr=OxmlElement('w:rPr');c=OxmlElement('w:color');c.set(qn('w:val'),'1B617F');pr.append(c);r.append(pr)
    text=OxmlElement('w:t');text.text=url;r.append(text);node.append(r);p._p.append(node)

def save():
    node = OxmlElement('w:updateFields'); node.set(qn('w:val'),'true'); doc.settings.element.append(node)
    doc.save(OUT); print(OUT)

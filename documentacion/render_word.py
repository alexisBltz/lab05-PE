"""Render a DOCX with locally installed Microsoft Word, then rasterize its PDF."""
from pathlib import Path
import sys
import fitz
import win32com.client

source = Path(sys.argv[1]).resolve()
target = Path(sys.argv[2]).resolve()
target.mkdir(parents=True, exist_ok=True)
pdf = target / (source.stem + ".pdf")
word = win32com.client.DispatchEx("Word.Application")
word.Visible = False
word.DisplayAlerts = 0
try:
    doc = word.Documents.Open(str(source), ReadOnly=True)
    try:
        doc.ExportAsFixedFormat(str(pdf), 17)
    finally:
        doc.Close(False)
finally:
    word.Quit()
with fitz.open(pdf) as document:
    for i, page in enumerate(document, start=1):
        page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False).save(target / f"page-{i}.png")
    print(f"{len(document)} pages -> {target}")

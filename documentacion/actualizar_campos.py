"""Actualiza campos Word (índices, secuencias y páginas) y guarda el DOCX."""
from pathlib import Path
import sys
import win32com.client

source = Path(sys.argv[1]).resolve()
word = win32com.client.DispatchEx("Word.Application")
word.Visible = False
word.DisplayAlerts = 0
try:
    doc = word.Documents.Open(str(source), ReadOnly=False)
    try:
        doc.Fields.Update()
        for index in doc.TablesOfContents: index.Update()
        for index in doc.TablesOfFigures: index.Update()
        doc.Repaginate()
        doc.Save()
    finally:
        doc.Close(False)
finally:
    word.Quit()
print(source)

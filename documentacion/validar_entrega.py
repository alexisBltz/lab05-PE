from pathlib import Path
from zipfile import ZipFile
from hashlib import sha256
from io import BytesIO
import json
import pymupdf
from PIL import Image
from docx import Document
from lxml import etree
import imageio_ffmpeg

lab=Path(__file__).resolve().parents[1]
source=lab.parent/'PLANTILLA.docx'
report=lab/'informe/LAB05_INFORME_FINAL.docx'
original_hash=sha256(source.read_bytes()).hexdigest().upper()
assert original_hash=='3113082634B297AFA12CBE8881752043FA3F2DF0D40A4273FB6411046D921895'
with ZipFile(report) as package, ZipFile(source) as template:
    assert package.testzip() is None
    media={sha256(package.read(n)).hexdigest() for n in package.namelist() if n.startswith('word/media/')}
    assert all(sha256(template.read(n)).hexdigest() in media for n in template.namelist() if n.startswith('word/media/'))
    root=etree.fromstring(package.read('word/document.xml'))
    instructions=root.xpath('//*[local-name()="instrText"]/text()')
    assert sum('TOC ' in t for t in instructions)==3
document=Document(report); reference=Document(source)
assert len(document.sections)==1 and len(document.inline_shapes)==12 and len(document.tables)==7
for name in ['page_width','page_height','top_margin','bottom_margin','left_margin','right_margin']:
    assert abs(getattr(document.sections[0],name)-getattr(reference.sections[0],name)) < 1000, name
with pymupdf.open(lab/'documentacion/informe_render_v2/LAB05_INFORME_FINAL.pdf') as pdf:
    assert len(pdf)==20
    assert all(len(p.get_text().strip())>300 for p in pdf)
capture_data={}
for file in sorted((lab/'evidencias/capturas').glob('*.png')):
    with Image.open(file) as im: im.verify()
    with Image.open(file) as im: capture_data[file.name]=im.size
assert len(capture_data)==11
for number in range(1,10):
    name=next(n for n in capture_data if n.startswith(f'{number:02d}_'))
    if number not in (5,9): assert tuple(capture_data[name])==(390,844)
assert tuple(capture_data['09_escritorio.png'])==(1440,900)
tests=json.loads((lab/'evidencias/pruebas/resultados.json').read_text(encoding='utf-8'))['stats']
assert tests['expected']==5 and tests['unexpected']==0 and tests['skipped']==0
public=json.loads((lab/'evidencias/pruebas/publicacion_verificada.json').read_text(encoding='utf-8'))
assert public['repositoryHttp']==200 and public['applicationHttp']==200 and public['browserErrors']==[]
stream=imageio_ffmpeg.read_frames(str(lab/'video/demostracion.mp4'))
try:
    metadata=next(stream)
    frame=next(stream)
    assert metadata['size']==(390,844) and metadata['duration']>8 and len(frame)>0
finally: stream.close()
result={
    'estado':'correcto','paginas_revisadas':20,'figuras_docx':12,'tablas_cuerpo':7,'indices_word':3,
    'plantilla_original_sha256':original_hash,'logos_originales_preservados':True,
    'capturas':capture_data,'pruebas_aprobadas':5,'video_segundos':metadata['duration'],
    'publicacion_http':200,'informe_sha256':sha256(report.read_bytes()).hexdigest(),
}
(lab/'evidencias/pruebas/validacion_final.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False,indent=2))

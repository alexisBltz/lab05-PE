# Reproducir la documentación

El informe se construyó desde la plantilla original, sin modificarla. Para regenerarlo, colocar `PLANTILLA.docx` en el directorio padre de este repositorio y conservar las capturas y registros incluidos.

En Windows con Microsoft Word instalado:

```powershell
python -m pip install python-docx Pillow pymupdf pywin32 lxml imageio-ffmpeg
python documentacion/generar_informe.py
python documentacion/actualizar_campos.py informe/LAB05_INFORME_FINAL.docx
python documentacion/render_word.py informe/LAB05_INFORME_FINAL.docx documentacion/informe_render_v2
python documentacion/validar_entrega.py
```

Los campos de índice y numeración son nativos de Word. `render_word.py` usa Word en modo oculto para obtener un PDF temporal y lo convierte a imágenes de revisión; esos archivos no forman parte de la publicación del repositorio. La validación final comprueba el paquete DOCX, figuras, geometría, hash de la plantilla y de sus logotipos, capturas, video y resultados de prueba.

La guía del Laboratorio 05 se citó como documento académico suministrado por el estudiante y no se redistribuye en el repositorio. Los requisitos y el alcance se registran en el plan y la matriz de tareas.

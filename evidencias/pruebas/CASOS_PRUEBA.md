# Casos y resultados ejecutados

La suite final se ejecutó sobre la exportación web de producción con Chromium. Resultado: **5 aprobados, 0 fallos, 0 omitidos**, en 14,2 segundos según `resultados.json`. El recorrido grabado contiene pausas para lectura y se ejecuta en un contexto independiente.

| Caso | Comprobaciones | Resultado |
|---|---|---|
| P01 | Rechazo de monto cero; ingreso; edición; eliminación confirmada; gasto; recarga; ocultación de importes | Aprobado |
| P02 | Fecha inválida; plan guardado; reserva mayor que saldo rechazada; meta persistente; diario S/ 15,33 tras la configuración de prueba | Aprobado |
| P03 | Filtros de tipo; búsqueda; avance educativo persistente; cancelación y confirmación del reemplazo de datos | Aprobado |
| P04 | Capturas reales; móvil 390 × 844; escritorio 1440 × 900; ausencia de desborde horizontal | Aprobado |
| P05 | Video real: gasto, actualización del saldo, meta, análisis, lectura y recarga | Aprobado |

## Incidencias resueltas

La primera prueba del presupuesto detectó un solapamiento: los contenedores móviles usaban expansión flex y un bloque interceptaba el botón Guardar. Se limitó la expansión a la disposición de escritorio. También se agregó una espera al título de destino antes de capturar una ruta. Una ejecución sobre el servidor de desarrollo falló mientras Expo aún compilaba las rutas; la suite final usó archivos de producción para comprobar el comportamiento distribuido.

## Comprobación pública adicional

Después del despliegue, un navegador nuevo abrió GitHub Pages sin sesión, comprobó el saldo, navegó a Aprende, marcó una lectura y recargó. El resultado fue correcto, sin errores de navegador o recursos HTTP fallidos. Esta comprobación se conserva separada de las cinco pruebas locales.

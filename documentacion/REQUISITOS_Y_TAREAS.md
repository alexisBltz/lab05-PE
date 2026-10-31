# Requisitos y tareas

## Funcionales

| ID | Requisito | Estado y evidencia |
|---|---|---|
| RF01 | Registrar ingresos y gastos con monto, categoría, fecha y descripción | Implementado; prueba CRUD |
| RF02 | Editar y eliminar con confirmación | Implementado; prueba CRUD |
| RF03 | Consultar actividad, filtrar tipo y buscar texto | Implementado; prueba de filtros |
| RF04 | Definir presupuesto, próxima fecha de ingreso y límites | Implementado; prueba del plan |
| RF05 | Calcular saldo, gasto mensual y monto diario | Implementado; aserciones de importes |
| RF06 | Establecer meta y reservar parte del saldo | Implementado; validación y cálculo diario |
| RF07 | Consultar distribución por categoría y avisos de exceso | Implementado; capturas de análisis y plan |
| RF08 | Consultar tres lecturas y guardar su avance | Implementado; prueba de lectura y recarga |
| RF09 | Conservar datos locales tras reiniciar la página | Implementado; pruebas de persistencia |
| RF10 | Ocultar importes y reemplazar datos previa confirmación | Implementado; privacidad visual y prueba de reemplazo |

No se incluyen requisitos funcionales pendientes dentro de este alcance local. Sincronización, cuentas y conexión bancaria son ampliaciones excluidas, no funciones declaradas completas.

## No funcionales

| ID | Requisito | Verificación |
|---|---|---|
| RNF01 | Adaptación móvil y escritorio | 390 × 844 y 1440 × 900 |
| RNF02 | Validar importes, fechas y reserva | Pruebas de datos inválidos |
| RNF03 | Usar componentes multiplataforma | React Native y Expo Router; validación web |
| RNF04 | Mantener datos sin cuenta remota | AsyncStorage; ninguna API bancaria |
| RNF05 | Código modular y reproducible | TypeScript, lint, lockfile y README |

La ejecución en dispositivos Android/iOS y la evaluación con usuarios reales permanecen pendientes. La compatibilidad del código no se presenta como prueba de esos entornos.

## Tareas del integrante

Único integrante identificado: **Alexis Baltazar Mamani Mamani**, con apoyo de herramientas de automatización para implementación, pruebas y redacción.

| Actividad asignada | Estado |
|---|---|
| Analizar la guía y relacionarla con el diseño anterior | Completada |
| Formular árbol de problemas y requisitos | Completada como propuesta sustentada en fuentes públicas |
| Implementar módulos y persistencia local | Completada |
| Ejecutar pruebas y generar evidencia real | Completada según resultados entregados |
| Preparar informe en la plantilla y publicar código | Se registra el resultado final en ESTADO_ENTREGA.md |
| Validar requisitos con una comunidad de estudiantes | Pendiente; no se realizaron entrevistas ni piloto |
| Probar dispositivos Android e iOS | Pendiente; entorno disponible verificado en navegador |

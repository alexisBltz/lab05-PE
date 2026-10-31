# UniBudget Social · Laboratorio 05

Aplicación multiplataforma de presupuesto y educación financiera para estudiantes. Continúa el diseño de UniBudget del Laboratorio 04 con React Native, Expo SDK 58 y Expo Router. Autor académico: **Alexis Baltazar Mamani Mamani**.

La aplicación registra movimientos, calcula un monto diario después de reservar ahorro, muestra límites de consumo y permite marcar lecturas educativas. La proyección social consiste en facilitar una herramienta gratuita y sin cuenta a estudiantes y familias; no se ha realizado todavía una evaluación de impacto con una comunidad.

## Ejecutar

Se necesita Node.js 22 LTS y npm.

```bash
cd proyecto
npm ci
npm run web -- --port 8085
```

Abrir `http://localhost:8085`. Para abrir el proyecto con Expo Go en un dispositivo compatible, ejecutar `npm start` y seguir el QR de Expo. Android e iOS físicos no se han verificado en esta entrega.

## Comprobar y construir

```bash
npm run typecheck
npm run lint
npx playwright install chromium
npm test
npm run build
```

Para reproducir las pruebas sobre producción, ejecutar `npm run build` y `npm run preview` en una terminal; luego `npm test` en otra. El servidor se encuentra en `http://localhost:8085`. `npm run build` produce una exportación web estática en `proyecto/dist`. `npm run build:pages` configura la ruta `/lab05-PE` para GitHub Pages. El workflow incluido publica esa exportación al modificar el código de la rama `main`.

## Datos y reglas

El primer inicio contiene seis movimientos ficticios, identificados como datos de ejemplo: ingresos por S/ 1 170 y gastos por S/ 220; saldo S/ 950. El presupuesto es S/ 650 y la reserva inicial S/ 100. Para empezar vacío, usar **Empezar con mis datos** y confirmar el reemplazo. El cambio sustituye movimientos, presupuesto, meta y avance educativo.

Los importes se guardan en céntimos enteros. El balance usa todos los movimientos; el consumo de categorías corresponde al mes actual. El límite diario es `max(0, min(saldo, presupuesto mensual - gastos del mes) - reserva) / días`, incluyendo hoy y la fecha del próximo ingreso. La reserva es una asignación informativa del saldo, no un depósito o transferencia bancaria. AsyncStorage conserva los datos localmente en el mismo dispositivo/origen. Eliminar los datos del sitio borra esa información.

## Organización

```text
proyecto/src/app/          rutas y layout de Expo Router
proyecto/src/store.tsx     estado compartido y persistencia
proyecto/src/model.ts      modelo, datos de ejemplo y cálculos
proyecto/src/Goal.tsx      meta y reserva de ahorro
proyecto/src/Learning.tsx  lecturas con seguimiento local
proyecto/src/ui.tsx        componentes reutilizables
proyecto/tests/            pruebas, capturas y recorrido grabado
documentacion/            plan, trazabilidad y guion
evidencias/               capturas reales, diagramas y resultados
informe/                  documento DOCX basado en la plantilla
video/                    demostración MP4
```

Los enlaces públicos verificados se registran en `ENLACES_PUBLICOS.md` después de publicar. La guía oficial fue utilizada como referencia académica; no se atribuyen a la aplicación entrevistas ni resultados de campo no realizados.

## Fuentes educativas

Las lecturas breves se adaptaron de [Claves para ahorrar de la SBS](https://www.sbs.gob.pe/usuarios/aprende-con-la-sbs/claves-para-ahorrar). El proyecto no está afiliado a la SBS. El avance de lecturas registra una acción del usuario, no una medición de aprendizaje.

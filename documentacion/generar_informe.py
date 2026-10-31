import json
from docx_base import doc, LAB, OUT, heading, para, field, picture, table, link, save

results = json.loads((LAB/'evidencias/pruebas/resultados.json').read_text(encoding='utf-8'))
assert results['stats']['expected'] == 5 and results['stats']['unexpected'] == 0
public = json.loads((LAB/'evidencias/pruebas/publicacion_verificada.json').read_text(encoding='utf-8'))
assert public['applicationHttp'] == 200 and public['persistence'] == 'passed'

doc.add_page_break()
heading('Resumen')
para('UniBudget Social es una aplicación de organización financiera para estudiantes que continúa el diseño del trabajo anterior y añade un componente de educación financiera. Se desarrolló con React Native, Expo y Expo Router, con persistencia local mediante AsyncStorage. Permite registrar y administrar movimientos, definir presupuesto y límites, reservar una parte del saldo para una meta de ahorro y consultar lecturas breves. La reserva interviene en el cálculo del importe diario utilizable. La implementación se ejecutó en navegador y se verificó con cinco pruebas automatizadas aprobadas, capturas móviles y de escritorio y un recorrido grabado. El código se publicó en un repositorio público y la versión web en GitHub Pages, cuyos enlaces se comprobaron sin autenticación. El alcance social es una propuesta de acceso gratuito a herramientas y orientación básica; la validación participativa y la medición de impacto permanecen pendientes. Tampoco se declara probada la ejecución en dispositivos Android o iOS.')
para('Palabras clave: aplicación multiplataforma, presupuesto universitario, ahorro, educación financiera, React Native.')
heading('Índices', toc=False)
for title, instruction in [
    ('Índice general', ' TOC \\o "1-2" \\h \\z \\u '),
    ('Índice de figuras', ' TOC \\h \\z \\c "Figura" '),
    ('Índice de tablas', ' TOC \\h \\z \\c "Tabla" '),
]:
    if title == 'Índice de figuras': doc.add_page_break()
    p=para(title);p.runs[0].bold=True
    p=para();field(p,instruction,'Actualizar campo en Word')
doc.add_page_break()

heading('1 Descripción general del proyecto')
heading('1.1 Propósito y contexto',2)
para('El problema abordado es la dificultad de distribuir el dinero universitario entre necesidades cotidianas y metas futuras hasta el siguiente ingreso. Un registro discontinuo y la falta de límites dificultan reconocer el consumo acumulado. La propuesta mantiene las categorías y la jerarquía visual de UniBudget del Laboratorio 04 y completa su funcionamiento con navegación por rutas, almacenamiento, validación y nuevos módulos de ahorro y aprendizaje.')
para('La guía del Laboratorio 05 solicita una aplicación relacionada con los diseños anteriores y con proyección social [1]. Se propone su uso gratuito por estudiantes y familias que desean organizar gastos sin crear una cuenta. La base documental es la orientación pública de la SBS sobre presupuesto y ahorro [2]. De ella se derivaron necesidades operativas para el proyecto; no se afirma que esos requisitos hayan sido obtenidos mediante entrevistas o aceptados por una organización beneficiaria.')
heading('1.2 Problema y trazabilidad de la solución',2)
picture('evidencias/diagramas/arbol_problemas.png','Árbol de problemas de la propuesta','El problema central relaciona cuatro causas con efectos observables en una planificación financiera insuficiente. Cada causa se vincula con un módulo: registro, límites, meta de ahorro y lecturas. Este árbol es una formulación del proyecto sustentada en fuentes y diseño previo, no el resultado de una investigación de campo.',height=8.6)
table('Relación entre causas funcionalidades e interfaces', ['Causa planteada','Respuesta funcional','Interfaz'], [
    ('Registro poco constante','Alta, edición y eliminación de movimientos','Inicio y Actividad'),
    ('Falta de límites','Presupuesto, categorías y avisos de exceso','Mi plan y Análisis'),
    ('Ahorro sin seguimiento','Meta y reserva del saldo','Mi plan'),
    ('Orientación poco accesible','Tres lecturas y seguimiento local','Aprende'),
], [5.0,7.2,4.5])

heading('1.3 Requisitos funcionales y estado',2)
para('Los requisitos siguientes delimitan el alcance implementado. Su estado se refiere a la versión web ejecutada y comprobada; la base de componentes es multiplataforma, pero ello no sustituye las pruebas nativas.')
table('Requisitos funcionales implementados', ['ID','Requisito','Estado'], [
    ('RF01','Registrar ingreso o gasto con categoría, fecha y descripción','Completo en web'),
    ('RF02','Editar y eliminar movimientos con confirmación','Completo en web'),
    ('RF03','Filtrar por tipo y buscar movimientos por texto','Completo en web'),
    ('RF04','Guardar presupuesto, fecha de ingreso y límites de categoría','Completo en web'),
    ('RF05','Calcular saldo, consumo mensual y disponible diario','Completo en web'),
    ('RF06','Definir una meta y una reserva de ahorro validada','Completo en web'),
    ('RF07','Mostrar distribución de gastos y límites superados','Completo en web'),
    ('RF08','Consultar y marcar lecturas educativas','Completo en web'),
    ('RF09','Conservar movimientos, plan, meta y lecturas al recargar','Completo en web'),
    ('RF10','Ocultar importes y reemplazar datos previa confirmación','Completo en web'),
], [1.5,10.4,4.8])
para('No quedan funciones pendientes dentro del alcance local definido. Sincronización, cuentas remotas y conexión bancaria no se implementaron y se excluyen del alcance. Permanecen pendientes la comprobación en dispositivos nativos y la validación contextual de requisitos con estudiantes; estas actividades se registran expresamente en la asignación de tareas.')
heading('1.4 Requisitos no funcionales',2)
table('Requisitos no funcionales y límites de verificación',['ID','Requisito','Comprobación'],[
    ('RNF01','Adaptación a móvil y escritorio','390 × 844 y 1440 × 900'),
    ('RNF02','Validación y mensajes comprensibles','Monto cero, fecha inválida y reserva excesiva'),
    ('RNF03','Uso de un framework multiplataforma','React Native y Expo; prueba web'),
    ('RNF04','Persistencia sin una cuenta remota','AsyncStorage en el mismo origen'),
    ('RNF05','Mantenimiento y reproducción','TypeScript, lint, lockfile y README'),
],[1.5,8.2,7.0])

heading('2 Descripción de las tareas asignadas')
para('El único integrante identificado es Alexis Baltazar Mamani Mamani. Las actividades se registran bajo ese integrante, con apoyo de herramientas de automatización para programación, pruebas y elaboración documental. No se atribuyen tareas ni resultados a personas no proporcionadas.')
table('Asignación individual y estado de actividades',['Actividad de Alexis Baltazar Mamani Mamani','Estado','Evidencia o motivo'],[
    ('Analizar la guía y el diseño anterior','Completada','Plan y matriz de trazabilidad'),
    ('Definir problema, alcance y requisitos','Completada como propuesta','Fuentes públicas y diseño anterior'),
    ('Desarrollar módulos, layout y persistencia','Completada','Código del repositorio'),
    ('Comprobar flujos y obtener capturas reales','Completada','Cinco pruebas aprobadas'),
    ('Publicar código y aplicación web','Completada','Repositorio y Pages verificados'),
    ('Preparar informe en la plantilla','Completada','DOCX y revisión visual'),
    ('Validar con estudiantes o una comunidad','Pendiente','No se realizaron entrevistas ni piloto'),
    ('Probar Android e iOS físicos','Pendiente','Se ejecutó únicamente el entorno web'),
],[8.0,3.1,5.6])

heading('3 Descripción del proceso de desarrollo')
heading('3.1 Herramientas y organización',2)
para('Se utilizó React Native 0.88.1 con Expo SDK 58.0.22 y TypeScript. Las rutas se implementaron con Expo Router en src/app. Se conservaron las decisiones visuales del diseño previo y se separaron componentes reutilizables, modelo, estado, formulario, meta y aprendizaje. La documentación oficial de React Native y Expo orientó la selección de componentes y el manejo del layout [3]–[5]. El lockfile fija las dependencias para reproducir la instalación.')
picture('evidencias/diagramas/arquitectura.png','Arquitectura y navegación implementadas','Expo Router organiza las cinco pantallas. StoreProvider conserva el estado al navegar. Los componentes consultan el modelo para calcular indicadores y actualizan un único almacén que se serializa localmente. AsyncStorage no recibe ni comparte información entre dispositivos.',height=8.6)
table('Módulos creados y responsabilidades',['Módulo','Archivo principal','Responsabilidad'],[
    ('Navegación','src/app/_layout.tsx y rutas','Layout de rutas y proveedor compartido'),
    ('Dominio','src/model.ts','Tipos, validación de fecha, datos de ejemplo y totales'),
    ('Persistencia','src/store.tsx','Carga, validación de estructura y guardado local'),
    ('Movimientos','src/MovementEditor.tsx','Alta, edición y eliminación confirmada'),
    ('Ahorro','src/Goal.tsx','Meta, reserva y comprobación de montos'),
    ('Educación','src/Learning.tsx','Lecturas y estado de completado'),
    ('Interfaz compartida','src/ui.tsx y src/styles.ts','Botones, tarjetas, campos, barras y estilos'),
],[3.0,5.6,8.1])
heading('3.2 Componentes propios del framework',2)
para('View organiza los bloques; Text presenta contenido e indicadores; Pressable gestiona las acciones; TextInput recibe los campos; Modal contiene el editor y las confirmaciones; Switch controla la ocultación visual de importes. ScrollView permite recorrer formularios y tarjetas. StyleSheet centraliza los estilos y useWindowDimensions cambia la distribución según el ancho. En escritorio se usa barra lateral y columnas; en móvil, barra inferior y bloques verticales [3], [4].')
heading('3.3 Modelo de datos y persistencia',2)
para('Cada movimiento guarda identificador, tipo, céntimos enteros, categoría, descripción y fecha. El plan conserva presupuesto mensual, próximo ingreso y límites. La meta almacena nombre, objetivo y reserva; las lecturas usan una lista de identificadores completados. StoreProvider valida la estructura recuperada antes de utilizarla y comunica errores de almacenamiento. AsyncStorage es un almacén asíncrono persistente sin cifrado; se usa para información local de la aplicación [6].')
para('El saldo es la diferencia de todos los ingresos y gastos. El consumo mensual considera fechas del mes actual. El monto diario resulta de dividir entre los días restantes el valor no negativo de min(saldo, presupuesto menos gastos del mes) menos la reserva. Se incluyen hoy y la fecha del próximo ingreso. En el ejemplo: min(950, 650 − 220) − 100 = S/ 330; al dividir entre 15 días se obtienen S/ 22 diarios. La reserva es informativa y no bloquea pagos reales. El cálculo usa el remanente mensual actual aunque la fecha de ingreso atraviese otro mes; no simula nuevos ingresos intermedios.')
picture('evidencias/capturas/11_persistencia_codigo.png','Fragmento real del módulo de persistencia','Se muestra el código real de src/store.tsx representado para lectura, no una captura de un IDE. El efecto inicial recupera datos, comprueba su formato y habilita la aplicación; otro efecto guarda los cambios después de la carga.',height=9.0)
heading('3.4 Implementación y dificultades encontradas',2)
para('La base de interfaces se amplió con cinco rutas y un proveedor de estado compartido. Se agregó confirmación al reemplazo de datos, validación de importes y fechas, reserva de ahorro y seguimiento educativo. Una prueba detectó que flex: 1 en las columnas del plan móvil podía hacer que un bloque cubriera el botón de guardado; se aplicó esa expansión únicamente en escritorio. También se corrigieron capturas que se tomaban antes de terminar la navegación. Las pruebas finales se ejecutaron sobre la exportación de producción para evitar que la compilación diferida del servidor de desarrollo interfiriera con las esperas.')
heading('3.5 Preparación y publicación',2)
para('Se ejecutaron comprobaciones de TypeScript y lint, se alinearon versiones recomendadas por Expo y se exportó la versión web con la ruta base del repositorio. GitHub Actions instala con npm ci, comprueba el proyecto y despliega el resultado en GitHub Pages. El repositorio público y la aplicación se verificaron sin iniciar sesión. El resultado de esa comprobación queda registrado con fecha y estados HTTP en publicacion_verificada.json.')

doc.add_page_break()
heading('4 Interfaces de la aplicación')
para('Las siguientes figuras proceden de la aplicación ejecutada con Chromium. Las pantallas móviles se capturaron a 390 × 844 y la de escritorio a 1440 × 900. Los ejemplos son ficticios y están identificados como tales en la interfaz.')
screens=[
 ('01_inicio.png','Panel principal y estimación diaria','El panel presenta saldo S/ 950, ingresos S/ 1 170, gastos S/ 220 y un disponible orientativo de S/ 22 diarios. La reserva de S/ 100 se conserva dentro del saldo y se excluye del cálculo de gasto diario.'),
 ('02_registro.png','Formulario de registro de gasto','El editor Modal reúne monto, tipo, categoría, descripción y fecha. La captura muestra un gasto de ejemplo antes de guardarlo; las pruebas comprobaron la validación y las operaciones de modificación y eliminación.'),
 ('03_actividad.png','Historial de movimientos y filtros','La lista permite consultar ingresos y gastos, buscar por texto y abrir cada registro para editarlo. La separación por tipo facilita localizar consumos cotidianos.'),
 ('04_plan.png','Configuración del plan mensual','El presupuesto y los límites se configuran con TextInput. El formulario continúa por desplazamiento vertical; el botón de guardar y los indicadores fueron comprobados sin el solapamiento detectado durante el desarrollo.'),
 ('05_meta_ahorro.png','Meta de ahorro con reserva informativa','La meta explica el significado de la reserva, valida que no supere el saldo ni el objetivo y muestra su progreso. La reserva del ejemplo representa un tercio del objetivo de S/ 300.'),
 ('06_analisis.png','Distribución del gasto por categoría','Las barras muestran la proporción mensual de cada categoría. Los montos se calculan a partir de los movimientos, sin estadísticas simuladas ajenas a los datos del ejemplo.'),
 ('07_aprende.png','Lecturas de educación financiera','La sección ofrece tres lecturas breves con acciones prácticas y un vínculo a la fuente pública. Su acceso no exige una cuenta; marcar una lectura registra una preferencia local, no un resultado de aprendizaje.'),
 ('08_persistencia.png','Avance educativo conservado tras recarga','La captura posterior a la recarga mantiene una lectura marcada. La prueba también comprobó persistencia de movimientos, presupuesto y reserva de ahorro.'),
 ('09_escritorio.png','Adaptación del panel a escritorio','Con 1440 × 900 se usa navegación lateral y una distribución de tarjetas en columnas. La prueba comprobó que el documento no excediera horizontalmente el ancho de la ventana.'),
]
for name,title,explanation in screens:
    picture('evidencias/capturas/'+name,title,explanation,width=16.5 if name.startswith('09') else 8.0,height=13.4)

doc.add_page_break()
heading('5 Verificación y resultados')
para('La ejecución final de Playwright completó cinco pruebas con resultado aprobado, sin casos omitidos ni fallos. Los contextos de navegador se aislaron para no mezclar datos. La exportación de producción, TypeScript y lint finalizaron correctamente. La evidencia incluye resultados JSON, reporte HTML, capturas y video real. El alcance probado corresponde a Chromium web; no se extrapola a dispositivos nativos.')
table('Pruebas ejecutadas y resultados',['Caso','Comprobaciones','Resultado'],[
    ('P01','Monto cero, ingreso, edición, eliminación, gasto, recarga y ocultación','Aprobado'),
    ('P02','Fecha inválida, plan persistente, reserva excesiva y cálculo diario','Aprobado'),
    ('P03','Filtros, búsqueda, lectura persistente y reemplazo confirmado','Aprobado'),
    ('P04','Capturas reales y ausencia de desborde en móvil/escritorio','Aprobado'),
    ('P05','Recorrido grabado con movimiento, meta, lectura y recarga','Aprobado'),
],[1.7,12.0,3.0])
para('La publicación se comprobó mediante HTTP 200 tanto para el repositorio como para la aplicación. En la versión pública se repitieron navegación y persistencia de una lectura tras recarga, sin errores de navegador ni recursos de la aplicación con respuesta de error. El acceso público no comparte los registros locales de un visitante con otros usuarios.')
para('Quedan pendientes un piloto con estudiantes, evaluación de accesibilidad con usuarios y pruebas en Android e iOS físicos. Por ello no se atribuye todavía una mejora económica o educativa medida. Estas limitaciones delimitan el resultado académico obtenido.')

heading('6 Anexos y enlaces públicos')
link('Repositorio público con código evidencia e informe:',public['repository'])
link('Aplicación web publicada:',public['application'])
link('Video demostrativo en el repositorio:',public['repository']+'/blob/main/video/demostracion.mp4')
para('Ejecución local: ingresar a proyecto, ejecutar npm ci y npm run web -- --port 8085. Para reproducir pruebas sobre producción: npm run build, npm run preview y, en otra terminal, npm test. Para preparar la salida de GitHub Pages: npm run build:pages. El README describe datos de ejemplo, estructura y reglas de cálculo.')
para('Los archivos anexos se organizan en proyecto, documentacion, evidencias, informe y video. El código completo se incluye en el repositorio. La guía de referencia y la plantilla original se conservan en el directorio de trabajo; para regenerar el informe se requiere la plantilla original y Microsoft Word para actualizar y renderizar sus campos.')

heading('7 Referencias')
para('[1] Universidad Nacional de San Agustín, Guía de Laboratorio 05 Aplicaciones Multiplataforma, Plataformas Emergentes (E), 2024B. Docente: M. Sc. Ing. R. Fabrizio Calienes Rodriguez. Documento proporcionado por el estudiante.')
for label,url in [
    ('[2] SBS, Claves para ahorrar.', 'https://www.sbs.gob.pe/usuarios/aprende-con-la-sbs/claves-para-ahorrar'),
    ('[3] React Native, Core Components and APIs.', 'https://reactnative.dev/docs/components-and-apis'),
    ('[4] React Native, Layout with Flexbox.', 'https://reactnative.dev/docs/flexbox'),
    ('[5] Expo, Manual installation de Expo Router.', 'https://docs.expo.dev/router/installation/'),
    ('[6] Expo SDK 58, AsyncStorage.', 'https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/'),
    ('[7] Playwright, Writing tests.', 'https://playwright.dev/docs/writing-tests'),
    ('[8] Expo, Publish websites.', 'https://docs.expo.dev/guides/publishing-websites/'),
]: link(label+' Consultado el 31 de octubre de 2026.',url)
save()

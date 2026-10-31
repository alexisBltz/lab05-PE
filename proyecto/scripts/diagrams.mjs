import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const dir = '../evidencias/diagramas'; await mkdir(dir, { recursive: true });
const box = (x, y, w, lines, fill = '#eff4e9') => `<rect x="${x}" y="${y}" width="${w}" height="88" rx="14" fill="${fill}" stroke="#a7b7ad"/><text x="${x+w/2}" y="${y+33}" text-anchor="middle" font-family="Arial" font-size="18" fill="#173443">${lines.map((line,i)=>`<tspan x="${x+w/2}" dy="${i?25:0}">${line}</tspan>`).join('')}</text>`;
const arrow = (x1,y1,x2,y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="#668677" stroke-width="2" fill="none" marker-end="url(#arrow)"/>`;
const start = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="640"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill="#668677"/></marker></defs><rect width="1200" height="640" fill="white"/>`;
let tree = start + '<text x="600" y="42" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="25" fill="#173443">Árbol de problemas de UniBudget Social</text>';
tree += box(50,95,330,['Gastos imprevistos','sin margen de respuesta'])+box(435,95,330,['Límites mensuales','superados'])+box(820,95,330,['Metas de ahorro','postergadas']);
tree += box(280,275,640,['Dificultad para distribuir el dinero universitario','hasta el próximo ingreso'],'#dbeabc');
for(const [x,lines] of [[25,['Registro de gastos','poco constante']],[325,['Falta de límites','por categoría']],[625,['Reserva de ahorro','sin seguimiento']],[925,['Orientación financiera','poco accesible']]]) tree += box(x,480,250,lines);
for(const x of [215,600,985])tree += arrow(600,275,x,185);
for(const x of [150,450,750,1050])tree += arrow(x,480,600,365);
tree += '</svg>';
let architecture = start + '<text x="600" y="42" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="25" fill="#173443">Arquitectura y navegación implementadas</text>';
architecture += box(380,90,440,['Expo Router','Inicio · Actividad · Plan · Análisis · Aprende']);
architecture += box(40,270,310,['Componentes React Native','View · TextInput · Modal · Switch']);
architecture += box(445,270,310,['StoreProvider','Movimientos · plan · ahorro · lecturas']);
architecture += box(850,270,310,['Modelo de dominio','Validación · totales · estimación diaria']);
architecture += box(380,470,440,['AsyncStorage','Persistencia local por dispositivo'],'#dbeabc');
architecture += arrow(600,178,195,270)+arrow(600,178,600,270)+arrow(600,178,1005,270)+arrow(600,358,600,470);
architecture += '</svg>';
const browser = await chromium.launch();
for(const [name, svg] of [['arbol_problemas', tree], ['arquitectura', architecture]]) {
  await writeFile(`${dir}/${name}.svg`,svg,'utf8'); const page = await browser.newPage({viewport:{width:1200,height:640}});
  await page.setContent('<style>body{margin:0}</style>'+svg); await page.screenshot({path:`${dir}/${name}.png`}); await page.close();
}
await browser.close();

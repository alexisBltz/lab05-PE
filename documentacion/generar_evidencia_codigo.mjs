import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
const require = createRequire(new URL('../proyecto/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const source = await readFile('src/store.tsx', 'utf8');
const lines = source.split('\n').slice(17, 36).map((line, i) => `${String(i + 18).padStart(2)}  ${line}`).join('\n');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });
  await page.setContent(`<style>body{margin:0;padding:35px;background:#f5f7f5;color:#173443;font:18px Arial}h1{font-size:23px}pre{padding:25px;background:white;border:1px solid #dfe6e0;border-radius:12px;white-space:pre-wrap;overflow-wrap:anywhere;font:16px/1.6 Consolas,monospace}</style><h1>Persistencia local · fragmento real de src/store.tsx</h1><p>Representación del código fuente para documentar el módulo</p><pre>${escape(lines)}</pre>`);
  await page.screenshot({ path: '../evidencias/capturas/11_persistencia_codigo.png', fullPage: true });
} finally { await browser.close(); }

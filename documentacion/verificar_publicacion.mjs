import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
const require = createRequire(new URL('../proyecto/package.json', import.meta.url));
const { chromium, expect } = require('@playwright/test');
const repository = 'https://github.com/alexisBltz/lab05-PE';
const application = 'https://alexisbltz.github.io/lab05-PE/';
const repoResponse = await fetch(repository), appResponse = await fetch(application);
if (repoResponse.status !== 200 || appResponse.status !== 200) throw new Error(`HTTP repo=${repoResponse.status}, app=${appResponse.status}`);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'es-PE' });
  const failures = [];
  page.on('pageerror', e => failures.push(e.message));
  page.on('response', r => { if (r.url().startsWith(application) && r.status() >= 400) failures.push(`${r.status()} ${r.url()}`); });
  await page.goto(application);
  await expect(page.getByTestId('balance')).toHaveText('S/ 950.00');
  await page.getByRole('button', { name: 'Ir a Aprende', exact: true }).click();
  await expect(page.getByTestId('screen-title')).toHaveText('Aprende a tu ritmo');
  await page.getByRole('button', { name: 'Marcar lectura 01', exact: true }).click();
  await page.reload(); await expect(page.getByText('1 de 3 lecturas marcadas')).toBeVisible();
  await page.getByRole('button', { name: 'Ir a Inicio', exact: true }).click();
  await expect(page.getByTestId('balance')).toHaveText('S/ 950.00');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: '../evidencias/capturas/10_publicada.png' });
  if (failures.length) throw new Error(failures.join('\n'));
  const result = { repository, application, verifiedAt: new Date().toISOString(), repositoryHttp: repoResponse.status, applicationHttp: appResponse.status, navigation: 'passed', persistence: 'passed', browserErrors: failures };
  await writeFile('../evidencias/pruebas/publicacion_verificada.json', JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
} finally { await browser.close(); }

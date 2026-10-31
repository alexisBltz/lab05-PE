import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 60000, workers: 2,
  use: { baseURL: process.env.PUBLIC_URL || 'http://localhost:8085', viewport: { width: 390, height: 844 }, locale: 'es-PE', headless: true, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  outputDir: '../evidencias/pruebas/artefactos',
  reporter: [['list'], ['html', { outputFolder: '../evidencias/pruebas/reporte-html', open: 'never' }], ['json', { outputFile: '../evidencias/pruebas/resultados.json' }]],
});

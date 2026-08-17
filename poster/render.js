/**
 * Renders poster/poster.html to MyStemLab_Poster.png at A4 / 200 DPI.
 *
 * One-off setup:   npm install playwright
 * Then, any time:  node poster/render.js
 */
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const root = path.resolve(__dirname, '..');
  // CHROMIUM_PATH lets you point at an existing browser; normally not needed.
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
  );
  const page = await browser.newPage({ viewport: { width: 1654, height: 2339 } });

  await page.goto('file://' + path.join(root, 'poster', 'poster.html'));
  await page.waitForLoadState('networkidle');
  // Give the webfonts a moment to settle before capturing.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(root, 'MyStemLab_Poster.png'),
    clip: { x: 0, y: 0, width: 1654, height: 2339 },
  });

  await browser.close();
  console.log('Wrote MyStemLab_Poster.png');
})();

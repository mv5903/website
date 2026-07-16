// Headless QA: load the page, capture console errors, screenshot each section.
import puppeteer from 'puppeteer-core';

const OUT = process.env.QA_OUT || '/tmp/scrollworld-qa';
const MOBILE = process.env.QA_MOBILE === '1';
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
});
const page = await browser.newPage();
if (MOBILE) {
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
} else {
  await page.setViewport({ width: 1512, height: 900 });
}
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));

await page.goto('http://localhost:8321/', { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 1200));

const max = await page.evaluate(() => document.getElementById('spacer').offsetHeight - innerHeight);
// mid-section scroll fractions from the section weights
const weights = [1.4, 1.7, 1.9, 1.5, 1.3, 1.3, 1.8];
const total = weights.reduce((a, b) => a + b, 0);
let acc = 0;
const stops = weights.map((w) => { const f = (acc + w * 0.55) / total; acc += w; return f; });
stops.push(0.998); // very end

for (let i = 0; i < stops.length; i++) {
  await page.evaluate((y) => scrollTo(0, y), Math.round(stops[i] * max));
  await new Promise((r) => setTimeout(r, 1400)); // let the damped camera settle
  await page.screenshot({ path: `${OUT}/sec${i}${MOBILE ? '-m' : ''}.png` });
  console.log(`shot sec${i} @ ${(stops[i] * 100).toFixed(1)}%`);
}
// hover test: rack section, sweep the mouse to find a cabinet hotspot
await page.evaluate((y) => scrollTo(0, y), Math.round(((1.4 + 1.8 * 0.5) / total2()) * max));
function total2() { return 11.1; }
await new Promise((r) => setTimeout(r, 1500));
for (const [hx, hy] of [[380, 420], [1100, 420], [500, 500], [1000, 500]]) {
  await page.mouse.move(hx, hy);
  await new Promise((r) => setTimeout(r, 350));
  const tipVis = await page.evaluate(() => +getComputedStyle(document.getElementById('tip')).opacity > 0.5);
  if (tipVis) break;
}
await page.screenshot({ path: `${OUT}/hover-rack.png` });
// finale: hover a satellite
await page.evaluate((y) => scrollTo(0, y), Math.round(0.93 * max));
await new Promise((r) => setTimeout(r, 1800));
await page.mouse.move(756, 300); await new Promise((r) => setTimeout(r, 250));
await page.mouse.move(700, 380); await new Promise((r) => setTimeout(r, 250));
await page.screenshot({ path: `${OUT}/hover-finale.png` });
console.log('ERRORS:', errors.length ? errors.join('\n') : 'none');
await browser.close();

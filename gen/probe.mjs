import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 880 });
p.on('console', m => console.log('[' + m.type() + ']', m.text()));
p.on('pageerror', e => console.log('[PAGEERROR]', e.message));
p.on('requestfailed', r => console.log('[REQFAIL]', r.url()));
p.on('response', r => { if (r.status() >= 400) console.log('[' + r.status() + ']', r.url()); });
await p.goto('http://localhost:8321/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1000));
const st = await p.evaluate(() => ({
  spacer: document.getElementById('spacer').offsetHeight,
  copies: document.querySelectorAll('.copy').length,
  rail: document.querySelectorAll('#rail button').length,
  webgl: !!document.createElement('canvas').getContext('webgl2'),
}));
console.log(st);
await b.close();

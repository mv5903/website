import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: 1400, height: 880 });
await p.goto('http://localhost:8321/', { waitUntil: 'networkidle0' });
const weights = [1.4,1.7,1.9,1.5,1.3,1.3,1.8]; const total = weights.reduce((a,c)=>a+c,0);
let acc = 0; const stops = weights.map(w => { const f = (acc + w*0.55)/total; acc += w; return f; });
for (const f of stops) {
  await p.evaluate(y => scrollTo(0, y), Math.round(f * await p.evaluate(() => document.getElementById('spacer').offsetHeight - innerHeight)));
  await new Promise(r => setTimeout(r, 1500));
  console.log(await p.evaluate(() => {
    const s = window.__sw;
    const { u, i, p: pp } = s.scrollToU(s.cur);
    return `sf=${s.cur.toFixed(3)} sec=${i} p=${pp.toFixed(2)} u=${u.toFixed(3)} cam z=${s.camera.position.z.toFixed(1)} y=${s.camera.position.y.toFixed(1)} vis=[${s.rooms.map(r=>r.group.visible?1:0).join('')}]`;
  }));
}
await b.close();

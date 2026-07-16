/* ============================================================================
   Matthew Vandenberg — scroll-world (real-time Three.js edition)
   One continuous camera flight through a miniature neon "tech-noir" world.
   Scroll scrubs the camera along a spline: desk → server hall → services
   district → workshop → ServiceNow atrium → Rutgers quad → rooftop finale.
   Hover anything outlined to learn more; the finale's orbiting satellites
   are the socials. No video, no network assets — everything is procedural.
   ========================================================================== */
import * as THREE from 'three';
import { EffectComposer } from './lib/postprocessing/EffectComposer.js';
import { RenderPass } from './lib/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './lib/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './lib/postprocessing/OutputPass.js';

/* ----------------------------------------------------------- palette / copy */
const C = {
  bg: 0x111111, ink: 0xf4f4f5, charcoal: 0x27272a, zinc: 0x3f3f46,
  green: 0x22c55e, mint: 0x4ade80, warm: 0xffd9a0,
  blue: 0x60a5fa, cyan: 0x38bdf8, red: 0xf87171, purple: 0xa78bfa,
  amber: 0xf59e0b, lime: 0xa3e635, pink: 0xf472b6,
};

const SECTIONS = [
  { id: 'hero', label: 'Hi', weight: 1.4, linger: 0.25, accent: '#4ade80',
    eyebrow: 'Hi, I’m', title: 'Matthew Vandenberg.',
    body: 'Software engineer at ServiceNow — technology & automation aficionado.',
    tags: ['Engineer', 'Homelabber', 'Maker'],
    focus: [3.5, 3.0, -12], fs: 0.5 },
  { id: 'rack', label: 'Homelab', weight: 1.8, linger: 0.45, accent: '#22c55e',
    eyebrow: 'The homelab', title: 'It starts in the rack, aka a small Dell Optiplex.',
    body: 'A Proxmox host running my whole digital life — 20+ VMs and containers, self-hosted and always on. Hover a cabinet.',
    tags: ['Proxmox', '20+ services', 'Self-hosted'] },
  { id: 'services', label: 'Services', weight: 1.9, linger: 0.5, accent: '#a78bfa',
    eyebrow: 'Always running', title: 'A city of services.',
    body: 'Home Assistant, Jellyfin, a Minecraft server, dual Pi-holes, PiVPN, the *arr stack, Uptime Kuma, Mealie, and more.',
    tags: ['Home Assistant', 'Jellyfin', 'Minecraft'] },
  { id: 'workshop', label: 'Projects', weight: 1.6, linger: 0.4, accent: '#f59e0b',
    eyebrow: 'Built by hand', title: 'The workshop never sleeps.',
    body: 'From an apartment visitor board to an automated music queue system — a dozen projects and counting.',
    tags: ['Racing Dashboard', 'Astrophotography', 'Partyfy'],
    focus: [-3, 2.2, -190], fs: 0.4 },
  { id: 'work', label: 'Work', weight: 1.3, linger: 0.25, accent: '#60a5fa',
    eyebrow: 'Work', title: 'Engineering at ServiceNow.',
    body: 'Platform Security — crypto operations for one of the world’s largest cloud platforms.',
    tags: ['Platform Security', 'Java', 'JavaScript'] },
  { id: 'campus', label: 'Education', weight: 1.3, linger: 0.25, accent: '#f87171',
    eyebrow: 'Education', title: 'Forged at Rutgers.',
    body: 'Computer science, Hack4Impact frontend engineering director, and a habit of shipping.',
    tags: ['Rutgers', 'Hack4Impact'],
    focus: [-16, 18, -351], fs: 0.4 },
  { id: 'finale', label: 'Say hi', weight: 1.8, linger: 0.45, accent: '#4ade80',
    eyebrow: 'Say hi', title: 'Let’s build something.',
    body: 'The lab door is always open — catch one of the satellites orbiting the beacon.',
    tags: [],
    focus: [0, 30.5, -400], fs: 0.9 },
];

/* ------------------------------------------------------------------- setup */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(hover: none) and (pointer: coarse)').matches;
const isMobile = () => coarse || innerWidth <= 860;

const canvas = document.getElementById('gl');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile(), powerPreference: 'high-performance' });
} catch (e) { staticFallback(); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile() ? 1.5 : 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color(C.bg);
scene.fog = new THREE.Fog(C.bg, 8, 120);

const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 900);

scene.add(new THREE.AmbientLight(0xc8dccd, 1.0));
const sun = new THREE.DirectionalLight(0xdfffe8, 0.8);
sun.position.set(0.4, 1, 0.25);
scene.add(sun);
const headlight = new THREE.PointLight(0xbfe8cf, 70, 30, 1.8);
scene.add(headlight);

let composer = null;
if (!isMobile()) {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.5, 0.4, 0.72));
  composer.addPass(new OutputPass());
}

/* ----------------------------------------------------------------- helpers */
const lam = (color, opt = {}) => new THREE.MeshLambertMaterial({ color, ...opt });
const glow = (color, intensity = 1) =>
  new THREE.MeshLambertMaterial({ color: 0x111111, emissive: color, emissiveIntensity: intensity });

function box(w, h, d, mat, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (parent) parent.add(m);
  return m;
}

/* Flickering light-point clouds (LEDs, windows, string lights, stars, city).
   Twinkle runs on the GPU; ignores fog on purpose so distant lights read. */
const ledUniforms = { uTime: { value: 0 }, uPx: { value: innerHeight } };
const ledMaterial = new THREE.ShaderMaterial({
  uniforms: ledUniforms,
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `
    attribute float aPhase; attribute float aSize; attribute vec3 aColor;
    varying vec3 vColor; varying float vPhase; varying float vNear;
    uniform float uTime; uniform float uPx;
    void main(){
      vColor = aColor; vPhase = aPhase;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      float tw = 0.72 + 0.28 * sin(uTime * (1.0 + fract(aPhase * 7.31) * 3.0) + aPhase * 6.2831);
      float dist = max(1.0, -mv.z);
      gl_PointSize = min(aSize * uPx * 0.0016 * tw * (300.0 / dist), aSize * 22.0);
      vNear = smoothstep(1.2, 4.0, dist);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    varying vec3 vColor; varying float vPhase; varying float vNear;
    uniform float uTime;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.12, d) * vNear;
      float b = 0.8 + 0.2 * sin(uTime * 2.0 + vPhase * 40.0);
      gl_FragColor = vec4(vColor * b, a);
    }`,
});

function lights(pts, parent) { // pts: [{p:[x,y,z], c:0x..., s:size}]
  const n = pts.length;
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3),
        ph = new Float32Array(n), sz = new Float32Array(n);
  const tc = new THREE.Color();
  pts.forEach((q, i) => {
    pos.set(q.p, i * 3);
    tc.set(q.c); col.set([tc.r, tc.g, tc.b], i * 3);
    ph[i] = Math.random(); sz[i] = q.s;
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
  g.setAttribute('aSize', new THREE.BufferAttribute(sz, 1));
  const p = new THREE.Points(g, ledMaterial);
  if (parent) parent.add(p);
  return p;
}

function pick(list) { return list[Math.floor(Math.random() * list.length)]; }
/* weighted light palettes — the "more color variety" mix */
const MIX_RACK = [C.mint, C.mint, C.mint, C.mint, C.blue, C.blue, C.warm, C.red, C.purple];
const MIX_CITY = [C.mint, C.mint, C.mint, C.warm, C.warm, C.blue, C.cyan, C.red, C.purple, C.pink];
const MIX_FEST = [C.warm, C.mint, C.red, C.blue, C.amber];

/* "Abstract code" monitor texture: blurry code-coloured bars, generated once. */
function codeTexture() {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 160;
  const cx = cv.getContext('2d');
  cx.fillStyle = '#0d2414'; cx.fillRect(0, 0, 256, 160);
  for (let y = 8; y < 152; y += 10) {
    let x = 10 + Math.random() * 20;
    while (x < 230) {
      const w = 12 + Math.random() * 40;
      const hue = Math.random();
      cx.fillStyle = hue < 0.72 ? `rgba(74, 222, 128, ${0.3 + Math.random() * 0.55})`
        : hue < 0.88 ? `rgba(96, 165, 250, ${0.3 + Math.random() * 0.5})`
        : `rgba(244, 114, 182, ${0.3 + Math.random() * 0.4})`;
      cx.fillRect(x, y, w, 5);
      x += w + 8 + Math.random() * 14;
    }
  }
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function scopeTexture() {
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 96;
  const cx = cv.getContext('2d');
  cx.fillStyle = '#06110a'; cx.fillRect(0, 0, 128, 96);
  cx.strokeStyle = '#4ade80'; cx.lineWidth = 2.5; cx.beginPath();
  for (let x = 0; x <= 128; x++) cx.lineTo(x, 48 + Math.sin(x / 9) * 26);
  cx.stroke();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
/* rounded-badge glyph texture for the social satellites */
function glyphTexture(text, fg) {
  const cv = document.createElement('canvas'); cv.width = cv.height = 128;
  const cx = cv.getContext('2d');
  cx.clearRect(0, 0, 128, 128);
  cx.beginPath();
  if (cx.roundRect) cx.roundRect(6, 6, 116, 116, 28); else cx.rect(6, 6, 116, 116);
  cx.fillStyle = 'rgba(17,17,17,0.88)'; cx.fill();
  cx.lineWidth = 5; cx.strokeStyle = fg; cx.stroke();
  cx.fillStyle = fg;
  cx.font = '700 54px Inter, system-ui, sans-serif';
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.fillText(text, 64, 68);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------ hotspots ---- */
const hotspots = [];   // { mesh, edges, info:{title, body, accent, href}, room }
const rayTargets = [];
let currentRoom = null;  // set while building rooms
function hot(parent, pos, size, info) {
  const acc = info.accent || C.mint;
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size),
    new THREE.MeshBasicMaterial({ color: acc, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending }));
  m.position.set(...pos);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry),
    new THREE.LineBasicMaterial({ color: acc, transparent: true, opacity: 0.85 }));
  edges.visible = false; m.add(edges);
  parent.add(m);
  const h = { mesh: m, edges, info, room: currentRoom };
  m.userData.h = h;
  hotspots.push(h); rayTargets.push(m);
  return h;
}

/* Room shell: floor + side walls + ceiling + far wall with a centered doorway. */
function shell(g, w, h, d, { door = true, doorGlow = true, doorAcc = C.mint, ceil = true } = {}) {
  const wall = lam(0x1c1c1f), floor = lam(0x18181b), hw = w / 2;
  box(w, 0.3, d, floor, 0, -0.15, -d / 2, g);
  box(0.3, h, d, wall, -hw, h / 2, -d / 2, g);
  box(0.3, h, d, wall, hw, h / 2, -d / 2, g);
  if (ceil) box(w, 0.3, d, lam(0x151517), 0, h + 0.15, -d / 2, g);
  if (door) {
    const dw = 4, dh = 5.4, side = (w - dw) / 2;
    box(side, h, 0.3, wall, -(dw / 2 + side / 2), h / 2, -d, g);
    box(side, h, 0.3, wall, dw / 2 + side / 2, h / 2, -d, g);
    box(dw, h - dh, 0.3, wall, 0, dh + (h - dh) / 2, -d, g);
    if (doorGlow) {
      box(0.18, dh, 0.35, glow(doorAcc, 1.0), -dw / 2, dh / 2, -d, g);
      box(0.18, dh, 0.35, glow(doorAcc, 1.0), dw / 2, dh / 2, -d, g);
      box(dw, 0.18, 0.35, glow(doorAcc, 1.0), 0, dh, -d, g);
    }
  } else {
    box(w, h, 0.3, wall, 0, h / 2, -d, g);
  }
  return g;
}

/* Short glowing corridor between rooms — tinted with the NEXT scene's accent. */
function corridor(zStart, len = 8, acc = C.green) {
  const g = new THREE.Group(); g.position.z = zStart;
  shell(g, 6, 6.2, len, { doorGlow: false, door: true });
  box(0.14, 0.06, len, glow(acc, 1.1), -2.4, 0.05, -len / 2, g);
  box(0.14, 0.06, len, glow(acc, 1.1), 2.4, 0.05, -len / 2, g);
  scene.add(g);
  return g;
}

/* ------------------------------------------------------------ scene: rooms */
const rooms = []; // {group, zmin, zmax, margin}
function room(zmin, zmax, build, margin = 60) {
  const g = new THREE.Group();
  currentRoom = g;
  build(g);
  currentRoom = null;
  scene.add(g);
  rooms.push({ group: g, zmin, zmax, margin });
  return g;
}

/* 1 — HERO: developer command center -------------------------------------- */
room(8, -34, (g) => {
  const R = new THREE.Group(); R.position.z = 0; g.add(R);
  shell(R, 24, 10, 26);

  // desk against the right wall, screens turned toward the flight path
  const desk = new THREE.Group(); desk.position.set(4.4, 0, -12); desk.rotation.y = -1.15; R.add(desk);
  box(7.4, 0.28, 3.2, lam(0x3a2f26), 0, 2.1, 0, desk);
  [[-3.3, -1.3], [3.3, -1.3], [-3.3, 1.3], [3.3, 1.3]].forEach(([x, z]) =>
    box(0.22, 2.1, 0.22, lam(0x222225), x, 1.05, z, desk));
  const codeTex = codeTexture();
  [[-2.3, 0.28], [0, 0], [2.3, -0.28]].forEach(([x, rz]) => {
    const mon = new THREE.Group(); mon.position.set(x, 2.24, -1.05); mon.rotation.y = rz; desk.add(mon);
    box(2.15, 1.35, 0.1, lam(0x0a0a0b), 0, 1.15, 0, mon);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.15),
      new THREE.MeshBasicMaterial({ map: codeTex }));
    scr.position.set(0, 1.15, 0.07); mon.add(scr);
    box(0.16, 0.5, 0.16, lam(0x222225), 0, 0.25, 0, mon);
  });
  box(1.9, 0.09, 0.7, lam(0x27272a), -0.4, 2.29, 0.6, desk);           // keyboard
  const hp = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.09, 8, 20, Math.PI),
    lam(0x2f2f33)); hp.position.set(2.9, 2.95, 0.5); desk.add(hp);
  box(0.1, 0.62, 0.1, lam(0x222225), 2.9, 2.42, 0.5, desk);
  box(0.36, 0.36, 0.36, lam(0x52525b), -3.2, 2.42, -0.6, desk);             // plant pot
  const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), lam(0x15803d, { flatShading: true }));
  leaf.position.set(-3.2, 2.85, -0.6); desk.add(leaf);

  hot(R, [4.2, 3.2, -12], [8.5, 3.4, 5], {
    title: 'The command center',
    body: 'Where this site was built — Three.js, no framework, no video. Everything you’re flying through is generated live.',
    accent: C.mint });
  hot(desk, [-3.2, 2.7, -0.6], [1.2, 1.5, 1.2], {
    title: 'The plant',
    body: 'Automation aficionado: even the watering is on a schedule.',
    accent: C.lime });

  // floating shelves + LED understrips on the right wall
  [4.2, 6.0].forEach((y) => {
    box(6, 0.16, 1.1, lam(0x232326), 11.2, y, -12, R);
    box(6, 0.05, 0.08, glow(C.mint, 1.6), 11.2, y - 0.12, -11.5, R);
  });
  // window on the left wall showing a mini skyline
  box(0.1, 4.4, 9, lam(0x0b0f0c), -11.8, 4.6, -13, R);
  box(0.28, 4.7, 0.3, lam(0x232326), -11.8, 4.6, -8.4, R);
  box(0.28, 4.7, 0.3, lam(0x232326), -11.8, 4.6, -17.6, R);
  const win = [];
  for (let i = 0; i < 90; i++)
    win.push({ p: [-13 - Math.random() * 8, 1 + Math.random() * 6, -13 + (Math.random() - 0.5) * 14],
               c: pick(MIX_CITY), s: 1.6 });
  lights(win, R);
  box(6, 0.06, 4.5, lam(0x1f2937), 0, 0.05, -13, R);                   // rug
  const deskLight = new THREE.PointLight(0xa7f3d0, 30, 16, 1.9);
  deskLight.position.set(2.5, 4.5, -10); R.add(deskLight);
});

corridor(-34, 8, C.green);

/* 2 — HOMELAB: server rack hall. Every cabinet is a real VM/LXC ------------ */
const FLEET = [
  ['Home Assistant', 'VM — runs the whole smart home, lights to locks.', 1],
  ['ubuntu-docker', 'VM — Portainer and a fleet of containers.', 1],
  ['arr-stack', 'VM — the *arr suite, an automated media pipeline.', 1],
  ['Jellyfin', 'LXC — self-hosted streaming, my own Netflix.', 1],
  ['Minecraft', 'LXC — the world stays up even when I log off.', 1],
  ['Pi-hole primary', 'LXC — network-wide ad-blocking DNS.', 1],
  ['Pi-hole secondary', 'LXC — because DNS should never be a single point of failure.', 1],
  ['PiVPN', 'LXC — WireGuard tunnel back home from anywhere.', 1],
  ['Uptime Kuma', 'LXC — watches everything else on this wall.', 1],
  ['Homepage', 'LXC — the lab’s dashboard and front door.', 1],
  ['webserver', 'LXC — may literally be serving you this page right now.', 1],
  ['PocketID', 'LXC — passkey single sign-on for the whole lab.', 1],
  ['Mealie', 'LXC — recipes, self-hosted.', 1],
  ['SMB', 'LXC — network file shares.', 1],
  ['visitor-board', 'LXC — a little guestbook display.', 1],
  ['lubuntu', 'VM — a spare desktop living in the rack.', 1],
  ['ubuntu', 'LXC — general-purpose sandbox.', 1],
  ['👋🏻', ''],
  ['🤷🏻‍♂️', ''],
];
// sleepers get woven between the running cabinets
const SLEEPERS = [
  ['Jumbotron', 'LXC — scoreboard frontend. Asleep right now.', 0],
  ['GitHub runner', 'LXC — CI on demand. Asleep right now.', 0],
  ['Gramps Web', 'LXC — the family tree. Asleep right now.', 0],
];
SLEEPERS.forEach((slp, k) => FLEET.splice(3 + k * 4, 0, slp));
room(-40, -96, (g) => {
  const R = new THREE.Group(); R.position.z = -42; g.add(R);
  shell(R, 20, 9, 52, { doorAcc: C.purple });
  box(1.0, 0.04, 50, glow(C.green, 0.3), 0, 0.04, -26, R);             // aisle strip
  const rackMat = lam(0x1a1a1d), faceMat = lam(0x101012);
  const leds = [];
  let f = 0;
  for (let side = -1; side <= 1; side += 2) {
    for (let i = 0; i < 11; i++) {
      const z = -4 - i * 4.4, x = side * 5.6;
      const [name, desc, running] = FLEET[f++];
      box(2.6, 6.4, 3.6, rackMat, x, 3.2, z, R);
      box(0.1, 6.0, 3.2, faceMat, x - side * 1.36, 3.2, z, R);
      const nLed = running ? 42 : 8;
      for (let u = 0; u < nLed; u++)
        leds.push({ p: [x - side * 1.45, 0.6 + (u % 14) * 0.42, z - 1.1 + Math.floor(u / 14) * 1.1],
                    c: running ? pick(MIX_RACK) : C.amber,
                    s: 0.85 });
      hot(R, [x, 3.2, z], [3.0, 6.8, 4.0], {
        title: name, body: desc, accent: running ? C.mint : C.amber });
    }
  }
  lights(leds, R);
  [-3, 3].forEach((x) => {
    box(1.4, 0.12, 50, lam(0x232326), x, 8.4, -26, R);
    box(0.16, 0.08, 50, glow(C.green, 0.5), x, 8.28, -26, R);
  });
  const mist = new THREE.Mesh(new THREE.PlaneGeometry(18, 50),
    new THREE.MeshBasicMaterial({ color: 0x1d3a2a, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false }));
  mist.rotation.x = -Math.PI / 2; mist.position.set(0, 0.5, -26); R.add(mist);
});

corridor(-96, 8, C.purple);

/* 3 — SERVICES: gallery of glowing themed rooms ---------------------------- */
const spin = []; // objects rotated each frame
room(-102, -170, (g) => {
  const R = new THREE.Group(); R.position.z = -104; g.add(R);
  shell(R, 26, 8, 62, { doorAcc: C.amber });

  /* corridor walls with openings at the alcoves (kills the black voids) */
  const wallM = lam(0x1e1e21);
  function fillWalls(side, centers) {
    const gaps = centers.map((c) => [c - 4.5, c + 4.5]).sort((a, b) => b[0] - a[0]);
    let zTop = 0;
    for (const [lo, hi] of gaps) {
      if (hi < zTop) box(0.25, 7, zTop - hi, wallM, side * 4.6, 3.5, (zTop + hi) / 2, R);
      zTop = lo;
    }
    if (zTop > -62) box(0.25, 7, zTop + 62, wallM, side * 4.6, 3.5, (zTop - 62) / 2, R);
  }
  fillWalls(-1, [-8, -28, -48]);
  fillWalls(1, [-18, -38, -56]);
  // corridor ceiling light-line
  box(0.2, 0.06, 60, glow(C.purple, 0.9), 0, 7.85, -31, R);

  /* Alcove: a lit niche off the corridor with a glowing accent portal. */
  function alcove(z, side, accent, info, build) {
    const a = new THREE.Group(); a.position.set(side * 8.5, 0, z); R.add(a);
    box(9, 0.24, 9, lam(0x1b1b1e), 0, 0.02, 0, a);
    box(0.3, 7, 9, lam(0x1c1c1f), side * 4.5, 3.5, 0, a);
    box(9, 7, 0.3, lam(0x1c1c1f), 0, 3.5, -4.5, a);
    box(9, 7, 0.3, lam(0x1c1c1f), 0, 3.5, 4.5, a);
    box(9, 0.16, 9, lam(0x141416), 0, 7, 0, a);
    // portal frame on the corridor side
    box(0.18, 6.6, 0.18, glow(accent, 1.1), -side * 4.4, 3.3, -4.4, a);
    box(0.18, 6.6, 0.18, glow(accent, 1.1), -side * 4.4, 3.3, 4.4, a);
    box(0.18, 0.18, 8.9, glow(accent, 1.1), -side * 4.4, 6.6, 0, a);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(8.4, 6.4),
      new THREE.MeshBasicMaterial({ color: accent, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.1 }));
    back.position.set(side * 4.3, 3.5, 0); back.rotation.y = -side * Math.PI / 2; a.add(back);
    box(8.6, 0.04, 8.6, glow(accent, 0.12), 0, 0.16, 0, a);
    hot(a, [0, 3, 0], [8.8, 6.4, 8.8], { ...info, accent });
    build(a, side);
    return a;
  }

  // Jellyfin — tiny cinema
  alcove(-8, -1, C.purple,
    { title: 'Jellyfin', body: 'The lab’s own cinema — self-hosted streaming for movies, shows and music.' },
    (a, s) => {
      const scr = box(4.6, 2.6, 0.12, glow(0xcdb6ff, 1.4), s * 3.9, 2.6, 0, a);
      scr.rotation.y = -s * Math.PI / 2;
      for (let r = 0; r < 3; r++)
        for (let i = 0; i < 4; i++)
          box(0.8, 0.9, 0.8, lam(0x3b2f4f), s * (0.6 - r * 1.5), 0.45, -1.8 + i * 1.2, a);
    });
  // Minecraft — voxel room
  alcove(-18, 1, C.lime,
    { title: 'Minecraft server', body: 'A little voxel world that never shuts down.' },
    (a) => {
      const grass = lam(0x4d7c0f), dirt = lam(0x574334), wood = lam(0x6b4f2e), leafy = lam(0x3f6212);
      for (let x = 0; x < 4; x++) for (let z = 0; z < 4; z++) {
        const h = 1 + ((x * 7 + z * 3) % 3);
        for (let y = 0; y < h; y++)
          box(1, 1, 1, y === h - 1 ? grass : dirt, -1.5 + x, 0.5 + y, -1.5 + z, a);
      }
      box(1, 1, 1, wood, 0.5, 3.5, -0.5, a); box(1, 1, 1, wood, 0.5, 4.5, -0.5, a);
      [[0.5, 5.5, -0.5], [-0.5, 4.5, -0.5], [1.5, 4.5, -0.5], [0.5, 4.5, -1.5], [0.5, 4.5, 0.5]]
        .forEach(([x, y, z]) => box(1, 1, 1, leafy, x, y, z, a));
    });
  // Home Assistant — house with orbiting rings
  alcove(-28, -1, C.cyan,
    { title: 'Home Assistant', body: 'The smart-home brain — lights, locks, sensors, and way too many automations.' },
    (a) => {
      box(2.4, 1.8, 2.4, lam(0xd6e4dd), 0, 0.9, 0, a);
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.4, 4), lam(0x0ea5e9, { flatShading: true }));
      roof.position.y = 2.5; roof.rotation.y = Math.PI / 4; a.add(roof);
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(2.6 + i * 0.7, 0.05, 8, 48),
          glow(i ? C.mint : 0x7dd3fc, 1.6));
        ring.position.y = 1.6; ring.rotation.x = Math.PI / 2 + (i ? 0.35 : -0.2);
        a.add(ring); spin.push({ o: ring, ax: 'z', v: (i ? -0.5 : 0.7) });
      }
    });
  // Pi-hole + PiVPN — shield gate
  alcove(-38, 1, C.red,
    { title: 'Pi-hole ×2 + PiVPN', body: 'Redundant ad-blocking DNS and a WireGuard tunnel home — the network’s front gate.' },
    (a, s) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.14, 10, 40), glow(0xf87171, 1.5));
      ring.position.y = 2.4; ring.rotation.y = s * Math.PI / 2; a.add(ring);
      const hex = new THREE.Mesh(new THREE.CircleGeometry(1.5, 6),
        new THREE.MeshBasicMaterial({ color: 0x7f1d1d, transparent: true, opacity: 0.55,
          blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false }));
      hex.position.y = 2.4; hex.rotation.y = s * Math.PI / 2; a.add(hex);
      spin.push({ o: hex, ax: 'z', v: 0.4 });
    });
  // *arr stack — media crate library
  alcove(-48, -1, C.amber,
    { title: 'The *arr stack', body: 'Sonarr, Radarr and friends — a fully automated media library.' },
    (a, s) => {
      for (let sh = 0; sh < 3; sh++) {
        box(0.5, 0.14, 7.5, lam(0x232326), s * 3.6, 1.4 + sh * 1.5, 0, a);
        for (let i = 0; i < 8; i++)
          if (Math.random() < 0.85)
            box(0.44, 0.9, 0.62, lam([0xb45309, 0x92400e, 0x78350f][i % 3]),
                s * 3.6, 1.95 + sh * 1.5, -3.2 + i * 0.92, a);
      }
    });
  // Uptime Kuma — status orb wall
  alcove(-56, 1, C.mint,
    { title: 'Uptime Kuma', body: 'A wall of green means a good day — it monitors every service in the lab.' },
    (a, s) => {
      const orbs = [];
      for (let u = 0; u < 8; u++)
        for (let v = 0; v < 4; v++)
          orbs.push({ p: [s * 3.9, 1.6 + v * 1.15, -3 + u * 0.86],
                      c: Math.random() < 0.92 ? C.mint : C.amber, s: 3.2 });
      lights(orbs, a);
    });
});

corridor(-170, 8, C.amber);

/* 4 — PROJECTS: maker workshop --------------------------------------------- */
room(-176, -214, (g) => {
  const R = new THREE.Group(); R.position.z = -178; g.add(R);
  shell(R, 24, 10, 34, { doorAcc: C.blue });

  // workbench with glowing circuit board
  const bench = new THREE.Group(); bench.position.set(-3, 0, -12); R.add(bench);
  box(6.5, 0.3, 2.8, lam(0x4a3b2c), 0, 2, 0, bench);
  [[-3, -1.1], [3, -1.1], [-3, 1.1], [3, 1.1]].forEach(([x, z]) =>
    box(0.25, 2, 0.25, lam(0x232326), x, 1, z, bench));
  box(1.5, 0.08, 1, glow(C.mint, 0.8), -1, 2.2, 0, bench);              // PCB
  box(0.1, 0.7, 0.1, lam(0x9ca3af), 0.6, 2.5, 0.3, bench);              // iron
  const scope = box(1.3, 1, 0.9, lam(0x27272a), 2.2, 2.65, -0.4, bench);
  const trace = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.75),
    new THREE.MeshBasicMaterial({ map: scopeTexture() }));
  trace.position.set(0, 0.02, 0.46); scope.add(trace);
  hot(bench, [-0.5, 2.6, 0], [4, 1.6, 2.6], {
    title: 'The electronics bench', body: 'ESPHome gadgets, embedded hacks, and whatever is currently half-soldered. If I did it right 🤷🏻‍♂️.', accent: C.mint });
  hot(bench, [2.2, 2.65, -0.4], [1.6, 1.3, 1.2], {
    title: 'Earthquake Tracker', body: 'Live seismic activity, visualized — one of a dozen side projects.', accent: C.lime });

  // formula race car with glowing dash
  const car = new THREE.Group(); car.position.set(3.6, 0, -20); car.rotation.y = 0.5; R.add(car);
  box(3.6, 0.5, 1.4, lam(0xb91c1c), 0, 0.6, 0, car);
  box(1.4, 0.45, 1.1, lam(0x7f1d1d), -0.4, 1.05, 0, car);
  box(0.8, 0.28, 0.06, glow(C.mint, 1.8), -0.1, 1.05, 0.0, car).rotation.x = -0.5;
  box(1.5, 0.12, 1.6, lam(0x991b1b), 1.9, 0.95, 0, car);
  [[-1.2, 0.75], [1.2, 0.75], [-1.2, -0.75], [1.2, -0.75]].forEach(([x, z]) => {
    const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 14), lam(0x0a0a0b));
    wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.42, z); car.add(wh);
  });
  hot(car, [0, 0.8, 0], [5, 2, 2.4], {
    title: 'Rutgers Formula Racing Dashboard', body: 'A real-time telemetry dashboard for the team’s race car.', accent: C.red });

  // telescope through a skylight (out of the flight path)
  const tel = new THREE.Group(); tel.position.set(-8.2, 0, -27); R.add(tel);
  const tripod = lam(0x3f3f46);
  [[0.35, 0], [-0.2, 0.3], [-0.2, -0.3]].forEach(([x, z]) => {
    const leg = box(0.12, 3, 0.12, tripod, x * 2, 1.5, z * 2, tel);
    leg.lookAt(new THREE.Vector3(tel.position.x, 3.2, tel.position.z));
  });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.42, 2.6, 16), lam(0xe5e7eb));
  tube.position.set(0, 3.6, 0); tube.rotation.x = 0.7; tel.add(tube);
  box(4.5, 0.32, 3.5, lam(0x0b0f0c), -8.2, 10.1, -27, R);
  const sky = [];
  for (let i = 0; i < 24; i++)
    sky.push({ p: [-8.2 + (Math.random() - 0.5) * 3.6, 11 + Math.random() * 3, -27 + (Math.random() - 0.5) * 2.8],
               c: 0xdbeafe, s: 0.55 });
  lights(sky, R);
  hot(tel, [0, 2.6, 0], [3, 5, 3], {
    title: 'Astrophotography System', body: 'An automated deep-sky imaging rig — the telescope finds, tracks and shoots on its own.', accent: C.blue });

  // 3D printer
  const pr = new THREE.Group(); pr.position.set(7.8, 0, -9); R.add(pr);
  box(2.2, 0.2, 2.2, lam(0x18181b), 0, 1.2, 0, pr);
  box(2, 0.08, 2, glow(0x86efac, 0.9), 0, 1.34, 0, pr);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => box(0.14, 2.6, 0.14, lam(0x27272a), x, 2.5, z, pr));
  box(2.2, 0.14, 0.14, lam(0x27272a), 0, 3.9, -1, pr);
  box(0.3, 0.3, 0.3, lam(0x52525b), 0.3, 2.2, 0, pr);
  hot(pr, [0, 2.2, 0], [3, 4, 3], {
    title: 'The print farm', body: '3D-printed brackets, cases and parts for every other project in this room.', accent: C.pink });

  // disco ball — Partyfy
  const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 1),
    lam(0x9ca3af, { flatShading: true }));
  ball.position.set(2, 8.2, -14); R.add(ball);
  spin.push({ o: ball, ax: 'y', v: 0.8 });
  box(0.06, 1.6, 0.06, lam(0x3f3f46), 2, 9.6, -14, R);
  lights([{ p: [2, 8.2, -14], c: C.purple, s: 2.4 }], R);
  hot(R, [2, 8.2, -14], [2, 2, 2], {
    title: 'Partyfy', body: 'A collaborative Spotify queue for parties — the crowd DJs, the host keeps veto power.', accent: C.purple });

  // mini jumbotron on the wall
  const jumbo = box(0.18, 1.9, 3.2, lam(0x0a0a0b), -11.5, 5.5, -18, R);
  const jscr = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 1.6),
    new THREE.MeshBasicMaterial({ color: 0x1d4ed8 }));
  jscr.position.set(0.1, 0, 0); jscr.rotation.y = Math.PI / 2; jumbo.add(jscr);
  lights([{ p: [-11.1, 5.5, -18], c: C.blue, s: 2 }], R);
  hot(R, [-11.5, 5.5, -18], [1, 2.4, 3.6], {
    title: 'Jumbotron', body: 'An LED array of 3k - to display messages, countdowns, or low-res photos.', accent: C.blue });

  // pegboard + LED strip
  box(6, 3, 0.12, lam(0x292524), -8, 4.5, -5.8, R);
  box(6, 0.06, 0.1, glow(C.amber, 1.4), -8, 6.1, -5.7, R);
  box(4, 0.5, 0.2, glow(C.mint, 1.2), 0, 0.3, -33.9, R);               // light under garage door
});

/* courtyard transition */
room(-214, -224, (g) => {
  const R = new THREE.Group(); R.position.z = -214; g.add(R);
  box(14, 0.3, 10, lam(0x18181b), 0, -0.15, -5, R);
  [-4, 4].forEach((x) => {
    box(0.18, 3.4, 0.18, lam(0x3f3f46), x, 1.7, -5, R);
    lights([{ p: [x, 3.6, -5], c: C.warm, s: 4 }], R);
  });
});

/* 5 — WORK: ServiceNow glass atrium (cool blue accents) --------------------- */
room(-224, -266, (g) => {
  const R = new THREE.Group(); R.position.z = -224; g.add(R);
  const W = 30, H = 24, D = 42;
  box(W, 0.3, D, lam(0x1a1c1e), 0, -0.15, -D / 2, R);
  const glass = new THREE.MeshLambertMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.07, side: THREE.DoubleSide });
  [-W / 2, W / 2].forEach((x) => box(0.2, H, D, glass, x, H / 2, -D / 2, R));
  box(W, 0.4, D, lam(0x151517), 0, H, -D / 2, R);
  for (let i = 0; i <= 6; i++)
    [-W / 2, W / 2].forEach((x) => box(0.22, H, 0.22, lam(0x232326), x, H / 2, -i * 7, R));

  const JOBS = [
    ['Mirion Technologies', 'Software Engineer, 2023–24 — full-stack development on WebOLO.', C.amber],
    ['ServiceNow — intern', 'Associate SWE Intern, summer 2024 — Platform Security: Access Controls.', C.cyan],
    ['ServiceNow', 'Associate Software Engineer, 2025–present — Platform Security: Crypto Core.', C.blue],
  ];
  const deskLeds = [];
  for (let f = 1; f <= 3; f++) {
    const y = f * 5.5;
    const [jt, jb, ja] = JOBS[f - 1];
    [-1, 1].forEach((s) => {
      box(9, 0.35, D - 4, lam(0x2a2a30), s * (W / 2 - 4.5), y, -D / 2, R);
      box(0.1, 0.16, D - 4, glow(ja, 0.8), s * (W / 2 - 9), y + 0.1, -D / 2, R);
      for (let i = 0; i < 8; i++) {
        const z = -5 - i * 4.4;
        box(1.3, 0.1, 0.7, lam(0x27272a), s * (W / 2 - 4.5) + (i % 2 ? 1.4 : -1.4), y + 0.45, z, R);
        deskLeds.push({ p: [s * (W / 2 - 4.5) + (i % 2 ? 1.4 : -1.4), y + 0.75, z],
                        c: Math.random() < 0.6 ? 0xdbeafe : C.cyan, s: 1.5 });
      }
      hot(R, [s * (W / 2 - 4.5), y + 1, -D / 2], [9.5, 2.4, D - 4], { title: jt, body: jb, accent: ja });
    });
  }
  lights(deskLeds, R);
  // low planters — greenery that can't block the flight lane
  [[-6, -26], [6, -30], [-6, -34]].forEach(([px, pz]) => {
    box(2.6, 0.8, 2.6, lam(0x33333a), px, 0.4, pz, R);
    const shrub = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.MeshLambertMaterial({ color: 0x1f7a3d, flatShading: true, emissive: 0x14532d, emissiveIntensity: 0.2 }));
    shrub.position.set(px, 1.5, pz); R.add(shrub);
  });
  // emblem ring above the far exit — always ahead of the crane move
  const emblem = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.18, 10, 48), glow(C.cyan, 1.1));
  emblem.position.set(0, 16, -39); R.add(emblem);
  spin.push({ o: emblem, ax: 'y', v: 0.4 });
  const emblemCore = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), glow(0xdbeafe, 1.1));
  emblemCore.position.copy(emblem.position); R.add(emblemCore);
  const ramp = box(2.4, 0.25, 12, lam(0x232326), -6, 3, -10, R);
  ramp.rotation.x = 0.42;
  box(0.08, 0.5, 12, glow(C.cyan, 1.3), -7.2, 3.4, -10, R).rotation.x = 0.42;
  box(0.08, 0.5, 12, glow(C.cyan, 1.3), -4.8, 3.4, -10, R).rotation.x = 0.42;
  hot(R, [-6, 3.6, -10], [3.4, 3, 12], {
    title: 'Hack4Impact Rutgers', body: 'Frontend Engineering Director — led the team building an app for MealsOnWheels.', accent: C.mint });
});

/* 6 — EDUCATION: Rutgers quad at night (warm brick + scarlet) ---------------- */
room(-266, -356, (g) => {
  const R = new THREE.Group(); R.position.z = -266; g.add(R);
  box(140, 0.3, 110, lam(0x14181a), 0, -0.15, -50, R);
  box(3.2, 0.06, 100, lam(0x3f3f46), 0, 0.02, -50, R);
  box(3.2, 0.02, 100, glow(0x365314, 0.4), 0, 0.06, -50, R);

  const brick = lam(0x7c2d12), brick2 = lam(0x6b2410), roofM = lam(0x1c1917);
  const winLights = [];
  function building(x, z, w, d, h, m) {
    box(w, h, d, m, x, h / 2, z, R);
    box(w + 1, 0.6, d + 1, roofM, x, h + 0.3, z, R);
    const cols = Math.floor(w / 2.4), rows = Math.floor(h / 2.6);
    for (let i = 0; i < cols; i++)
      for (let j = 0; j < rows; j++)
        if (Math.random() < 0.78)
          winLights.push({ p: [x - w / 2 + 1.2 + i * 2.4, 1.8 + j * 2.6, z + d / 2 + 0.15],
                           c: C.warm, s: 2.6 });
  }
  building(-16, -30, 18, 10, 9, brick);
  building(17, -38, 20, 12, 11, brick2);
  building(-20, -62, 22, 12, 8, brick2);
  building(18, -70, 16, 10, 12, brick);
  hot(R, [17, 5.5, -38], [21, 12, 13], {
    title: 'Hack4Impact Rutgers', body: 'Where the frontend team met — building software for nonprofits.', accent: C.mint });

  // clock tower — the landmark
  box(5, 26, 5, brick, -16, 13, -85, R);
  const face = new THREE.Mesh(new THREE.CircleGeometry(1.5, 24), glow(0xfef3c7, 1.2));
  face.position.set(-16, 21, -82.4); R.add(face);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(3.4, 4, 4), roofM);
  spire.position.set(-16, 28, -85); spire.rotation.y = Math.PI / 4; R.add(spire);
  hot(R, [-16, 14, -85], [7, 30, 7], {
    title: 'Rutgers University', body: 'B.S. in Computer Science — and a scarlet R on everything.', accent: C.red });

  // lamp posts with scarlet banners
  const lampGlow = [];
  for (let i = 0; i < 8; i++) {
    const z = -12 - i * 11, x = (i % 2 ? 2.6 : -2.6);
    box(0.16, 3.6, 0.16, lam(0x3f3f46), x, 1.8, z, R);
    box(0.5, 1.1, 0.06, glow(C.red, 0.5), x + (i % 2 ? -0.4 : 0.4), 2.7, z, R);
    lampGlow.push({ p: [x, 3.8, z], c: C.warm, s: 4.5 });
  }
  lights(lampGlow.concat(winLights), R);
  const treeLights = [];
  for (let i = 0; i < 10; i++) {
    const x = (i % 2 ? -1 : 1) * (6 + Math.random() * 20), z = -15 - i * 8.5;
    const t = new THREE.Mesh(new THREE.ConeGeometry(1.8 + Math.random(), 4 + Math.random() * 2, 7),
      lam(0x1a2e1a, { flatShading: true }));
    t.position.set(x, 2.4, z); R.add(t);
    box(0.3, 1.4, 0.3, lam(0x44403c), x, 0.7, z, R);
    for (let k = 0; k < 6; k++)
      treeLights.push({ p: [x + (Math.random() - 0.5) * 2.6, 1.5 + Math.random() * 3.4, z + (Math.random() - 0.5) * 2.6],
                        c: pick(MIX_FEST), s: 1.3 });
  }
  lights(treeLights, R);
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 0.9, 18), lam(0x44403c));
  basin.position.set(8, 0.45, -50); R.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 2.7, 0.2, 18), glow(0x67e8f9, 0.45));
  water.position.set(8, 0.85, -50); R.add(water);
  hot(R, [8, 1, -50], [7, 3, 7], {
    title: 'Mathathon', body: 'Hackathon roots — one of the first big builds, back on this quad.', accent: C.cyan });
}, 140);

/* 7 — FINALE: rooftop above the glowing city + social satellites ------------ */
const satellites = [];
room(-356, -460, (g) => {
  const city = [];
  for (let i = 0; i < 2600; i++) {
    const x = (Math.random() - 0.5) * 640, z = -400 + (Math.random() - 0.5) * 560;
    if (Math.abs(x) < 18 && Math.abs(z + 400) < 18) continue;
    city.push({ p: [x, Math.random() * 14, z], c: pick(MIX_CITY), s: 1.1 + Math.random() * 1.6 });
  }
  lights(city, g);
  const towerM = lam(0x0d0d0f);
  for (let i = 0; i < 60; i++) {
    const x = (Math.random() - 0.5) * 500, z = -400 + (Math.random() - 0.5) * 440;
    if (Math.abs(x) < 30 && Math.abs(z + 400) < 30) continue;
    const th = 6 + Math.random() * 22;
    box(4 + Math.random() * 8, th, 4 + Math.random() * 8, towerM, x, th / 2, z, g);
  }
  const stars = [];
  for (let i = 0; i < 500; i++) {
    const a = Math.random() * Math.PI * 2, r = 260 + Math.random() * 140;
    stars.push({ p: [Math.cos(a) * r, 60 + Math.random() * 200, -400 + Math.sin(a) * r],
                 c: 0xe2e8f0, s: 0.8 });
  }
  lights(stars, g);

  const T = new THREE.Group(); T.position.set(0, 27.2, -400); g.add(T);
  const slab = new THREE.Mesh(new THREE.CylinderGeometry(13, 14.5, 1.6, 28), lam(0x1b1b1e));
  slab.position.y = -0.8; T.add(slab);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(13, 0.09, 8, 56), glow(C.green, 1.6));
  rim.rotation.x = Math.PI / 2; rim.position.y = 0.02; T.add(rim);
  const rail = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    box(0.09, 1.1, 0.09, lam(0x3f3f46), Math.cos(a) * 12.6, 0.55, Math.sin(a) * 12.6, T);
    rail.push({ p: [Math.cos(a) * 12.6, 1.25, Math.sin(a) * 12.6], c: pick(MIX_FEST), s: 1.7 });
  }
  lights(rail, T);
  const railRing = new THREE.Mesh(new THREE.TorusGeometry(12.6, 0.05, 6, 56), lam(0x52525b));
  railRing.rotation.x = Math.PI / 2; railRing.position.y = 1.1; T.add(railRing);
  [[-5, 3, 0.5], [-6.5, 0.5, 1.2], [5.5, 4, -0.7]].forEach(([x, z, ry]) => {
    const st = new THREE.Group(); st.position.set(x, 0, z); st.rotation.y = ry; T.add(st);
    box(2.2, 0.5, 1, lam(0x27272a), 0, 0.25, 0, st);
    box(2.2, 0.8, 0.25, lam(0x27272a), 0, 0.8, -0.5, st);
  });
  const tt = new THREE.Group(); tt.position.set(8, 0, 7); tt.rotation.y = -0.8; T.add(tt);
  box(0.12, 1.4, 0.12, lam(0x3f3f46), 0, 0.7, 0, tt);
  const ttube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 1.2, 12), lam(0xe5e7eb));
  ttube.position.y = 1.6; ttube.rotation.x = 0.9; tt.add(ttube);

  // THE BEACON
  const orb = new THREE.Mesh(new THREE.SphereGeometry(1.7, 32, 24), glow(C.mint, 1.0));
  orb.position.set(0, 3.4, 0); T.add(orb);
  spin.push({ o: orb, ax: 'y', v: 0.3, bob: 0.35, baseY: 3.4 });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.5, 24, 18),
    new THREE.MeshBasicMaterial({ color: C.mint, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.07 }));
  halo.position.copy(orb.position); T.add(halo);
  const orbRing = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.05, 8, 48), glow(C.green, 1.6));
  orbRing.position.copy(orb.position); orbRing.rotation.x = Math.PI / 2.4; T.add(orbRing);
  spin.push({ o: orbRing, ax: 'z', v: 0.6 });

  // SOCIAL SATELLITES — glowing badges orbiting the beacon; hover to see, click to open
  const SOCIALS = [
    ['gh', '#f4f4f5', 'GitHub', 'github.com/mv5903 — where the code lives.', 'https://github.com/mv5903'],
    ['in', '#60a5fa', 'LinkedIn', 'The professional-face version of all this.', 'https://www.linkedin.com/in/matthew-vandenberg'],
    ['@',  '#4ade80', 'Email', 'mv5903@gmail.com — the fastest way to reach me.', 'mailto:mv5903@gmail.com'],
    ['ig', '#f472b6', 'Instagram', 'For the more personal-side.', 'https://instagram.com/msvan59'],
  ];
  SOCIALS.forEach(([glyph, colHex, title, body, href], i) => {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glyphTexture(glyph, colHex), transparent: true }));
    spr.scale.set(1.9, 1.9, 1);
    T.add(spr);
    satellites.push({ spr, base: 1.9,
      r: 5.6 + (i % 3) * 1.3, speed: 0.14 + (i % 2) * 0.05,
      phase: (i / SOCIALS.length) * Math.PI * 2, incline: 0.45 + (i % 3) * 0.5 });
    const h = { mesh: spr, edges: null,
      info: { title, body, accent: new THREE.Color(colHex).getHex(), href }, room: g };
    spr.userData.h = h;
    hotspots.push(h); rayTargets.push(spr);
  });
}, 400);

/* ------------------------------------------------------------ camera path */
/* Gates split so each section's scroll band CENTERS on its room's showpiece —
   the transit point at a room's exit belongs to the NEXT section. */
const P = (x, y, z) => new THREE.Vector3(x, y, z);
const gates = [];
const pts = [];
function gate() { gates.push(pts.length); }

gate(); // hero: entrance → desk → door
pts.push(P(0, 3.5, 7), P(0, 3.2, -4), P(1.4, 3.0, -10.5), P(0.9, 3.1, -18), P(0, 3.2, -27));
gate(); // rack: corridor → down the aisle
pts.push(P(0, 3.1, -31), P(0, 3.0, -44), P(0, 2.8, -62), P(0, 2.8, -80), P(0, 3.0, -93));
gate(); // services: corridor → weave past the alcoves
pts.push(P(0, 3.1, -99), P(2.0, 3.0, -112), P(-2.0, 3.0, -126), P(2.0, 3.0, -140), P(-1.6, 3.0, -154), P(0, 3.1, -167));
gate(); // workshop: corridor → bench → car → garage door
pts.push(P(0, 3.1, -173), P(-0.8, 3.1, -184), P(-0.9, 3.0, -191), P(0.8, 3.1, -201), P(0, 3.2, -211));
gate(); // work: courtyard → crane-up through the atrium
pts.push(P(0, 3.4, -218), P(0, 3.6, -228), P(0, 7.5, -240), P(0, 11.5, -251), P(0, 7, -259));
gate(); // campus: glass exit → arc over the quad → hilltop
pts.push(P(0, 4.6, -266), P(0, 5, -280), P(0, 8, -300), P(1, 9, -316), P(0, 8, -333));
gate(); // finale: the climb → orbit the beacon → drift over the city
pts.push(P(0, 11, -349), P(0, 17, -363), P(0, 25, -378), P(0, 29, -389),
         P(7.5, 29.6, -393.5), P(9.8, 30.1, -400), P(6.8, 30.6, -406.8), P(0, 30.8, -409.5),
         P(-6.2, 30.9, -405.5), P(-4.5, 30.5, -414), P(-1.5, 30.2, -424), P(0, 30, -436));

const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
curve.arcLengthDivisions = 2400;
const totalLen = curve.getLength();
const gateU = gates.map((gi) => {
  const t = gi / (pts.length - 1);
  let len = 0; const steps = 800; let prev = curve.getPoint(0);
  for (let i = 1; i <= steps; i++) {
    const p = curve.getPoint((i / steps) * t);
    len += p.distanceTo(prev); prev = p;
  }
  return len / totalLen;
});
gateU.push(1);

/* ------------------------------------------------------- scroll & overlay */
const weights = SECTIONS.map((s) => s.weight);
const totalW = weights.reduce((a, b) => a + b, 0);
const secStartW = []; { let a = 0; for (const w of weights) { secStartW.push(a); a += w; } }

const spacer = document.getElementById('spacer');
function layout() { spacer.style.height = (totalW * 100 + 55) + 'vh'; }
layout();

const overlay = document.getElementById('overlay');
const secEls = SECTIONS.map((s) => {
  const el = document.createElement('section');
  el.className = 'copy';
  el.style.setProperty('--acc', s.accent);
  el.innerHTML =
    `<p class="eyebrow">${s.eyebrow}</p><h2>${s.title}</h2><p class="body">${s.body}</p>` +
    (s.tags.length ? `<div class="tags">${s.tags.map((t) => `<span>${t}</span>`).join('')}</div>` : '');
  overlay.appendChild(el);
  return el;
});

const rail = document.getElementById('rail');
SECTIONS.forEach((s, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', s.label);
  b.style.setProperty('--acc', s.accent);
  b.innerHTML = `<i></i><em>${s.label}</em>`;
  b.addEventListener('click', () => {
    scrollTo({ top: (secStartW[i] / totalW) * (spacer.offsetHeight - innerHeight) + 2, behavior: 'smooth' });
  });
  rail.appendChild(b);
});
const railBtns = [...rail.children];

const hint = document.getElementById('hint');
const tip = document.getElementById('tip');

/* linger remap: slow through the middle of a section, normal at the seams */
function remap(p, l) {
  const a = Math.min(0.85, l * 1.4);
  return p + (a / (2 * Math.PI)) * Math.sin(2 * Math.PI * p);
}

let target = 0, current = 0;
function onScroll() {
  const max = spacer.offsetHeight - innerHeight;
  target = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  if (scrollY > 40) hint.classList.add('gone');
}
addEventListener('scroll', onScroll, { passive: true });

function scrollToU(sf) {
  const x = sf * totalW;
  let i = weights.length - 1;
  for (let k = 0; k < weights.length; k++)
    if (x < secStartW[k] + weights[k]) { i = k; break; }
  const p = Math.min(1, Math.max(0, (x - secStartW[i]) / weights[i]));
  const q = remap(p, SECTIONS[i].linger || 0);
  return { u: gateU[i] + (gateU[i + 1] - gateU[i]) * q, i, p };
}

/* --------------------------------------------------- pointer & hotspots -- */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let pointerDirty = false, hovered = null, pointerPx = { x: 0, y: 0 };

function trackPointer(e) {
  pointer.x = (e.clientX / innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / innerHeight) * 2 + 1;
  pointerPx = { x: e.clientX, y: e.clientY };
  pointerDirty = true;
}
addEventListener('pointermove', trackPointer);
addEventListener('pointerdown', trackPointer);
addEventListener('click', () => {
  if (hovered && hovered.info.href) open(hovered.info.href, '_blank', 'noopener');
});

function setHover(h) {
  if (hovered === h) return;
  if (hovered) {
    if (hovered.edges) { hovered.edges.visible = false; hovered.mesh.material.opacity = 0; }
    if (hovered.mesh.isSprite) { const s = satellites.find((q) => q.spr === hovered.mesh); if (s) s.hover = false; }
  }
  hovered = h;
  if (h) {
    if (h.edges) { h.edges.visible = true; h.mesh.material.opacity = 0.09; }
    if (h.mesh.isSprite) { const s = satellites.find((q) => q.spr === h.mesh); if (s) s.hover = true; }
    const acc = '#' + new THREE.Color(h.info.accent).getHexString();
    tip.innerHTML = `<b style="color:${acc}">${h.info.title}</b><p>${h.info.body}</p>` +
      (h.info.href ? `<span class="go">click to open ↗</span>` : '');
    tip.style.opacity = 1;
    document.body.style.cursor = h.info.href ? 'pointer' : 'default';
  } else {
    tip.style.opacity = 0;
    document.body.style.cursor = '';
  }
}

function placeTip() {
  if (!hovered) return;
  const pad = 16, w = tip.offsetWidth, hgt = tip.offsetHeight;
  let x = pointerPx.x + pad, y = pointerPx.y + pad;
  if (x + w > innerWidth - 8) x = pointerPx.x - w - pad;
  if (y + hgt > innerHeight - 8) y = pointerPx.y - hgt - pad;
  tip.style.transform = `translate(${x}px, ${y}px)`;
}

function hoverCheck() {
  if (!pointerDirty) return;
  pointerDirty = false;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(rayTargets, false);
  let h = null;
  for (const hit of hits) {
    const cand = hit.object.userData.h;
    if (cand && cand.room && !cand.room.visible) continue;
    if (hit.distance > 80) continue;
    h = cand; break;
  }
  setHover(h);
  placeTip();
}

/* --------------------------------------------------------------- animate */
const focusV = new THREE.Vector3(), tanV = new THREE.Vector3(), lookV = new THREE.Vector3();
let lastT = performance.now();
let activeSec = -1;

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

function setCopy(i, p) {
  secEls.forEach((el, k) => {
    let o = 0;
    if (k === i) {
      const inE = k === 0 ? 1 : smooth(0.14, 0.32, p);
      const outE = k === SECTIONS.length - 1 ? 1 : 1 - smooth(0.72, 0.92, p);
      o = Math.min(inE, outE);
    }
    el.style.opacity = o.toFixed(3);
    el.style.visibility = o > 0.01 ? 'visible' : 'hidden';
    el.style.transform = `translateY(${(1 - o) * 14}px)`;
  });
  if (i !== activeSec) {
    activeSec = i;
    railBtns.forEach((b, k) => b.classList.toggle('on', k === i));
  }
}

function frame(now) {
  requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;

  current += (target - current) * (1 - Math.exp(-dt * 5.2));
  if (Math.abs(target - current) < 0.00004) current = target;

  const { u, i, p } = scrollToU(current);
  const pos = curve.getPointAt(Math.min(u, 0.99995));
  camera.position.copy(pos);

  const ahead = curve.getPointAt(Math.min(u + 0.006, 1));
  lookV.copy(ahead);
  const S = SECTIONS[i];
  if (S.focus) {
    let w = S.fs * Math.sin(Math.min(1, p * 1.2) * Math.PI);
    if (i === SECTIONS.length - 1)
      w = S.fs * smooth(0.02, 0.18, p) * (1 - smooth(0.72, 0.94, p));
    focusV.set(...S.focus);
    lookV.lerp(focusV, Math.min(1, Math.max(0, w)));
  }
  camera.lookAt(lookV);
  camera.position.y += Math.sin(now * 0.0011) * 0.04;

  headlight.position.copy(camera.position).add(tanV.subVectors(ahead, pos).setLength(2));

  const far = (i >= 5) ? 420 : (i === 4 ? 190 : 120);
  scene.fog.far += (far - scene.fog.far) * (1 - Math.exp(-dt * 3));

  const cz = camera.position.z;
  for (const r of rooms)
    r.group.visible = cz < r.zmin + r.margin && cz > r.zmax - r.margin;

  ledUniforms.uTime.value = now / 1000;
  for (const s of spin) {
    s.o.rotation[s.ax] += s.v * dt;
    if (s.bob) s.o.position.y = s.baseY + Math.sin(now * 0.0012) * s.bob;
  }
  // satellites orbit the beacon (terrace-local: beacon at y 3.4)
  const t = now / 1000;
  for (const s of satellites) {
    const a = s.phase + t * s.speed * Math.PI * 2 * 0.28;
    s.spr.position.set(Math.cos(a) * s.r, 3.4 + Math.sin(a * 1.7 + s.incline) * 1.6, Math.sin(a) * s.r);
    const sc = s.base * (s.hover ? 1.35 : 1);
    s.spr.scale.x += (sc - s.spr.scale.x) * 0.2;
    s.spr.scale.y = s.spr.scale.x;
  }

  hoverCheck();
  setCopy(i, p);

  if (composer) composer.render(); else renderer.render(scene, camera);
}

/* ------------------------------------------------------------- resize etc */
let lastW = innerWidth;
addEventListener('resize', () => {
  if (coarse && innerWidth === lastW) return;   // URL-bar height-only resize
  lastW = innerWidth;
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  if (composer) composer.setSize(innerWidth, innerHeight);
  ledUniforms.uPx.value = innerHeight;
  layout();
  onScroll();
});
addEventListener('orientationchange', () => { lastW = 0; dispatchEvent(new Event('resize')); });

document.addEventListener('visibilitychange', () => { lastT = performance.now(); });

function staticFallback() {
  document.body.classList.add('static');
  overlay.classList.add('stack');
}

window.__sw = { camera, rooms, curve, gateU, scrollToU, get cur() { return current; } };

if (reduce) {
  staticFallback();
  const { u } = scrollToU(0.06);
  camera.position.copy(curve.getPointAt(u));
  camera.lookAt(curve.getPointAt(u + 0.01));
  renderer.render(scene, camera);
  secEls.forEach((el) => { el.style.opacity = 1; el.style.visibility = 'visible'; el.style.transform = 'none'; });
} else {
  onScroll();
  requestAnimationFrame(frame);
}

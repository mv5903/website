import * as THREE from '/Users/matt/github/website-scrollworld/node_modules/three/build/three.module.js';
const P=(x,y,z)=>new THREE.Vector3(x,y,z);
const gates=[]; const pts=[];
function gate(){gates.push(pts.length)}
gate();pts.push(P(0,3.5,7),P(0,3.1,-4),P(2.4,2.8,-11),P(1.2,3.0,-18),P(0,3.2,-27),P(0,3.1,-31));
gate();pts.push(P(0,3.0,-44),P(0,2.8,-62),P(0,2.8,-80),P(0,3.0,-93),P(0,3.1,-99));
gate();pts.push(P(2.0,3.0,-112),P(-2.0,3.0,-126),P(2.0,3.0,-140),P(-1.6,3.0,-154),P(0,3.1,-167),P(0,3.1,-173));
gate();pts.push(P(-1.2,2.9,-184),P(-1.7,2.7,-190),P(0.6,2.9,-201),P(0,3.1,-211),P(0,3.4,-218));
gate();pts.push(P(0,3.6,-228),P(0,7.5,-240),P(0,11.5,-251),P(0,7,-259),P(0,4.6,-266));
gate();pts.push(P(0,5,-280),P(0,10,-300),P(1,12,-316),P(0,8.5,-333),P(0,11,-349));
gate();pts.push(P(0,17,-363),P(0,25,-378),P(0,29,-389),P(7.5,29.6,-393.5),P(9.8,30.1,-400),P(6.8,30.6,-406.8),P(0,30.8,-409.5),P(-6.2,30.9,-405.5),P(-4.5,30.5,-414),P(-1.5,30.2,-424),P(0,30,-436));
const curve=new THREE.CatmullRomCurve3(pts,false,'centripetal',0.5);
curve.arcLengthDivisions=2400;
const totalLen=curve.getLength();
const gateU=gates.map(gi=>{
  const t=gi/(pts.length-1);
  let len=0;const steps=800;let prev=curve.getPoint(0);
  for(let i=1;i<=steps;i++){const p=curve.getPoint((i/steps)*t);len+=p.distanceTo(prev);prev=p;}
  return len/totalLen;
});
gateU.push(1);
console.log('gateU:',gateU.map(u=>u.toFixed(4)).join(' '));
const names=['hero','rack','services','workshop','work','campus','finale'];
names.forEach((n,i)=>{
  const u0=gateU[i], u1=gateU[i+1];
  const z0=curve.getPointAt(u0).z.toFixed(1), zm=curve.getPointAt((u0+u1)/2).z.toFixed(1), z1=curve.getPointAt(u1-0.0001).z.toFixed(1);
  console.log(`${n}: z start ${z0}  mid ${zm}  end ${z1}`);
});
// where SHOULD gates be: z of first point of each section
gates.forEach((gi,i)=>console.log(names[i],'first pt z',pts[gi].z, ' -> u point z', curve.getPointAt(gateU[i]).z.toFixed(1)));

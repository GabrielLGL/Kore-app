import { readFileSync } from 'fs';

const html = readFileSync('./lighthouse-report.html', 'utf8');

// Lighthouse embeds JSON as: window.__LIGHTHOUSE_JSON__ = {...};
const start = html.indexOf('window.__LIGHTHOUSE_JSON__ = ') + 'window.__LIGHTHOUSE_JSON__ = '.length;
const end = html.indexOf(';\n</script>', start);
const data = JSON.parse(html.slice(start, end));

console.log('\n╔══════════════════════════════╗');
console.log('║     LIGHTHOUSE SCORES        ║');
console.log('╚══════════════════════════════╝');
for (const [, cat] of Object.entries(data.categories)) {
  const score = Math.round(cat.score * 100);
  const bar = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';
  console.log(`${bar} ${cat.title.padEnd(20)} ${score}/100`);
}

console.log('\n── Core Web Vitals ──');
const vitals = ['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index','interactive'];
for (const id of vitals) {
  const a = data.audits[id];
  if (!a) continue;
  const score = a.score !== null ? (a.score >= 0.9 ? '🟢' : a.score >= 0.5 ? '🟠' : '🔴') : '⚪';
  console.log(`${score} ${a.title.padEnd(35)} ${a.displayValue ?? ''}`);
}

console.log('\n── Audits Failed (score < 0.9) ──');
const failed = Object.values(data.audits)
  .filter(a => a.score !== null && a.score < 0.9)
  .sort((a, b) => a.score - b.score);
for (const a of failed) {
  const score = Math.round(a.score * 100);
  console.log(`[${String(score).padStart(3)}] ${a.title}`);
}

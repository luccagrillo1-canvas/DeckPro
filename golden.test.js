// Golden-master export tests.
//
// For each deck fixture in test/fixtures/decks/*.json we build the presentation,
// reduce it to a STABLE structure (ignoring volatile UUIDs), and compare against
// the committed snapshot in test/fixtures/expected/<name>.json.
//
// This catches "export technically succeeded but the deck is wrong" — slides
// dropped, macros missing, wrong cue order, lost transitions, verse-number flags
// flipped, etc.
//
// Regenerate snapshots after an intentional change:  UPDATE=1 node golden.test.js
//   (review the git diff before committing — that diff IS the behavior change.)

const fs = require('fs');
const path = require('path');
const { buildPresentation } = require('./builder.js');

const DECKS_DIR = path.join(__dirname, 'test/fixtures/decks');
const EXPECTED_DIR = path.join(__dirname, 'test/fixtures/expected');
const UPDATE = process.env.UPDATE === '1';

let pass = 0, fail = 0;

// ---- Extract readable, stable text + format flags from a base64 RTF blob ----
function rtfStable(b64) {
  if (!b64) return { text: '', super: false, bold: false };
  let s;
  try { s = Buffer.from(b64, 'base64').toString('utf8'); } catch { return { text: '?', super: false, bold: false }; }
  const hasSuper = /\\super\b/.test(s);
  const hasBold = /\\b\b/.test(s) || /\\f1\b/.test(s);
  const W1252 = {
    85: '…',
    91: '‘',
    92: '’',
    93: '“',
    94: '”',
    95: '•',
    96: '–',
    97: '—',
  };
  // Strip header groups (fonttbl/colortbl/expandedcolortbl), then control words + braces.
  let t = s
    .replace(/\{\\fonttbl[\s\S]*?\}/g, '')
    .replace(/\{\\colortbl[\s\S]*?\}/g, '')
    .replace(/\{\\\*\\expandedcolortbl[\s\S]*?\}/g, '')
    .replace(/\\'([0-9a-fA-F]{2})/g, (_, h) => W1252[h.toLowerCase()] || String.fromCharCode(parseInt(h, 16)))
    .replace(/\\~/g, ' ')
    .replace(/\\\n/g, '\n')
    .replace(/\\[a-zA-Z]+-?\d* ?/g, '')
    .replace(/[{}]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
  return { text: t, super: hasSuper, bold: hasBold };
}

function normalizeAction(a) {
  const o = { type: a.type.replace('ACTION_TYPE_', '') };
  if (a.type === 'ACTION_TYPE_MACRO') o.macro = a.macro?.identification?.parameterName ?? null;
  if (a.type === 'ACTION_TYPE_PROP') o.prop = a.prop?.identification?.parameterName ?? null;
  if (a.type === 'ACTION_TYPE_CLEAR') o.clear = a.clear?.targetLayer ?? true;
  if (a.type === 'ACTION_TYPE_STAGE_LAYOUT') {
    const asg = a.stage?.stageScreenAssignments?.[0];
    o.stageLayout = asg?.layout?.parameterName ?? null;
    o.stageScreen = asg?.screen?.parameterName ?? null;
  }
  if (a.type === 'ACTION_TYPE_PRESENTATION_SLIDE') {
    o.label = a.label?.text ?? null;
    o.transitionDuration = a.slide?.presentation?.transition?.duration ?? null;
    const els = a.slide?.presentation?.baseSlide?.elements || [];
    o.bodies = els
      .map(s => s.element)
      .filter(e => e?.text?.rtfData)
      .map(e => rtfStable(e.text.rtfData))
      .filter(b => b.text !== '');
  }
  return o;
}

function normalize(pres) {
  const cues = pres.cues || [];
  return {
    cueCount: cues.length,
    cues: cues.map(c => ({
      name: c.name ?? null,
      actions: (c.actions || []).map(normalizeAction),
    })),
  };
}

function diffPaths(a, b, base = '') {
  // Shallow-ish recursive diff returning the first few differing paths.
  const out = [];
  const ja = JSON.stringify(a), jb = JSON.stringify(b);
  if (ja === jb) return out;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) {
    out.push(`${base}: ${ja} !== ${jb}`);
    return out;
  }
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (out.length >= 6) break;
    out.push(...diffPaths(a[k], b[k], base ? `${base}.${k}` : k));
  }
  return out;
}

if (!fs.existsSync(DECKS_DIR)) { console.log('❌ no fixtures dir'); process.exit(1); }
if (UPDATE && !fs.existsSync(EXPECTED_DIR)) fs.mkdirSync(EXPECTED_DIR, { recursive: true });

const files = fs.readdirSync(DECKS_DIR).filter(f => f.endsWith('.json')).sort();
for (const file of files) {
  const name = file.replace(/\.json$/, '');
  const spec = JSON.parse(fs.readFileSync(path.join(DECKS_DIR, file), 'utf8'));
  let actual;
  try { actual = normalize(buildPresentation(spec, {})); }
  catch (e) { console.log('❌', name, '— threw:', e.message); fail++; continue; }

  const expPath = path.join(EXPECTED_DIR, `${name}.json`);
  if (UPDATE) {
    fs.writeFileSync(expPath, JSON.stringify(actual, null, 2) + '\n');
    console.log('📸', name, `— snapshot written (${actual.cueCount} cues)`);
    pass++;
    continue;
  }
  if (!fs.existsSync(expPath)) { console.log('❌', name, '— no snapshot (run UPDATE=1)'); fail++; continue; }
  const expected = JSON.parse(fs.readFileSync(expPath, 'utf8'));
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log('✅', name, `(${actual.cueCount} cues)`);
    pass++;
  } else {
    console.log('❌', name, '— differs from snapshot:');
    for (const d of diffPaths(expected, actual)) console.log('    ', d);
    fail++;
  }
}

console.log(`\n${pass} passed, ${fail} failed${UPDATE ? ' (snapshots updated)' : ''}`);
process.exit(fail ? 1 : 0);

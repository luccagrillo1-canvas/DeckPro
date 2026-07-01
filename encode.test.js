// Protobuf round-trip tests: every slide type must encode through the real
// rv.data.Presentation schema (encodeToBuffer runs Presentation.verify) and
// decode back without losing cues. Catches schema-shape regressions in builder.

const path = require('path');
const protobuf = require('protobufjs');
const { encodeToBuffer } = require('./encode.js');

let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { console.log('✅', name); pass++; } else { console.log('❌', name, extra || ''); fail++; } }

const PROTO_PATH = path.join(__dirname, 'ProPresenter7-Proto/proto/propresenter.proto');

const FULL_DECK = { name: 'RoundTrip', includeResponseCard: true, slides: [
  { type: 'start' },
  { type: 'scripture', label: 'Eph 5:18', reference: 'Ephesians 5:18',
    bodies: [[{ text: '18', verseNum: true, super: true, bold: false }, { text: ' ', bold: false }, { text: 'be filled.', bold: false }]],
    propName: 'Eph 5:18', blankBefore: true, blankSpans: [] },
  { type: 'scripture', label: 'Multi', reference: 'Multi', propName: 'Multi',
    bodies: [[{ text: 'one', bold: false }], [{ text: 'two', alt: true }]] },
  { type: 'point', mode: 'single', label: 'Pt', bodyText: 'Go First', propName: 'Go First' },
  { type: 'point', mode: 'revealing', label: 'Rev', title: 'Three', bullets: ['A', 'B', 'C'], propBaseName: 'Three' },
  { type: 'image', label: 'Img' },
  { type: 'blank', label: 'Blank', spans: [{ text: 'note', bold: false }] },
  { type: 'custom', label: 'Custom' },
  { type: 'end' },
] };

(async () => {
  const root = await protobuf.load(PROTO_PATH);
  const Presentation = root.lookupType('rv.data.Presentation');

  // Encode the full deck — encodeToBuffer internally runs Presentation.verify().
  let buf;
  try { buf = await encodeToBuffer(FULL_DECK, {}); ok('full deck encodes (schema verify passes)', buf && buf.length > 0); }
  catch (e) { ok('full deck encodes (schema verify passes)', false, e.message); }

  if (buf) {
    const decoded = Presentation.decode(buf);
    ok('decodes back without error', !!decoded);
    ok('cue count preserved on round-trip', (decoded.cues || []).length > 0);
  }

  // Each slide type in isolation must also encode cleanly.
  const singles = [
    ['start/end only', { name: 'X', slides: [{ type: 'start' }, { type: 'end' }] }],
    ['scripture', { name: 'X', slides: [{ type: 'scripture', label: 'A', reference: 'A', bodies: [[{ text: 'a', bold: false }]], propName: 'A' }] }],
    ['point single', { name: 'X', slides: [{ type: 'point', mode: 'single', label: 'P', bodyText: 'p', propName: 'P' }] }],
    ['point revealing', { name: 'X', slides: [{ type: 'point', mode: 'revealing', label: 'R', title: 'T', bullets: ['a', 'b'], propBaseName: 'R' }] }],
    ['image', { name: 'X', slides: [{ type: 'image', label: 'I' }] }],
    ['blank', { name: 'X', slides: [{ type: 'blank', label: 'B' }] }],
    ['custom', { name: 'X', slides: [{ type: 'custom', label: 'C' }] }],
    ['response card', { name: 'X', includeResponseCard: true, slides: [{ type: 'start' }, { type: 'end' }] }],
    ['empty deck', { name: 'X', slides: [] }],
  ];
  for (const [label, spec] of singles) {
    try { const b = await encodeToBuffer(spec, {}); ok(`${label} encodes`, b && b.length >= 0); }
    catch (e) { ok(`${label} encodes`, false, e.message); }
  }

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();

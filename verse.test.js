// End-to-end verse-number chain test:
//   server htmlPassageToText (real) -> verse sentinels
//   parseVerseSpans (mirror of app.js logic) -> flagged spans
//   rtf.rtfBody (real) -> superscript / inline RTF
// Guards the "embedded number" safety case (e.g. "100 sheep" must NOT be a verse).

const app = require('./server.js');
const rtf = require('./rtf.js');

const S0 = String.fromCharCode(0xE000), S1 = String.fromCharCode(0xE001);
let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { console.log('✅', name); pass++; } else { console.log('❌', name); fail++; } }

// Mirror of app.js parseVerseSpans (kept in sync — pure function).
const SENT = new RegExp(S0 + '([\\d\\u2013-]+)' + S1 + '\\s*', 'g');
function parseVerseSpans(text, superscript) {
  const spans = []; let last = 0, m; SENT.lastIndex = 0;
  while ((m = SENT.exec(text)) !== null) {
    if (m.index > last) { const t = text.slice(last, m.index); if (t) spans.push({ text: t, bold: false }); }
    spans.push({ text: m[1], verseNum: true, super: !!superscript, bold: false });
    spans.push({ text: ' ', bold: false });
    last = SENT.lastIndex;
  }
  if (last < text.length) { const t = text.slice(last); if (t) spans.push({ text: t, bold: false }); }
  return spans;
}

const htmlPassageToText = app.htmlPassageToText;
ok('server exposes htmlPassageToText', typeof htmlPassageToText === 'function');

// --- 1. Server marks verse boundaries, leaves embedded numbers alone ---
const html = '<p class="p"><span data-number="4" class="v">4</span>The Lord created medicines, and 100 of them <span data-number="5" class="v">5</span>were given.</p>';
const marked = htmlPassageToText(html, true);
ok('verse 4 marked with sentinel', marked.includes(S0 + '4' + S1));
ok('verse 5 marked with sentinel', marked.includes(S0 + '5' + S1));
ok('embedded "100" NOT marked', !marked.includes(S0 + '100' + S1) && marked.includes('100 of them'));

// --- 2. markVerses=false strips numbers entirely (default lookup) ---
const plain = htmlPassageToText(html, false);
ok('no sentinels when markVerses off', !plain.includes(S0) && !plain.includes(S1));

// --- 3. parseVerseSpans flags only real verses ---
const spans = parseVerseSpans(marked, true);
const verseNums = spans.filter(s => s.verseNum).map(s => s.text);
ok('exactly verses [4,5] flagged', JSON.stringify(verseNums) === JSON.stringify(['4', '5']));
ok('embedded 100 stays as body text', spans.some(s => !s.verseNum && s.text.includes('100 of them')));

// --- 4. RTF: superscript emits \super, inline does not ---
const superRtf = Buffer.from(rtf.rtfBody(parseVerseSpans(marked, true), {}), 'base64').toString('utf8');
ok('superscript chain emits \\super', superRtf.includes('\\super'));
const inlineRtf = Buffer.from(rtf.rtfBody(parseVerseSpans(marked, false), {}), 'base64').toString('utf8');
ok('inline chain emits no \\super', !inlineRtf.includes('\\super'));
ok('verse text survives to RTF', superRtf.includes('were given'));

// --- 5. Verse number with range (e.g. combined verse "2-4") survives ---
const rangeHtml = '<p><span class="v">2-4</span>When the young man went down.</p>';
const rangeMarked = htmlPassageToText(rangeHtml, true);
ok('verse range marked', rangeMarked.includes(S0 + '2-4' + S1));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

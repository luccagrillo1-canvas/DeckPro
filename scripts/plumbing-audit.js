#!/usr/bin/env node
'use strict';

/**
 * DeckPro Plumbing Audit — sentinel-value pipeline check.
 *
 * Proves that values travel the whole server-side pipe:
 *
 *     export spec  →  builder / buildProp  →  RTF + protobuf  →  .pro / _Props.pro
 *
 * The method: put unmistakable "sentinel" values into a deck spec (odd sizes,
 * a weird colour, a made-up font name, smart quotes), run the real encoder in
 * download mode (no disk writes), decode the resulting Pro7 binaries, and prove
 * each sentinel landed in the exact element it controls. The decoded .pro is the
 * source of truth — not the UI, not a screenshot.
 *
 * Scope: this covers spec → .pro. The client half (UI → saved state → spec:
 * scheme resolution, Display-2 inheritance, Fit Width, quote normalization) runs
 * in the browser and is checked separately (see the skill's "manual checks").
 *
 * Run:  node scripts/plumbing-audit.js
 * Exit: 0 if no P0/P1 findings, 1 otherwise.
 */

const path = require('path');
const protobuf = require('protobufjs');
const { encode } = require('../encode');

const ROOT = path.join(__dirname, '..');

// ── Sentinels ────────────────────────────────────────────────────────────────
// Deliberately weird so a match can't be a coincidence.
const S = {
  bodySize:      47,        // main-screen scripture/point body font size
  titleSize:     61,        // scripture reference bar font size
  queueSize:     33,        // queue sidebar font size
  liveSize:      43,        // live badge font size
  propBodySize:  87,        // LED-wall (Display 2) body font size
  bodyColor:     '#12ab34', // main-screen body text colour
  rcTitleColor:  '#ab12cd', // response-card title colour (LED wall)
  queueMarginL:  37,        // queue text left margin
  propPointFont: 'ObviouslyNarrowBold',   // Display-2 point font name
  scriptureText: 'PLUMBING_BODY_SENTINEL_ALPHA',
  pointText:     'PLUMBING_POINT_SENTINEL_BRAVO',
  reference:     'Plumbing 4:7',
  propName:      'PLUMBING_PROP_CHARLIE',
  smartQuote:    'He said “PLUMBING_QUOTE” today',   // curly quotes → must escape in RTF
  macroName:     'PLUMBING_MACRO_DELTA',
  macroUuid:     'AAAAAAAA-1111-2222-3333-444444444444',
  stageName:     'PLUMBING_STAGE_ECHO',
  stageUuid:     'BBBBBBBB-5555-6666-7777-888888888888',
  rcResponse1:   'PLUMBING_RC_RESPONSE_ONE',
};

// ── Findings ─────────────────────────────────────────────────────────────────
const findings = [];
// severity: P0 (release blocker), P1 (workflow blocker), P2 (polish)
function check(severity, area, question, ok, detail) {
  findings.push({ severity, area, question, ok: !!ok, detail: detail || '' });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const b64ToRtf = (b64) => Buffer.from(b64 || '', 'base64').toString('utf8');

// Pull \fsNN (half-points) out of an RTF string → point size.
function rtfFontSize(rtf) {
  const m = rtf.match(/\\fs(\d+)/);
  return m ? parseInt(m[1], 10) / 2 : null;
}
// Does the RTF's expandedcolortbl carry this hex colour? Pro7 renders text
// colour from \*\expandedcolortbl cssrgb entries (see rtf.js / CLAUDE.md).
function rtfHasColor(rtf, hex) {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const pct = (v) => Math.round((v / 255) * 100000);
  const needle = `\\cssrgb\\c${pct(r)}\\c${pct(g)}\\c${pct(b)}`;
  return rtf.includes(needle);
}

// Walk a decoded presentation → every slide element (with its slide/cue context).
function* presentationElements(pres) {
  for (const cue of pres.cues || []) {
    for (const action of cue.actions || []) {
      const base = action.slide && action.slide.presentation && action.slide.presentation.baseSlide;
      for (const slot of (base && base.elements) || []) {
        if (slot.element) yield { cue, action, el: slot.element };
      }
    }
  }
}
// Elements of ONE cue (scoping matters — start/end also carry body/title/queue,
// so a naive "first element named body" grabs the start banner, not scripture).
function* cueElements(cue) {
  for (const action of cue.actions || []) {
    const base = action.slide && action.slide.presentation && action.slide.presentation.baseSlide;
    for (const slot of (base && base.elements) || []) {
      if (slot.element) yield slot.element;
    }
  }
}
function findElInCue(cue, name) {
  for (const el of cueElements(cue)) if (el.name === name) return el;
  return null;
}
// The scripture cue = the one whose body element carries our body sentinel.
function findScriptureCue(pres) {
  for (const cue of pres.cues || []) {
    for (const el of cueElements(cue)) {
      if (el.name === 'body' && el.text && el.text.rtfData &&
          b64ToRtf(el.text.rtfData).includes(S.scriptureText)) return cue;
    }
  }
  return null;
}
// Decode every rtfData anywhere in an object tree (elements, notes, props).
function collectAllRtf(obj, out = []) {
  if (!obj || typeof obj !== 'object') return out;
  if (obj.rtfData) out.push(b64ToRtf(obj.rtfData));
  for (const k of Object.keys(obj)) collectAllRtf(obj[k], out);
  return out;
}

// ── Build the sentinel deck ──────────────────────────────────────────────────
// spec.style is the RESOLVED scheme the client would send (styleForExport output).
// We set it directly here so the audit isolates the server half of the pipe.
function buildSpec() {
  const style = {
    // sizes
    bodySize: S.bodySize, pointSize: S.bodySize, titleSize: S.titleSize,
    queueSize: S.queueSize, liveSize: S.liveSize,
    propBodySize: S.propBodySize, propPointSize: S.propBodySize,
    rcTitleSize: S.titleSize, rcBodySize: S.bodySize,
    // fonts
    propPointFont: S.propPointFont,
    // advanced styling (colour lives on the adv objects)
    bodyFontAdv:    { color: S.bodyColor },
    pointFontAdv:   { color: S.bodyColor },
    queueFontAdv:   { marginLeft: S.queueMarginL },
    // LED-wall response card is driven by the rcElements array (per-element
    // name/text/pos/colour), so the RC-title colour sentinel goes here.
    rcElements: [
      { id: 'rc-title', role: 'title', name: 'Response Card', text: 'Response Card',
        x: 325, y: 856, w: 2550, h: 400, font: '', size: 0, color: S.rcTitleColor, align: 'center' },
      { id: 'rc-decision', role: 'decision', name: 'Decision', text: '',
        x: 400, y: 150, w: 2600, h: 150, font: '', size: 0, color: '', align: 'center' },
      { id: 'rc-r1', role: 'r1', name: 'Response 1', text: '',
        x: 400, y: 330, w: 2600, h: 150, font: '', size: 0, color: '', align: 'center' },
      { id: 'rc-r2', role: 'r2', name: 'Response 2', text: '',
        x: 400, y: 510, w: 2600, h: 150, font: '', size: 0, color: '', align: 'center' },
      { id: 'rc-r3', role: 'r3', name: 'Response 3', text: '',
        x: 400, y: 690, w: 2600, h: 150, font: '', size: 0, color: '', align: 'center' },
    ],
  };

  const scriptureSpans = [{ text: S.scriptureText }];
  return {
    name: 'PLUMBING_AUDIT_DECK',
    downloadMode: true,          // return buffers, no disk writes
    includeResponseCard: true,
    qrEnabled: false,
    responses: { r1: S.rcResponse1, r2: 'RC two', r3: 'RC three' },
    style,
    // palette-level macros + stage displays, triggered on scripture slides
    customMacros: [{ name: S.macroName, uuid: S.macroUuid, triggers: ['scripture'] }],
    stageDisplays: [{ name: S.stageName, uuid: S.stageUuid, triggers: ['scripture'] }],
    slides: [
      { type: 'start' },
      { type: 'scripture', label: S.reference, reference: S.reference,
        bodies: [scriptureSpans], propName: S.propName, blankBefore: false },
      { type: 'point', mode: 'single', label: 'Pt', bodyText: S.pointText,
        propName: 'PLUMBING_POINT_PROP', blankBefore: false },
      { type: 'point', mode: 'revealing', label: 'Rev', title: 'Reveal Title',
        bullets: [[{ text: 'Reveal bullet one' }], [{ text: 'Reveal bullet two' }]],
        propBaseName: 'PLUMBING_REVEAL', blankBefore: false },
      { type: 'blank', label: 'Blank', spans: [{ text: S.smartQuote }] },
      { type: 'image', label: 'Image slide' },
      { type: 'custom', label: 'PLUMBING_CUSTOM_SLIDE' },
      { type: 'end' },
    ],
  };
}

// ── Run ──────────────────────────────────────────────────────────────────────
async function main() {
  const [presRoot, propRoot] = await Promise.all([
    protobuf.load(path.join(ROOT, 'ProPresenter7-Proto/proto/propresenter.proto')),
    protobuf.load(path.join(ROOT, 'ProPresenter7-Proto/proto/propDocument.proto')),
  ]);
  const Presentation = presRoot.lookupType('rv.data.Presentation');
  const PropDocument = propRoot.lookupType('rv.data.PropDocument');

  const spec = buildSpec();
  const res = await encode(spec);
  if (!res || !res.downloadMode) throw new Error('encode did not return download-mode buffers');

  const pres = Presentation.toObject(
    Presentation.decode(Buffer.from(res.data, 'base64')), { defaults: false });
  const propFile = res.props && res.props[0];
  const propDoc = propFile
    ? PropDocument.toObject(PropDocument.decode(Buffer.from(propFile.data, 'base64')), { defaults: false })
    : null;

  // ---- Presentation: structural ----
  const cueCount = (pres.cues || []).length;
  check('P0', 'structure', 'Presentation decodes with cues', cueCount > 0, `${cueCount} cues`);

  // ---- Scope to the scripture cue (start/end also carry body/title/queue) ----
  const scrCue = findScriptureCue(pres);
  check('P0', 'structure', 'Scripture cue located', !!scrCue,
    scrCue ? 'found by body sentinel' : 'no cue carries the body sentinel');

  // ---- Body font size + colour (scripture body element) ----
  const bodyEl = scrCue && findElInCue(scrCue, 'body');
  if (bodyEl && bodyEl.text && bodyEl.text.rtfData) {
    const rtf = b64ToRtf(bodyEl.text.rtfData);
    check('P0', 'text', `Body font size = ${S.bodySize}`,
      rtfFontSize(rtf) === S.bodySize, `RTF \\fs → ${rtfFontSize(rtf)}`);
    check('P0', 'colour', `Body colour = ${S.bodyColor}`,
      rtfHasColor(rtf, S.bodyColor), 'expandedcolortbl cssrgb');
    check('P0', 'text', 'Scripture body text present',
      rtf.includes(S.scriptureText), S.scriptureText);
  } else {
    check('P0', 'text', 'Scripture body element found', false, "no 'body' element on scripture cue");
  }

  // ---- Title (reference bar) ----
  const titleEl = scrCue && findElInCue(scrCue, 'title');
  if (titleEl && titleEl.text && titleEl.text.rtfData) {
    const rtf = b64ToRtf(titleEl.text.rtfData);
    check('P1', 'text', `Title font size = ${S.titleSize}`,
      rtfFontSize(rtf) === S.titleSize, `RTF \\fs → ${rtfFontSize(rtf)}`);
    check('P1', 'text', 'Reference text in title', rtf.includes(S.reference), S.reference);
  } else {
    check('P1', 'text', 'Title element found', false, "no 'title' element on scripture cue");
  }

  // ---- Queue sidebar (size + margin) ----
  const queueEl = scrCue && findElInCue(scrCue, 'queue');
  if (queueEl && queueEl.text && queueEl.text.rtfData) {
    const rtf = b64ToRtf(queueEl.text.rtfData);
    check('P1', 'text', `Queue font size = ${S.queueSize}`,
      rtfFontSize(rtf) === S.queueSize, `RTF \\fs → ${rtfFontSize(rtf)}`);
    const inset = queueEl.text && queueEl.text.margins;
    const left = inset && (inset.left ?? inset.marginLeft);
    check('P2', 'layout', `Queue left margin = ${S.queueMarginL}`,
      Number(left) === S.queueMarginL, `margins.left → ${left}`);
  } else {
    check('P1', 'text', 'Queue element found', false, "no 'queue' element on scripture cue");
  }

  // ---- Live badge ----
  check('P1', 'structure', 'Live badge element present', !!(scrCue && findElInCue(scrCue, 'live')), '');

  // ---- Macro + stage-display actions (fire on scripture) ----
  let macroHit = false, stageHit = false, propHit = false;
  for (const cue of pres.cues || []) {
    for (const a of cue.actions || []) {
      const nm = (a.macro && a.macro.identification && a.macro.identification.parameterName) ||
                 (a.macro && a.macro.name);
      if (nm === S.macroName) macroHit = true;
      if (a.stageLayout || a.clearLayout || (a.type && String(a.type).includes('STAGE'))) {
        const s = JSON.stringify(a);
        if (s.includes(S.stageUuid) || s.includes(S.stageName)) stageHit = true;
      }
      const pn = a.prop && a.prop.identification && a.prop.identification.parameterName;
      if (pn === S.propName) propHit = true;
    }
  }
  // stage layout may be encoded elsewhere in the cue — fall back to a deep scan
  if (!stageHit) stageHit = JSON.stringify(pres).includes(S.stageUuid);
  check('P1', 'macros', `Palette macro "${S.macroName}" fires on scripture`, macroHit, '');
  check('P1', 'stage', `Stage layout "${S.stageName}" triggers on scripture`, stageHit, '');
  check('P0', 'props', `Scripture prop action names "${S.propName}"`, propHit, '');

  // ---- Props file ----
  if (propDoc) {
    const cues = propDoc.cues || [];
    const propNames = cues.map(c => c.name);
    check('P0', 'props', 'Props file decodes with cues', cues.length > 0, `${cues.length} prop cues`);
    check('P0', 'props', `Scripture prop cue "${S.propName}" exists`,
      propNames.includes(S.propName), propNames.slice(0, 8).join(', '));
    check('P1', 'props', 'Response Card prop cue exists',
      propNames.some(n => /response card/i.test(n)), propNames.join(', '));

    // Every prop action in the presentation must match a prop cue by name.
    const actionPropNames = new Set();
    for (const cue of pres.cues || []) {
      for (const a of cue.actions || []) {
        const pn = a.prop && a.prop.identification && a.prop.identification.parameterName;
        if (pn) actionPropNames.add(pn);
      }
    }
    const missing = [...actionPropNames].filter(n => !propNames.includes(n));
    check('P0', 'props', 'Every prop action matches a prop cue by name',
      missing.length === 0, missing.length ? `unmatched: ${missing.join(', ')}` : 'all matched');

    // Sentinel colour/text on the response-card prop (Display 2, LED wall).
    const rcCue = cues.find(c => /response card/i.test(c.name));
    if (rcCue) {
      const rcRtfs = collectAllRtf(rcCue);
      check('P1', 'response-card', `RC title colour = ${S.rcTitleColor} on LED wall`,
        rcRtfs.some(r => rtfHasColor(r, S.rcTitleColor)), 'rcElements colour → prop RTF');
      check('P1', 'response-card', `RC Response 1 text "${S.rcResponse1}" present`,
        rcRtfs.some(r => r.includes(S.rcResponse1)), '');
    } else {
      check('P1', 'response-card', 'Response Card prop cue found for colour check', false, '');
    }

    // Display-2 point font name should reach a point prop.
    const propJson = JSON.stringify(propDoc);
    check('P2', 'fonts', `Display-2 point font "${S.propPointFont}" reaches props`,
      propJson.includes(S.propPointFont), '');
  } else {
    check('P0', 'props', 'Props file produced', false, 'no _Props buffer');
  }

  // ---- Smart quotes escaped (not raw curly) across ALL RTF (elements + notes) ----
  const joined = collectAllRtf(pres).join('\n');
  const quoteReached = joined.includes('PLUMBING_QUOTE');
  const rawCurly = joined.includes('“') || joined.includes('”');
  const escapedQuote = joined.includes("\\'93") || joined.includes("\\'94");
  check('P1', 'text', 'Curly quotes escaped in RTF (not raw)',
    quoteReached && !rawCurly && escapedQuote,
    !quoteReached ? 'quote sentinel not found in any RTF'
      : rawCurly ? 'found RAW curly char in shipped RTF' : 'converted to \\\'93/\\\'94');

  // ---- Custom slide survives (exports as a labelled slot) ----
  check('P1', 'structure', 'Custom slide survives export',
    JSON.stringify(pres).includes('PLUMBING_CUSTOM_SLIDE'), '');

  // ── Report ──────────────────────────────────────────────────────────────────
  report();
}

function report() {
  const order = { P0: 0, P1: 1, P2: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);
  const pass = findings.filter(f => f.ok).length;
  const fail = findings.filter(f => !f.ok);

  console.log('\n═══ DeckPro Plumbing Audit ═══\n');
  for (const f of findings) {
    const mark = f.ok ? '✅' : '❌';
    const sev = f.ok ? '  ' : f.severity;
    console.log(`${mark} ${sev} [${f.area}] ${f.question}${f.detail ? '  —  ' + f.detail : ''}`);
  }
  console.log(`\n${pass}/${findings.length} checks passed.`);

  const blockers = fail.filter(f => f.severity === 'P0' || f.severity === 'P1');
  if (fail.length) {
    console.log('\n─── FINDINGS ───');
    for (const f of fail) {
      console.log(`\n${f.severity} — ${f.area}: ${f.question}`);
      console.log(`  expected: sentinel present in the ${f.area} element`);
      console.log(`  actual:   ${f.detail || 'not found'}`);
      console.log(`  repro:    node scripts/plumbing-audit.js  (sentinel "${JSON.stringify(S).slice(0, 40)}…")`);
    }
  }
  process.exitCode = blockers.length ? 1 : 0;
}

main().catch(err => { console.error('AUDIT CRASHED:', err); process.exit(2); });

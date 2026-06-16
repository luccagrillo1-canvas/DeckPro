'use strict';

/**
 * buildProp.js
 * Generates a single Pro7 prop (.pro) file containing all props as cues.
 *
 * Matching: parameterName in presentation prop action = cue.name in prop file.
 *
 * Usage:
 *   const { buildAllPropCues, encodePropDocument } = require('./buildProp');
 *
 *   const propSpecs = [
 *     { type: 'scripture', propName: 'John 13:35', reference: 'John 13:35', bodies: [[spans]] },
 *     { type: 'point-single', propName: 'Create Opportunities', bodyText: 'Create Opportunities' },
 *     { type: 'point-revealing', propName: 'Series_1', title: 'Vision', bullets: [...], activeIdx: 0 },
 *   ];
 *
 *   const propDoc = buildAllPropCues(propSpecs);
 *   const buf = await encodePropDocument(propDoc);
 *   fs.writeFileSync('output_Props.pro', buf);
 */

const { randomUUID } = require('crypto');
const protobuf = require('protobufjs');
const path = require('path');
const rtf = require('./rtf');

const PROTO_PATH = path.join(__dirname, 'ProPresenter7-Proto/proto/propDocument.proto');

// ─── Proto loader (cached) ─────────────────────────────────────────────────

let _root = null;
async function getRoot() {
  if (!_root) _root = await protobuf.load(PROTO_PATH);
  return _root;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function uuid() { return { string: randomUUID().toUpperCase() }; }

const RECT_PATH = {
  closed: true,
  points: [
    { point: {},              q0: {},              q1: {} },
    { point: { x: 1 },       q0: { x: 1 },        q1: { x: 1 } },
    { point: { x: 1, y: 1 }, q0: { x: 1, y: 1 },  q1: { x: 1, y: 1 } },
    { point: { y: 1 },       q0: { y: 1 },         q1: { y: 1 } },
  ],
  shape: { type: 'TYPE_RECTANGLE' },
};

const C_WHITE   = { red: 1, green: 1, blue: 1, alpha: 1 };
const C_BLACK_A = { alpha: 1 };
const C_CHORD   = { red: 0.9450980424880981, green: 0.8156862854957581, blue: 0.1882352977991104, alpha: 1 };

// ─── Style helpers ────────────────────────────────────────────────────────

const FONT_ADV_DEFAULTS = () => ({
  yOffset: 0, charSpacing: 0, lineHeight: 1,
  paragraphSpacingBefore: 0, paragraphSpacingAfter: 0,
  alignment: '', italic: false, underline: false, capitalization: '',
});

const DEFAULT_STYLE = {
  bodyFill:    '#2196f2',
  titleFill:   '#a9391a',
  titleText:   '#f6d046',
  titleShadow: '#ff2600',
  fillEnabled: false,
  bodyFont:     'Montserrat-Medium',
  propBodyFont: 'Montserrat-SemiBold',
  boldFont:     'Montserrat-ExtraBold',
  pointFont:    'Montserrat-ExtraBold',
  titleFont:    'Montserrat-ExtraBold',
  startEndFont: 'Montserrat-ExtraBold',
  bodySize:      44,
  titleSize:     60,
  startEndSize:  45,
  propBodySize:  80,
  propTitleSize: 110,
  transitionType:         'fade',
  transitionDuration:     0.6,
  propTransitionType:     'fade',
  propTransitionDuration: 0.6,
  // Advanced font styling
  propBodyFontAdv: null,
  pointFontAdv:    null,
  titleFontAdv:    null,
  // Prop canvas
  propCanvasW: 1920, propCanvasH: 1080,
  // Prop element bounds
  propBodyX: 0, propBodyY: 729.98, propBodyW: 1920, propBodyH: 350.02,
  propTitleX: -0.18, propTitleY: 880, propTitleW: 1920.18, propTitleH: 50.51,
};

// ─── Transitions ──────────────────────────────────────────────────────────

const TRANSITION_DEFS = {
  fade: {
    name: 'Fade', renderId: '99BDD1C3-EE98-4E80-A8DE-3699CE9F338E',
    behaviorDescription: 'Fade', category: 'Dissolves', defaultDuration: 0.6,
  },
  dissolve: {
    name: 'Dissolve', renderId: 'EC52A828-AD85-4602-B70C-1DEE7C904DB6',
    behaviorDescription: 'Cross Dissolve.', category: 'Dissolves', defaultDuration: 0.6,
  },
  cut: {
    name: 'Cut', renderId: 'AB29D07B-E9E2-4E0A-93BD-AD3EA58120FA',
    behaviorDescription: 'Cut.', category: 'None', defaultDuration: 0,
  },
};

function makeTransition(type, duration) {
  const def = TRANSITION_DEFS[type] || TRANSITION_DEFS.fade;
  const dur = (duration !== undefined && duration !== null) ? duration : def.defaultDuration;
  const t = { effect: { uuid: uuid(), name: def.name, renderId: def.renderId, behaviorDescription: def.behaviorDescription, category: def.category } };
  if (dur > 0) t.duration = dur;
  return t;
}

function hexToColor(hex) {
  const h = (hex || '#000000').replace('#', '');
  return {
    red:   (parseInt(h.slice(0,2),16)||0) / 255,
    green: (parseInt(h.slice(2,4),16)||0) / 255,
    blue:  (parseInt(h.slice(4,6),16)||0) / 255,
    alpha: 1,
  };
}

function resolveStyle(style = {}) {
  const s  = { ...DEFAULT_STYLE, ...style };
  const fa = s.fillEnabled ? 1 : 0;
  const out = {
    ...s,
    cFill:        { ...hexToColor(s.bodyFill),  alpha: fa },
    cTitleFill:   { ...hexToColor(s.titleFill), alpha: fa },
    cTitleText:   hexToColor(s.titleText),
    cTitleShadow: hexToColor(s.titleShadow),
  };
  for (const k of ['propBodyFontAdv', 'titleFontAdv', 'boldFontAdv', 'pointFontAdv']) {
    out[k] = { ...FONT_ADV_DEFAULTS(), ...(s[k] || {}) };
  }
  return out;
}

/** Overlay prop-specific size/font overrides so RTF calls use LED-wall values. */
function makePropStyle(rs) {
  return {
    ...rs,
    bodyFont:  rs.propBodyFont  || rs.bodyFont,
    bodySize:  rs.propBodySize  || rs.bodySize,
    titleSize: rs.propTitleSize || rs.titleSize,
    // Bold spans inside body text on the LED wall
    boldFont:    rs.propBoldFont || rs.boldFont,
    boldFontAdv: rs.propBoldFontAdv ? { ...FONT_ADV_DEFAULTS(), ...rs.propBoldFontAdv } : rs.boldFontAdv,
    // Point text on the LED wall has its own font entry, falling back to the prop bold / main fonts
    pointFont:    rs.propPointFont || rs.pointFont || rs.propBoldFont || rs.boldFont,
    pointFontAdv: rs.propPointFontAdv
      ? { ...FONT_ADV_DEFAULTS(), ...rs.propPointFontAdv }
      : (rs.pointFontAdv || (rs.propBoldFontAdv ? { ...FONT_ADV_DEFAULTS(), ...rs.propBoldFontAdv } : rs.boldFontAdv)),
  };
}

const SHADOW_STD = { angle: 315, offset: 5, radius: 5, color: C_BLACK_A, opacity: 0.75 };
const TXT_SHADOW = { angle: 315, offset: 2, radius: 3, color: C_BLACK_A, opacity: 1, enable: true };

const APP_INFO = {
  platform: 'PLATFORM_MACOS',
  platformVersion: { majorVersion: 26, patchVersion: 1 },
  application: 'APPLICATION_PROPRESENTER',
  applicationVersion: { majorVersion: 20, patchVersion: 1, build: '335544583' },
};

// ─── Element builder for props ────────────────────────────────────────────

function makeTextElement({ name, x, y, w, h, rtfData, font, fontSize, center, charCount, vertAlign, scaleBehavior, margins, adv }, rs = {}) {
  const id = uuid();
  const paraStyle = {
    lineHeightMultiple: 1,
    defaultTabInterval: 84,
    textList: {},
  };
  if (center) paraStyle.alignment = 'ALIGNMENT_CENTER';

  return {
    uuid: id,
    name,
    bounds: { origin: { x, y }, size: { width: w, height: h } },
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: resolveStroke(adv, { width: 3, color: C_WHITE }),
    shadow: resolveShadow(adv, SHADOW_STD),
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: font, size: Math.round(fontSize), family: 'Montserrat' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: paraStyle,
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: charCount ? [{ range: { end: charCount } }] : [],
      },
      shadow: TXT_SHADOW,
      rtfData,
      ...(resolveScaleBehavior(adv, scaleBehavior) !== undefined ? { scaleBehavior: resolveScaleBehavior(adv, scaleBehavior) } : {}),
      ...(vertAlign ? { verticalAlignment: vertAlign } : {}),
      margins: margins ?? {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

function makeSlot(element, info = 3) {
  return {
    element,
    info,
    textScroller: { scrollRate: 0.5, shouldRepeat: true },
  };
}

// ─── Prop cue builder ─────────────────────────────────────────────────────

/**
 * Returns a single cue object for inclusion in a PropDocument.
 * cue.name = propName → matched by parameterName in presentation prop action.
 */
function makePropCue(propName, elements, transition, rs = {}, uuidOverride = null) {
  return {
    uuid: uuidOverride ? { string: uuidOverride } : uuid(),
    name: propName,
    hotKey: {},
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    isEnabled: true,
    actions: [{
      uuid: uuid(),
      isEnabled: true,
      type: 'ACTION_TYPE_PRESENTATION_SLIDE',
      slide: {
        prop: {
          baseSlide: {
            elements,
            elementBuildOrder: [],
            size: { width: rs.propCanvasW ?? 1920, height: rs.propCanvasH ?? 1080 },
            uuid: uuid(),
          },
          transition,
        },
      },
    }],
  };
}

// ─── Font adv helpers ────────────────────────────────────────────────────

function resolveVertAlign(adv, defaultVal) {
  const map = { top: 'VERTICAL_ALIGNMENT_TOP', middle: 'VERTICAL_ALIGNMENT_MIDDLE', bottom: 'VERTICAL_ALIGNMENT_BOTTOM' };
  return (adv?.verticalAlignment && map[adv.verticalAlignment]) || defaultVal;
}

function resolveMargins(adv, defaults = {}) {
  return {
    left:   (adv?.marginLeft   || 0) || (defaults.left   ?? 0),
    top:    (adv?.marginTop    || 0) || (defaults.top    ?? 0),
    right:  (adv?.marginRight  || 0) || (defaults.right  ?? 0),
    bottom: (adv?.marginBottom || 0) || (defaults.bottom ?? 0),
  };
}

function resolveScaleBehavior(adv, defaultVal) {
  const v = adv?.scaleBehavior;
  if (!v) return defaultVal;
  if (v === 'none') return undefined;
  return v;
}

function resolveStroke(adv, defaultStroke) {
  if (!adv?.strokeEnabled) return defaultStroke;
  return { width: adv.strokeWidth ?? 1, color: hexToColor(adv.strokeColor || '#ffffff') };
}

function resolveShadow(adv, defaultShadow) {
  if (!adv?.shadowEnabled) return defaultShadow;
  return {
    angle:   adv.shadowAngle  ?? 315,
    offset:  adv.shadowOffset ?? 5,
    radius:  adv.shadowBlur   ?? 5,
    color:   hexToColor(adv.shadowColor || '#000000'),
    opacity: (adv.shadowOpacity ?? 75) / 100,
  };
}

// ─── Auto prop title Y estimation ────────────────────────────────────────

function estimatePropTitleY(spans, bw, prs) {
  const bodySize = (prs.propBodySize ?? 80) * 2; // RTF doubles pt for Pro7
  const lineH = bodySize * 1.3;
  const gap = prs.propTitleAutoGap ?? 16;
  const by = prs.propBodyY ?? 729.98;
  const bh = prs.propBodyH ?? 350.02;
  const th = prs.propTitleH ?? 50.51;
  const fullText = (spans || []).map(s => s.text || '').join('');
  const paragraphs = fullText.split('\n');
  const avgCharW = bodySize * 0.52;
  const charsPerLine = Math.max(1, bw / avgCharW);
  let totalLines = 0;
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let lineLen = 0, lines = 1;
    for (const word of words) {
      const wLen = word.length;
      if (lineLen > 0 && lineLen + 1 + wLen > charsPerLine) { lines++; lineLen = wLen; }
      else lineLen += (lineLen > 0 ? 1 : 0) + wLen;
    }
    totalLines += lines;
  }
  if (totalLines === 0) totalLines = 1;
  const marginBottom = prs.bodyMarginBottom ?? 60;
  const estimatedTextH = totalLines * lineH;
  const textTop = by + bh - marginBottom - estimatedTextH;
  return Math.round(textTop - gap - th);
}

// ─── Prop cue builders ────────────────────────────────────────────────────

/**
 * Scripture prop cue: body text (all bodies concatenated) + reference bar.
 * Returns a cue object.
 */
function buildScripturePropCue(spec, rs = {}) {
  const { propName, reference, bodies } = spec;
  const prs = makePropStyle(rs);
  const allSpans = bodies.reduce((acc, body, idx) => {
    if (idx > 0) acc.push({ text: '\n', bold: false });
    return acc.concat(body);
  }, []);

  const bodyRtf   = rtf.rtfBody(allSpans, prs);
  const titleRtf  = rtf.rtfTitle(reference, prs);
  const plainBody = allSpans.map(s => s.text).join('');

  const bx = prs.propBodyX ?? 0;
  const by = prs.propBodyY ?? 729.98;
  const bw = prs.propBodyW ?? prs.propCanvasW ?? 1920;
  const bh = prs.propBodyH ?? 350.02;
  const bodyYOff = prs.propBodyFontAdv?.yOffset ?? 0;

  const bodyEl = makeTextElement({
    name: 'body',
    x: bx, y: by + bodyYOff, w: bw, h: bh,
    rtfData: bodyRtf,
    font: prs.bodyFont || 'Montserrat-SemiBold',
    fontSize: prs.bodySize || 80,
    center: false,
    charCount: plainBody.length,
    vertAlign: resolveVertAlign(prs.propBodyFontAdv, 'VERTICAL_ALIGNMENT_BOTTOM'),
    scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
    margins: resolveMargins(prs.propBodyFontAdv, { bottom: 60 }),
    adv: prs.propBodyFontAdv,
  }, rs);

  const th = prs.propTitleH ?? 50.51;
  const tx = prs.propTitleX ?? -0.18;
  const tw = prs.propTitleW ?? (prs.propCanvasW ?? 1920) + 0.18;
  const titleYOff = prs.titleFontAdv?.yOffset ?? 0;
  let titleY;
  if (prs.propAutoTitleY) {
    titleY = estimatePropTitleY(allSpans, bw, prs);
  } else {
    titleY = prs.propTitleY ?? (by + (prs.propTitleGapShort ?? 0));
  }

  const titleEl = makeTextElement({
    name: 'reference',
    x: tx, y: titleY + titleYOff, w: tw, h: th,
    rtfData: titleRtf,
    font: prs.titleFont || 'Montserrat-ExtraBold',
    fontSize: prs.titleSize || 60,
    center: true,
    charCount: reference.length,
    vertAlign: resolveVertAlign(prs.titleFontAdv, 'VERTICAL_ALIGNMENT_MIDDLE'),
    margins: resolveMargins(prs.titleFontAdv, {}),
    adv: prs.titleFontAdv,
  }, prs);

  return makePropCue(propName, [makeSlot(bodyEl), makeSlot(titleEl)], rs._propTransition ?? rs._transition, rs, spec.slotUuid ?? null);
}

/**
 * Point single prop cue: highlighted point text, centered.
 * Returns a cue object.
 */
function buildPointSinglePropCue(spec, rs = {}) {
  const { propName, bodyText } = spec;
  const prs     = makePropStyle(rs);
  const bodyRtf = rtf.rtfPointBody(bodyText, prs);

  const bx = prs.propBodyX ?? 0;
  const by = prs.propBodyY ?? 729.98;
  const bw = prs.propBodyW ?? prs.propCanvasW ?? 1920;
  const bh = prs.propBodyH ?? 350.02;
  const boldYOff = (prs.pointFontAdv || prs.boldFontAdv)?.yOffset ?? 0;

  const bodyEl = makeTextElement({
    name: 'body',
    x: bx, y: by + boldYOff, w: bw, h: bh,
    rtfData: bodyRtf,
    font: prs.pointFont || prs.boldFont || 'Montserrat-ExtraBold',
    fontSize: prs.bodySize || 80,
    center: true,
    charCount: bodyText.length,
    vertAlign: 'VERTICAL_ALIGNMENT_BOTTOM',
    scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
    margins: { bottom: 60 },
    adv: prs.pointFontAdv || prs.boldFontAdv,
  }, rs);

  return makePropCue(propName, [makeSlot(bodyEl)], rs._propTransition ?? rs._transition, rs, spec.slotUuid ?? null);
}

/**
 * Revealing point prop cue: shows bullets up to and including activeIdx,
 * with the active one highlighted. Optional title shown as header.
 * Returns a cue object.
 */
function buildRevealingPointPropCue(spec, rs = {}) {
  const { propName, title, bullets, activeIdx } = spec;
  const prs            = makePropStyle(rs);
  const visibleBullets = bullets.slice(0, activeIdx + 1);
  const rtfData        = rtf.rtfRevealingPoints(visibleBullets, title || null, prs);
  const plainText      = visibleBullets.map((p, i) => `${i + 1} \u2014 ${rtf.bulletToText(p)}`).join('\n');

  const bx = prs.propBodyX ?? 0;
  const by = prs.propBodyY ?? 729.98;
  const bw = prs.propBodyW ?? prs.propCanvasW ?? 1920;
  const bh = prs.propBodyH ?? 350.02;
  const boldYOff = prs.boldFontAdv?.yOffset ?? 0;

  const bodyEl = makeTextElement({
    name: 'body',
    x: bx, y: by + boldYOff, w: bw, h: bh,
    rtfData,
    font: prs.boldFont || 'Montserrat-ExtraBold',
    fontSize: prs.bodySize || 80,
    center: true,
    charCount: plainText.length,
    vertAlign: 'VERTICAL_ALIGNMENT_BOTTOM',
    scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
    margins: { bottom: 60 },
    adv: prs.boldFontAdv,
  }, prs);

  return makePropCue(propName, [makeSlot(bodyEl)], rs._propTransition ?? rs._transition, rs, spec.slotUuid ?? null);
}

// ─── PropDocument assembler ───────────────────────────────────────────────

/**
 * Builds a full PropDocument object containing all prop cues.
 *
 * @param {Array} propSpecs - Array of prop spec objects:
 *   { type: 'scripture',       propName, reference, bodies }
 *   { type: 'point-single',    propName, bodyText }
 *   { type: 'point-revealing', propName, title?, bullets, activeIdx }
 * @returns {object} PropDocument-shaped JS object ready for encodePropDocument()
 */
/**
 * Resolve a transition from a per-spec override or fall back to the global prop transition.
 * specTrans: { type, duration } or null/undefined
 * globalTrans: makeTransition result (the global prop transition object)
 */
function resolveSpecTransition(specTrans, rs) {
  if (specTrans?.type && specTrans.type !== 'default') {
    return makeTransition(specTrans.type, specTrans.duration);
  }
  return rs._propTransition;
}

function buildAllPropCues(propSpecs, style = {}) {
  const rs = resolveStyle(style);
  rs._transition     = makeTransition(rs.transitionType     || 'fade', rs.transitionDuration);
  rs._propTransition = makeTransition(rs.propTransitionType || 'fade', rs.propTransitionDuration);

  const cues = propSpecs.map(spec => {
    // Determine this cue's transition
    let specTrans;
    if (spec.type === 'point-revealing') {
      // Use propInitialTransition for activeIdx=0, propRevealTransition for subsequent
      specTrans = spec.activeIdx === 0
        ? (spec.propInitialTransition || spec.propTransition)
        : (spec.propRevealTransition  || spec.propTransition);
    } else {
      specTrans = spec.propTransition;
    }

    const cueRs = { ...rs, _propTransition: resolveSpecTransition(specTrans, rs) };

    switch (spec.type) {
      case 'scripture':
        return buildScripturePropCue(spec, cueRs);
      case 'point-single':
        return buildPointSinglePropCue(spec, cueRs);
      case 'point-revealing':
        return buildRevealingPointPropCue(spec, cueRs);
      default:
        throw new Error(`Unknown prop spec type: ${spec.type}`);
    }
  });

  return {
    applicationInfo: APP_INFO,
    cues,
    transition: rs._propTransition,
  };
}

// ─── Encoder ──────────────────────────────────────────────────────────────

async function encodePropDocument(propDocObj) {
  const root = await getRoot();
  const PropDocument = root.lookupType('rv.data.PropDocument');
  const errMsg = PropDocument.verify(PropDocument.fromObject(propDocObj));
  if (errMsg) throw new Error(`PropDocument verify failed: ${errMsg}`);
  const msg = PropDocument.fromObject(propDocObj);
  return PropDocument.encode(msg).finish();
}

module.exports = {
  buildScripturePropCue,
  buildPointSinglePropCue,
  buildRevealingPointPropCue,
  buildAllPropCues,
  encodePropDocument,
  // Legacy aliases for any external callers
  buildScriptureProp: ({ cueUuid, reference, body }) =>
    ({ ...buildScripturePropCue({ propName: cueUuid, reference, bodies: [body] }), cues: undefined }),
};

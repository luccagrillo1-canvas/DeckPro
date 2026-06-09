'use strict';

/**
 * builder.js
 * Constructs a protobuf-encodable JS object for a Pro7 presentation.
 *
 * Usage:
 *   const { buildPresentation } = require('./builder');
 *   const obj = buildPresentation(spec);
 *
 * Spec shape:
 *   {
 *     name: 'Message_26.02.24_Series_Title',
 *     qrEnabled: false,
 *     includeResponseCard: true,
 *     slides: [
 *       { type: 'start' },
 *       { type: 'scripture', label, reference, bodies: [[spans]], propName,
 *           blankBefore: true, blankSpans: [] },
 *       { type: 'point', mode: 'single', label, bodyText, propName,
 *           blankBefore: true, blankSpans: [] },
 *       { type: 'point', mode: 'revealing', label, title, bullets: ['…'], propBaseName,
 *           blankBefore: true, blankSpans: [] },
 *       { type: 'image',  label },
 *       { type: 'blank',  label, spans: [] },
 *       { type: 'end' },
 *     ]
 *   }
 */

const { randomUUID } = require('crypto');
const path = require('path');
const rtf = require('./rtf');

// ─── Style system ─────────────────────────────────────────────────────────────

const FONT_ADV_DEFAULTS = () => ({
  yOffset:                0,   // px shift on element Y position
  charSpacing:            0,   // pt — converted to RTF \expndtw (×20)
  lineHeight:             1,   // multiplier; 1 = default
  paragraphSpacingBefore: 0,   // pt
  paragraphSpacingAfter:  0,   // pt
  alignment:              '',  // '' = font default, 'left', 'center', 'right'
  italic:                 false,
  underline:              false,
  capitalization:         '',  // '' = none, 'allCaps', 'smallCaps'
});

const DEFAULT_STYLE = {
  // Fill colors (only used when fillEnabled is true)
  bodyFill:    '#2196f2',
  titleFill:   '#a9391a',
  titleText:   '#f6d046',
  titleShadow: '#ff2600',
  fillEnabled: false,

  // Fonts
  bodyFont:     'Montserrat-Medium',
  propBodyFont: 'Montserrat-SemiBold',
  boldFont:     'Montserrat-ExtraBold',
  titleFont:    'Montserrat-ExtraBold',
  startEndFont: 'Montserrat-ExtraBold',

  // Sizes (pt)
  bodySize:      44,
  titleSize:     60,
  startEndSize:  45,
  propBodySize:  80,
  propTitleSize: 110,

  // Transitions
  transitionType:     'fade',
  transitionDuration: 0.6,

  // Build order per slide type (mirrors DEFAULT_STYLE_SCHEME in app.js)
  buildOrders: {
    content: [
      { id: 'bo-c1', element: 'this slide',   dir: 'out', start: 'START_AFTER_PREVIOUS', delay: 60, transition: 'dissolve', duration: 0.6, enabled: true },
      { id: 'bo-c2', element: 'title',         dir: 'out', start: 'START_WITH_PREVIOUS',  delay: 0,  transition: 'dissolve', duration: 0.6, enabled: true },
      { id: 'bo-c3', element: 'atem_gradient', dir: 'out', start: 'START_WITH_PREVIOUS',  delay: 0,  transition: 'dissolve', duration: 0.6, enabled: true },
    ],
    point:   [],
    blank:   [],
    startEnd:[
      { id: 'bo-se1', element: 'this slide', dir: 'in', start: 'START_WITH_SLIDE', delay: 1, transition: 'cut', duration: 0, enabled: true },
    ],
  },

  // Advanced font styling (per font)
  bodyFontAdv:     null,  // null = use FONT_ADV_DEFAULTS()
  propBodyFontAdv: null,
  boldFontAdv:     null,
  titleFontAdv:    null,
  startEndFontAdv: null,

  // Canvas (presentation)
  canvasW: 1920, canvasH: 1080,

  // Element bounds — presentation
  bodyX: 0, bodyY: 729.98, bodyW: 1920, bodyH: 350.02,
  titleX: -0.18, titleY: 880, titleW: 1920.18, titleH: 50.51,
  startEndX: 0, startEndY: 900.14, startEndW: 1920, startEndH: 179.86,
  gradientX: 0, gradientY: 351.77, gradientH: 728.23,
};

function hexToColor(hex) {
  const h = (hex || '#000000').replace('#', '');
  return {
    red:   (parseInt(h.slice(0,2),16)||0) / 255,
    green: (parseInt(h.slice(2,4),16)||0) / 255,
    blue:  (parseInt(h.slice(4,6),16)||0) / 255,
    alpha: 1,
  };
}

/** Merge user style with defaults and pre-compute protobuf color objects. */
function resolveStyle(style = {}) {
  const s  = { ...DEFAULT_STYLE, ...style };
  const fa = s.fillEnabled ? 1 : 0;
  // Normalize fontAdv fields — merge with defaults so callers always get a full object
  const ADKEY = ['bodyFontAdv', 'propBodyFontAdv', 'boldFontAdv', 'titleFontAdv', 'startEndFontAdv'];
  const out = {
    ...s,
    cFill:        { ...hexToColor(s.bodyFill),  alpha: fa },
    cFill70:      { ...hexToColor(s.bodyFill),  alpha: s.fillEnabled ? 0.7 : 0 },
    cTitleFill:   { ...hexToColor(s.titleFill), alpha: fa },
    cTitleText:   hexToColor(s.titleText),
    cTitleShadow: hexToColor(s.titleShadow),
  };
  for (const k of ADKEY) {
    out[k] = { ...FONT_ADV_DEFAULTS(), ...(s[k] || {}) };
  }
  return out;
}

// ─── UUID ──────────────────────────────────────────────────────────────────

function uuid() {
  return { string: randomUUID().toUpperCase() };
}

// ─── Structural constants ──────────────────────────────────────────────────

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

// ─── Colors ────────────────────────────────────────────────────────────────

// Fixed colors (not part of the style system)
const C_WHITE   = { red: 1, green: 1, blue: 1, alpha: 1 };
const C_BLACK_A = { alpha: 1 };
const C_CHORD   = { red: 0.9450980424880981, green: 0.8156862854957581, blue: 0.1882352977991104, alpha: 1 };
const C_TAN     = { red: 222/255, green: 168/255, blue: 125/255, alpha: 1 };

// ─── Shadows ───────────────────────────────────────────────────────────────

const EL_SHADOW_STD  = { angle: 315, offset: 5, radius: 5, color: C_BLACK_A, opacity: 0.75 };
const TXT_SHADOW_STD = { angle: 315, offset: 5, radius: 5, color: C_BLACK_A, opacity: 0.75 };
const TXT_SHADOW_LO  = { angle: 315, offset: 2, radius: 3, color: C_BLACK_A, opacity: 1, enable: true };

// ─── Transitions ─────────────────────────────────────────────────────────

const TRANSITION_DEFS = {
  fade: {
    name: 'Fade',
    renderId: '99BDD1C3-EE98-4E80-A8DE-3699CE9F338E',
    behaviorDescription: 'Fade',
    category: 'Dissolves',
    defaultDuration: 0.6,
  },
  dissolve: {
    name: 'Dissolve',
    renderId: 'EC52A828-AD85-4602-B70C-1DEE7C904DB6',
    behaviorDescription: 'Cross Dissolve.',
    category: 'Dissolves',
    defaultDuration: 0.6,
  },
  cut: {
    name: 'Cut',
    renderId: 'AB29D07B-E9E2-4E0A-93BD-AD3EA58120FA',
    behaviorDescription: 'Cut.',
    category: 'None',
    defaultDuration: 0,
  },
};

function makeTransition(type, duration) {
  const def = TRANSITION_DEFS[type] || TRANSITION_DEFS.fade;
  const dur = (duration !== undefined && duration !== null) ? duration : def.defaultDuration;
  const t = { effect: { uuid: uuid(), name: def.name, renderId: def.renderId, behaviorDescription: def.behaviorDescription, category: def.category } };
  if (dur > 0) t.duration = dur;
  return t;
}

// ─── Build animations ─────────────────────────────────────────────────────

function makeBuildIn() {
  return {
    uuid: uuid(),
    start: 'START_WITH_SLIDE',
    delayTime: 1,
    transition: {
      effect: {
        uuid: uuid(),
        name: 'Cut',
        renderId: 'AB29D07B-E9E2-4E0A-93BD-AD3EA58120FA',
        behaviorDescription: 'Cut.',
        category: 'None',
      },
    },
  };
}

function makeBuildOut(start, delayTime) {
  const b = {
    uuid: uuid(),
    start,
    transition: {
      duration: 0.6000000238418579,
      effect: {
        uuid: uuid(),
        name: 'Dissolve',
        renderId: 'EC52A828-AD85-4602-B70C-1DEE7C904DB6',
        behaviorDescription: 'Cross Dissolve.',
        category: 'Dissolves',
      },
    },
  };
  if (delayTime !== undefined) b.delayTime = delayTime;
  return b;
}

// ─── Element slot ─────────────────────────────────────────────────────────

function makeSlot(element, { buildIn, buildOut, info = 3 } = {}) {
  const slot = { element, info };
  if (buildIn)  slot.buildIn  = { ...buildIn,  elementUUID: element.uuid };
  if (buildOut) slot.buildOut = { ...buildOut, elementUUID: element.uuid };
  slot.textScroller = { scrollRate: 0.5, shouldRepeat: true };
  return slot;
}

/**
 * Apply build order entries to a slot array.
 * Attaches buildIn/buildOut to matching slots (by element.name) in table-row order.
 * Returns the UUID array for elementBuildOrder, or null if entries is empty.
 */
function applyBuildOrders(slots, entries) {
  if (!entries || !entries.length) return null;

  // Build a name→slot map
  const byName = {};
  for (const slot of slots) {
    const name = slot.element?.name;
    if (name && !byName[name]) byName[name] = slot;
  }

  const buildOrder = [];
  for (const entry of entries) {
    if (!entry.enabled) continue;
    const slot = byName[entry.element];
    if (!slot) continue;

    const build = {
      uuid: uuid(),
      start: entry.start,
      transition: makeTransition(entry.transition, entry.duration),
    };
    if (entry.delay > 0) build.delayTime = entry.delay;

    if (entry.dir === 'in') {
      slot.buildIn = { ...build, elementUUID: slot.element.uuid };
      buildOrder.push(slot.buildIn.uuid);
    } else {
      slot.buildOut = { ...build, elementUUID: slot.element.uuid };
      buildOrder.push(slot.buildOut.uuid);
    }
  }

  return buildOrder; // explicit order (may be [] if all disabled)
}

// ─── Font adv helpers ─────────────────────────────────────────────────────

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

// ─── Element builders ─────────────────────────────────────────────────────

function bounds(x, y, w, h) {
  return { origin: { x, y }, size: { width: w, height: h } };
}

function makeBodyElement({ name = 'body', x, y, w, h, rtfData, charCount }, rs = {}) {
  const id = uuid();
  return {
    uuid: id,
    name,
    bounds: bounds(x, y, w, h),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: resolveStroke(rs.bodyFontAdv, { width: 3, color: C_WHITE }),
    shadow: resolveShadow(rs.bodyFontAdv, EL_SHADOW_STD),
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: rs.bodyFont || 'Montserrat-Medium', size: 44, family: 'Montserrat' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: charCount ? [{ range: { end: charCount } }] : [],
      },
      shadow: TXT_SHADOW_LO,
      rtfData,
      scaleBehavior: resolveScaleBehavior(rs.bodyFontAdv, 'SCALE_BEHAVIOR_SCALE_FONT_DOWN'),
      verticalAlignment: resolveVertAlign(rs.bodyFontAdv, 'VERTICAL_ALIGNMENT_BOTTOM'),
      margins: resolveMargins(rs.bodyFontAdv, {
        left:   rs.bodyMarginLeft   ?? 0,
        top:    rs.bodyMarginTop    ?? 0,
        right:  rs.bodyMarginRight  ?? 0,
        bottom: rs.bodyMarginBottom ?? 60,
      }),
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

function makePointBodyElement({ x, y, w, h, rtfData, text }, rs = {}) {
  x = x ?? 0; y = y ?? 729.98; w = w ?? 1920; h = h ?? 350.02;
  const id = uuid();
  const charCount = text.length;
  return {
    uuid: id,
    name: 'body',
    bounds: bounds(x, y, w, h),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: resolveStroke(rs.boldFontAdv, { width: 3, color: C_WHITE }),
    shadow: resolveShadow(rs.boldFontAdv, EL_SHADOW_STD),
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: rs.boldFont || 'Montserrat-Black', size: 44, bold: true, family: 'Montserrat' },
        capitalization: 'CAPITALIZATION_ALL_CAPS',
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: [
          { range: { end: charCount }, capitalization: 'CAPITALIZATION_ALL_CAPS' },
          { range: { end: charCount } },
        ],
      },
      shadow: TXT_SHADOW_LO,
      rtfData,
      scaleBehavior: resolveScaleBehavior(rs.boldFontAdv, 'SCALE_BEHAVIOR_SCALE_FONT_DOWN'),
      verticalAlignment: resolveVertAlign(rs.bodyFontAdv, 'VERTICAL_ALIGNMENT_BOTTOM'),
      margins: resolveMargins(rs.bodyFontAdv, {
        left:   rs.bodyMarginLeft   ?? 0,
        top:    rs.bodyMarginTop    ?? 0,
        right:  rs.bodyMarginRight  ?? 0,
        bottom: rs.bodyMarginBottom ?? 60,
      }),
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

function makeStartEndElement({ text }, rs = {}) {
  const id = uuid();
  const charCount = text.length;
  const x = rs.startEndX ?? 0;
  const y = rs.startEndY ?? 900.14;
  const w = rs.startEndW ?? rs.canvasW ?? 1920;
  const h = rs.startEndH ?? 179.86;
  return {
    uuid: id,
    name: 'body',
    bounds: bounds(x, y + (rs.startEndFontAdv?.yOffset ?? 0), w, h),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: resolveStroke(rs.startEndFontAdv, { width: 3, color: C_WHITE }),
    shadow: resolveShadow(rs.startEndFontAdv, EL_SHADOW_STD),
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: rs.startEndFont || 'Montserrat-ExtraBold', size: 45, bold: true, family: 'Montserrat' },
        capitalization: 'CAPITALIZATION_ALL_CAPS',
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: [
          { range: { end: charCount }, capitalization: 'CAPITALIZATION_ALL_CAPS' },
          { range: { end: charCount } },
        ],
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfStartEnd(text, rs),
      scaleBehavior: resolveScaleBehavior(rs.startEndFontAdv, 'SCALE_BEHAVIOR_SCALE_FONT_DOWN'),
      verticalAlignment: resolveVertAlign(rs.startEndFontAdv, 'VERTICAL_ALIGNMENT_MIDDLE'),
      margins: resolveMargins(rs.startEndFontAdv, { left: 20, right: 20, top: 20, bottom: 20 }),
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/**
 * Title element for START/END slides — named 'title', positioned at the live badge bounds
 * (below main canvas, visible on confidence monitor), shows the slide label text.
 * Styled like the live element: HelveticaNeue, blue fill, white text, centered.
 */
function makeStartEndTitleEl({ text }, rs = {}) {
  const id = uuid();
  const label = text || '';
  return {
    uuid: id,
    name: 'title',
    bounds: bounds(rs.liveX ?? 1736.73, rs.liveY ?? 1096.71, rs.liveW ?? 183.27, rs.liveH ?? 71.56),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'HelveticaNeue', size: 42, family: 'Helvetica Neue' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: 0,
        customAttributes: [{ range: { end: label.length } }],
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfLiveLabel(label),
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

function makeLiveElement(rs = {}) {
  const id = uuid();
  return {
    uuid: id,
    name: 'live',
    bounds: bounds(rs.liveX ?? 1736.73, rs.liveY ?? 1096.71, rs.liveW ?? 183.27, rs.liveH ?? 71.56),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill || hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'HelveticaNeue', size: 42, family: 'Helvetica Neue' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: 0,
        customAttributes: [{ range: { end: 4 } }],
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfLive(),
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/**
 * Estimate title Y when autoTitleY is enabled.
 * Counts wrapped lines in displayBody using character-width estimation,
 * then positions the title bar `titleAutoGap` px above the body text top edge.
 */
function estimateTitleY(displayBody, bw, rs) {
  const bodySize     = rs.bodySize ?? 44;
  const lineH        = bodySize * 1.3;
  const gap          = rs.titleAutoGap ?? 16;
  const by           = rs.bodyY ?? 729.98;
  const bh           = rs.bodyH ?? 350.02;
  const th           = rs.titleH ?? 50.51;

  // Flatten text; split into paragraphs on explicit newlines
  const fullText     = (displayBody || []).map(s => s.text || '').join('');
  const paragraphs   = fullText.split('\n');

  // Avg char width for Montserrat-Medium ≈ 0.52 × font size
  const avgCharW     = bodySize * 0.52;
  const charsPerLine = Math.max(1, bw / avgCharW);

  let totalLines = 0;
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    const words = trimmed.split(/\s+/);
    let lineLen = 0;
    let lines   = 1;
    for (const word of words) {
      const wLen = word.length;
      if (lineLen > 0 && lineLen + 1 + wLen > charsPerLine) {
        lines++;
        lineLen = wLen;
      } else {
        lineLen += (lineLen > 0 ? 1 : 0) + wLen;
      }
    }
    totalLines += lines;
  }
  if (totalLines === 0) totalLines = 1;

  const marginBottom   = rs.bodyFontAdv?.marginBottom || (rs.bodyMarginBottom ?? 60);
  const estimatedTextH = totalLines * lineH;
  const textTop        = by + bh - marginBottom - estimatedTextH;
  return Math.round(textTop - gap - th);
}

function makeTitleElement({ reference, titleY }, rs = {}) {
  const id = uuid();
  const charCount = reference.length;
  if (titleY === undefined) titleY = rs.titleY ?? 880;
  const tx = rs.titleX ?? -0.18;
  const tw = rs.titleW ?? (rs.canvasW ?? 1920) + 0.18;
  const th = rs.titleH ?? 50.51;
  const adv = rs.titleFontAdv || {};
  const titleShadow = { angle: 315, offset: 5, radius: 5, color: rs.cTitleShadow || hexToColor('#ff2600'), opacity: 0.75 };
  return {
    uuid: id,
    name: 'title',
    bounds: bounds(tx, titleY + (adv.yOffset ?? 0), tw, th),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cTitleFill || hexToColor('#a9391a') },
    stroke: resolveStroke(rs.titleFontAdv, { width: 3, color: C_WHITE }),
    shadow: resolveShadow(rs.titleFontAdv, titleShadow),
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: rs.titleFont || 'Impact', size: 40, bold: true, family: rs.titleFont || 'Impact' },
        capitalization: 'CAPITALIZATION_ALL_CAPS',
        textSolidFill: rs.cTitleText || hexToColor('#f6d046'),
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, paragraphSpacing: 20, defaultTabInterval: 84, textList: {} },
        kerning: 4,
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: [
          { range: { end: charCount }, capitalization: 'CAPITALIZATION_ALL_CAPS' },
        ],
      },
      shadow: TXT_SHADOW_LO,
      rtfData: rtf.rtfTitle(reference, rs),
      verticalAlignment: resolveVertAlign(rs.titleFontAdv, 'VERTICAL_ALIGNMENT_MIDDLE'),
      margins: resolveMargins(rs.titleFontAdv, { left: 25 }),
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

function makeGradientElement(rs = {}) {
  const id = uuid();
  const gx = rs.gradientX ?? 0;
  const gy = rs.gradientY ?? 351.77;
  const gw = rs.canvasW ?? 1920;
  const gh = rs.gradientH ?? 728.23;
  return {
    uuid: id,
    name: 'atem_gradient',
    bounds: bounds(gx, gy, gw, gh),
    opacity: 1,
    path: RECT_PATH,
    fill: {
      gradient: {
        angle: 90,
        length: 1,
        stops: [
          { color: { alpha: 0.949999988079071 }, blendPoint: 0.5 },
          { color: {},                            blendPoint: 0.5 },
        ],
      },
      enable: true,
    },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'HelveticaNeue', size: 42, family: 'Helvetica Neue' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: 0,
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfEmpty(),
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/**
 * QR code image element.
 * Positioned at x=0, y=655.2, w=423.8, h=424.8 (bottom-left corner).
 * fill.media references qrcode.png in the app directory.
 */
function makeQRElement() {
  const id = uuid();
  const qrPath = `file://${path.join(__dirname, 'qrcode.png')}`;
  return {
    uuid: id,
    name: 'qr',
    bounds: bounds(0, 655.2, 423.8, 424.8),
    opacity: 1,
    path: RECT_PATH,
    fill: {
      media: {
        uuid: uuid(),
        url: {
          absoluteString: qrPath,
          platform: 'PLATFORM_MACOS',
        },
        image: { drawing: {} },
      },
    },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'HelveticaNeue', size: 16, family: 'Helvetica Neue' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: 0,
        customAttributes: [],
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfEmpty(),
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

// ─── Response card element builders ──────────────────────────────────────────

/** Decorative "response N" label — Desire-Pro, tan, centered, y=847.8 */
function makeResponseLabelElement(n) {
  const id = uuid();
  return {
    uuid: id,
    name: 'title',
    bounds: bounds(77, 847.8, 1759.8, 211.2),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'Desire-Pro', size: 60, family: 'Desire-Pro' },
        textSolidFill: C_TAN,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: [],
      },
      shadow: TXT_SHADOW_LO,
      rtfData: rtf.rtfResponseLabel(n),
      scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/** Response body text element — Montserrat-Medium, centered, y=730 */
function makeResponseBodyElement(text) {
  const id = uuid();
  const charCount = (text || '').length;
  return {
    uuid: id,
    name: 'body',
    bounds: bounds(82.8, 730, 1754.4, 350),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'Montserrat-Medium', size: 45, family: 'Montserrat' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { alignment: 'ALIGNMENT_CENTER', lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: charCount ? [{ range: { end: charCount } }] : [],
      },
      shadow: TXT_SHADOW_LO,
      rtfData: rtf.rtfResponseBody(text),
      scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
      verticalAlignment: 'VERTICAL_ALIGNMENT_BOTTOM',
      margins: { bottom: 60 },
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/** Confidence monitor element for response slides — off-screen y=1135, full list */
function makeResponseConfMonitorElement(decisionText, r1, r2, r3) {
  const id = uuid();
  const plain = [decisionText || '', `1 — ${r1 || ''}`, `2 — ${r2 || ''}`, `3 — ${r3 || ''}`].join('\n');
  return {
    uuid: id,
    name: 'this slide',
    bounds: bounds(76.8, 1135.1, 1832.3, 351.6),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'Montserrat-Medium', size: 40, family: 'Montserrat' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: plain.length ? [{ range: { end: plain.length } }] : [],
      },
      shadow: TXT_SHADOW_LO,
      rtfData: rtf.rtfResponseConfMonitor(decisionText, r1, r2, r3),
      scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
      verticalAlignment: 'VERTICAL_ALIGNMENT_TOP',
      margins: { top: 10 },
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/** Response Card Hold title — Montserrat-BlackItalic, static */
function makeResponseHoldTitleElement() {
  const id = uuid();
  const text = 'response CARD HOLD';
  return {
    uuid: id,
    name: 'title',
    bounds: bounds(118.5, 900.1, 1683.2, 179.9),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: hexToColor('#2196f2') },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'Montserrat-BlackItalic', size: 43, bold: true, family: 'Montserrat' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: -1,
        strokeColor: C_BLACK_A,
        customAttributes: [{ range: { end: text.length } }],
      },
      shadow: TXT_SHADOW_LO,
      rtfData: rtf.rtfResponseHoldTitle(),
      scaleBehavior: 'SCALE_BEHAVIOR_SCALE_FONT_DOWN',
      verticalAlignment: 'VERTICAL_ALIGNMENT_MIDDLE',
      margins: {},
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

/**
 * Queue sidebar element: shows upcoming slide labels.
 * x=0, y=0, w=400, h=1080 — full-height left sidebar on confidence monitor.
 * labels: string[] (already truncated to ≤20 chars)
 */
function makeQueueElement(labels, rs = {}) {
  const id = uuid();
  return {
    uuid: id,
    name: 'queue',
    bounds: bounds(rs.queueX ?? 0, rs.queueY ?? 0, rs.queueW ?? 400, rs.queueH ?? 1080),
    opacity: 1,
    path: RECT_PATH,
    fill: { color: rs.cFill70 || { ...hexToColor('#2196f2'), alpha: 0.7 } },
    stroke: { width: 3, color: C_WHITE },
    shadow: EL_SHADOW_STD,
    feather: { radius: 0.05 },
    text: {
      attributes: {
        font: { name: 'HelveticaNeue', size: 16, family: 'Helvetica Neue' },
        textSolidFill: C_WHITE,
        underlineStyle: {},
        paragraphStyle: { lineHeightMultiple: 1, defaultTabInterval: 84, textList: {} },
        strikethroughStyle: {},
        strokeWidth: 0,
        customAttributes: [],
      },
      shadow: TXT_SHADOW_STD,
      rtfData: rtf.rtfQueue(labels),
      verticalAlignment: 'VERTICAL_ALIGNMENT_TOP',
      margins: { left: 10, top: 10 },
      isSuperscriptStandardized: true,
      transformDelimiter: '  •  ',
      chordPro: { color: C_CHORD },
    },
    textLineMask: {},
  };
}

// ─── Notes RTF ────────────────────────────────────────────────────────────

function emptyNotesRtf() {
  return Buffer.from(
    '{\\rtf1\\ansi\\ansicpg1252\\cocoartf2865\n' +
    '\\cocoatextscaling0\\cocoaplatform0{\\fonttbl\\f0\\fnil\\fcharset0 HelveticaNeue;}\n' +
    '{\\colortbl;\\red255\\green255\\blue255;\\red255\\green255\\blue255;}\n' +
    '{\\*\\expandedcolortbl;;\\csgray\\c100000;}\n' +
    '\\deftab1300\n' +
    '\\pard\\pardeftab1300\\pardirnatural\\partightenfactor0\n' +
    '\n' +
    '\\f0\\fs100 \\cf2 }'
  ).toString('base64');
}

// ─── Slide / action builders ───────────────────────────────────────────────

function makeBaseSlide(elements, explicitBuildOrder) {
  let buildOrder;
  if (explicitBuildOrder !== undefined && explicitBuildOrder !== null) {
    buildOrder = explicitBuildOrder;
  } else {
    buildOrder = [];
    for (const slot of elements) {
      if (slot.buildIn)  buildOrder.push(slot.buildIn.uuid);
      if (slot.buildOut) buildOrder.push(slot.buildOut.uuid);
    }
  }
  return {
    elements,
    elementBuildOrder: buildOrder,
    size: { width: 1920, height: 1080 },
    uuid: uuid(),
  };
}

function makeSlideAction(label, elements, buildOrder, notesRtf) {
  return {
    uuid: uuid(),
    label: { text: label },
    isEnabled: true,
    type: 'ACTION_TYPE_PRESENTATION_SLIDE',
    slide: {
      presentation: {
        baseSlide: makeBaseSlide(elements, buildOrder),
        notes: {
          rtfData: notesRtf || emptyNotesRtf(),
          attributes: {},
        },
        chordChart: { platform: 'PLATFORM_MACOS' },
      },
    },
  };
}

function macroAction(macroName, macroUuid) {
  return {
    uuid: uuid(),
    isEnabled: true,
    type: 'ACTION_TYPE_MACRO',
    macro: {
      identification: {
        parameterUuid: { string: macroUuid },
        parameterName: macroName,
      },
    },
  };
}

function clearPropAction() {
  return {
    uuid: uuid(),
    isEnabled: true,
    type: 'ACTION_TYPE_CLEAR',
    clear: { targetLayer: 'CLEAR_TARGET_LAYER_PROP' },
  };
}

function stageLayoutAction({ screenName, screenUuid, layoutName, layoutUuid } = {}) {
  return {
    uuid: uuid(),
    name: 'Stage',
    isEnabled: true,
    type: 'ACTION_TYPE_STAGE_LAYOUT',
    stage: {
      stageScreenAssignments: [{
        screen: {
          parameterUuid: { string: screenUuid || '' },
          parameterName: screenName || 'Stage Screen 1',
        },
        layout: {
          parameterUuid: { string: layoutUuid || '' },
          parameterName: layoutName || '',
        },
      }],
    },
  };
}

// propUuidMap: { propName → uuidString } — populated by encode.js from buildAllPropCues output
let PROP_UUID_MAP = {};

function propAction(propName) {
  const propUuid = PROP_UUID_MAP[propName] || randomUUID().toUpperCase();
  return {
    uuid: uuid(),
    isEnabled: true,
    type: 'ACTION_TYPE_PROP',
    prop: {
      identification: {
        parameterUuid: { string: propUuid },
        parameterName: propName,
      },
    },
  };
}

// Macro UUIDs (defaults — can be overridden per-spec via spec.macros)
const MACRO_DEFAULTS = {
  START:   '7C586E48-986E-4932-9219-7D6A64BE5B6C',
  CONTENT: '8C15C594-8EE3-431C-B35C-B70B6AB91548',
  BLANK:   '3AC673FE-0841-4391-81F7-F2042F312E1C',
  LOGO:    '8CB7C31F-4B7E-41EE-96A5-D86F7CC8A71B',
  NO_LOGO: 'DF162F4C-DA5D-4DE2-8379-3F369BC4BA07',
};
// Active macros for the current build — set by buildPresentation
let MACRO = MACRO_DEFAULTS;

// Stage screen config for the current build — set by buildPresentation
let STAGE_SCREEN = {};

// ─── Cue type builders ────────────────────────────────────────────────────

function buildStartCue(spec, rs) {
  const text    = spec.text || spec.label || 'START';
  const label   = spec.label || 'START';
  const bodyEl  = makeStartEndElement({ text }, rs);
  const titleEl = makeStartEndTitleEl({ text: label }, rs);
  const slots   = [makeSlot(bodyEl), makeSlot(titleEl, { info: 2 })];
  const bo      = applyBuildOrders(slots, rs.buildOrders?.startEnd);
  const notesRtf = rtf.rtfNotes([{ text }]) || emptyNotesRtf();
  return {
    uuid: uuid(),
    _type: 'start',
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction(spec.label || 'START', slots, bo, notesRtf),
      macroAction('Message - Start', MACRO.START),
      clearPropAction(),
      macroAction('LOGO', MACRO.LOGO),
    ],
  };
}

function buildEndCue(spec, rs) {
  const text    = spec.text || spec.label || 'End of Notes';
  const label   = spec.label || 'End of Notes';
  const bodyEl  = makeStartEndElement({ text }, rs);
  const titleEl = makeStartEndTitleEl({ text: label }, rs);
  const slots   = [makeSlot(bodyEl), makeSlot(titleEl, { info: 2 })];
  const bo      = applyBuildOrders(slots, rs.buildOrders?.startEnd);
  const notesRtf = rtf.rtfNotes([{ text }]) || emptyNotesRtf();
  return {
    uuid: uuid(),
    _type: 'end',
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction(spec.label || 'End of Notes', slots, bo, notesRtf),
      clearPropAction(),
      macroAction('LOGO', MACRO.LOGO),
    ],
  };
}

function buildBlankCue(spec, rs) {
  const bo = applyBuildOrders([], rs.buildOrders?.blank);
  // Slides notes from spans (confidence monitor text repurposed as notes)
  const notesRtf = (spec.spans?.length)
    ? (rtf.rtfNotes(spec.spans) || emptyNotesRtf())
    : emptyNotesRtf();
  const actions = [
    makeSlideAction(spec.label || '', [], bo, notesRtf),
  ];
  // Optional stage layout action (inserted before LOGO macro)
  if (spec.stageLayout?.layoutName) {
    actions.push(stageLayoutAction({
      screenName: STAGE_SCREEN.screenName,
      screenUuid: STAGE_SCREEN.screenUuid,
      ...spec.stageLayout,
    }));
  }
  actions.push(macroAction('LOGO', MACRO.LOGO));
  return {
    uuid: uuid(),
    _type: 'blank',
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions,
  };
}

/** Returns an ARRAY of cues — one per body in spec.bodies. */
function buildScriptureCues(spec, rs) {
  // Per-slide body bounds override spec values take precedence over scheme defaults
  const bx = spec.bodyX ?? rs.bodyX ?? 0;
  const by = rs.bodyY ?? 729.98;
  const bw = spec.bodyW ?? rs.bodyW ?? rs.canvasW ?? 1920;
  const bh = rs.bodyH ?? 350.02;
  const bodyYOff = rs.bodyFontAdv?.yOffset ?? 0;

  // Build combined span array across all bodies for slide notes (full verse)
  const allBodies = spec.bodies || [spec.body || []];
  const allBodySpansForNotes = allBodies.reduce((acc, bd, i) => {
    if (i > 0) acc.push({ text: '\n' });
    return acc.concat(bd || []);
  }, []);

  return allBodies.map((body, idx) => {
    // Strip newlines for main slide if requested (prop always keeps them)
    const displayBody = spec.stripNewlines
      ? (body || []).filter(s => s.text !== '\n')
      : (body || []);
    const bodyRtf   = rtf.rtfBody(displayBody, rs);
    const plainBody = displayBody.map(s => s.text).join('');

    const liveEl  = makeLiveElement(rs);
    // Auto Title Y: estimate from line count if enabled; otherwise use scheme titleY directly
    const computedTitleY = rs.autoTitleY
      ? estimateTitleY(displayBody, bw, rs)
      : (rs.titleY ?? (rs.bodyY ?? 729.98) + (rs.titleGapShort ?? 0));
    const titleEl = makeTitleElement({ reference: spec.reference, titleY: computedTitleY }, rs);
    const bodyEl  = makeBodyElement({ x: bx, y: by + bodyYOff, w: bw, h: bh, rtfData: bodyRtf, charCount: plainBody.length }, rs);
    const gradEl  = makeGradientElement(rs);

    const slots = [
      makeSlot(liveEl,  { info: 2 }),
      makeSlot(titleEl),
      makeSlot(bodyEl),
      makeSlot(gradEl,  { info: 1 }),
    ];
    const bo = applyBuildOrders(slots, rs.buildOrders?.content);

    const label     = idx === 0 ? spec.label : `${spec.label} (${idx + 1})`;
    // Notes always contain the FULL verse (all bodies) so confidence monitor shows complete text
    const notesRtf  = allBodySpansForNotes ? (rtf.rtfNotes(allBodySpansForNotes) || emptyNotesRtf()) : emptyNotesRtf();
    return {
      uuid: uuid(),
      _type: 'scripture',
      completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
      hotKey: {},
      isEnabled: true,
      actions: [
        makeSlideAction(label, slots, bo, notesRtf),
        macroAction('NO LOGO', MACRO.NO_LOGO),
        propAction(spec.propName ?? spec.reference ?? 'scripture'),
      ],
    };
  });
}

/**
 * Returns an ARRAY of cues.
 * mode='single'    → 1 cue
 * mode='revealing' → N cues (one per bullet)
 */
function buildPointCues(spec, rs) {
  const bx = spec.bodyX ?? rs.bodyX ?? 0;
  const by = rs.bodyY ?? 729.98;
  const bw = spec.bodyW ?? rs.bodyW ?? rs.canvasW ?? 1920;
  const bh = rs.bodyH ?? 350.02;
  const boldYOff = rs.boldFontAdv?.yOffset ?? 0;

  if (spec.mode === 'revealing') {
    return (spec.bullets || []).map((bullet, idx) => {
      const bulletText = rtf.bulletToText(bullet);
      const bodyRtf = rtf.rtfPointBody(bullet, rs);
      const gradEl  = makeGradientElement(rs);
      const liveEl  = makeLiveElement(rs);
      const bodyEl  = makePointBodyElement({ x: bx, y: by + boldYOff, w: bw, h: bh, rtfData: bodyRtf, text: bulletText }, rs);

      const slots = [
        makeSlot(bodyEl),
        makeSlot(gradEl, { info: 1 }),
        makeSlot(liveEl, { info: 2 }),
      ];
      const bo = applyBuildOrders(slots, rs.buildOrders?.point);

      const propName = `${spec.propBaseName}_${idx + 1}`;
      const label    = idx === 0 ? spec.label : `${spec.label} (${idx + 1})`;
      const notesRtf = rtf.rtfNotes([{ text: bulletText, bold: true }]);

      return {
        uuid: uuid(),
        _type: 'point',
        completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
        hotKey: {},
        isEnabled: true,
        actions: [
          makeSlideAction(label, slots, bo, notesRtf),
          macroAction('NO LOGO', MACRO.NO_LOGO),
          propAction(propName),
        ],
      };
    });
  }

  // Single mode
  const bodyRtf = rtf.rtfPointBody(spec.bodyText || '', rs);
  const gradEl  = makeGradientElement(rs);
  const liveEl  = makeLiveElement(rs);
  const bodyEl  = makePointBodyElement({ x: bx, y: by + boldYOff, w: bw, h: bh, rtfData: bodyRtf, text: spec.bodyText || '' }, rs);

  const slots = [
    makeSlot(bodyEl),
    makeSlot(gradEl, { info: 1 }),
    makeSlot(liveEl, { info: 2 }),
  ];
  const bo = applyBuildOrders(slots, rs.buildOrders?.point);

  const notesRtf = rtf.rtfNotes([{ text: spec.bodyText || '', bold: true }]);
  return [{
    uuid: uuid(),
    _type: 'point',
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction(spec.label, slots, bo, notesRtf),
      macroAction('NO LOGO', MACRO.NO_LOGO),
      propAction(spec.propName ?? spec.bodyText ?? 'point'),
    ],
  }];
}

/** Image placeholder slide: atem_gradient + live (no main body content). */
function buildImageCue(spec, rs) {
  const gradEl   = makeGradientElement(rs);
  const liveEl   = makeLiveElement(rs);
  const notesRtf = rtf.rtfNotes([{ text: spec.label || 'Image' }]) || emptyNotesRtf();

  const slots = [
    makeSlot(liveEl, { info: 2 }),
    makeSlot(gradEl, { info: 1 }),
  ];

  return {
    uuid: uuid(),
    _type: 'image',
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction(spec.label, slots, undefined, notesRtf),
      macroAction('NO LOGO', MACRO.NO_LOGO),
      clearPropAction(),
    ],
  };
}

/**
 * 6 response card cues (order: Blank → RC → R1 → R2 → R3 → Hold).
 * Confidence monitor content moves to slide notes — no off-screen 'this slide' element.
 * Stage layout actions on Blank and RC come from STAGE_SCREEN config.
 * responses: { decisionText, r1, r2, r3 }
 */
function buildResponseCardCues(responses = {}, rs = {}) {
  const { decisionText = '', r1 = '', r2 = '', r3 = '' } = responses;

  // Shared notes: full decision text + all responses (feeds confidence monitor)
  const rcNotesSpans = [
    { text: decisionText || '' },
    { text: '\n1 — ' + (r1 || '') },
    { text: '\n2 — ' + (r2 || '') },
    { text: '\n3 — ' + (r3 || '') },
  ];
  const rcNotesRtf = rtf.rtfNotes(rcNotesSpans) || emptyNotesRtf();

  const ss = STAGE_SCREEN;

  // ── 1. Response Card Blank ───────────────────────────────────────────────────
  // Black slide that triggers the RESPONSE CARD stage layout + LOGO macro
  const blankCue = {
    uuid: uuid(),
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction('Response Card Blank', [], null, rcNotesRtf),
      macroAction('LOGO', MACRO.LOGO),
      ...(ss.rcLayoutName ? [stageLayoutAction({
        screenName: ss.screenName,
        screenUuid: ss.screenUuid,
        layoutName: ss.rcLayoutName,
        layoutUuid: ss.rcLayoutUuid,
      })] : []),
    ],
  };

  // ── 2. Response Card (main — switches stage back to message, shows decision text) ──
  const rcMainCue = {
    uuid: uuid(),
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction('Response Card', [
        makeSlot(makeLiveElement(rs), { info: 2 }),
        makeSlot(makeResponseBodyElement(decisionText)),
        makeSlot(makeGradientElement(rs), { info: 1 }),
      ], null, rcNotesRtf),
      macroAction('NO LOGO', MACRO.NO_LOGO),
      ...(ss.messageLayoutName ? [stageLayoutAction({
        screenName: ss.screenName,
        screenUuid: ss.screenUuid,
        layoutName: ss.messageLayoutName,
        layoutUuid: ss.messageLayoutUuid,
      })] : []),
      propAction('Response Card'),
    ],
  };

  // ── 3–5. Response 1, 2, 3 ───────────────────────────────────────────────────
  const responseCues = [r1, r2, r3].map((text, idx) => {
    const n = idx + 1;
    return {
      uuid: uuid(),
      completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
      hotKey: {},
      isEnabled: true,
      actions: [
        makeSlideAction(`Response ${n}`, [
          makeSlot(makeResponseLabelElement(n)),
          makeSlot(makeLiveElement(rs), { info: 2 }),
          makeSlot(makeResponseBodyElement(text)),
          makeSlot(makeGradientElement(rs), { info: 1 }),
        ], null, rcNotesRtf),
        macroAction('NO LOGO', MACRO.NO_LOGO),
        propAction('Response Card'),
      ],
    };
  });

  // ── 6. Response Card Hold ────────────────────────────────────────────────────
  const holdCue = {
    uuid: uuid(),
    completionActionType: 'COMPLETION_ACTION_TYPE_LAST',
    hotKey: {},
    isEnabled: true,
    actions: [
      makeSlideAction('Response Card Hold', [
        makeSlot(makeLiveElement(rs), { info: 2 }),
        makeSlot(makeResponseHoldTitleElement()),
      ], null, rcNotesRtf),
      macroAction('Message - Blank', MACRO.BLANK),
      macroAction('NO LOGO', MACRO.NO_LOGO),
      propAction('Response Card'),
    ],
  };

  return [blankCue, rcMainCue, ...responseCues, holdCue];
}

// ─── Helper: inject stage layout action into a cue ────────────────────────

function injectStageLayout(cue, stageLayout) {
  if (!stageLayout?.layoutName) return;
  const action = stageLayoutAction({
    screenName: STAGE_SCREEN.screenName,
    screenUuid: STAGE_SCREEN.screenUuid,
    ...stageLayout,
  });
  // Insert right after the PRESENTATION_SLIDE action
  const slideIdx = cue.actions?.findIndex(a => a.type === 'ACTION_TYPE_PRESENTATION_SLIDE') ?? -1;
  if (slideIdx !== -1) {
    cue.actions.splice(slideIdx + 1, 0, action);
  } else {
    cue.actions.push(action);
  }
}

// ─── Helper: inject QR element into a cue's slide elements ────────────────

function injectQRElement(cue) {
  const slideAction = cue.actions?.find(a => a.type === 'ACTION_TYPE_PRESENTATION_SLIDE');
  if (slideAction?.slide?.presentation?.baseSlide?.elements) {
    const qrSlot = makeSlot(makeQRElement());
    slideAction.slide.presentation.baseSlide.elements.push(qrSlot);
  }
}

// ─── Top-level presentation builder ───────────────────────────────────────

function buildPresentation(spec, propUuidMap = {}) {
  const { name, slides = [], qrEnabled = false, includeResponseCard = false, responses = {}, style = {}, macros: specMacros = {}, stageScreen: specStageScreen = {} } = spec;
  const rs = resolveStyle(style);

  // Install prop UUID map so propAction() uses coordinated UUIDs
  PROP_UUID_MAP = propUuidMap;

  // Apply per-spec macro UUID overrides, restore defaults when done
  MACRO = { ...MACRO_DEFAULTS, ...specMacros };

  // Stage screen config for this build
  STAGE_SCREEN = specStageScreen;

  // ── Step 1: Expand slides → raw cues with blank-before injection ──
  const rawCues = [];

  for (const slide of slides) {
    if (slide.type === 'start') {
      rawCues.push(buildStartCue(slide, rs));
      continue;
    }
    if (slide.type === 'end') {
      rawCues.push(buildEndCue(slide, rs));
      continue;
    }
    if (slide.type === 'blank') {
      const bc = buildBlankCue({
        label:       slide.label || 'Blank',
        spans:       slide.spans || [],
        stageLayout: slide.stageLayout || null,
      }, rs);
      bc._slideTransition = slide.transition || null;
      rawCues.push(bc);
      continue;
    }
    if (slide.type === 'image') {
      const ic = buildImageCue(slide, rs);
      ic._slideTransition = slide.transition || null;
      injectStageLayout(ic, slide.stageLayout);
      rawCues.push(ic);
      continue;
    }
    if (slide.type === 'scripture') {
      if (slide.blankBefore) {
        // Notes for blank-before = full scripture body so confidence monitor shows upcoming content
        const allBodies  = slide.bodies || [slide.body || []];
        const bodySpans  = allBodies.reduce((acc, bd, i) => {
          if (i > 0) acc.push({ text: '\n' });
          return acc.concat(bd || []);
        }, []);
        const blankSpans = bodySpans.some(s => s.text) ? bodySpans : (slide.blankSpans || []);
        const blankCue = buildBlankCue({ label: '', spans: blankSpans }, rs);
        blankCue._isBlankBefore  = true;
        blankCue._isContentBlank = true;
        rawCues.push(blankCue);
      }
      const sc = buildScriptureCues(slide, rs);
      sc.forEach(c => {
        c._slideTransition = slide.transition || null;
        injectStageLayout(c, slide.stageLayout);
      });
      rawCues.push(...sc);
      continue;
    }
    if (slide.type === 'point') {
      if (slide.blankBefore) {
        // Notes for blank-before = point text so confidence monitor shows upcoming content
        const pointText  = slide.mode === 'revealing'
          ? (slide.bullets || []).filter(Boolean).map(b => rtf.bulletToText(b)).join('\n')
          : (slide.bodyText || '');
        const blankSpans = pointText
          ? [{ text: pointText, bold: true }]
          : (slide.blankSpans || []);
        const blankCue = buildBlankCue({ label: '', spans: blankSpans }, rs);
        blankCue._isBlankBefore  = true;
        blankCue._isContentBlank = true;
        rawCues.push(blankCue);
      }
      const pc = buildPointCues(slide, rs);
      pc.forEach(c => {
        c._slideTransition = slide.transition || null;
        injectStageLayout(c, slide.stageLayout);
      });
      rawCues.push(...pc);
      continue;
    }
  }

  // ── Step 2: Append Response Card cues before END (if enabled) ──
  if (includeResponseCard) {
    const endIdx = rawCues.findIndex(c => c._type === 'end');
    const rcCues = buildResponseCardCues(responses, rs);
    if (endIdx !== -1) {
      rawCues.splice(endIdx, 0, ...rcCues);
    } else {
      rawCues.push(...rcCues);
    }
  }

  // ── Step 3: Inject Message-Content macro into cues[1] ──
  if (rawCues.length > 1) {
    rawCues[1].actions.push(macroAction('Message - Content', MACRO.CONTENT));
  }

  // ── Step 4: Inject QR elements into content + blank-before cues ──
  if (qrEnabled) {
    for (const cue of rawCues) {
      if (cue._type === 'scripture' || cue._type === 'point' || cue._isContentBlank) {
        injectQRElement(cue);
      }
    }
  }

  // ── Step 5: Compute queue and inject queue element into every cue ──
  const getCueLabel = cue => {
    const sa = cue.actions?.find(a => a.type === 'ACTION_TYPE_PRESENTATION_SLIDE');
    return sa?.label?.text || '';
  };

  for (let i = 0; i < rawCues.length; i++) {
    const futureLabels = rawCues
      .slice(i + 1)
      .filter(c => !c._isBlankBefore)
      .map(c => {
        const lbl = getCueLabel(c);
        return lbl.length > 20 ? lbl.slice(0, 19) + '\u2026' : lbl;
      })
      .filter(Boolean);

    const queueEl   = makeQueueElement(futureLabels, rs);
    const queueSlot = makeSlot(queueEl);
    const slideAction = rawCues[i].actions?.find(a => a.type === 'ACTION_TYPE_PRESENTATION_SLIDE');
    if (slideAction?.slide?.presentation?.baseSlide?.elements) {
      slideAction.slide.presentation.baseSlide.elements.push(queueSlot);
    }
    // Inject slide-level or presentation-level transition
    if (slideAction?.slide?.presentation) {
      const st = rawCues[i]._slideTransition;
      const tType = st?.type || style.transitionType || 'fade';
      const tDur  = st?.duration !== undefined ? st.duration : (style.transitionDuration !== undefined ? style.transitionDuration : 0.6);
      slideAction.slide.presentation.transition = makeTransition(tType, tDur);
    }
  }

  // ── Clean up internal markers ──
  for (const cue of rawCues) {
    delete cue._type;
    delete cue._isBlankBefore;
    delete cue._isContentBlank;
    delete cue._slideTransition;
  }

  const presentationUuid = uuid();

  return {
    applicationInfo: {
      platform: 'PLATFORM_MACOS',
      platformVersion: { majorVersion: 26, patchVersion: 1 },
      application: 'APPLICATION_PROPRESENTER',
      applicationVersion: { majorVersion: 20, patchVersion: 1, build: '335544583' },
    },
    uuid: presentationUuid,
    name,
    background: { color: C_BLACK_A },
    chordChart: { platform: 'PLATFORM_MACOS' },
    cueGroups: [{
      group: { uuid: uuid(), hotKey: {} },
      cueIdentifiers: rawCues.map(c => c.uuid),
    }],
    ccli: {},
    timeline: { duration: 300 },
    transition: makeTransition(style.transitionType || 'fade', style.transitionDuration),
    cues: rawCues,
  };
  MACRO = MACRO_DEFAULTS;       // restore for next call
  PROP_UUID_MAP = {};           // restore for next call
  STAGE_SCREEN  = {};           // restore for next call
}

module.exports = { buildPresentation, MACRO_DEFAULTS };

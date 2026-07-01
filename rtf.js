/**
 * RTF generator for Pro7 slide elements.
 * All exported functions return a base64-encoded RTF string for element.text.rtfData.
 *
 * Span format: Array<{ text: string, alt?: boolean, bold?: boolean }>
 * alt = emphasis font (scheme boldFont, inheriting bodyFont by default).
 * bold = plain \b on the current font.
 * For plain-text functions, just pass a string.
 *
 * Newlines in text: use '\n' — rendered as backslash+newline in RTF (RTF line break).
 */

// ─── Style helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex) {
  const h = (hex || '#000000').replace('#', '');
  return [parseInt(h.slice(0,2),16)||0, parseInt(h.slice(2,4),16)||0, parseInt(h.slice(4,6),16)||0];
}

/**
 * Build colortbl + expandedcolortbl from an array of hex colors.
 * Index 0 in the array = \cf1 in RTF.
 */
function makeColortbl(hexColors) {
  const col = hexColors.map(h => {
    const [r,g,b] = hexToRgb(h);
    return `\\red${r}\\green${g}\\blue${b}`;
  });
  const ext = hexColors.map(h => {
    const [r,g,b] = hexToRgb(h);
    const lr = Math.round(r/255*100000);
    const lg = Math.round(g/255*100000);
    const lb = Math.round(b/255*100000);
    return `\\cssrgb\\c${lr}\\c${lg}\\c${lb}`;
  });
  // expandedcolortbl must align index-for-index with colortbl. ProPresenter's
  // own format leaves the first colour (index 1, white) as an empty field —
  // hence the leading ';;' — and only lists high-precision cssrgb for indices
  // 2+. Emitting white here too shifts every index by one, so ProPresenter
  // (which prefers expandedcolortbl) reads \cf2 as white and \strokec3 as the
  // intended colour — producing white text with a coloured stroke.
  return `{\\colortbl;${col.join(';')};}\n{\\*\\expandedcolortbl;;${ext.slice(1).join(';')};}`;
}

// ─── Character escaping ────────────────────────────────────────────────────

// Windows-1252 map for common Unicode punctuation
const W1252 = {
  '\u2018': "\\'91",  // '  left single quote
  '\u2019': "\\'92",  // '  right single quote / apostrophe
  '\u201C': "\\'93",  // "  left double quote
  '\u201D': "\\'94",  // "  right double quote
  '\u2013': "\\'96",  // –  en dash
  '\u2014': "\\'97",  // —  em dash
  '\u2026': "\\'85",  // …  ellipsis
  '\u2022': "\\'95",  // •  bullet
};

function escapeRtf(text) {
  let out = '';
  for (const ch of text) {
    if (ch === '\n') {
      out += '\\\n';         // RTF line break: literal backslash + newline
    } else if (W1252[ch]) {
      out += W1252[ch];
    } else if (ch === '\\') {
      out += '\\\\';
    } else if (ch === '{') {
      out += '\\{';
    } else if (ch === '}') {
      out += '\\}';
    } else if (ch.charCodeAt(0) > 127) {
      // Encode remaining non-ASCII as Windows-1252 hex if possible, else unicode
      out += `\\u${ch.charCodeAt(0)}?`;
    } else {
      out += ch;
    }
  }
  return out;
}

// ─── RTF span renderer ─────────────────────────────────────────────────────

// Categorise spans and build the body RTF content string + metadata.
// Spans: [{ text, bold?, italic?, underline? }]
function buildSpanContent(spans) {
  const hasAlt    = spans.some(s => s.alt);
  const hasNonAlt = spans.some(s => !s.alt);
  const mixedAlt  = hasAlt && hasNonAlt;
  const allAlt    = hasAlt && !hasNonAlt;
  // hasIU: italic, underline, plain bold (\b only — not alt), OR superscript
  const hasIU     = spans.some(s => s.italic || s.underline || s.bold || s.super);

  // Fast path: uniform (all alt or all non-alt), no italic/underline/bold/superscript
  if (!mixedAlt && !hasIU) {
    const escaped = escapeRtf(spans.map(s => s.text).join(''));
    return { content: allAlt ? escaped.replace(/ /g, '\\~') : escaped, allAlt, mixedAlt };
  }

  // Per-span character formatting.
  // alt  = font switch to \f1 (emphasis font); bold = \b on current font; both independent.
  let content = '';
  let curAlt       = allAlt;   // matches caller's baseline font
  let curBold      = false;
  let curItalic    = false;
  let curUnderline = false;
  let curSuper     = false;

  for (const span of spans) {
    const rawEsc = escapeRtf(span.text);
    const txt = span.alt ? rawEsc.replace(/ /g, '\\~') : rawEsc;
    if (!txt) continue;

    let cmd = '';

    // Superscript
    const wantSuper = !!span.super;
    if (wantSuper !== curSuper) {
      cmd += wantSuper ? '\\super ' : '\\nosupersub ';
      curSuper = wantSuper;
    }

    // Font switch for alt (emphasis font) — only when mixed
    if (mixedAlt) {
      const wantAlt = !!span.alt;
      if (wantAlt !== curAlt) {
        if (wantAlt) {
          if (curBold) { cmd += '\\b0 '; curBold = false; }
          cmd += '\n\\f1 ';
        } else {
          cmd += '\n\\f0 ';
        }
        curAlt = wantAlt;
      }
    }

    // Regular bold (\b only, no font switch)
    const wantBold = !!span.bold;
    if (wantBold !== curBold) {
      cmd += wantBold ? '\\b ' : '\\b0 ';
      curBold = wantBold;
    }

    // Italic
    const wantItalic = !!span.italic;
    if (wantItalic !== curItalic) {
      cmd += wantItalic ? '\\i ' : '\\i0 ';
      curItalic = wantItalic;
    }

    // Underline
    const wantUnderline = !!span.underline;
    if (wantUnderline !== curUnderline) {
      cmd += wantUnderline ? '\\ul ' : '\\ulnone ';
      curUnderline = wantUnderline;
    }

    content += cmd + txt;
  }

  // Close open modifiers
  if (curBold)      content += '\\b0 ';
  if (curItalic)    content += '\\i0 ';
  if (curUnderline) content += '\\ulnone ';
  if (curSuper)     content += '\\nosupersub ';
  if (mixedAlt && curAlt) content += '\n\\f0 ';

  return { content, allAlt, mixedAlt };
}

// ─── RTF document templates ────────────────────────────────────────────────

function toBase64(rtfString) {
  return Buffer.from(rtfString).toString('base64');
}

const PARD_NORMAL  = '\\pard\\pardeftab1680\\pardirnatural\\partightenfactor0';
const PARD_CENTER  = '\\pard\\pardeftab1680\\pardirnatural\\qc\\partightenfactor0';
const PARD_TITLE   = '\\pard\\pardeftab1680\\sa400\\pardirnatural\\qc\\partightenfactor0';

// ─── Per-font advanced styling helpers ───────────────────────────────────────

/**
 * Build a dynamic \pard string from a fontAdv object.
 * forceCenter: override adv.alignment with 'center' (used for all-bold bodies, point bodies, etc.)
 */
function makePard(adv, forceCenter) {
  const align = forceCenter
    ? '\\qc'
    : (adv?.alignment === 'center' ? '\\qc'
       : adv?.alignment === 'right' ? '\\qr'
       : '');  // left / '' = pardirnatural default
  const sl = (adv?.lineHeight && adv.lineHeight !== 1)
    ? `\\sl${Math.round(adv.lineHeight * 240)}\\slmult1`
    : '';
  const sb = adv?.paragraphSpacingBefore
    ? `\\sb${Math.round(adv.paragraphSpacingBefore * 20)}`
    : '';
  const sa = adv?.paragraphSpacingAfter
    ? `\\sa${Math.round(adv.paragraphSpacingAfter * 20)}`
    : '';
  return `\\pard\\pardeftab1680${sl}${sb}${sa}\\pardirnatural${align}\\partightenfactor0`;
}

/**
 * Build RTF character-level formatting codes from a fontAdv object.
 * Returns a string of RTF control words (with trailing space where needed).
 */
function charFmt(adv) {
  if (!adv) return '';
  let s = '';
  if (adv.bold)          s += '\\b ';
  if (adv.italic)        s += '\\i ';
  if (adv.underline)     s += '\\ul ';
  if (adv.strikethrough) s += '\\strike ';
  if (adv.capitalization === 'allCaps')   s += '\\caps ';
  else if (adv.capitalization === 'smallCaps') s += '\\scaps ';
  if (adv.charSpacing) s += `\\expndtw${Math.round(adv.charSpacing * 20)} `;
  return s;
}

// Text outline (stroke): ProPresenter draws it from the body run's \strokewidth
// + \strokec3 (3rd colortbl colour). Returns the colortbl (text colour at idx 2,
// stroke colour at idx 3) and the \strokewidth magnitude (UI width N → N*20).
function textStroke(adv, textHex) {
  const on = !!(adv && adv.strokeEnabled);
  const strokeHex = on ? (adv.strokeColor || '#000000') : '#000000';
  const sw = on ? Math.round((adv.strokeWidth ?? 1) * 20) : 20;
  return { colortbl: makeColortbl(['#ffffff', textHex || '#ffffff', strokeHex]), sw };
}

// Default color tables (used when no style is passed)
const COLORTBL_WHITE_STROKE = makeColortbl(['#ffffff', '#ffffff', '#000000']);
const COLORTBL_LIVE = [
  '{\\colortbl;\\red255\\green255\\blue255;\\red255\\green255\\blue255;}',
  '{\\*\\expandedcolortbl;;\\csgray\\c100000;}',
].join('\n');
const COLORTBL_TITLE = makeColortbl(['#ffffff', '#f6d046', '#000000']);

function rtfDoc({ fonttbl, colortbl, pard, body }) {
  // fonttbl is on the same line as \cocoatextscaling0\cocoaplatform0.
  // The closing } follows the body content directly (no trailing newline).
  return [
    '{\\rtf1\\ansi\\ansicpg1252\\cocoartf2865',
    `\\cocoatextscaling0\\cocoaplatform0${fonttbl}`,
    colortbl,
    '\\deftab1680',
    pard,
    '',
    `${body}}`,
  ].join('\n');
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Body text: scripture verses and blank-slide quotes.
 * spans: [{text, bold?}]
 * - All normal → Montserrat-Medium, left aligned
 * - All bold   → Montserrat-Black, centered
 * - Mixed      → Montserrat-Medium + Montserrat-Black, left aligned
 */
function rtfBody(spans, style = {}) {
  if (!spans || !spans.length) spans = [{ text: '' }];
  const { content, allAlt, mixedAlt } = buildSpanContent(spans);
  const bodyFont = style.bodyFont || 'Montserrat-Medium';
  const boldFont = style.boldFont || bodyFont;
  const fs       = (style.bodySize || 44) * 2;
  const adv      = style.bodyFontAdv || {};
  const cf       = charFmt(adv);
  const { colortbl, sw } = textStroke(adv, adv.color);

  let fonttbl, pard, body;

  if (allAlt) {
    const forceCenter = !adv.alignment;
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    pard    = makePard(adv, forceCenter);
    body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${content}`;
  } else if (mixedAlt) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
    pard    = makePard(adv, false);
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${content}`;
  } else {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};}`;
    pard    = makePard(adv, false);
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${content}`;
  }

  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Title bar: scripture reference (e.g. "John 13:35").
 * Impact font, gold text, centered, with character spacing.
 */
function rtfTitle(text, style = {}) {
  // Reference bar is fully scheme-driven: font, colour and spacing come from the
  // scheme (titleFont + titleFontAdv). Nothing is hard-coded — Arial / white are
  // only the fallbacks when the scheme doesn't set them.
  const font     = style.titleFont || 'Arial';
  const fs       = (style.titleSize || 40) * 2;
  const textHex  = (style.titleFontAdv && style.titleFontAdv.color) || '#ffffff';
  const adv      = style.titleFontAdv || {};
  const { colortbl, sw } = textStroke(adv, textHex);
  const fonttbl  = `{\\fonttbl\\f0\\fswiss\\fcharset0 ${font};}`;
  const cf       = charFmt(adv);
  // Base title has sa400+qc; merge with adv paragraph settings (line height,
  // spacing before, spacing after — defaults to sa400 when none specified).
  const sl       = (adv.lineHeight && adv.lineHeight !== 1) ? `\\sl${Math.round(adv.lineHeight * 240)}\\slmult1` : '';
  const sb       = adv.paragraphSpacingBefore ? `\\sb${Math.round(adv.paragraphSpacingBefore * 20)}` : '';
  const sa       = adv.paragraphSpacingAfter ? `\\sa${Math.round(adv.paragraphSpacingAfter * 20)}` : '\\sa400';
  const pard     = `\\pard\\pardeftab1680${sl}${sb}${sa}\\pardirnatural${adv.alignment === 'left' ? '' : adv.alignment === 'right' ? '\\qr' : '\\qc'}\\partightenfactor0`;
  const body     = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${escapeRtf(text)}`;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Live indicator (static "live" text, HelveticaNeue, centered, no stroke).
 */
function rtfLive(style = {}) {
  const font    = style.liveFont || 'HelveticaNeue';
  const fs      = (style.liveSize || 42) * 2;
  const adv     = style.liveFontAdv || {};
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = PARD_CENTER;
  const body    = `\\f0\\fs${fs} \\cf2 \\CocoaLigature0 live`;
  const colortbl = adv.color ? makeColortbl(['#ffffff', adv.color, '#000000']) : COLORTBL_LIVE;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Slide-label indicator for START/END slides — styled like the live badge.
 * Shows the slide label ("START", "End of Notes") below the canvas for confidence monitor.
 */
function rtfLiveLabel(text, style = {}) {
  const font    = style.liveFont || 'HelveticaNeue';
  const fs      = (style.liveSize || 42) * 2;
  const adv     = style.liveFontAdv || {};
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = PARD_CENTER;
  const body    = `\\f0\\fs${fs} \\cf2 \\CocoaLigature0 ${escapeRtf(text || '')}`;
  const colortbl = adv.color ? makeColortbl(['#ffffff', adv.color, '#000000']) : COLORTBL_LIVE;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * START / END banner text (Montserrat-ExtraBold, fs90).
 */
function rtfStartEnd(text, style = {}) {
  const font    = style.startEndFont || 'Montserrat-ExtraBold';
  const fs      = (style.startEndSize || 45) * 2;
  const adv     = style.startEndFontAdv || {};
  const cf      = charFmt(adv);
  const { colortbl, sw } = textStroke(adv, adv.color);
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = makePard(adv, false);
  const body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${escapeRtf(text)}`;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Extract plain text from a bullet — handles both legacy string and spans array.
 */
function bulletToText(bullet) {
  if (typeof bullet === 'string') return bullet;
  return (bullet || []).map(s => s.text || '').join('');
}

/**
 * Normalise a bullet to a spans array.
 */
function bulletToSpans(bullet) {
  if (typeof bullet === 'string') return [{ text: bullet, bold: false }];
  return (bullet || []).map(s => ({ text: s.text || '', bold: !!s.bold }));
}

/**
 * Point slide list ("this slide" element showing all points).
 * items: (string|spans)[] — plain text extracted from each bullet.
 */
function rtfPointList(items) {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 Montserrat-Medium;}';
  const pard    = PARD_NORMAL;
  const lines   = items.map((item, i) => `${i + 1} \u2014 ${bulletToText(item)}`).join('\n');
  const body    = `\\f0\\fs80 \\cf2 \\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(lines)}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Point slide body ("body" element — the highlighted current point).
 * Accepts a string or spans array. Bold spans use boldFont; non-bold use bodyFont.
 */
function rtfPointBody(bullet, style = {}) {
  const bodyFont = style.bodyFont || 'Montserrat-Medium';
  // Point text uses its own font (falls back to boldFont for pre-split schemes)
  const boldFont = style.pointFont || style.boldFont || bodyFont;
  const fs       = (style.pointSize || style.bodySize || 44) * 2;
  const adv      = style.pointFontAdv || style.boldFontAdv || {};
  const cf       = charFmt(adv);
  const pard     = makePard(adv, !adv.alignment);
  const { colortbl, sw } = textStroke(adv, adv.color);
  const spans    = bulletToSpans(bullet);
  // Point text is rendered entirely in the point font (bold) unless the bullet
  // genuinely mixes bold and non-bold words. A plain point (no bold markup) is
  // NOT "body text" — it should still use the point font, so treat no-bold and
  // all-bold the same: single point-font path.
  const single   = !(spans.some(s => s.bold) && spans.some(s => !s.bold));
  if (single) {
    // Single-font path — whole point in the point font, bold
    const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    const body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3 ${escapeRtf(bulletToText(bullet))}`;
    return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
  }
  // Mixed — two fonts
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
  const COMMON  = `\\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3`;
  const parts   = [];
  let first = true;
  for (const s of spans) {
    if (!s.text) continue;
    const cmn  = first ? COMMON + ` ` : ``;
    first = false;
    if (s.bold) {
      parts.push(`\\f1\\b\\fs${fs} ${cmn}${escapeRtf(s.text)}`);
    } else {
      parts.push(`\\f0\\b0\\fs${fs} ${cmn}${escapeRtf(s.text)}`);
    }
  }
  const body = parts.join('');
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Revealing-prop point list.
 * points: array of strings to display; the LAST one is highlighted (bold, fs88).
 * Previous points are shown smaller (Montserrat-Medium, fs72).
 * title: optional string rendered as a header line (Montserrat-Medium fs60, dimmed) before the bullets.
 */
function rtfRevealingPoints(points, title, style = {}) {
  const bodyFont   = style.bodyFont || 'Montserrat-Medium';
  // Point text uses its own font (falls back to boldFont for pre-split schemes)
  const boldFont   = style.pointFont || style.boldFont || bodyFont;
  const fsActive   = (style.pointSize || style.bodySize || 44) * 2;
  const fsInactive = Math.round(fsActive * 0.82);
  const fsTitle    = Math.round(fsActive * 0.75);
  const adv        = style.pointFontAdv || style.boldFontAdv || {};
  const cf         = charFmt(adv);
  const { colortbl, sw } = textStroke(adv, adv.color);
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
  const pard    = makePard(adv, !adv.alignment);  // default center

  const COMMON = ` \\cf2 \\CocoaLigature0 \\outl0\\strokewidth-${sw} \\strokec3`;
  const parts  = [];
  let needsCommon = true;

  if (title) {
    parts.push(`\\f0\\fs${fsTitle}${COMMON} ${escapeRtf(title)}`);
    parts.push('');  // blank line between title and bullets
    needsCommon = false;
  }

  for (let i = 0; i < points.length; i++) {
    const plainText = bulletToText(points[i]);
    const prefix    = escapeRtf(`${i + 1} \u2014 `);
    const isActive  = i === points.length - 1;
    const common    = needsCommon ? COMMON : '';
    if (isActive) {
      // Active bullet: honour bold spans within the bullet
      const spans = bulletToSpans(points[i]);
      const allBold = spans.every(s => s.bold);
      if (allBold || typeof points[i] === 'string') {
        const label = escapeRtf(`${i + 1} \u2014 ${plainText}`);
        parts.push(`\\f1\\b\\fs${fsActive}${common} ${cf}${label}`);
      } else {
        // Mixed bold — prefix in bodyFont, then spans
        let first = true;
        let segment = `\\f0\\fs${fsActive}${common} ${cf}${prefix}`;
        for (const s of spans) {
          if (!s.text) continue;
          if (s.bold) {
            segment += `\\f1\\b\\fs${fsActive} ${escapeRtf(s.text)}`;
          } else {
            segment += `\\f0\\b0\\fs${fsActive} ${escapeRtf(s.text)}`;
          }
        }
        parts.push(segment);
      }
    } else {
      const label = escapeRtf(`${i + 1} \u2014 ${plainText}`);
      parts.push(`\\f0\\fs${fsInactive}${common} ${label}`);
    }
    needsCommon = false;
  }

  const body = parts.join('\\\n');
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Queue sidebar element: slide labels listed one per line.
 * labels: string[] — truncated slide names for upcoming slides.
 * HelveticaNeue, fs64 (32pt), white, plain text.
 */
function rtfQueue(labels, style = {}) {
  const font    = style.queueFont || 'HelveticaNeue';
  const fs      = (style.queueSize || 32) * 2;
  const adv     = style.queueFontAdv || {};
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = PARD_NORMAL;
  const content = labels.map(l => escapeRtf(l)).join('\\\n');
  const body    = `\\f0\\fs${fs} \\cf2 \\CocoaLigature0 ${content}`;
  const colortbl = adv.color ? makeColortbl(['#ffffff', adv.color, '#000000']) : COLORTBL_LIVE;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Empty RTF for elements with no text (atem_gradient, unnamed image elements).
 */
function rtfEmpty() {
  return toBase64(
    '{\\rtf1\\ansi\\ansicpg1252\\cocoartf2865\n\\cocoatextscaling0\\cocoaplatform0{\\fonttbl}\n{\\colortbl;\\red255\\green255\\blue255;}\n{\\*\\expandedcolortbl;;}\n}'
  );
}

// ─── Response Card RTF ────────────────────────────────────────────────────────

const COLORTBL_TAN_STROKE = [
  '{\\colortbl;\\red255\\green255\\blue255;\\red222\\green168\\blue125;\\red0\\green0\\blue0;}',
  '{\\*\\expandedcolortbl;;\\cssrgb\\c89804\\c71765\\c56078;\\cssrgb\\c0\\c0\\c0;}',
].join('\n');

const PARD_RESPONSE_TITLE = '\\pard\\pardeftab1680\\sl24\\slmult1\\sa400\\pardirnatural\\qc\\partightenfactor0';

/**
 * Decorative "response N" label — Desire-Pro font, tan color, centered.
 * n: 1 | 2 | 3
 */
function rtfResponseLabel(n) {
  const fonttbl = '{\\fonttbl\\f0\\fswiss\\fcharset0 Desire-Pro;}';
  const pard    = PARD_RESPONSE_TITLE;
  const body    = `\\f0\\fs120 \\cf2 \\kerning1\\expnd12\\expndtw60\n\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 response ${n}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_TAN_STROKE, pard, body }));
}

/**
 * Response-card row text — scheme body font, centered.
 */
function rtfResponseBody(text, style = {}) {
  const font    = style.bodyFont || 'Montserrat-Medium';
  const fs      = (style.bodySize || 44) * 2;
  const adv     = style.bodyFontAdv || {};
  const cf      = charFmt(adv);
  const color   = adv.color || '#ffffff';
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = makePard({ ...adv, alignment: adv.alignment || 'center' }, false);
  const body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(text || '')}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: makeColortbl(['#ffffff', color, '#000000']), pard, body }));
}

function rtfResponseMark(n, style = {}) {
  return rtfResponseBody(String(n), style);
}

/**
 * Confidence monitor list for response slides.
 */
function rtfResponseConfMonitor(decisionText, r1, r2, r3) {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 Montserrat-Medium;}';
  const pard    = PARD_NORMAL;
  const lines   = [
    decisionText || '',
    `1 — ${r1 || ''}`,
    `2 — ${r2 || ''}`,
    `3 — ${r3 || ''}`,
  ].map(l => escapeRtf(l)).join('\\\n');
  const body = `\\f0\\fs80 \\cf2 \\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${lines}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Response Card Hold title — Montserrat-BlackItalic, static.
 */
function rtfResponseHoldTitle() {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 Montserrat-BlackItalic;}';
  const pard    = '\\pard\\pardeftab1680\\sa400\\pardirnatural\\partightenfactor0';
  const body    = `\\f0\\i\\b\\fs86 \\cf2 \\kerning1\\expnd4\\expndtw20\n\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 Response Card Hold`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Slide notes RTF — preserves bold/normal span structure for confidence monitor.
 * Uses the notes RTF format (deftab1300, no stroke color).
 * Returns null if spans are empty (caller falls back to emptyNotesRtf).
 */
function rtfNotes(spans, style = {}) {
  if (!spans || !spans.length || spans.every(s => !s.text)) return null;

  const { content, allAlt, mixedAlt } = buildSpanContent(spans);
  const notesFont = style.notesFont     || 'Montserrat-Medium';
  const boldFont  = style.notesBoldFont || notesFont;
  const fs        = (style.notesSize || 50) * 2;
  const adv       = style.notesFontAdv || {};
  const cf        = charFmt(adv);
  const pard      = makePard(adv, false);
  const colortbl  = '{\\colortbl;\\red255\\green255\\blue255;\\red255\\green255\\blue255;}\n{\\*\\expandedcolortbl;;\\csgray\\c100000;}';

  let fonttbl, body;
  if (mixedAlt) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${notesFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  } else if (allAlt) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  } else {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${notesFont};}`;
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  }

  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

module.exports = {
  rtfBody, rtfTitle, rtfLive, rtfLiveLabel, rtfStartEnd, rtfPointList, rtfPointBody,
  rtfRevealingPoints, rtfQueue, rtfEmpty, rtfNotes, escapeRtf,
  rtfResponseLabel, rtfResponseBody, rtfResponseMark, rtfResponseConfMonitor, rtfResponseHoldTitle,
  bulletToText, bulletToSpans,
};

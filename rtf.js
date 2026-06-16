/**
 * RTF generator for Pro7 slide elements.
 * All exported functions return a base64-encoded RTF string for element.text.rtfData.
 *
 * Span format: Array<{ text: string, bold?: boolean }>
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
  return `{\\colortbl;${col.join(';')};}\n{\\*\\expandedcolortbl;;${ext.join(';')};}`;
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
  const hasBold   = spans.some(s => s.bold);
  const hasNormal = spans.some(s => !s.bold);
  const mixed     = hasBold && hasNormal;
  const allBold   = hasBold && !hasNormal;
  const hasIU     = spans.some(s => s.italic || s.underline);

  // Fast path: uniform bold, no italic/underline
  if (!mixed && !hasIU) {
    const escaped = escapeRtf(spans.map(s => s.text).join(''));
    // Bold spans: replace spaces with non-breaking spaces (\~) so phrases stay together
    return { content: allBold ? escaped.replace(/ /g, '\\~') : escaped, allBold, mixed };
  }

  // Per-span character formatting.
  // Caller establishes the baseline font (\f0 or \f0\b); we emit diffs only.
  let content = '';
  let curBold      = allBold;   // matches caller's initial state
  let curItalic    = false;
  let curUnderline = false;

  for (const span of spans) {
    // Bold spans: replace spaces with \~ (non-breaking) so phrases don't split at line breaks
    const rawEsc = escapeRtf(span.text);
    const txt = span.bold ? rawEsc.replace(/ /g, '\\~') : rawEsc;
    if (!txt) continue;

    let cmd = '';

    // Font / bold switch (only in mixed mode)
    if (mixed) {
      const wantBold = !!span.bold;
      if (wantBold !== curBold) {
        cmd += wantBold ? '\n\\f1\\b ' : '\n\\f0\\b0 ';
        curBold = wantBold;
      }
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
  if (curItalic)    content += '\\i0 ';
  if (curUnderline) content += '\\ulnone ';
  if (mixed && curBold) content += '\n\\f0\\b0 ';

  return { content, allBold, mixed };
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
  if (adv.italic)     s += '\\i ';
  if (adv.underline)  s += '\\ul ';
  if (adv.capitalization === 'allCaps')   s += '\\caps ';
  else if (adv.capitalization === 'smallCaps') s += '\\scaps ';
  if (adv.charSpacing) s += `\\expndtw${Math.round(adv.charSpacing * 20)} `;
  return s;
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
  const { content, allBold, mixed } = buildSpanContent(spans);
  const bodyFont = style.bodyFont || 'Montserrat-Medium';
  const boldFont = style.boldFont || 'Montserrat-Black';
  const fs       = (style.bodySize || 44) * 2;
  const adv      = style.bodyFontAdv || {};
  const cf       = charFmt(adv);

  let fonttbl, pard, body;

  if (allBold) {
    const forceCenter = !adv.alignment;  // default is center for all-bold
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    pard    = makePard(adv, forceCenter);
    body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${content}`;
  } else if (mixed) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
    pard    = makePard(adv, false);
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${content}`;
  } else {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};}`;
    pard    = makePard(adv, false);
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${content}`;
  }

  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Title bar: scripture reference (e.g. "John 13:35").
 * Impact font, gold text, centered, with character spacing.
 */
function rtfTitle(text, style = {}) {
  const font     = style.titleFont || 'Impact';
  const fs       = (style.titleSize || 40) * 2;
  const textHex  = style.titleText || '#f6d046';
  const colortbl = makeColortbl(['#ffffff', textHex, '#000000']);
  const fonttbl  = `{\\fonttbl\\f0\\fswiss\\fcharset0 ${font};}`;
  const adv      = style.titleFontAdv || {};
  const cf       = charFmt(adv);
  // Base title has sa400+qc; merge with adv paragraph settings
  const sa400    = adv.paragraphSpacingAfter ? '' : '\\sa400';
  const pard     = `\\pard\\pardeftab1680${sa400}${adv.paragraphSpacingAfter ? `\\sa${Math.round(adv.paragraphSpacingAfter*20)}` : ''}\\pardirnatural${adv.alignment === 'left' ? '' : adv.alignment === 'right' ? '\\qr' : '\\qc'}\\partightenfactor0`;
  const body     = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\kerning1\\expnd16\\expndtw80\n\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(text)}`;
  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

/**
 * Live indicator (static "live" text, HelveticaNeue, centered, no stroke).
 */
function rtfLive() {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 HelveticaNeue;}';
  const pard    = PARD_CENTER;
  const body    = '\\f0\\fs84 \\cf2 \\CocoaLigature0 live';
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_LIVE, pard, body }));
}

/**
 * Slide-label indicator for START/END slides — styled like the live badge.
 * Shows the slide label ("START", "End of Notes") below the canvas for confidence monitor.
 */
function rtfLiveLabel(text) {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 HelveticaNeue;}';
  const pard    = PARD_CENTER;
  const body    = `\\f0\\fs84 \\cf2 \\CocoaLigature0 ${escapeRtf(text || '')}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_LIVE, pard, body }));
}

/**
 * START / END banner text (Montserrat-ExtraBold, fs90).
 */
function rtfStartEnd(text, style = {}) {
  const font    = style.startEndFont || 'Montserrat-ExtraBold';
  const fs      = (style.startEndSize || 45) * 2;
  const adv     = style.startEndFontAdv || {};
  const cf      = charFmt(adv);
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${font};}`;
  const pard    = makePard(adv, false);
  const body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(text)}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
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
  const boldFont = style.pointFont || style.boldFont || 'Montserrat-Black';
  const fs       = (style.bodySize || 44) * 2;
  const adv      = style.pointFontAdv || style.boldFontAdv || {};
  const cf       = charFmt(adv);
  const pard     = makePard(adv, !adv.alignment);
  const spans    = bulletToSpans(bullet);
  const allBold  = spans.every(s => s.bold);
  if (allBold) {
    // All bold — original single-font path
    const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    const body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(bulletToText(bullet))}`;
    return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
  }
  // Mixed — two fonts
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
  const COMMON  = `\\cf2 ${cf}\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3`;
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
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
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
  const boldFont   = style.pointFont || style.boldFont || 'Montserrat-ExtraBold';
  const fsActive   = (style.bodySize || 44) * 2;
  const fsInactive = Math.round(fsActive * 0.82);
  const fsTitle    = Math.round(fsActive * 0.75);
  const adv        = style.pointFontAdv || style.boldFontAdv || {};
  const cf         = charFmt(adv);
  const fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${bodyFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
  const pard    = makePard(adv, !adv.alignment);  // default center

  const COMMON = ' \\cf2 \\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3';
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
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Queue sidebar element: slide labels listed one per line.
 * labels: string[] — truncated slide names for upcoming slides.
 * HelveticaNeue, fs64 (32pt), white, plain text.
 */
function rtfQueue(labels) {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 HelveticaNeue;}';
  const pard    = PARD_NORMAL;
  const content = labels.map(l => escapeRtf(l)).join('\\\n');
  const body    = `\\f0\\fs64 \\cf2 \\CocoaLigature0 ${content}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_LIVE, pard, body }));
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
 * Response body text (on-screen) — Montserrat-Medium, centered, fs=90.
 * text: the response option text for that slide.
 */
function rtfResponseBody(text) {
  const fonttbl = '{\\fonttbl\\f0\\fnil\\fcharset0 Montserrat-Medium;}';
  const pard    = PARD_CENTER;
  const body    = `\\f0\\fs90 \\cf2 \\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 ${escapeRtf(text || '')}`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Confidence monitor list for response slides — same on all 3 cues.
 * Shows: decisionText + numbered list of all 3 responses.
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
  const body    = `\\f0\\i\\b\\fs86 \\cf2 \\kerning1\\expnd4\\expndtw20\n\\CocoaLigature0 \\outl0\\strokewidth-20 \\strokec3 response CARD HOLD`;
  return toBase64(rtfDoc({ fonttbl, colortbl: COLORTBL_WHITE_STROKE, pard, body }));
}

/**
 * Slide notes RTF — preserves bold/normal span structure for confidence monitor.
 * Uses the notes RTF format (deftab1300, no stroke color).
 * Returns null if spans are empty (caller falls back to emptyNotesRtf).
 */
function rtfNotes(spans, style = {}) {
  if (!spans || !spans.length || spans.every(s => !s.text)) return null;

  const { content, allBold, mixed } = buildSpanContent(spans);
  const notesFont = style.notesFont     || 'Montserrat-Medium';
  const boldFont  = style.notesBoldFont || 'Montserrat-Black';
  const fs        = (style.notesSize || 50) * 2;
  const adv       = style.notesFontAdv || {};
  const cf        = charFmt(adv);
  const pard      = makePard(adv, false);
  const colortbl  = '{\\colortbl;\\red255\\green255\\blue255;\\red255\\green255\\blue255;}\n{\\*\\expandedcolortbl;;\\csgray\\c100000;}';

  let fonttbl, body;
  if (mixed) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${notesFont};\\f1\\fnil\\fcharset0 ${boldFont};}`;
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  } else if (allBold) {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${boldFont};}`;
    body    = `\\f0\\b\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  } else {
    fonttbl = `{\\fonttbl\\f0\\fnil\\fcharset0 ${notesFont};}`;
    body    = `\\f0\\fs${fs} \\cf2 ${cf}\\CocoaLigature0 ${content}`;
  }

  return toBase64(rtfDoc({ fonttbl, colortbl, pard, body }));
}

module.exports = {
  rtfBody, rtfTitle, rtfLive, rtfLiveLabel, rtfStartEnd, rtfPointList, rtfPointBody,
  rtfRevealingPoints, rtfQueue, rtfEmpty, rtfNotes, escapeRtf,
  rtfResponseLabel, rtfResponseBody, rtfResponseConfMonitor, rtfResponseHoldTitle,
  bulletToText, bulletToSpans,
};

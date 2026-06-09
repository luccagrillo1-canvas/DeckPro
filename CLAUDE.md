# Pro7 Slide Builder — Claude Code Briefing

## What We're Building
A local web app that generates ProPresenter 7 (.pro) presentation files automatically from a structured UI. The goal is to replace a complex manual slide-building workflow at a church so that anyone on the team can build the weekly message deck — not just the one person who knows the system.

## Tech Stack
- **Backend**: Node.js with `protobufjs` — encodes output as Pro7 protobuf binary (.pro files)
- **Frontend**: Web UI (React or plain HTML/JS) — slide builder with per-slide panels and a queue sidebar
- **Proto schema**: Already cloned at `~/pro7-decode/ProPresenter7-Proto/` — this is the reverse-engineered Pro7 protobuf schema from https://github.com/greyshirtguy/ProPresenter7-Proto
- **Pro7 version**: 20.0.1 (protobuf binary format, NOT JSON)

## File Format
Pro7 `.pro` files are protobuf binary. They were decoded using `protobufjs` and the `rv.data.Presentation` type from `propresenter.proto`. The decoded output is in `~/pro7-decode/output.json` — this is the actual last week's presentation file decoded.

## Confirmed Slide Structure (from output.json)
The presentation has 21 cues (slides). Each cue contains multiple **actions**:
- `ACTION_TYPE_PRESENTATION_SLIDE` — the actual slide with elements/text boxes
- `ACTION_TYPE_MACRO` — triggers a Companion/Resolume command
- `ACTION_TYPE_PROP` — links to a prop (for content slides)
- `ACTION_TYPE_CLEAR` — clears props (for blank slides)
- `ACTION_TYPE_MEDIA` — media playback (occasional)
- `ACTION_TYPE_AUDIENCE_LOOK` — look trigger (occasional)

## Slide Types & Action Patterns

Classification is by action types + element names present:

| Type | Actions | Elements |
|---|---|---|
| **START** | SLIDE + MACRO(Message - Start) + CLEAR + MACRO(LOGO) | `this slide` |
| **END** | SLIDE + CLEAR + MACRO(LOGO) | `this slide` |
| **BLANK_TEXT** | SLIDE + MACRO(LOGO) + CLEAR | `this slide` |
| **SCRIPTURE** | SLIDE + MACRO(NO LOGO) + PROP | `live`, `title`, `this slide`, `atem_gradient`, `queue` |
| **POINT** | SLIDE + MACRO(NO LOGO) + PROP | `live`, `body`, `this slide`, `atem_gradient`, `queue` |
| **IMAGE** | SLIDE + MACRO(NO LOGO) + CLEAR | `live`, `atem_gradient`, `queue` |

Note: **Message - Blank** macro is now on the **Response Card Hold** cue only (not END).

### Response Card cues (auto-appended before END if `includeResponseCard`)
1. `Response Card Hold` — SLIDE + MACRO(Message-Blank) + PROP("Response Card")
2. `Response 1/2/3` — SLIDE + PROP("Response Card")
3. `Response Card` — SLIDE + MACRO(LOGO) + CLEAR

## Macro UUIDs (confirmed from output.json)
- `Message - Start`: `7C586E48-986E-4932-9219-7D6A64BE5B6C`
- `Message - Content`: `8C15C594-8EE3-431C-B35C-B70B6AB91548`
- `Message - Blank`: `3AC673FE-0841-4391-81F7-F2042F312E1C`
- `LOGO`: `8CB7C31F-4B7E-41EE-96A5-D86F7CC8A71B`
- `NO LOGO`: `DF162F4C-DA5D-4DE2-8379-3F369BC4BA07`

## Universal Element Style Constants
All elements (except `title`) share these styles:
- Fill: `#2196f2` rgba(33,150,242,1)
- Stroke: width=3, `#ffffff`
- Shadow: angle=315, offset=5, radius=5, opacity=0.75, color `#000000`
- `feather.radius = 0.05`

## Confirmed Element Bounds (canvas = 1920×1080)

### `live` (all content slide types: SCRIPTURE, POINT, LIVE_LOWER)
- x=1736.73, y=1096.71, w=183.27, h=71.56
- Positioned 17px below the bottom canvas edge (confidence monitor element)
- Font: HelveticaNeue fs=84, white, verticalAlignment=MIDDLE

### `atem_gradient` (all content slide types)
- x=0, y=351.77, w=1920, h=728.23 — fixed, covers bottom 2/3 of screen
- Fill: GRADIENT angle=90, dark-to-transparent (stop1: near-black alpha=0.95, blendPoint=0.5; stop2: transparent, blendPoint=0.5)
- No text content

### `title` (SCRIPTURE only — scripture reference bar)
- x≈-0.18, w≈1920.18, h=50.51 — full-width bar
- **y varies by verse length**: ~788 (longer refs like "2 Corinthians 3:18") to ~844 (shorter refs like "John 13:35")
- Fill: `#a9391a` rgba(169,57,26,1) — rust/dark orange-red
- Shadow color: `#ff2600` (red, unique to this element)
- Font: Impact fs=80, color `#f6d046` (gold), `\kerning1\expnd16\expndtw80` character spacing
- verticalAlignment: MIDDLE

### `this slide` body (SCRIPTURE, POINT as `body`, LIVE_LOWER)
- y=729.98, h=350.02 — **fixed** (bottom third of screen: y=730→1080)
- x and w vary by text width (text is horizontally centered, box fits content)
  - Range: x=85–447, w=1027–1754
- Font: Montserrat-Medium fs=88 (normal) + Montserrat-Black fs=88 (bold spans)
- verticalAlignment: BOTTOM

### `this slide` on START/END
- x=85–118, y=900.14, w=1683.21, h=179.86 — narrow banner, y=900→1080
- Font: Montserrat-ExtraBold fs=90, white, black outline

### `this slide` on BLANK_TEXT
- Positioned **below canvas** (y=1101–1206) — off-screen staging position
- y=1080+, h≈350, w varies by text width
- Font: Montserrat-Black fs=88 (bold all) or Montserrat-Medium+Black (mixed)

## Text Encoding
Text is stored as **base64-encoded RTF** in the `rtfData` field of each element's `text` object.

RTF format used:
```
{\rtf1\ansi\ansicpg1252\cocoartf2865
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fnil\fcharset0 Montserrat-Medium;\f1\fnil\fcharset0 Montserrat-Black;}
{\colortbl;\red255\green255\blue255;\red255\green255\blue255;\red0\green0\blue0;}
{\*\expandedcolortbl;;\cssrgb\c100000\c100000\c100000;\cssrgb\c0\c0\c0;}
\deftab1680
\pard\pardeftab1680\pardirnatural\partightenfactor0

\f0\fs88 \cf2 \CocoaLigature0 \outl0\strokewidth-20 \strokec3 Normal text \f1\b bold text\f0\b0  more normal text}
```

**Bold formatting**: Switch between `\f0` (Montserrat-Medium, normal) and `\f1\b` (Montserrat-Black, bold), use `\b0` to end bold. This is how the speaker's bolded phrases are preserved.

Fonts used:
- `Montserrat-Medium` — normal body text
- `Montserrat-Black` — bold text  
- `Montserrat-ExtraBold` — start/end slides
- `Impact` — title/reference element

## Prop Linking
Props are separate `.pro` files. A prop link action looks like:
```json
{
  "type": "ACTION_TYPE_PROP",
  "prop": {
    "identification": {
      "parameterUuid": { "string": "27E77AAD-C9AF-452D-8E5F-F3A4DE082E86" },
      "parameterName": "John 13:35"
    }
  }
}
```
The generator must:
1. Create a prop `.pro` file with a generated UUID
2. Write it to the Pro7 props library folder (`~/Documents/ProPresenter/Props/` or similar)
3. Reference that UUID in the presentation's PROP action

## Reference Text Repositioning Rule
On scripture slides, the `title` bar sits directly above the `this slide` body box. The body box y is fixed at 729.98. Observed title y values: ~788 (2-line reference like "2 Corinthians 3:18") and ~843 (1-line reference like "John 13:35"). The gap between title bottom (title.y + 50.51) and body top (729.98) is ~0–8px. So: `title.y ≈ 729.98 - 50.51 - gap`. Exact Y likely depends on whether the reference text wraps to 2 lines on the ATEM lower-third — needs further validation when building the encoder.

## UI Requirements
- **Queue sidebar**: Shows all slides in order by name. Drag to reorder.
- **Per-slide panels** with type-specific inputs:
  - **Scripture slide**: slide name, book/chapter/verse reference, body text (rich text with bold support), reference text, prop type (individual or shared)
  - **Point slide**: slide name, point title, body text (rich text with bold), prop options (revealing/single)
  - **Blank/image slide**: slide name, image file picker (optional)
  - **Start/End**: auto-generated
- **Global settings**: Series name, week date, QR code toggle (Saturday only)
- **Generate button**: Outputs `.pro` file + prop files

## Prop Logic
- Every content slide (scripture, point) gets a matching prop
- For point slides with revealing props: one prop per slide, each showing progressively more content
- For point slides with single prop: one prop that stays static while slides emphasize
- Props have same content as slides but formatted differently for LED wall

## QR Code
Same QR image every Saturday — just an image element dropped into blank slides between content slides. Toggle in UI for Saturday builds.

## Working Directory
`~/pro7-decode/` — proto schema, decode script, and output.json are all here.

## Key Reference Files
- `~/pro7-decode/output.json` — decoded last week's full presentation (21 cues)
- `~/pro7-decode/ProPresenter7-Proto/proto/propresenter.proto` — Pro7 protobuf schema
- `~/Downloads/Message_26.02.18_Multiplier_Church.pro` — original binary file

## Key Reference Files
- `output.json` — decoded last week's full presentation (21 cues, 10929 lines)
- `pro7_analysis.txt` — full extracted analysis of all element bounds/styles per slide type
- `ProPresenter7-Proto/proto/propresenter.proto` — Pro7 protobuf schema entry point
- `~/Downloads/Message_26.02.18_Multiplier_Church.pro` — original binary source file

## RTF Generator (`rtf.js`)

All functions return base64-encoded RTF for `element.text.rtfData`.

```js
const { rtfBody, rtfTitle, rtfLive, rtfStartEnd, rtfPointList, rtfPointBody,
        rtfRevealingPoints, rtfQueue, rtfEmpty } = require('./rtf');

rtfBody(spans)                   // scripture/blank body — spans: [{text, bold?}]
rtfTitle(text)                   // Impact gold bar — scripture reference
rtfLive()                        // static "live" badge (no args)
rtfStartEnd(text)                // START / END banner
rtfPointList(items)              // ['Create Opportunities', ...] — numbered list
rtfPointBody(text)               // highlighted current point (Montserrat-Black, centered)
rtfRevealingPoints(points, title?)  // revealing prop list; optional title as dimmed header
rtfQueue(labels)                 // queue sidebar — HelveticaNeue fs=64, newline-separated
rtfEmpty()                       // empty element (atem_gradient, image bg)
```

`rtfBody` auto-selects font based on spans:
- All bold → Montserrat-Black, centered (`\qc`)
- Mixed → Montserrat-Medium + Black, left-aligned
- All normal → Montserrat-Medium, left-aligned
- `undefined`/empty → treated as empty string (safe)

Special characters (`"`, `"`, `'`, `—`, `–`, `…`) are auto-escaped to Windows-1252 RTF codes. Newlines in text (`\n`) become RTF line breaks (`\\\n`).

Run tests: `node rtf.test.js`

## Encoder (`encode.js` + `builder.js`)

```js
const { encode } = require('./encode');
await encode(spec, '/path/to/output.pro');
// also accepts spec.outputFolder to determine output directory
```

`spec` shape:
```js
{
  name: 'Message_26.02.24_Series_Title',
  outputFolder: '/Users/.../Documents/ProPresenter',  // written here
  qrEnabled: false,
  includeResponseCard: true,
  slides: [
    { type: 'start' },
    { type: 'scripture', label, reference, bodies: [[spans], [spans]],
      propName, blankBefore: true, blankSpans: [] },
    { type: 'point', mode: 'single', label, bodyText, propName,
      blankBefore: true, blankSpans: [] },
    { type: 'point', mode: 'revealing', label, title, bullets: ['…'],
      propBaseName, blankBefore: true, blankSpans: [] },
    { type: 'image', label },
    { type: 'blank', label, spans: [] },
    { type: 'end' },
  ]
}
```

`builder.js` produces the full protobuf-compatible JS object. `encode.js` wraps protobufjs.

**Post-processing order in `buildPresentation()`:**
1. Expand slides → raw cues (blank-before injection, multi-body scripture, revealing bullets)
2. Append Response Card cues before END (if `includeResponseCard`)
3. Inject Message-Content macro into `cues[1]`
4. Inject `qr` element into all scripture/point + blank-before cues (if `qrEnabled`)
5. Inject `queue` element into every cue (upcoming slide labels, ≤20 chars each)

**Element positioning:**
- BLANK "this slide": y=1120 (off main canvas — confidence monitor)
- SCRIPTURE/POINT body: y=729.98, h=350.02, x=0, w=1920
- live: x=1736.73, y=1096.71, w=183.27, h=71.56
- title: x=-0.18, titleY≈843 (short ref) or 788 (long ref), w=1920.18, h=50.51
- atem_gradient: x=0, y=351.77, w=1920, h=728.23
- qr: x=0, y=655.2, w=423.8, h=424.8 (fill.media → qrcode.png in app dir)
- queue: x=0, y=0, w=400, h=1080 (blue sidebar, vertAlign=TOP, HelveticaNeue fs=64)

**Build animations:**
- START/END: "this slide" gets buildIn (Cut, START_WITH_SLIDE, delay=1s)
- BLANK/POINT: no builds
- SCRIPTURE: title+body+gradient get buildOut (Dissolve, delay=60s then fade together)

## Prop Generator (`buildProp.js`)

Prop files are `rv.data.PropDocument` (not `rv.data.Presentation`). Loaded via `ProPresenter7-Proto/proto/propDocument.proto`.

**Single-file system**: all props for a presentation go into ONE `{name}_Props.pro` file alongside the `.pro` file. Each prop is a separate **cue** in that file.

**Matching**: `parameterName` in presentation `ACTION_TYPE_PROP` = `cue.name` in prop file (NOT by UUID).

```js
const { buildAllPropCues, encodePropDocument } = require('./buildProp');

// encode.js handles this automatically — but manual usage:
const propSpecs = [
  { type: 'scripture',       propName: 'John 13:35', reference: 'John 13:35', bodies: [[spans]] },
  { type: 'point-single',    propName: 'Create Opportunities', bodyText: 'Create Opportunities' },
  { type: 'point-revealing', propName: 'Points_1', title: 'Vision', bullets: [...], activeIdx: 0 },
];
const propDoc = buildAllPropCues(propSpecs);
const buf = await encodePropDocument(propDoc);
fs.writeFileSync('output_Props.pro', buf);
```

`encode.js` writes `{name}_Props.pro` to the same folder as the presentation automatically.

Prop layouts:
- **Scripture**: all bodies concatenated (line-separated) + reference bar
- **Point single**: centered highlighted point text (Montserrat-Black, fs88)
- **Point revealing**: title header (optional) + bullets[0..activeIdx], last one highlighted

## Web UI (`public/`)

Run with `node server.js` → http://localhost:3000

- **`public/index.html`** — layout shell; Add Scripture / Point / Blank / Image buttons
- **`public/style.css`** — full stylesheet
- **`public/app.js`** — client-side app:
  - Slide queue with drag-to-reorder (START/END fixed)
  - Config panel (shown for START/END): output folder (Browse…), Response Card toggle
  - Filename: `Message_YY.MM.DD_Series_Title[_SAT]`
  - Scripture form: multi-body with Split / × remove, blankBefore toggle + preview, reference auto-syncs
  - Point form: segmented Single | Revealing control; Revealing = dynamic bullet list + title + propBaseName; blankBefore toggle
  - Blank form: label + optional confidence monitor text (bold)
  - Image form: label only
  - Generate → POST `/api/generate` → toast with file paths
  - **localStorage persistence** — full state survives page refresh

## Server endpoints

- `POST /api/generate` — receives `{ spec, fileName }`, writes `.pro` + `_Props.pro`
- `GET /api/browse-folder` — AppleScript folder picker, returns `{ ok, folder }`

## Status: Complete ✓ (post-overhaul)

All steps done. The tool is production-ready.

1. ~~Extract exact element bounds/styles from output.json~~ ✓
2. ~~Build RTF generator that handles bold spans~~ ✓ — `rtf.js` / `rtf.test.js`
3. ~~Build protobuf encoder that writes valid .pro files~~ ✓ — `encode.js` / `builder.js`
4. ~~Build prop file generator~~ ✓ — `buildProp.js`
5. ~~Build the web UI~~ ✓ — `public/`
6. ~~Wire UI → generator → file output~~ ✓ — `server.js` + localStorage persistence
7. ~~13-issue overhaul~~ ✓ — single prop file, image/response card slides, queue element, multi-body scripture, revealing bullets, outputFolder, browse-folder API
'use strict';

// ─── Version & Changelog ──────────────────────────────────────────────────────

const APP_VERSION = '3.13.0';

const CHANGELOG = [
  {
    version: '3.13.0',
    date: '2026-06-18',
    changes: [
      "Revealing points: Confidence monitor mode — \"Current bullet\" (default, same as before) shows only the active bullet in the speaker notes. \"Stacking\" accumulates all revealed bullets so the speaker sees a growing list; previous bullets appear in normal weight and the current bullet in bold.",
    ],
  },
  {
    version: '3.12.0',
    date: '2026-06-18',
    changes: [
      "Revealing points: \"Paste to reflow\" — expand the disclosure below the bullet list, paste a block of text (one bullet per line), click Split, and DeckPro populates all bullets at once instead of requiring copy-paste into each field individually.",
    ],
  },
  {
    version: '3.11.0',
    date: '2026-06-18',
    changes: [
      "Preferences → Book Names: choose a display form for ambiguous books — \"Acts\" can display as \"Acts of the Apostles\"; \"Song of Solomon\" and \"Song of Songs\" are interchangeable. The override applies at export and retroactively updates all scripture slides without changing what you typed in the reference field.",
    ],
  },
  {
    version: '3.10.0',
    date: '2026-06-15',
    changes: [
      "Google Drive notes doc now persists — the link you load is remembered and reopens automatically after a reload or redeploy (Clear forgets it).",
      "Response Card now appears in the Outline panel with its decision text and responses; click it to jump to the editor. (Its inputs live in the 'Response Card' item in the slide list.)",
      "Preflight now warns when a scripture slide is long enough to be worth splitting into two.",
      "Preflight now flags stray spaces at the start/end of a reference, scripture body, or point.",
      "Revealing-point deck label now uses the prop header title when set, falling back to the first bullet.",
    ],
  },
  {
    version: '3.9.0',
    date: '2026-06-15',
    changes: [
      "Scripture reference bar is now fully scheme-driven with no hard-coded styling: the rust background bar is gone (transparent), and the reference text colour comes from the Reference Bar 'Color' setting in Schemes (defaults to white) instead of being locked to gold. Anything the scheme doesn't set falls back to Arial.",
      "Import from Pro7 reads the reference text colour into the Reference Bar colour setting so imported schemes keep their look; it no longer imports the (now-removed) bar fill/shadow.",
    ],
  },
  {
    version: '3.8.3',
    date: '2026-06-15',
    changes: [
      "Removed the Fill / Text / Shadow colour editors from the Reference Bar card in Schemes — the reference bar keeps its standard look, the card is just less cluttered.",
    ],
  },
  {
    version: '3.8.2',
    date: '2026-06-15',
    changes: [
      "Fix: the Slide Notes / Confidence Monitor size field in Schemes now saves. Previously editing it had no effect (the input wasn't wired to the scheme).",
    ],
  },
  {
    version: '3.8.1',
    date: '2026-06-15',
    changes: [
      "Fix: point slides now render in the Point font (bold) you set in Schemes. Previously a plain point fell back to the body font, so the Point font had no visible effect on normal point slides — now it does, on both the main screen and the LED wall.",
    ],
  },
  {
    version: '3.8.0',
    date: '2026-06-15',
    changes: [
      "Import from Pro7 now shows a review screen before saving — see the detected text styles, layout sizes and slide transition, rename the scheme, and read clear warnings about anything that couldn't be inferred (e.g. prop/LED-wall styling, which lives in a separate file). Back returns to the picker; Save creates the scheme.",
      "Scheme import now detects the slide transition (type + duration) from the presentation.",
    ],
  },
  {
    version: '3.7.0',
    date: '2026-06-15',
    changes: [
      "Point text and bold-in-body text now have separate fonts. The old combined \"Point / Bold Text\" card is split into a \"Point\" card and a \"Bold in Body\" card, each with its own Main Screen and Prop / LED Wall font, weight and styling.",
      "Existing schemes are unchanged — point text keeps whatever the bold font was set to until you customize it.",
    ],
  },
  {
    version: '3.6.0',
    date: '2026-06-15',
    changes: [
      "Layout tab now has a visual preview — scaled Main Screen and Prop/LED-wall canvases showing each element's position and size as boxes. Click a box to highlight its row in the table below (and vice-versa), so it's clear what each number controls.",
    ],
  },
  {
    version: '3.5.0',
    date: '2026-06-15',
    changes: [
      "Schemes redesigned as a cleaner editor instead of one long settings form. Four focused tabs — Text, Layout, Motion, Preview — with Text and Layout as the primary creative areas.",
      "Text tab rebuilt as compact style cards (Body, Point/Bold, Reference Bar, Start/End, Slide Notes) with Main Screen and Prop/LED Wall settings shown side by side for easy comparison; advanced controls tuck into a per-card disclosure.",
      "Transitions and Build Order moved together under a new Motion tab (Transitions shown side by side; Build Order as a secondary sub-view).",
      "New Preview tab shows approximate Main Screen, Prop/LED Wall, Reference Bar, Start/End, and Slide Notes examples built from the scheme's own fonts, sizes, and colours.",
      "Compact scheme toolbar (selector · name · duplicate · delete · lock · Import from Pro7 · Test Scheme) replaces the old stacked header. \"Presentation Settings\" renamed to \"Preferences.\"",
    ],
  },
  {
    version: '3.4.1',
    date: '2026-06-15',
    changes: [
      "Fix: the update progress overlay said \"Delivering to ProPresenter / Don't switch to ProPresenter\" (the export wording) while installing an app update. It now correctly reads \"Updating DeckPro / Don't close the app until this completes.\"",
    ],
  },
  {
    version: '3.4.0',
    date: '2026-06-15',
    changes: [
      "Schemes panel made friendlier: a short intro explains what a scheme is, and the technical layout (element positions) and build-order (animation) controls are now tucked behind an \"Advanced\" toggle — so everyday users just see fonts, sizes, colours, and transitions.",
      "Every font slot now has a hover \"?\" explaining exactly what it controls (main screens vs LED-wall prop, reference bar, confidence-monitor notes, etc.), and size boxes are clearly marked in points (pt).",
      "Locked schemes now show a clear explainer banner with Duplicate and Unlock buttons, instead of just greying everything out — no more wondering why nothing is editable.",
    ],
  },
  {
    version: '3.3.0',
    date: '2026-06-15',
    changes: [
      "Import a scheme from Pro7 — new \"Import from Pro7\" button in the Schemes panel. Pick a presentation from your ProPresenter library (or browse for a .pro file) and DeckPro reads its fonts, sizes, colours, and element positions into a new scheme. Best workflow: export a deck, restyle it in Pro7 to taste, then import it back so your edits become a reusable scheme.",
      "The library picker lists your presentations automatically, hides Props files, and flags any that can't be read so you don't pick a dead end.",
    ],
  },
  {
    version: '3.2.0',
    date: '2026-06-15',
    changes: [
      "Dark mode: inputs in Settings (folder path, Pro7 port, password, API key, Bible translation dropdown) now correctly render with a dark background and light text",
      "Toggle accent consistency: all panel toggles (blank-before, auto-manage, feature visibility) now use a neutral grey track when off and the orange accent when on, instead of the dark-blue-grey that appeared in dark mode",
      "Slide preview feature removed from the codebase — it was already hidden from the UI; cleaned up dead code and CSS",
      "Redeploy dialog now warns to save your deck to the Library first so no work is lost on relaunch",
      "Spell check: language explicitly set to en-US in Electron so the system dictionary provides word suggestions on right-click",
    ],
  },
  {
    version: '3.1.1',
    date: '2026-06-10',
    changes: [
      "Bible lookup now preserves hard line breaks — poetry like the Psalms keeps its line structure on the slide, the prop, and the LED wall instead of being flattened into one paragraph.",
    ],
  },
  {
    version: '3.1.0',
    date: '2026-06-10',
    changes: [
      "Auto-manage ProPresenter on export — if Pro7 is open, DeckPro now quits it, writes your deck and props, then relaunches it automatically. Toggle in Settings under Pro7 Connection (on by default); turn it off to be warned instead.",
      "Pro7 config safety net — every export keeps a rolling backup (last 10) of ProPresenter's props configuration. Restore any of them with one click from Export history, in case an export ever goes sideways.",
      "Slide notes now have full formatting controls in Schemes — font, size, alignment, spacing and more for the confidence-monitor notes, separate from every other element.",
      "Renamed Generation history to Export history to match the rest of the app.",
    ],
  },
  {
    version: '3.0.1',
    date: '2026-06-10',
    changes: [
      'Export keyboard shortcut is now ⌘E (was ⌘G)',
    ],
  },
  {
    version: '3.0.0',
    date: '2026-06-09',
    changes: [
      'DeckPro now updates itself — when a new version is released, a banner appears in the app; click Update and Relaunch and it installs and restarts automatically',
      'Help menu: Check for Updates… for manual checks',
      'DeckPro is now distributed on GitHub — the team can download it from the Releases page',
    ],
  },
  {
    version: '2.17.0',
    date: '2026-06-09',
    changes: [
      'Fit Width is now capped at the scheme Layout body width — the text box can never grow wider than the bounds you set',
      'Fix: Fit Width and slide previews were reading an empty scheme object — they now use the active scheme (correct font size, canvas, and body bounds)',
      "New scheme font entry: Point — prop / LED wall — point text on the LED wall now has its own font and Advanced panel, separate from the main-screen bold font and from the scripture prop body font",
      'Existing schemes inherit the current bold font for the new entry, so nothing changes until you customize it',
    ],
  },
  {
    version: '2.16.1',
    date: '2026-06-09',
    changes: [
      'Fix: app stuck on the splash screen — the new library storage module was missing from the packaged build',
    ],
  },
  {
    version: '2.16.0',
    date: '2026-06-09',
    changes: [
      'Deck Library rebuilt as a real project system — decks now live in a local SQLite database with daily automatic backups, not browser storage',
      'Existing decks migrate automatically on first launch (a JSON backup is written first)',
      'Library: search by series/title/speaker/date, filter tabs (Decks / Templates / Archived / Trash), sort by date, series, or updated',
      'Deck actions menu: Edit Info (now with Speaker), Duplicate, Save as Template, Archive, Delete with Trash + Restore + Delete Forever, Reveal Last Export',
      'Templates: save any deck as a template and start new decks from it',
      'Each deck shows export status — when it was last exported and whether it was edited since',
      'Export history is recorded in the library database and linked to the deck',
      "Library location is configurable (Settings → Deck Library) — point it at iCloud Drive / Dropbox / a shared folder to use the same library on multiple computers; DeckPro joins an existing library if it finds one",
      'Conflict detection — if the same deck is changed on two machines, DeckPro asks which version to keep instead of silently overwriting',
    ],
  },
  {
    version: '2.15.6',
    date: '2026-06-09',
    changes: [
      'Export no longer writes a _Props.pro file to the Pro7 library — props go directly into Configuration/Props; old _Props.pro files are cleaned up automatically',
    ],
  },
  {
    version: '2.15.5',
    date: '2026-06-09',
    changes: [
      'Fix: clicking Export while Pro7 is open no longer locks the button — Pro7 check now runs before the button is disabled, so the warning modal shows cleanly and Export is immediately usable again',
    ],
  },
  {
    version: '2.15.4',
    date: '2026-06-09',
    changes: [
      'Help guide updated — all sections rewritten to reflect current features including Export flow, Props/DeckPro collection, Schemes & Layout alignment, Response Card, slide notes, quote warnings',
      'New Schemes section added to help guide',
    ],
  },
  {
    version: '2.15.3',
    date: '2026-06-09',
    changes: [
      'Layout tab: alignment buttons — center/middle takes priority over left/right when all match (full-width elements)',
      'Layout tab: alignment button highlights update live as you type in a value — no longer stale after manual edits',
    ],
  },
  {
    version: '2.15.2',
    date: '2026-06-09',
    changes: [
      'Layout tab: alignment buttons added to each element row — H-left/center/right and V-top/middle/bottom snap X or Y to canvas-relative positions',
    ],
  },
  {
    version: '2.15.1',
    date: '2026-06-09',
    changes: [
      'Export now always writes all 50 prop slots — unused slots get empty placeholders so the DeckPro collection is full and consistent from first export',
    ],
  },
  {
    version: '2.15.0',
    date: '2026-06-09',
    changes: [
      'Generate renamed to Export throughout — button, history, help, and settings',
      'Save to Folder and Download options removed — Export always goes directly to Pro7',
      'Settings Output section simplified — export mode is always Pro7 deliver',
    ],
  },
  {
    version: '2.14.8',
    date: '2026-06-09',
    changes: [
      'Fix: DeckPro collection now tracks all prop slots ever used, not just the current deck',
    ],
  },
  {
    version: '2.14.7',
    date: '2026-06-09',
    changes: [
      "Deliver mode now manages a \"DeckPro\" collection folder in Pro7's Props panel — all DeckPro prop slots are moved there automatically on every delivery; folder is created on first use",
    ],
  },
  {
    version: '2.14.6',
    date: '2026-06-09',
    changes: [
      'Deliver mode now patches Configuration/Props at the binary level — prop collections, folders, and all Pro7-internal metadata are preserved byte-for-byte',
    ],
  },
  {
    version: '2.14.5',
    date: '2026-06-09',
    changes: [
      'Deliver mode now backs up Configuration/Props to Configuration/Props.deckpro-backup before writing — restore it manually if something goes wrong',
    ],
  },
  {
    version: '2.14.4',
    date: '2026-06-09',
    changes: [
      'Expanded prop slots from 25 to 50',
    ],
  },
  {
    version: '2.14.3',
    date: '2026-06-09',
    changes: [
      'Expanded prop slots from 10 to 25 — large decks with many revealing-point bullets no longer hit the generation limit; new slots auto-register in Pro7 on first use',
    ],
  },
  {
    version: '2.14.2',
    date: '2026-06-09',
    changes: [
      'Revealing point bullets now support bold (⌘B) — no toolbar, keyboard shortcut only; data model updated from plain strings to spans',
    ],
  },
  {
    version: '2.14.1',
    date: '2026-06-09',
    changes: [
      "Pre-generate warning: detects mismatched curly double quotes (“”), curly single quotes (‘’), and odd-count straight double quotes in scripture and point body text",
    ],
  },
  {
    version: '2.14.0',
    date: '2026-05-27',
    changes: [
      'Slide notes: scripture slides now embed the full verse text in Pro7 notes (even when split across 2 slides); point, image, start, and end slides also get notes — feeds the confidence monitor without off-screen elements',
      'START and END slides: element renamed from "this slide" to "body"; live badge added so confidence monitor shows the active slide indicator',
      'Response Card package expanded to 6 slides: Blank → RC → R1 → R2 → R3 → Hold. RC Blank triggers the RESPONSE CARD stage layout; RC main slide triggers the message stage layout back',
      'Confidence monitor content on RC slides moved to slide notes — off-screen "this slide" element removed from RC package',
      'Stage layout actions: Settings → Stage Display section to configure screen name/UUID and layout names/UUIDs. Blank and image slides now have a Stage Layout dropdown to trigger any configured layout',
      'Build order "this slide" references migrated to "body" in existing saved schemes',
    ],
  },
  {
    version: '2.13.3',
    date: '2026-05-19',
    changes: [
      'Removed Cmd+R reload shortcut from the View menu',
    ],
  },
  {
    version: '2.13.2',
    date: '2026-05-19',
    changes: [
      'Layout tab: Header row now has an editable Y field — uncheck "Auto Y" to set a fixed title bar position',
      'Same for Prop header: uncheck "Auto Y" to set propTitleY directly',
    ],
  },
  {
    version: '2.13.1',
    date: '2026-05-19',
    changes: [
      'Font color picker moved out of Advanced and into the font row itself — visible without opening Advanced',
      'Vertical alignment buttons merged onto the same row as Alignment — one row instead of two',
      'Scaling dropdown added to Advanced panel (Default / Scale down / Text up or down / None)',
    ],
  },
  {
    version: '2.13.0',
    date: '2026-05-19',
    changes: [
      'All five font Advanced panels now include Stroke (width + color) and Shadow (opacity + color + angle + offset + blur) options, matching Pro7\'s element-level controls',
      'Style toggles (B / I / U / S) redesigned as a joined segmented-button strip — no longer stretch to fill width',
      'Stroke and shadow settings wired through to all element builders in encoder and prop generator',
    ],
  },
  {
    version: '2.12.9',
    date: '2026-05-19',
    changes: [
      'Font rows now two-line: family select full-width on top, style select + pt size input on second line — fixes size input expanding to 100% width',
      'Body Margins panel removed from Text tab (body margin fields remain in Layout tab)',
    ],
  },
  {
    version: '2.12.8',
    date: '2026-05-19',
    changes: [
      'Schemes Text tab: Sizes section merged into each Font row — size pt input lives inline with the family/style selectors; Reference bar row shows both main and prop sizes',
      'Schemes Text tab: Body fill moved into Body font Advanced; Reference bar fill, text color, and shadow moved into Reference bar font Advanced — Colors section removed',
      'Font Advanced: Y Offset / Char Spacing / Line Height / Para Spacing reorganized into a compact 2-column grid',
      'Font Advanced: Style (B/I/U/S) and Capitalization merged into one row',
      'Capitalization options renamed to None / All Caps / Title Case / Start Case / All Lower (Small Caps removed)',
      'Transitions tab: Slide and Prop transitions now display side-by-side instead of stacked',
    ],
  },
  {
    version: '2.12.7',
    date: '2026-05-19',
    changes: [
      'Test Scheme now uses a running index (SchemeTest_<Name>_001, _002, …) so filenames never collide across sessions',
      'Test Scheme respects the output mode setting (local / download / deliver) the same as regular generation',
      'Test Scheme results now appear in generation history with the same summary modal as a regular generate',
    ],
  },
  {
    version: '2.12.6',
    date: '2026-05-19',
    changes: [
      'All font Advanced panels now include Vertical Alignment (top / middle / bottom icons, matching Pro7) and Margins (L / T / R / B) — applies to Body, Prop body, Bold, Reference bar, and Start/End elements',
      'Vertical alignment and margins from the Advanced panel are wired through to the encoder and override element defaults when set',
    ],
  },
  {
    version: '2.12.5',
    date: '2026-05-19',
    changes: [
      'Generation history moved into the ··· menu — removed the standalone download button from the header toolbar',
    ],
  },
  {
    version: '2.12.4',
    date: '2026-05-19',
    changes: [
      'Body margins moved from Layout tab to Text tab — now a collapsible "Body Margins" panel (L / T / R / B) that lives alongside Colors, Fonts, and Sizes',
    ],
  },
  {
    version: '2.12.3',
    date: '2026-05-19',
    changes: [
      'Dark mode fix: number, password, and select inputs inside form fields now inherit dark background and text color — affects Pro7 connection, Bible lookup, transition duration, and color hex inputs',
      'Dark mode fix: bullet point inputs, color hex fields, and segmented control buttons now render correctly in dark mode',
      'Preview button removed from scripture and point slide forms (feature kept for later)',
    ],
  },
  {
    version: '2.12.2',
    date: '2026-05-19',
    changes: [
      'Layout tab: "Ref bar" renamed to "Header" and "Prop ref bar" renamed to "Prop header"',
      'Layout tab: Auto Title Y toggle and Gap moved inline to the Header and Prop header rows; checking Auto Y greys out the Y column to indicate it is auto-calculated',
      'Layout tab: Prop header now has its own Auto Title Y toggle + Gap, same as main Header',
    ],
  },
  {
    version: '2.12.1',
    date: '2026-05-19',
    changes: [
      'Scheme header: New, Dupe, Delete buttons replaced with icon buttons — + / copy / trash icons with tooltips',
    ],
  },
  {
    version: '2.12.0',
    date: '2026-05-19',
    changes: [
      'Removed Gap S / Gap L from scheme entirely — title position is fully handled by Auto Title Y; fallback when Auto Y is off defaults to 0',
      'Removed generation history notification badge from the download button',
    ],
  },
  {
    version: '2.11.9',
    date: '2026-05-19',
    changes: [
      'Layout tab: Gap S / Gap L hidden on Ref bar when Auto Title Y is enabled — they only show as fallback when Auto Y is off, reducing visual noise',
    ],
  },
  {
    version: '2.11.8',
    date: '2026-05-19',
    changes: [
      'Fix: Auto Title Y result is now rounded to a whole pixel — title was landing at fractional positions like 868.1 instead of a clean 868',
    ],
  },
  {
    version: '2.11.7',
    date: '2026-05-19',
    changes: [
      'Fix: Auto Title Y now accounts for body bottom margin when estimating text top edge — title was landing ~31px too low because the 60px margin was not subtracted from the text position calculation',
    ],
  },
  {
    version: '2.11.6',
    date: '2026-05-19',
    changes: [
      'Scheme Layout tab: Live element row added (X, Y, W, H) — confidence monitor badge position is now configurable per scheme; defaults to 1736×1096 (below main canvas)',
    ],
  },
  {
    version: '2.11.5',
    date: '2026-05-19',
    changes: [
      'Body margins added (L, T, R, B) — controls the text inset inside the body box for both scripture and point slides; default bottom margin is 60 (matching previous hardcoded value)',
    ],
  },
  {
    version: '2.11.4',
    date: '2026-05-19',
    changes: [
      'Renamed overlay and toast copy from "Rebuilding / Rebuild complete" to "Redeploying / Redeploy complete"',
    ],
  },
  {
    version: '2.11.3',
    date: '2026-05-19',
    changes: [
      'Renamed "Rebuild and Reinstall" to "Redeploy" in File menu and confirmation dialog',
    ],
  },
  {
    version: '2.11.2',
    date: '2026-05-19',
    changes: [
      'Rebuild success toast — new DeckPro instance shows a confirmation toast on launch when opened after a rebuild',
    ],
  },
  {
    version: '2.11.1',
    date: '2026-05-19',
    changes: [
      'Rebuild and Reinstall now shows a live progress overlay inside the app — steps tick off in real time so you always know what\'s happening',
      'Fix: replaced exec() with spawn() so stdout is streamed live; overlay shows each step as it starts and completes',
      'Fix: removed pkill (caused crash); app now quits cleanly via app.quit() after rebuild.sh finishes',
      'Rebuild now clears dist/ before building to force a fully fresh electron-builder pack',
      'Rebuild now flushes the macOS Launch Services cache so the new bundle is always seen by the OS',
      'Rebuild failure now shows error message inline in the overlay with a Close button instead of a system alert',
    ],
  },
  {
    version: '2.11.0',
    date: '2026-05-19',
    changes: [
      'Auto Title Y — title bar position now auto-calculated from body text height; configurable gap (default 16px) keeps consistent spacing between body text top and title bar bottom across all scripture slides regardless of verse length',
      'Layout tab: Auto Title Y toggle + Gap input added; Gap S / Gap L still used when Auto Y is off',
    ],
  },
  {
    version: '2.10.10',
    date: '2026-05-19',
    changes: [
      'Fix: Rebuild and Reinstall now runs via a dedicated rebuild.sh script with explicit PATH — bypasses all Electron shell env issues with node/npm not found',
    ],
  },
  {
    version: '2.10.9',
    date: '2026-05-19',
    changes: [
      'Fix: Rebuild and Reinstall now passes full PATH to exec — node was not found because Electron\'s shell env doesn\'t inherit user PATH',
    ],
  },
  {
    version: '2.10.8',
    date: '2026-05-19',
    changes: [
      'Scheme Layout tab: Queue row added (X, Y, W, H) — queue sidebar bounds are now configurable per scheme and wired through to the encoder',
    ],
  },
  {
    version: '2.10.7',
    date: '2026-05-19',
    changes: [
      'Fix: Rebuild and Reinstall now uses full npm path (/usr/local/bin/npm) — Electron shell doesn\'t inherit PATH so npm was not found',
    ],
  },
  {
    version: '2.10.6',
    date: '2026-05-19',
    changes: [
      'Test Scheme button restyled as a pill inline with the scheme controls — matches the Blanks toggle style',
    ],
  },
  {
    version: '2.10.5',
    date: '2026-05-19',
    changes: [
      'Generation history button now uses a download arrow icon instead of the clock — no longer conflicts with the What\'s New changelog icon',
    ],
  },
  {
    version: '2.10.4',
    date: '2026-05-19',
    changes: [
      'Fix: menu item renamed to "Rebuild and Reinstall" — symbols (& and +) were being dropped by macOS menu rendering',
    ],
  },
  {
    version: '2.10.3',
    date: '2026-05-19',
    changes: [
      'Fix: renamed "Rebuild & Reinstall" to "Rebuild + Reinstall" — & was being swallowed by macOS menu rendering',
    ],
  },
  {
    version: '2.10.2',
    date: '2026-05-19',
    changes: [
      'Fix: Rebuild & Reinstall used __dirname which points to the ASAR bundle in packaged app — hardcoded source path so it actually works',
    ],
  },
  {
    version: '2.10.1',
    date: '2026-05-19',
    changes: [
      'File menu: Rebuild & Reinstall (⌘⇧R) — builds a fresh app, replaces /Applications/DeckPro.app, and relaunches automatically',
    ],
  },
  {
    version: '2.10.0',
    date: '2026-05-19',
    changes: [
      'Permanent prop slots — props use 10 fixed slots (prop_1–prop_10) pre-created in Pro7; UUIDs are hardcoded, content updates in-place each generate, no registration step needed',
      'Test Scheme button — generates a download covering every slide type (short ref, long ref, multi-body, bold, point single, revealing, blank, image, response card) to verify the scheme in Pro7',
      '"Saved" indicator now sits left of the deck title; Pro7 connection status sits right with no pill',
    ],
  },
  {
    version: '2.8.0',
    date: '2026-05-18',
    changes: [
      'Deliver to Pro7 now requires ProPresenter to be closed first — prevents Pro7 from overwriting prop config on quit',
      'Clear modal if ProPresenter is running when you try to deliver',
      'Success modal for delivery now reads "Ready — open ProPresenter"',
    ],
  },
  {
    version: '2.7.0',
    date: '2026-05-18',
    changes: [
      '"Saved" indicator moved inside the Pro7 connection pill — shows inline as "● Connected · Saved"',
    ],
  },
  {
    version: '2.6.0',
    date: '2026-05-18',
    changes: [
      'Deliver to Pro7 props now actually work — prop cue UUIDs are coordinated between the presentation and Configuration/Props so Pro7 resolves them on startup',
      'Props write directly to the active Pro7 library in Application Support (not Documents folder which Pro7 ignores for prop documents)',
    ],
  },
  {
    version: '2.5.0',
    date: '2026-05-18',
    changes: [
      'Delivery overlay — full-screen blocking overlay with step-by-step progress during Deliver to Pro7',
      'Generation history — Safari-style history panel (clock button in header) with Reveal in Finder per entry',
      'Reload always available in View menu (not just dev mode)',
    ],
  },
  {
    version: '2.4.0',
    date: '2026-05-18',
    changes: [
      'Custom titlebar — thin dark bar holds traffic lights + version number; orange header sits below',
      'Native macOS About panel (DeckPro menu → About DeckPro) with icon and copyright',
      'New icon — macOS 26 layered .icon with dark/light/tinted variants built in Icon Composer',
      'Deliver to Pro7 — new generation mode that saves to Pro7 library and opens in ProPresenter',
      'Reveal in Finder — button in generation success modal',
      'package.json version synced to APP_VERSION',
    ],
  },
  {
    version: '2.3.0',
    date: '2026-05-12',
    changes: [
      'Dark mode — toggle in ··· menu; respects system preference on first launch',
      'Slide type chips and status indicators adapt to dark mode',
    ],
  },
  {
    version: '2.2.0',
    date: '2026-05-12',
    changes: [
      'Schemes "Style" tab renamed to "Text"',
      'Font Advanced: Bold (B) and Strikethrough toggles added alongside Italic and Underline',
      'Font Advanced: Justified alignment option added',
      'Font Advanced: full capitalization set — Normal, ALL CAPS, Small Caps, Title Case, All Lower',
      'Font Advanced: per-font color picker',
      'Sizes section now uses compact table layout (like Layout tab)',
    ],
  },
  {
    version: '2.1.0',
    date: '2026-05-12',
    changes: [
      'Deck library redesigned — autosave, New Deck with scheme picker, Edit per deck, sort by date or series',
      'Header shows current deck series · title · date passively (click to open library)',
      'Draft mode — blank decks stay out of the library until they have content',
      'Current deck highlighted in library with "Current" badge; no more manual Save button',
    ],
  },
  {
    version: '2.0.3',
    date: '2026-05-12',
    changes: [
      'Spell check on all content fields — red underlines + right-click corrections in Electron',
    ],
  },
  {
    version: '2.0.2',
    date: '2026-05-12',
    changes: [
      'Fixed Pro7 connection — correct API path for ProPresenter 20.x (/version vs /v1/version)',
    ],
  },
  {
    version: '2.0.1',
    date: '2026-05-12',
    changes: [
      'Empty state logo polish — proper spacing between wordmark and version line',
      'Version displayed as x.x.x throughout',
      'Header wordmark size tuned for Electron titlebar',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-05-12',
    changes: [
      'DeckPro is now a native desktop app — no terminal or browser required',
      'Launches directly from your Applications folder or Dock',
      'Pro7 connection polls every 10s and reconnects automatically',
    ],
  },
  {
    version: '1.9.1',
    date: '2026-05-11',
    changes: [
      'Sync dot repositioned to the left of undo/redo',
      '"Saved" status indicator restored next to sync dot',
    ],
  },
  {
    version: '1.9.0',
    date: '2026-05-11',
    changes: [
      'Schemes panel redesigned — Style / Transitions / Build Order / Layout tabs (no more collapsible Advanced)',
      'Add Element sidebar condensed to compact 2-column grid',
      'Sync dot moved inside the undo/redo group',
    ],
  },
  {
    version: '1.8.0',
    date: '2026-05-11',
    changes: [
      'Streamlined header — Series/Title/Date/QR moved into Decks modal as Deck Info',
      'Deck name chip shows active series or title in the header',
      'Changelog, Help, Settings, and Schemes collapsed into ··· more menu',
      'Pro7 sync dot positioned between undo/redo buttons',
      'Schemes panel redesigned with Colors / Fonts / Sizes tabs',
    ],
  },
  {
    version: '1.7.0',
    date: '2026-05-11',
    changes: [
      'Deck Library — save, browse, and load past decks from the header',
      'Decks persist in localStorage, restore full slide state',
    ],
  },
  {
    version: '1.6.0',
    date: '2026-05-11',
    changes: [
      'Help & Guide modal with 6 sections (Overview, Slide Types, Bible Lookup, Outline Panel, Generating, Pro7 Connection)',
      'Header inputs redesigned — underline style, less visual clutter',
    ],
  },
  {
    version: '1.5.0',
    date: '2026-05-11',
    changes: [
      'Speaker Notes panel accepts Google Drive / Docs links',
      'Outline toggle button floats top-right of main panel',
      'Branded empty state with DeckPro logomark',
      'Orange brand color + DeckPro logomark in header',
      'Changelog modal (this panel)',
    ],
  },
  {
    version: '1.4.0',
    date: '2026-05-11',
    changes: [
      'Outline / Speaker Notes side panel with PDF drop zone and zoom controls',
      'Drag-to-resize panel handle',
      'PDF viewer with zoom controls (50–200%)',
      'Generate overview modal with slide count breakdown',
      'Output delivery: Save to folder / Download / Ask every time',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-05-11',
    changes: [
      'Bible lookup via API.Bible — NLT and all public translations',
      'Per-slide translation override picker',
      'Enter key triggers Bible lookup',
      'API key hidden in settings (password field)',
      'Translation list with available Bible versions',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-05-11',
    changes: [
      'Undo / Redo with ⌘Z / ⌘⇧Z',
      'Font family preview in style picker dropdown',
      'Confidence monitor text as collapsible section',
      'Saved indicator in header',
    ],
  },
  {
    version: '1.1.0',
    date: '2026-05-11',
    changes: [
      'Style presets (Default and custom)',
      'Pro7 live connection status indicator',
      'Presentation settings panel',
      'Series datalist with recent series memory',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-11',
    changes: [
      'Initial release',
      'Scripture, Point, Blank, Image, Custom slide types',
      'Drag-to-reorder slide queue',
      'ProPresenter 7 .pro file generation',
      'Prop file generation',
      'Response card support',
      'QR code toggle',
      'LocalStorage persistence',
    ],
  },
];

// ─── State ────────────────────────────────────────────────────────────────────

const DEFAULT_FEATURES = () => ({
  blankBefore:          true,  // blank-before toggle on content slides
  confidenceMonitor:    true,  // blank confidence monitor text field
  propName:             true,  // prop name field
  transitionOverride:   true,  // per-slide main presentation transition override
  propTransitionOverride: true, // per-slide prop transition override
});

const FONT_ADV_DEFAULTS = () => ({
  yOffset: 0, charSpacing: 0, lineHeight: 1,
  paragraphSpacingBefore: 0, paragraphSpacingAfter: 0,
  alignment: '', bold: false, italic: false, underline: false, strikethrough: false,
  capitalization: '', color: '',
  verticalAlignment: '',
  marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0,
  strokeEnabled: false, strokeWidth: 1, strokeColor: '',
  shadowEnabled: false, shadowOpacity: 75, shadowColor: '', shadowAngle: 315, shadowOffset: 5, shadowBlur: 5,
  scaleBehavior: '',
});

const DEFAULT_STYLE_SCHEME = () => ({
  id:          'default',
  name:        'Default',
  isDefault:   true,
  isLocked:    true,
  _ptSizes:    true,
  fillEnabled: false,
  bodyFill:    '#2196f2',
  titleFill:   '#a9391a',
  titleText:   '#f6d046',
  titleShadow: '#ff2600',
  // Fonts
  bodyFont:     'Montserrat-Medium',
  propBodyFont: 'Montserrat-SemiBold',
  boldFont:     'Montserrat-ExtraBold',   // bold spans inside body text (main screen)
  propBoldFont: 'Montserrat-ExtraBold',   // bold spans inside body text (LED wall)
  pointFont:    'Montserrat-ExtraBold',   // point text (main screen)
  propPointFont:'Montserrat-ExtraBold',   // point text (LED wall)
  titleFont:    'Montserrat-ExtraBold',
  startEndFont: 'Montserrat-ExtraBold',
  notesFont:     'Montserrat-Medium',
  notesBoldFont: 'Montserrat-Black',
  // Sizes (pt — backend doubles for RTF automatically)
  bodySize:      44,
  titleSize:     60,
  startEndSize:  45,
  propBodySize:  80,
  propTitleSize: 110,
  notesSize:     50,
  // Transitions — main presentation
  transitionType:     'fade',
  transitionDuration: 0.6,
  // Transitions — props (global default)
  propTransitionType:     'fade',
  propTransitionDuration: 0.6,
  // Canvas dimensions
  canvasW: 1920, canvasH: 1080,
  propCanvasW: 3200, propCanvasH: 1280,
  // Main screen element bounds
  bodyX: 0, bodyY: 729.98, bodyW: 1920, bodyH: 350.02,
  bodyMarginLeft: 0, bodyMarginTop: 0, bodyMarginRight: 0, bodyMarginBottom: 60,
  titleX: -0.18, titleY: 880, titleW: 1920.18, titleH: 50.51,
  autoTitleY: true, titleAutoGap: 16,
  startEndX: 0, startEndY: 900.14, startEndW: 1920, startEndH: 179.86,
  gradientX: 0, gradientY: 351.77, gradientH: 728.23,
  liveX: 1736.73, liveY: 1096.71, liveW: 183.27, liveH: 71.56,
  queueX: 0, queueY: 0, queueW: 400, queueH: 1080,
  // Prop element bounds (scaled to 3200×1280)
  propBodyX: 0, propBodyY: 853, propBodyW: 3200, propBodyH: 427,
  propTitleX: -0.30, propTitleY: 1040, propTitleW: 3200.30, propTitleH: 60,
  propAutoTitleY: true, propTitleAutoGap: 16,
  // Font advanced styling
  bodyFontAdv:     FONT_ADV_DEFAULTS(),
  propBodyFontAdv: FONT_ADV_DEFAULTS(),
  boldFontAdv:     FONT_ADV_DEFAULTS(),
  propBoldFontAdv: FONT_ADV_DEFAULTS(),
  pointFontAdv:    FONT_ADV_DEFAULTS(),
  propPointFontAdv:FONT_ADV_DEFAULTS(),
  titleFontAdv:    FONT_ADV_DEFAULTS(),
  startEndFontAdv: FONT_ADV_DEFAULTS(),
  notesFontAdv:    FONT_ADV_DEFAULTS(),
  // Build order per slide type
  buildOrders: {
    content: [
      { id: 'bo-c1', element: 'body',          dir: 'out', start: 'START_AFTER_PREVIOUS', delay: 60, transition: 'dissolve', duration: 0.6, enabled: true },
      { id: 'bo-c2', element: 'title',         dir: 'out', start: 'START_WITH_PREVIOUS',  delay: 0,  transition: 'dissolve', duration: 0.6, enabled: true },
      { id: 'bo-c3', element: 'atem_gradient', dir: 'out', start: 'START_WITH_PREVIOUS',  delay: 0,  transition: 'dissolve', duration: 0.6, enabled: true },
    ],
    point:   [],
    blank:   [],
    startEnd:[
      { id: 'bo-se1', element: 'body', dir: 'in', start: 'START_WITH_SLIDE', delay: 1, transition: 'cut', duration: 0, enabled: true },
    ],
  },
});

const DEFAULT_MACROS = () => ({
  START:   '7C586E48-986E-4932-9219-7D6A64BE5B6C',
  CONTENT: '8C15C594-8EE3-431C-B35C-B70B6AB91548',
  BLANK:   '3AC673FE-0841-4391-81F7-F2042F312E1C',
  LOGO:    '8CB7C31F-4B7E-41EE-96A5-D86F7CC8A71B',
  NO_LOGO: 'DF162F4C-DA5D-4DE2-8379-3F369BC4BA07',
});

const DEFAULT_STAGESCREEN = () => ({
  screenName:         'Stage Screen 1',
  screenUuid:         'DC13BE46-70FA-440C-B205-9063C695836A',
  rcLayoutName:       'RESPONSE CARD',
  rcLayoutUuid:       '6934381D-0B53-4557-812D-49AE7BACBA6B',
  messageLayoutName:  '26SPRING_stagedisplay_message',
  messageLayoutUuid:  '2530DD83-DD12-4E0A-93E2-AE326D9C1B38',
});

const DEFAULT_STATE = () => ({
  config: {
    seriesName:          '',
    messageTitle:        '',
    weekDate:            new Date().toISOString().slice(0, 10),
    qrCode:              false,
    includeResponseCard: true,
    outputFolder:        '',
    pro7Port:            1025,
    pro7Password:        '',
    autoManagePro7:      true,
    macros:              DEFAULT_MACROS(),
    features:            DEFAULT_FEATURES(),
    stageScreen:         DEFAULT_STAGESCREEN(),
    bibleApiKey:         '',
    bibleId:             '',
    bibleName:           '',
    bibleList:           [],  // cached [{id, name, abbreviation}]
    gdriveUrl:           '',  // last-loaded Google Drive notes doc (persists across redeploys)
    bookNames:           {},  // e.g. { acts: 'Acts of the Apostles', songOfSolomon: 'Song of Songs' }
    outputMode:          'local',  // 'local' | 'download' | 'ask'
    responses: {
      decisionText: 'I have decided to follow Jesus today!',
      r1: '',
      r2: '',
      r3: '',
    },
  },
  styleSchemes:  [DEFAULT_STYLE_SCHEME()],
  activeSchemeId: 'default',
  showBlanks: true,
  slides: [
    { id: 'start', type: 'start', label: 'START',        fixed: true },
    { id: 'end',   type: 'end',   label: 'End of Notes', fixed: true },
  ],
  activeId: 'start',
  currentDeckId: null,
});

let state = DEFAULT_STATE();

// ─── Pro7 runtime state (not persisted) ──────────────────────────────────────
const pro7rt = { connected: false, version: null, liveMacros: null };
let   _fontList      = null;  // cached system font list (PostScript names)
let   _fontFamilyMap = null;  // family → [{ style, postscript }]

// ─── Persistence ──────────────────────────────────────────────────────────────

const STORAGE_KEY    = 'deckpro_state';
const GEN_HISTORY_KEY = 'deckpro_gen_history';
const GEN_HISTORY_MAX = 30;

let _savedTimer   = null;
let _autosaveTimer = null;
const _undoStack = [];
const _redoStack = [];
const UNDO_LIMIT = 60;
let _skipUndoPush = false;

function pushUndo() {
  if (_skipUndoPush) return;
  _undoStack.push(JSON.stringify(state));
  if (_undoStack.length > UNDO_LIMIT) _undoStack.shift();
  _redoStack.length = 0;
  updateUndoButtons();
}

function updateUndoButtons() {
  const u = document.getElementById('btn-undo');
  const r = document.getElementById('btn-redo');
  if (u) u.disabled = _undoStack.length === 0;
  if (r) r.disabled = _redoStack.length === 0;
}

function applyUndo() {
  if (!_undoStack.length) return;
  _redoStack.push(JSON.stringify(state));
  state = JSON.parse(_undoStack.pop());
  _skipUndoPush = true;
  saveState(); render(); syncHeaderInputs();
  _skipUndoPush = false;
  updateUndoButtons();
}

function applyRedo() {
  if (!_redoStack.length) return;
  _undoStack.push(JSON.stringify(state));
  state = JSON.parse(_redoStack.pop());
  _skipUndoPush = true;
  saveState(); render(); syncHeaderInputs();
  _skipUndoPush = false;
  updateUndoButtons();
}

function saveState() {
  pushUndo();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  const el = document.getElementById('saved-indicator');
  if (el) {
    el.classList.add('show');
    clearTimeout(_savedTimer);
    _savedTimer = setTimeout(() => el.classList.remove('show'), 1200);
  }
  renderNotesPanel();
  clearTimeout(_autosaveTimer);
  _autosaveTimer = setTimeout(autosaveDeck, 1500);
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state = Object.assign(DEFAULT_STATE(), saved);
    // Merge config separately so new keys get defaults
    const defaultCfg = DEFAULT_STATE().config;
    state.config = Object.assign(defaultCfg, saved.config || {});
    // Ensure nested responses object gets defaults
    state.config.responses = Object.assign(defaultCfg.responses, (saved.config || {}).responses || {});
    // Ensure macros get defaults for any new keys
    state.config.macros = Object.assign(DEFAULT_MACROS(), (saved.config || {}).macros || {});
    // Feature flags
    state.config.features = Object.assign(DEFAULT_FEATURES(), (saved.config || {}).features || {});
    // Stage screen config
    state.config.stageScreen = Object.assign(DEFAULT_STAGESCREEN(), (saved.config || {}).stageScreen || {});
    // Restore style schemes — support old 'stylePresets' key for migration
    const savedSchemes = saved.styleSchemes || saved.stylePresets;
    if (Array.isArray(savedSchemes) && savedSchemes.length) {
      const SIZE_FIELDS = ['bodySize', 'titleSize', 'startEndSize', 'propBodySize', 'propTitleSize'];
      const DEF = DEFAULT_STYLE_SCHEME();
      state.styleSchemes = savedSchemes.map(p => {
        // Migrate old half-point values to pt
        let out = p;
        if (!p._ptSizes) {
          out = { ...p, _ptSizes: true };
          for (const f of SIZE_FIELDS) if (out[f]) out[f] = Math.round(out[f] / 2);
        }
        // Merge with defaults so all new fields get values
        const merged = { ...DEF, ...out };
        // Merge nested fontAdv objects too
        for (const k of ['bodyFontAdv','propBodyFontAdv','boldFontAdv','titleFontAdv','startEndFontAdv','notesFontAdv']) {
          merged[k] = { ...FONT_ADV_DEFAULTS(), ...(out[k] || {}) };
        }
        // Seed slide-notes font fields for schemes saved before notes were customizable
        if (!out.notesFont)     merged.notesFont     = DEF.notesFont;
        if (!out.notesBoldFont) merged.notesBoldFont = DEF.notesBoldFont;
        if (!out.notesSize)     merged.notesSize     = DEF.notesSize;
        // Seed the prop bold font from the main bold font on first load
        if (!out.propBoldFont)    merged.propBoldFont    = merged.boldFont;
        if (!out.propBoldFontAdv) merged.propBoldFontAdv = JSON.parse(JSON.stringify(merged.boldFontAdv));
        else                      merged.propBoldFontAdv = { ...FONT_ADV_DEFAULTS(), ...out.propBoldFontAdv };
        // Seed the split point fonts from the bold fonts for schemes saved before the split
        // (preserves existing point-text styling — point used to share the bold font).
        if (!out.pointFont)         merged.pointFont         = merged.boldFont;
        if (!out.pointFontAdv)      merged.pointFontAdv      = JSON.parse(JSON.stringify(merged.boldFontAdv));
        else                        merged.pointFontAdv      = { ...FONT_ADV_DEFAULTS(), ...out.pointFontAdv };
        if (!out.propPointFont)     merged.propPointFont     = merged.propBoldFont;
        if (!out.propPointFontAdv)  merged.propPointFontAdv  = JSON.parse(JSON.stringify(merged.propBoldFontAdv));
        else                        merged.propPointFontAdv  = { ...FONT_ADV_DEFAULTS(), ...out.propPointFontAdv };
        // Ensure isDefault is set correctly by scheme id
        merged.isDefault = (merged.id === 'default');
        // For migrated saves without isLocked, lock only the default scheme
        if (p.isLocked === undefined) merged.isLocked = merged.isDefault;
        // Merge buildOrders — fill any missing tab keys with defaults
        merged.buildOrders = { ...DEF.buildOrders, ...(out.buildOrders || {}) };
        // Migrate old 'this slide' element references to 'body' in build orders
        for (const tabKey of Object.keys(merged.buildOrders)) {
          if (Array.isArray(merged.buildOrders[tabKey])) {
            merged.buildOrders[tabKey] = merged.buildOrders[tabKey].map(entry =>
              entry.element === 'this slide' ? { ...entry, element: 'body' } : entry
            );
          }
        }
        return merged;
      });
    }
    // Support old 'activeStyleId' key for migration
    state.activeSchemeId = saved.activeSchemeId || saved.activeStyleId
      || (state.styleSchemes[0]?.id ?? 'default');
    state.showBlanks = saved.showBlanks ?? true;
    // Migrate old string[] bullets → spans[][] for revealing points
    for (const sl of (state.slides || [])) {
      if (sl.type === 'point' && sl.mode === 'revealing' && Array.isArray(sl.bullets)) {
        sl.bullets = sl.bullets.map(b =>
          (typeof b === 'string') ? [{ text: b, bold: false }] : b
        );
      }
    }

    if (!state.slides.find(s => s.type === 'start'))
      state.slides.unshift({ id: 'start', type: 'start', label: 'START', fixed: true });
    if (!state.slides.find(s => s.type === 'end'))
      state.slides.push({ id: 'end', type: 'end', label: 'End of Notes', fixed: true });
  } catch (_) {}
}

function syncHeaderInputs() {
  const s   = state.config.seriesName?.trim()  || '';
  const t   = state.config.messageTitle?.trim() || '';
  const raw = state.config.weekDate || '';
  const d   = raw ? new Date(raw + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const isDraft = !state.currentDeckId;

  const meta  = document.getElementById('deck-header-meta');
  const elSeries = document.getElementById('dhm-series');
  const elTitle  = document.getElementById('dhm-title');
  const elDate   = document.getElementById('dhm-date');
  const sep1     = document.getElementById('dhm-sep1');
  const sep2     = document.getElementById('dhm-sep2');

  if (meta) meta.classList.toggle('dhm--draft', isDraft && !s && !t);

  if (elSeries) elSeries.textContent = isDraft && !s && !t ? 'Draft' : s;
  if (elTitle)  elTitle.textContent  = isDraft && !s && !t ? '' : t;
  if (elDate)   elDate.textContent   = isDraft && !s && !t ? '' : d;
  if (sep1) sep1.style.display = (s && t) ? '' : 'none';
  if (sep2) sep2.style.display = ((t && d) || (s && d && !t)) && !isDraft ? '' : 'none';

  const dl = document.getElementById('series-datalist');
  if (dl) {
    const recent = state.config.recentSeries || [];
    dl.innerHTML = recent.map(r => `<option value="${esc(r)}">`).join('');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
}
function syncUidCounter() { /* no-op — UUIDs never collide */ }

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Rich-text helpers ────────────────────────────────────────────────────────

function extractSpans(el) {
  const spans = [];
  function walk(node, fmt) {
    if (node.nodeType === 3) {
      if (node.textContent) spans.push({ text: node.textContent, ...fmt });
    } else if (node.nodeType === 1) {
      if (node.tagName === 'BR') { spans.push({ text: '\n', ...fmt }); return; }
      const bold      = fmt.bold      || node.tagName === 'B' || node.tagName === 'STRONG'
                        || node.style.fontWeight === 'bold' || node.style.fontWeight === '700';
      const italic    = fmt.italic    || node.tagName === 'I' || node.tagName === 'EM'
                        || node.style.fontStyle === 'italic';
      const underline = fmt.underline || node.tagName === 'U'
                        || node.style.textDecoration === 'underline'
                        || node.style.textDecorationLine === 'underline';
      for (const child of node.childNodes) walk(child, { bold, italic, underline });
    }
  }
  walk(el, { bold: false, italic: false, underline: false });
  return spans.reduce((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && last.bold === s.bold && last.italic === s.italic && last.underline === s.underline)
      last.text += s.text;
    else
      acc.push({ text: s.text, bold: !!s.bold, italic: !!s.italic, underline: !!s.underline });
    return acc;
  }, []);
}

// Extract plain text from a bullet (string or spans array)
function bulletToText(bullet) {
  if (typeof bullet === 'string') return bullet;
  return (bullet || []).map(s => s.text || '').join('');
}

function spansToHtml(spans) {
  return (spans || []).map(s => {
    let html = esc(s.text);
    if (s.underline) html = `<u>${html}</u>`;
    if (s.italic)    html = `<em>${html}</em>`;
    if (s.bold)      html = `<strong>${html}</strong>`;
    return html;
  }).join('');
}

function plainFromSpans(spans) {
  return (spans || []).map(s => s.text).join('');
}

// Like spansToHtml but converts \n spans → <br> for the preview canvas
function spansToHtmlPreview(spans) {
  return (spans || []).map(s => {
    if (s.text === '\n') return '<br>';
    let html = esc(s.text).replace(/\n/g, '<br>');
    if (s.underline) html = `<u>${html}</u>`;
    if (s.italic)    html = `<em>${html}</em>`;
    if (s.bold)      html = `<strong>${html}</strong>`;
    return html;
  }).join('');
}

/**
 * Measure text spans in a hidden div and find the optimal body width.
 * Poetry mode (has \n): find minimum width that fits each explicit line without soft-wrapping.
 * Balance mode (no \n): binary-search for the tightest width that keeps text in the same line count.
 * Returns { bodyW, bodyX } in Pro7 canvas coordinates.
 */
function activeStyleScheme() {
  return (state.styleSchemes || []).find(s => s.id === state.activeSchemeId) || (state.styleSchemes || [])[0] || {};
}

function computeOptimalBodyWidth(spans, rs) {
  const bodySize = rs?.bodySize ?? 44;
  const canvasW  = rs?.canvasW  ?? 1920;
  // Fit-width may never exceed the scheme's body width
  const schemeMaxW = Math.min(rs?.bodyW || canvasW, canvasW);
  const padding  = 80; // breathing room added after fitting

  const hasExplicit = spans.some(s => s.text.includes('\n'));

  // Hidden measurement container — 1:1 canvas coordinate space
  const msr   = document.createElement('div');
  const style = document.createElement('style');
  style.textContent = '._msr strong{font-family:Montserrat,"Montserrat-Black",sans-serif;font-weight:900}._msr em{font-style:italic}';
  const inner = document.createElement('div');
  inner.className = '_msr';
  msr.appendChild(style);
  msr.appendChild(inner);
  Object.assign(msr.style, {
    position: 'fixed', top: '-9999px', left: '-9999px',
    visibility: 'hidden', pointerEvents: 'none',
    fontSize: `${bodySize}px`,
    fontFamily: 'Montserrat,"Montserrat-Medium",sans-serif',
    fontWeight: '500',
    lineHeight: '1.3',
  });
  document.body.appendChild(msr);

  try {
    if (hasExplicit) {
      // Poetry: measure each explicit line at no-wrap, take the max
      inner.style.whiteSpace = 'nowrap';
      inner.style.display    = 'inline-block';

      const lines = [[]];
      for (const span of spans) {
        const parts = span.text.split('\n');
        parts.forEach((part, i) => {
          if (i > 0) lines.push([]);
          if (part) lines[lines.length - 1].push({ ...span, text: part });
        });
      }

      let maxW = 0;
      for (const line of lines) {
        if (!line.length) continue;
        inner.innerHTML = spansToHtml(line);
        maxW = Math.max(maxW, inner.scrollWidth);
      }

      const optimalW = Math.min(Math.ceil(maxW) + padding, schemeMaxW);
      return { bodyW: optimalW, bodyX: Math.round((canvasW - optimalW) / 2) };

    } else {
      // Balance: find minimum width that keeps text in same # of lines as at full width
      const lineH = Math.round(bodySize * 1.3);
      inner.style.whiteSpace = 'normal';
      inner.style.display    = 'block';
      inner.innerHTML        = spansToHtmlPreview(spans);

      inner.style.width = `${schemeMaxW}px`;
      const fullLines = Math.max(1, Math.round(inner.scrollHeight / lineH));

      if (fullLines <= 1) {
        // Single line: shrink to text width
        inner.style.whiteSpace = 'nowrap';
        inner.style.width      = 'auto';
        const textW    = inner.scrollWidth;
        const optimalW = Math.min(textW + padding, schemeMaxW);
        return { bodyW: optimalW, bodyX: Math.round((canvasW - optimalW) / 2) };
      }

      // Binary search: smallest W where line count stays at fullLines
      inner.style.whiteSpace = 'normal';
      inner.innerHTML        = spansToHtmlPreview(spans);
      let lo = 200, hi = schemeMaxW, best = schemeMaxW;
      while (lo <= hi) {
        const mid = Math.round((lo + hi) / 2);
        inner.style.width = `${mid}px`;
        const lines = Math.round(inner.scrollHeight / lineH);
        if (lines <= fullLines) { best = mid; hi = mid - 1; }
        else lo = mid + 1;
      }

      const optimalW = Math.min(best + padding, schemeMaxW);
      return { bodyW: optimalW, bodyX: Math.round((canvasW - optimalW) / 2) };
    }
  } finally {
    document.body.removeChild(msr);
  }
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const ICON = {
  start:     { cls: 'si-start',     text: 'S'  },
  end:       { cls: 'si-end',       text: 'E'  },
  blank:     { cls: 'si-blank',     text: 'B'  },
  scripture: { cls: 'si-scripture', text: 'S' },
  point:     { cls: 'si-point',     text: 'P' },
  image:     { cls: 'si-image',     text: 'I' },
  custom:    { cls: 'si-custom',    text: 'C' },
};

// Macro badge: { cls, icon } — icon = 'circle' | 'circle-slash' | null (text only)
const SLIDE_MACRO_BADGE = {
  start:     { text: 'START', cls: 'macro-start' },
  end:       { text: '',      cls: 'macro-logo',     icon: 'circle' },
  blank:     { text: '',      cls: 'macro-logo',     icon: 'circle' },
  scripture: { text: '',      cls: 'macro-nologoreplace', icon: 'circle-slash' },
  point:     { text: '',      cls: 'macro-nologoreplace', icon: 'circle-slash' },
  image:     { text: '',      cls: 'macro-nologoreplace', icon: 'circle-slash' },
  custom:    { text: '',      cls: 'macro-logo',          icon: 'circle' },
};

function macroBadgeHTML(badge) {
  if (!badge) return '';
  const icon = badge.icon === 'circle'
    ? '<span class="badge-icon badge-circle"></span>'
    : badge.icon === 'circle-slash'
      ? '<span class="badge-icon badge-circle-slash"></span>'
      : '';
  return `<span class="si-badge si-badge-macro ${badge.cls}">${icon}${badge.text ? esc(badge.text) : ''}</span>`;
}

function makeSidebarItem({ id, cls, iconCls, iconText, label, fixed, draggable, onClick, onDelete, onDuplicate, macroBadge, transBadge, propTransBadge }) {
  const item = document.createElement('div');
  item.className = `slide-item${cls ? ' ' + cls : ''}${fixed ? ' fixed' : ''}`;
  item.dataset.id = id;
  if (draggable) item.draggable = true;
  const badges = macroBadgeHTML(macroBadge)
               + (transBadge     ? `<span class="si-badge si-badge-trans">${esc(transBadge)}</span>`           : '')
               + (propTransBadge ? `<span class="si-badge si-badge-prop-trans">${esc(propTransBadge)}</span>` : '');
  item.innerHTML = `
    <div class="slide-icon ${iconCls}">${iconText}</div>
    <div class="slide-label">${esc(label)}</div>
    ${badges ? `<div class="slide-badges">${badges}</div>` : ''}
    <div class="slide-item-actions">
      ${onDuplicate ? '<button class="btn-dupe-slide" title="Duplicate">⎘</button>' : ''}
      ${onDelete    ? '<button class="btn-delete-slide" title="Delete">×</button>'  : ''}
    </div>
  `;
  item.addEventListener('click', e => {
    if (!e.target.closest('.slide-item-actions')) onClick();
  });
  item.querySelector('.btn-dupe-slide')?.addEventListener('click', e => {
    e.stopPropagation(); onDuplicate();
  });
  item.querySelector('.btn-delete-slide')?.addEventListener('click', e => {
    e.stopPropagation(); onDelete();
  });
  return item;
}

function renderSidebar() {
  const queue = document.getElementById('slide-queue');
  queue.innerHTML = '';

  // Update show-blanks toggle button state
  const toggleBtn = document.getElementById('btn-show-blanks');
  if (toggleBtn) toggleBtn.classList.toggle('active', state.showBlanks);

  for (const slide of state.slides) {
    // Hide blank slides from sidebar when showBlanks is false
    if (!state.showBlanks && slide.type === 'blank') continue;

    const ic            = ICON[slide.type] || { cls: '', text: '?' };
    const macroBadge    = SLIDE_MACRO_BADGE[slide.type] || null;
    const transBadge     = slide.transition?.type     ? slide.transition.type.toUpperCase()     : null;
    const propTransBadge = slide.propTransition?.type ? slide.propTransition.type.toUpperCase() : null;

    // Blank-before indicator row (before content slides with blankBefore: true)
    if (slide.blankBefore && ['scripture', 'point', 'image'].includes(slide.type)) {
      const indicator = document.createElement('div');
      indicator.className = 'si-blank-indicator' + (!state.showBlanks ? ' hidden' : '');
      indicator.innerHTML = `<span class="si-blank-icon"><span class="badge-circle"></span></span><span class="si-blank-label">blank</span><div class="slide-badges" style="margin-left:auto">${macroBadgeHTML(SLIDE_MACRO_BADGE['blank'])}</div>`;
      queue.appendChild(indicator);
    }

    const item = makeSidebarItem({
      id:          slide.id,
      cls:         slide.id === state.activeId ? 'active' : '',
      iconCls:     ic.cls,
      iconText:    ic.text,
      label:       slide.label,
      fixed:       slide.fixed,
      draggable:   !slide.fixed,
      onClick:     () => selectSlide(slide.id),
      onDelete:    slide.fixed ? null : () => deleteSlide(slide.id),
      onDuplicate: slide.fixed ? null : () => duplicateSlide(slide.id),
      macroBadge,
      transBadge,
      propTransBadge,
    });

    if (!slide.fixed) {
      item.addEventListener('dragstart', onDragStart);
      item.addEventListener('dragend',   onDragEnd);
    }
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('dragleave', onDragLeave);
    item.addEventListener('drop',      onDrop);

    // Inject RC item just before END
    if (slide.type === 'end') {
      const rcItem = makeSidebarItem({
        id:       'rc',
        cls:      state.activeId === 'rc' ? 'active' : '',
        iconCls:  'si-rc',
        iconText: 'RC',
        label:    'Response Card',
        fixed:    true,
        draggable: false,
        onClick:  () => { state.activeId = 'rc'; render(); },
        macroBadge: { text: '', cls: 'macro-blank', icon: 'circle' },
      });
      queue.appendChild(rcItem);
    }

    queue.appendChild(item);
  }
}

// ─── Drag-to-reorder ──────────────────────────────────────────────────────────

let dragId = null;

function onDragStart(e) {
  dragId = e.currentTarget.dataset.id;
  e.dataTransfer.effectAllowed = 'move';
  setTimeout(() => { e.currentTarget.style.opacity = '0.4'; }, 0);
}

function onDragEnd(e) {
  e.currentTarget.style.opacity = '';
  document.querySelectorAll('.slide-item.drag-over')
    .forEach(el => el.classList.remove('drag-over'));
  dragId = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  if (e.currentTarget.dataset.id !== dragId)
    e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.dataset.id;
  e.currentTarget.classList.remove('drag-over');
  if (!dragId || dragId === targetId) return;

  const fromIdx = state.slides.findIndex(s => s.id === dragId);
  const target  = state.slides.find(s => s.id === targetId);
  if (!target) return;

  const [moved] = state.slides.splice(fromIdx, 1);

  let toIdx = state.slides.findIndex(s => s.id === targetId);
  if (target.type === 'start')  toIdx = 1;
  else if (target.type === 'end') toIdx = state.slides.length - 1;
  toIdx = Math.max(1, Math.min(toIdx, state.slides.length - 1));

  state.slides.splice(toIdx, 0, moved);
  render();
}

// ─── Main panel ───────────────────────────────────────────────────────────────

function syncStyleButton() {
  const scheme = (state.styleSchemes || []).find(p => p.id === state.activeSchemeId)
    || (state.styleSchemes || [])[0];
  const lbl = document.getElementById('btn-style-label');
  if (lbl) lbl.textContent = scheme?.name || 'Default';
  document.getElementById('btn-style')?.classList.toggle('active', state.activeId === 'style');
  document.getElementById('btn-settings')?.classList.toggle('active', state.activeId === 'settings');
}

function renderMain() {
  const panel = document.getElementById('main-panel');

  syncStyleButton();

  if (state.activeId === 'settings') { renderConfigPanel(panel);      return; }
  if (state.activeId === 'style')    { renderStylePanel(panel);        return; }
  if (state.activeId === 'rc')       { renderResponseCardPanel(panel); return; }

  const slide = state.slides.find(s => s.id === state.activeId);
  if (!slide) {
    panel.innerHTML = `
      <div class="panel-brand">
        <img src="assets/deckpro_wordmark_black.png" alt="DeckPro" class="panel-brand-logo">
        <div class="panel-brand-sub">V${APP_VERSION} &nbsp;·&nbsp; Lucca Grillo</div>
      </div>`;
    return;
  }

  if (slide.type === 'start' || slide.type === 'end') {
    panel.innerHTML = startEndForm(slide);
    attachStartEndHandlers(slide);
    return;
  }

  switch (slide.type) {
    case 'blank':     panel.innerHTML = blankForm(slide);     break;
    case 'scripture': panel.innerHTML = scriptureForm(slide); break;
    case 'point':     panel.innerHTML = pointForm(slide);     break;
    case 'image':     panel.innerHTML = imageForm(slide);     break;
    case 'custom':    panel.innerHTML = customForm(slide);    break;
    default:          panel.innerHTML = '<div class="panel-empty">Unknown type</div>'; return;
  }
  attachFormHandlers(slide);
}

// ─── Transition picker helper ─────────────────────────────────────────────────

function transitionRow(current, idPrefix) {
  const type = current?.type || 'default';
  const dur  = current?.duration ?? 0.6;
  const showDur = type !== 'default' && type !== 'cut';
  return `
    <div class="trans-row" id="${idPrefix}-trans-row">
      <div class="segmented-control trans-seg" id="${idPrefix}-trans-seg">
        <button data-val="default"  class="${type === 'default'  ? 'active' : ''}">Default</button>
        <button data-val="fade"     class="${type === 'fade'     ? 'active' : ''}">Fade</button>
        <button data-val="dissolve" class="${type === 'dissolve' ? 'active' : ''}">Dissolve</button>
        <button data-val="cut"      class="${type === 'cut'      ? 'active' : ''}">Cut</button>
      </div>
      <input type="number" class="trans-dur" id="${idPrefix}-trans-dur"
        value="${showDur ? dur : ''}" min="0.1" max="5" step="0.1" placeholder="s"
        style="display:${showDur ? 'block' : 'none'}">
    </div>
  `;
}

function attachTransitionHandlers(idPrefix, get, save) {
  const seg = document.getElementById(`${idPrefix}-trans-seg`);
  const dur = document.getElementById(`${idPrefix}-trans-dur`);
  if (!seg) return;
  seg.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      seg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.val;
      const showDur = val !== 'default' && val !== 'cut';
      dur.style.display = showDur ? 'block' : 'none';
      if (val === 'default') {
        save(null);
      } else if (val === 'cut') {
        save({ type: 'cut', duration: 0 });
      } else {
        save({ type: val, duration: parseFloat(dur.value) || 0.6 });
      }
    });
  });
  dur.addEventListener('input', () => {
    const active = seg.querySelector('button.active')?.dataset.val;
    if (active && active !== 'default' && active !== 'cut') {
      save({ type: active, duration: parseFloat(dur.value) || 0.6 });
    }
  });
}

// ─── Build order editor ───────────────────────────────────────────────────────

let _boActiveTab = 'content';

const BO_ELEMENTS = {
  content:  ['this slide', 'title', 'live', 'atem_gradient'],
  point:    ['body', 'live', 'atem_gradient'],
  blank:    ['this slide'],
  startEnd: ['this slide'],
};

const BO_STARTS = [
  ['START_WITH_SLIDE',    'With Slide'],
  ['ON_CLICK',            'On Click'],
  ['START_WITH_PREVIOUS', 'With Previous'],
  ['START_AFTER_PREVIOUS','After Previous'],
];

const BO_TRANSITIONS = [
  ['cut',      'Cut'],
  ['dissolve', 'Dissolve'],
  ['fade',     'Fade'],
];

function renderBuildTable(tab, scheme, locked) {
  const entries  = (scheme.buildOrders || {})[tab] || [];
  const elements = BO_ELEMENTS[tab] || ['this slide'];
  const dis      = locked ? 'disabled' : '';

  const rows = entries.map((entry, i) => {
    const isCut  = entry.transition === 'cut';
    const isLast = i === entries.length - 1;
    return `
      <tr class="bo-row">
        <td class="bo-cell-ord">
          <button class="bo-mv" data-dir="up"   data-idx="${i}" ${i === 0    || locked ? 'disabled' : ''} title="Move up">↑</button>
          <button class="bo-mv" data-dir="down" data-idx="${i}" ${isLast     || locked ? 'disabled' : ''} title="Move down">↓</button>
        </td>
        <td class="bo-cell-en">
          <input type="checkbox" class="bo-en" data-idx="${i}" ${entry.enabled ? 'checked' : ''} ${dis}>
        </td>
        <td class="bo-cell-el">
          <select class="bo-el" data-idx="${i}" ${dis}>
            ${elements.map(el => `<option value="${esc(el)}" ${entry.element === el ? 'selected' : ''}>${esc(el)}</option>`).join('')}
          </select>
        </td>
        <td class="bo-cell-dir">
          <select class="bo-dir" data-idx="${i}" ${dis}>
            <option value="in"  ${entry.dir === 'in'  ? 'selected' : ''}>In</option>
            <option value="out" ${entry.dir === 'out' ? 'selected' : ''}>Out</option>
          </select>
        </td>
        <td class="bo-cell-start">
          <select class="bo-start" data-idx="${i}" ${dis}>
            ${BO_STARTS.map(([val, lbl]) => `<option value="${val}" ${entry.start === val ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
        </td>
        <td class="bo-cell-delay">
          <input type="number" class="bo-num bo-delay" data-idx="${i}"
            value="${entry.delay ?? 0}" min="0" step="0.5" placeholder="s" ${dis}>
        </td>
        <td class="bo-cell-trans">
          <select class="bo-trans" data-idx="${i}" ${dis}>
            ${BO_TRANSITIONS.map(([val, lbl]) => `<option value="${val}" ${entry.transition === val ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
        </td>
        <td class="bo-cell-dur">
          <input type="number" class="bo-num bo-dur" data-idx="${i}"
            value="${isCut ? '' : (entry.duration ?? 0.6)}" min="0" max="10" step="0.1" placeholder="s"
            ${isCut || locked ? 'disabled' : ''} ${isCut ? 'style="opacity:.3"' : ''}>
        </td>
        <td class="bo-cell-del">
          <button class="bo-del" data-idx="${i}" ${dis} title="Remove">×</button>
        </td>
      </tr>`;
  }).join('');

  const empty = !rows ? `<tr><td colspan="9" class="bo-empty">No builds — click + Add</td></tr>` : '';

  return `
    <table class="bo-table">
      <thead>
        <tr>
          <th class="bo-th-ord"></th>
          <th class="bo-th-en">On</th>
          <th class="bo-th-el">Element</th>
          <th class="bo-th-dir">Dir</th>
          <th class="bo-th-start">Start</th>
          <th class="bo-th-num">Delay</th>
          <th class="bo-th-trans">Transition</th>
          <th class="bo-th-num">Dur</th>
          <th class="bo-th-del"></th>
        </tr>
      </thead>
      <tbody>${rows || empty}</tbody>
    </table>
    <button class="btn-sm bo-add-btn" id="bo-add-btn" ${locked ? 'disabled' : ''}>+ Add</button>
  `;
}

function attachBuildOrderHandlers(getScheme, panel, locked) {
  const wrap = panel.querySelector('#bo-table-wrap');
  if (!wrap) return;

  const getEntries = () => {
    const s = getScheme(); if (!s) return [];
    if (!s.buildOrders) s.buildOrders = {};
    if (!Array.isArray(s.buildOrders[_boActiveTab])) s.buildOrders[_boActiveTab] = [];
    return s.buildOrders[_boActiveTab];
  };

  const refresh = () => {
    const s = getScheme(); if (!s) return;
    wrap.innerHTML = renderBuildTable(_boActiveTab, s, locked);
    attachBuildRowHandlers(getEntries, wrap, getScheme, panel, locked);
  };

  // Tab switching
  panel.querySelectorAll('.bo-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _boActiveTab = btn.dataset.tab;
      panel.querySelectorAll('.bo-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === _boActiveTab));
      refresh();
    });
  });

  attachBuildRowHandlers(getEntries, wrap, getScheme, panel, locked);
}

function attachBuildRowHandlers(getEntries, wrap, getScheme, panel, locked) {
  if (locked) return;

  const refresh = () => {
    const s = getScheme(); if (!s) return;
    wrap.innerHTML = renderBuildTable(_boActiveTab, s, locked);
    attachBuildRowHandlers(getEntries, wrap, getScheme, panel, locked);
  };

  // ↑/↓ move
  wrap.querySelectorAll('.bo-mv').forEach(btn => {
    btn.addEventListener('click', () => {
      const entries = getEntries();
      const i = Number(btn.dataset.idx);
      if (btn.dataset.dir === 'up' && i > 0) {
        [entries[i - 1], entries[i]] = [entries[i], entries[i - 1]];
      } else if (btn.dataset.dir === 'down' && i < entries.length - 1) {
        [entries[i], entries[i + 1]] = [entries[i + 1], entries[i]];
      }
      saveState(); refresh();
    });
  });

  // Delete row
  wrap.querySelectorAll('.bo-del').forEach(btn => {
    btn.addEventListener('click', () => {
      getEntries().splice(Number(btn.dataset.idx), 1);
      saveState(); refresh();
    });
  });

  // Enabled toggle
  wrap.querySelectorAll('.bo-en').forEach(inp => {
    inp.addEventListener('change', () => {
      getEntries()[Number(inp.dataset.idx)].enabled = inp.checked;
      saveState();
    });
  });

  // Element
  wrap.querySelectorAll('.bo-el').forEach(sel => {
    sel.addEventListener('change', () => {
      getEntries()[Number(sel.dataset.idx)].element = sel.value;
      saveState();
    });
  });

  // Direction
  wrap.querySelectorAll('.bo-dir').forEach(sel => {
    sel.addEventListener('change', () => {
      getEntries()[Number(sel.dataset.idx)].dir = sel.value;
      saveState();
    });
  });

  // Start type
  wrap.querySelectorAll('.bo-start').forEach(sel => {
    sel.addEventListener('change', () => {
      getEntries()[Number(sel.dataset.idx)].start = sel.value;
      saveState();
    });
  });

  // Delay
  wrap.querySelectorAll('.bo-delay').forEach(inp => {
    inp.addEventListener('input', () => {
      getEntries()[Number(inp.dataset.idx)].delay = parseFloat(inp.value) || 0;
      saveState();
    });
  });

  // Transition — show/hide Dur when Cut
  wrap.querySelectorAll('.bo-trans').forEach(sel => {
    sel.addEventListener('change', () => {
      const i = Number(sel.dataset.idx);
      getEntries()[i].transition = sel.value;
      const durInp = wrap.querySelector(`.bo-dur[data-idx="${i}"]`);
      if (durInp) {
        const isCut = sel.value === 'cut';
        durInp.disabled     = isCut;
        durInp.style.opacity = isCut ? '0.3' : '';
        if (isCut) durInp.value = '';
      }
      saveState();
    });
  });

  // Duration
  wrap.querySelectorAll('.bo-dur').forEach(inp => {
    inp.addEventListener('input', () => {
      getEntries()[Number(inp.dataset.idx)].duration = parseFloat(inp.value) || 0;
      saveState();
    });
  });

  // Add new row
  const addBtn = document.getElementById('bo-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const elements = BO_ELEMENTS[_boActiveTab] || ['this slide'];
      getEntries().push({
        id: uid(), element: elements[0], dir: 'out',
        start: 'START_AFTER_PREVIOUS', delay: 0,
        transition: 'dissolve', duration: 0.6, enabled: true,
      });
      saveState(); refresh();
    });
  }
}

// ─── Config / global settings panel ──────────────────────────────────────────

function renderConfigPanel(panel) {
  const cfg = state.config;

  panel.innerHTML = `
    <div class="slide-form">
      <h2>
        Preferences
      </h2>

      <div class="settings-section">
        <h3>Output</h3>
        <div class="settings-row">
          <label>Export mode</label>
          <span style="font-size:13px;color:var(--muted)">Export to Pro7 (writes directly to ProPresenter library)</span>
        </div>
      </div>

      <div class="settings-section">
        <h3>Deck Library</h3>
        <div class="settings-row">
          <label>Location</label>
          <div class="folder-row" style="flex:1">
            <input type="text" id="cfg-library-dir" value="" readonly placeholder="Loading…">
            <button class="btn-browse" id="btn-library-browse">Change…</button>
            <button class="btn-browse" id="btn-library-reset">Default</button>
          </div>
        </div>
        <div style="font-size:11.5px;color:var(--muted);margin-top:6px;line-height:1.5">
          Decks live in a local database with daily backups. Point the location at an iCloud Drive, Dropbox, or shared folder to use the same library on multiple computers — DeckPro joins an existing library if it finds one there.
        </div>
      </div>

      <div class="settings-section">
        <h3>Pro7 Connection</h3>
        <div class="pro7-conn-row">
          <div class="field" style="flex:0 0 110px;margin-bottom:0">
            <label>Port</label>
            <input type="number" id="cfg-pro7port" value="${cfg.pro7Port || 1025}" min="1" max="65535" style="width:100%">
          </div>
          <div class="field" style="flex:1;margin-bottom:0">
            <label>Password (if set)</label>
            <input type="password" id="cfg-pro7password" value="${esc(cfg.pro7Password || '')}" placeholder="leave blank if none" style="width:100%">
          </div>
          <button class="btn-sm" id="btn-pro7-connect" style="align-self:flex-end;margin-bottom:0">Check</button>
        </div>
        <div id="pro7-connect-status" class="pro7-connect-status ${pro7rt.connected ? 'ok' : 'err'}">
          ${pro7rt.connected
            ? `Connected${pro7rt.version ? ' — ' + esc(pro7rt.version) : ''}`
            : 'Not connected — check Pro7 is running and Network API is enabled in preferences'}
        </div>
        ${pro7rt.connected && pro7rt.liveMacros ? `<div id="macro-live-panel"></div>` : ''}
        <div class="rc-toggle-row" id="automanage-row" style="margin-top:12px">
          <div class="toggle ${cfg.autoManagePro7 !== false ? 'on' : ''}" id="automanage-toggle"></div>
          <span>Auto-manage ProPresenter on export</span>
        </div>
        <div style="font-size:11.5px;color:var(--muted);margin-top:6px;line-height:1.5">
          When on, exporting will quit ProPresenter if it's open, write your deck and props, then relaunch it — so you never have to close it by hand. Turn off to be warned instead.
        </div>
      </div>

      <div class="settings-section">
        <h3>Macro UUIDs <span style="font-size:11px;font-weight:500;color:var(--muted)">${pro7rt.connected ? '· Pro7 connected' : '· connect above to copy from Pro7'}</span></h3>
        <div class="macro-uuid-table">
          ${[
            ['Start',   'START'],
            ['Content', 'CONTENT'],
            ['Blank',   'BLANK'],
            ['Logo',    'LOGO'],
            ['No Logo', 'NO_LOGO'],
          ].map(([label, key]) => `
            <span class="macro-uuid-label">${label}</span>
            <input type="text" class="macro-uuid-input macro-uuid-field" data-key="${key}"
              value="${esc((cfg.macros || {})[key] || DEFAULT_MACROS()[key])}"
              placeholder="${esc(DEFAULT_MACROS()[key])}" spellcheck="false">
          `).join('')}
        </div>
        <button class="btn-sm" id="btn-macros-reset" style="margin-top:6px">Reset to defaults</button>
      </div>

      <div class="settings-section">
        <h3>Stage Display</h3>
        <p style="color:var(--muted);font-size:12px;margin:0 0 10px">
          Screen name + UUID and layout names for stage layout actions. Copy UUIDs from Pro7 → Stage → right-click.
        </p>
        <div class="macro-uuid-table" style="grid-template-columns:110px 1fr">
          <span class="macro-uuid-label">Screen name</span>
          <input type="text" class="stage-field" data-key="screenName"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).screenName)}" spellcheck="false">
          <span class="macro-uuid-label">Screen UUID</span>
          <input type="text" class="stage-field" data-key="screenUuid"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).screenUuid)}" spellcheck="false">
          <span class="macro-uuid-label">RC layout</span>
          <input type="text" class="stage-field" data-key="rcLayoutName"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).rcLayoutName)}"
            placeholder="RESPONSE CARD" spellcheck="false">
          <span class="macro-uuid-label">RC layout UUID</span>
          <input type="text" class="stage-field" data-key="rcLayoutUuid"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).rcLayoutUuid)}" spellcheck="false">
          <span class="macro-uuid-label">Msg layout</span>
          <input type="text" class="stage-field" data-key="messageLayoutName"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).messageLayoutName)}"
            placeholder="26SPRING_stagedisplay_message" spellcheck="false">
          <span class="macro-uuid-label">Msg layout UUID</span>
          <input type="text" class="stage-field" data-key="messageLayoutUuid"
            value="${esc((cfg.stageScreen || DEFAULT_STAGESCREEN()).messageLayoutUuid)}" spellcheck="false">
        </div>
        <button class="btn-sm" id="btn-stage-reset" style="margin-top:6px">Reset to defaults</button>
      </div>

      <div class="settings-section">
        <h3>Feature Visibility</h3>
        <p style="color:var(--muted);font-size:12px;margin:0 0 12px">
          Hide advanced fields for simpler handoffs to other users.
        </p>
        ${[
          ['blankBefore',          'Blank slide before toggle'],
          ['confidenceMonitor',    'Confidence monitor text fields'],
          ['propName',             'Prop name fields'],
          ['transitionOverride',   'Main transition override'],
          ['propTransitionOverride','Prop transition override'],
        ].map(([key, lbl]) => {
          const on = (cfg.features || DEFAULT_FEATURES())[key];
          return `
            <div class="feature-toggle-row" data-feature="${key}">
              <div class="toggle ${on ? 'on' : ''}" id="ft-${key}"></div>
              <label>${esc(lbl)}</label>
            </div>
          `;
        }).join('')}
      </div>

      <div class="settings-section">
        <h3>Bible Lookup (API.Bible)</h3>
        <p style="color:var(--muted);font-size:12px;margin:0 0 10px">
          Get a free API key at <strong>api.bible</strong>. Paste it below, then click Fetch to load your available translations.
        </p>
        <div class="field" style="margin-bottom:8px">
          <label>API Key</label>
          <div style="display:flex;gap:6px">
            <input type="password" id="cfg-bible-key" value="${esc(cfg.bibleApiKey || '')}" placeholder="Paste your api.bible key" spellcheck="false" autocomplete="off" style="flex:1">
            <button class="btn-sm" id="btn-bible-fetch">Fetch</button>
          </div>
        </div>
        <div class="field" style="margin-bottom:4px">
          <label>Default Translation</label>
          <select id="cfg-bible-id" style="width:100%">
            ${(cfg.bibleList || []).length
              ? (cfg.bibleList.map(b =>
                  `<option value="${esc(b.id)}" ${b.id === cfg.bibleId ? 'selected' : ''}>${esc(b.name)} (${esc(b.abbreviation)})</option>`
                ).join(''))
              : (cfg.bibleId
                  ? `<option value="${esc(cfg.bibleId)}">${esc(cfg.bibleName || cfg.bibleId)}</option>`
                  : `<option value="">— paste key and click Fetch —</option>`)}
          </select>
        </div>
        ${(cfg.bibleList || []).length ? `
          <div class="bible-list-note">${cfg.bibleList.length} translation${cfg.bibleList.length !== 1 ? 's' : ''} available on your account</div>
        ` : ''}
      </div>

      <div class="settings-section">
        <h3>Book Names</h3>
        <p style="color:var(--muted);font-size:12px;margin:0 0 10px">
          Choose how ambiguous book names appear in the reference bar. Applied at export — changing the setting retroactively updates all slides.
        </p>
        ${BOOK_NAME_OPTIONS.map(({ key, label, choices }) => {
          const cur = (cfg.bookNames || {})[key] || '';
          return `
            <div class="settings-row" style="margin-bottom:8px;align-items:center">
              <label style="min-width:160px;font-size:13px">${esc(label)}</label>
              <select class="bookname-select" data-key="${esc(key)}" style="flex:1">
                <option value="">As typed</option>
                ${choices.map(c => `<option value="${esc(c)}" ${cur === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
              </select>
            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;

  // Deck Library location
  (async () => {
    if (!_libStatus) _libStatus = await libApi('/api/library/status');
    const inp = document.getElementById('cfg-library-dir');
    if (inp && _libStatus?.libraryDir) inp.value = _libStatus.libraryDir;
  })();
  document.getElementById('btn-library-browse')?.addEventListener('click', async () => {
    try {
      const res  = await fetch('/api/browse-folder');
      const data = await res.json();
      if (!data.ok || !data.folder) return;
      const r = await libApi('/api/library/location', { method: 'POST', body: { folder: data.folder } });
      if (r.ok) {
        _libStatus = await libApi('/api/library/status');
        const inp = document.getElementById('cfg-library-dir');
        if (inp) inp.value = r.libraryDir;
        await refreshLibCache();
        renderDecksList();
        toast('success', r.adopted ? 'Joined existing library' : 'Library moved', r.libraryDir);
      } else {
        toast('error', 'Could not change library location', r.error || '');
      }
    } catch (_) {}
  });
  document.getElementById('btn-library-reset')?.addEventListener('click', async () => {
    const r = await libApi('/api/library/location', { method: 'POST', body: { reset: true } });
    if (r.ok) {
      _libStatus = await libApi('/api/library/status');
      const inp = document.getElementById('cfg-library-dir');
      if (inp) inp.value = r.libraryDir;
      await refreshLibCache();
      renderDecksList();
      toast('success', 'Library reset to default location', r.libraryDir);
    }
  });

  // Pro7 port + password
  document.getElementById('cfg-pro7port').addEventListener('change', e => {
    cfg.pro7Port = parseInt(e.target.value, 10) || 1025;
    saveState();
  });
  document.getElementById('cfg-pro7password').addEventListener('input', e => {
    cfg.pro7Password = e.target.value;
    saveState();
  });

  // Auto-manage ProPresenter on export
  document.getElementById('automanage-row')?.addEventListener('click', () => {
    cfg.autoManagePro7 = !(cfg.autoManagePro7 !== false); // default-true semantics
    document.getElementById('automanage-toggle').classList.toggle('on', cfg.autoManagePro7);
    saveState();
  });

  // Pro7 connect check
  document.getElementById('btn-pro7-connect').addEventListener('click', async () => {
    const btn = document.getElementById('btn-pro7-connect');
    btn.disabled = true; btn.textContent = '…';
    await checkPro7(false);
    btn.disabled = false; btn.textContent = 'Check';
    if (pro7rt.connected && pro7rt.liveMacros) renderMacroPicker();
  });

  if (pro7rt.connected && pro7rt.liveMacros) setTimeout(() => renderMacroPicker(), 50);

  // Feature visibility toggles
  document.querySelectorAll('.feature-toggle-row').forEach(row => {
    row.addEventListener('click', () => {
      if (!cfg.features) cfg.features = DEFAULT_FEATURES();
      const key = row.dataset.feature;
      cfg.features[key] = !cfg.features[key];
      row.querySelector('.toggle').classList.toggle('on', cfg.features[key]);
      saveState();
    });
  });

  // Macro UUID inputs
  document.querySelectorAll('.macro-uuid-input').forEach(inp => {
    inp.addEventListener('input', e => {
      if (!cfg.macros) cfg.macros = DEFAULT_MACROS();
      cfg.macros[e.target.dataset.key] = e.target.value.trim();
      saveState();
    });
  });
  document.getElementById('btn-macros-reset').addEventListener('click', () => {
    cfg.macros = DEFAULT_MACROS();
    document.querySelectorAll('.macro-uuid-field').forEach(inp => {
      inp.value = DEFAULT_MACROS()[inp.dataset.key] || '';
    });
    saveState();
  });

  // Stage screen inputs
  document.querySelectorAll('.stage-field').forEach(inp => {
    inp.addEventListener('input', e => {
      if (!cfg.stageScreen) cfg.stageScreen = DEFAULT_STAGESCREEN();
      cfg.stageScreen[e.target.dataset.key] = e.target.value.trim();
      saveState();
    });
  });
  document.getElementById('btn-stage-reset')?.addEventListener('click', () => {
    cfg.stageScreen = DEFAULT_STAGESCREEN();
    document.querySelectorAll('.stage-field').forEach(inp => {
      inp.value = DEFAULT_STAGESCREEN()[inp.dataset.key] || '';
    });
    saveState();
  });

  // Bible API key
  document.getElementById('cfg-bible-key').addEventListener('input', e => {
    cfg.bibleApiKey = e.target.value.trim();
    saveState();
  });

  // Bible translation select
  document.getElementById('cfg-bible-id').addEventListener('change', e => {
    const sel = e.target;
    cfg.bibleId   = sel.value;
    cfg.bibleName = sel.options[sel.selectedIndex]?.text || '';
    saveState();
  });

  // Fetch available Bibles from API.Bible
  document.getElementById('btn-bible-fetch').addEventListener('click', async () => {
    const btn = document.getElementById('btn-bible-fetch');
    const key = document.getElementById('cfg-bible-key').value.trim();
    if (!key) { toast('error', 'No API key', 'Enter your api.bible key first'); return; }
    btn.disabled = true; btn.textContent = '…';
    try {
      const res  = await fetch(`/api/bible/bibles?apiKey=${encodeURIComponent(key)}`);
      const data = await res.json();
      if (!data.ok) { toast('error', 'Failed', data.error || 'Could not fetch Bibles'); return; }
      cfg.bibleList   = data.bibles.map(b => ({
        id:           b.id,
        name:         b.nameLocal || b.name,
        abbreviation: b.abbreviationLocal || b.abbreviation,
      }));
      cfg.bibleApiKey = key;
      if (!cfg.bibleId && cfg.bibleList.length) {
        cfg.bibleId   = cfg.bibleList[0].id;
        cfg.bibleName = cfg.bibleList[0].name;
      }
      saveState();
      // Re-render settings to show populated list
      renderConfigPanel(document.getElementById('main-panel'));
      toast('success', `${data.bibles.length} translation${data.bibles.length !== 1 ? 's' : ''} loaded`, 'Pick your default below');
    } catch (err) {
      toast('error', 'Network error', err.message);
    } finally {
      btn.disabled = false; btn.textContent = 'Fetch Bibles';
    }
  });

  // Book name overrides
  document.querySelectorAll('.bookname-select').forEach(sel => {
    sel.addEventListener('change', e => {
      if (!cfg.bookNames) cfg.bookNames = {};
      const key = e.target.dataset.key;
      const val = e.target.value;
      if (val) cfg.bookNames[key] = val;
      else delete cfg.bookNames[key];
      saveState();
    });
  });
}

// ─── Style scheme panel ───────────────────────────────────────────────────────

function fontAdvPanel(schemeKey, label, scheme, locked, extraColorFields = []) {
  const adv = scheme[schemeKey] || FONT_ADV_DEFAULTS();
  const dis = locked ? 'disabled' : '';
  const alignOpts = [['', 'Left'], ['center', 'Center'], ['right', 'Right'], ['justify', 'Justify']];
  const alignBtns = alignOpts.map(([v, lbl]) =>
    `<button data-val="${v}" class="${adv.alignment === v ? 'active' : ''}" ${dis}>${lbl}</button>`
  ).join('');
  const capOpts = [
    ['', 'None'], ['allCaps', 'All Caps'], ['titleCase', 'Title Case'],
    ['startCase', 'Start Case'], ['allLower', 'All Lower'],
  ];
  const colorVal = adv.color || '#ffffff';
  const extraColorHtml = extraColorFields.map(({ label: clbl, field }) => {
    const val = scheme[field] || '#ffffff';
    return `
      <div class="font-adv-row">
        <label>${esc(clbl)}</label>
        <div class="color-input-wrap">
          <input type="color" id="sc-${field}" value="${esc(val)}" ${dis}>
          <input type="text" class="color-hex" id="sc-${field}-hex" value="${esc(val)}" maxlength="7" ${dis}>
        </div>
      </div>`;
  }).join('');
  return `
    <details class="font-adv-panel">
      <summary class="font-adv-summary">Advanced — ${esc(label)}</summary>
      <div class="font-adv-body">
        <div class="fav-num-grid">
          <div class="fav-num-cell">
            <span class="fav-num-lbl">Y Offset</span>
            <div class="fav-num-unit-row">
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="yOffset"
                value="${adv.yOffset ?? 0}" step="0.5" ${dis}>
              <span class="fav-unit">px</span>
            </div>
          </div>
          <div class="fav-num-cell">
            <span class="fav-num-lbl">Char Spacing</span>
            <div class="fav-num-unit-row">
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="charSpacing"
                value="${adv.charSpacing ?? 0}" step="0.5" ${dis}>
              <span class="fav-unit">pt</span>
            </div>
          </div>
          <div class="fav-num-cell">
            <span class="fav-num-lbl">Line Height</span>
            <div class="fav-num-unit-row">
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="lineHeight"
                value="${adv.lineHeight ?? 1}" min="0.1" max="5" step="0.05" ${dis}>
              <span class="fav-unit">×</span>
            </div>
          </div>
          <div class="fav-num-cell">
            <span class="fav-num-lbl">Para Spacing</span>
            <div class="fav-para-row">
              <input type="number" class="fav-num fav-para-inp" data-scheme="${schemeKey}" data-field="paragraphSpacingBefore"
                value="${adv.paragraphSpacingBefore ?? 0}" step="1" ${dis} title="Before (pt)">
              <span class="fav-para-sep">/</span>
              <input type="number" class="fav-num fav-para-inp" data-scheme="${schemeKey}" data-field="paragraphSpacingAfter"
                value="${adv.paragraphSpacingAfter ?? 0}" step="1" ${dis} title="After (pt)">
            </div>
          </div>
        </div>
        <div class="font-adv-row">
          <label>Alignment</label>
          <div class="segmented-control fav-align" data-scheme="${schemeKey}">${alignBtns}</div>
          <div class="segmented-control fav-vert-align" data-scheme="${schemeKey}" ${dis ? 'data-disabled="1"' : ''}>
            ${[
              ['top',    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="1" y1="1.5" x2="12" y2="1.5"/><line x1="6.5" y1="3" x2="6.5" y2="12"/><polyline points="4,5.5 6.5,3 9,5.5"/></svg>'],
              ['middle', '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="1" y1="6.5" x2="12" y2="6.5"/><line x1="6.5" y1="1" x2="6.5" y2="5"/><polyline points="4,3.5 6.5,1 9,3.5"/><line x1="6.5" y1="8" x2="6.5" y2="12"/><polyline points="4,9.5 6.5,12 9,9.5"/></svg>'],
              ['bottom', '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><line x1="1" y1="11.5" x2="12" y2="11.5"/><line x1="6.5" y1="1" x2="6.5" y2="10"/><polyline points="4,7.5 6.5,10 9,7.5"/></svg>'],
            ].map(([v, icon]) =>
              `<button data-val="${v}" class="${adv.verticalAlignment === v ? 'active' : ''}" title="${v[0].toUpperCase()+v.slice(1)}" ${dis}>${icon}</button>`
            ).join('')}
          </div>
        </div>
        <div class="font-adv-row fav-style-row">
          <div class="font-adv-toggles">
            <button type="button" class="fav-toggle ${adv.bold ? 'on' : ''}" data-scheme="${schemeKey}" data-field="bold" ${dis}><b>B</b></button>
            <button type="button" class="fav-toggle ${adv.italic ? 'on' : ''}" data-scheme="${schemeKey}" data-field="italic" ${dis}><i>I</i></button>
            <button type="button" class="fav-toggle ${adv.underline ? 'on' : ''}" data-scheme="${schemeKey}" data-field="underline" ${dis}><u>U</u></button>
            <button type="button" class="fav-toggle ${adv.strikethrough ? 'on' : ''}" data-scheme="${schemeKey}" data-field="strikethrough" ${dis}><s>S</s></button>
          </div>
          <select class="fav-select fav-caps-sel" data-scheme="${schemeKey}" data-field="capitalization" ${dis}>
            ${capOpts.map(([v, lbl]) => `<option value="${v}" ${adv.capitalization === v ? 'selected' : ''}>${lbl}</option>`).join('')}
          </select>
        </div>
        <div class="font-adv-row">
          <label>Scaling</label>
          <select class="fav-select fav-scale-sel" data-scheme="${schemeKey}" data-field="scaleBehavior" ${dis}>
            <option value="" ${!adv.scaleBehavior ? 'selected' : ''}>Default</option>
            <option value="SCALE_BEHAVIOR_SCALE_FONT_DOWN" ${adv.scaleBehavior === 'SCALE_BEHAVIOR_SCALE_FONT_DOWN' ? 'selected' : ''}>Scale down</option>
            <option value="SCALE_BEHAVIOR_SCALE_FONT_UP_DOWN" ${adv.scaleBehavior === 'SCALE_BEHAVIOR_SCALE_FONT_UP_DOWN' ? 'selected' : ''}>Text up or down</option>
            <option value="none" ${adv.scaleBehavior === 'none' ? 'selected' : ''}>None</option>
          </select>
        </div>
        <div class="font-adv-row">
          <label>Margins</label>
          <div class="fav-margins-row">
            ${[['marginLeft','L'],['marginTop','T'],['marginRight','R'],['marginBottom','B']].map(([field, lbl]) =>
              `<span class="fav-margin-lbl">${lbl}</span><input type="number" class="fav-num fav-margin-inp" data-scheme="${schemeKey}" data-field="${field}" value="${adv[field] ?? 0}" step="1" ${dis}>`
            ).join('')}
          </div>
        </div>
        ${extraColorHtml}
        <div class="fav-section">
          <label class="fav-section-head">
            <input type="checkbox" class="fav-chk" data-scheme="${schemeKey}" data-field="strokeEnabled" ${adv.strokeEnabled ? 'checked' : ''} ${dis}>
            <span>Stroke</span>
          </label>
          <div class="fav-section-body ${adv.strokeEnabled ? '' : 'fav-section-off'}">
            <div class="fav-inline-row">
              <span class="fav-num-lbl">Width</span>
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="strokeWidth"
                value="${adv.strokeWidth ?? 1}" step="0.5" min="0" ${dis}>
              <span class="fav-unit">pt</span>
              <input type="color" class="fav-sc" data-scheme="${schemeKey}" data-which="strokeColor"
                value="${adv.strokeColor || '#ffffff'}" ${dis}>
              <input type="text" class="color-hex fav-sc-hex" data-scheme="${schemeKey}" data-which="strokeColor"
                value="${adv.strokeColor || ''}" maxlength="7" placeholder="#ffffff" ${dis}>
            </div>
          </div>
        </div>
        <div class="fav-section">
          <label class="fav-section-head">
            <input type="checkbox" class="fav-chk" data-scheme="${schemeKey}" data-field="shadowEnabled" ${adv.shadowEnabled ? 'checked' : ''} ${dis}>
            <span>Shadow</span>
          </label>
          <div class="fav-section-body ${adv.shadowEnabled ? '' : 'fav-section-off'}">
            <div class="fav-inline-row">
              <span class="fav-num-lbl">Opacity</span>
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="shadowOpacity"
                value="${adv.shadowOpacity ?? 75}" min="0" max="100" step="1" ${dis}>
              <span class="fav-unit">%</span>
              <input type="color" class="fav-sc" data-scheme="${schemeKey}" data-which="shadowColor"
                value="${adv.shadowColor || '#000000'}" ${dis}>
              <input type="text" class="color-hex fav-sc-hex" data-scheme="${schemeKey}" data-which="shadowColor"
                value="${adv.shadowColor || ''}" maxlength="7" placeholder="#000000" ${dis}>
            </div>
            <div class="fav-inline-row">
              <span class="fav-num-lbl">Angle</span>
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="shadowAngle"
                value="${adv.shadowAngle ?? 315}" min="0" max="360" step="1" ${dis}>
              <span class="fav-unit">°</span>
              <span class="fav-num-lbl" style="margin-left:6px">Offset</span>
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="shadowOffset"
                value="${adv.shadowOffset ?? 5}" min="0" step="0.5" ${dis}>
              <span class="fav-num-lbl" style="margin-left:6px">Blur</span>
              <input type="number" class="fav-num" data-scheme="${schemeKey}" data-field="shadowBlur"
                value="${adv.shadowBlur ?? 5}" min="0" step="0.5" ${dis}>
            </div>
          </div>
        </div>
      </div>
    </details>
  `;
}

// Compact layout table for the Advanced section
function lyTable(rows, scheme, dis) {
  const inp = (f, step = '0.01') => f
    ? `<input type="number" class="layout-num" id="ly-${f}" value="${scheme[f] ?? ''}" step="${step}" ${dis}>`
    : `<span class="ly-dash">—</span>`;

  // Track whether we're in the prop canvas section
  let inProp = false;

  const bodyRows = rows.map(row => {
    if (row.type === 'head') {
      if (row.label === 'Prop Canvas') inProp = true;
      return `<tr class="ly-section-head"><td colspan="6">${esc(row.label)}</td></tr>`;
    }
    const [c0, c1, c2, c3] = row.cols;

    const yDimmed = row.autoY && scheme[row.autoY.field];
    const yTd = `<td${yDimmed ? ' class="ly-y-dimmed"' : ''}>${inp(c1)}</td>`;

    let extraCells = row.extra
      ? row.extra.map(([lbl, f]) =>
          `<td class="ly-extra-cell"><span class="ly-extra-lbl">${lbl}</span>${inp(f, '0.5')}</td>`
        ).join('')
      : '';

    if (row.autoY) {
      const { field, gapField } = row.autoY;
      const checked = scheme[field] ? 'checked' : '';
      extraCells += `
        <td class="ly-extra-cell ly-auto-y-cell">
          <label class="ly-auto-y-chk-lbl">
            <input type="checkbox" class="ly-auto-y-chk" id="ly-${field}" ${checked} ${dis}>
            Auto Y
          </label>
        </td>
        <td class="ly-extra-cell">
          <span class="ly-extra-lbl">Gap</span>
          <input type="number" class="layout-num" id="ly-${gapField}" value="${scheme[gapField] ?? 16}" step="1" ${dis}>
        </td>`;
    }

    // Alignment buttons — only for rows that have both X/Y and W/H fields
    const hasX = c0 && c0 !== '—';
    const hasY = c1 && c1 !== '—';
    const hasW = c2 && c2 !== '—';
    const hasH = c3 && c3 !== '—';
    const canAlign = (hasX || hasY) && !dis;
    const prop = inProp;

    // Compute which alignment is currently active (within 0.5px tolerance)
    const near = (a, b) => Math.abs((a ?? NaN) - b) < 0.6;
    const cW = prop ? (scheme.propCanvasW ?? 3200) : (scheme.canvasW ?? 1920);
    const cH = prop ? (scheme.propCanvasH ?? 1280) : (scheme.canvasH ?? 1080);
    const curX = scheme[c0] ?? null, curW = scheme[c2] ?? null;
    const curY = scheme[c1] ?? null, curH = scheme[c3] ?? null;
    const hActive = new Set();
    if (hasX && hasW && curX !== null && curW !== null) {
      if (near(curX, (cW - curW) / 2)) hActive.add('h-center');
      else if (near(curX, 0))           hActive.add('h-left');
      else if (near(curX, cW - curW))   hActive.add('h-right');
    }
    const vActive = new Set();
    if (hasY && hasH && curY !== null && curH !== null) {
      if (near(curY, (cH - curH) / 2)) vActive.add('v-middle');
      else if (near(curY, 0))           vActive.add('v-top');
      else if (near(curY, cH - curH))   vActive.add('v-bottom');
    }
    const ab = (align) => `class="ly-align-btn${hActive.has(align) || vActive.has(align) ? ' active' : ''}"`;

    const alignBtns = canAlign ? `
      <td class="ly-align-cell">
        <div class="ly-align-group">
          ${hasX && hasW ? `
            <button ${ab('h-left')}  data-align="h-left"  data-xf="${c0}" data-wf="${c2}" data-prop="${prop}" title="Align left">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="1.5" height="10" fill="currentColor" rx=".5"/><rect x="3" y="3" width="7" height="2.5" fill="currentColor" rx=".5"/><rect x="3" y="6.5" width="5" height="2.5" fill="currentColor" rx=".5"/></svg>
            </button>
            <button ${ab('h-center')} data-align="h-center" data-xf="${c0}" data-wf="${c2}" data-prop="${prop}" title="Center horizontally">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="5.25" y="1" width="1.5" height="10" fill="currentColor" rx=".5"/><rect x="2" y="3" width="8" height="2.5" fill="currentColor" rx=".5"/><rect x="3" y="6.5" width="6" height="2.5" fill="currentColor" rx=".5"/></svg>
            </button>
            <button ${ab('h-right')}  data-align="h-right"  data-xf="${c0}" data-wf="${c2}" data-prop="${prop}" title="Align right">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="9.5" y="1" width="1.5" height="10" fill="currentColor" rx=".5"/><rect x="2" y="3" width="7" height="2.5" fill="currentColor" rx=".5"/><rect x="4" y="6.5" width="5" height="2.5" fill="currentColor" rx=".5"/></svg>
            </button>
          ` : '<button class="ly-align-btn" style="visibility:hidden"></button><button class="ly-align-btn" style="visibility:hidden"></button><button class="ly-align-btn" style="visibility:hidden"></button>'}
          ${hasY && hasH ? `
            <button ${ab('v-top')}    data-align="v-top"    data-yf="${c1}" data-hf="${c3}" data-prop="${prop}" title="Align top">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="1" width="10" height="1.5" fill="currentColor" rx=".5"/><rect x="3" y="3" width="2.5" height="7" fill="currentColor" rx=".5"/><rect x="6.5" y="3" width="2.5" height="5" fill="currentColor" rx=".5"/></svg>
            </button>
            <button ${ab('v-middle')}  data-align="v-middle"  data-yf="${c1}" data-hf="${c3}" data-prop="${prop}" title="Center vertically">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="5.25" width="10" height="1.5" fill="currentColor" rx=".5"/><rect x="3" y="2" width="2.5" height="8" fill="currentColor" rx=".5"/><rect x="6.5" y="3" width="2.5" height="6" fill="currentColor" rx=".5"/></svg>
            </button>
            <button ${ab('v-bottom')}  data-align="v-bottom"  data-yf="${c1}" data-hf="${c3}" data-prop="${prop}" title="Align bottom">
              <svg width="12" height="12" viewBox="0 0 12 12"><rect x="1" y="9.5" width="10" height="1.5" fill="currentColor" rx=".5"/><rect x="3" y="2" width="2.5" height="7" fill="currentColor" rx=".5"/><rect x="6.5" y="4" width="2.5" height="5" fill="currentColor" rx=".5"/></svg>
            </button>
          ` : '<button class="ly-align-btn" style="visibility:hidden"></button><button class="ly-align-btn" style="visibility:hidden"></button><button class="ly-align-btn" style="visibility:hidden"></button>'}
        </div>
      </td>` : '<td></td>';

    return `<tr${row.region ? ` data-region="${row.region}"` : ''}>
      <td class="ly-row-name${row.region ? ' ly-row-name-click' : ''}">${esc(row.label)}</td>
      <td>${inp(c0)}</td>
      ${yTd}
      <td>${inp(c2)}</td>
      <td>${inp(c3)}</td>
      ${alignBtns}
      ${extraCells}
    </tr>`;
  }).join('');

  return `<table class="ly-table">
    <thead><tr>
      <th></th><th>X</th><th>Y</th><th>W</th><th>H</th><th></th>
    </tr></thead>
    <tbody>${bodyRows}</tbody>
  </table>`;
}

function refreshAlignBtns(panel, scheme) {
  const near = (a, b) => Math.abs((a ?? NaN) - b) < 0.6;
  panel.querySelectorAll('.ly-align-btn[data-align]').forEach(btn => {
    const align  = btn.dataset.align;
    const isProp = btn.dataset.prop === 'true';
    const cW = isProp ? (scheme.propCanvasW ?? 3200) : (scheme.canvasW ?? 1920);
    const cH = isProp ? (scheme.propCanvasH ?? 1280) : (scheme.canvasH ?? 1080);
    let active = false;
    if (align === 'h-center') {
      const x = scheme[btn.dataset.xf] ?? null, w = scheme[btn.dataset.wf] ?? null;
      if (x !== null && w !== null) active = near(x, (cW - w) / 2);
    } else if (align === 'h-left') {
      const x = scheme[btn.dataset.xf] ?? null, w = scheme[btn.dataset.wf] ?? null;
      if (x !== null && w !== null) active = near(x, 0) && !near(x, (cW - w) / 2);
    } else if (align === 'h-right') {
      const x = scheme[btn.dataset.xf] ?? null, w = scheme[btn.dataset.wf] ?? null;
      if (x !== null && w !== null) active = near(x, cW - w) && !near(x, (cW - w) / 2);
    } else if (align === 'v-middle') {
      const y = scheme[btn.dataset.yf] ?? null, h = scheme[btn.dataset.hf] ?? null;
      if (y !== null && h !== null) active = near(y, (cH - h) / 2);
    } else if (align === 'v-top') {
      const y = scheme[btn.dataset.yf] ?? null, h = scheme[btn.dataset.hf] ?? null;
      if (y !== null && h !== null) active = near(y, 0) && !near(y, (cH - h) / 2);
    } else if (align === 'v-bottom') {
      const y = scheme[btn.dataset.yf] ?? null, h = scheme[btn.dataset.hf] ?? null;
      if (y !== null && h !== null) active = near(y, cH - h) && !near(y, (cH - h) / 2);
    }
    btn.classList.toggle('active', active);
  });
}

// ── Text-tab building blocks ────────────────────────────────────────────────
// Renders the Font / Weight / Size / Color quick-controls for one text role.
// Element IDs/classes match the originals so existing change handlers bind.
function fontControl({ advKey, field, sizeField = null, propSizeField = null, scheme, dis }) {
  const val = scheme[field] || '';
  const { family: curFam } = parseFontPS(val);
  const families = _fontFamilyMap ? Object.keys(_fontFamilyMap).sort((a, b) => a.localeCompare(b)) : [];
  const famOptions = families.length
    ? families.map(f => `<option value="${esc(f)}" ${f === curFam ? 'selected' : ''}>${esc(f)}</option>`).join('')
    : `<option value="${esc(curFam)}">${esc(curFam || '…')}</option>`;
  const stylesForFam = _fontFamilyMap?.[curFam] || (val ? [{ style: parseFontPS(val).style, postscript: val }] : []);
  const styOptions = stylesForFam.map(({ style, postscript }) =>
    `<option value="${esc(postscript)}" ${postscript === val ? 'selected' : ''}>${esc(style)}</option>`
  ).join('') || `<option value="${esc(val)}">${esc(parseFontPS(val).style)}</option>`;
  const sizeBox = (f) => f
    ? `<span class="tsc-size-box"><input type="number" class="sz-input sf-size" id="ss-${f}" value="${scheme[f] ?? 44}" min="1" max="400" step="1" ${dis}><span class="sf-unit">pt</span></span>`
    : '';
  const curAdv = scheme[advKey] || FONT_ADV_DEFAULTS();
  const sizeRow = (sizeField || propSizeField)
    ? `<label class="tsc-row"><span class="tsc-lbl">Size</span>
         <span class="tsc-size-row">${sizeBox(sizeField)}${propSizeField ? `<span class="tsc-size-sep" title="LED-wall size">wall</span>${sizeBox(propSizeField)}` : ''}</span></label>`
    : '';
  return `
    <label class="tsc-row"><span class="tsc-lbl">Font</span>
      <select class="sf-fam-select" id="sf-fam-${field}" ${dis}>${famOptions}</select></label>
    <label class="tsc-row"><span class="tsc-lbl">Weight</span>
      <select class="sf-sty-select" id="sf-sty-${field}" ${dis}>${styOptions}</select></label>
    ${sizeRow}
    <label class="tsc-row"><span class="tsc-lbl">Color</span>
      <span class="color-input-wrap font-color-inline">
        <input type="color" class="fav-color" data-scheme="${advKey}" value="${curAdv.color || '#ffffff'}" ${dis}>
        <input type="text" class="color-hex fav-color-hex" data-scheme="${advKey}" value="${curAdv.color || ''}" maxlength="7" placeholder="Default" ${dis}>
        <button class="fav-color-clear" data-scheme="${advKey}" title="Reset to default color" ${dis}>×</button>
      </span></label>`;
}

// Static visual preview of the active scheme (Phase 1 — wired to scheme values, not full render).
function schemePreviewPanel(scheme) {
  const fam = (ps) => `"${esc(parseFontPS(ps || '').family || ps || 'sans-serif')}", sans-serif`;
  const bodyColor  = (scheme.bodyFontAdv && scheme.bodyFontAdv.color) || '#ffffff';
  // Reference bar is scheme-driven: no background fill, text colour from titleFontAdv (default white)
  const titleText  = (scheme.titleFontAdv && scheme.titleFontAdv.color) || '#ffffff';
  const seColor    = (scheme.startEndFontAdv && scheme.startEndFontAdv.color) || '#ffffff';
  // Scale 1080-tall canvas down to a ~200px-tall preview
  const sc = 200 / (scheme.canvasH || 1080);
  const px = (pt) => Math.max(8, Math.round((pt || 44) * sc * 2));
  return `
    <div class="sp-grid">
      <div class="sp-card">
        <div class="sp-card-hd">Main Screen — Scripture</div>
        <div class="sp-screen sp-16x9">
          <div class="sp-grad"></div>
          <div class="sp-refbar" style="background:transparent;color:${esc(titleText)};font-family:${fam(scheme.titleFont)};font-size:${px(scheme.titleSize)}px">JOHN 3:16</div>
          <div class="sp-body" style="font-family:${fam(scheme.bodyFont)};color:${esc(bodyColor)};font-size:${px(scheme.bodySize)}px">For God so loved the world…</div>
        </div>
      </div>
      <div class="sp-card">
        <div class="sp-card-hd">Main Screen — Point</div>
        <div class="sp-screen sp-16x9">
          <div class="sp-grad"></div>
          <div class="sp-body sp-point" style="font-family:${fam(scheme.pointFont || scheme.boldFont)};color:${esc(bodyColor)};font-size:${px(scheme.bodySize)}px">LOVE ONE ANOTHER</div>
        </div>
      </div>
      <div class="sp-card">
        <div class="sp-card-hd">Prop / LED Wall</div>
        <div class="sp-screen sp-wall">
          <div class="sp-body sp-wall-body" style="font-family:${fam(scheme.propBodyFont)};font-size:${px(scheme.propBodySize)}px">For God so loved the world…</div>
        </div>
      </div>
      <div class="sp-card">
        <div class="sp-card-hd">Start / End</div>
        <div class="sp-screen sp-16x9">
          <div class="sp-se" style="font-family:${fam(scheme.startEndFont)};color:${esc(seColor)};font-size:${px(scheme.startEndSize)}px">MESSAGE TITLE</div>
        </div>
      </div>
      <div class="sp-card sp-card-wide">
        <div class="sp-card-hd">Slide Notes — Confidence Monitor</div>
        <div class="sp-notes" style="font-family:${fam(scheme.notesFont)}">Speaker note preview — only visible on the confidence monitor.</div>
      </div>
    </div>
    <p class="sp-foot">Approximate preview from this scheme's fonts, sizes and colours. Use <strong>Test Scheme</strong> (top right) to generate a real deck in ProPresenter.</p>`;
}

// Visual Layout preview — scaled Main + Prop canvases with clickable region boxes
// linked to the layout table rows. (Phase 2; drag/resize is deferred — Phase 3.)
function layoutPreview(scheme, sel) {
  const mainW = scheme.canvasW || 1920, mainH = scheme.canvasH || 1080;
  const propW = scheme.propCanvasW || 3200, propH = scheme.propCanvasH || 1280;
  // [slug, label, x, y, w, h] — drawn back-to-front so small boxes sit on top
  const mainRegions = [
    ['gradient',  'Gradient',     scheme.gradientX ?? 0, scheme.gradientY ?? 0, scheme.canvasW ?? 1920, scheme.gradientH ?? 0],
    ['queue',     'Queue',        scheme.queueX ?? 0,    scheme.queueY ?? 0,    scheme.queueW ?? 0,     scheme.queueH ?? 0],
    ['body',      'Body',         scheme.bodyX ?? 0,     scheme.bodyY ?? 0,     scheme.bodyW ?? 0,      scheme.bodyH ?? 0],
    ['header',    'Header',       scheme.titleX ?? 0,    scheme.titleY ?? 0,    scheme.titleW ?? 0,     scheme.titleH ?? 0],
    ['startEnd',  'Start / End',  scheme.startEndX ?? 0, scheme.startEndY ?? 0, scheme.startEndW ?? 0,  scheme.startEndH ?? 0],
    ['live',      'Live',         scheme.liveX ?? 0,     scheme.liveY ?? 0,     scheme.liveW ?? 0,      scheme.liveH ?? 0],
  ];
  const propRegions = [
    ['propBody',   'Prop body',   scheme.propBodyX ?? 0, scheme.propBodyY ?? 0, scheme.propBodyW ?? 0,  scheme.propBodyH ?? 0],
    ['propHeader', 'Prop header', scheme.propTitleX ?? 0, scheme.propTitleY ?? 0, scheme.propTitleW ?? 0, scheme.propTitleH ?? 0],
  ];
  const box = (cw, ch) => ([slug, lbl, x, y, w, h]) => {
    if (!w || !h) return '';
    const pct = (v, d) => (v / d) * 100;
    return `<div class="lp-region lp-region-${slug}${sel === slug ? ' sel' : ''}" data-region="${slug}"
      style="left:${pct(x, cw).toFixed(2)}%;top:${pct(y, ch).toFixed(2)}%;width:${pct(w, cw).toFixed(2)}%;height:${pct(h, ch).toFixed(2)}%"
      title="${esc(lbl)}"><span class="lp-region-lbl">${esc(lbl)}</span></div>`;
  };
  return `
    <div class="lp-wrap">
      <div class="lp-canvas-block">
        <div class="lp-canvas-lbl">Main Canvas · ${Math.round(mainW)}×${Math.round(mainH)}</div>
        <div class="lp-canvas" style="aspect-ratio:${mainW} / ${mainH}">${mainRegions.map(box(mainW, mainH)).join('')}</div>
      </div>
      <div class="lp-canvas-block">
        <div class="lp-canvas-lbl">Prop / LED Wall · ${Math.round(propW)}×${Math.round(propH)}</div>
        <div class="lp-canvas" style="aspect-ratio:${propW} / ${propH}">${propRegions.map(box(propW, propH)).join('')}</div>
      </div>
    </div>
    <p class="style-group-hint" style="margin-top:8px">Click a region to highlight its row below. Boxes are drawn from this scheme's positions; off-canvas elements (e.g. Live) may sit outside the frame.</p>`;
}

function renderStylePanel(panel) {
  if (!state.styleSchemes || !state.styleSchemes.length) {
    state.styleSchemes  = [DEFAULT_STYLE_SCHEME()];
    state.activeSchemeId = 'default';
  }
  const scheme = state.styleSchemes.find(p => p.id === state.activeSchemeId) || state.styleSchemes[0];
  if (!['text', 'layout', 'motion', 'preview'].includes(_styleTab)) _styleTab = 'text';
  const locked = !!scheme.isLocked;
  const dis    = locked ? 'disabled' : '';
  const schemeOptions = state.styleSchemes.map(p =>
    `<option value="${esc(p.id)}" ${p.id === state.activeSchemeId ? 'selected' : ''}>${esc(p.name)}</option>`
  ).join('');

  const FONT_EXTRA_COLORS = {
    bodyFontAdv:  [{ label: 'Fill',   field: 'bodyFill'    }],
  };
  // Plain-language explanations of each font slot (technical term kept in the label,
  // explanation surfaced on hover via a ? badge). Keyed by font field.
  const FONT_TIPS = {
    bodyFont:      'Scripture & body text on the main projection screens.',
    propBodyFont:  'Scripture body text on the LED wall behind the stage (the "prop"), separate from the main screens.',
    pointFont:     'Point slides — the main point text on the projection screens.',
    propPointFont: 'Point slides — the point text on the LED wall behind the stage (the "prop").',
    boldFont:      'Bold (emphasised) words inside body text on the main screens.',
    propBoldFont:  'Bold (emphasised) words inside body text on the LED wall.',
    titleFont:    'The scripture reference bar — e.g. "John 3:16".',
    startEndFont: 'The Start and End title slides.',
    notesFont:    'Speaker notes shown only on the confidence monitor, not to the room.',
  };

  panel.innerHTML = `
    <div class="slide-form">
      <h2>
        Schemes
      </h2>
      <p class="scheme-intro">
        A scheme controls how every slide looks — fonts, sizes, colours, animations and positions.
        Pick one to use it, or duplicate it to make your own.
      </p>

      <div class="scheme-toolbar">
        <select id="style-scheme-select" class="scheme-tb-select" title="Active scheme">${schemeOptions}</select>
        <input type="text" id="style-scheme-name" class="scheme-tb-name" value="${esc(scheme.name)}" placeholder="Scheme name" ${dis}>
        <div class="scheme-tb-icons">
          <button class="btn-scheme-icon" id="btn-scheme-new" title="New scheme">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-scheme-icon" id="btn-scheme-dupe" title="Duplicate scheme">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="4.5" y="1" width="7.5" height="8.5" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M1 4v6.5A1.5 1.5 0 0 0 2.5 12H9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
          </button>
          <button class="btn-scheme-icon btn-scheme-icon-danger" id="btn-scheme-delete" title="Delete scheme"
            ${scheme.isDefault || state.styleSchemes.length <= 1 ? 'disabled' : ''}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2h3v1.5M4 3.5l.5 7h4l.5-7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="btn-scheme-lock ${locked ? 'locked' : 'unlocked'}" id="btn-scheme-lock"
            title="${locked ? 'Unlock to edit' : 'Lock scheme'}">${locked ? '🔒' : '🔓'}</button>
        </div>
        <div class="scheme-tb-actions">
          <button class="btn-scheme-test" id="btn-scheme-import" title="Build a scheme from a presentation you styled in Pro7">Import from Pro7</button>
          <button class="btn-scheme-test btn-scheme-test-primary" id="btn-scheme-test">Test Scheme</button>
        </div>
      </div>

      ${locked ? `
      <div class="scheme-lock-banner">
        <span class="slb-icon">🔒</span>
        <div class="slb-text">
          <strong>This scheme is locked</strong>
          <span>Locked so it can't be changed by accident. Duplicate it to make your own editable copy, or unlock to edit this one directly.</span>
        </div>
        <div class="slb-actions">
          <button class="btn-sm" id="btn-lock-duplicate">Duplicate</button>
          <button class="btn-sm" id="btn-lock-unlock">Unlock</button>
        </div>
      </div>` : ''}

      <fieldset class="scheme-fields ${locked ? 'scheme-locked' : ''}" ${locked ? 'disabled' : ''}>

      <div class="style-tabs">
        ${[['text','Text'],['layout','Layout'],['motion','Motion'],['preview','Preview']].map(([t, lbl]) => `
          <button class="style-tab${_styleTab === t ? ' active' : ''}" data-tab="${t}">${lbl}</button>`).join('')}
      </div>

      <!-- TEXT tab — compact style cards -->
      <div class="style-tab-body" id="style-tab-text" ${_styleTab !== 'text' ? 'style="display:none"' : ''}>
        <div class="style-fill-toggle-row ${locked ? 'disabled' : ''}" id="fill-toggle-row">
          <div class="toggle ${scheme.fillEnabled ? 'on' : ''}" id="fill-toggle"></div>
          <label>Show element fills</label>
        </div>

        <div class="tcard">
          <div class="tcard-hd">Body <span class="lbl-tip" title="${esc(FONT_TIPS.bodyFont)}">?</span></div>
          <div class="tcard-cols tcard-2">
            <div class="tcard-col"><div class="tcard-col-hd">Main Screen</div>
              ${fontControl({ advKey: 'bodyFontAdv', field: 'bodyFont', sizeField: 'bodySize', scheme, dis })}</div>
            <div class="tcard-col"><div class="tcard-col-hd">Prop / LED Wall</div>
              ${fontControl({ advKey: 'propBodyFontAdv', field: 'propBodyFont', sizeField: 'propBodySize', scheme, dis })}</div>
          </div>
          ${fontAdvPanel('bodyFontAdv', 'Body — main screen', scheme, locked, FONT_EXTRA_COLORS.bodyFontAdv || [])}
          ${fontAdvPanel('propBodyFontAdv', 'Body — prop / LED wall', scheme, locked, [])}
        </div>

        <div class="tcard">
          <div class="tcard-hd">Point <span class="lbl-tip" title="${esc(FONT_TIPS.pointFont)}">?</span></div>
          <div class="tcard-cols tcard-2">
            <div class="tcard-col"><div class="tcard-col-hd">Main Screen</div>
              ${fontControl({ advKey: 'pointFontAdv', field: 'pointFont', scheme, dis })}</div>
            <div class="tcard-col"><div class="tcard-col-hd">Prop / LED Wall</div>
              ${fontControl({ advKey: 'propPointFontAdv', field: 'propPointFont', scheme, dis })}</div>
          </div>
          ${fontAdvPanel('pointFontAdv', 'Point — main screen', scheme, locked, [])}
          ${fontAdvPanel('propPointFontAdv', 'Point — prop / LED wall', scheme, locked, [])}
        </div>

        <div class="tcard">
          <div class="tcard-hd">Bold in Body <span class="lbl-tip" title="${esc(FONT_TIPS.boldFont)}">?</span></div>
          <div class="tcard-cols tcard-2">
            <div class="tcard-col"><div class="tcard-col-hd">Main Screen</div>
              ${fontControl({ advKey: 'boldFontAdv', field: 'boldFont', scheme, dis })}</div>
            <div class="tcard-col"><div class="tcard-col-hd">Prop / LED Wall</div>
              ${fontControl({ advKey: 'propBoldFontAdv', field: 'propBoldFont', scheme, dis })}</div>
          </div>
          ${fontAdvPanel('boldFontAdv', 'Bold in body — main screen', scheme, locked, [])}
          ${fontAdvPanel('propBoldFontAdv', 'Bold in body — prop / LED wall', scheme, locked, [])}
        </div>

        <div class="tcard">
          <div class="tcard-hd">Reference Bar <span class="lbl-tip" title="${esc(FONT_TIPS.titleFont)}">?</span></div>
          <div class="tcard-cols tcard-1">
            <div class="tcard-col">
              ${fontControl({ advKey: 'titleFontAdv', field: 'titleFont', sizeField: 'titleSize', propSizeField: 'propTitleSize', scheme, dis })}
            </div>
          </div>
          ${fontAdvPanel('titleFontAdv', 'Reference bar', scheme, locked, [])}
        </div>

        <div class="tcard">
          <div class="tcard-hd">Start / End <span class="lbl-tip" title="${esc(FONT_TIPS.startEndFont)}">?</span></div>
          <div class="tcard-cols tcard-1">
            <div class="tcard-col">${fontControl({ advKey: 'startEndFontAdv', field: 'startEndFont', sizeField: 'startEndSize', scheme, dis })}</div>
          </div>
          ${fontAdvPanel('startEndFontAdv', 'Start / End', scheme, locked, [])}
        </div>

        <div class="tcard">
          <div class="tcard-hd">Slide Notes / Confidence Monitor <span class="lbl-tip" title="${esc(FONT_TIPS.notesFont)}">?</span></div>
          <div class="tcard-cols tcard-1">
            <div class="tcard-col">${fontControl({ advKey: 'notesFontAdv', field: 'notesFont', sizeField: 'notesSize', scheme, dis })}</div>
          </div>
          ${fontAdvPanel('notesFontAdv', 'Slide notes', scheme, locked, [])}
        </div>
      </div>

      <!-- MOTION tab — Transitions + Build Order -->
      <div class="style-tab-body" id="style-tab-motion" ${_styleTab !== 'motion' ? 'style="display:none"' : ''}>
        <div class="motion-subtabs">
          ${[['transitions', 'Transitions'], ['build', 'Build Order']].map(([t, lbl]) =>
            `<button class="motion-subtab${_motionTab === t ? ' active' : ''}" data-mtab="${t}">${lbl}</button>`).join('')}
        </div>

        <div class="motion-sub" id="motion-sub-transitions" ${_motionTab !== 'transitions' ? 'style="display:none"' : ''}>
          <div class="trans-cols">
            <div class="trans-col">
              <div class="trans-col-title">Slide</div>
              <div class="segmented-control trans-seg" id="adv-trans-seg">
                <button data-val="fade"     class="${(scheme.transitionType || 'fade') === 'fade'     ? 'active' : ''}" ${dis}>Fade</button>
                <button data-val="dissolve" class="${(scheme.transitionType || 'fade') === 'dissolve' ? 'active' : ''}" ${dis}>Dissolve</button>
                <button data-val="cut"      class="${(scheme.transitionType || 'fade') === 'cut'      ? 'active' : ''}" ${dis}>Cut</button>
              </div>
              <div class="trans-dur-wrap" id="adv-dur-field" style="${(scheme.transitionType || 'fade') === 'cut' ? 'display:none' : ''}">
                <input type="number" id="adv-trans-dur" value="${scheme.transitionDuration ?? 0.6}" min="0.1" max="5" step="0.1" class="trans-dur" ${dis}>
                <span class="fav-unit">s</span>
              </div>
            </div>
            <div class="trans-col">
              <div class="trans-col-title">Prop</div>
              <div class="segmented-control trans-seg" id="adv-prop-trans-seg">
                <button data-val="fade"     class="${(scheme.propTransitionType || 'fade') === 'fade'     ? 'active' : ''}" ${dis}>Fade</button>
                <button data-val="dissolve" class="${(scheme.propTransitionType || 'fade') === 'dissolve' ? 'active' : ''}" ${dis}>Dissolve</button>
                <button data-val="cut"      class="${(scheme.propTransitionType || 'fade') === 'cut'      ? 'active' : ''}" ${dis}>Cut</button>
              </div>
              <div class="trans-dur-wrap" id="adv-prop-dur-field" style="${(scheme.propTransitionType || 'fade') === 'cut' ? 'display:none' : ''}">
                <input type="number" id="adv-prop-trans-dur" value="${scheme.propTransitionDuration ?? 0.6}" min="0.1" max="5" step="0.1" class="trans-dur" ${dis}>
                <span class="fav-unit">s</span>
              </div>
            </div>
          </div>
        </div>

        <div class="motion-sub" id="motion-sub-build" ${_motionTab !== 'build' ? 'style="display:none"' : ''}>
          <p class="style-group-hint">Advanced — controls how each element animates in and out, per slide type.</p>
          <div class="bo-tabs" id="bo-tabs">
            ${[['content','Content'],['point','Point'],['blank','Blank'],['startEnd','Start/End']].map(([tab, lbl]) =>
              `<button class="bo-tab${_boActiveTab === tab ? ' active' : ''}" data-tab="${tab}">${lbl}</button>`
            ).join('')}
          </div>
          <div id="bo-table-wrap">
            ${renderBuildTable(_boActiveTab, scheme, locked)}
          </div>
        </div>
      </div>

      <!-- PREVIEW tab -->
      <div class="style-tab-body" id="style-tab-preview" ${_styleTab !== 'preview' ? 'style="display:none"' : ''}>
        ${schemePreviewPanel(scheme)}
      </div>

      <!-- LAYOUT tab -->
      <div class="style-tab-body" id="style-tab-layout" ${_styleTab !== 'layout' ? 'style="display:none"' : ''}>
        ${layoutPreview(scheme, _layoutSel)}
        <p class="style-group-hint">X/Y/W/H in pixels; use the align buttons for quick centering.</p>
        ${lyTable([
          { label: 'Main Canvas',  type: 'head' },
          { label: 'Canvas',       cols: ['—','—','canvasW','canvasH'] },
          { label: 'Body',         cols: ['bodyX','bodyY','bodyW','bodyH'], region: 'body' },
          { label: 'Header',       cols: ['titleX','titleY','titleW','titleH'], autoY: { field: 'autoTitleY', gapField: 'titleAutoGap' }, region: 'header' },
          { label: 'Start / End',  cols: ['startEndX','startEndY','startEndW','startEndH'], region: 'startEnd' },
          { label: 'Gradient',     cols: ['gradientX','gradientY',null,'gradientH'], region: 'gradient' },
          { label: 'Live',         cols: ['liveX','liveY','liveW','liveH'], region: 'live' },
          { label: 'Queue',        cols: ['queueX','queueY','queueW','queueH'], region: 'queue' },
          { label: 'Prop Canvas',  type: 'head' },
          { label: 'Canvas',       cols: [null,null,'propCanvasW','propCanvasH'] },
          { label: 'Prop body',    cols: ['propBodyX','propBodyY','propBodyW','propBodyH'], region: 'propBody' },
          { label: 'Prop header',  cols: ['propTitleX','propTitleY','propTitleW','propTitleH'], autoY: { field: 'propAutoTitleY', gapField: 'propTitleAutoGap' }, region: 'propHeader' },
        ], scheme, dis)}
      </div>

      </fieldset>
    </div>
  `;

  // Top-level tabs: Text / Layout / Motion / Preview
  panel.querySelectorAll('.style-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _styleTab = btn.dataset.tab;
      panel.querySelectorAll('.style-tab').forEach(b => b.classList.toggle('active', b.dataset.tab === _styleTab));
      panel.querySelectorAll('.style-tab-body').forEach(body => {
        body.style.display = body.id === `style-tab-${_styleTab}` ? '' : 'none';
      });
    });
  });

  // Motion sub-tabs: Transitions / Build Order
  panel.querySelectorAll('.motion-subtab').forEach(btn => {
    btn.addEventListener('click', () => {
      _motionTab = btn.dataset.mtab;
      panel.querySelectorAll('.motion-subtab').forEach(b => b.classList.toggle('active', b.dataset.mtab === _motionTab));
      panel.querySelectorAll('.motion-sub').forEach(sub => {
        sub.style.display = sub.id === `motion-sub-${_motionTab}` ? '' : 'none';
      });
    });
  });

  // Layout visual preview ↔ table row linking (works whether or not the scheme is locked)
  const applyRegionSel = (slug, scroll) => {
    panel.querySelectorAll('.lp-region').forEach(b => b.classList.toggle('sel', b.dataset.region === slug));
    panel.querySelectorAll('.ly-table tbody tr[data-region]').forEach(tr => {
      const on = tr.dataset.region === slug;
      tr.classList.toggle('ly-row-selected', on);
      if (on && scroll) tr.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  };
  const selectRegion = (slug) => { _layoutSel = slug; applyRegionSel(slug, true); };
  panel.querySelectorAll('.lp-region').forEach(b => b.addEventListener('click', () => selectRegion(b.dataset.region)));
  panel.querySelectorAll('.ly-row-name-click').forEach(c => c.addEventListener('click', () => {
    const tr = c.closest('tr'); if (tr?.dataset.region) selectRegion(tr.dataset.region);
  }));
  if (_layoutSel) applyRegionSel(_layoutSel, false);

  // Locked-scheme banner actions
  document.getElementById('btn-lock-unlock')?.addEventListener('click', () => {
    const s = getScheme(); if (!s) return;
    s.isLocked = false;
    saveState(); renderStylePanel(panel);
  });
  document.getElementById('btn-lock-duplicate')?.addEventListener('click', () => {
    document.getElementById('btn-scheme-dupe')?.click();
  });

  const getScheme = () => state.styleSchemes.find(x => x.id === state.activeSchemeId);

  // Build order tabs + table handlers
  attachBuildOrderHandlers(getScheme, panel, locked);

  // Scheme select / new / dupe / delete
  document.getElementById('style-scheme-select').addEventListener('change', e => {
    state.activeSchemeId = e.target.value;
    saveState(); syncStyleButton(); renderStylePanel(panel);
  });
  document.getElementById('btn-scheme-new').addEventListener('click', () => {
    const base = state.styleSchemes.find(s => s.isDefault) || DEFAULT_STYLE_SCHEME();
    const p = { ...base, id: 'scheme_' + Date.now(), name: 'New Scheme', isDefault: false, isLocked: false };
    state.styleSchemes.push(p); state.activeSchemeId = p.id;
    saveState(); syncStyleButton(); renderStylePanel(panel);
  });
  document.getElementById('btn-scheme-dupe').addEventListener('click', () => {
    const src = getScheme() || state.styleSchemes[0];
    const d   = { ...src, id: 'scheme_' + Date.now(), name: src.name + ' Copy', isDefault: false, isLocked: false };
    state.styleSchemes.push(d); state.activeSchemeId = d.id;
    saveState(); syncStyleButton(); renderStylePanel(panel);
  });
  document.getElementById('btn-scheme-delete').addEventListener('click', () => {
    const s = getScheme();
    if (!s || s.isDefault || state.styleSchemes.length <= 1) return;
    state.styleSchemes  = state.styleSchemes.filter(p => p.id !== state.activeSchemeId);
    state.activeSchemeId = state.styleSchemes[0].id;
    saveState(); syncStyleButton(); renderStylePanel(panel);
  });

  // Lock / unlock
  document.getElementById('btn-scheme-lock').addEventListener('click', () => {
    const s = getScheme(); if (!s) return;
    s.isLocked = !s.isLocked;
    saveState(); renderStylePanel(panel);
  });

  // Test scheme
  document.getElementById('btn-scheme-test').addEventListener('click', () => runSchemeTest(getScheme()));

  // Import scheme from a Pro7 presentation
  document.getElementById('btn-scheme-import').addEventListener('click', () => showSchemeImport(panel));

  // Scheme name
  document.getElementById('style-scheme-name').addEventListener('input', e => {
    const s = getScheme();
    if (s) { s.name = e.target.value; saveState(); syncStyleButton(); }
  });

  if (locked) return; // no need to attach change handlers when locked

  // Fill toggle
  document.getElementById('fill-toggle-row').addEventListener('click', () => {
    const s = getScheme(); if (!s) return;
    s.fillEnabled = !s.fillEnabled;
    document.getElementById('fill-toggle').classList.toggle('on', s.fillEnabled);
    saveState();
  });

  // Color pickers
  ['bodyFill'].forEach(field => {
    const picker = document.getElementById(`sc-${field}`);
    const hexIn  = document.getElementById(`sc-${field}-hex`);
    const s = getScheme();
    if (!picker || !hexIn || !s) return;
    picker.addEventListener('input', e => { s[field] = e.target.value; hexIn.value = e.target.value; saveState(); });
    hexIn.addEventListener('input', e => {
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) { s[field] = e.target.value; picker.value = e.target.value; saveState(); }
    });
  });

  // Font selects (family + style)
  ['bodyFont', 'propBodyFont', 'pointFont', 'propPointFont', 'boldFont', 'propBoldFont', 'titleFont', 'startEndFont', 'notesFont'].forEach(field => {
    const famSel = document.getElementById(`sf-fam-${field}`);
    const stySel = document.getElementById(`sf-sty-${field}`);
    if (!famSel || !stySel) return;

    // Apply preview font to the select element itself
    const applyPreview = () => {
      const ps = stySel.value || famSel.value;
      famSel.style.fontFamily = `"${ps}", sans-serif`;
    };
    applyPreview();

    famSel.addEventListener('change', e => {
      const s = getScheme(); if (!s) return;
      const fam = e.target.value;
      const styles = _fontFamilyMap?.[fam] || [];
      stySel.innerHTML = styles.map(({ style, postscript }) =>
        `<option value="${esc(postscript)}">${esc(style)}</option>`
      ).join('') || `<option value="${esc(fam)}">${esc('Regular')}</option>`;
      s[field] = stySel.value;
      applyPreview();
      saveState();
    });

    stySel.addEventListener('change', e => {
      const s = getScheme(); if (!s) return;
      s[field] = e.target.value;
      applyPreview();
      saveState();
    });
  });

  // Size inputs
  ['bodySize', 'titleSize', 'startEndSize', 'propBodySize', 'propTitleSize', 'notesSize'].forEach(field => {
    const inp = document.getElementById(`ss-${field}`);
    if (!inp) return;
    inp.addEventListener('input', e => {
      const s = getScheme();
      if (s) { s[field] = parseInt(e.target.value, 10) || 44; saveState(); }
    });
  });

  // Transition
  document.getElementById('adv-trans-seg')?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = getScheme(); if (!s) return;
      document.getElementById('adv-trans-seg').querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      s.transitionType = btn.dataset.val;
      const durField = document.getElementById('adv-dur-field');
      if (durField) durField.style.display = btn.dataset.val === 'cut' ? 'none' : '';
      saveState();
    });
  });
  document.getElementById('adv-trans-dur')?.addEventListener('input', e => {
    const s = getScheme();
    if (s) { s.transitionDuration = parseFloat(e.target.value) || 0.6; saveState(); }
  });

  // Prop transition (global)
  document.getElementById('adv-prop-trans-seg')?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = getScheme(); if (!s) return;
      document.getElementById('adv-prop-trans-seg').querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      s.propTransitionType = btn.dataset.val;
      const durField = document.getElementById('adv-prop-dur-field');
      if (durField) durField.style.display = btn.dataset.val === 'cut' ? 'none' : '';
      saveState();
    });
  });
  document.getElementById('adv-prop-trans-dur')?.addEventListener('input', e => {
    const s = getScheme();
    if (s) { s.propTransitionDuration = parseFloat(e.target.value) || 0.6; saveState(); }
  });

  // Font advanced: numeric inputs
  document.querySelectorAll('.fav-num').forEach(inp => {
    inp.addEventListener('input', e => {
      const s = getScheme(); if (!s) return;
      const key   = inp.dataset.scheme;
      const field = inp.dataset.field;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key][field] = parseFloat(inp.value) || 0;
      saveState();
    });
  });

  // Font advanced: vertical alignment buttons
  document.querySelectorAll('.fav-vert-align').forEach(seg => {
    if (seg.dataset.disabled) return;
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = getScheme(); if (!s) return;
        const key = seg.dataset.scheme;
        seg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
        s[key].verticalAlignment = btn.dataset.val;
        saveState();
      });
    });
  });

  // Font advanced: alignment segmented control
  document.querySelectorAll('.fav-align').forEach(seg => {
    seg.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = getScheme(); if (!s) return;
        const key = seg.dataset.scheme;
        seg.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
        s[key].alignment = btn.dataset.val;
        saveState();
      });
    });
  });

  // Font advanced: italic / underline toggles
  document.querySelectorAll('.fav-toggle').forEach(lbl => {
    lbl.addEventListener('click', () => {
      const s = getScheme(); if (!s) return;
      const key   = lbl.dataset.scheme;
      const field = lbl.dataset.field;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key][field] = !s[key][field];
      lbl.classList.toggle('on', s[key][field]);
      saveState();
    });
  });

  // Font advanced: capitalization select
  document.querySelectorAll('.fav-select').forEach(sel => {
    sel.addEventListener('change', e => {
      const s = getScheme(); if (!s) return;
      const key   = sel.dataset.scheme;
      const field = sel.dataset.field;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key][field] = sel.value;
      saveState();
    });
  });

  // Font advanced: color pickers
  document.querySelectorAll('.fav-color').forEach(picker => {
    picker.addEventListener('input', e => {
      const s = getScheme(); if (!s) return;
      const key = picker.dataset.scheme;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key].color = e.target.value;
      const hexEl = picker.closest('.color-input-wrap')?.querySelector('.fav-color-hex');
      if (hexEl) hexEl.value = e.target.value;
      saveState();
    });
  });
  document.querySelectorAll('.fav-color-hex').forEach(hexIn => {
    hexIn.addEventListener('input', e => {
      const s = getScheme(); if (!s) return;
      const key = hexIn.dataset.scheme;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
        s[key].color = e.target.value;
        const picker = hexIn.closest('.color-input-wrap')?.querySelector('.fav-color');
        if (picker) picker.value = e.target.value;
        saveState();
      }
    });
  });
  document.querySelectorAll('.fav-color-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = getScheme(); if (!s) return;
      const key = btn.dataset.scheme;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key].color = '';
      const wrap = btn.closest('.color-input-wrap');
      if (wrap) {
        wrap.querySelector('.fav-color').value = '#ffffff';
        wrap.querySelector('.fav-color-hex').value = '';
      }
      saveState();
    });
  });

  // Font advanced: stroke/shadow enable checkboxes
  document.querySelectorAll('.fav-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const s = getScheme(); if (!s) return;
      const key   = chk.dataset.scheme;
      const field = chk.dataset.field;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key][field] = chk.checked;
      const body = chk.closest('.fav-section')?.querySelector('.fav-section-body');
      if (body) body.classList.toggle('fav-section-off', !chk.checked);
      saveState();
    });
  });

  // Font advanced: stroke/shadow color pickers
  document.querySelectorAll('.fav-sc').forEach(picker => {
    picker.addEventListener('input', e => {
      const s = getScheme(); if (!s) return;
      const key   = picker.dataset.scheme;
      const field = picker.dataset.which;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      s[key][field] = e.target.value;
      const hex = picker.closest('.fav-inline-row')?.querySelector('.fav-sc-hex[data-which="' + field + '"]');
      if (hex) hex.value = e.target.value;
      saveState();
    });
  });
  document.querySelectorAll('.fav-sc-hex').forEach(hexIn => {
    hexIn.addEventListener('input', e => {
      const s = getScheme(); if (!s) return;
      const key   = hexIn.dataset.scheme;
      const field = hexIn.dataset.which;
      if (!s[key]) s[key] = FONT_ADV_DEFAULTS();
      if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) {
        s[key][field] = e.target.value;
        const picker = hexIn.closest('.fav-inline-row')?.querySelector('.fav-sc[data-which="' + field + '"]');
        if (picker) picker.value = e.target.value;
        saveState();
      }
    });
  });

  // Layout numeric inputs — update value + refresh alignment button states in-place
  document.querySelectorAll('.layout-num').forEach(inp => {
    inp.addEventListener('input', () => {
      const s = getScheme(); if (!s) return;
      const field = inp.id.replace('ly-', '');
      s[field] = parseFloat(inp.value) ?? 0;
      saveState();
      refreshAlignBtns(panel, s);
    });
  });

  // Alignment buttons
  panel.querySelectorAll('.ly-align-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = getScheme(); if (!s) return;
      const isProp  = btn.dataset.prop === 'true';
      const cW = isProp ? (s.propCanvasW ?? 3200) : (s.canvasW ?? 1920);
      const cH = isProp ? (s.propCanvasH ?? 1280) : (s.canvasH ?? 1080);
      const align = btn.dataset.align;

      if (align === 'h-left') {
        const xf = btn.dataset.xf;
        s[xf] = 0;
        const el = document.getElementById(`ly-${xf}`); if (el) el.value = 0;
      } else if (align === 'h-center') {
        const xf = btn.dataset.xf, wf = btn.dataset.wf;
        const w = parseFloat(s[wf] ?? 0);
        const x = Math.round((cW - w) / 2 * 100) / 100;
        s[xf] = x;
        const el = document.getElementById(`ly-${xf}`); if (el) el.value = x;
      } else if (align === 'h-right') {
        const xf = btn.dataset.xf, wf = btn.dataset.wf;
        const w = parseFloat(s[wf] ?? 0);
        const x = Math.round((cW - w) * 100) / 100;
        s[xf] = x;
        const el = document.getElementById(`ly-${xf}`); if (el) el.value = x;
      } else if (align === 'v-top') {
        const yf = btn.dataset.yf;
        s[yf] = 0;
        const el = document.getElementById(`ly-${yf}`); if (el) el.value = 0;
      } else if (align === 'v-middle') {
        const yf = btn.dataset.yf, hf = btn.dataset.hf;
        const h = parseFloat(s[hf] ?? 0);
        const y = Math.round((cH - h) / 2 * 100) / 100;
        s[yf] = y;
        const el = document.getElementById(`ly-${yf}`); if (el) el.value = y;
      } else if (align === 'v-bottom') {
        const yf = btn.dataset.yf, hf = btn.dataset.hf;
        const h = parseFloat(s[hf] ?? 0);
        const y = Math.round((cH - h) * 100) / 100;
        s[yf] = y;
        const el = document.getElementById(`ly-${yf}`); if (el) el.value = y;
      }
      saveState();
      renderStylePanel(panel);
    });
  });

  // Auto Title Y toggles (Header + Prop header)
  panel.querySelectorAll('.ly-auto-y-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      const s = getScheme(); if (!s) return;
      const field = chk.id.replace('ly-', '');
      s[field] = chk.checked;
      saveState();
      renderStylePanel(panel);
    });
  });

}

// ─── Response Card panel ──────────────────────────────────────────────────────

function renderResponseCardPanel(panel) {
  const cfg = state.config;
  if (!cfg.responses) cfg.responses = { decisionText: '', r1: '', r2: '', r3: '' };
  const rc = cfg.responses;

  panel.innerHTML = `
    <div class="slide-form">
      <h2>
        Response Card
      </h2>

      <div class="settings-section">
        <div class="rc-toggle-row" id="rc-toggle-row">
          <div class="toggle ${cfg.includeResponseCard ? 'on' : ''}" id="rc-toggle"></div>
          <span>Include Response Card this week</span>
        </div>
      </div>

      <div class="settings-section">
        <h3>Text</h3>
        <div class="field" style="margin-bottom:10px">
          <label>Decision Text</label>
          <input type="text" id="rc-decisionText" spellcheck="true" value="${esc(rc.decisionText)}"
                 placeholder="I have decided to follow Jesus today!">
        </div>
        <div class="field" style="margin-bottom:10px">
          <label>Response 1</label>
          <input type="text" id="rc-r1" spellcheck="true" value="${esc(rc.r1)}" placeholder="e.g. I am out of step in my relationships.">
        </div>
        <div class="field" style="margin-bottom:10px">
          <label>Response 2</label>
          <input type="text" id="rc-r2" spellcheck="true" value="${esc(rc.r2)}" placeholder="e.g. I want to learn a new rhythm.">
        </div>
        <div class="field" style="margin-bottom:0">
          <label>Response 3</label>
          <input type="text" id="rc-r3" spellcheck="true" value="${esc(rc.r3)}" placeholder="e.g. I will choose to respond and not react.">
        </div>
      </div>
    </div>
  `;

  document.getElementById('rc-toggle-row').addEventListener('click', () => {
    cfg.includeResponseCard = !cfg.includeResponseCard;
    document.getElementById('rc-toggle').classList.toggle('on', cfg.includeResponseCard);
    saveState();
  });

  ['decisionText', 'r1', 'r2', 'r3'].forEach(key => {
    document.getElementById(`rc-${key}`).addEventListener('input', e => {
      cfg.responses[key] = e.target.value;
      saveState();
    });
  });
}

// ─── Form templates ───────────────────────────────────────────────────────────

function richEditor(id, spans) {
  return `
    <div class="rich-editor-wrap">
      <div class="rich-toolbar">
        <button class="btn-fmt" id="${id}-bold"      type="button" title="Bold (⌘B)"><b>B</b></button>
        <button class="btn-fmt" id="${id}-italic"    type="button" title="Italic (⌘I)"><i>I</i></button>
        <button class="btn-fmt" id="${id}-underline" type="button" title="Underline (⌘U)"><u>U</u></button>
      </div>
      <div class="rich-content" id="${id}" contenteditable="true" spellcheck="true"
           data-placeholder="Enter text…">${spansToHtmlPreview(spans)}</div>
    </div>
  `;
}

function blankBeforeRow(slide, defaultText = '') {
  const on = !!slide.blankBefore;
  return `
    <div class="blank-before-row" id="blank-before-row">
      <div class="toggle${on ? ' on' : ''}" id="bb-toggle"></div>
      <label>Blank slide before this one</label>
    </div>
    <div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview">
      <div class="field" style="margin-bottom:0">
        <label style="margin-bottom:4px">Blank slide confidence monitor text (optional)</label>
        ${richEditor('f-blank-spans', slide.blankSpans || [])}
      </div>
    </div>
  `;
}

function stageLayoutRow(slide) {
  const ss = state.config.stageScreen || DEFAULT_STAGESCREEN();
  // Build list of configured layout names (non-empty only)
  const layouts = [
    ss.rcLayoutName       && { name: ss.rcLayoutName,      uuid: ss.rcLayoutUuid },
    ss.messageLayoutName  && { name: ss.messageLayoutName,  uuid: ss.messageLayoutUuid },
  ].filter(Boolean);
  if (!layouts.length) return ''; // no layouts configured yet
  const cur = slide.stageLayout?.layoutName || '';
  return `
    <div class="field">
      <label>Stage Layout</label>
      <select id="f-stageLayout" style="flex:1">
        <option value="">None</option>
        ${layouts.map(l => `<option value="${esc(l.name)}" data-uuid="${esc(l.uuid)}" ${cur === l.name ? 'selected' : ''}>${esc(l.name)}</option>`).join('')}
      </select>
    </div>
  `;
}

function slideTransitionRow(slide, features) {
  if (features && !features.transitionOverride) return '';
  return `
    <div class="field">
      <label>Transition Override</label>
      ${transitionRow(slide.transition, 'f')}
    </div>
  `;
}

function propSection(slide, features, { showTransition = true, idPrefix = 'fp' } = {}) {
  if (features && !features.propName && !(showTransition && features?.propTransitionOverride)) return '';
  const parts = [];
  if (!features || features.propName) {
    const propVal = slide.propName || slide.propBaseName || slide.bodyText || slide.reference || '';
    parts.push(`
      <div class="field">
        <label>Prop Name</label>
        <input type="text" id="f-propName" spellcheck="false" value="${esc(propVal)}" placeholder="Auto-set from reference">
      </div>
    `);
  }
  if (showTransition && (!features || features.propTransitionOverride)) {
    parts.push(`
      <div class="field">
        <label>Prop Transition Override</label>
        ${transitionRow(slide.propTransition, idPrefix)}
      </div>
    `);
  }
  if (!parts.length) return '';
  return `<div class="slide-prop-section">${parts.join('')}</div>`;
}

function startEndForm(slide) {
  const isStart = slide.type === 'start';
  const iconCls = isStart ? 'si-start' : 'si-end';
  const iconTxt = isStart ? 'S' : 'E';
  const defaultText = isStart ? 'START' : 'End of Notes';
  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label || defaultText)}" placeholder="${defaultText}">
      </h2>
      <div class="field">
        <label>Screen Text</label>
        <input type="text" id="f-text" spellcheck="true" value="${esc(slide.text ?? slide.label ?? defaultText)}" placeholder="${defaultText}">
      </div>
    </div>
  `;
}

function attachStartEndHandlers(slide) {
  document.getElementById('f-label')?.addEventListener('input', e => {
    slide.label = e.target.value;
    saveState();
    renderQueue();
  });
  document.getElementById('f-text')?.addEventListener('input', e => {
    slide.text = e.target.value;
    saveState();
  });
}

function blankForm(slide) {
  const F = state.config.features || DEFAULT_FEATURES();
  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label)}" placeholder="Blank label">
      </h2>
      ${F.confidenceMonitor ? `
        <details class="cm-swivel">
          <summary class="cm-swivel-summary">Confidence monitor text</summary>
          <div class="cm-swivel-body">${richEditor('f-body', slide.spans || [])}</div>
        </details>
      ` : ''}
      <div class="slide-secondary">
        ${stageLayoutRow(slide)}
        ${slideTransitionRow(slide, F)}
      </div>
    </div>
  `;
}

function imageForm(slide) {
  const on = !!slide.blankBefore;
  const F  = state.config.features || DEFAULT_FEATURES();
  const blankSection = F.blankBefore ? `
    <div class="blank-before-row" id="blank-before-row">
      <div class="toggle${on ? ' on' : ''}" id="bb-toggle"></div>
      <label>Blank slide before this one</label>
    </div>
    ${F.confidenceMonitor ? `
      <div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview">
        <details class="cm-swivel">
          <summary class="cm-swivel-summary">Confidence monitor text</summary>
          <div class="cm-swivel-body">${richEditor('f-blank-spans', slide.blankSpans || [])}</div>
        </details>
      </div>
    ` : `<div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview" style="display:none"></div>`}
  ` : '';
  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label)}" placeholder="Image label">
      </h2>

      <div class="slide-secondary">
        ${blankSection}
        ${stageLayoutRow(slide)}
        ${slideTransitionRow(slide, F)}
        ${propSection(slide, F, { idPrefix: 'fp' })}
      </div>
    </div>
  `;
}

function customForm(slide) {
  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label)}" placeholder="Custom label">
      </h2>
      <p style="color:var(--muted);font-size:13px;margin-top:4px">Placeholder — build it out later.</p>
    </div>
  `;
}

function scriptureForm(slide) {
  const bodies = slide.bodies || [slide.body || []];
  const on = !!slide.blankBefore;
  const F = state.config.features || DEFAULT_FEATURES();

  const bodyEditors = bodies.map((body, idx) => `
    ${idx > 0 ? `
      <div class="slide-break-divider">
        slide break
        <button class="btn-remove-body" data-body-idx="${idx}" title="Remove this body">× remove</button>
      </div>
    ` : ''}
    ${richEditor(`f-body-${idx}`, body)}
  `).join('');

  const blankSection = F.blankBefore ? `
    <div class="blank-before-row" id="blank-before-row">
      <div class="toggle${on ? ' on' : ''}" id="bb-toggle"></div>
      <label>Blank slide before this one</label>
    </div>
    ${F.confidenceMonitor ? `
      <div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview">
        <details class="cm-swivel">
          <summary class="cm-swivel-summary">Confidence monitor text</summary>
          <div class="cm-swivel-body">${richEditor('f-blank-spans', slide.blankSpans || [])}</div>
        </details>
      </div>
    ` : `<div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview" style="display:none"></div>`}
  ` : '';

  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label)}" placeholder="Reference">
      </h2>

      <div class="field">
        <label>Reference</label>
        <div class="ref-row">
          <input type="text" id="f-reference" spellcheck="false" value="${esc(slide.reference || '')}" placeholder="e.g. John 13:35">
          ${(() => {
            const list = state.config.bibleList || [];
            const cur  = slide.bibleId || state.config.bibleId || '';
            if (!list.length) return `<button class="btn-lookup" id="btn-bible-lookup" type="button">Lookup</button>`;
            return `
              <select class="btn-lookup-trans" id="f-bible-id" title="Translation for this lookup">
                <option value="">Default</option>
                ${list.map(b => `<option value="${esc(b.id)}" ${b.id === cur ? 'selected' : ''}>${esc(b.abbreviation)}</option>`).join('')}
              </select>
              <button class="btn-lookup" id="btn-bible-lookup" type="button">Lookup</button>
            `;
          })()}
        </div>
      </div>
      <div class="field">
        <div class="body-field-hdr">
          <label>Body Text</label>
          <div class="body-field-tools">
            <button class="btn-sm body-tool-btn ${slide.fitWidth ? 'active' : ''}" id="btn-fit-width" type="button" title="Auto-fit text box width to content">Fit Width</button>
            <button class="btn-sm body-tool-btn ${slide.stripNewlines ? 'active' : ''}" id="btn-strip-nl" type="button" title="Strip line breaks on main slide (prop keeps them)">Strip</button>
          </div>
        </div>
        ${bodyEditors}
        <button class="btn-split-body" id="btn-split-body" type="button">+ Split into another slide</button>
      </div>

      <div class="slide-secondary">
        ${blankSection}
        ${stageLayoutRow(slide)}
        ${slideTransitionRow(slide, F)}
        ${propSection(slide, F)}
      </div>
    </div>
  `;
}

function pointForm(slide) {
  const mode = slide.mode || 'single';
  const on   = !!slide.blankBefore;
  const F    = state.config.features || DEFAULT_FEATURES();

  const singleFields = mode === 'single' ? `
    <div class="field" id="field-bodyText">
      <label>Point Text</label>
      <input type="text" id="f-bodyText" spellcheck="true" value="${esc(slide.bodyText || '')}" placeholder="e.g. Create Opportunities">
    </div>
  ` : '';

  const followReveal = slide.followReveal || 'single';

  const revealingFields = mode === 'revealing' ? `
    <div class="field" id="field-title">
      <label>Series Title (optional header on prop)</label>
      <input type="text" id="f-title" spellcheck="true" value="${esc(slide.title || '')}" placeholder="e.g. The King Has Come">
    </div>
    <div class="field" id="field-follow-reveal">
      <label>Confidence monitor</label>
      <div class="segmented-control">
        <button id="fr-single"   class="${followReveal === 'single'   ? 'active' : ''}">Current bullet</button>
        <button id="fr-stacking" class="${followReveal === 'stacking' ? 'active' : ''}">Stacking</button>
      </div>
    </div>
    <div class="field" id="field-bullets">
      <label>Bullets (one per slide)</label>
      <div class="bullet-list" id="bullet-list">
        ${(slide.bullets || [[]]).map((b, i) => `
          <div class="bullet-row" data-bullet-idx="${i}">
            <span style="color:var(--muted);font-size:13px;min-width:18px">${i + 1}</span>
            <div class="bullet-rich" id="bullet-rich-${i}" contenteditable="true" spellcheck="true"
                 data-idx="${i}" data-placeholder="Bullet ${i + 1}">${spansToHtml(Array.isArray(b) ? b : [{text: b, bold: false}])}</div>
            <button class="btn-remove-bullet" data-idx="${i}" title="Remove">×</button>
          </div>
        `).join('')}
      </div>
      <button class="btn-add-bullet" id="btn-add-bullet" type="button">+ Add bullet</button>
      <details class="reflow-details">
        <summary class="reflow-summary">Paste to reflow…</summary>
        <div class="reflow-body">
          <textarea id="reflow-paste" rows="5" placeholder="Paste bullet text here — one line per bullet — then click Split"></textarea>
          <button class="btn-sm" id="btn-reflow" type="button">Split into bullets</button>
        </div>
      </details>
    </div>
  ` : '';

  // Prop section differs by mode
  const propPart = (() => {
    if (mode === 'single') {
      return propSection(slide, F);
    }
    // Revealing: prop base name + two separate transition overrides
    const parts = [];
    if (!F || F.propName) {
      parts.push(`
        <div class="field">
          <label>Prop Base Name</label>
          <input type="text" id="f-propBaseName" spellcheck="false" value="${esc(slide.propBaseName || '')}" placeholder="Auto-set from first bullet">
        </div>
      `);
    }
    if (!F || F.propTransitionOverride) {
      parts.push(`
        <div class="field">
          <label>Initial Prop Transition (blank → first prop)</label>
          ${transitionRow(slide.propInitialTransition, 'fpi')}
        </div>
        <div class="field">
          <label>Reveal Transition (prop → next prop)</label>
          ${transitionRow(slide.propRevealTransition, 'fpr')}
        </div>
      `);
    }
    if (!parts.length) return '';
    return `<div class="slide-prop-section">${parts.join('')}</div>`;
  })();

  const blankSection = F.blankBefore ? `
    <div class="blank-before-row" id="blank-before-row">
      <div class="toggle${on ? ' on' : ''}" id="bb-toggle"></div>
      <label>Blank slide before this one</label>
    </div>
    ${F.confidenceMonitor ? `
      <div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview">
        <details class="cm-swivel">
          <summary class="cm-swivel-summary">Confidence monitor text</summary>
          <div class="cm-swivel-body">${richEditor('f-blank-spans', slide.blankSpans || [])}</div>
        </details>
      </div>
    ` : `<div class="blank-before-preview${on ? ' visible' : ''}" id="bb-preview" style="display:none"></div>`}
  ` : '';

  return `
    <div class="slide-form">
      <h2>
        <input type="text" class="slide-title-input" id="f-label" spellcheck="true" value="${esc(slide.label)}" placeholder="Point label">
      </h2>

      <div class="field">
        <label>Mode</label>
        <div class="segmented-control">
          <button id="mode-single" class="${mode === 'single' ? 'active' : ''}">Single</button>
          <button id="mode-revealing" class="${mode === 'revealing' ? 'active' : ''}">Revealing</button>
        </div>
      </div>
      ${singleFields}
      ${revealingFields}

      <div class="slide-secondary">
        ${blankSection}
        ${stageLayoutRow(slide)}
        ${slideTransitionRow(slide, F)}
        ${propPart}
      </div>
      <div style="margin-top:12px;display:flex;gap:6px;justify-content:flex-end">
        <button class="btn-sm body-tool-btn ${slide.fitWidth ? 'active' : ''}" id="btn-fit-width" type="button" title="Auto-fit text box width to content">Fit Width</button>
      </div>
    </div>
  `;
}

// ─── Form event handlers ──────────────────────────────────────────────────────

function attachRichEditor(editorId, onSave) {
  const bodyEl = document.getElementById(editorId);
  if (!bodyEl) return;

  const fmtBtns = {
    bold:      document.getElementById(`${editorId}-bold`),
    italic:    document.getElementById(`${editorId}-italic`),
    underline: document.getElementById(`${editorId}-underline`),
  };

  function updateFmtBtns() {
    for (const [cmd, btn] of Object.entries(fmtBtns)) {
      if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
    }
  }

  bodyEl.addEventListener('input', () => onSave(extractSpans(bodyEl)));

  for (const [cmd, btn] of Object.entries(fmtBtns)) {
    if (!btn) continue;
    btn.addEventListener('click', () => {
      bodyEl.focus();
      document.execCommand(cmd);
      updateFmtBtns();
      onSave(extractSpans(bodyEl));
    });
  }

  bodyEl.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey) {
      const map = { b: 'bold', i: 'italic', u: 'underline' };
      const cmd = map[e.key.toLowerCase()];
      if (cmd && fmtBtns[cmd]) { e.preventDefault(); fmtBtns[cmd].click(); }
    }
  });
  bodyEl.addEventListener('keyup',   updateFmtBtns);
  bodyEl.addEventListener('mouseup', updateFmtBtns);
}

function attachBlankBeforeHandlers(slide) {
  const bbRow     = document.getElementById('blank-before-row');
  const bbToggle  = document.getElementById('bb-toggle');
  const bbPreview = document.getElementById('bb-preview');
  if (!bbRow) return;

  // Sync initial state
  if (slide.blankBefore) bbToggle.classList.add('on');

  bbRow.addEventListener('click', () => {
    slide.blankBefore = !slide.blankBefore;
    bbToggle.classList.toggle('on', slide.blankBefore);
    bbPreview.classList.toggle('visible', slide.blankBefore);
    saveState();
  });

  attachRichEditor('f-blank-spans', spans => {
    slide.blankSpans = spans;
    saveState();
  });
}

function attachFormHandlers(slide) {
  const get = id => document.getElementById(id);

  // ── Blank-before (scripture + point) ──
  attachBlankBeforeHandlers(slide);

  // ── Reference (scripture) — auto-syncs label & propName ──
  const refEl = get('f-reference');
  if (refEl) {
    refEl.addEventListener('input', () => {
      slide.reference = refEl.value;
      if (!slide._labelManual) {
        slide.label = slide.reference;
        get('f-label').value = slide.label;
        renderSidebar();
      }
      if (!slide._propNameManual) {
        slide.propName = slide.reference;
        const pn = get('f-propName');
        if (pn) pn.value = slide.propName;
      }
      saveState();
    });
    refEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const transEl = get('f-bible-id');
        lookupBibleVerse(slide, refEl.value.trim(), transEl?.value || '');
      }
    });

    // Per-slide translation override
    const transEl = get('f-bible-id');
    if (transEl) {
      transEl.addEventListener('change', e => { slide.bibleId = e.target.value || ''; saveState(); });
    }
    // Bible lookup
    const lookupBtn = get('btn-bible-lookup');
    if (lookupBtn) {
      lookupBtn.addEventListener('click', () => {
        const overrideId = transEl?.value || '';
        lookupBibleVerse(slide, refEl.value.trim(), overrideId);
      });
    }
  }

  // ── Label ──
  const lblEl = get('f-label');
  if (lblEl) {
    lblEl.addEventListener('input', () => {
      slide.label = lblEl.value;
      slide._labelManual = true;
      renderSidebar();
      saveState();
    });
  }

  // ── Scripture body editors ──
  if (slide.type === 'scripture') {
    if (!slide.bodies) slide.bodies = [slide.body || []];

    let _fitTimer = null;
    slide.bodies.forEach((body, idx) => {
      attachRichEditor(`f-body-${idx}`, spans => {
        slide.bodies[idx] = spans;
        if (slide.fitWidth) {
          clearTimeout(_fitTimer);
          _fitTimer = setTimeout(() => {
            const s = activeStyleScheme();
            const allSpans = (slide.bodies || [[]])[0] || [];
            if (allSpans.some(sp => sp.text)) {
              const r = computeOptimalBodyWidth(allSpans, s);
              slide.bodyW = r.bodyW; slide.bodyX = r.bodyX;
            }
            saveState();
          }, 450);
        } else {
          saveState();
        }
      });
    });

    // Split button
    const splitBtn = get('btn-split-body');
    if (splitBtn) {
      splitBtn.addEventListener('click', () => {
        slide.bodies.push([]);
        slide._labelManual = true;
        renderMain();
      });
    }

    // Remove body buttons
    document.querySelectorAll('.btn-remove-body').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.bodyIdx);
        if (slide.bodies.length > 1) {
          slide.bodies.splice(idx, 1);
          renderMain();
        }
      });
    });
  }

  // ── Blank body (blank slides) ──
  if (slide.type === 'blank') {
    attachRichEditor('f-body', spans => {
      slide.spans = spans;
      saveState();
    });
  }

  // ── Image label only ──
  // (label handler above covers it)

  // ── propName ──
  const propEl = get('f-propName');
  if (propEl) {
    propEl.addEventListener('input', () => {
      slide.propName = propEl.value;
      slide._propNameManual = true;
      saveState();
    });
  }

  // ── Point mode toggle ──
  const modeS = get('mode-single');
  const modeR = get('mode-revealing');
  if (modeS) {
    modeS.addEventListener('click', () => { slide.mode = 'single'; renderMain(); });
  }
  if (modeR) {
    modeR.addEventListener('click', () => { slide.mode = 'revealing'; renderMain(); });
  }

  // ── Confidence monitor follow-reveal mode (revealing only) ──
  const frSingle   = get('fr-single');
  const frStacking = get('fr-stacking');
  if (frSingle) {
    frSingle.addEventListener('click', () => { slide.followReveal = 'single'; frSingle.classList.add('active'); frStacking.classList.remove('active'); saveState(); });
  }
  if (frStacking) {
    frStacking.addEventListener('click', () => { slide.followReveal = 'stacking'; frStacking.classList.add('active'); frSingle.classList.remove('active'); saveState(); });
  }

  // ── Point single fields ──
  const btEl = get('f-bodyText');
  if (btEl) {
    btEl.addEventListener('input', () => {
      slide.bodyText = btEl.value;
      if (!slide._labelManual) {
        slide.label = slide.bodyText;
        get('f-label').value = slide.label;
        renderSidebar();
      }
      if (!slide._propNameManual) {
        slide.propName = slide.bodyText;
        const pn = get('f-propName');
        if (pn) pn.value = slide.propName;
      }
      saveState();
    });
  }

  // ── Point revealing fields ──
  // Deck label for a revealing point uses the prop header title if set,
  // otherwise falls back to the first bullet.
  const syncRevealingLabel = () => {
    if (slide._labelManual) return;
    const t = (slide.title || '').trim();
    slide.label = t || bulletToText((slide.bullets || [[]])[0]) || '';
    const lbl = get('f-label');
    if (lbl) lbl.value = slide.label;
    renderSidebar();
  };
  const titleEl = get('f-title');
  if (titleEl) {
    titleEl.addEventListener('input', () => { slide.title = titleEl.value; syncRevealingLabel(); saveState(); });
  }

  // Bullet rich editors (CMD+B for bold, no toolbar)
  document.querySelectorAll('.bullet-rich').forEach(div => {
    const idx = Number(div.dataset.idx);
    div.addEventListener('input', () => {
      if (!slide.bullets) slide.bullets = [];
      slide.bullets[idx] = extractSpans(div);
      // Auto-sync label (title → first bullet)
      if (idx === 0) syncRevealingLabel();
      saveState();
    });
    div.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        document.execCommand('bold');
        if (!slide.bullets) slide.bullets = [];
        slide.bullets[idx] = extractSpans(div);
        saveState();
      }
    });
  });

  // Add bullet
  const addBulletBtn = get('btn-add-bullet');
  if (addBulletBtn) {
    addBulletBtn.addEventListener('click', () => {
      if (!slide.bullets) slide.bullets = [];
      slide.bullets.push([]);
      renderMain();
    });
  }

  // Reflow: paste multi-line text → split into bullets
  const reflowBtn = get('btn-reflow');
  if (reflowBtn) {
    reflowBtn.addEventListener('click', () => {
      const ta = get('reflow-paste');
      if (!ta) return;
      const lines = ta.value.split('\n').map(l => l.trim()).filter(Boolean);
      if (!lines.length) return;
      slide.bullets = lines.map(l => [{ text: l, bold: false }]);
      ta.value = '';
      renderMain();
    });
  }

  // Remove bullet
  document.querySelectorAll('.btn-remove-bullet').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      if (!slide.bullets) slide.bullets = [];
      if (slide.bullets.length > 1) {
        slide.bullets.splice(idx, 1);
        renderMain();
      }
    });
  });

  // ── Per-slide transition picker ──
  attachTransitionHandlers('f', get, trans => {
    slide.transition = trans;
    saveState();
    renderSidebar();
  });

  // ── Prop transition overrides ──
  // Single prop (scripture, point-single, image)
  attachTransitionHandlers('fp', get, trans => {
    slide.propTransition = trans;
    saveState();
  });
  // Revealing prop: initial (blank → first prop)
  attachTransitionHandlers('fpi', get, trans => {
    slide.propInitialTransition = trans;
    saveState();
  });
  // Revealing prop: sequential reveal (prop N → N+1)
  attachTransitionHandlers('fpr', get, trans => {
    slide.propRevealTransition = trans;
    saveState();
  });

  // ── propBaseName (revealing point) ──
  const propBaseEl = get('f-propBaseName');
  if (propBaseEl) {
    propBaseEl.addEventListener('input', () => { slide.propBaseName = propBaseEl.value; saveState(); });
  }

  // ── Body width / preview tools ──

  // Helper: compute and store fit-width for the current slide
  function applyFitWidth() {
    let spans = [];
    if (slide.type === 'scripture') {
      spans = (slide.bodies || [[]])[0] || [];
    } else if (slide.type === 'point') {
      const text = slide.mode === 'revealing'
        ? (slide.bullets || [])[0] || ''
        : (slide.bodyText || '');
      spans = [{ text, bold: true }];
    }
    if (!spans.length || spans.every(s => !s.text)) return;
    const scheme = activeStyleScheme();
    const result = computeOptimalBodyWidth(spans, scheme);
    slide.bodyW = result.bodyW;
    slide.bodyX = result.bodyX;
  }

  const fitBtn   = get('btn-fit-width');
  const stripBtn = get('btn-strip-nl');

  if (fitBtn) {
    fitBtn.addEventListener('click', () => {
      slide.fitWidth = !slide.fitWidth;
      fitBtn.classList.toggle('active', slide.fitWidth);
      if (slide.fitWidth) {
        // Mutually exclusive with Strip
        if (slide.stripNewlines) {
          slide.stripNewlines = false;
          stripBtn?.classList.remove('active');
        }
        applyFitWidth();
      } else {
        slide.bodyW = null;
        slide.bodyX = null;
      }
      saveState();
    });
  }

  if (stripBtn) {
    stripBtn.addEventListener('click', () => {
      slide.stripNewlines = !slide.stripNewlines;
      stripBtn.classList.toggle('active', slide.stripNewlines);
      if (slide.stripNewlines && slide.fitWidth) {
        // Mutually exclusive with Fit Width
        slide.fitWidth = false;
        slide.bodyW = null;
        slide.bodyX = null;
        fitBtn?.classList.remove('active');
      }
      saveState();
    });
  }

  // ── Stage layout select ──
  const stageLayoutEl = get('f-stageLayout');
  if (stageLayoutEl) {
    stageLayoutEl.addEventListener('change', () => {
      const sel = stageLayoutEl.options[stageLayoutEl.selectedIndex];
      const name = sel.value;
      if (!name) {
        slide.stageLayout = null;
      } else {
        slide.stageLayout = { layoutName: name, layoutUuid: sel.dataset.uuid || '' };
      }
      saveState();
    });
  }
}

// ─── Slide actions ────────────────────────────────────────────────────────────

function selectSlide(id) {
  state.activeId = id;
  render();
}

function addSlide(type) {
  const endIdx = state.slides.findIndex(s => s.type === 'end');
  const defaults = {
    scripture: { label: 'New Scripture', reference: '', bodies: [[]], propName: '', blankBefore: true, blankSpans: [], transition: null, propTransition: null, stripNewlines: false, fitWidth: true, bodyW: null, bodyX: null },
    point:     { label: 'New Point', mode: 'single', bodyText: '', propName: '', propBaseName: '', title: '', bullets: [[]], blankBefore: true, blankSpans: [], transition: null, propTransition: null, propInitialTransition: null, propRevealTransition: null, fitWidth: true, bodyW: null, bodyX: null },
    blank:     { label: 'Blank', spans: [], transition: null },
    image:     { label: 'Image', blankBefore: true, blankSpans: [], transition: null, propTransition: null },
    custom:    { label: 'Custom' },
  };
  const slide = { id: uid(), type, fixed: false, ...defaults[type] };
  state.slides.splice(endIdx, 0, slide);
  state.activeId = slide.id;
  render();
}

function deleteSlide(id) {
  const idx = state.slides.findIndex(s => s.id === id);
  if (idx === -1) return;
  state.slides.splice(idx, 1);
  if (state.activeId === id) {
    state.activeId = state.slides[Math.min(idx, state.slides.length - 1)]?.id ?? null;
  }
  saveState(); render();
}

function duplicateSlide(id) {
  const idx = state.slides.findIndex(s => s.id === id);
  if (idx === -1) return;
  const copy = JSON.parse(JSON.stringify(state.slides[idx]));
  copy.id = uid();
  copy.fixed = false;
  state.slides.splice(idx + 1, 0, copy);
  state.activeId = copy.id;
  saveState(); render();
}

// ─── Header handlers ──────────────────────────────────────────────────────────

function attachHeaderHandlers() {
  // deck-header-meta click is handled in initDecks

  // ··· more menu
  const moreBtn  = document.getElementById('btn-more');
  const moreMenu = document.getElementById('header-more-menu');
  moreBtn?.addEventListener('click', e => {
    e.stopPropagation();
    moreMenu?.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#header-more-wrap')) moreMenu?.classList.remove('open');
  });
  document.getElementById('mm-schemes')?.addEventListener('click', () => {
    state.activeId = state.activeId === 'style' ? null : 'style';
    render(); moreMenu?.classList.remove('open');
  });
  document.getElementById('mm-settings')?.addEventListener('click', () => {
    state.activeId = state.activeId === 'settings' ? null : 'settings';
    render(); moreMenu?.classList.remove('open');
  });
  document.getElementById('mm-help')?.addEventListener('click', () => {
    document.getElementById('help-modal')?.classList.add('open');
    moreMenu?.classList.remove('open');
  });
  document.getElementById('mm-changelog')?.addEventListener('click', () => {
    document.getElementById('changelog-modal')?.classList.add('open');
    moreMenu?.classList.remove('open');
  });
  document.getElementById('mm-theme')?.addEventListener('click', () => {
    toggleTheme();
    moreMenu?.classList.remove('open');
  });

  document.getElementById('btn-add-scripture').addEventListener('click', () => addSlide('scripture'));
  document.getElementById('btn-add-point').addEventListener('click',     () => addSlide('point'));
  document.getElementById('btn-add-blank').addEventListener('click',     () => addSlide('blank'));
  document.getElementById('btn-add-image').addEventListener('click',     () => addSlide('image'));
  document.getElementById('btn-add-custom').addEventListener('click',    () => addSlide('custom'));
  document.getElementById('btn-generate').addEventListener('click', generate);
  document.getElementById('btn-show-blanks')?.addEventListener('click', () => {
    state.showBlanks = !state.showBlanks;
    saveState();
    renderSidebar();
  });

  document.getElementById('btn-undo')?.addEventListener('click', applyUndo);
  document.getElementById('btn-redo')?.addEventListener('click', applyRedo);
  // Notes panel resize
  const notesPanel  = document.getElementById('notes-panel');
  const resizeHandle = document.getElementById('notes-resize-handle');
  if (resizeHandle && notesPanel) {
    resizeHandle.addEventListener('mousedown', e => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = notesPanel.offsetWidth;
      resizeHandle.classList.add('dragging');
      notesPanel.classList.add('resizing');
      // Shield iframes so they don't swallow mousemove events
      const shield = document.createElement('div');
      shield.style.cssText = 'position:fixed;inset:0;z-index:99998;cursor:col-resize';
      document.body.appendChild(shield);
      const onMove = mv => {
        const newW = Math.max(200, Math.min(700, startW - (mv.clientX - startX)));
        notesPanel.style.width = `${newW}px`;
      };
      const onUp = () => {
        resizeHandle.classList.remove('dragging');
        notesPanel.classList.remove('resizing');
        shield.remove();
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  const toggleNotes = () => {
    const panel = document.getElementById('notes-panel');
    const floatBtn = document.getElementById('btn-notes-open');
    const hidden = panel?.classList.toggle('hidden');
    if (floatBtn) floatBtn.style.display = hidden ? '' : 'none';
  };
  // Hide button initially since panel starts visible
  const _initFloatBtn = document.getElementById('btn-notes-open');
  if (_initFloatBtn) _initFloatBtn.style.display = 'none';
  document.getElementById('btn-notes-close')?.addEventListener('click', toggleNotes);
  document.getElementById('btn-notes-open')?.addEventListener('click', toggleNotes);

  // Outline / Speaker Notes tabs
  document.querySelectorAll('.notes-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.notes-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.getElementById('notes-tab-outline')?.classList.toggle('hidden', target !== 'outline');
      document.getElementById('notes-tab-speaker')?.classList.toggle('hidden', target !== 'speaker');
    });
  });

  // PDF drop zone
  attachPdfHandlers();
  document.getElementById('gen-modal-close')?.addEventListener('click', () => {
    document.getElementById('gen-modal')?.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      if (e.shiftKey) applyRedo(); else applyUndo();
      e.preventDefault();
    }
  });
}

// ─── Spec builder ─────────────────────────────────────────────────────────────

function buildFileName() {
  const { seriesName, messageTitle, weekDate, qrCode } = state.config;
  const d = weekDate || new Date().toISOString().slice(0, 10);
  const [yy, mm, dd] = d.split('-');
  const series = (seriesName || 'Untitled').replace(/\s+/g, '_');
  const title  = (messageTitle || '').replace(/\s+/g, '_');
  const qrSuffix = qrCode ? '_SAT' : '';
  return title
    ? `Message_${yy}.${mm}.${dd}_${series}_${title}${qrSuffix}`
    : `Message_${yy}.${mm}.${dd}_${series}${qrSuffix}`;
}

// ─── Book name normalization ──────────────────────────────────────────────────

const BOOK_NAME_OPTIONS = [
  { key: 'acts',          label: 'Acts',                             pattern: /^Acts\b/i,                      choices: ['Acts', 'Acts of the Apostles'] },
  { key: 'songOfSolomon', label: 'Song of Solomon / Song of Songs',  pattern: /^Song of (Solomon|Songs?)\b/i,  choices: ['Song of Solomon', 'Song of Songs'] },
];

function applyBookNames(ref, bookNames) {
  if (!ref || !bookNames) return ref;
  let s = ref;
  for (const { key, pattern } of BOOK_NAME_OPTIONS) {
    const override = bookNames[key];
    if (override) s = s.replace(pattern, override);
  }
  return s;
}

function buildSpec() {
  const { qrCode, includeResponseCard, outputFolder, responses } = state.config;

  // Resolve active style scheme (strip UI-only fields)
  const activeScheme = (state.styleSchemes || []).find(p => p.id === state.activeSchemeId)
    || DEFAULT_STYLE_SCHEME();
  // eslint-disable-next-line no-unused-vars
  const { id: _sid, name: _sname, isDefault: _sd, isLocked: _sl, ...style } = activeScheme;

  const slides = state.slides.map(slide => {
    if (slide.type === 'start') return { type: 'start', label: slide.label || 'START',        text: slide.text ?? slide.label ?? 'START' };
    if (slide.type === 'end')   return { type: 'end',   label: slide.label || 'End of Notes', text: slide.text ?? slide.label ?? 'End of Notes' };

    if (slide.type === 'scripture') {
      const bodies = slide.bodies || [slide.body || []];
      // Auto-fill blankSpans from all bodies when split and not manually set
      const blankSpans = (slide.blankSpans && slide.blankSpans.length)
        ? slide.blankSpans
        : bodies.length > 1
          ? bodies.reduce((acc, body, i) => {
              if (i > 0) acc.push({ text: '\n', bold: false });
              return acc.concat(body || []);
            }, [])
          : [];
      const displayRef = applyBookNames(slide.reference || '', state.config.bookNames || {});
      return {
        type:          'scripture',
        label:         slide.label || slide.reference || 'Scripture',
        reference:     displayRef,
        bodies,
        propName:      slide.propName || slide.reference || 'scripture',
        blankBefore:   !!slide.blankBefore,
        blankSpans,
        stageLayout:   slide.stageLayout || null,
        transition:    slide.transition || null,
        propTransition: slide.propTransition || null,
        stripNewlines: !!slide.stripNewlines,
        bodyW:         slide.fitWidth ? (slide.bodyW || null) : null,
        bodyX:         slide.fitWidth ? (slide.bodyX || null) : null,
      };
    }

    if (slide.type === 'point') {
      if (slide.mode === 'revealing') {
        return {
          type:                 'point',
          mode:                 'revealing',
          label:                slide.label || 'Point',
          title:                slide.title || '',
          bullets:              (slide.bullets || [[]]).filter(b => bulletToText(b)?.trim()),
          propBaseName:         slide.propBaseName || slide.label || 'point',
          followReveal:         slide.followReveal || 'single',
          blankBefore:          !!slide.blankBefore,
          blankSpans:           slide.blankSpans || [],
          transition:           slide.transition || null,
          propInitialTransition: slide.propInitialTransition || null,
          propRevealTransition:  slide.propRevealTransition || null,
          bodyW:                slide.fitWidth ? (slide.bodyW || null) : null,
          bodyX:                slide.fitWidth ? (slide.bodyX || null) : null,
        };
      }
      return {
        type:          'point',
        mode:          'single',
        label:         slide.label || slide.bodyText || 'Point',
        bodyText:      slide.bodyText || '',
        propName:      slide.propName || slide.bodyText || 'point',
        blankBefore:   !!slide.blankBefore,
        blankSpans:    slide.blankSpans || [],
        transition:    slide.transition || null,
        propTransition: slide.propTransition || null,
        bodyW:         slide.fitWidth ? (slide.bodyW || null) : null,
        bodyX:         slide.fitWidth ? (slide.bodyX || null) : null,
      };
    }

    if (slide.type === 'blank') {
      return {
        type:        'blank',
        label:       slide.label || 'Blank',
        spans:       slide.spans || [],
        stageLayout: slide.stageLayout || null,
        transition:  slide.transition || null,
      };
    }

    if (slide.type === 'image') {
      return {
        type:           'image',
        label:          slide.label || 'Image',
        stageLayout:    slide.stageLayout || null,
        transition:     slide.transition || null,
        propTransition: slide.propTransition || null,
        blankBefore:    !!slide.blankBefore,
        blankSpans:     slide.blankSpans || [],
      };
    }

    return null;
  }).filter(Boolean);

  return {
    name:                buildFileName(),
    qrEnabled:           qrCode,
    includeResponseCard: includeResponseCard,
    outputFolder:        outputFolder || '',
    responses:           responses || { decisionText: '', r1: '', r2: '', r3: '' },
    style,
    macros:              state.config.macros || DEFAULT_MACROS(),
    stageScreen:         state.config.stageScreen || DEFAULT_STAGESCREEN(),
    slides,
  };
}

// ─── Export ──────────────────────────────────────────────────────────────────────

// A single scripture slide longer than this (characters) is worth splitting.
const LONG_SCRIPTURE_CHARS = 220;
// True if a string has leading or trailing whitespace we'd want flagged.
const hasEdgeSpace = (s) => typeof s === 'string' && s.length > 0 && s !== s.replace(/^[ \t]+|[ \t]+$/g, '');

function preflightWarnings() {
  const warnings = [];
  const cfg = state.config;
  const F = cfg.features || DEFAULT_FEATURES();

  for (const slide of state.slides) {
    const label = slide.label || slide.type;
    if (slide.type === 'scripture') {
      if (!slide.reference?.trim())
        warnings.push(`Scripture "${label}" has no reference`);
      else if (hasEdgeSpace(slide.reference))
        warnings.push(`Scripture "${label}" reference has a stray space at the start or end`);
      const bodies = slide.bodies || [[]];
      if (bodies.every(b => !b?.some(s => s.text?.trim())))
        warnings.push(`Scripture "${label}" has no body text`);
      // Flag any single body slide that's long enough to be worth splitting
      bodies.forEach((b, i) => {
        const joined = (b || []).map(s => s.text || '').join('');
        if (joined.length > LONG_SCRIPTURE_CHARS)
          warnings.push(`Scripture "${label}"${bodies.length > 1 ? ` (slide ${i + 1})` : ''} is long (${joined.length} chars) — consider splitting it into two slides`);
        if (hasEdgeSpace(joined))
          warnings.push(`Scripture "${label}"${bodies.length > 1 ? ` (slide ${i + 1})` : ''} has a stray space at the start or end`);
      });
    }
    if (slide.type === 'point' && slide.mode !== 'revealing') {
      if (!slide.bodyText?.trim())
        warnings.push(`Point "${label}" has no body text`);
      else if (hasEdgeSpace(slide.bodyText))
        warnings.push(`Point "${label}" has a stray space at the start or end`);
    }
    if (slide.type === 'point' && slide.mode === 'revealing') {
      if (!(slide.bullets || []).some(b => bulletToText(b)?.trim()))
        warnings.push(`Revealing point "${label}" has no bullets`);
    }
  }

  if (cfg.includeResponseCard) {
    const r = cfg.responses || {};
    if (!r.r1?.trim() && !r.r2?.trim() && !r.r3?.trim())
      warnings.push('Response card is enabled but all three response lines are empty');
  }

  // ── Quote mismatch checks ──────────────────────────────────────────────────
  for (const slide of state.slides) {
    const label = slide.label || slide.type;
    const texts = [];

    if (slide.type === 'scripture') {
      const bodies = slide.bodies || [[]];
      for (const body of bodies) {
        const joined = (body || []).map(s => s.text || '').join('');
        if (joined.trim()) texts.push(joined);
      }
    } else if (slide.type === 'point' && slide.mode !== 'revealing') {
      if (slide.bodyText?.trim()) texts.push(slide.bodyText);
    } else if (slide.type === 'point' && slide.mode === 'revealing') {
      for (const b of (slide.bullets || [])) {
        const bt = bulletToText(b);
        if (bt?.trim()) texts.push(bt);
      }
    }

    for (const text of texts) {
      // curly double quotes
      const openDouble  = (text.match(/“/g) || []).length;
      const closeDouble = (text.match(/”/g) || []).length;
      if (openDouble !== closeDouble)
        warnings.push(`"${label}" has mismatched curly double quotes (“”) — ${openDouble} open, ${closeDouble} close`);

      // curly single quotes / apostrophes — only flag if both kinds present (pure apostrophe use would be all ’)
      const openSingle  = (text.match(/‘/g) || []).length;
      const closeSingle = (text.match(/’/g) || []).length;
      if (openSingle > 0 && openSingle !== closeSingle)
        warnings.push(`"${label}" has mismatched curly single quotes (‘’) — ${openSingle} open, ${closeSingle} close`);

      // straight double quotes — odd count means unpaired
      const straightDouble = (text.match(/"/g) || []).length;
      if (straightDouble % 2 !== 0)
        warnings.push(`"${label}" has an odd number of straight double quotes (") — may be unpaired`);
    }
  }

  return warnings;
}

async function generate() {
  const btn = document.getElementById('btn-generate');

  // Check Pro7 BEFORE disabling the button — so we can bail cleanly.
  // If auto-manage is on, the server will quit/relaunch Pro7 for us, so we proceed.
  const autoManage = state.config.autoManagePro7 !== false;
  try {
    const check = await fetch('/api/pro7/process');
    const { running } = await check.json();
    if (running && !autoManage) { showProRunningModal(); return; }
  } catch (_) { /* can't check — allow export anyway */ }

  const warnings = preflightWarnings();
  if (warnings.length) {
    const ok = await showWarningDialog(warnings);
    if (!ok) return;
  }

  btn.disabled = true;
  btn.textContent = 'Exporting…';

  // Compute fit-width for any slides that have it on (catches slides never visited in this session)
  const scheme = activeStyleScheme();
  for (const slide of state.slides) {
    if (!slide.fitWidth) continue;
    let spans = null;
    if (slide.type === 'scripture') spans = (slide.bodies || [[]])[0] || [];
    else if (slide.type === 'point') {
      const text = slide.mode === 'revealing' ? (slide.bullets || [])[0] || '' : (slide.bodyText || '');
      spans = [{ text, bold: true }];
    }
    if (spans && spans.some(s => s.text)) {
      const r = computeOptimalBodyWidth(spans, scheme);
      slide.bodyW = r.bodyW; slide.bodyX = r.bodyX;
    }
  }

  // Always export directly to Pro7
  await runGenerate(false, btn, true);
}

function showDeliveryOverlay(steps, opts = {}) {
  const overlay = document.getElementById('delivery-overlay');
  const stepsEl = document.getElementById('delivery-steps');
  if (!overlay || !stepsEl) return;
  // Title/subtitle default to the export copy but can be overridden (e.g. for updates)
  const titleEl = document.getElementById('delivery-title');
  const subEl   = document.getElementById('delivery-sub');
  if (titleEl) titleEl.textContent = opts.title    || 'Delivering to ProPresenter';
  if (subEl)   subEl.textContent   = opts.subtitle || "Don't switch to ProPresenter until this completes";
  stepsEl.innerHTML = steps.map((s, i) => `
    <div class="delivery-step" id="delivery-step-${i}">
      <div class="delivery-step-icon" id="delivery-step-icon-${i}">
        <div class="delivery-step-spin"></div>
      </div>
      <span>${s}</span>
    </div>`).join('');
  overlay.classList.add('visible');
}

function updateDeliveryStep(i, done) {
  const step = document.getElementById(`delivery-step-${i}`);
  const icon = document.getElementById(`delivery-step-icon-${i}`);
  if (!step || !icon) return;
  if (done) {
    step.classList.add('done');
    icon.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6.5" stroke="var(--blue)" stroke-width="1.2"/>
      <path d="M4 7l2 2 4-4" stroke="var(--blue)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  } else {
    icon.innerHTML = `<div class="delivery-step-spin"></div>`;
  }
}

function hideDeliveryOverlay() {
  const overlay = document.getElementById('delivery-overlay');
  overlay?.classList.remove('visible');
}

// ─── Rebuild overlay ──────────────────────────────────────────────────────────

const REBUILD_STEPS = [
  'Clearing build cache',
  'Building app',
  'Installing to Applications',
  'Refreshing system cache',
  'Relaunching',
];

function showRebuildOverlay() {
  const overlay = document.getElementById('rebuild-overlay');
  const stepsEl = document.getElementById('rebuild-steps');
  const title   = document.getElementById('rebuild-title');
  const sub     = document.getElementById('rebuild-sub');
  const closeBtn = document.getElementById('rebuild-close-btn');
  if (!overlay || !stepsEl) return;

  // Reset state
  if (title)    { title.textContent = 'Redeploying DeckPro'; title.style.color = ''; }
  if (sub)      { sub.textContent = 'Takes about 30 seconds — don\'t close the app'; sub.style.color = ''; }
  if (closeBtn) closeBtn.style.display = 'none';

  stepsEl.innerHTML = REBUILD_STEPS.map((s, i) => `
    <div class="delivery-step" id="rebuild-step-${i}">
      <div class="delivery-step-icon" id="rebuild-step-icon-${i}">
        <div class="delivery-step-dot"></div>
      </div>
      <span>${s}</span>
    </div>`).join('');

  overlay.classList.add('visible');
}

function updateRebuildStep(stepNum) {
  // stepNum is 1-based from rebuild.sh (STEP:1, STEP:2, …)
  // Mark previous step done, set current step spinning
  const doneIdx   = stepNum - 2;
  const activeIdx = stepNum - 1;
  const checkSvg  = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6.5" stroke="var(--blue)" stroke-width="1.2"/>
    <path d="M4 7l2 2 4-4" stroke="var(--blue)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  if (doneIdx >= 0) {
    document.getElementById(`rebuild-step-${doneIdx}`)?.classList.add('done');
    const icon = document.getElementById(`rebuild-step-icon-${doneIdx}`);
    if (icon) icon.innerHTML = checkSvg;
  }
  if (activeIdx < REBUILD_STEPS.length) {
    const icon = document.getElementById(`rebuild-step-icon-${activeIdx}`);
    if (icon) icon.innerHTML = `<div class="delivery-step-spin"></div>`;
  }
}

function showRebuildError(msg) {
  const title    = document.getElementById('rebuild-title');
  const sub      = document.getElementById('rebuild-sub');
  const closeBtn = document.getElementById('rebuild-close-btn');
  if (title)    { title.textContent = 'Rebuild Failed'; title.style.color = 'var(--red, #ff453a)'; }
  if (sub)      { sub.textContent = msg; sub.style.color = 'var(--muted)'; }
  if (closeBtn) {
    closeBtn.style.display = '';
    closeBtn.onclick = () => document.getElementById('rebuild-overlay')?.classList.remove('visible');
  }
}

// ─── Import a scheme from a Pro7 presentation ───────────────────────────────
// Build it in Pro7 (or restyle a DeckPro export), then read its fonts, sizes,
// colours and element positions back into a new scheme.

async function showSchemeImport(panel) {
  const overlay = document.createElement('div');
  overlay.className = 'warn-overlay';
  overlay.innerHTML = `
    <div class="warn-modal scheme-import-modal">
      <div class="warn-hdr"><span>Import scheme from Pro7</span></div>
      <p class="scheme-import-help">
        Pick a presentation you've styled in ProPresenter (fonts, sizes, colours, element positions)
        and DeckPro will read those into a new scheme. Tip: export a deck, restyle it in Pro7, then import it back.
      </p>
      <div class="field" style="margin-bottom:8px">
        <label>Presentation</label>
        <select id="si-select"><option value="">Loading your Pro7 library…</option></select>
      </div>
      <div class="scheme-import-or">or <button class="btn-sm" id="si-browse">Browse for a .pro file…</button></div>
      <div id="si-report" class="scheme-import-report" style="display:none"></div>
      <div class="warn-actions">
        <button class="warn-btn-cancel" id="si-cancel">Cancel</button>
        <button class="warn-btn-ok" id="si-import" disabled>Import</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const sel      = overlay.querySelector('#si-select');
  const reportEl = overlay.querySelector('#si-report');
  const importBtn= overlay.querySelector('#si-import');
  let chosenPath = '';

  const close = () => overlay.remove();
  overlay.querySelector('#si-cancel').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  const setChosen = (path) => { chosenPath = path || ''; importBtn.disabled = !chosenPath; };
  sel.addEventListener('change', () => setChosen(sel.value));

  // Load the library list
  try {
    const res  = await fetch('/api/scheme/presentations');
    const data = await res.json();
    if (data.ok && data.presentations.length) {
      const readable   = data.presentations.filter(p => p.readable);
      const unreadable = data.presentations.filter(p => !p.readable);
      sel.innerHTML =
        '<option value="">— choose a presentation —</option>' +
        readable.map(p => `<option value="${esc(p.path)}">${esc(p.name)} · ${p.cues} slides</option>`).join('') +
        (unreadable.length
          ? `<optgroup label="Can't be read (different format)">${
              unreadable.map(p => `<option value="" disabled>${esc(p.name)}</option>`).join('')}</optgroup>`
          : '');
    } else {
      sel.innerHTML = '<option value="">No presentations found in your Pro7 library</option>';
    }
  } catch (_) {
    sel.innerHTML = '<option value="">Could not read your Pro7 library</option>';
  }

  // Browse fallback
  overlay.querySelector('#si-browse').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/scheme/browse');
      const data = await res.json();
      if (data.ok && data.path) {
        sel.value = '';
        setChosen(data.path);
        const fname = data.path.split('/').pop();
        let opt = sel.querySelector('option[data-browsed]');
        if (!opt) { opt = document.createElement('option'); opt.dataset.browsed = '1'; sel.appendChild(opt); }
        opt.value = data.path; opt.textContent = `📁 ${fname}`; sel.value = data.path;
      }
    } catch (_) {}
  });

  // Import → extract → create scheme
  importBtn.addEventListener('click', async () => {
    if (!chosenPath) return;
    importBtn.disabled = true;
    importBtn.textContent = 'Reading…';
    reportEl.style.display = 'none';
    try {
      const res  = await fetch('/api/scheme/extract', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: chosenPath }),
      });
      const data = await res.json();
      if (!data.ok) {
        reportEl.style.display = 'block';
        reportEl.className = 'scheme-import-report err';
        reportEl.textContent = data.error || 'Could not read that presentation.';
        importBtn.disabled = false; importBtn.textContent = 'Import';
        return;
      }
      // Show the review screen before saving anything
      renderImportReview(overlay, panel, data, close);
    } catch (err) {
      reportEl.style.display = 'block';
      reportEl.className = 'scheme-import-report err';
      reportEl.textContent = err.message;
      importBtn.disabled = false; importBtn.textContent = 'Import';
    }
  });
}

// Review screen shown after extraction, before the scheme is saved.
function renderImportReview(overlay, panel, data, close) {
  const { scheme, report } = data;
  const isColor = v => typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v);

  // [key, label, kind] — kind: 'font' | 'size' | 'color' | 'num' | 'text'
  const fmtVal = (key, label, kind) => {
    if (scheme[key] == null || scheme[key] === '') return '';
    let v = scheme[key];
    let disp;
    if (kind === 'color' && isColor(v)) {
      disp = `<span class="si-swatch" style="background:${esc(v)}"></span>${esc(v)}`;
    } else if (kind === 'font') {
      disp = esc(parseFontPS(v).family ? `${parseFontPS(v).family} ${parseFontPS(v).style}`.trim() : v);
    } else if (kind === 'size') {
      disp = `${esc(String(v))} pt`;
    } else if (kind === 'num') {
      disp = esc(String(Math.round(v * 100) / 100));
    } else {
      disp = esc(String(v));
    }
    return `<div class="si-rev-row"><span class="si-rev-k">${esc(label)}</span><span class="si-rev-v">${disp}</span></div>`;
  };
  const group = (title, rows) => {
    const html = rows.map(([k, l, kind]) => fmtVal(k, l, kind)).join('');
    return html ? `<div class="si-rev-group"><div class="si-rev-title">${esc(title)}</div>${html}</div>` : '';
  };

  const textRows = [
    ['bodyFont', 'Body font', 'font'], ['bodySize', 'Body size', 'size'],
    ['boldFont', 'Bold-in-body font', 'font'],
    ['titleFont', 'Reference font', 'font'], ['titleSize', 'Reference size', 'size'],
    ['startEndFont', 'Start/End font', 'font'], ['startEndSize', 'Start/End size', 'size'],
    ['bodyFill', 'Body fill', 'color'],
  ];
  const layoutRows = [
    ['canvasW', 'Canvas width', 'num'], ['canvasH', 'Canvas height', 'num'],
    ['bodyY', 'Body Y', 'num'], ['bodyH', 'Body height', 'num'],
    ['titleY', 'Reference bar Y', 'num'],
    ['gradientY', 'Gradient Y', 'num'], ['gradientH', 'Gradient height', 'num'],
    ['liveX', 'Live X', 'num'], ['queueW', 'Queue width', 'num'],
    ['startEndY', 'Start/End Y', 'num'],
  ];
  const transRows = [
    ['transitionType', 'Slide transition', 'text'],
    ['transitionDuration', 'Duration', 'size'],
  ];

  const warningsHtml = (report.warnings || []).length
    ? `<div class="si-rev-group si-rev-warn">
         <div class="si-rev-title">Heads up</div>
         <ul>${report.warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
       </div>` : '';

  overlay.querySelector('.scheme-import-modal').innerHTML = `
    <div class="warn-hdr"><span>Review imported scheme</span></div>
    <p class="scheme-import-help">
      From <strong>${esc(report.presentation)}</strong> — ${report.captured.length} setting${report.captured.length === 1 ? '' : 's'} detected
      across ${report.slideCounts.scripture || 0} scripture, ${report.slideCounts.point || 0} point and ${report.slideCounts.startEnd || 0} start/end slides.
      Review below, then save.
    </p>
    <div class="field" style="margin-bottom:10px">
      <label>Scheme name</label>
      <input type="text" id="si-name" value="${esc(`From ${report.presentation}`.slice(0, 60))}" maxlength="60">
    </div>
    <div class="si-review-groups">
      ${group('Text styles', textRows)}
      ${group('Layout', layoutRows)}
      ${group('Transitions', transRows)}
      ${warningsHtml}
    </div>
    <div class="warn-actions">
      <button class="warn-btn-cancel" id="si-back">Back</button>
      <button class="warn-btn-ok" id="si-save">Save scheme</button>
    </div>`;

  overlay.querySelector('#si-back').addEventListener('click', () => { close(); showSchemeImport(panel); });
  overlay.querySelector('#si-save').addEventListener('click', () => {
    const nameEl = overlay.querySelector('#si-name');
    const name = (nameEl.value || '').trim() || `From ${report.presentation}`;
    const merged = {
      ...DEFAULT_STYLE_SCHEME(), ...scheme,
      id: 'scheme_' + Date.now(),
      name: name.slice(0, 60),
      isDefault: false, isLocked: false,
    };
    state.styleSchemes.push(merged);
    state.activeSchemeId = merged.id;
    saveState(); syncStyleButton();
    close();
    renderStylePanel(panel);
    toast('success', 'Scheme imported', `Saved "${merged.name}" with ${report.captured.length} detected settings.`);
  });
}

async function runSchemeTest(scheme) {
  if (!scheme) return;
  const btn = document.getElementById('btn-scheme-test');
  const orig = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Testing…';

  const safeName   = scheme.name.replace(/\s+/g, '_');
  const prefix     = `SchemeTest_${safeName}`;
  const history    = loadGenHistory();
  const idx        = history.filter(e => (e.fileName || '').startsWith(prefix)).length + 1;
  const testName   = `${prefix}_${String(idx).padStart(3, '0')}`;

  const TEST_SPEC = {
    name: testName,
    deliverMode: true,
    includeResponseCard: true,
    style: (({ id: _a, name: _b, isDefault: _c, isLocked: _d, ...s }) => s)(scheme),
    slides: [
      { type: 'start' },

      // Short reference scripture — 1 body, no blank before
      {
        type: 'scripture',
        label: 'John 3:16',
        reference: 'John 3:16',
        bodies: [[
          { text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have ', bold: false },
          { text: 'eternal life', bold: true },
          { text: '.', bold: false },
        ]],
        propName: 'John 3:16',
      },

      // Long reference scripture — 2 bodies, mixed bold, blank before
      {
        type: 'scripture',
        label: '2 Corinthians 3:18',
        reference: '2 Corinthians 3:18',
        blankBefore: true,
        blankSpans: [{ text: 'Transition slide', bold: false }],
        bodies: [
          [
            { text: 'And we all, who with unveiled faces contemplate the Lord\'s glory, are being ', bold: false },
            { text: 'transformed', bold: true },
            { text: ' into his image with ever-increasing glory,', bold: false },
          ],
          [
            { text: 'which comes from the Lord, who is the Spirit.', bold: false },
          ],
        ],
        propName: '2 Corinthians 3:18',
      },

      // Point — single mode
      {
        type: 'point',
        mode: 'single',
        label: 'Point Single',
        bodyText: 'Create Opportunities',
        propName: 'Create Opportunities',
        blankBefore: true,
        blankSpans: [],
      },

      // Point — revealing mode (3 bullets)
      {
        type: 'point',
        mode: 'revealing',
        label: 'Revealing Points',
        title: 'Three Things',
        bullets: ['Create Opportunities', 'Go First', 'Stay Faithful'],
        propBaseName: 'ThreeThings',
        blankBefore: false,
      },

      // Blank text slide
      {
        type: 'blank',
        label: 'Blank Text',
        spans: [
          { text: 'This is a blank slide with ', bold: false },
          { text: 'bold text', bold: true },
          { text: ' mixed in.', bold: false },
        ],
      },

      // Image slide
      { type: 'image', label: 'Image Slide' },

      { type: 'end' },
    ],
  };

  try {
    const res  = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec: TEST_SPEC, fileName: testName }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Export failed');
    addGenHistoryEntry(data);
    showGenerateModal(data, TEST_SPEC);
  } catch (err) {
    toast('error', 'Test failed', err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = orig;
  }
}

async function runGenerate(downloadMode, btn, deliverMode = false) {
  if (!btn) btn = document.getElementById('btn-generate');

  btn.disabled = true;
  btn.textContent = 'Exporting…';

  const spec     = buildSpec();
  const fileName = spec.name;
  spec.deliverMode = true;
  spec.autoManagePro7 = state.config.autoManagePro7 !== false;

  const steps = [
    'Building presentation',
    'Writing to ProPresenter library',
    'Writing props',
  ];
  if (spec.autoManagePro7) {
    steps.unshift('Closing ProPresenter (if open)');
    steps.push('Relaunching ProPresenter');
  }
  showDeliveryOverlay(steps);
  const lastStep = steps.length - 1;

  try {
    updateDeliveryStep(0, false);
    const res  = await fetch('/api/generate', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ spec, fileName }),
    });
    const data = await res.json();
    if (data.ok) {
      // Mark all steps done in sequence for a smooth finish
      for (let i = 0; i <= lastStep; i++) {
        updateDeliveryStep(i, true);
        await new Promise(r => setTimeout(r, i === lastStep ? 500 : 250));
      }
      hideDeliveryOverlay();
      addGenHistoryEntry(data);
      showGenerateModal(data, spec);
    } else {
      hideDeliveryOverlay();
      toast('error', 'Export failed', data.error || 'Unknown error');
    }
  } catch (err) {
    hideDeliveryOverlay();
    toast('error', 'Network error', err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Export';
  }
}

function showProRunningModal() {
  const modal = document.getElementById('gen-modal');
  const body  = document.getElementById('gen-modal-body');
  const title = document.getElementById('gen-modal-title');
  if (!modal || !body) return;
  title.textContent = 'Quit ProPresenter first';
  body.innerHTML = `
    <p style="font-size:13px;color:var(--muted);line-height:1.5;margin-bottom:14px">
      Props are written to ProPresenter's config file, which Pro7 overwrites when it quits.
      Close ProPresenter, then export — it'll be ready to open when you're done.
    </p>
    <div style="text-align:right">
      <button id="pro-running-ok" style="background:var(--blue);color:#fff;border:none;border-radius:7px;padding:7px 18px;font-size:13px;font-weight:600;cursor:pointer">Got it</button>
    </div>`;
  modal.classList.add('open');
  document.getElementById('pro-running-ok')?.addEventListener('click', () => modal.classList.remove('open'));
  document.getElementById('gen-modal-close')?.addEventListener('click', () => modal.classList.remove('open'));
}

function triggerDownloads(data) {
  const dl = (b64, name) => {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const url   = URL.createObjectURL(new Blob([bytes], { type: 'application/octet-stream' }));
    const a     = Object.assign(document.createElement('a'), { href: url, download: name });
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  };
  dl(data.data, data.fileName);
  for (const p of (data.props || [])) dl(p.data, p.fileName);
}

function showWarningDialog(warnings, opts = {}) {
  const heading  = opts.heading  || 'Before you export';
  const okLabel  = opts.okLabel  || 'Export Anyway';
  const cancelLabel = opts.cancelLabel || 'Go Back';
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'warn-overlay';
    overlay.innerHTML = `
      <div class="warn-modal">
        <div class="warn-hdr">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L2 17h16L10 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
            <path d="M10 8v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="10" cy="14.5" r=".75" fill="currentColor"/>
          </svg>
          <span>${esc(heading)}</span>
        </div>
        <ul class="warn-list">${warnings.map(w => `<li>${esc(w)}</li>`).join('')}</ul>
        <div class="warn-actions">
          <button class="warn-btn-cancel">${esc(cancelLabel)}</button>
          <button class="warn-btn-ok">${esc(okLabel)}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.warn-btn-cancel').addEventListener('click', () => { overlay.remove(); resolve(false); });
    overlay.querySelector('.warn-btn-ok').addEventListener('click',     () => { overlay.remove(); resolve(true);  });
    overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); resolve(false); } });
  });
}

function showOutputModeDialog() {
  const modal = document.getElementById('gen-modal');
  const body  = document.getElementById('gen-modal-body');
  const title = document.getElementById('gen-modal-title');
  if (!modal || !body) return;
  title.innerHTML = 'How do you want to save?';
  body.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px">
      <button class="gen-ask-btn" id="gen-ask-local" style="justify-content:flex-start;gap:10px;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);cursor:pointer;font-size:13px;text-align:left">
        <strong>Save to folder</strong><br>
        <span style="color:var(--muted);font-size:12px">Write directly to your ProPresenter folder</span>
      </button>
      <button class="gen-ask-btn" id="gen-ask-deliver" style="justify-content:flex-start;gap:10px;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);cursor:pointer;font-size:13px;text-align:left">
        <strong>Deliver to Pro7</strong><br>
        <span style="color:var(--muted);font-size:12px">Save to Pro7 library and open in ProPresenter</span>
      </button>
      <button class="gen-ask-btn" id="gen-ask-download" style="justify-content:flex-start;gap:10px;padding:12px 14px;border-radius:8px;border:1px solid var(--border);background:var(--bg);cursor:pointer;font-size:13px;text-align:left">
        <strong>Download</strong><br>
        <span style="color:var(--muted);font-size:12px">Get a file download in your browser</span>
      </button>
    </div>
    <div style="margin-top:6px;text-align:right">
      <button id="gen-modal-cancel" style="background:none;border:none;color:var(--muted);font-size:13px;cursor:pointer">Cancel</button>
    </div>
  `;
  modal.classList.add('open');
  const btn = document.getElementById('btn-generate');
  const close = () => modal.classList.remove('open');
  document.getElementById('gen-ask-local')?.addEventListener('click', async () => { close(); await runGenerate(false, btn); });
  document.getElementById('gen-ask-deliver')?.addEventListener('click', async () => { close(); await runGenerate(false, btn, true); });
  document.getElementById('gen-ask-download')?.addEventListener('click', async () => { close(); await runGenerate(true, btn); });
  document.getElementById('gen-modal-cancel')?.addEventListener('click', close);
  document.getElementById('gen-modal-close')?.addEventListener('click', close);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function toast(type, title, detail) {
  const wrap = document.getElementById('toast-wrap');
  const el   = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<strong>${esc(title)}</strong><div class="toast-path">${esc(detail)}</div>`;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 7000);
}

// ─── PDF speaker notes ────────────────────────────────────────────────────────

let _pdfObjectUrl = null;
let _pdfZoom = 100;
let _styleTab = 'text';      // Text | Layout | Motion | Preview
let _motionTab = 'transitions'; // within Motion: transitions | build
let _layoutSel = null;          // selected region slug in the Layout visual preview

function attachPdfHandlers() {
  const zone      = document.getElementById('pdf-drop-zone');
  const fileIn    = document.getElementById('pdf-file-input');
  const browseBtn = document.getElementById('btn-pdf-browse');
  const clearBtn  = document.getElementById('btn-pdf-clear');
  if (!zone) return;

  function applyZoom() {
    const frame = document.getElementById('pdf-frame');
    const wrap  = document.getElementById('pdf-frame-wrap');
    if (!frame || !wrap) return;
    const scale = _pdfZoom / 100;
    // Scale the iframe content by transforming it within the wrapper
    frame.style.width       = `${100 / scale}%`;
    frame.style.height      = `${100 / scale}%`;
    frame.style.transform   = `scale(${scale})`;
    frame.style.transformOrigin = 'top left';
    document.getElementById('pdf-zoom-val').textContent = `${_pdfZoom}%`;
  }

  function loadPdf(file) {
    if (!file || file.type !== 'application/pdf') {
      toast('error', 'Not a PDF', 'Drop a .pdf file'); return;
    }
    if (_pdfObjectUrl) URL.revokeObjectURL(_pdfObjectUrl);
    _pdfObjectUrl = URL.createObjectURL(file);
    _pdfZoom = 100;
    document.getElementById('pdf-frame').src = _pdfObjectUrl;
    document.getElementById('pdf-viewer-name').textContent = file.name;
    document.getElementById('pdf-drop-zone').style.display = 'none';
    document.getElementById('pdf-viewer').style.display    = 'flex';
    document.getElementById('notes-panel')?.classList.add('pdf-open');
    applyZoom();
  }

  zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    loadPdf(e.dataTransfer.files[0]);
  });

  browseBtn?.addEventListener('click', () => fileIn?.click());
  fileIn?.addEventListener('change', e => loadPdf(e.target.files[0]));

  async function loadGdrivePdf(url) {
    if (!url) return;
    const loadBtn = document.getElementById('btn-pdf-gdrive-load');
    const orig = loadBtn.textContent;
    loadBtn.textContent = 'Loading…';
    loadBtn.disabled = true;
    try {
      const proxyUrl = `/api/gdrive-pdf?url=${encodeURIComponent(url)}`;
      const resp = await fetch(proxyUrl);
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: resp.statusText }));
        toast('error', 'Drive load failed', err.error || resp.statusText);
        return;
      }
      const blob = await resp.blob();
      if (_pdfObjectUrl) URL.revokeObjectURL(_pdfObjectUrl);
      _pdfObjectUrl = URL.createObjectURL(blob);
      _pdfZoom = 100;
      document.getElementById('pdf-frame').src = _pdfObjectUrl;
      document.getElementById('pdf-viewer-name').textContent = 'Google Drive';
      document.getElementById('pdf-drop-zone').style.display = 'none';
      document.getElementById('pdf-viewer').style.display    = 'flex';
      document.getElementById('notes-panel')?.classList.add('pdf-open');
      applyZoom();
      // Persist the Drive URL so it survives a reload / redeploy
      state.config.gdriveUrl = url;
      saveState();
    } catch (e) {
      toast('error', 'Drive load failed', e.message);
    } finally {
      loadBtn.textContent = orig;
      loadBtn.disabled = false;
    }
  }

  const gdriveInput = document.getElementById('pdf-gdrive-input');
  document.getElementById('btn-pdf-gdrive-load')?.addEventListener('click', () => {
    loadGdrivePdf(gdriveInput?.value.trim());
  });
  gdriveInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') loadGdrivePdf(gdriveInput.value.trim());
  });
  // Restore a previously-loaded Drive doc after a reload / redeploy
  if (gdriveInput && state.config.gdriveUrl) {
    gdriveInput.value = state.config.gdriveUrl;
    loadGdrivePdf(state.config.gdriveUrl);
  }

  document.getElementById('btn-pdf-zoom-in')?.addEventListener('click', () => {
    _pdfZoom = Math.min(_pdfZoom + 25, 200); applyZoom();
  });
  document.getElementById('btn-pdf-zoom-out')?.addEventListener('click', () => {
    _pdfZoom = Math.max(_pdfZoom - 25, 50); applyZoom();
  });

  clearBtn?.addEventListener('click', () => {
    if (_pdfObjectUrl) { URL.revokeObjectURL(_pdfObjectUrl); _pdfObjectUrl = null; }
    document.getElementById('pdf-frame').src           = '';
    document.getElementById('pdf-viewer').style.display = 'none';
    document.getElementById('pdf-drop-zone').style.display = 'flex';
    document.getElementById('notes-panel')?.classList.remove('pdf-open');
    if (fileIn) fileIn.value = '';
    if (gdriveInput) gdriveInput.value = '';
    // Forget the persisted Drive doc so it doesn't reload next launch
    state.config.gdriveUrl = '';
    saveState();
    _pdfZoom = 100;
  });
}

// ─── Generate overview modal ──────────────────────────────────────────────────

// ─── Generation history ───────────────────────────────────────────────────────

function loadGenHistory() {
  try { return JSON.parse(localStorage.getItem(GEN_HISTORY_KEY) || '[]'); } catch { return []; }
}
function saveGenHistory(h) {
  try { localStorage.setItem(GEN_HISTORY_KEY, JSON.stringify(h)); } catch (_) {}
}
function addGenHistoryEntry(data) {
  if (!data.presentationPath) return;
  const h = loadGenHistory();
  h.unshift({
    id: Date.now(),
    fileName: data.presentationPath.split('/').pop(),
    path: data.presentationPath,
    propsPath: data.props?.[0]?.path || null,
    propsBackup: data.propsBackup || null,
    sizeKB: data.presentationBytes ? Math.round(data.presentationBytes / 1024) : null,
    delivered: !!data.delivered,
    date: new Date().toISOString(),
  });
  saveGenHistory(h.slice(0, GEN_HISTORY_MAX));
  renderGenHistory();
  // Record in the library db, linked to the open deck
  libApi('/api/history', { method: 'POST', body: {
    deckId:    state.currentDeckId || '',
    fileName:  data.presentationPath.split('/').pop(),
    path:      data.presentationPath,
    sizeKB:    data.presentationBytes ? Math.round(data.presentationBytes / 1024) : 0,
    delivered: !!data.delivered,
  } }).then(r => {
    if (r.ok && state.currentDeckId) {
      const row = _libCache.find(d => d.id === state.currentDeckId);
      if (row) {
        row.dirty = 0;
        row.last_generated_at = new Date().toISOString();
        row.last_export_path  = data.presentationPath;
        if (data.delivered) row.last_delivered_at = row.last_generated_at;
      }
    }
  });
}

function renderGenHistory() {
  const panel = document.getElementById('gen-history-panel');
  const btn   = document.getElementById('btn-gen-history');
  if (!panel) return;
  const h = loadGenHistory();
  if (btn) btn.classList.toggle('has-items', h.length > 0);
  if (!h.length) {
    panel.innerHTML = `<div class="gen-history-empty">No exports yet</div>`;
    return;
  }
  const fmt = iso => {
    const d = new Date(iso);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    return isToday
      ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  panel.innerHTML = `
    <div class="gen-history-header">
      <span>Recent Exports</span>
      <button class="gen-history-clear" id="gen-history-clear">Clear</button>
    </div>
    ${h.map(e => `
      <div class="gen-history-item" data-path="${esc(e.path)}">
        <div class="ghi-icon">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M4 4h8l4 4v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M12 4v4h4" stroke="currentColor" stroke-width="1.4"/></svg>
        </div>
        <div class="ghi-info">
          <div class="ghi-name" title="${esc(e.path)}">${esc(e.fileName)}</div>
          <div class="ghi-meta">${e.delivered ? '⬆ Exported · ' : ''}${e.sizeKB ? e.sizeKB + ' KB · ' : ''}${fmt(e.date)}${e.propsBackup ? ' · 🛟 backup' : ''}</div>
        </div>
        ${e.propsBackup ? `<button class="ghi-restore" data-backup="${esc(e.propsBackup)}" title="Restore Pro7's props config to the state before this export">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M4 10a6 6 0 1 1 1.8 4.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 6v4h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>` : ''}
        <button class="ghi-reveal" data-path="${esc(e.path)}" title="Reveal in Finder">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none"><path d="M3 10h14M10 3l7 7-7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    `).join('')}
  `;
  document.getElementById('gen-history-clear')?.addEventListener('click', e => {
    e.stopPropagation();
    saveGenHistory([]);
    renderGenHistory();
  });
  panel.querySelectorAll('.ghi-reveal').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      fetch('/api/reveal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: btn.dataset.path }) });
    });
  });
  panel.querySelectorAll('.ghi-restore').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      restorePro7Backup(btn.dataset.backup);
    });
  });
}

async function restorePro7Backup(backupFile) {
  const ok = await showWarningDialog([
    "This restores ProPresenter's props configuration to the state it was in right before that export.",
    'Your current props config will be snapshotted first, so this is undoable.',
    'If ProPresenter is open it will be quit and relaunched.',
  ], { heading: 'Restore ProPresenter config', okLabel: 'Restore', cancelLabel: 'Cancel' });
  if (!ok) return;
  const autoManage = state.config.autoManagePro7 !== false;
  try {
    const res = await fetch('/api/pro7/restore', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: backupFile, autoManage }),
    });
    const data = await res.json();
    if (data.ok) {
      toast('success', 'Pro7 config restored', data.relaunched ? 'ProPresenter was relaunched.' : 'Restored the props configuration.');
    } else if (data.pro7Running) {
      toast('error', 'ProPresenter is open', 'Turn on Auto-manage ProPresenter, or close Pro7, then try again.');
    } else {
      toast('error', 'Restore failed', data.error || 'Unknown error');
    }
  } catch (err) {
    toast('error', 'Network error', err.message);
  }
}

function initGenHistory() {
  const menuBtn = document.getElementById('mm-gen-history');
  const panel   = document.getElementById('gen-history-panel');
  if (!menuBtn || !panel) return;
  renderGenHistory();
  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    const moreMenu = document.getElementById('header-more-menu');
    if (moreMenu) moreMenu.classList.remove('open');
    panel.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!panel.contains(e.target) && e.target !== menuBtn) panel.classList.remove('open');
  });
}

function showGenerateModal(data, spec) {
  const modal = document.getElementById('gen-modal');
  const body  = document.getElementById('gen-modal-body');
  const title = document.getElementById('gen-modal-title');
  if (!modal || !body) return;
  if (title) title.textContent = data.delivered ? 'Ready — open ProPresenter' : 'Generated';

  const counts = { scripture: 0, point: 0, blank: 0, image: 0, custom: 0 };
  for (const s of (spec.slides || [])) {
    if (counts[s.type] !== undefined) counts[s.type]++;
  }
  const totalSlides = (spec.slides || []).length;
  const presKB = data.presentationBytes ? Math.round(data.presentationBytes / 1024) : null;

  const chipColors = {
    scripture: '#e8f0fe', point: '#e8f5e9', blank: '#f3e5f5', image: '#fff3e0', custom: '#fce4ec'
  };
  const chipTextColors = {
    scripture: '#1565c0', point: '#2e7d32', blank: '#6a1b9a', image: '#bf360c', custom: '#880e4f'
  };

  const breakdownChips = Object.entries(counts)
    .filter(([, n]) => n > 0)
    .map(([type, n]) => `<span class="gen-breakdown-chip" style="background:${chipColors[type]};color:${chipTextColors[type]};border-color:${chipColors[type]}">${n} ${type}</span>`)
    .join('');

  const propSection = data.props && data.props.length
    ? `<div class="gen-modal-filename" style="margin-top:0">
        <div style="font-weight:600;color:var(--text);font-size:12px;margin-bottom:4px">${data.props.length} Prop file${data.props.length > 1 ? 's' : ''}</div>
        ${data.props.map(p => `<div>${esc(p.path)}</div>`).join('')}
      </div>`
    : '';

  body.innerHTML = `
    <div class="gen-modal-filename">${esc(data.presentationPath)}</div>
    <div class="gen-modal-stats">
      <div class="gen-stat">
        <div class="gen-stat-num">${totalSlides}</div>
        <div class="gen-stat-lbl">Total slides</div>
      </div>
      ${presKB ? `<div class="gen-stat">
        <div class="gen-stat-num">${presKB} KB</div>
        <div class="gen-stat-lbl">File size</div>
      </div>` : ''}
    </div>
    ${breakdownChips ? `<div class="gen-modal-breakdown">${breakdownChips}</div>` : ''}
    ${propSection}
    <div class="gen-modal-actions">
      ${data.presentationPath ? `<button id="gen-modal-reveal" class="btn-secondary">Reveal in Finder</button>` : ''}
      <button id="gen-modal-ok">Done</button>
    </div>
  `;

  modal.classList.add('open');
  const close = () => modal.classList.remove('open');
  document.getElementById('gen-modal-ok')?.addEventListener('click', close);
  document.getElementById('gen-modal-close')?.addEventListener('click', close);
  document.getElementById('gen-modal-reveal')?.addEventListener('click', () => {
    fetch('/api/reveal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: data.presentationPath }) });
  });
  modal.addEventListener('click', e => { if (e.target === modal) close(); }, { once: true });
}

// ─── Bible lookup ─────────────────────────────────────────────────────────────

async function lookupBibleVerse(slide, ref, overrideBibleId = '') {
  if (!ref) return;
  const btn = document.getElementById('btn-bible-lookup');
  if (btn) { btn.disabled = true; btn.textContent = '…'; }

  const { bibleApiKey, bibleId } = state.config;
  const resolvedBibleId = overrideBibleId || bibleId;
  if (!bibleApiKey || !resolvedBibleId) {
    toast('error', 'Bible not configured', 'Add your API key and pick a translation in Settings');
    if (btn) { btn.disabled = false; btn.textContent = 'Lookup'; }
    return;
  }

  try {
    const url = `/api/bible/search?apiKey=${encodeURIComponent(bibleApiKey)}&bibleId=${encodeURIComponent(resolvedBibleId)}&ref=${encodeURIComponent(ref)}`;
    const res  = await fetch(url);
    const data = await res.json();

    if (!data.ok) { toast('error', 'Verse not found', data.error || ref); return; }

    // Preserve hard line breaks (poetry). Collapse only horizontal whitespace; keep newlines.
    const text = (data.text || '')
      .replace(/\r\n?/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim();
    if (!text) { toast('error', 'No text returned', ref); return; }

    const spans = [{ text, bold: false }];
    if (!slide.bodies) slide.bodies = [[]];
    slide.bodies[0] = spans;

    // Auto-set reference if field is empty
    if (!slide.reference && data.reference) {
      slide.reference = data.reference;
      const refEl = document.getElementById('f-reference');
      if (refEl) refEl.value = data.reference;
      if (!slide._labelManual) {
        slide.label = data.reference;
        const lblEl = document.getElementById('f-label');
        if (lblEl) lblEl.value = data.reference;
      }
    }

    saveState();
    renderMain();
  } catch (err) {
    toast('error', 'Lookup failed', err.message);
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Lookup'; }
  }
}

// ─── Notes panel ─────────────────────────────────────────────────────────────

function spansToText(spans) {
  if (!spans || !spans.length) return '';
  return spans.map(s => s.text || '').join('');
}

function spansToHtml(spans) {
  if (!spans || !spans.length) return '';
  return spans.map(s => s.bold ? `<strong>${esc(s.text)}</strong>` : esc(s.text)).join('');
}

function renderNotesPanel() {
  const body = document.getElementById('notes-panel-body');
  if (!body) return;

  const contentSlides = state.slides.filter(s => !['start', 'end'].includes(s.type));

  if (!contentSlides.length) {
    body.innerHTML = `<div class="notes-empty">No slides yet</div>`;
    return;
  }

  let num = 0;
  body.innerHTML = contentSlides.map(slide => {
    num++;
    let bodyHtml = '';
    let refHtml  = '';

    if (slide.type === 'scripture') {
      const bodies = slide.bodies || [slide.body || []];
      bodyHtml = bodies.map(b => spansToHtml(b)).filter(Boolean).join('<br>— ');
      if (slide.reference) refHtml = `<div class="notes-entry-ref">${esc(slide.reference)}</div>`;
    } else if (slide.type === 'point') {
      if (slide.mode === 'revealing') {
        bodyHtml = (slide.bullets || []).map((b, i) => {
          const txt = esc(bulletToText(b));
          return `${i < (slide.bullets.length - 1) ? '' : '<strong>'} ${txt}${i < (slide.bullets.length - 1) ? '' : '</strong>'}`;
        }).join('<br>');
      } else {
        bodyHtml = `<strong>${esc(slide.bodyText || '')}</strong>`;
      }
    } else if (slide.type === 'blank') {
      bodyHtml = spansToHtml(slide.spans || []) || `<span style="color:var(--muted);font-style:italic">Blank</span>`;
    } else if (slide.type === 'image') {
      bodyHtml = `<span style="color:var(--muted);font-style:italic">Image</span>`;
    } else {
      bodyHtml = esc(slide.label || '');
    }

    return `
      <div class="notes-entry">
        <div class="notes-entry-hdr">
          <span class="notes-entry-num">${num}</span>
          <span class="notes-entry-label">${esc(slide.label || slide.reference || '')}</span>
        </div>
        ${bodyHtml ? `<div class="notes-entry-body">${bodyHtml}</div>` : ''}
        ${refHtml}
      </div>
    `;
  }).join('');

  // Response Card — appended to the outline so it's visible alongside the slides.
  // Click to open its editor (the "Response Card" item in the queue).
  const cfg = state.config;
  if (cfg.includeResponseCard) {
    const r = cfg.responses || {};
    const lines = [r.decisionText, r.r1, r.r2, r.r3].filter(x => x && x.trim());
    const rcBody = lines.length
      ? lines.map(esc).join('<br>')
      : `<span style="color:var(--muted);font-style:italic">No response text yet — click to add</span>`;
    body.insertAdjacentHTML('beforeend', `
      <div class="notes-entry notes-entry-rc" data-open-rc="1" style="cursor:pointer">
        <div class="notes-entry-hdr">
          <span class="notes-entry-num">RC</span>
          <span class="notes-entry-label">Response Card</span>
        </div>
        <div class="notes-entry-body">${rcBody}</div>
      </div>
    `);
    body.querySelector('[data-open-rc]')?.addEventListener('click', () => {
      state.activeId = 'rc'; render();
    });
  }
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  saveState();
  renderSidebar();
  renderMain();
  renderNotesPanel();
}

// ─── Pro7 connection helpers ──────────────────────────────────────────────────

function updateStatusDot() {
  const dot  = document.getElementById('pro7-dot');
  const text = document.getElementById('pro7-status-text');
  if (!dot) return;
  const connected = pro7rt.connected;
  dot.className = 'pro7-dot' + (connected ? ' connected' : '');
  const label = connected
    ? `Connected${pro7rt.version ? ' — ' + pro7rt.version : ''}`
    : 'Not connected';
  dot.title = `Pro7 ${label.toLowerCase()}`;
  if (text) text.textContent = label;
}

async function checkPro7(silent = false) {
  const port     = state.config.pro7Port || 1025;
  const password = state.config.pro7Password || '';
  try {
    const res  = await fetch(`/api/pro7/status?port=${port}&password=${encodeURIComponent(password)}`);
    const data = await res.json();
    pro7rt.connected = !!(data.ok && data.connected);
    if (pro7rt.connected && data.data) {
      const v = data.data;
      pro7rt.version = v.applicationVersion
        ? `${v.applicationVersion.major || ''}.${v.applicationVersion.minor || ''}`
        : null;
    } else {
      pro7rt.version = null;
    }
    if (pro7rt.connected) await fetchPro7Macros(true);
  } catch (_) {
    pro7rt.connected = false;
    pro7rt.version   = null;
  }
  updateStatusDot();
  if (!silent && document.getElementById('pro7-connect-status'))
    renderPro7StatusInPanel();
}

async function fetchPro7Macros(silent = false) {
  if (!pro7rt.connected) return;
  const port     = state.config.pro7Port || 1025;
  const password = state.config.pro7Password || '';
  try {
    const res  = await fetch(`/api/pro7/macros?port=${port}&password=${encodeURIComponent(password)}`);
    const data = await res.json();
    if (data.ok && Array.isArray(data.macros)) {
      pro7rt.liveMacros = data.macros;
    }
  } catch (_) {}
  if (!silent && document.getElementById('macro-live-panel'))
    renderMacroPicker();
}

async function loadFonts() {
  if (_fontList) return _fontList;

  // Try browser queryLocalFonts API first (Chrome 103+ with local-fonts permission)
  if (typeof queryLocalFonts === 'function') {
    try {
      const fonts = await queryLocalFonts();
      _fontFamilyMap = {};
      for (const { family, style, postscriptName } of fonts) {
        if (!_fontFamilyMap[family]) _fontFamilyMap[family] = [];
        _fontFamilyMap[family].push({ style, postscript: postscriptName });
      }
      _fontList = fonts.map(f => f.postscriptName).sort((a, b) => a.localeCompare(b));
      if (state.activeId === 'style') {
        const panel = document.getElementById('main-panel');
        if (panel) renderStylePanel(panel);
      }
      return _fontList;
    } catch (_) { /* permission denied or unsupported — fall through */ }
  }

  // Fall back to server endpoint
  try {
    const res  = await fetch('/api/fonts');
    const data = await res.json();
    _fontList = data.ok ? data.fonts : [];
    // Use the pre-built fontMap from the server if available (accurate family/style data)
    if (data.ok && data.fontMap && Object.keys(data.fontMap).length) {
      _fontFamilyMap = data.fontMap;
    } else {
      buildFontFamilyMap();
    }
  } catch (_) { _fontList = []; buildFontFamilyMap(); }
  // Re-render style panel if it's currently open so selects populate
  if (state.activeId === 'style') {
    const panel = document.getElementById('main-panel');
    if (panel) renderStylePanel(panel);
  }
  return _fontList;
}

function buildFontFamilyMap() {
  if (!_fontList) return;
  const map = {};
  for (const ps of _fontList) {
    const idx = ps.lastIndexOf('-');
    const family = idx === -1 ? ps          : ps.slice(0, idx);
    const style  = idx === -1 ? 'Regular'   : ps.slice(idx + 1);
    if (!map[family]) map[family] = [];
    map[family].push({ style, postscript: ps });
  }
  _fontFamilyMap = map;
}

function parseFontPS(psName) {
  if (!psName) return { family: '', style: 'Regular' };
  const idx = psName.lastIndexOf('-');
  if (idx === -1) return { family: psName, style: 'Regular' };
  return { family: psName.slice(0, idx), style: psName.slice(idx + 1) };
}

function validateFont(name) {
  if (!_fontList) return null;  // not loaded yet
  return _fontList.includes(name);
}

function renderPro7StatusInPanel() {
  const el = document.getElementById('pro7-connect-status');
  if (!el) return;
  if (pro7rt.connected) {
    el.textContent = `Connected${pro7rt.version ? ' — ' + pro7rt.version : ''}`;
    el.className = 'pro7-connect-status ok';
  } else {
    el.textContent = 'Not connected — check Pro7 is running and Network API is enabled';
    el.className = 'pro7-connect-status err';
  }
}

function renderMacroPicker() {
  const el = document.getElementById('macro-live-panel');
  if (!el || !pro7rt.liveMacros) return;
  // Show a datalist that macro inputs can reference
  let dl = document.getElementById('macro-datalist');
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = 'macro-datalist';
    document.body.appendChild(dl);
  }
  dl.innerHTML = pro7rt.liveMacros.map(m =>
    `<option value="${esc(m.id?.uuid?.string || '')}" label="${esc(m.name?.string || '')}">` +
    `${esc(m.name?.string || '')} — ${esc(m.id?.uuid?.string || '')}`
  ).join('');
  el.innerHTML = `<div class="macro-live-header">Live macros from Pro7 (${pro7rt.liveMacros.length})</div>`
    + pro7rt.liveMacros.map(m => {
      const uuid = m.id?.uuid?.string || '';
      const name = m.name?.string || '';
      return `<div class="macro-live-row"><span class="macro-live-name">${esc(name)}</span><code class="macro-live-uuid">${esc(uuid)}</code></div>`;
    }).join('');
}

// ─── Deck Library ────────────────────────────────────────────────────────────

// ─── Deck Library (server-backed, SQLite) ────────────────────────────────────

const LEGACY_DECKS_KEY = 'deckpro_saved_decks';

let _libCache  = [];      // deck metadata rows from the library db (no state)
let _libReady  = false;
let _libStatus = null;    // /api/library/status payload
let _deckBaseStamp = null;     // optimistic-concurrency stamp for the open deck
let _conflictPrompted = false;

async function libApi(url, opts = {}) {
  try {
    const res = await fetch(url, {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json' },
      ...(opts.body !== undefined ? { body: JSON.stringify(opts.body) } : {}),
    });
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function refreshLibCache() {
  const data = await libApi('/api/decks');
  if (data.ok) { _libCache = data.decks || []; _libReady = true; }
  return _libCache;
}

function loadDecks() { return _libCache; }

async function initLibrary() {
  // One-time migration: move localStorage decks into the library database
  try {
    const legacyRaw = localStorage.getItem(LEGACY_DECKS_KEY);
    if (legacyRaw) {
      const legacyDecks = JSON.parse(legacyRaw) || [];
      if (legacyDecks.length) {
        const r = await libApi('/api/library/migrate', { method: 'POST', body: { decks: legacyDecks, history: loadGenHistory() } });
        if (r.ok) {
          try { localStorage.setItem(LEGACY_DECKS_KEY + '_backup', legacyRaw); } catch (_) {}
          localStorage.removeItem(LEGACY_DECKS_KEY);
          if (r.imported > 0) {
            toast('success', 'Library upgraded', `${r.imported} deck${r.imported === 1 ? '' : 's'} moved into the new library database`);
          }
        }
      } else {
        localStorage.removeItem(LEGACY_DECKS_KEY);
      }
    }
  } catch (_) { /* migration is retried on next launch if it fails */ }

  _libStatus = await libApi('/api/library/status');
  await refreshLibCache();

  const cur = _libCache.find(d => d.id === state.currentDeckId);
  _deckBaseStamp = cur ? cur.updated_at : null;

  // Pull export history from the library db into the local panel cache
  const hist = await libApi('/api/history?limit=30');
  if (hist.ok && hist.history?.length) {
    saveGenHistory(hist.history.map(h => ({
      id: h.id, fileName: h.file_name, path: h.path,
      sizeKB: h.size_kb || null, delivered: !!h.delivered, date: h.created_at,
    })));
    renderGenHistory();
  }

  renderDecksList();
}

function deckSaveBody() {
  return {
    series:   state.config.seriesName   || '',
    title:    state.config.messageTitle || '',
    date:     state.config.weekDate     || '',
    speaker:  state.config.speaker      || '',
    schemeId: state.activeSchemeId      || '',
    state,
    baseUpdatedAt: _deckBaseStamp,
  };
}

async function autosaveDeck() {
  if (!state.currentDeckId) return; // draft — never auto-promote to library
  const id = state.currentDeckId;
  const r  = await libApi(`/api/decks/${id}`, { method: 'PUT', body: deckSaveBody() });
  if (r.ok) {
    _deckBaseStamp = r.updatedAt;
    const row = _libCache.find(d => d.id === id);
    if (row) {
      row.series      = state.config.seriesName   || '';
      row.title       = state.config.messageTitle || '';
      row.date        = state.config.weekDate     || '';
      row.speaker     = state.config.speaker      || '';
      row.slide_count = state.slides.filter(s => !['start', 'end'].includes(s.type)).length;
      row.updated_at  = r.updatedAt;
      row.dirty       = 1;
    } else {
      await refreshLibCache();
    }
  } else if (r.conflict) {
    handleSaveConflict(id);
  }
}

async function handleSaveConflict(id) {
  if (_conflictPrompted) return;
  _conflictPrompted = true;
  const keepMine = window.confirm(
    'This deck was changed somewhere else — most likely on another computer sharing this library.\n\n' +
    'OK — keep THIS version (overwrites the library copy)\n' +
    'Cancel — load the library version (discards local edits)'
  );
  try {
    if (keepMine) {
      const r = await libApi(`/api/decks/${id}`, { method: 'PUT', body: { ...deckSaveBody(), force: true } });
      if (r.ok) _deckBaseStamp = r.updatedAt;
    } else {
      await loadDeckState(id);
    }
  } finally {
    _conflictPrompted = false;
  }
}

async function deleteDeck(id) { // soft delete → Trash
  await libApi(`/api/decks/${id}`, { method: 'DELETE' });
  const row = _libCache.find(d => d.id === id);
  if (row) row.status = 'deleted';
  if (state.currentDeckId === id) { state.currentDeckId = null; _deckBaseStamp = null; }
  renderDecksList();
}

async function purgeDeck(id) {
  await libApi(`/api/decks/${id}?hard=1`, { method: 'DELETE' });
  _libCache = _libCache.filter(d => d.id !== id);
  renderDecksList();
}

async function setDeckStatus(id, status) {
  await libApi(`/api/decks/${id}/status`, { method: 'POST', body: { status } });
  const row = _libCache.find(d => d.id === id);
  if (row) row.status = status;
  renderDecksList();
}

async function toggleDeckTemplate(id) {
  const row = _libCache.find(d => d.id === id);
  const on  = row ? !row.is_template : true;
  await libApi(`/api/decks/${id}/template`, { method: 'POST', body: { isTemplate: on } });
  if (row) row.is_template = on ? 1 : 0;
  renderDecksList();
}

async function duplicateDeckAction(id) {
  const newId = crypto.randomUUID();
  const r = await libApi(`/api/decks/${id}/duplicate`, { method: 'POST', body: { newId } });
  if (r.ok) await refreshLibCache();
  renderDecksList();
}

async function loadDeckState(id) {
  const r = await libApi(`/api/decks/${id}`);
  if (!r.ok || !r.deck?.state) {
    toast('error', 'Could not open deck', r.error || 'Deck state missing');
    return;
  }
  state = r.deck.state;
  state.currentDeckId = id;
  _deckBaseStamp = r.deck.updated_at;
  libApi(`/api/decks/${id}/opened`, { method: 'POST' });
  const row = _libCache.find(d => d.id === id);
  if (row) row.last_opened_at = new Date().toISOString();
  _undoStack.length = 0; _redoStack.length = 0;
  saveState();
  clearTimeout(_autosaveTimer); // opening a deck isn't an edit — skip the echo save
  render();
  syncHeaderInputs();
  updateUndoButtons?.();
}

async function newDeck({ series = '', title = '', date = '', schemeId = null, speaker = '', fromTemplateId = null } = {}) {
  let s = null;
  if (fromTemplateId) {
    const r = await libApi(`/api/decks/${fromTemplateId}`);
    if (r.ok && r.deck?.state) s = JSON.parse(JSON.stringify(r.deck.state));
  }
  if (!s) s = DEFAULT_STATE();
  s.config.seriesName   = series;
  s.config.messageTitle = title;
  s.config.speaker      = speaker;
  s.config.weekDate     = date || new Date().toISOString().slice(0, 10);
  // Carry over settings that should persist across decks
  s.config.pro7Port      = state.config.pro7Port;
  s.config.pro7Password  = state.config.pro7Password;
  s.config.outputFolder  = state.config.outputFolder;
  s.config.outputMode    = state.config.outputMode;
  s.config.bibleApiKey   = state.config.bibleApiKey;
  s.config.bibleId       = state.config.bibleId;
  s.config.bibleName     = state.config.bibleName;
  s.config.bibleList     = state.config.bibleList;
  s.config.macros        = state.config.macros;
  s.config.features      = state.config.features;
  s.config.recentSeries  = state.config.recentSeries;
  if (!fromTemplateId) s.styleSchemes = state.styleSchemes;
  s.activeSchemeId = schemeId || s.activeSchemeId || state.activeSchemeId;
  s.currentDeckId  = crypto.randomUUID();
  s.activeId       = 'start';
  if (series) {
    const recent = state.config.recentSeries || [];
    s.config.recentSeries = [series, ...recent.filter(x => x !== series)].slice(0, 12);
  }
  state = s;
  _deckBaseStamp = null;
  _undoStack.length = 0; _redoStack.length = 0;
  saveState();
  clearTimeout(_autosaveTimer);
  render();
  syncHeaderInputs();
  updateUndoButtons?.();
  await autosaveDeck(); // create the library row immediately
  renderDecksList();
}

// ─── Library UI ───────────────────────────────────────────────────────────────

let _deckSort      = 'date';
let _deckFilter    = 'active';
let _deckSearch    = '';
let _editingDeckId = null;
let _openMenuId    = null;

function deckDateLabel(raw) {
  if (!raw) return '';
  return new Date(raw + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function relTime(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function deckEditFormHtml(deck) {
  return `
    <div class="deck-item deck-item--editing" data-id="${deck.id}">
      <div class="deck-edit-fields">
        <input class="deck-edit-input" id="de-series" placeholder="Series" value="${esc(deck.series || '')}" spellcheck="true">
        <input class="deck-edit-input" id="de-title"  placeholder="Title"  value="${esc(deck.title  || '')}" spellcheck="true">
        <input class="deck-edit-input" id="de-speaker" placeholder="Speaker" value="${esc(deck.speaker || '')}" spellcheck="true">
        <input class="deck-edit-input deck-edit-date" id="de-date" type="date" value="${esc(deck.date || '')}">
        <label class="deck-edit-qr-wrap" title="QR Code">
          <div class="toggle${deck._qrOn ? ' on' : ''}" id="de-qr-toggle"></div>
          QR
        </label>
      </div>
      <div class="deck-edit-actions">
        <button class="btn-deck-edit-save" data-id="${deck.id}">Save</button>
        <button class="btn-deck-edit-cancel">Cancel</button>
      </div>
    </div>`;
}

function deckRowHtml(deck) {
  if (deck.id === _editingDeckId) return deckEditFormHtml(deck);

  const isCurrent = deck.id === state.currentDeckId;
  const inTrash   = deck.status === 'deleted';
  const series    = deck.series || '';
  const title     = deck.title  || '';
  const dateLabel = deckDateLabel(deck.date);

  const metaBits = [
    dateLabel,
    deck.speaker ? esc(deck.speaker) : '',
    deck.slide_count != null ? `${deck.slide_count} slides` : '',
  ].filter(Boolean).join(' · ');

  let exportLine;
  if (deck.last_generated_at) {
    exportLine = `<span class="deck-export-ok">⬆ ${relTime(deck.last_generated_at)}</span>` +
      (deck.dirty ? `<span class="deck-dirty-lbl" title="Edited since last export">· edited since</span>` : '');
  } else {
    exportLine = `<span class="deck-never-exported">never exported</span>`;
  }

  const badges = [
    isCurrent ? '<span class="deck-current-badge">Open</span>' : '',
    deck.is_template ? '<span class="deck-template-badge">Template</span>' : '',
    deck.status === 'archived' ? '<span class="deck-archived-badge">Archived</span>' : '',
  ].join('');

  const menuItems = inTrash ? `
    <button class="deck-menu-item" data-act="restore" data-id="${deck.id}">Restore</button>
    <button class="deck-menu-item deck-menu-item--danger" data-act="purge" data-id="${deck.id}">Delete Forever</button>
  ` : `
    <button class="deck-menu-item" data-act="edit" data-id="${deck.id}">Edit Info</button>
    <button class="deck-menu-item" data-act="duplicate" data-id="${deck.id}">Duplicate</button>
    <button class="deck-menu-item" data-act="template" data-id="${deck.id}">${deck.is_template ? 'Remove from Templates' : 'Save as Template'}</button>
    <button class="deck-menu-item" data-act="${deck.status === 'archived' ? 'unarchive' : 'archive'}" data-id="${deck.id}">${deck.status === 'archived' ? 'Unarchive' : 'Archive'}</button>
    ${deck.last_export_path ? `<button class="deck-menu-item" data-act="reveal" data-id="${deck.id}">Reveal Last Export</button>` : ''}
    <button class="deck-menu-item deck-menu-item--danger" data-act="trash" data-id="${deck.id}">Delete</button>
  `;

  return `
    <div class="deck-item${isCurrent ? ' deck-item--current' : ''}" data-id="${deck.id}">
      <div class="deck-item-info">
        ${badges}
        <div class="deck-item-name">
          ${series ? `<span class="deck-item-series">${esc(series)}</span>` : ''}
          ${series && title ? '<span class="deck-item-sep">—</span>' : ''}
          ${title  ? `<span class="deck-item-title">${esc(title)}</span>`  : ''}
          ${!series && !title ? '<span class="deck-item-untitled">Untitled</span>' : ''}
        </div>
        <div class="deck-item-meta">${metaBits}${metaBits ? ' · ' : ''}${exportLine}</div>
      </div>
      <div class="deck-item-actions">
        ${!isCurrent && !inTrash ? `<button class="btn-deck-load" data-id="${deck.id}">Open</button>` : ''}
        <button class="btn-deck-menu" data-id="${deck.id}" title="Actions">⋯</button>
        ${_openMenuId === deck.id ? `<div class="deck-menu">${menuItems}</div>` : ''}
      </div>
    </div>`;
}

function renderDecksList() {
  const list = document.getElementById('decks-list');
  if (!list) return;
  if (!_libReady) {
    list.innerHTML = `<div class="deck-empty">Loading library…</div>`;
    updateDeckFooter(0);
    return;
  }

  const q = _deckSearch.trim().toLowerCase();
  const decks = _libCache.filter(d => {
    if (_deckFilter === 'active')         { if (d.status !== 'active' || d.is_template) return false; }
    else if (_deckFilter === 'templates') { if (!d.is_template || d.status === 'deleted') return false; }
    else if (_deckFilter === 'archived')  { if (d.status !== 'archived') return false; }
    else if (_deckFilter === 'deleted')   { if (d.status !== 'deleted') return false; }
    if (q && !(`${d.series} ${d.title} ${d.speaker} ${d.date}`.toLowerCase().includes(q))) return false;
    return true;
  });

  if (_deckSort === 'series') {
    decks.sort((a, b) => (a.series || '').localeCompare(b.series || '') || (b.date || '').localeCompare(a.date || ''));
  } else if (_deckSort === 'updated') {
    decks.sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
  } else {
    decks.sort((a, b) => (b.date || b.updated_at || '').localeCompare(a.date || a.updated_at || ''));
  }

  // Draft row — working state not yet in the library
  const showDraft = !state.currentDeckId && _deckFilter === 'active' && !q;
  const draftHtml = showDraft ? `
    <div class="deck-item deck-item--draft" id="deck-draft-item">
      <div class="deck-item-info">
        <span class="deck-draft-badge">Draft</span>
        <div class="deck-item-name"><span class="deck-item-untitled">Unsaved deck</span></div>
        <div class="deck-item-meta">${state.slides.filter(s => !['start', 'end'].includes(s.type)).length} slides · not in library</div>
      </div>
      <div class="deck-item-actions">
        <button class="btn-deck-save-draft" id="btn-save-draft">Save to Library</button>
      </div>
    </div>
    <div class="save-draft-form hidden" id="save-draft-form">
      <div class="deck-edit-fields">
        <input class="deck-edit-input" id="sd-series" placeholder="Series" list="series-datalist" spellcheck="true">
        <input class="deck-edit-input" id="sd-title"  placeholder="Title" spellcheck="true">
        <input class="deck-edit-input deck-edit-date" id="sd-date" type="date" value="${new Date().toISOString().slice(0, 10)}">
      </div>
      <div class="deck-edit-actions">
        <button class="btn-deck-edit-save" id="btn-sd-confirm">Save</button>
        <button class="btn-deck-edit-cancel" id="btn-sd-cancel">Cancel</button>
      </div>
    </div>` : '';

  let rows = '';
  if (_deckSort === 'series' && decks.length) {
    let lastSeries = null;
    for (const d of decks) {
      const s = d.series || 'No Series';
      if (s !== lastSeries) { rows += `<div class="deck-group-head">${esc(s)}</div>`; lastSeries = s; }
      rows += deckRowHtml(d);
    }
  } else {
    rows = decks.map(deckRowHtml).join('');
  }

  if (!decks.length && !showDraft) {
    const msgs = {
      active:    'No decks yet. Hit <strong>+ New Deck</strong> to start one.',
      templates: 'No templates yet — open a deck\u2019s ⋯ menu and choose Save as Template.',
      archived:  'Nothing archived.',
      deleted:   'Trash is empty.',
    };
    rows = `
      <div class="deck-empty">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <rect x="2" y="6" width="20" height="14" rx="2"/>
          <path d="M2 10h20M7 3h10"/>
        </svg>
        ${q ? 'No decks match your search.' : msgs[_deckFilter]}
      </div>`;
  }

  list.innerHTML = draftHtml + rows;
  updateDeckFooter(decks.length);
}

function updateDeckFooter(visible) {
  const el = document.getElementById('decks-modal-footer');
  if (!el) return;
  const total = _libCache.length;
  const loc = _libStatus?.libraryDir ? _libStatus.libraryDir.replace(/^\/Users\/[^/]+/, '~') : '';
  el.innerHTML = `${total} deck${total === 1 ? '' : 's'} in library${loc ? ` · <span class="deck-footer-loc" title="${esc(_libStatus.libraryDir)}">${esc(loc)}</span>` : ''}`;
}

function initDecks() {
  const modal = document.getElementById('decks-modal');
  const close = document.getElementById('decks-modal-close');
  const list  = document.getElementById('decks-list');
  if (!modal) return;

  function openModal() {
    renderDecksList();
    modal.classList.add('open');
    const sel = document.getElementById('nd-scheme');
    if (sel) {
      sel.innerHTML = state.styleSchemes.map(sc =>
        `<option value="${esc(sc.id)}"${sc.id === state.activeSchemeId ? ' selected' : ''}>${esc(sc.name)}</option>`
      ).join('');
    }
    const tsel = document.getElementById('nd-template');
    if (tsel) {
      const templates = _libCache.filter(d => d.is_template && d.status !== 'deleted');
      tsel.innerHTML = '<option value="">Blank deck</option>' + templates.map(t =>
        `<option value="${esc(t.id)}">${esc([t.series, t.title].filter(Boolean).join(' — ') || 'Untitled')}</option>`
      ).join('');
    }
    const dl = document.getElementById('series-datalist');
    if (dl) {
      dl.innerHTML = (state.config.recentSeries || []).map(r => `<option value="${esc(r)}">`).join('');
    }
    // Refresh from db in the background (picks up changes from other machines)
    refreshLibCache().then(renderDecksList);
  }

  document.getElementById('btn-decks')?.addEventListener('click', openModal);
  document.getElementById('deck-header-meta')?.addEventListener('click', openModal);
  close?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

  // Search
  document.getElementById('deck-search')?.addEventListener('input', e => {
    _deckSearch = e.target.value;
    _openMenuId = null;
    renderDecksList();
  });

  // Filter + sort tabs
  modal.addEventListener('click', e => {
    const filterBtn = e.target.closest('.deck-filter-btn');
    if (filterBtn) {
      _deckFilter = filterBtn.dataset.filter;
      _openMenuId = null; _editingDeckId = null;
      modal.querySelectorAll('.deck-filter-btn').forEach(b => b.classList.toggle('active', b === filterBtn));
      renderDecksList();
      return;
    }
    const sortBtn = e.target.closest('.deck-sort-btn');
    if (sortBtn) {
      _deckSort = sortBtn.dataset.sort;
      modal.querySelectorAll('.deck-sort-btn').forEach(b => b.classList.toggle('active', b === sortBtn));
      renderDecksList();
    }
  });

  // New Deck form
  document.getElementById('btn-new-deck')?.addEventListener('click', () => {
    const form = document.getElementById('new-deck-form');
    form?.classList.toggle('hidden');
    if (!form?.classList.contains('hidden')) {
      document.getElementById('nd-series').value  = '';
      document.getElementById('nd-title').value   = '';
      document.getElementById('nd-speaker').value = '';
      document.getElementById('nd-date').value    = new Date().toISOString().slice(0, 10);
    }
  });
  document.getElementById('btn-nd-cancel')?.addEventListener('click', () => {
    document.getElementById('new-deck-form')?.classList.add('hidden');
  });
  document.getElementById('btn-nd-create')?.addEventListener('click', async () => {
    const series   = document.getElementById('nd-series')?.value.trim()  || '';
    const title    = document.getElementById('nd-title')?.value.trim()   || '';
    const speaker  = document.getElementById('nd-speaker')?.value.trim() || '';
    const date     = document.getElementById('nd-date')?.value           || '';
    const schemeId = document.getElementById('nd-scheme')?.value         || null;
    const fromTemplateId = document.getElementById('nd-template')?.value || null;
    document.getElementById('new-deck-form')?.classList.add('hidden');
    modal.classList.remove('open');
    await newDeck({ series, title, date, schemeId, speaker, fromTemplateId });
  });

  // Save-draft form
  list?.addEventListener('click', e => {
    if (e.target.closest('#btn-save-draft')) {
      document.getElementById('save-draft-form')?.classList.toggle('hidden');
      return;
    }
    if (e.target.closest('#btn-sd-cancel')) {
      document.getElementById('save-draft-form')?.classList.add('hidden');
      return;
    }
    if (e.target.closest('#btn-sd-confirm')) {
      const series = document.getElementById('sd-series')?.value.trim() || '';
      const title  = document.getElementById('sd-title')?.value.trim()  || '';
      const date   = document.getElementById('sd-date')?.value          || '';
      state.currentDeckId       = crypto.randomUUID();
      state.config.seriesName   = series || state.config.seriesName;
      state.config.messageTitle = title  || state.config.messageTitle;
      state.config.weekDate     = date   || state.config.weekDate;
      if (series) {
        const recent = state.config.recentSeries || [];
        state.config.recentSeries = [series, ...recent.filter(s => s !== series)].slice(0, 12);
      }
      _deckBaseStamp = null;
      autosaveDeck().then(renderDecksList);
      saveState();
      clearTimeout(_autosaveTimer);
      syncHeaderInputs();
      return;
    }
  });

  // Row interactions (open / edit / action menu)
  list?.addEventListener('click', async e => {
    const loadBtn    = e.target.closest('.btn-deck-load');
    const menuBtn    = e.target.closest('.btn-deck-menu');
    const menuItem   = e.target.closest('.deck-menu-item');
    const saveEdit   = e.target.closest('.btn-deck-edit-save:not(#btn-sd-confirm)');
    const cancelEdit = e.target.closest('.btn-deck-edit-cancel:not(#btn-sd-cancel)');
    const qrToggle   = e.target.closest('#de-qr-toggle');

    if (qrToggle) { qrToggle.classList.toggle('on'); return; }

    if (menuBtn) {
      _openMenuId = _openMenuId === menuBtn.dataset.id ? null : menuBtn.dataset.id;
      renderDecksList();
      return;
    }

    if (menuItem) {
      const id  = menuItem.dataset.id;
      const act = menuItem.dataset.act;
      _openMenuId = null;
      if (act === 'edit') {
        const row = _libCache.find(d => d.id === id);
        if (row) {
          // Pull QR state for the edit form (only known client-side for the open deck)
          row._qrOn = id === state.currentDeckId ? !!state.config.qrCode : !!row._qrOn;
        }
        _editingDeckId = id;
        renderDecksList();
      }
      else if (act === 'duplicate')  await duplicateDeckAction(id);
      else if (act === 'template')   await toggleDeckTemplate(id);
      else if (act === 'archive')    await setDeckStatus(id, 'archived');
      else if (act === 'unarchive')  await setDeckStatus(id, 'active');
      else if (act === 'restore')    await setDeckStatus(id, 'active');
      else if (act === 'trash')      await deleteDeck(id);
      else if (act === 'purge') {
        if (window.confirm('Permanently delete this deck? This cannot be undone.')) await purgeDeck(id);
      }
      else if (act === 'reveal') {
        const row = _libCache.find(d => d.id === id);
        if (row?.last_export_path) {
          fetch('/api/reveal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filePath: row.last_export_path }) });
        }
      }
      renderDecksList();
      return;
    }

    if (saveEdit) {
      const id      = saveEdit.dataset.id;
      const series  = document.getElementById('de-series')?.value.trim()  || '';
      const title   = document.getElementById('de-title')?.value.trim()   || '';
      const speaker = document.getElementById('de-speaker')?.value.trim() || '';
      const date    = document.getElementById('de-date')?.value           || '';
      const qrOn    = document.getElementById('de-qr-toggle')?.classList.contains('on') ?? false;
      const r = await libApi(`/api/decks/${id}/info`, { method: 'POST', body: { series, title, date, speaker, qrCode: qrOn } });
      const row = _libCache.find(d => d.id === id);
      if (row) { row.series = series; row.title = title; row.date = date; row.speaker = speaker; if (r.updatedAt) row.updated_at = r.updatedAt; }
      if (id === state.currentDeckId) {
        state.config.seriesName   = series;
        state.config.messageTitle = title;
        state.config.weekDate     = date;
        state.config.speaker      = speaker;
        state.config.qrCode       = qrOn;
        if (r.updatedAt) _deckBaseStamp = r.updatedAt;
        saveState();
        clearTimeout(_autosaveTimer);
        syncHeaderInputs();
      }
      if (series) {
        const recent = state.config.recentSeries || [];
        state.config.recentSeries = [series, ...recent.filter(s => s !== series)].slice(0, 12);
      }
      _editingDeckId = null;
      renderDecksList();
      return;
    }
    if (cancelEdit) {
      _editingDeckId = null;
      renderDecksList();
      return;
    }

    if (loadBtn) {
      _editingDeckId = null;
      _openMenuId = null;
      modal.classList.remove('open');
      await loadDeckState(loadBtn.dataset.id);
    }
  });

  // Click outside closes any open action menu
  document.addEventListener('click', e => {
    if (_openMenuId && !e.target.closest('.deck-menu') && !e.target.closest('.btn-deck-menu')) {
      _openMenuId = null;
      renderDecksList();
    }
  });
}

// ─── Self-update ──────────────────────────────────────────────────────────────

let _updateInfo = null;

async function checkForUpdates(manual = false) {
  let data = null;
  try {
    data = await fetch('/api/update/check').then(r => r.json());
  } catch (_) { data = { ok: false, error: 'offline' }; }

  if (!data.ok) {
    if (manual) toast('error', 'Update check failed', data.error || 'Could not reach GitHub');
    return;
  }
  if (!data.updateAvailable) {
    hideUpdateBanner();
    if (manual) toast('success', 'Up to date', `DeckPro v${data.current} is the latest version`);
    return;
  }
  _updateInfo = data;
  showUpdateBanner(data);
  if (manual) toast('info', 'Update available', `DeckPro v${data.latest} is ready to install`);
}

function showUpdateBanner(info) {
  hideUpdateBanner();
  const banner = document.createElement('div');
  banner.id = 'update-banner';
  banner.className = 'update-banner';
  banner.innerHTML = `
    <span class="update-banner-text">
      <strong>DeckPro v${esc(info.latest)}</strong> is available
      <span class="update-banner-sub">you have v${esc(info.current)}</span>
    </span>
    <button class="update-banner-install" id="update-banner-install">Update &amp; Relaunch</button>
    <button class="update-banner-dismiss" id="update-banner-dismiss" title="Not now">×</button>
  `;
  document.body.appendChild(banner);
  document.getElementById('update-banner-install')?.addEventListener('click', installUpdate);
  document.getElementById('update-banner-dismiss')?.addEventListener('click', hideUpdateBanner);
}

function hideUpdateBanner() {
  document.getElementById('update-banner')?.remove();
}

async function installUpdate() {
  hideUpdateBanner();
  showDeliveryOverlay([
    'Downloading update',
    'Installing',
    'Relaunching',
  ], {
    title: 'Updating DeckPro',
    subtitle: "Don't close the app until this completes",
  });
  updateDeliveryStep(0, false);
  try {
    const r = await fetch('/api/update/install', { method: 'POST' }).then(x => x.json());
    if (r.ok) {
      updateDeliveryStep(0, true);
      updateDeliveryStep(1, true);
      // App quits and relaunches on its own from here
    } else {
      hideDeliveryOverlay();
      toast('error', 'Update failed', r.error || 'Unknown error');
    }
  } catch (_) {
    // Connection drops as the app quits mid-update — expected
  }
}

// ─── Help ─────────────────────────────────────────────────────────────────────

const HELP_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    html: `
      <h3>What is DeckPro?</h3>
      <p>DeckPro builds ProPresenter 7 slide decks for Canvas Church messages. Fill in your slides, hit <strong>Export</strong>, and a ready-to-use <code>.pro</code> file drops directly into ProPresenter — props included, confidence monitor ready.</p>
      <h4>Workflow</h4>
      <ul>
        <li>Set the <strong>Series</strong>, <strong>Title</strong>, and <strong>Date</strong> in the header</li>
        <li>Add slides using the sidebar buttons (Scripture, Point, Blank, Image)</li>
        <li>Fill in content — body text, reference, bullets</li>
        <li>Close ProPresenter, hit <strong>Export</strong>, then reopen Pro7</li>
      </ul>
      <h4>Keyboard Shortcuts</h4>
      <ul>
        <li><span class="help-kbd">⌘1–5</span> Add slide type &nbsp;&nbsp; <span class="help-kbd">⌘E</span> Export</li>
        <li><span class="help-kbd">⌘Z</span> Undo &nbsp;&nbsp; <span class="help-kbd">⌘⇧Z</span> Redo</li>
        <li><span class="help-kbd">⌘B</span> Bold in body text and bullet fields</li>
        <li><span class="help-kbd">Enter</span> in Bible reference field — triggers lookup</li>
      </ul>
    `,
  },
  {
    id: 'slides',
    label: 'Slide Types',
    html: `
      <h4>Scripture</h4>
      <p>Verse or passage slide. Enter the reference and body text, or use Bible Lookup to auto-fill. Split long passages across two slides with <strong>+ Split into another slide</strong>. Each scripture creates a matching prop for the LED wall.</p>
      <p>Slide Notes embed the full verse text (even across splits) — feeds the confidence monitor in Pro7 without needing off-screen elements.</p>
      <h4>Point</h4>
      <p>Message point slide. Two modes:</p>
      <ul>
        <li><strong>Single</strong> — one static prop shown throughout</li>
        <li><strong>Revealing</strong> — one prop per bullet, each revealing progressively; supports <span class="help-kbd">⌘B</span> bold within bullets</li>
      </ul>
      <h4>Blank</h4>
      <p>Black/empty slide. Toggle <strong>Blank Before</strong> on scripture or point slides to auto-insert a blank before them — the blank's slide notes auto-populate from the upcoming slide content.</p>
      <h4>Image</h4>
      <p>Slide with a background image referenced from your Pro7 media library.</p>
      <h4>Response Card</h4>
      <p>Auto-appended 6-slide package when enabled: Blank → RC → R1 → R2 → R3 → Hold. Triggers stage layout changes automatically on the Blank and RC slides.</p>
    `,
  },
  {
    id: 'bible',
    label: 'Bible Lookup',
    html: `
      <h3>Bible Lookup</h3>
      <p>Scripture slides include a lookup tool powered by API.Bible. Enter your API key once in <strong>Preferences</strong> — saved and hidden like a password.</p>
      <h4>Using It</h4>
      <ul>
        <li>Type a reference like <strong>John 3:16</strong> or <strong>1 Corinthians 13:4-7</strong></li>
        <li>Press <span class="help-kbd">Enter</span> or click <strong>Lookup</strong></li>
        <li>Body text and reference bar auto-fill from the API</li>
      </ul>
      <h4>Translations</h4>
      <ul>
        <li>Set a <strong>Default Translation</strong> in Preferences (NLT recommended for Canvas)</li>
        <li>Override per-slide using the translation picker next to the reference field</li>
      </ul>
      <h4>Quote Warnings</h4>
      <p>DeckPro checks for mismatched curly quotes and unclosed quote marks before exporting — it'll warn you so you can fix them before the deck goes live.</p>
    `,
  },
  {
    id: 'outline',
    label: 'Outline Panel',
    html: `
      <h3>Outline &amp; Speaker Notes Panel</h3>
      <p>The panel on the right has two tabs:</p>
      <h4>Outline Tab</h4>
      <p>Live list of all slides with content — bird's-eye view of the full message flow while editing.</p>
      <h4>Speaker Notes Tab</h4>
      <p>Attach your message script as a reference while building. Two ways to load:</p>
      <ul>
        <li><strong>Drop a PDF</strong> — drag any PDF onto the drop zone</li>
        <li><strong>Google Drive link</strong> — paste a share link from Google Docs or Drive (must be shared "Anyone with the link can view" — Google Docs auto-converts to PDF)</li>
      </ul>
      <p>Use zoom controls to scale. Drag the left edge to resize the panel. Toggle with the <strong>Outline</strong> button in the top-right.</p>
    `,
  },
  {
    id: 'library',
    label: 'Deck Library',
    html: `
      <h3>Deck Library</h3>
      <p>The <strong>Decks</strong> button in the header opens your library — every deck you save lives in a local database with daily automatic backups (no more browser storage).</p>
      <h4>Organizing</h4>
      <ul>
        <li><strong>Search</strong> by series, title, speaker, or date</li>
        <li><strong>Filters</strong> — Decks, Templates, Archived, Trash</li>
        <li><strong>Sort</strong> by date, series (grouped), or last updated</li>
      </ul>
      <h4>Deck Actions (⋯ menu)</h4>
      <ul>
        <li><strong>Edit Info</strong> — series, title, speaker, date, QR toggle</li>
        <li><strong>Duplicate</strong> — copy a deck as a starting point</li>
        <li><strong>Save as Template</strong> — reuse a deck structure; pick it under "Start from" when creating a new deck</li>
        <li><strong>Archive</strong> — tuck away old decks without deleting</li>
        <li><strong>Delete</strong> — moves to Trash; restore or delete forever from there</li>
      </ul>
      <h4>Status at a Glance</h4>
      <p>Each deck shows when it was last exported and whether it has been edited since — so you always know what is current in Pro7.</p>
      <h4>Sharing Across Computers</h4>
      <p>In <strong>Preferences → Deck Library</strong>, point the library location at an iCloud Drive, Dropbox, or shared folder. Another computer pointing at the same folder joins the same library. If the same deck is edited in two places, DeckPro detects the conflict and asks which version to keep.</p>
    `,
  },
  {
    id: 'generate',
    label: 'Exporting',
    html: `
      <h3>Exporting the Deck</h3>
      <p>Click <strong>Export</strong> in the top-right (or <span class="help-kbd">⌘E</span>). DeckPro always exports directly to Pro7 — writes the deck to your ProPresenter library and updates your Props panel in one step.</p>
      <h4>Before You Export</h4>
      <ul>
        <li><strong>Close ProPresenter first</strong> — Pro7 must not be running; it overwrites the props config on quit and would undo the export</li>
        <li>DeckPro will warn you if Pro7 is still open</li>
        <li>After exporting, open ProPresenter — your deck and props will be there</li>
      </ul>
      <h4>What Gets Exported</h4>
      <ul>
        <li>A <code>Message_YY.MM.DD_Series_Title.pro</code> presentation file in your Pro7 library</li>
        <li>All 50 prop slots written to Pro7's Configuration/Props — active slides get real content, unused slots get empty placeholders</li>
        <li>A <strong>DeckPro</strong> collection folder in Pro7's Props panel, kept in sync automatically</li>
        <li>Your other prop collections (folders) are preserved byte-for-byte</li>
      </ul>
      <h4>Export History</h4>
      <p>Recent exports are logged in the <strong>···</strong> menu. Click the folder icon next to any entry to reveal it in Finder.</p>
    `,
  },
  {
    id: 'schemes',
    label: 'Schemes',
    html: `
      <h3>Schemes</h3>
      <p>Schemes control every visual aspect of the generated slides — fonts, sizes, colors, layout bounds, build orders, and transitions. Create multiple schemes for different looks or screen configurations.</p>
      <h4>Tabs</h4>
      <ul>
        <li><strong>Text</strong> — fonts, sizes, and advanced styling (color, stroke, shadow, alignment, spacing) per element</li>
        <li><strong>Transitions</strong> — default slide and prop transitions</li>
        <li><strong>Build Order</strong> — which elements animate in/out and in what order, per slide type</li>
        <li><strong>Layout</strong> — X/Y/W/H bounds for every element on both the main canvas (1920×1080) and prop canvas</li>
      </ul>
      <h4>Layout Alignment Buttons</h4>
      <p>Each layout row has 6 alignment buttons — 3 horizontal (left/center/right) and 3 vertical (top/middle/bottom). Click one to snap X or Y to the canvas-relative position. The active alignment lights up orange. When an element fills the full canvas width, center is shown as active.</p>
      <h4>Auto Y</h4>
      <p>The Header and Prop header rows have an <strong>Auto Y</strong> toggle. When checked, Y is calculated automatically to sit just above the body text box (body Y − header H − gap). Uncheck to set a fixed Y.</p>
    `,
  },
  {
    id: 'pro7',
    label: 'Pro7 Connection',
    html: `
      <h3>ProPresenter 7 Connection</h3>
      <p>DeckPro can connect to a running Pro7 instance on your local network to read live macro and prop data.</p>
      <h4>Setup</h4>
      <ul>
        <li>Enable the Network API in ProPresenter: <strong>Preferences → Network → Enable Network API</strong></li>
        <li>Set the port (default 1025) and optionally a password</li>
        <li>Enter the same port and password in DeckPro's <strong>Preferences</strong></li>
      </ul>
      <p>The status dot in the header shows green when connected.</p>
      <h4>Stage Display</h4>
      <p>Configure stage screen and layout UUIDs in <strong>Preferences → Stage Display</strong> to enable stage layout actions on blank, image, scripture, and point slides.</p>
    `,
  },
];

function initHelp() {
  const modal = document.getElementById('help-modal');
  const nav   = document.getElementById('help-nav');
  const body  = document.getElementById('help-body');
  const close = document.getElementById('help-modal-close');
  if (!modal) return;

  nav.innerHTML = HELP_SECTIONS.map((s, i) =>
    `<button class="help-nav-btn${i === 0 ? ' active' : ''}" data-section="${s.id}">${s.label}</button>`
  ).join('');

  body.innerHTML = HELP_SECTIONS.map((s, i) =>
    `<div class="help-section${i === 0 ? ' active' : ''}" id="help-sec-${s.id}">${s.html}</div>`
  ).join('');

  nav.addEventListener('click', e => {
    const btn2 = e.target.closest('.help-nav-btn');
    if (!btn2) return;
    nav.querySelectorAll('.help-nav-btn').forEach(b => b.classList.remove('active'));
    body.querySelectorAll('.help-section').forEach(s => s.classList.remove('active'));
    btn2.classList.add('active');
    document.getElementById(`help-sec-${btn2.dataset.section}`)?.classList.add('active');
  });

  close?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ─── Changelog ───────────────────────────────────────────────────────────────

function initChangelog() {
  const modal = document.getElementById('changelog-modal');
  const body  = document.getElementById('changelog-modal-body');
  const close = document.getElementById('changelog-modal-close');
  if (!modal) return;

  // Set version in more menu
  const versionEl = document.getElementById('more-version');
  if (versionEl) versionEl.textContent = `v${APP_VERSION}`;

  body.innerHTML = CHANGELOG.map(entry => `
    <div>
      <div>
        <span class="cl-entry-version">v${entry.version}</span>
        <span class="cl-entry-date">${entry.date}</span>
      </div>
      <ul class="cl-entry-changes">
        ${entry.changes.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  close?.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

// ─── Theme ────────────────────────────────────────────────────────────────────

const THEME_KEY = 'deckpro-theme';

function applyTheme(dark) {
  document.body.classList.toggle('dark', dark);
  const icon  = document.getElementById('mm-theme-icon');
  const label = document.getElementById('mm-theme-label');
  if (dark) {
    if (icon) icon.innerHTML = '<path d="M17 12A7 7 0 1 1 8 3a5 5 0 0 0 9 9Z" fill="currentColor"/>';
    if (label) label.textContent = 'Light Mode';
  } else {
    if (icon) icon.innerHTML = '<path d="M10 3v1M10 16v1M3 10H2M18 10h-1M5.05 5.05l-.71-.71M15.66 14.66l-.71-.71M5.05 14.95l-.71.71M15.66 5.34l-.71.71M13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>';
    if (label) label.textContent = 'Dark Mode';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem(THEME_KEY, isDark ? 'light' : 'dark');
  applyTheme(!isDark);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (saved === null && prefersDark));
}

// ─── Init ─────────────────────────────────────────────────────────────────────

initTheme();
const _tvEl = document.getElementById('titlebar-version');
if (_tvEl) _tvEl.textContent = 'v' + APP_VERSION;
loadState();
syncUidCounter();
attachHeaderHandlers();
initDecks();
initHelp();
initGenHistory();
initLibrary();
initChangelog();
document.querySelector('header h1')?.addEventListener('click', () => {
  state.activeId = null;
  render();
});
syncHeaderInputs();
render();
updateStatusDot();

// Background: check Pro7 status, load fonts, check for updates
checkPro7(true);
loadFonts();
checkForUpdates();
setInterval(() => checkForUpdates(), 6 * 60 * 60 * 1000); // re-check every 6h

// Poll Pro7 every 10s — reconnects automatically when Pro7 opens
setInterval(() => checkPro7(true), 10000);

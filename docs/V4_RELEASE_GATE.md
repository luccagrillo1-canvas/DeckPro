# DeckPro v4 Release Gate

A real gate, not "feels ready." Every box must be checked before cutting v4.
When all pass: bump to `4.0.0`, write a consolidated v4 changelog, `npm run release`.

## Freeze rule (in effect once the final v3 patch ships)

No new features. Only:
- crash fixes
- export-correctness fixes
- data-loss fixes
- visual polish / contrast fixes
- copy / label fixes

Anything else waits for v4.1.

---

## Automated gate (must be green)

- [ ] `npm run preflight` — all source parses (catches curly-quote SyntaxError)
- [ ] `node --check` on every source file
- [ ] `npm test` — all suites green:
  - [ ] `rtf.test.js` — RTF generation
  - [ ] `builder.test.js` — cue/action shape per slide type
  - [ ] `verse.test.js` — server→spans→RTF verse-number chain
  - [ ] `encode.test.js` — protobuf round-trip every slide type
  - [ ] `golden.test.js` — golden-master export snapshots (5 decks)
  - [ ] `fuzz.test.js` — 300 random decks: never throws, never drops a slide, always valid protobuf
        (deep run: `RUNS=2000 SEED=$RANDOM node fuzz.test.js`)
- [ ] Golden snapshots reviewed: any intentional change shows a clean, expected git diff
      (regen with `UPDATE=1 node golden.test.js`, then eyeball the diff before committing)

## Manual: ProPresenter real round-trip (the most important test)

Build a deck in DeckPro covering **all** of these, export it, then open the `.pro`
in actual ProPresenter and verify each line. (The chaos golden fixture,
`test/fixtures/decks/05-full-chaos-deck.json`, lists the same feature set.)

Deck must include: start · scripture with verse numbers · split scripture body ·
blankBefore · blankShowProp · point single · point revealing (stacking) · image ·
custom · per-slide macro override · scheme macro trigger · stage layout override ·
transition override · prop transition override · response card package · speaker notes.

In ProPresenter, confirm:
- [ ] Nothing missing — every slide present, correct count
- [ ] Slides in correct order; no extra/duplicate blank slides
- [ ] Cue names look right (no blank/garbage names)
- [ ] Macros appear and fire on the right slides (scheme triggers **and** per-slide override)
- [ ] Props appear in the DeckPro collection and link correctly
- [ ] Stage layouts apply where set
- [ ] Transitions match (slide + prop overrides)
- [ ] RTF looks right — bold/italic/underline, no stray control codes
- [ ] Verse numbers render correctly (superscript vs inline as set)
- [ ] Custom slide came through as a blank slot with its label
- [ ] Speaker/slide notes present on confidence monitor

## Manual: migration / old data

- [ ] Open a deck saved by an older DeckPro version — it loads without error
- [ ] Old schemes still open; missing new fields fall back to sane defaults
- [ ] Old macros don't break export
- [ ] No localStorage wipe; no duplicated decks in the library DB

## Manual: fresh install + upgrade

- [ ] Fresh install opens (no prior localStorage / library)
- [ ] Upgrade-over-existing keeps decks + settings
- [ ] App opens offline (no network)
- [ ] Dock icon correct (full DeckPro.icns, not blank)
- [ ] Version number correct in: titlebar, About/brand panel, changelog, DMG name
- [ ] Changelog ("What's New") opens and shows the v4 entry
- [ ] View menu + ··· menu labels correct (Preferences above Schemes)

## Manual: no-silent-failure spot check

Each of these must show a visible message when it fails, never fail silently:
- [ ] Export failure → toast/modal with reason
- [ ] Bible lookup with bad key / no network → toast
- [ ] Pro7 connect failure → status reflects it
- [ ] Library save / location change failure → toast
- [ ] Backup restore failure → toast
- [ ] localStorage full/blocked → "Not saving locally" warning (one-time)
- [ ] Corrupt saved deck → "Could not restore" + backup kept

## Visual

- [ ] Every panel/modal/popover legible in **dark** and **light**
- [ ] Disabled/selected/locked states read clearly
- [ ] Tiny UUID text, macro dots, tooltip + popover contrast OK
- [ ] Escape closes popovers/modals

## Sign-off

- [ ] No open critical/high issues
- [ ] Consolidated v4 changelog written
- [ ] `package.json` + `APP_VERSION` both at `4.0.0`

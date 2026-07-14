---
name: deckpro-plumbing-audit
description: >-
  Audit DeckPro's export plumbing with sentinel values — prove that UI/scheme
  settings actually reach the exact Pro7 objects they control in the exported
  .pro / _Props.pro. Use this WHENEVER the user asks to check plumbing, audit
  the export, verify scheme values, confirm a setting "actually lands" in Pro7,
  debug why a font/size/colour/margin/macro/stage-layout/prop isn't showing up,
  test scheme inheritance end-to-end, or inspect decoded Pro7 output — even if
  they don't say the word "plumbing". Reach for it before trusting a screenshot
  or the UI: the decoded .pro is the source of truth, not the editor.
---

# DeckPro Plumbing Audit

DeckPro turns a form into a ProPresenter `.pro` file through a long pipe. A value
can look right in the UI and still get dropped, hardcoded, or written to the
wrong layer on the way out. This skill proves — with **sentinel values** — that
each value survives the whole trip.

## The pipe

```
UI control → saved app state → export spec → builder / buildProp → RTF + protobuf → .pro / _Props.pro
```

**The decoded `.pro` is the truth.** Screenshots and the editor are secondary —
they show intent, not what shipped. Always confirm against the decoded binary.

## The sentinel method

For every value you care about, set an *unmistakable* value — one that can't be
a coincidence — export, decode, and prove it landed in the exact element it
controls. Weird sizes, a made-up colour, a nonsense font name, smart quotes:

| Setting | Sentinel |
|---|---|
| Body font size | `47` |
| RC title colour | `#12ab34` |
| Queue left margin | `37` |
| Display-2 point font | `ObviouslyNarrowBold` |
| Custom text w/ quotes | `He said “PLUMBING_QUOTE” today` |

Then ask, per value, one question: **"Did this exact value reach the exact Pro7
object it controls?"** If yes for every value, the plumbing works.

## Fastest path: run the script

Most of the pipe (spec → `.pro`) is covered by a runnable, deterministic audit.
Run it first — it builds a sentinel deck with every slide type, encodes through
the real `encode()` in download mode (no disk writes), decodes both binaries,
and checks each sentinel:

```bash
node scripts/plumbing-audit.js
```

- Exit `0` = no P0/P1 findings. Exit `1` = release/workflow blocker. Exit `2` = crash.
- It prints `✅/❌` per check plus a findings section with severity and repro.
- **Extend it, don't reinvent it.** To cover a new field, add a sentinel to `S`,
  set it in `buildSpec()`'s `style`/slides, and add a `check(...)` that locates
  the exact decoded element and asserts. Keep lookups **scoped to the right
  cue** — start/end slides also carry `body`/`title`/`queue` elements, so a
  naive "first element named body" grabs the wrong one (see `findScriptureCue`
  / `findElInCue`).

Read `scripts/plumbing-audit.js` before extending — it has helpers for RTF font
size (`\fsNN` is half-points), RTF colour (Pro7 renders text colour from the
`\*\expandedcolortbl` cssrgb entries, not the basic colortbl or the protobuf
fill — a classic wrong-layer trap), and a deep RTF collector.

## What the script does NOT cover — check these manually

The script isolates the **server half** (spec → `.pro`). The client half and the
environment need their own checks. Do these when the change touches them:

1. **State persistence.** Change the API key, Pro7 port/password, selected Pro7
   folder, selected library, and some scheme values; quit and reopen the app;
   confirm they're all still there. Catches "nothing is being saved" bugs.
2. **UI → spec (client resolution).** Scheme resolution, Display-2→Display-1
   inheritance, Fit Width line-breaking, and quote normalization run in the
   browser (`styleForExport`, `computeOptimalBodyWidth`, `buildSpec` in
   `public/app.js`). Verify by driving the running app (port 3000; preview 3002)
   and inspecting the generated spec / decoded export — not the script.
3. **Cross-machine paths.** Confirm DeckPro respects the *selected* Pro7
   folder/library, not a guessed one. Exercise the layouts it must detect:
   `Documents/ProPresenter`, `…/UserWorkspaces/ProPresenter`,
   `…/Workspaces/ProPresenter-{UUID}`, and a custom selected library. Confirm the
   export writes where the user chose.
4. **Real Pro7 smoke test.** Open Pro7 → DeckPro connects (green dot) → macros
   and stage displays load → export a test deck → it appears in the selected
   library → props show up and trigger. Props only become the *active* Pro7
   collection through the app's auto-manage export, so pixel-verifying props
   requires exporting through the running app (not a standalone `_Props.pro`).

## Required coverage

A thorough audit touches: persistence · scheme text/size/colour/font/margin ·
Display-1 and Display-2 (LED wall) · response card (main screen + LED-wall prop)
· props (scripture / point / revealing / response card) with names matching the
prop actions · queue · macros · stage displays · slide notes (Smart Notes) ·
Pro7 folders/libraries · smart-quote normalization · Custom slides surviving.

## Report format

Report findings grouped by severity, worst first:

- **P0** — release blocker (a value silently dropped or written wrong; broken export)
- **P1** — workflow blocker (a feature doesn't do what the UI implies)
- **P2** — polish / cleanup

For every confirmed finding, give:

```
[P0/P1/P2] area: one-line defect
  workflow:  which user flow it breaks
  file area: likely source (builder.js / buildProp.js / rtf.js / app.js / encode.js)
  expected:  the sentinel value, in the exact object it controls
  actual:    what decoded instead
  repro:     exact steps (or: node scripts/plumbing-audit.js)
```

Don't report a bug you haven't confirmed in the decoded output. If a check is
green in the script but you suspect an edge case, add a sentinel that exercises
it and re-run — a new failing check is worth more than a paragraph of doubt.

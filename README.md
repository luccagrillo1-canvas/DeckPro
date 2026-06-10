# DeckPro

ProPresenter 7 slide deck builder for Canvas Church. Build the weekly message deck — scriptures, points, response cards, props — and export it straight into Pro7 with one click.

![version](https://img.shields.io/github/v/release/luccagrillo1-canvas/deckpro?label=latest)

## Install (Mac)

1. Go to **[Releases](../../releases/latest)** and download the `.dmg` for your Mac:
   - `DeckPro-x.y.z-arm64.dmg` — Apple Silicon (M1/M2/M3/M4)
   - `DeckPro-x.y.z-x64.dmg` — Intel
2. Open the DMG and drag **DeckPro** to **Applications**.
3. First launch only — the app isn't notarized by Apple, so macOS will block it once:
   - **Right-click** DeckPro in Applications → **Open** → **Open**
   - If macOS still refuses: **System Settings → Privacy & Security**, scroll down, click **Open Anyway**

That's it. After the first launch it opens normally.

## Updates

DeckPro updates itself. When a new version is released, a banner appears in the app — click **Update & Relaunch** and it downloads, installs, and restarts on its own. You can also check manually via **Help → Check for Updates…**

## What it does

- Scripture slides with Bible lookup (API.Bible), split passages, bold spans
- Point slides — single or revealing bullets (⌘B bold)
- Response Card package with stage layout triggers
- Props for the LED wall, written directly into Pro7's configuration with a managed "DeckPro" collection
- Deck Library — searchable deck database with templates, archive, history, and optional shared-folder sync
- Schemes — full control of fonts, sizes, colors, layout bounds, transitions, and build order
- Confidence monitor content via slide notes

## Development

```bash
npm install
node server.js        # web UI at http://localhost:3000
npm run electron      # desktop app in dev mode
npm run ship          # build + install to /Applications + launch
npm run release       # build + publish a GitHub release (requires gh auth)
```

Built with Electron + Express + protobufjs, using the reverse-engineered [ProPresenter7-Proto](https://github.com/greyshirtguy/ProPresenter7-Proto) schema.

## Releasing an update

1. Bump `APP_VERSION` in `public/app.js` and `version` in `package.json` (keep them in sync) and add a `CHANGELOG` entry
2. `npm run release`

The release notes are generated from the latest changelog entry. Apps in the field see the update banner within a few hours (or immediately via Help → Check for Updates…).

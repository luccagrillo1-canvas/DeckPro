#!/bin/bash
export PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin"
cd "/Users/grillo.lucca/LocalDocuments/Claude/pro7-decode"

LOG="/tmp/deckpro-rebuild.log"
echo "=== DeckPro Rebuild $(date) ===" > "$LOG"

# ── 1. Clear dist/ so electron-builder does a completely fresh pack ───────────
echo "STEP:1:Clearing build cache"
rm -rf dist/ >> "$LOG" 2>&1

# ── 2. Build — capture all output to log ──────────────────────────────────────
echo "STEP:2:Building app"
/usr/local/bin/npm run build >> "$LOG" 2>&1
BUILD_EXIT=$?

if [ $BUILD_EXIT -ne 0 ]; then
  echo "FAIL:Build failed — check /tmp/deckpro-rebuild.log"
  exit 1
fi

# ── 3. Replace the app bundle ─────────────────────────────────────────────────
echo "STEP:3:Installing to Applications"
rm -rf /Applications/DeckPro.app >> "$LOG" 2>&1
cp -R dist/mac-arm64/DeckPro.app /Applications/ >> "$LOG" 2>&1

# ── 4. Flush macOS Launch Services cache ──────────────────────────────────────
echo "STEP:4:Refreshing system cache"
LSREG="/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister"
"$LSREG" -f /Applications/DeckPro.app >> "$LOG" 2>&1

# ── 5. Launch new instance ────────────────────────────────────────────────────
echo "STEP:5:Relaunching"
open -n /Applications/DeckPro.app --args --rebuilt >> "$LOG" 2>&1

echo "DONE"

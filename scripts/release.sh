#!/bin/bash
# Publish the current version as a GitHub release.
# Usage: npm run release   (builds first, then creates the release)
set -e
cd "$(dirname "$0")/.."

VERSION=$(node -p "require('./package.json').version")
TAG="v$VERSION"

if gh release view "$TAG" > /dev/null 2>&1; then
  echo "Release $TAG already exists — bump the version first."
  exit 1
fi

# Release notes = the latest CHANGELOG entry from public/app.js
NOTES=$(node -e "
const src = require('fs').readFileSync('public/app.js', 'utf8');
const m = src.match(/changes:\s*\[([\s\S]*?)\]/);
if (!m) { console.log('See in-app changelog.'); process.exit(0); }
const bullets = [...m[1].matchAll(/(['\"])((?:\\\\.|(?!\1).)*)\1/g)].map(x => '- ' + x[2]);
console.log(bullets.join('\n'));
")

ASSETS=()
for f in "dist/DeckPro-$VERSION-arm64.dmg" "dist/DeckPro-$VERSION-x64.dmg" \
         "dist/DeckPro-$VERSION-arm64.zip" "dist/DeckPro-$VERSION-x64.zip"; do
  [ -f "$f" ] && ASSETS+=("$f")
done

if [ ${#ASSETS[@]} -eq 0 ]; then
  echo "No build artifacts found for $VERSION in dist/ — run npm run build first."
  exit 1
fi

gh release create "$TAG" "${ASSETS[@]}" --title "DeckPro $TAG" --notes "$NOTES"
echo "Released $TAG with ${#ASSETS[@]} assets."

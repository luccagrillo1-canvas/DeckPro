#!/usr/bin/env node
'use strict';
// Preflight: syntax-check every source file before a build so a stray quote
// (e.g. a straight apostrophe inside a single-quoted changelog string) fails
// here in ~1s with the exact line — instead of after a full build or at runtime.
//
// Runs automatically via the "prebuild" npm script (npm fires it before "build",
// and ship/release both call build, so it covers all three paths).

const { execFileSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const root  = path.join(__dirname, '..');
const FILES = [
  'main.js', 'server.js', 'library.js', 'builder.js',
  'buildProp.js', 'encode.js', 'rtf.js', 'public/app.js',
];

let failed = 0;

for (const rel of FILES) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  try {
    execFileSync(process.execPath, ['--check', abs], { stdio: 'pipe' });
  } catch (err) {
    failed++;
    const msg = (err.stderr || err.stdout || '').toString().trim();
    console.error(`\n✗ ${rel}`);
    console.error(msg.split('\n').map(l => '   ' + l).join('\n'));
    // The classic culprit: a straight apostrophe ends a single-quoted string early.
    if (/Unexpected (token|identifier|string)|missing|Invalid or unexpected/i.test(msg)) {
      console.error("   tip: a straight apostrophe inside a single-quoted string ends it early.");
      console.error("        wrap strings that contain an apostrophe in double quotes — \"Pro7's Props\".");
    }
  }
}

if (failed) {
  console.error(`\nPreflight failed: ${failed} file(s) have syntax errors. Fix the above before building.\n`);
  process.exit(1);
}
console.log('Preflight OK — all source files parse cleanly.');

'use strict';

const express      = require('express');
const path         = require('path');
const os           = require('os');
const http         = require('http');
const https        = require('https');
const { execSync } = require('child_process');
const { encode }            = require('./encode');
const { MACRO_DEFAULTS }   = require('./builder');
const library              = require('./library');

const app  = express();
const PORT = process.env.PORT || 3000;

const DEFAULT_DIR = process.env.PRO7_DIR || path.join(os.homedir(), 'Documents', 'ProPresenter');

library.open();

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Deck Library ──────────────────────────────────────────────────────────

app.get('/api/library/status', (req, res) => {
  try { res.json(library.getStatus()); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/library/migrate', (req, res) => {
  try { res.json(library.importLegacy(req.body || {})); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/library/location', (req, res) => {
  try {
    const { folder, reset } = req.body || {};
    if (reset) return res.json(library.resetLocation());
    if (!folder) return res.status(400).json({ ok: false, error: 'Missing folder' });
    res.json(library.setLocation(folder));
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.get('/api/decks', (req, res) => {
  try { res.json({ ok: true, decks: library.listDecks() }); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.get('/api/decks/:id', (req, res) => {
  try {
    const deck = library.getDeck(req.params.id);
    if (!deck) return res.status(404).json({ ok: false, error: 'Deck not found' });
    res.json({ ok: true, deck });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.put('/api/decks/:id', (req, res) => {
  try {
    const result = library.saveDeck({ id: req.params.id, ...(req.body || {}) });
    if (result.conflict) return res.status(409).json({ ok: false, ...result });
    res.json(result);
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/decks/:id/info', (req, res) => {
  try { res.json(library.updateDeckInfo(req.params.id, req.body || {})); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/decks/:id/opened', (req, res) => {
  try { library.touchOpened(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/decks/:id/status', (req, res) => {
  try { res.json(library.setStatus(req.params.id, (req.body || {}).status)); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/decks/:id/template', (req, res) => {
  try { res.json(library.setTemplate(req.params.id, (req.body || {}).isTemplate)); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/decks/:id/duplicate', (req, res) => {
  try { res.json(library.duplicateDeck(req.params.id, (req.body || {}).newId)); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.delete('/api/decks/:id', (req, res) => {
  try {
    if (req.query.hard === '1') return res.json(library.hardDelete(req.params.id));
    res.json(library.setStatus(req.params.id, 'deleted'));
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.get('/api/history', (req, res) => {
  try {
    res.json({ ok: true, history: library.listGenerations({
      deckId: req.query.deckId || undefined,
      limit:  parseInt(req.query.limit) || 30,
    }) });
  } catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

app.post('/api/history', (req, res) => {
  try { res.json(library.recordGeneration(req.body || {})); }
  catch (err) { res.status(500).json({ ok: false, error: err.message }); }
});

// ── Browse folder (macOS only) ────────────────────────────────────────────

app.get('/api/browse-folder', (req, res) => {
  try {
    const chosen = execSync(
      `osascript -e 'POSIX path of (choose folder with prompt "Select output folder")'`
    ).toString().trim();
    res.json({ ok: true, folder: chosen });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.post('/api/reveal', (req, res) => {
  try {
    const { filePath } = req.body;
    if (!filePath) return res.status(400).json({ ok: false, error: 'Missing filePath' });
    execSync(`open -R "${filePath.replace(/"/g, '\\"')}"`, { timeout: 5000 });
    res.json({ ok: true });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.get('/api/pro7/process', (req, res) => {
  try {
    const result = execSync('pgrep -x ProPresenter', { timeout: 2000 }).toString().trim();
    res.json({ running: result.length > 0 });
  } catch (_) {
    // pgrep exits with code 1 if no match — not a real error
    res.json({ running: false });
  }
});

// ── Pro7 Network API proxy ────────────────────────────────────────────────

function pro7Fetch(pro7Port, password, urlPath) {
  return new Promise((resolve, reject) => {
    const auth = password ? Buffer.from(`:${password}`).toString('base64') : null;
    const options = {
      hostname: '127.0.0.1',
      port: pro7Port,
      path: urlPath,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DeckPro/2.0',
        'Connection': 'close',
        ...(auth ? { 'Authorization': `Basic ${auth}` } : {}),
      },
      timeout: 3000,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.end();
  });
}

app.get('/api/pro7/status', async (req, res) => {
  const port     = parseInt(req.query.port) || 1025;
  const password = req.query.password || '';
  try {
    const r = await pro7Fetch(port, password, '/version');
    res.json({ ok: true, connected: r.status === 200, data: r.body });
  } catch (err) {
    res.json({ ok: false, connected: false, error: err.message });
  }
});

app.get('/api/pro7/macros', async (req, res) => {
  const port     = parseInt(req.query.port) || 1025;
  const password = req.query.password || '';
  try {
    const r = await pro7Fetch(port, password, '/v1/macros');
    if (r.status !== 200) return res.json({ ok: false, error: `Pro7 returned ${r.status}` });
    res.json({ ok: true, macros: r.body });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.get('/api/pro7/props', async (req, res) => {
  const port     = parseInt(req.query.port) || 1025;
  const password = req.query.password || '';
  try {
    const r = await pro7Fetch(port, password, '/v1/props');
    if (r.status !== 200) return res.json({ ok: false, error: `Pro7 returned ${r.status}` });
    res.json({ ok: true, props: r.body });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ── System font scanner ───────────────────────────────────────────────────

let _fontCache    = null;
let _fontMapCache = null;

app.get('/api/fonts', (req, res) => {
  if (_fontCache && !req.query.refresh) return res.json({ ok: true, fonts: _fontCache, fontMap: _fontMapCache, cached: true });
  try {
    const raw  = execSync('system_profiler SPFontsDataType -json', { timeout: 20000, maxBuffer: 20 * 1024 * 1024 }).toString();
    const data = JSON.parse(raw);
    const fontMap = {};  // family → [{ style, postscript }]
    const fontSet = new Set();
    for (const entry of (data?.SPFontsDataType || [])) {
      for (const tf of (entry.typefaces || [])) {
        const ps     = tf._name;          // PostScript name
        const family = tf.family || ps;
        const style  = tf.style  || 'Regular';
        if (!ps) continue;
        fontSet.add(ps);
        if (!fontMap[family]) fontMap[family] = [];
        fontMap[family].push({ style, postscript: ps });
      }
    }
    // Deduplicate and sort styles within each family
    for (const fam of Object.keys(fontMap)) {
      const seen = new Set();
      fontMap[fam] = fontMap[fam]
        .filter(({ postscript }) => seen.has(postscript) ? false : seen.add(postscript))
        .sort((a, b) => a.style.localeCompare(b.style));
    }
    _fontCache    = [...fontSet].sort((a, b) => a.localeCompare(b));
    _fontMapCache = fontMap;
    res.json({ ok: true, fonts: _fontCache, fontMap: _fontMapCache });
  } catch (err) {
    res.json({ ok: false, error: err.message, fonts: [], fontMap: {} });
  }
});

// ── API.Bible proxy ───────────────────────────────────────────────────────

function bibleFetch(apiKey, urlPath) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'rest.api.bible',
      port: 443,
      path: urlPath,
      method: 'GET',
      headers: { 'api-key': apiKey, 'Accept': 'application/json' },
      timeout: 8000,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
    req.end();
  });
}

app.get('/api/bible/bibles', async (req, res) => {
  const apiKey = req.query.apiKey || '';
  if (!apiKey) return res.json({ ok: false, error: 'No API key' });
  try {
    const r = await bibleFetch(apiKey, '/v1/bibles?language=eng&include-full-details=false');
    if (r.status !== 200) return res.json({ ok: false, error: `API.Bible returned ${r.status}` });
    const bibles = (r.body.data || []).map(b => ({
      id:                b.id,
      name:              b.name,
      nameLocal:         b.nameLocal,
      abbreviation:      b.abbreviation,
      abbreviationLocal: b.abbreviationLocal,
    }));
    res.json({ ok: true, bibles });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// Map common book names → OSIS IDs
const BOOK_MAP = {
  'genesis':'GEN','exodus':'EXO','leviticus':'LEV','numbers':'NUM','deuteronomy':'DEU',
  'joshua':'JOS','judges':'JDG','ruth':'RUT','1 samuel':'1SA','2 samuel':'2SA',
  '1 kings':'1KI','2 kings':'2KI','1 chronicles':'1CH','2 chronicles':'2CH',
  'ezra':'EZR','nehemiah':'NEH','esther':'EST','job':'JOB','psalms':'PSA','psalm':'PSA',
  'proverbs':'PRO','ecclesiastes':'ECC','song of solomon':'SNG','song of songs':'SNG',
  'isaiah':'ISA','jeremiah':'JER','lamentations':'LAM','ezekiel':'EZK','daniel':'DAN',
  'hosea':'HOS','joel':'JOL','amos':'AMO','obadiah':'OBA','jonah':'JON','micah':'MIC',
  'nahum':'NAM','habakkuk':'HAB','zephaniah':'ZEP','haggai':'HAG','zechariah':'ZEC',
  'malachi':'MAL','matthew':'MAT','mark':'MRK','luke':'LUK','john':'JHN','acts':'ACT',
  'romans':'ROM','1 corinthians':'1CO','2 corinthians':'2CO','galatians':'GAL',
  'ephesians':'EPH','philippians':'PHP','colossians':'COL','1 thessalonians':'1TH',
  '2 thessalonians':'2TH','1 timothy':'1TI','2 timothy':'2TI','titus':'TIT',
  'philemon':'PHM','hebrews':'HEB','james':'JAS','1 peter':'1PE','2 peter':'2PE',
  '1 john':'1JN','2 john':'2JN','3 john':'3JN','jude':'JUD','revelation':'REV',
};

function refToOsis(ref) {
  // e.g. "John 3:16", "1 Corinthians 13:4-7", "Psalm 23"
  const m = ref.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i);
  if (!m) return null;
  const [, book, chap, startV, endV] = m;
  const osis = BOOK_MAP[book.toLowerCase().trim()];
  if (!osis) return null;
  if (!startV) return `${osis}.${chap}`;
  const start = `${osis}.${chap}.${startV}`;
  const end   = endV ? `${osis}.${chap}.${endV}` : start;
  return start === end ? start : `${start}-${end}`;
}

app.get('/api/bible/search', async (req, res) => {
  const { apiKey, bibleId, ref } = req.query;
  if (!apiKey || !bibleId || !ref) return res.json({ ok: false, error: 'Missing params' });

  const passageId = refToOsis(ref);
  if (!passageId) return res.json({ ok: false, error: `Couldn't parse reference: "${ref}". Try "John 3:16" format.` });

  try {
    const qs = 'content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false';
    const urlPath = `/v1/bibles/${encodeURIComponent(bibleId)}/passages/${encodeURIComponent(passageId)}?${qs}`;
    const r = await bibleFetch(apiKey, urlPath);
    if (r.status !== 200) return res.json({ ok: false, error: `API.Bible returned ${r.status}: ${JSON.stringify(r.body).slice(0, 300)}` });

    const raw  = r.body.data?.content || '';
    const text = raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const reference = r.body.data?.reference || ref;

    if (!text) return res.json({ ok: false, error: 'No text returned for that passage' });
    res.json({ ok: true, text, reference });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ── Google Drive PDF proxy ────────────────────────────────────────────────

function parseGdriveId(url) {
  // Google Docs: /document/d/{ID}/
  let m = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return { id: m[1], type: 'doc' };
  // Drive file: /file/d/{ID}/ or /d/{ID}/
  m = url.match(/\/(?:file\/)?d\/([a-zA-Z0-9_-]+)/);
  if (m) return { id: m[1], type: 'file' };
  // open?id= or export?id=
  m = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m) return { id: m[1], type: 'file' };
  return null;
}

app.get('/api/gdrive-pdf', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ ok: false, error: 'Missing url' });

  const parsed = parseGdriveId(url);
  if (!parsed) return res.status(400).json({ ok: false, error: 'Could not parse a Google Drive file ID from that URL' });

  const fetchUrl = parsed.type === 'doc'
    ? `https://docs.google.com/document/d/${parsed.id}/export?format=pdf`
    : `https://drive.google.com/uc?export=download&id=${parsed.id}`;

  try {
    await new Promise((resolve, reject) => {
      const doRequest = (targetUrl, redirectCount = 0) => {
        if (redirectCount > 5) return reject(new Error('Too many redirects'));
        const mod = targetUrl.startsWith('https') ? https : http;
        const req2 = mod.get(targetUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 15000,
        }, (r) => {
          if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
            r.resume();
            doRequest(r.headers.location, redirectCount + 1);
            return;
          }
          if (r.statusCode !== 200) {
            r.resume();
            return reject(new Error(`Google returned ${r.statusCode} — make sure the file is shared "Anyone with the link"`));
          }
          const ct = r.headers['content-type'] || '';
          if (!ct.includes('pdf')) {
            r.resume();
            return reject(new Error('The link did not return a PDF. Make sure the file is shared "Anyone with the link" and is a Google Doc or PDF.'));
          }
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline; filename="notes.pdf"');
          r.pipe(res);
          r.on('end', resolve);
        });
        req2.on('timeout', () => { req2.destroy(); reject(new Error('Request timed out')); });
        req2.on('error', reject);
      };
      doRequest(fetchUrl);
    });
  } catch (err) {
    if (!res.headersSent) res.status(502).json({ ok: false, error: err.message });
  }
});

// ── Macro defaults ────────────────────────────────────────────────────────

app.get('/api/macro-defaults', (req, res) => {
  res.json({ ok: true, macros: MACRO_DEFAULTS });
});

// ── Self-update via GitHub Releases ───────────────────────────────────────

const pkg = require('./package.json');
const fsu = require('fs');

function repoSlug() {
  const r = pkg.repository || '';
  const m = String(r.url || r).match(/github(?:\.com)?[:/]+([^/]+\/[^/.]+)/);
  return m ? m[1] : null;
}

function cmpVer(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function httpsGetJson(url, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const req = https.get(url, {
      headers: { 'User-Agent': 'DeckPro', 'Accept': 'application/vnd.github+json' },
      timeout: 10000,
    }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        r.resume();
        return resolve(httpsGetJson(r.headers.location, redirects + 1));
      }
      let data = '';
      r.on('data', c => data += c);
      r.on('end', () => {
        if (r.statusCode !== 200) return reject(new Error(`GitHub returned ${r.statusCode}`));
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.on('error', reject);
  });
}

function downloadFile(url, dest, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const req = https.get(url, { headers: { 'User-Agent': 'DeckPro' }, timeout: 120000 }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        r.resume();
        return resolve(downloadFile(r.headers.location, dest, redirects + 1));
      }
      if (r.statusCode !== 200) { r.resume(); return reject(new Error(`Download failed: ${r.statusCode}`)); }
      const out = fsu.createWriteStream(dest);
      r.pipe(out);
      out.on('finish', () => out.close(resolve));
      out.on('error', reject);
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Download timed out')); });
    req.on('error', reject);
  });
}

async function fetchLatestRelease() {
  const slug = repoSlug();
  if (!slug) throw new Error('No repository configured');
  const rel    = await httpsGetJson(`https://api.github.com/repos/${slug}/releases/latest`);
  const latest = (rel.tag_name || '').replace(/^v/, '');
  const arch   = process.arch === 'arm64' ? 'arm64' : 'x64';
  const asset  = (rel.assets || []).find(a => a.name.includes(`-${arch}`) && a.name.endsWith('.zip'));
  return { rel, latest, asset };
}

app.get('/api/update/check', async (req, res) => {
  try {
    const { rel, latest, asset } = await fetchLatestRelease();
    res.json({
      ok: true,
      current: pkg.version,
      latest,
      updateAvailable: cmpVer(latest, pkg.version) > 0 && !!asset,
      notes: rel.body || '',
      assetBytes: asset?.size || 0,
    });
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

app.post('/api/update/install', async (req, res) => {
  try {
    const { latest, asset } = await fetchLatestRelease();
    if (cmpVer(latest, pkg.version) <= 0 || !asset) {
      return res.json({ ok: false, error: 'Already up to date' });
    }

    const zipPath   = `/tmp/deckpro-update-${latest}.zip`;
    const unzipDir  = `/tmp/deckpro-update-${latest}`;
    await downloadFile(asset.browser_download_url, zipPath);

    execSync(`rm -rf "${unzipDir}" && mkdir -p "${unzipDir}" && ditto -xk "${zipPath}" "${unzipDir}"`, { timeout: 60000 });
    if (!fsu.existsSync(`${unzipDir}/DeckPro.app`)) {
      throw new Error('Update package did not contain DeckPro.app');
    }

    // Swap the app bundle after this process exits, then relaunch
    const swapScript = `/tmp/deckpro-update-swap.sh`;
    fsu.writeFileSync(swapScript, `#!/bin/bash
sleep 1.5
rm -rf /Applications/DeckPro.app
cp -R "${unzipDir}/DeckPro.app" /Applications/
"/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister" -f /Applications/DeckPro.app
rm -rf "${unzipDir}" "${zipPath}"
open -n /Applications/DeckPro.app --args --updated
`, { mode: 0o755 });

    const { spawn } = require('child_process');
    spawn('/bin/bash', [swapScript], { detached: true, stdio: 'ignore' }).unref();

    res.json({ ok: true, installing: latest });

    // Quit so the swap can proceed (only when running inside Electron)
    setTimeout(() => {
      try { require('electron').app.quit(); } catch (_) { /* standalone server — user restarts manually */ }
    }, 800);
  } catch (err) {
    res.json({ ok: false, error: err.message });
  }
});

// ── Generate presentation ─────────────────────────────────────────────────

app.post('/api/generate', async (req, res) => {
  try {
    const { spec, fileName } = req.body;
    if (!spec || !fileName) return res.status(400).json({ ok: false, error: 'Missing spec or fileName' });

    const safe = fileName.replace(/[^a-zA-Z0-9_\-. ]/g, '_');
    spec.name  = safe;

    if (spec.downloadMode) {
      const result = await encode(spec);
      return res.json({ ok: true, ...result });
    }

    const outputFolder = spec.outputFolder || DEFAULT_DIR;
    const outputPath   = path.join(outputFolder, `${safe}.pro`);
    const result       = await encode(spec, outputPath);

    res.json({
      ok: true,
      delivered: !!result.delivered,
      presentationPath: result.presentationPath || outputPath,
      presentationBytes: result.presentationBytes,
      props: result.props,
    });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// When run directly (node server.js), start listening immediately.
// When required by Electron's main.js, the caller handles listen.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`DeckPro → http://localhost:${PORT}`);
    console.log(`Default output dir: ${DEFAULT_DIR}`);
  });
} else {
  module.exports = app;
}

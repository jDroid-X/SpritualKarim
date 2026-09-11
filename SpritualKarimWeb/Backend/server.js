/**
 * Backend/server.js
 * Universal Multi-Route Node.js HTTP & API Server
 * Shree Spritual Karim Sansthan
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { handleApiRequest } = require('./api/routes');

const PORT = process.env.PORT || 8080;
const ROOT_DIR = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Check if this is an API request
  if (pathname.startsWith('/api/')) {
    const handled = handleApiRequest(req, res, pathname, parsedUrl.searchParams);
    if (handled) return;
  }

  // 2. Candidate resolution for static assets across Root and Frontend
  let candidates = [
    path.join(ROOT_DIR, pathname),
    path.join(ROOT_DIR, pathname, 'index.html'),
    path.join(ROOT_DIR, 'Frontend', pathname),
    path.join(ROOT_DIR, 'Frontend', pathname, 'index.html')
  ];

  // If path starts with /Frontend, also check without /Frontend
  if (pathname.startsWith('/Frontend/')) {
    const stripped = pathname.replace(/^\/Frontend\//, '');
    candidates.push(path.join(ROOT_DIR, stripped));
    candidates.push(path.join(ROOT_DIR, stripped, 'index.html'));
  }

  // Default home
  if (pathname === '/' || pathname === '') {
    candidates.push(path.join(ROOT_DIR, 'index.html'));
  }

  let targetFile = null;
  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const stat = fs.statSync(candidate);
        if (stat.isFile()) {
          targetFile = candidate;
          break;
        }
      }
    } catch (e) {}
  }

  if (!targetFile) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;padding:2rem;background:#0b0714;color:#f0ece1;"><h2>404 Not Found</h2><p>Requested: ${pathname}</p><p><a href="/" style="color:#d4af37;">Go to Home</a> | <a href="/index.html" style="color:#d4af37;">Admin Portal</a></p></body></html>`);
    return;
  }

  const ext = path.extname(targetFile).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });

  const stream = fs.createReadStream(targetFile);
  stream.pipe(res);
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Spiritual Karim Backend Server running on http://localhost:${PORT}`);
  });
}

module.exports = server;

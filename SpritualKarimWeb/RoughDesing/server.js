const http = require("http");
const fs = require("fs");
const path = require("path");
let handleApiRequest = null;
try {
  handleApiRequest = require("./Backend/api/routes").handleApiRequest;
} catch (e) {}

let appConfig = null;
try {
  appConfig = require("../js/config/appConfig");
} catch (e) {}

// Single Source of Truth (SSOT) Port Configuration
const PORT = process.env.PORT || (appConfig && appConfig.server && appConfig.server.port) || 8085;
// @deprecated ALT_PORT 8080 deactivated to enforce SSOT Port 8085
const ALT_PORT = null;
const BASE_DIRS = [
  path.resolve(__dirname),
  path.resolve(__dirname, "Frontend"),
  path.resolve(__dirname, ".."),
  path.resolve(__dirname, "../.."),
];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

function createRequestHandler() {
  return (req, res) => {
    const parsedUrl = new URL(
      req.url,
      `http://${req.headers.host || "localhost"}`,
    );
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // Check API route
    if (pathname.startsWith('/api/') && typeof handleApiRequest === 'function') {
      const handled = handleApiRequest(req, res, pathname, parsedUrl.searchParams);
      if (handled) return;
    }

    // Handle special /logout route
    if (pathname === "/logout" || pathname === "/logout.html") {
      candidates.push(path.join(__dirname, "logout.html"));
    }
    // Sub-portal login/logout fallback
    if (pathname.endsWith("/login.html") || pathname === "/login") {
      candidates.push(path.join(__dirname, "login.html"));
    }
    if (pathname.endsWith("/logout.html") || pathname.endsWith("/logout")) {
      candidates.push(path.join(__dirname, "logout.html"));
    }

    // 1. Prioritize direct files in __dirname & Frontend
    candidates.push(path.join(__dirname, pathname));
    candidates.push(path.join(__dirname, pathname, "index.html"));
    candidates.push(path.join(__dirname, "Frontend", pathname));
    candidates.push(path.join(__dirname, "Frontend", pathname, "index.html"));

    // 2. Strip leading prefixes like /SpritualKarim/SpritulKarimWeb or /SpritualKarim/SpritualKarimWeb
    let stripped = pathname
      .replace(/^\/SpritualKarim\/SpritulKarimWeb/i, "")
      .replace(/^\/SpritualKarim\/SpritualKarimWeb/i, "")
      .replace(/^\/SpritulKarimWeb/i, "")
      .replace(/^\/SpritualKarimWeb/i, "")
      .replace(/^\/SpritualKarim/i, "")
      .replace(/^\//, "");

    candidates.push(path.join(__dirname, stripped));
    candidates.push(path.join(__dirname, stripped, "index.html"));
    if (!stripped) {
      candidates.push(path.join(__dirname, "index.html"));
    }

    // 3. Fallback across all BASE_DIRS
    for (const base of BASE_DIRS) {
      candidates.push(path.join(base, pathname));
      candidates.push(path.join(base, pathname, "index.html"));
      candidates.push(path.join(base, stripped));
      candidates.push(path.join(base, stripped, "index.html"));
    }

    // Find first candidate that exists
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
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(
        `<!DOCTYPE html><html><head><title>404 Not Found</title></head><body style="font-family:sans-serif;padding:2rem;background:#0b0714;color:#f0ece1;"><h2>404 Not Found</h2><p>Requested: ${pathname}</p><p><a href="/" style="color:#d4af37;">Go to Home</a> | <a href="/index.html" style="color:#d4af37;">Admin Portal</a></p></body></html>`,
      );
      return;
    }

    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    });

    const stream = fs.createReadStream(targetFile);
    stream.pipe(res);
  };
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception in server:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection in server:', reason);
});

const serverPrimary = http.createServer(createRequestHandler());
serverPrimary.on('error', (err) => {
  console.error(`Primary Server error on port ${PORT}:`, err);
});
serverPrimary.listen(PORT, "0.0.0.0", () => {
  console.log(`Spiritual Karim Primary Server running on http://localhost:${PORT}`);
});

// @deprecated Secondary server on ALT_PORT (8080) deactivated in compliance with SSOT architecture
// To avoid port collisions and maintain single source of truth, only Port 8085 is used.
/*
const serverAlt = http.createServer(createRequestHandler());
serverAlt.on('error', (err) => {
  console.log(`Alt Server on port ${ALT_PORT} notice: ${err.message}`);
});
serverAlt.listen(ALT_PORT, "0.0.0.0", () => {
  console.log(`Spiritual Karim Alt Server running on http://localhost:${ALT_PORT}`);
});
*/

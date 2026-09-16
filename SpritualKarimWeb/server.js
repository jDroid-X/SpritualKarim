const http = require("http");
const fs = require("fs");
const path = require("path");
let handleApiRequest = null;
try {
  handleApiRequest = require("./Backend/api/routes").handleApiRequest;
} catch (e) {}

const PORT = process.env.PORT || 8085;
const ALT_PORT = 8080;
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

    // Check API route (Dynamic hot-reload for enterprise sync)
    if (pathname.startsWith('/api/')) {
      try {
        delete require.cache[require.resolve("./Backend/api/routes")];
        const api = require("./Backend/api/routes");
        if (api && typeof api.handleApiRequest === 'function') {
          const handled = api.handleApiRequest(req, res, pathname, parsedUrl.searchParams);
          if (handled) return;
        }
      } catch (e) {
        console.error("API route handling error:", e);
      }
    }

    const candidates = [];

    // 1. Direct file check in __dirname & Frontend
    candidates.push(path.join(__dirname, pathname));
    candidates.push(path.join(__dirname, pathname, "index.html"));
    candidates.push(path.join(__dirname, "Frontend", pathname));
    candidates.push(path.join(__dirname, "Frontend", pathname, "index.html"));

    // 2. Handle special routes
    if (pathname === "/logout" || pathname === "/logout.html" || pathname.endsWith("/logout.html")) {
      candidates.push(path.join(__dirname, "logout.html"));
    }
    if (pathname === "/login" || pathname === "/login.html" || pathname.endsWith("/login.html")) {
      candidates.push(path.join(__dirname, "login.html"));
    }
    if (pathname === "/join" || pathname === "/join.html" || pathname.endsWith("/join.html")) {
      candidates.push(path.join(__dirname, "join.html"));
      candidates.push(path.join(__dirname, "Frontend", "join.html"));
    }

    // 3. Subportal relative asset fallback (e.g. /Masters/js/..., /Masters/css/..., /Healers/...)
    const subportalRootMatch = pathname.match(/^\/(Masters|Healers|Trainee|Devotee|Seeker|Frontend|Public)\/?$/i);
    if (subportalRootMatch) {
      candidates.push(path.join(__dirname, subportalRootMatch[1], "index.html"));
      candidates.push(path.join(__dirname, "index.html"));
    }

    const subportalMatch = pathname.match(/^\/(Masters|Healers|Trainee|Devotee|Seeker|Frontend|Public)\/(.*)$/i);
    if (subportalMatch && subportalMatch[2]) {
      const subPath = subportalMatch[2];
      candidates.push(path.join(__dirname, subPath));
      candidates.push(path.join(__dirname, "Frontend", subPath));
      candidates.push(path.join(__dirname, subPath, "index.html"));
    }

    // 4. Strip leading prefixes like /SpritualKarim/SpritulKarimWeb or /SpritualKarim/SpritualKarimWeb
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

    // 5. Fallback across all BASE_DIRS
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

const serverAlt = http.createServer(createRequestHandler());
serverAlt.on('error', (err) => {
  console.log(`Alt Server on port ${ALT_PORT} notice: ${err.message}`);
});
serverAlt.listen(ALT_PORT, "0.0.0.0", () => {
  console.log(`Spiritual Karim Alt Server running on http://localhost:${ALT_PORT}`);
});

// Explicit keep-alive timer preventing process exit on idle
setInterval(() => {}, 3600000);

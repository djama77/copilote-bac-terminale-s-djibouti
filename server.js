"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 10000);
const MAX_BODY = 9 * 1024 * 1024;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf"
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", chunk => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error("Corps de requête trop volumineux."), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      if (!chunks.length) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("JSON invalide."), { statusCode: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function createResponse(res) {
  const response = {
    statusCode: 200,
    setHeader(name, value) { res.setHeader(name, value); return response; },
    status(code) { response.statusCode = code; return response; },
    json(payload) {
      if (res.writableEnded) return;
      res.statusCode = response.statusCode;
      if (!res.hasHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify(payload));
    },
    end(payload) {
      if (res.writableEnded) return;
      res.statusCode = response.statusCode;
      res.end(payload);
    }
  };
  return response;
}

async function handleApi(req, res, pathname) {
  const route = pathname.replace(/\/$/, "");
  const handlers = {
    "/api/config": require("./api/config.js"),
    "/api/tutor": require("./api/tutor.js")
  };
  const handler = handlers[route];
  if (!handler) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Route API introuvable." }));
    return;
  }

  try {
    req.body = req.method === "GET" || req.method === "HEAD" ? {} : await readBody(req);
    await handler(req, createResponse(res));
  } catch (error) {
    if (res.writableEnded) return;
    const status = error.statusCode || 500;
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ error: status === 500 ? "Erreur interne du serveur." : error.message }));
  }
}

function serveStatic(req, res, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); }
  catch {
    res.writeHead(400); res.end("URL invalide."); return;
  }

  const requested = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.resolve(ROOT, "." + requested);
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== path.join(ROOT, "index.html")) {
    res.writeHead(403); res.end("Accès interdit."); return;
  }

  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Page introuvable.");
      return;
    }
    const headers = {
      "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff"
    };
    if (path.basename(filePath) === "sw.js") {
      headers["Cache-Control"] = "public, max-age=0, must-revalidate";
      headers["Service-Worker-Allowed"] = "/";
    }
    res.writeHead(200, headers);
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname.startsWith("/api/")) {
    await handleApi(req, res, url.pathname);
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end("Méthode non autorisée.");
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("Copilote Bac prêt sur le port " + PORT);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));

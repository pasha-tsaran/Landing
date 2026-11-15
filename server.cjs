'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = fs.realpathSync(__dirname);
const publicFiles = new Set(['/index.html', '/styles.css', '/app.js', '/assets/favicon.svg',
  '/assets/car-on-lift.webp', '/assets/computer-diagnostics.webp', '/assets/mechanic-working.webp', '/assets/maintenance-parts.webp',
  '/assets/car-front-cutout.webp', '/assets/car-rear-cutout.webp', '/assets/road-wavy.webp',
  '/assets/lift/raised-off.webp', '/assets/lift/raised-on.webp', '/assets/lift/garage.webp',
  '/assets/fonts/tiktok-sans.ttf', '/assets/fonts/OFL.txt']);
const mimeTypes = {'.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8'};
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // This demo must never send personal data, including through accidental form navigation.
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'"
};

function createServer() {
  return http.createServer(async (request, response) => {
    Object.entries(securityHeaders).forEach(([key, value]) => response.setHeader(key, value));
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, {'Allow': 'GET, HEAD'});
      response.end('Method not allowed');
      return;
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400); response.end('Invalid URL'); return; }
    if (pathname === '/healthz') {
      response.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store'});
      response.end(request.method === 'HEAD' ? undefined : 'ok');
      return;
    }
    if (pathname === '/') pathname = '/index.html';
    if (!publicFiles.has(pathname)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    try {
      const filePath = await fs.promises.realpath(path.join(root, pathname.slice(1)));
      const relative = path.relative(root, filePath);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        response.writeHead(404); response.end('Not found'); return;
      }
      const info = await fs.promises.stat(filePath);
      if (!info.isFile()) { response.writeHead(404); response.end('Not found'); return; }
      response.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(filePath)],
        'Content-Length': info.size,
        'Cache-Control': 'no-cache'
      });
      if (request.method === 'HEAD') { response.end(); return; }
      const stream = fs.createReadStream(filePath);
      stream.on('error', () => response.destroy());
      response.on('close', () => stream.destroy());
      stream.pipe(response);
    } catch { response.writeHead(404); response.end('Not found'); }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 4183);
  const host = process.env.HOST || '127.0.0.1';
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT должен быть числом от 1 до 65535.');
  const server = createServer();
  server.listen(port, host, () => console.log(`Точка ремонта: http://${host}:${port}`));
  server.on('error', error => {
    console.error(error.code === 'EADDRINUSE' ? `Порт ${port} уже занят. Укажите другой PORT.` : error.message);
    process.exitCode = 1;
  });
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
}
module.exports = {createServer};

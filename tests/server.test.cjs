'use strict';
const {test, before, after} = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const {createServer} = require('../server.cjs');
let server;
let port;
before(async () => {
  server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  port = server.address().port;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });
function request(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const req = http.request({host: '127.0.0.1', port, path: url, method}, response => {
      let body = '';
      response.on('data', chunk => { body += chunk; });
      response.on('end', () => resolve({status: response.statusCode, headers: response.headers, body}));
    });
    req.on('error', reject);
    req.end();
  });
}
test('homepage and local resources load with correct types', async () => {
  for (const [url, type] of [['/', 'text/html'], ['/styles.css', 'text/css'], ['/app.js', 'text/javascript'],
    ['/assets/car-on-lift.webp', 'image/webp'], ['/assets/car-front-cutout.webp', 'image/webp'],
    ['/assets/car-rear-cutout.webp', 'image/webp'], ['/assets/road-wavy.webp', 'image/webp'],
    ['/assets/lift/raised-off.webp', 'image/webp'], ['/assets/lift/raised-on.webp', 'image/webp'], ['/assets/lift/garage.webp', 'image/webp'],
    ['/assets/fonts/tiktok-sans.ttf', 'font/ttf']]) {
    const response = await request(url);
    assert.equal(response.status, 200, url);
    assert.ok(response.headers['content-type'].startsWith(type), url);
  }
});
test('HEAD returns headers without a body; health endpoint works', async () => {
  const response = await request('/', 'HEAD');
  assert.equal(response.status, 200);
  assert.equal(response.body, '');
  assert.ok(Number(response.headers['content-length']) > 0);
  assert.equal((await request('/healthz')).body, 'ok');
  assert.equal((await request('/healthz', 'HEAD')).body, '');
});
test('server cannot receive form submissions', async () => {
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const response = await request('/', method);
    assert.equal(response.status, 405);
    assert.equal(response.headers.allow, 'GET, HEAD');
  }
  const {headers} = await request('/');
  assert.ok(headers['content-security-policy'].includes("form-action 'none'"));
  assert.ok(headers['content-security-policy'].includes("connect-src 'none'"));
  assert.equal(headers['x-frame-options'], 'DENY');
  assert.equal(headers['referrer-policy'], 'no-referrer');
  assert.equal(headers['set-cookie'], undefined);
});
test('private files and traversal paths are not public', async () => {
  for (const url of ['/server.cjs', '/package.json', '/README.md', '/Dockerfile', '/compose.yaml',
    '/.git/config', '/assets/originals/car-on-lift.png', '/assets/../package.json',
    '/assets/%2e%2e/package.json', '/assets/%2e%2e%5cpackage.json', '/%2e%2e%5cserver.cjs']) {
    assert.equal((await request(url)).status, 404, url);
  }
});
test('invalid URL encoding and unknown files do not crash server', async () => {
  assert.equal((await request('/%E0%A4%A')).status, 400);
  assert.equal((await request('/missing.webp')).status, 404);
  assert.equal((await request('/healthz')).status, 200);
});

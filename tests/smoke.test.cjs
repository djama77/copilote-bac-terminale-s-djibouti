const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('app.js parses without JavaScript syntax errors', () => {
  new vm.Script(fs.readFileSync('app.js', 'utf8'), {filename:'app.js'});
});
test('service worker parses', () => {
  new vm.Script(fs.readFileSync('sw.js', 'utf8'), {filename:'sw.js'});
});
test('PWA manifest is valid JSON with essential fields', () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.name);
  assert.ok(manifest.start_url);
});
test('main UI has photo input and send button', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.match(html, /id="photoInput"/);
  assert.match(html, /id="sendBtn"/);
  assert.match(html, /id="assistantPanel"/);
});
test('photo validation and API integration remain present', () => {
  const js = fs.readFileSync('app.js', 'utf8');
  assert.match(js, /selectedFile\.size > 4_000_000/);
  assert.match(js, /fetch\("\/api\/tutor"/);
});

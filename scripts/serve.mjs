// Serves dist/ with the exact security headers from deploy/nginx.conf, so tests exercise the real CSP.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const conf = fs.readFileSync(path.join(root, 'deploy/nginx.conf'), 'utf8');
const headers = {};
for (const m of conf.matchAll(/add_header\s+(\S+)\s+"([^"]+)"\s+always;/g)) headers[m[1]] = m[2];

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };
const port = Number(process.env.PORT || 4173);

http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
    let file = path.join(dist, path.normalize(decodeURIComponent(url.pathname)));
    if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, 'index.html');
    res.writeHead(200, { ...headers, 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, '127.0.0.1', () => console.log(`serving dist on http://127.0.0.1:${port}`));

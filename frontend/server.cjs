const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 5173
const DIST = path.join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}

const server = http.createServer((req, res) => {
  // Strip query string
  const urlPath = req.url.split('?')[0]
  let filePath = path.join(DIST, urlPath === '/' ? 'index.html' : urlPath)
  const ext = path.extname(filePath)

  // SPA fallback: no extension or file not found → serve index.html
  if (!ext || !fs.existsSync(filePath)) {
    filePath = path.join(DIST, 'index.html')
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  const mime = MIME[path.extname(filePath)] || 'application/octet-stream'
  res.setHeader('Content-Type', mime)
  res.setHeader('Cache-Control', ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable')
  fs.createReadStream(filePath).pipe(res)
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend running at http://0.0.0.0:${PORT}`)
})

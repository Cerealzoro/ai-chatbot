const http = require('node:http');

const port = process.env.PORT || 3000;

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Node HTML Server</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Georgia, serif;
        background: #f5f1e8;
        color: #1d2925;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: radial-gradient(circle at top right, #d4e4d3, transparent 45%), #f5f1e8;
      }

      main {
        width: min(90vw, 680px);
        padding: 4rem 2rem;
        text-align: center;
      }

      .eyebrow {
        margin: 0 0 1rem;
        color: #b45235;
        font: 700 0.78rem/1.2 system-ui, sans-serif;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      h1 {
        margin: 0;
        font-size: clamp(3rem, 10vw, 6.5rem);
        line-height: 0.95;
        font-weight: 400;
      }

      p {
        margin: 1.5rem auto 0;
        max-width: 32rem;
        font: 1.1rem/1.7 system-ui, sans-serif;
      }

      .status {
        display: inline-block;
        margin-top: 2rem;
        padding: 0.65rem 1rem;
        border: 1px solid #9ab39a;
        border-radius: 999px;
        color: #31523b;
        font: 700 0.9rem system-ui, sans-serif;
      }
    </style>
  </head>
  <body>
    <main>
      <p class="eyebrow">Node.js server</p>
      <h1>Hello from the server.</h1>
      <p>This HTML page is being generated and served by a small Node.js HTTP server.</p>
      <span class="status">Server is running</span>
    </main>
  </body>
</html>`;

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(page);
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
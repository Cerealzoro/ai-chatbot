# Node HTML Server

Minimal Node.js server that serves a Gemini-powered chat page at `http://localhost:3000`.

## Run

```sh
npm start
```

Set `PORT` to use a different port:

```sh
PORT=8080 npm start
```

## Gemini setup

Set `GEMINI_API_KEY` as a secret environment variable in Render. Do not put the key in this repository or in browser code. The optional `GEMINI_MODEL` variable defaults to `gemini-3.6-flash`.
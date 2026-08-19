const http = require('node:http');

const port = process.env.PORT || 3000;

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Orbit Chat</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui, sans-serif; color: #e8ecf5; background: #10131c; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: #10131c; }
      button, input { font: inherit; }
      button { cursor: pointer; }
      .app { display: grid; grid-template-columns: 270px 1fr; min-height: 100vh; max-width: 1500px; margin: auto; }
      aside { padding: 28px 18px; border-right: 1px solid #272c3b; background: #151925; }
      .brand { display: flex; align-items: center; gap: 11px; margin: 0 10px 38px; font-size: 19px; font-weight: 700; letter-spacing: -0.03em; }
      .brand-mark { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 10px; color: #11151e; background: #a9e36f; font-size: 16px; font-weight: 900; }
      .new-chat { display: flex; align-items: center; gap: 10px; width: 100%; padding: 12px 13px; border: 1px solid #343b50; border-radius: 10px; color: #f2f5fb; background: #202638; text-align: left; }
      .new-chat:hover { border-color: #a9e36f; }
      .section-label { margin: 31px 10px 12px; color: #747d93; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      .history { display: grid; gap: 4px; }
      .history button { overflow: hidden; padding: 10px; border: 0; border-radius: 8px; color: #9da6bb; background: transparent; text-align: left; text-overflow: ellipsis; white-space: nowrap; }
      .history button.active, .history button:hover { color: #f0f3f9; background: #242a3c; }
      .profile { display: flex; align-items: center; gap: 10px; margin-top: auto; padding: 16px 10px 0; color: #b8c0d1; font-size: 13px; }
      .avatar { display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; color: #162017; background: #d3b8ff; font-size: 12px; font-weight: 800; }
      aside { display: flex; flex-direction: column; }
      main { display: flex; flex-direction: column; min-width: 0; background: radial-gradient(circle at 70% 0%, #20283c, transparent 32%), #10131c; }
      header { display: flex; align-items: center; justify-content: space-between; padding: 22px 42px; border-bottom: 1px solid #272c3b; }
      .chat-name { color: #f2f4f8; font-size: 15px; font-weight: 650; }
      .model { margin-left: 8px; padding: 5px 8px; border: 1px solid #3b4359; border-radius: 5px; color: #929caf; font-size: 11px; }
      .header-actions { display: flex; gap: 8px; }
      .icon-button { width: 34px; height: 34px; border: 0; border-radius: 8px; color: #8f98ac; background: transparent; font-size: 18px; }
      .icon-button:hover { color: #fff; background: #252b3c; }
      .conversation { width: min(760px, calc(100% - 48px)); margin: 0 auto; padding: 62px 0 30px; flex: 1; }
      .welcome { margin-bottom: 46px; }
      .welcome small { color: #a9e36f; font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
      h1 { max-width: 560px; margin: 13px 0 0; color: #f2f4f8; font-size: clamp(2.1rem, 5vw, 3.7rem); line-height: 1.03; letter-spacing: -0.055em; font-weight: 650; }
      .message { display: flex; gap: 14px; margin: 29px 0; }
      .message .avatar { flex: 0 0 auto; }
      .message-body { min-width: 0; padding-top: 2px; color: #c6ccda; font-size: 15px; line-height: 1.7; }
      .message-body strong { display: block; margin-bottom: 4px; color: #f1f3f8; font-size: 13px; }
      .message.user { justify-content: flex-end; }
      .message.user .message-body { max-width: 78%; padding: 12px 16px; border-radius: 14px 14px 3px 14px; color: #182018; background: #c5ed8a; line-height: 1.5; }
      .message.user .message-body strong { color: #304328; }
      .composer-wrap { width: min(760px, calc(100% - 48px)); margin: auto auto 27px; }
      .prompts { display: flex; gap: 8px; overflow: auto; margin-bottom: 12px; padding-bottom: 3px; }
      .prompt { flex: 0 0 auto; padding: 8px 11px; border: 1px solid #30374b; border-radius: 7px; color: #aab3c5; background: #181d2a; font-size: 12px; }
      .prompt:hover { border-color: #65748e; color: #fff; }
      .composer { display: flex; align-items: flex-end; gap: 10px; padding: 12px 12px 12px 17px; border: 1px solid #3b4358; border-radius: 14px; background: #1a1f2d; box-shadow: 0 10px 40px #080a0f66; }
      .composer:focus-within { border-color: #8fba5e; }
      input { flex: 1; min-width: 0; padding: 8px 0; border: 0; outline: 0; color: #e8ecf5; background: transparent; }
      input::placeholder { color: #687287; }
      .send { display: grid; place-items: center; width: 38px; height: 38px; border: 0; border-radius: 10px; color: #152014; background: #a9e36f; font-size: 18px; font-weight: 800; }
      .send:hover { background: #c6f18e; }
      .note { margin: 10px 0 0; color: #626c81; font-size: 11px; text-align: center; }
      @media (max-width: 700px) { .app { display: block; } aside { display: none; } header { padding: 18px 20px; } .conversation { padding-top: 38px; } }
    </style>
  </head>
  <body>
    <div class="app">
      <aside>
        <div class="brand"><span class="brand-mark">O</span> orbit chat</div>
        <button class="new-chat" type="button" onclick="newChat()"><span>+</span> New conversation</button>
        <div class="section-label">Recent</div>
        <nav class="history" aria-label="Recent conversations">
          <button class="active" type="button">A quiet afternoon in Kyoto</button>
          <button type="button">Plan my weekly meals</button>
          <button type="button">Ideas for a side project</button>
          <button type="button">Explain quantum computing</button>
        </nav>
        <div class="profile"><span class="avatar">VD</span><span>Vedarsh</span></div>
      </aside>
      <main>
        <header><div class="chat-name">A quiet afternoon in Kyoto <span class="model">Orbit 2.0</span></div><div class="header-actions"><button class="icon-button" type="button" aria-label="Share conversation">↗</button><button class="icon-button" type="button" aria-label="More options">•••</button></div></header>
        <section class="conversation" id="conversation" aria-live="polite">
          <div class="welcome"><small>Wednesday, August 19</small><h1>What shall we explore today?</h1></div>
          <div class="message"><span class="avatar" style="background:#a9e36f">O</span><div class="message-body"><strong>Orbit</strong>Good afternoon, Vedarsh. I was thinking about the small details that make a day memorable. What is on your mind?</div></div>
          <div class="message user"><div class="message-body"><strong>You</strong>Help me plan a slow afternoon in Kyoto.</div><span class="avatar">VD</span></div>
          <div class="message"><span class="avatar" style="background:#a9e36f">O</span><div class="message-body"><strong>Orbit</strong>Start with a walk through Gion before the streets get busy, then find a quiet teahouse near Kennin-ji. We can leave room for one beautiful surprise.</div></div>
        </section>
        <div class="composer-wrap"><div class="prompts"><button class="prompt" type="button" onclick="usePrompt(this)">Suggest a book</button><button class="prompt" type="button" onclick="usePrompt(this)">Plan a trip</button><button class="prompt" type="button" onclick="usePrompt(this)">Write something</button></div><form class="composer" onsubmit="sendMessage(event)"><input id="message-input" autocomplete="off" placeholder="Message Orbit..." aria-label="Message Orbit"><button class="send" type="submit" aria-label="Send message">↑</button></form><p class="note">Orbit can make mistakes. Check important information.</p></div>
      </main>
    </div>
    <script>
      function usePrompt(button) { document.getElementById('message-input').value = button.textContent; document.getElementById('message-input').focus(); }
      function newChat() { document.getElementById('conversation').innerHTML = '<div class="welcome"><small>New conversation</small><h1>What shall we explore today?</h1></div>'; document.getElementById('message-input').focus(); }
      const chatHistory = [];
      function addMessage(role, text) { const message = document.createElement('div'); message.className = 'message' + (role === 'user' ? ' user' : ''); const avatar = document.createElement('span'); avatar.className = 'avatar'; avatar.textContent = role === 'user' ? 'VD' : 'O'; if (role !== 'user') avatar.style.background = '#a9e36f'; const body = document.createElement('div'); body.className = 'message-body'; const name = document.createElement('strong'); name.textContent = role === 'user' ? 'You' : 'Orbit'; body.append(name, document.createTextNode(text)); if (role === 'user') message.append(body, avatar); else message.append(avatar, body); document.getElementById('conversation').append(message); message.scrollIntoView({ behavior: 'smooth', block: 'end' }); return body; }
      async function sendMessage(event) { event.preventDefault(); const input = document.getElementById('message-input'); const send = document.querySelector('.send'); const text = input.value.trim(); if (!text || send.disabled) return; input.value = ''; addMessage('user', text); chatHistory.push({ role: 'user', parts: [{ text }] }); send.disabled = true; send.textContent = '…'; const replyBody = addMessage('model', 'Thinking…'); try { const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: chatHistory }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'The chat request failed.'); const reply = data.reply || 'I could not generate a reply.'; replyBody.innerHTML = '<strong>Orbit</strong>'; replyBody.append(document.createTextNode(reply)); chatHistory.push({ role: 'model', parts: [{ text: reply }] }); } catch (error) { replyBody.innerHTML = '<strong>Orbit</strong>'; replyBody.append(document.createTextNode(error.message)); } finally { send.disabled = false; send.textContent = '↑'; input.focus(); } }
    </script>
  </body>
</html>`;

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(page);
    return;
  }

  if (request.method === 'POST' && request.url === '/api/chat') {
    if (!process.env.GEMINI_API_KEY) {
      response.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ error: 'Gemini is not configured on the server.' }));
      return;
    }

    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1000000) request.destroy();
    });
    request.on('end', async () => {
      try {
        const { contents } = JSON.parse(body);
        if (!Array.isArray(contents) || contents.length === 0) throw new Error('A chat message is required.');
        const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents })
        });
        const data = await geminiResponse.json();
        if (!geminiResponse.ok) throw new Error(data.error?.message || 'Gemini returned an error.');
        const reply = data.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
        if (!reply) throw new Error('Gemini returned an empty response.');
        response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ reply }));
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
const chat = document.getElementById('chat');
const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const sendButton = document.getElementById('send');
const statusBadge = document.getElementById('status');

function addMessage(role, text, isError = false) {
  const article = document.createElement('article');
  article.className = `message ${role}${isError ? ' error' : ''}`;
  const label = document.createElement('strong');
  label.textContent = role === 'user' ? 'YOU' : 'VEX';
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  article.append(label, paragraph);
  chat.appendChild(article);
  chat.scrollTop = chat.scrollHeight;
  return article;
}

async function checkStatus() {
  try {
    const response = await fetch('/api/status');
    const data = await response.json();
    if (!data.ok) throw new Error(data.error || 'Ollama is unavailable');
    statusBadge.textContent = data.installed ? `Ready · ${data.model}` : `Model missing · ${data.model}`;
  } catch (_error) {
    statusBadge.textContent = 'Ollama offline';
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message || sendButton.disabled) return;
  addMessage('user', message);
  input.value = '';
  sendButton.disabled = true;
  sendButton.textContent = 'Thinking…';
  const loading = addMessage('assistant', 'Thinking…');
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
    loading.querySelector('p').textContent = data.reply;
  } catch (error) {
    loading.classList.add('error');
    loading.querySelector('p').textContent = `Sorry, I couldn't get a reply. ${error.message}`;
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
    input.focus();
    checkStatus();
  }
});

checkStatus();

const OLLAMA_BASE_URL = (process.env.OLLAMA_HOST || 'http://localhost:11434').replace(/\/$/, '');
const MODEL = process.env.VEX_MODEL || 'qwen2.5:3b';

async function requestJson(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(120000) });
  } catch (_error) {
    throw new Error('Cannot connect to Ollama. Start Ollama and make sure it is running at http://localhost:11434.');
  }
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Ollama returned HTTP ${response.status}${detail ? `: ${detail.slice(0, 250)}` : ''}`);
  }
  return response.json();
}

async function getModelStatus() {
  try {
    const data = await requestJson(`${OLLAMA_BASE_URL}/api/tags`);
    const models = Array.isArray(data.models) ? data.models.map(item => item.name) : [];
    return { ok: true, model: MODEL, installed: models.some(name => name === MODEL || name.startsWith(`${MODEL}:`)), models };
  } catch (error) {
    return { ok: false, model: MODEL, error: error.message, models: [] };
  }
}

async function generateCompletion(message) {
  const data = await requestJson(`${OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt: message, stream: false })
  });
  if (typeof data.response !== 'string') throw new Error('Ollama returned an unexpected response.');
  return data.response.trim() || '(The model returned an empty response.)';
}

module.exports = { generateCompletion, getModelStatus };

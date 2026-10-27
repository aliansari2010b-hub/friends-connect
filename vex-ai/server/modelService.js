
const MODEL = process.env.VEX_MODEL || "qwen2.5:3b";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434";

async function getModelStatus() {
  const response = await fetch(`${OLLAMA_URL}/api/tags`, {
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error("Ollama is not responding. Make sure Ollama is running.");
  }

  const data = await response.json();
  const models = (data.models || []).map((model) => model.name);
  const modelAvailable = models.some(
    (name) => name === MODEL || name.startsWith(`${MODEL}:`)
  );

  return {
    ready: modelAvailable,
    model: MODEL,
    ollamaConnected: true,
    models,
    message: modelAvailable
      ? "VEX AI is ready."
      : `Model ${MODEL} is not installed yet.`
  };
}

async function chatWithModel(message) {
  const status = await getModelStatus();

  if (!status.ready) {
    throw new Error(
      `Model ${MODEL} is not installed. Open Command Prompt and run: ollama pull ${MODEL}`
    );
  }

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      prompt: message,
      stream: false
    }),
    signal: AbortSignal.timeout(120000)
  });

  if (!response.ok) {
    throw new Error("Ollama could not generate a response.");
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Ollama returned an empty response. Try again.");
  }

  return data.response.trim();
}

module.exports = { chatWithModel, getModelStatus };

# VEX AI — Phase 1

A local browser chat interface that connects to Ollama. This phase does not include persistent memory, voice, PC automation, or cybersecurity execution tools.

## Requirements
- Windows 10 64-bit
- Node.js 18 or newer (includes `fetch`)
- Ollama installed and running: https://ollama.com/

## Setup in Windows Command Prompt
Open Command Prompt inside the `vex-ai` folder, then run:

```bat
npm install
npm test
ollama pull qwen2.5:3b
npm start
```

Open http://localhost:3000 in your browser. Keep the terminal window open while using the app.

If the model is not already available, the first model download may take time and uses disk space. The 3B model is a lightweight starting point for an 8 GB RAM computer, but performance varies.

## Optional model override (PowerShell)
```powershell
$env:VEX_MODEL = "llama3.2:3b"
npm start
```

Ollama normally listens on `http://localhost:11434`. If VEX reports it cannot connect, confirm Ollama is running and try `ollama list`.

## What `npm test` checks
The test script runs Node.js syntax checks on the server and browser JavaScript files. It does not test Ollama connectivity or prove that generated replies work.

## Troubleshooting
- `npm` is not recognized: install Node.js LTS from https://nodejs.org/ and reopen Command Prompt.
- Ollama connection error: start Ollama and confirm `ollama list` works.
- Model missing: run `ollama pull qwen2.5:3b`.
- Port 3000 is busy: set `PORT` to another port before `npm start`.

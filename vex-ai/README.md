
# VEX AI — Phase 1

A lightweight local AI chat interface using Node.js, Express, and Ollama.

## Requirements

- Windows 10 64-bit
- Node.js 18 or newer
- Ollama

## Setup

Open Command Prompt inside the `vex-ai` folder.

Install the dependencies:

```bash
npm install
```

Download the default AI model:

```bash
ollama pull qwen2.5:3b
```

Start VEX AI:

```bash
npm start
```

Open this address in your browser:

http://localhost:3000

Keep the terminal open while using VEX AI.

## Check the code

Run the basic syntax checks:

```bash
npm test
```

## Optional model change

In PowerShell, set a different installed model before starting:

```powershell
$env:VEX_MODEL = "llama3.2:3b"
npm start
```

## Phase 1 limitations

This version provides local text chat only. Persistent memory, voice, web research, PC automation, and cybersecurity tools are not implemented yet.

Your computer must have enough available memory to run the selected model.

const express = require('express');
const path = require('path');
const { generateCompletion, getModelStatus } = require('./modelService');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/status', async (_req, res) => {
  const status = await getModelStatus();
  res.status(status.ok ? 200 : 503).json(status);
});

app.post('/api/chat', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please enter a message.' });
  if (message.length > 8000) return res.status(413).json({ error: 'Message is too long (8,000 characters max).' });

  try {
    const reply = await generateCompletion(message);
    res.json({ reply });
  } catch (error) {
    res.status(503).json({ error: error.message || 'Could not reach Ollama.' });
  }
});

app.listen(PORT, () => {
  console.log(`VEX AI is running at http://localhost:${PORT}`);
});


const express = require("express");
const path = require("path");
const { chatWithModel, getModelStatus } = require("./modelService");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/status", async (req, res) => {
  try {
    const status = await getModelStatus();
    res.json(status);
  } catch (error) {
    res.status(503).json({
      ready: false,
      error: error.message || "Could not connect to Ollama."
    });
  }
});

app.post("/api/chat", async (req, res) => {
  const message = typeof req.body.message === "string"
    ? req.body.message.trim()
    : "";

  if (!message) {
    return res.status(400).json({ error: "Please enter a message." });
  }

  if (message.length > 12000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const reply = await chatWithModel(message);
    res.json({ reply });
  } catch (error) {
    res.status(503).json({
      error: error.message || "The AI could not respond. Check Ollama."
    });
  }
});

app.listen(PORT, () => {
  console.log(`VEX AI is running at http://localhost:${PORT}`);
});

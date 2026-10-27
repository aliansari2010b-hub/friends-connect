
const form = document.getElementById("chat-form");
const input = document.getElementById("message");
const sendButton = document.getElementById("send");
const chat = document.getElementById("chat");
const status = document.getElementById("status");
const welcome = document.getElementById("welcome");

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.textContent = text;
  chat.appendChild(message);
  message.scrollIntoView({ behavior: "smooth", block: "nearest" });
  return message;
}

async function checkStatus() {
  try {
    const response = await fetch("/api/status");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Ollama is unavailable.");
    }

    if (data.ready) {
      status.textContent = `Ready · ${data.model}`;
    } else if (data.ollamaConnected) {
      status.textContent = "Model not installed";
    } else {
      status.textContent = "Ollama unavailable";
    }
  } catch {
    status.textContent = "Start VEX AI locally";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message || sendButton.disabled) return;

  welcome.hidden = true;
  addMessage(message, "user");

  input.value = "";
  sendButton.disabled = true;
  sendButton.textContent = "Thinking…";

  const pending = addMessage("VEX is thinking…", "assistant");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    pending.textContent = data.reply;
    await checkStatus();
  } catch (error) {
    pending.className = "message error";
    pending.textContent = error.message ||
      "Could not reach VEX AI. Check that the server is running.";
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send ↑";
    input.focus();
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

checkStatus();

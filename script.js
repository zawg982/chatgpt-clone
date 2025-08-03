const form = document.getElementById('chat-form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  addMessage('user', userText);
  input.value = '';
  addMessage('bot', '...');

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/distilgpt2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: userText })
    });

    const result = await response.json();

    if (result.error) {
      updateLastBotMessage('Error from API: ' + result.error);
    } else {
      const botReply = result[0]?.generated_text || "Sorry, I didn't understand that.";
      updateLastBotMessage(botReply);
    }
  } catch (err) {
    updateLastBotMessage('Network error');
    console.error(err);
  }
});

function addMessage(role, text) {
  const div = document.createElement('div');
  div.className = 'bubble ' + role;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function updateLastBotMessage(text) {
  const botMessages = [...messages.querySelectorAll('.bot')];
  if (botMessages.length) {
    botMessages[botMessages.length - 1].textContent = text;
  }
}

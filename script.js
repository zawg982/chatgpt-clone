const OPENROUTER_API_KEY = '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';

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  addMessage('user', userMsg);
  chatInput.value = '';
  addMessage('bot', '...'); // Show typing

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://zawg982.github.io/chatgpt-clone/',
        'X-Title': 'ChatGPT Clone'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMsg }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No reply';
    updateLastBotMessage(reply);
  } catch (err) {
    updateLastBotMessage('Error contacting AI.');
    console.error(err);
  }
});

function addMessage(role, text) {
  const msg = document.createElement('div');
  msg.className = `chat-bubble ${role}`;
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function updateLastBotMessage(text) {
  const bubbles = chatLog.querySelectorAll('.chat-bubble.bot');
  if (bubbles.length > 0) {
    bubbles[bubbles.length - 1].textContent = text;
  }
}

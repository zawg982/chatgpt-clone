const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatLog = document.getElementById('chat-log');

const OPENROUTER_API_KEY = 'your-api-key-here'; // Replace this!

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userMsg = chatInput.value.trim();
  if (!userMsg) return;

  addMessage('user', userMsg);
  chatInput.value = '';
  addMessage('bot', '...'); // typing...

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistral/mistral-7b-instruct',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userMsg }
      ]
    })
  });

  const data = await res.json();
  const botReply = data.choices?.[0]?.message?.content || "Error getting response.";
  updateLastBotMessage(botReply);
});

function addMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-bubble ${role}`;
  msgDiv.textContent = text;
  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function updateLastBotMessage(text) {
  const last = [...chatLog.querySelectorAll('.chat-bubble')].pop();
  if (last && last.classList.contains('bot')) {
    last.textContent = text;
  }
}

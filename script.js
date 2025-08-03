const API_URL = 'https://api-inference.huggingface.co/models/Chain-GPT/Solidity-LLM';
const API_TOKEN = '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'; // <-- REPLACE with your Hugging Face API key

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

function addMessage(text, sender) {
  const div = document.createElement('div');
  div.classList.add('bubble', sender);
  div.textContent = text;
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function updateLastBotMessage(text) {
  const botMessages = chatContainer.querySelectorAll('.bot');
  if (botMessages.length > 0) {
    botMessages[botMessages.length - 1].textContent = text;
  }
}

async function queryModel(inputText) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: inputText,
      options: { wait_for_model: true }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || response.statusText);
  }

  const data = await response.json();
  return data;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  addMessage(userText, 'user');
  chatInput.value = '';
  addMessage('...', 'bot'); // typing indicator

  try {
    const result = await queryModel(userText);

    // result is typically an array with generated_text field
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      updateLastBotMessage(result[0].generated_text);
    } else {
      updateLastBotMessage('Sorry, no response from the model.');
    }
  } catch (err) {
    updateLastBotMessage('Error: ' + err.message);
  }
});

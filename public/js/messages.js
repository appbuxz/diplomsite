function createMessageCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('strong');
  title.textContent = `${item.name} (${item.email})`;

  const text = document.createElement('p');
  text.textContent = item.message;

  card.append(title, text);
  return card;
}

async function loadMessages() {
  const container = document.getElementById('messages');
  try {
    const res = await fetch('/api/messages');
    const data = await res.json();
    container.innerHTML = '';

    if (!Array.isArray(data) || !data.length) {
      container.textContent = 'Пока нет сообщений.';
      return;
    }

    data.forEach((item) => container.appendChild(createMessageCard(item)));
  } catch (_e) {
    container.textContent = 'Ошибка загрузки сообщений.';
  }
}

loadMessages();

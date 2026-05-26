async function loadMessages() {
  const container = document.getElementById('messages');
  try {
    const res = await fetch('/api/messages');
    const data = await res.json();
    if (!data.length) {
      container.textContent = 'Пока нет сообщений.';
      return;
    }
    container.innerHTML = data
      .map((m) => `<div class="card"><strong>${m.name}</strong> (${m.email})<br/>${m.message}</div>`)
      .join('');
  } catch (_e) {
    container.textContent = 'Ошибка загрузки сообщений.';
  }
}

loadMessages();

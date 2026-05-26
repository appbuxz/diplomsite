const form = document.getElementById('contact-form');
const statusEl = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Отправка...';

  const payload = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ошибка');
    }

    form.reset();
    statusEl.textContent = 'Сообщение успешно отправлено!';
  } catch (err) {
    statusEl.textContent = `Ошибка: ${err.message}`;
  }
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'site.db');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const initSql = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.serialize(() => {
  db.run(initSql);
});

function sendPage(res, pageName) {
  return res.sendFile(path.join(__dirname, 'public', pageName));
}

app.get('/', (_req, res) => sendPage(res, 'index.html'));
app.get('/about', (_req, res) => sendPage(res, 'about.html'));
app.get('/contacts', (_req, res) => sendPage(res, 'contacts.html'));
app.get('/portfolio', (_req, res) => sendPage(res, 'portfolio.html'));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', now: new Date().toISOString() });
});

app.get('/api/messages', (_req, res) => {
  db.all('SELECT * FROM messages ORDER BY id DESC LIMIT 50', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Не удалось получить сообщения' });
    }
    return res.json(rows);
  });
});

app.post('/api/messages', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  if (name.length > 120 || message.length > 2000) {
    return res.status(400).json({ error: 'Слишком длинные данные' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Некорректный email' });
  }

  const stmt = 'INSERT INTO messages(name, email, message) VALUES(?, ?, ?)';
  db.run(stmt, [name, email, message], function onInsert(err) {
    if (err) {
      return res.status(500).json({ error: 'Не удалось сохранить сообщение' });
    }
    return res.status(201).json({ id: this.lastID, name, email, message });
  });
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

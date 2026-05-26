const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'data', 'site.db');
const db = new sqlite3.Database(dbPath);

app.use(express.json());
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

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contacts', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contacts.html'));
});

app.get('/api/messages', (_req, res) => {
  db.all('SELECT * FROM messages ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Не удалось получить сообщения' });
    }
    return res.json(rows);
  });
});

app.post('/api/messages', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  const stmt = 'INSERT INTO messages(name, email, message) VALUES(?, ?, ?)';
  db.run(stmt, [name, email, message], function onInsert(err) {
    if (err) {
      return res.status(500).json({ error: 'Не удалось сохранить сообщение' });
    }
    return res.status(201).json({ id: this.lastID, name, email, message });
  });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const db = new sqlite3.Database(path.join(dataDir, 'site.db'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

db.run(`CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

const page = (name) => (_req, res) => res.sendFile(path.join(__dirname, 'public', name));
app.get('/', page('index.html'));
app.get('/about', page('about.html'));
app.get('/rooms', page('rooms.html'));
app.get('/services', page('services.html'));
app.get('/gallery', page('gallery.html'));
app.get('/booking', page('booking.html'));
app.get('/contacts', page('contacts.html'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/messages', (_req, res) => db.all('SELECT * FROM messages ORDER BY id DESC LIMIT 50', (e, rows) => e ? res.status(500).json({ error: 'db' }) : res.json(rows)));
app.post('/api/messages', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim();
  const message = String(req.body.message || '').trim();
  if (!name || !email || !message) return res.status(400).json({ error: 'Заполните все поля' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Некорректный email' });
  db.run('INSERT INTO messages(name,email,message) VALUES(?,?,?)', [name, email, message], function (e) {
    if (e) return res.status(500).json({ error: 'db' });
    return res.status(201).json({ id: this.lastID });
  });
});

app.use(page('404.html'));
app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));

const express = require('express');
const app = express();
const db = require('./database');

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

app.get('/api/todos', (req, res) => {
    db.all('SELECT * FROM todos', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch todos' });
        }
        res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    const query = 'INSERT INTO todos (title, done) VALUES (?, ?)';
    db.run(query, [title, 0], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to add todo' });
        }
        res.status(201).json({ id: this.lastID, title, done: false });
    });
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, done } = req.body;
    const query = 'UPDATE todos SET title = COALESCE(?, title), done = COALESCE(?, done) WHERE id = ?';
    db.run(query, [title, done, id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update todo' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ id, title, done });
    });
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM todos WHERE id = ?';
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete todo' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(204).end();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

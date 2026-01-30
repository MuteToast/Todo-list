const express = require('express');
const app = express();
const db = require('./database');

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));

app.get('/api/todos', (req, res) => {
    try {
        const todos = db.prepare('SELECT * FROM todos').all();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch todos' });
    }
});

app.post('/api/todos', (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Title is required' });
    }
    try {
        const result = db.prepare('INSERT INTO todos (title, done) VALUES (?, ?)').run(title, 0);
        res.status(201).json({ id: result.lastInsertRowid, title, done: false });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add todo' });
    }
});

app.put('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title, done } = req.body;
    try {
        const result = db.prepare('UPDATE todos SET title = COALESCE(?, title), done = COALESCE(?, done) WHERE id = ?')
            .run(title, done, id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ id, title, done });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update todo' });
    }
});

app.delete('/api/todos/:id', (req, res) => {
    const { id } = req.params;
    try {
        const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

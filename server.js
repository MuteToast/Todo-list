const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(express.static('public'));

let todos = [];
let idCounter = 1;

app.get('/api/todos', (req, res) => {
    res.json(todos);
});

app.post('/api/todos', (req, res) => {  
    const {title} = req.body;
    if (!title) {
        return res.status(400).json({error: 'Title is required'});
    }
    const newTodo = {id: idCounter++, title, done: false};
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
    const {id} = req.params;
    const {title, done} = req.body;
    const todo = todos.find(t => t.id === parseInt(id));
    if (!todo) {
        return res.status(404).json({error: 'Todo not found'});
    }
    if (title !== undefined) todo.title = title;
    if (done !== undefined) todo.done = done;
    res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
    const {id} = req.params;
    const index = todos.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
        return res.status(404).json({error: 'Todo not found'});
    }
    todos.splice(index, 1);
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

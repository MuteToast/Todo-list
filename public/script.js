const apiUrl = '/api/todos';

async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    renderTodos(todos);
}

async function addTodo() {
    const title = document.getElementById('todo-input').value;
    if (!title) return alert('Please enter a title');
    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title})
    });
    if (response.ok) {
        fetchTodos();
        document.getElementById('todo-input').value = '';
    }
}

async function updateTodo(id, done) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({done})
    });
    fetchTodos()
}

async function deleteTodo(id) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchTodos();
}

function renderTodos(todos) {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.done;
        checkbox.addEventListener('change', () => updateTodo(todo.id, checkbox.checked));
        li.appendChild(checkbox);

        const text = document.createTextNode(todo.title);
        li.appendChild(text);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
        li.appendChild(deleteBtn);

        list.appendChild(li);
    });
}

document.getElementById('add-todo').addEventListener('click', addTodo);
fetchTodos();
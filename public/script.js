const apiUrl = '/api/todos';

async function fetchTodos() {
    const response = await fetch(apiUrl);
    const todos = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.title;
        todoList.appendChild(li);
    });
}

document.getElementById('add-todo').addEventListener('click', async () => {
    const todoInput = document.getElementById('todo-input');
    const title = todoInput.value.trim();

    if (title) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (response.ok) {
            todoInput.value = '';
            fetchTodos();
        } else {
            console.error('Failed to add todo');
        }
    } else {
        alert('Please enter a todo');
    }
});

fetchTodos();
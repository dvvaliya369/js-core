class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.initElements();
        this.attachEventListeners();
        this.render();
    }

    initElements() {
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.todoCount = document.getElementById('todoCount');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    attachEventListeners() {
        this.addTodoBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    }

    loadTodos() {
        const stored = localStorage.getItem('todos');
        return stored ? JSON.parse(stored) : [];
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (!text) {
            this.todoInput.focus();
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.todoInput.value = '';
        this.todoInput.focus();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        this.filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });

        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    updateCount() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        const text = activeCount === 1 ? 'task' : 'tasks';
        this.todoCount.textContent = `${activeCount} ${text} remaining`;
    }

    renderEmptyState() {
        let message = '';
        let icon = '';

        switch (this.currentFilter) {
            case 'active':
                message = 'No active tasks';
                icon = '✨';
                break;
            case 'completed':
                message = 'No completed tasks';
                icon = '📋';
                break;
            default:
                message = 'No tasks yet';
                icon = '📝';
        }

        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <div class="empty-state-text">${message}</div>
                <div class="empty-state-subtext">
                    ${this.currentFilter === 'all' ? 'Add a task to get started!' : ''}
                </div>
            </div>
        `;
    }

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = this.renderEmptyState();
        } else {
            this.todoList.innerHTML = filteredTodos.map(todo => `
                <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                    <div class="todo-checkbox" onclick="todoApp.toggleTodo(${todo.id})"></div>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})" aria-label="Delete task">×</button>
                </li>
            `).join('');
        }

        this.updateCount();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is ready
let todoApp;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        todoApp = new TodoApp();
    });
} else {
    todoApp = new TodoApp();
}

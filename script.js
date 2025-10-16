// Todo App JavaScript - Dark Blue Theme

class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
    }

    bindEvents() {
        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');
        const todoList = document.getElementById('todoList');
        const clearBtn = document.getElementById('clearCompleted');
        const filterBtns = document.querySelectorAll('.filter-btn');

        // Add todo
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Todo list events (using event delegation)
        todoList.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            const todoId = parseInt(todoItem.dataset.id);

            if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTodo(todoId);
            } else if (e.target.classList.contains('delete-btn') || e.target.closest('.delete-btn')) {
                this.deleteTodo(todoId);
            }
        });

        // Clear completed
        clearBtn.addEventListener('click', () => this.clearCompleted());

        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Focus input on page load
        todoInput.focus();
    }

    addTodo() {
        const todoInput = document.getElementById('todoInput');
        const text = todoInput.value.trim();

        if (text === '') {
            this.showInputError();
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo);
        this.saveTodos();
        this.render();
        this.updateStats();

        todoInput.value = '';
        todoInput.focus();

        // Show success animation
        this.showAddSuccess();
    }

    showInputError() {
        const inputContainer = document.querySelector('.input-container');
        inputContainer.style.borderColor = '#f44336';
        setTimeout(() => {
            inputContainer.style.borderColor = 'rgba(100, 181, 246, 0.2)';
        }, 1000);
    }

    showAddSuccess() {
        const addBtn = document.getElementById('addBtn');
        addBtn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
        setTimeout(() => {
            addBtn.style.background = 'linear-gradient(135deg, #1976d2, #42a5f5)';
        }, 300);
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.updateStats();
        }
    }

    deleteTodo(id) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        if (todoItem) {
            todoItem.classList.add('removing');
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
                this.updateStats();
            }, 300);
        }
    }

    clearCompleted() {
        const completedTodos = this.todos.filter(t => t.completed);
        if (completedTodos.length === 0) return;

        // Animate completed items
        completedTodos.forEach(todo => {
            const todoItem = document.querySelector(`[data-id="${todo.id}"]`);
            if (todoItem) {
                todoItem.classList.add('removing');
            }
        });

        setTimeout(() => {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
            this.updateStats();
        }, 300);
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

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

    render() {
        const todoList = document.getElementById('todoList');
        const emptyState = document.getElementById('emptyState');
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');

        const todoHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-content">
                    <div class="todo-checkbox ${todo.completed ? 'checked' : ''}"></div>
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <div class="todo-actions">
                        <button class="delete-btn" title="Delete todo">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>
        `).join('');

        todoList.innerHTML = todoHTML;
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTodos').textContent = total;
        document.getElementById('completedTodos').textContent = completed;
        document.getElementById('remainingTodos').textContent = remaining;

        // Show/hide clear completed button
        const clearBtn = document.getElementById('clearCompleted');
        if (completed > 0) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (error) {
            console.warn('Could not save todos to localStorage:', error);
        }
    }

    loadTodos() {
        try {
            const todos = localStorage.getItem('todos');
            return todos ? JSON.parse(todos) : [];
        } catch (error) {
            console.warn('Could not load todos from localStorage:', error);
            return [];
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to clear input
    if (e.key === 'Escape') {
        const todoInput = document.getElementById('todoInput');
        todoInput.value = '';
        todoInput.blur();
    }
    
    // Ctrl/Cmd + A to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        const todoInput = document.getElementById('todoInput');
        if (document.activeElement !== todoInput) {
            e.preventDefault();
            todoInput.focus();
            todoInput.select();
        }
    }
});

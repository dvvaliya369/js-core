class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.init();
    }

    init() {
        this.loadTheme();
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            this.themeIcon.textContent = '☀️';
        } else {
            document.body.classList.remove('dark-theme');
            this.themeIcon.textContent = '🌙';
        }
    }
}

class TodoManager {
    constructor() {
        this.todos = [];
        this.currentFilter = 'all';
        this.todoCounter = 0;
        
        this.todoInput = document.getElementById('todoInput');
        this.addTodoBtn = document.getElementById('addTodoBtn');
        this.todoList = document.getElementById('todoList');
        this.emptyState = document.getElementById('emptyState');
        this.todoCount = document.getElementById('todoCount');
        this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.attachEventListeners();
        this.render();
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

        this.clearCompletedBtn.addEventListener('click', () => {
            this.clearCompleted();
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        
        if (!text) {
            toastManager.warning('Please enter a todo!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.push(todo);
        this.todoInput.value = '';
        this.saveToLocalStorage();
        this.render();
        
        toastManager.success('Todo added successfully!');
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToLocalStorage();
            this.render();
            
            if (todo.completed) {
                toastManager.success('Todo completed! 🎉');
            } else {
                toastManager.info('Todo marked as active');
            }
        }
    }

    deleteTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.render();
            toastManager.info('Todo deleted');
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            toastManager.warning('No completed todos to clear');
            return;
        }

        this.todos = this.todos.filter(t => !t.completed);
        this.saveToLocalStorage();
        this.render();
        toastManager.success(`Cleared ${completedCount} completed todo${completedCount > 1 ? 's' : ''}`);
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

    render() {
        const filteredTodos = this.getFilteredTodos();
        
        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '';
            this.emptyState.classList.remove('hidden');
            
            if (this.currentFilter === 'active' && this.todos.length > 0) {
                this.emptyState.innerHTML = `
                    <div class="empty-icon">✨</div>
                    <p>No active todos. Great job!</p>
                `;
            } else if (this.currentFilter === 'completed' && this.todos.length > 0) {
                this.emptyState.innerHTML = `
                    <div class="empty-icon">📋</div>
                    <p>No completed todos yet</p>
                `;
            } else {
                this.emptyState.innerHTML = `
                    <div class="empty-icon">📝</div>
                    <p>No todos yet. Add one to get started!</p>
                `;
            }
        } else {
            this.emptyState.classList.add('hidden');
            this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoElement(todo)).join('');
        }
        
        this.updateFooter();
    }

    createTodoElement(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="todoManager.toggleTodo(${todo.id})"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn" onclick="todoManager.deleteTodo(${todo.id})" aria-label="Delete todo">×</button>
            </li>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateFooter() {
        const activeCount = this.todos.filter(t => !t.completed).length;
        const completedCount = this.todos.filter(t => t.completed).length;
        
        this.todoCount.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        
        this.clearCompletedBtn.disabled = completedCount === 0;
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
            toastManager.error('Failed to save todos');
        }
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem('todos');
            if (stored) {
                this.todos = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Failed to load from localStorage:', e);
            toastManager.error('Failed to load todos');
            this.todos = [];
        }
    }
}

// Initialize theme and todo manager when DOM is ready
let themeManager;
let todoManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        themeManager = new ThemeManager();
        todoManager = new TodoManager();
    });
} else {
    themeManager = new ThemeManager();
    todoManager = new TodoManager();
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, TodoManager };
}

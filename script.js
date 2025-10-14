class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateCounts();
    }

    bindEvents() {
        // Add todo
        const addBtn = document.getElementById('addBtn');
        const todoInput = document.getElementById('todoInput');
        
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateFilterButtons();
                this.render();
            });
        });

        // Clear completed
        const clearBtn = document.getElementById('clearCompleted');
        clearBtn.addEventListener('click', () => this.clearCompleted());
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (text === '') {
            this.showInputError();
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(newTodo);
        input.value = '';
        this.clearInputError();
        this.saveTodos();
        this.render();
        this.updateCounts();
        
        // Focus back on input for continuous adding
        input.focus();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
            this.updateCounts();
        }
    }

    deleteTodo(id) {
        // Add confirmation for delete action
        if (confirm('Are you sure you want to delete this todo?')) {
            this.todos = this.todos.filter(t => t.id !== id);
            this.saveTodos();
            this.render();
            this.updateCounts();
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            return;
        }

        if (confirm(`Are you sure you want to clear ${completedCount} completed todo(s)?`)) {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
            this.updateCounts();
        }
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

        // Clear current list
        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            emptyState.classList.remove('hidden');
            this.updateEmptyStateMessage();
        } else {
            emptyState.classList.add('hidden');
            
            filteredTodos.forEach(todo => {
                const todoItem = this.createTodoElement(todo);
                todoList.appendChild(todoItem);
            });
        }
    }

    createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="app.toggleTodo('${todo.id}')"></div>
            <span class="todo-text">${this.escapeHtml(todo.text)}</span>
            <div class="todo-actions">
                <button class="delete-btn" onclick="app.deleteTodo('${todo.id}')" 
                        title="Delete todo">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return li;
    }

    updateFilterButtons() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    updateCounts() {
        const all = this.todos.length;
        const active = this.todos.filter(t => !t.completed).length;
        const completed = this.todos.filter(t => t.completed).length;

        document.getElementById('allCount').textContent = all;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('completedCount').textContent = completed;

        // Update clear completed button visibility
        const clearBtn = document.getElementById('clearCompleted');
        clearBtn.style.opacity = completed > 0 ? '1' : '0.5';
        clearBtn.disabled = completed === 0;
    }

    updateEmptyStateMessage() {
        const emptyState = document.getElementById('emptyState');
        const icon = emptyState.querySelector('i');
        const title = emptyState.querySelector('h3');
        const message = emptyState.querySelector('p');

        switch (this.currentFilter) {
            case 'active':
                icon.className = 'fas fa-check-circle';
                title.textContent = 'No active todos!';
                message.textContent = 'Great job! All your todos are completed.';
                break;
            case 'completed':
                icon.className = 'fas fa-clock';
                title.textContent = 'No completed todos!';
                message.textContent = 'Complete some todos to see them here.';
                break;
            default:
                icon.className = 'fas fa-clipboard-list';
                title.textContent = 'No todos yet!';
                message.textContent = 'Add a new task to get started.';
                break;
        }
    }

    showInputError() {
        const input = document.getElementById('todoInput');
        input.style.borderColor = '#ff6b6b';
        input.placeholder = 'Please enter a todo item!';
        
        setTimeout(() => {
            this.clearInputError();
        }, 2000);
    }

    clearInputError() {
        const input = document.getElementById('todoInput');
        input.style.borderColor = '#e1e5e9';
        input.placeholder = 'What needs to be done?';
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    saveTodos() {
        try {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        } catch (e) {
            console.error('Failed to save todos to localStorage:', e);
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('todos');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load todos from localStorage:', e);
            return [];
        }
    }

    // Export todos as JSON (bonus feature)
    exportTodos() {
        const dataStr = JSON.stringify(this.todos, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import todos from JSON (bonus feature)
    importTodos(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedTodos = JSON.parse(e.target.result);
                    if (Array.isArray(importedTodos)) {
                        this.todos = importedTodos;
                        this.saveTodos();
                        this.render();
                        this.updateCounts();
                        alert('Todos imported successfully!');
                    }
                } catch (error) {
                    alert('Invalid file format. Please select a valid JSON file.');
                }
            };
            reader.readAsText(file);
        }
    }
}

// Utility functions for keyboard navigation
document.addEventListener('keydown', (e) => {
    // Escape key to clear input
    if (e.key === 'Escape') {
        const input = document.getElementById('todoInput');
        input.value = '';
        input.blur();
    }
    
    // Ctrl/Cmd + A to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        document.getElementById('todoInput').focus();
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Service Worker Registration (for offline functionality - optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

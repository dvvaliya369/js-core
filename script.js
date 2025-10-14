class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.render();
        this.updateStats();
    }

    initializeElements() {
        this.todoForm = document.getElementById('todo-form');
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.emptyState = document.getElementById('empty-state');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.clearButton = document.getElementById('clear-completed');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toast-message');
        
        // Stats elements
        this.totalTasks = document.getElementById('total-tasks');
        this.activeTasks = document.getElementById('active-tasks');
        this.completedTasks = document.getElementById('completed-tasks');
    }

    attachEventListeners() {
        this.todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e));
        });
        
        this.clearButton.addEventListener('click', () => this.clearCompleted());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.editingId) {
                this.cancelEdit();
            }
        });
    }

    handleAddTodo(e) {
        e.preventDefault();
        const text = this.todoInput.value.trim();
        
        if (!text) {
            this.showToast('Please enter a task!', 'error');
            return;
        }

        if (this.editingId) {
            this.updateTodo(this.editingId, text);
            this.editingId = null;
            this.todoInput.placeholder = 'Add a new task...';
        } else {
            this.addTodo(text);
        }
        
        this.todoInput.value = '';
    }

    addTodo(text) {
        const todo = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.updateStats();
        this.showToast('Task added successfully!', 'success');
    }

    updateTodo(id, newText) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.text = newText;
            this.saveTodos();
            this.render();
            this.showToast('Task updated successfully!', 'success');
        }
    }

    deleteTodo(id) {
        const todoElement = document.querySelector(`[data-id="${id}"]`);
        if (todoElement) {
            todoElement.classList.add('removing');
            
            setTimeout(() => {
                this.todos = this.todos.filter(t => t.id !== id);
                this.saveTodos();
                this.render();
                this.updateStats();
                this.showToast('Task deleted!', 'warning');
            }, 500);
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            
            const checkbox = document.querySelector(`[data-id="${id}"] .todo-checkbox`);
            const todoItem = document.querySelector(`[data-id="${id}"]`);
            
            if (todo.completed) {
                checkbox.classList.add('checked');
                todoItem.classList.add('completed');
                this.showToast('Task completed! 🎉', 'success');
            } else {
                checkbox.classList.remove('checked');
                todoItem.classList.remove('completed');
                this.showToast('Task marked as active', 'warning');
            }
            
            this.updateStats();
        }
    }

    startEdit(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingId = id;
            this.todoInput.value = todo.text;
            this.todoInput.focus();
            this.todoInput.placeholder = 'Update your task...';
            this.showToast('Editing mode activated', 'warning');
        }
    }

    cancelEdit() {
        this.editingId = null;
        this.todoInput.value = '';
        this.todoInput.placeholder = 'Add a new task...';
        this.showToast('Edit cancelled', 'warning');
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        
        if (completedCount === 0) {
            this.showToast('No completed tasks to clear!', 'warning');
            return;
        }

        // Add removing animation to completed items
        const completedItems = document.querySelectorAll('.todo-item.completed');
        completedItems.forEach(item => {
            item.classList.add('removing');
        });

        setTimeout(() => {
            this.todos = this.todos.filter(t => !t.completed);
            this.saveTodos();
            this.render();
            this.updateStats();
            this.showToast(`${completedCount} completed task${completedCount > 1 ? 's' : ''} cleared!`, 'success');
        }, 500);
    }

    handleFilterChange(e) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
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
            this.emptyState.classList.add('show');
            
            // Update empty state message based on filter
            const emptyMessages = {
                'all': 'No tasks yet',
                'active': 'No active tasks',
                'completed': 'No completed tasks'
            };
            
            this.emptyState.querySelector('h3').textContent = emptyMessages[this.currentFilter];
        } else {
            this.emptyState.classList.remove('show');
            this.todoList.innerHTML = filteredTodos.map(todo => this.createTodoHTML(todo)).join('');
            
            // Attach event listeners to new elements
            this.attachTodoListeners();
        }
    }

    createTodoHTML(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="app.toggleTodo('${todo.id}')"></div>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="action-btn edit-btn" onclick="app.startEdit('${todo.id}')" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="app.deleteTodo('${todo.id}')" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    }

    attachTodoListeners() {
        // Add hover effects and animations
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach((item, index) => {
            // Stagger animation for newly added items
            if (!item.classList.contains('completed')) {
                item.style.animationDelay = `${index * 50}ms`;
            }
        });
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        // Animate number changes
        this.animateNumber(this.totalTasks, total);
        this.animateNumber(this.activeTasks, active);
        this.animateNumber(this.completedTasks, completed);

        // Update clear button state
        this.clearButton.disabled = completed === 0;
        this.clearButton.style.opacity = completed === 0 ? '0.3' : '0.7';
    }

    animateNumber(element, newValue) {
        const currentValue = parseInt(element.textContent) || 0;
        
        if (currentValue !== newValue) {
            element.style.animation = 'pulse 0.3s ease-out';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.style.animation = '';
            }, 150);
        }
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Utility method to export/import todos
    exportTodos() {
        const data = {
            todos: this.todos,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Todos exported successfully!', 'success');
    }

    importTodos(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.todos && Array.isArray(data.todos)) {
                    this.todos = data.todos;
                    this.saveTodos();
                    this.render();
                    this.updateStats();
                    this.showToast('Todos imported successfully!', 'success');
                } else {
                    this.showToast('Invalid file format!', 'error');
                }
            } catch (error) {
                this.showToast('Error reading file!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + / to focus input
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        document.getElementById('todo-input').focus();
    }
    
    // Ctrl/Cmd + Shift + C to clear completed
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        if (window.app) {
            window.app.clearCompleted();
        }
    }
});

// Add drag and drop functionality for file import
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        container.style.backgroundColor = 'rgba(255,255,255,0.1)';
    });
    
    container.addEventListener('dragleave', (e) => {
        e.preventDefault();
        container.style.backgroundColor = '';
    });
    
    container.addEventListener('drop', (e) => {
        e.preventDefault();
        container.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/json') {
            if (window.app) {
                window.app.importTodos(files[0]);
            }
        }
    });
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

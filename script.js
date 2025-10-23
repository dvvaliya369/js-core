class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
        this.toastCounter = 0;
    }

    // Icons for different toast types
    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ⓘ'
        };
        return icons[type] || icons.info;
    }

    // Create toast element
    createToastElement(type, message, duration = 5000) {
        const toastId = `toast-${++this.toastCounter}`;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;
        
        toast.innerHTML = `
            <div class="toast-icon">${this.getIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close" onclick="toastManager.removeToast('${toastId}')" aria-label="Close">×</button>
            <div class="toast-progress"></div>
        `;

        return { toast, toastId, duration };
    }

    // Show toast
    showToast(type, message, duration = 5000) {
        const { toast, toastId } = this.createToastElement(type, message, duration);
        
        // Add to container
        this.container.appendChild(toast);
        this.toasts.push(toastId);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Start progress bar animation
        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '100%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 50);
        }

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toastId);
            }, duration);
        }

        return toastId;
    }

    // Remove toast
    removeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (!toast) return;

        toast.classList.add('hide');
        toast.classList.remove('show');

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            this.toasts = this.toasts.filter(id => id !== toastId);
        }, 400);
    }

    // Remove all toasts
    removeAllToasts() {
        this.toasts.forEach(toastId => {
            this.removeToast(toastId);
        });
    }

    // Show success toast
    success(message, duration = 5000) {
        return this.showToast('success', message, duration);
    }

    // Show error toast
    error(message, duration = 5000) {
        return this.showToast('error', message, duration);
    }

    // Show warning toast
    warning(message, duration = 5000) {
        return this.showToast('warning', message, duration);
    }

    // Show info toast
    info(message, duration = 5000) {
        return this.showToast('info', message, duration);
    }
}

class ThemeManager {
    constructor() {
        this.currentTheme = this.getStoredTheme() || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = this.themeToggle.querySelector('.theme-icon');
        this.themeText = this.themeToggle.querySelector('.theme-text');
        
        this.init();
    }

    // Get stored theme from localStorage
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    // Store theme in localStorage
    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    // Apply theme to document
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.updateToggleButton(theme);
        this.setStoredTheme(theme);
        this.currentTheme = theme;
    }

    // Update toggle button appearance
    updateToggleButton(theme) {
        if (theme === 'dark') {
            this.themeIcon.textContent = '☀️';
            this.themeText.textContent = 'Light';
        } else {
            this.themeIcon.textContent = '🌙';
            this.themeText.textContent = 'Dark';
        }
    }

    // Toggle between light and dark themes
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
        
        // Show confirmation toast
        toastManager.info(`Switched to ${newTheme} theme!`, 2000);
    }

    // Initialize theme manager
    init() {
        // Apply stored theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener to toggle button
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Add keyboard support
        this.themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Set specific theme
    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.applyTheme(theme);
        }
    }
}

// Initialize managers
const toastManager = new ToastManager();
const themeManager = new ThemeManager();

// Global function for easy access
function showToast(type, message, duration = 5000) {
    return toastManager.showToast(type, message, duration);
}

// Custom toast function for the demo
function showCustomToast() {
    const messageInput = document.getElementById('customMessage');
    const typeSelect = document.getElementById('customType');
    
    const message = messageInput.value.trim();
    const type = typeSelect.value;
    
    if (!message) {
        showToast('error', 'Please enter a message!');
        return;
    }
    
    showToast(type, message);
    messageInput.value = ''; // Clear input after showing toast
}

// Add keyboard support for custom toast
document.getElementById('customMessage')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        showCustomToast();
    }
});

// Welcome message after page load
setTimeout(() => {
    toastManager.success('Welcome! Theme toggler has been added. Try switching themes!', 4000);
}, 1000);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToastManager, ThemeManager, showToast };
}

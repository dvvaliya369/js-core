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

// Initialize toast manager
const toastManager = new ToastManager();

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

// Example of programmatic usage (uncomment to test)
// setTimeout(() => {
//     toastManager.success('Welcome! This toast was shown automatically after page load.');
// }, 1000);

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToastManager, showToast };
}

// Toast Manager Class
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
        this.toastCounter = 0;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ⓘ'
        };
        return icons[type] || icons.info;
    }

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

    showToast(type, message, duration = 5000) {
        const { toast, toastId } = this.createToastElement(type, message, duration);
        
        this.container.appendChild(toast);
        this.toasts.push(toastId);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar) {
            setTimeout(() => {
                progressBar.style.width = '100%';
                progressBar.style.transition = `width ${duration}ms linear`;
            }, 50);
        }

        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toastId);
            }, duration);
        }

        return toastId;
    }

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

    success(message, duration = 5000) {
        return this.showToast('success', message, duration);
    }

    error(message, duration = 5000) {
        return this.showToast('error', message, duration);
    }

    warning(message, duration = 5000) {
        return this.showToast('warning', message, duration);
    }

    info(message, duration = 5000) {
        return this.showToast('info', message, duration);
    }
}

// Initialize toast manager
const toastManager = new ToastManager();

// Password Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon (optional visual feedback)
            this.style.color = type === 'text' ? '#dc2626' : '#6b7280';
        });
    }

    // Form Submission Handler
    const signinForm = document.getElementById('signinForm');
    
    if (signinForm) {
        signinForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Validate inputs
            if (!email || !password) {
                toastManager.error('Please fill in all fields');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toastManager.error('Please enter a valid email address');
                return;
            }

            // Show loading state
            const submitButton = signinForm.querySelector('.signin-button');
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // Simulate API call
            setTimeout(() => {
                // Remove loading state
                submitButton.classList.remove('loading');
                submitButton.disabled = false;

                // Show success message
                toastManager.success('Successfully signed in! Redirecting...');
                
                // Log the form data (in real app, this would be sent to server)
                console.log('Sign in attempt:', {
                    email: email,
                    password: '***hidden***',
                    remember: remember
                });

                // Reset form after successful submission
                setTimeout(() => {
                    signinForm.reset();
                }, 1500);
            }, 2000);
        });
    }

    // Social Button Handlers
    const googleButton = document.querySelector('.social-button.google');
    const githubButton = document.querySelector('.social-button.github');

    if (googleButton) {
        googleButton.addEventListener('click', function() {
            toastManager.info('Google sign-in coming soon!');
        });
    }

    if (githubButton) {
        githubButton.addEventListener('click', function() {
            toastManager.info('GitHub sign-in coming soon!');
        });
    }

    // Forgot Password Handler
    const forgotPasswordLink = document.querySelector('.forgot-password');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            toastManager.info('Password reset link will be sent to your email');
        });
    }

    // Sign Up Link Handler
    const signupLink = document.querySelector('.signup-link');
    
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            toastManager.info('Sign up page coming soon!');
        });
    }

    // Add input focus animations
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ToastManager };
}

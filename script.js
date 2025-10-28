// Theme Management
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme() || 'light';
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        this.applyTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.theme = theme;
        this.setStoredTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    }
}

// Form Validation
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.emailError = document.getElementById('emailError');
        this.passwordError = document.getElementById('passwordError');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
    }

    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        }

        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }

        this.clearError('email');
        return true;
    }

    validatePassword() {
        const password = this.passwordInput.value;

        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }

        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            return false;
        }

        this.clearError('password');
        return true;
    }

    showError(field, message) {
        if (field === 'email') {
            this.emailError.textContent = message;
            this.emailInput.classList.add('error');
        } else if (field === 'password') {
            this.passwordError.textContent = message;
            this.passwordInput.classList.add('error');
        }
    }

    clearError(field) {
        if (field === 'email') {
            this.emailError.textContent = '';
            this.emailInput.classList.remove('error');
        } else if (field === 'password') {
            this.passwordError.textContent = '';
            this.passwordInput.classList.remove('error');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        const submitButton = this.form.querySelector('.signin-button');
        const rememberMe = document.getElementById('rememberMe').checked;

        // Show loading state
        submitButton.classList.add('loading');

        // Simulate API call
        try {
            await this.simulateSignIn();
            
            // Success
            console.log('Sign in successful!');
            console.log('Email:', this.emailInput.value);
            console.log('Remember me:', rememberMe);
            
            // You can redirect or show success message here
            alert('Sign in successful! (This is a demo)');
            
        } catch (error) {
            console.error('Sign in failed:', error);
            this.showError('password', 'Invalid email or password');
        } finally {
            submitButton.classList.remove('loading');
        }
    }

    simulateSignIn() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
}

// Password Toggle
class PasswordToggle {
    constructor() {
        this.toggleButton = document.getElementById('togglePassword');
        this.passwordInput = document.getElementById('password');
        this.init();
    }

    init() {
        this.toggleButton.addEventListener('click', () => this.toggle());
    }

    toggle() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.toggleButton.classList.toggle('active');
    }
}

// Social Sign In Handlers
class SocialSignIn {
    constructor() {
        this.googleButton = document.querySelector('.social-button.google');
        this.githubButton = document.querySelector('.social-button.github');
        this.init();
    }

    init() {
        this.googleButton.addEventListener('click', () => this.signInWithGoogle());
        this.githubButton.addEventListener('click', () => this.signInWithGithub());
    }

    signInWithGoogle() {
        console.log('Sign in with Google clicked');
        alert('Google sign-in would be implemented here');
    }

    signInWithGithub() {
        console.log('Sign in with GitHub clicked');
        alert('GitHub sign-in would be implemented here');
    }
}

// Link Handlers
class LinkHandlers {
    constructor() {
        this.forgotPasswordLink = document.querySelector('.forgot-password');
        this.signupLink = document.querySelector('.signup-link');
        this.init();
    }

    init() {
        this.forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Forgot password clicked');
            alert('Password reset functionality would be implemented here');
        });

        this.signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sign up clicked');
            alert('Sign up page would be implemented here');
        });
    }
}

// Initialize all components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new FormValidator('signinForm');
    new PasswordToggle();
    new SocialSignIn();
    new LinkHandlers();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + T to toggle theme
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        document.getElementById('themeToggle').click();
    }
});

// Signin Screen JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const signinButton = document.getElementById('signinButton');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = passwordToggle.querySelector('.password-toggle-icon');
        icon.textContent = type === 'password' ? '👁️' : '🙈';
    });
    
    // Form validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validatePassword(password) {
        return password.length >= 6; // Minimum 6 characters
    }
    
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    function hideFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    function clearAllErrors() {
        hideFieldError('email');
        hideFieldError('password');
    }
    
    // Real-time validation
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !validateEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
        } else {
            hideFieldError('email');
        }
    });
    
    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            hideFieldError('email');
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        if (password && !validatePassword(password)) {
            showFieldError('password', 'Password must be at least 6 characters long');
        } else {
            hideFieldError('password');
        }
    });
    
    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            hideFieldError('password');
        }
    });
    
    // Form submission
    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;
        
        // Clear previous errors
        clearAllErrors();
        
        // Validate form
        let hasErrors = false;
        
        if (!email) {
            showFieldError('email', 'Email is required');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        if (!password) {
            showFieldError('password', 'Password is required');
            hasErrors = true;
        } else if (!validatePassword(password)) {
            showFieldError('password', 'Password must be at least 6 characters long');
            hasErrors = true;
        }
        
        if (hasErrors) {
            return;
        }
        
        // Show loading state
        signinButton.classList.add('loading');
        signinButton.disabled = true;
        
        try {
            // Simulate API call
            await simulateSignin(email, password, rememberMe);
            
            // Success
            showToast('success', 'Successfully signed in! Redirecting...');
            
            // Simulate redirect after delay
            setTimeout(() => {
                showToast('info', 'Redirecting to dashboard...');
            }, 1500);
            
        } catch (error) {
            // Handle signin error
            showToast('error', error.message || 'Sign in failed. Please try again.');
            
            // Reset form state
            signinButton.classList.remove('loading');
            signinButton.disabled = false;
        }
    });
    
    // Simulate signin API call
    async function simulateSignin(email, password, rememberMe) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate different outcomes based on email
                if (email === 'error@example.com') {
                    reject(new Error('Invalid credentials. Please check your email and password.'));
                } else if (email === 'locked@example.com') {
                    reject(new Error('Account locked. Please contact support.'));
                } else {
                    // Successful signin
                    console.log('Signin successful:', { email, rememberMe });
                    resolve({ success: true, user: { email } });
                    
                    // Store remember me preference
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('lastEmail', email);
                    } else {
                        localStorage.removeItem('rememberMe');
                        localStorage.removeItem('lastEmail');
                    }
                }
            }, 2000); // 2 second delay to simulate network request
        });
    }
    
    // Load remembered email on page load
    function loadRememberedCredentials() {
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const lastEmail = localStorage.getItem('lastEmail');
        
        if (rememberMe && lastEmail) {
            emailInput.value = lastEmail;
            rememberMeCheckbox.checked = true;
        }
    }
    
    // Initialize remembered credentials
    loadRememberedCredentials();
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Enter key on password field should submit form
        if (e.key === 'Enter' && document.activeElement === passwordInput) {
            signinForm.dispatchEvent(new Event('submit'));
        }
    });
    
    // Focus management
    emailInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });
    
    // Auto-focus first empty field
    setTimeout(() => {
        if (!emailInput.value) {
            emailInput.focus();
        } else if (!passwordInput.value) {
            passwordInput.focus();
        }
    }, 100);
});

// Demo accounts info (for testing)
console.log('Demo accounts for testing:');
console.log('• Use any email except "error@example.com" or "locked@example.com" for successful signin');
console.log('• Use "error@example.com" to simulate invalid credentials');
console.log('• Use "locked@example.com" to simulate account lockout');
console.log('• Password must be at least 6 characters');

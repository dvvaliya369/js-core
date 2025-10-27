// DOM elements
const signinForm = document.getElementById('signinForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.querySelector('.toggle-password');
const signinButton = document.querySelector('.signin-button');
const buttonText = document.querySelector('.button-text');
const loadingSpinner = document.querySelector('.loading-spinner');
const formMessage = document.getElementById('form-message');

// Validation patterns
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    loadRememberedEmail();
});

// Event listeners
function initializeEventListeners() {
    // Form submission
    signinForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    emailInput.addEventListener('blur', () => validateField('email'));
    passwordInput.addEventListener('blur', () => validateField('password'));
    emailInput.addEventListener('input', clearFieldError);
    passwordInput.addEventListener('input', clearFieldError);
    
    // Password visibility toggle
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Forgot password click
    document.querySelector('.forgot-password').addEventListener('click', handleForgotPassword);
    
    // Sign up link click
    document.querySelector('.signin-footer a').addEventListener('click', handleSignUpClick);
}

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    setLoadingState(true);
    clearFormMessage();
    
    try {
        const formData = new FormData(signinForm);
        const userData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };
        
        // Simulate API call
        const result = await simulateSignIn(userData);
        
        if (result.success) {
            showFormMessage('Sign in successful! Redirecting...', 'success');
            
            // Save email if remember me is checked
            if (userData.remember) {
                localStorage.setItem('rememberedEmail', userData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            // Simulate redirect after delay
            setTimeout(() => {
                showFormMessage('Welcome! You have been signed in successfully.', 'success');
            }, 1500);
            
        } else {
            showFormMessage(result.message || 'Sign in failed. Please try again.', 'error');
        }
        
    } catch (error) {
        console.error('Sign in error:', error);
        showFormMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

// Field validation
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!emailPattern.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value) {
                errorMessage = 'Password is required';
                isValid = false;
            } else if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            }
            // For demo purposes, we'll use a simpler password validation
            // In production, you might want stronger requirements
            break;
    }
    
    showFieldError(fieldName, errorMessage);
    return isValid;
}

// Form validation
function validateForm() {
    const emailValid = validateField('email');
    const passwordValid = validateField('password');
    
    return emailValid && passwordValid;
}

// Show field error
function showFieldError(fieldName, message) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.getElementById(fieldName);
    
    if (message) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        inputElement.classList.add('error');
    } else {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
}

// Clear field error
function clearFieldError(event) {
    const fieldName = event.target.name || event.target.id;
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = event.target;
    
    if (errorElement.classList.contains('show') && inputElement.value.trim()) {
        errorElement.classList.remove('show');
        inputElement.classList.remove('error');
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    eyeIcon.textContent = type === 'password' ? '👁️' : '🙈';
}

// Set loading state
function setLoadingState(isLoading) {
    signinButton.disabled = isLoading;
    
    if (isLoading) {
        buttonText.style.display = 'none';
        loadingSpinner.style.display = 'block';
    } else {
        buttonText.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }
}

// Show form message
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type} show`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }
}

// Clear form message
function clearFormMessage() {
    formMessage.classList.remove('show');
    formMessage.textContent = '';
}

// Simulate sign in API call
async function simulateSignIn(userData) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Demo credentials for testing
    const validCredentials = {
        email: 'demo@example.com',
        password: 'password123'
    };
    
    // Simple validation for demo purposes
    if (userData.email === validCredentials.email && userData.password === validCredentials.password) {
        return { success: true, message: 'Sign in successful' };
    } else if (userData.email === validCredentials.email) {
        return { success: false, message: 'Incorrect password. Please try again.' };
    } else {
        return { success: false, message: 'No account found with this email address.' };
    }
}

// Load remembered email
function loadRememberedEmail() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        document.getElementById('remember').checked = true;
    }
}

// Handle forgot password click
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (email && emailPattern.test(email)) {
        showFormMessage(`Password reset instructions have been sent to ${email}`, 'success');
    } else {
        showFormMessage('Please enter a valid email address first', 'error');
        emailInput.focus();
    }
}

// Handle sign up click
function handleSignUpClick(event) {
    event.preventDefault();
    showFormMessage('Sign up functionality would redirect to registration page', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Enter key on form elements
    if (event.key === 'Enter' && document.activeElement.tagName !== 'BUTTON') {
        if (document.activeElement === emailInput) {
            passwordInput.focus();
        } else if (document.activeElement === passwordInput) {
            signinForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape key to clear messages
    if (event.key === 'Escape') {
        clearFormMessage();
    }
});

// Add some demo instructions
window.addEventListener('load', function() {
    setTimeout(() => {
        showFormMessage('Demo: Use email "demo@example.com" and password "password123" to test sign in', 'success');
    }, 1000);
});

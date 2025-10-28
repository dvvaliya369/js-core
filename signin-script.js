document.addEventListener('DOMContentLoaded', function() {
    const signinForm = document.getElementById('signinForm');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const signinBtn = document.querySelector('.btn-signin');
    const googleSigninBtn = document.getElementById('googleSignin');
    const githubSigninBtn = document.getElementById('githubSignin');

    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const eyeIcon = this.querySelector('.eye-icon');
        eyeIcon.textContent = type === 'password' ? '👁' : '🙈';
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = 'color: #f44336; font-size: 12px; margin-top: 4px; display: block;';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#f44336';
        
        setTimeout(() => {
            if (errorElement && errorElement.parentElement) {
                errorElement.remove();
            }
            input.style.borderColor = '';
        }, 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
            z-index: 1000;
            animation: slideInRight 0.4s ease-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.4s ease-out';
            setTimeout(() => {
                if (successDiv.parentElement) {
                    successDiv.remove();
                }
            }, 400);
        }, 3000);
    }

    signinForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email) {
            showError(emailInput, 'Email is required');
            emailInput.focus();
            return;
        }
        
        if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            emailInput.focus();
            return;
        }
        
        if (!password) {
            showError(passwordInput, 'Password is required');
            passwordInput.focus();
            return;
        }
        
        if (password.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            passwordInput.focus();
            return;
        }
        
        signinBtn.classList.add('loading');
        signinBtn.disabled = true;
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('Sign in attempt:', {
                email: email,
                password: '***',
                remember: document.getElementById('remember').checked
            });
            
            showSuccess('Successfully signed in! Redirecting...');
            
            setTimeout(() => {
                console.log('Redirecting to dashboard...');
            }, 1500);
            
        } catch (error) {
            showError(emailInput, 'Sign in failed. Please try again.');
            console.error('Sign in error:', error);
        } finally {
            setTimeout(() => {
                signinBtn.classList.remove('loading');
                signinBtn.disabled = false;
            }, 2000);
        }
    });

    googleSigninBtn.addEventListener('click', function() {
        console.log('Google sign in clicked');
        showSuccess('Google sign in initiated...');
    });

    githubSigninBtn.addEventListener('click', function() {
        console.log('GitHub sign in clicked');
        showSuccess('GitHub sign in initiated...');
    });

    emailInput.addEventListener('input', function() {
        const errorElement = this.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        this.style.borderColor = '';
    });

    passwordInput.addEventListener('input', function() {
        const errorElement = this.parentElement.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        this.style.borderColor = '';
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');

    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
        
        togglePasswordBtn.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
    });

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        
        if (password.length === 0) {
            passwordStrength.classList.remove('active');
            return;
        }
        
        passwordStrength.classList.add('active');
        
        const strength = calculatePasswordStrength(password);
        
        strengthBarFill.className = 'strength-bar-fill';
        
        if (strength.score <= 2) {
            strengthBarFill.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = 'var(--error)';
        } else if (strength.score <= 3) {
            strengthBarFill.classList.add('medium');
            strengthText.textContent = 'Medium password';
            strengthText.style.color = 'var(--warning)';
        } else {
            strengthBarFill.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = 'var(--success)';
        }
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        return { score };
    }

    function showError(inputId, message) {
        const errorElement = document.getElementById(inputId + 'Error');
        const formGroup = errorElement.closest('.form-group');
        
        errorElement.textContent = message;
        errorElement.classList.add('show');
        formGroup.classList.add('error');
    }

    function clearError(inputId) {
        const errorElement = document.getElementById(inputId + 'Error');
        const formGroup = errorElement.closest('.form-group');
        
        errorElement.textContent = '';
        errorElement.classList.remove('show');
        formGroup.classList.remove('error');
    }

    function clearAllErrors() {
        ['fullName', 'email', 'password', 'confirmPassword', 'terms'].forEach(clearError);
    }

    function validateFullName() {
        const fullName = fullNameInput.value.trim();
        
        if (fullName.length === 0) {
            showError('fullName', 'Full name is required');
            return false;
        }
        
        if (fullName.length < 2) {
            showError('fullName', 'Full name must be at least 2 characters');
            return false;
        }
        
        clearError('fullName');
        return true;
    }

    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            showError('email', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            showError('email', 'Please enter a valid email address');
            return false;
        }
        
        clearError('email');
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (password.length === 0) {
            showError('password', 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            return false;
        }
        
        clearError('password');
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword.length === 0) {
            showError('confirmPassword', 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            return false;
        }
        
        clearError('confirmPassword');
        return true;
    }

    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError('terms', 'You must agree to the terms and conditions');
            return false;
        }
        
        clearError('terms');
        return true;
    }

    fullNameInput.addEventListener('blur', validateFullName);
    emailInput.addEventListener('blur', validateEmail);
    passwordInput.addEventListener('blur', validatePassword);
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    termsCheckbox.addEventListener('change', validateTerms);

    fullNameInput.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            clearError('fullName');
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            clearError('email');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearError('password');
        }
        if (confirmPasswordInput.value.length > 0) {
            validateConfirmPassword();
        }
    });

    confirmPasswordInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearError('confirmPassword');
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        clearAllErrors();
        
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();
        
        if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsValid) {
            submitBtn.classList.add('loading');
            
            setTimeout(() => {
                const formData = {
                    fullName: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value
                };
                
                console.log('Form submitted successfully:', formData);
                
                alert('Account created successfully! 🎉\n\nWelcome, ' + formData.fullName + '!');
                
                submitBtn.classList.remove('loading');
                form.reset();
                passwordStrength.classList.remove('active');
            }, 2000);
        } else {
            const firstError = form.querySelector('.error-message.show');
            if (firstError) {
                const input = firstError.closest('.form-group').querySelector('input');
                if (input) {
                    input.focus();
                }
            }
        }
    });

    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            alert(`Sign up with ${provider} clicked!\n\nThis would normally redirect to ${provider} authentication.`);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const submitBtn = document.getElementById('submitBtn');
    const btnLoader = document.getElementById('btnLoader');

    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');

    let passwordVisible = false;

    togglePasswordBtn.addEventListener('click', function() {
        passwordVisible = !passwordVisible;
        const type = passwordVisible ? 'text' : 'password';
        passwordInput.type = type;
        confirmPasswordInput.type = type;
        togglePasswordBtn.querySelector('.eye-icon').textContent = passwordVisible ? '👁️' : '👁️';
    });

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        strengthBarFill.className = 'strength-bar-fill';
        strengthText.className = 'strength-text';
        
        if (password.length > 0) {
            strengthBarFill.classList.add(strength.level);
            strengthText.classList.add(strength.level, 'show');
            strengthText.textContent = strength.text;
        } else {
            strengthText.classList.remove('show');
        }
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        
        if (score <= 2) {
            return { level: 'weak', text: 'Weak password' };
        } else if (score <= 4) {
            return { level: 'medium', text: 'Medium password' };
        } else {
            return { level: 'strong', text: 'Strong password' };
        }
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

    function validateFullName() {
        const fullName = fullNameInput.value.trim();
        
        if (fullName === '') {
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
        
        if (email === '') {
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
        
        if (password === '') {
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
        
        if (confirmPassword === '') {
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
        if (this.value.trim() !== '') {
            clearError('fullName');
        }
    });

    emailInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            clearError('email');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.value !== '') {
            clearError('password');
        }
        if (confirmPasswordInput.value !== '') {
            validateConfirmPassword();
        }
    });

    confirmPasswordInput.addEventListener('input', function() {
        if (this.value !== '') {
            clearError('confirmPassword');
        }
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();
        
        if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsValid) {
            submitBtn.classList.add('loading');
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const formData = {
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };
            
            console.log('Form submitted successfully:', formData);
            
            alert('Account created successfully! 🎉\n\nWelcome, ' + formData.fullName + '!');
            
            submitBtn.classList.remove('loading');
            form.reset();
            strengthBarFill.className = 'strength-bar-fill';
            strengthText.className = 'strength-text';
        } else {
            const firstError = form.querySelector('.error-message.show');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'GitHub';
            alert(`Sign up with ${provider} clicked!\n\nThis would typically redirect to ${provider} OAuth.`);
        });
    });

    const links = document.querySelectorAll('a.link');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const text = this.textContent;
            alert(`${text} clicked!\n\nThis would typically open the ${text} page.`);
        });
    });
});

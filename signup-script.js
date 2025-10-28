document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');
    const togglePasswordBtn = document.getElementById('togglePassword');

    const fullNameError = document.getElementById('fullNameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');

    const strengthBarFill = document.getElementById('strengthBarFill');
    const strengthText = document.getElementById('strengthText');

    let passwordVisible = false;

    togglePasswordBtn.addEventListener('click', function() {
        passwordVisible = !passwordVisible;
        passwordInput.type = passwordVisible ? 'text' : 'password';
        confirmPasswordInput.type = passwordVisible ? 'text' : 'password';
        togglePasswordBtn.querySelector('.eye-icon').textContent = passwordVisible ? '🙈' : '👁️';
    });

    function validateFullName() {
        const value = fullNameInput.value.trim();
        if (value === '') {
            showError(fullNameInput, fullNameError, 'Full name is required');
            return false;
        }
        if (value.length < 2) {
            showError(fullNameInput, fullNameError, 'Name must be at least 2 characters');
            return false;
        }
        if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fullNameInput, fullNameError, 'Name can only contain letters and spaces');
            return false;
        }
        hideError(fullNameInput, fullNameError);
        return true;
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (value === '') {
            showError(emailInput, emailError, 'Email is required');
            return false;
        }
        if (!emailRegex.test(value)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        hideError(emailInput, emailError);
        return true;
    }

    function checkPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        return strength;
    }

    function updatePasswordStrength() {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);

        strengthBarFill.className = 'strength-bar-fill';
        strengthText.className = 'strength-text';

        if (password.length === 0) {
            strengthBarFill.style.width = '0%';
            strengthText.style.display = 'none';
            return;
        }

        if (strength <= 2) {
            strengthBarFill.classList.add('weak');
            strengthText.classList.add('weak');
            strengthText.textContent = 'Weak password';
        } else if (strength <= 4) {
            strengthBarFill.classList.add('medium');
            strengthText.classList.add('medium');
            strengthText.textContent = 'Medium password';
        } else {
            strengthBarFill.classList.add('strong');
            strengthText.classList.add('strong');
            strengthText.textContent = 'Strong password';
        }
    }

    function validatePassword() {
        const value = passwordInput.value;
        
        if (value === '') {
            showError(passwordInput, passwordError, 'Password is required');
            return false;
        }
        if (value.length < 8) {
            showError(passwordInput, passwordError, 'Password must be at least 8 characters');
            return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
            showError(passwordInput, passwordError, 'Password must contain uppercase and lowercase letters');
            return false;
        }
        if (!/(?=.*\d)/.test(value)) {
            showError(passwordInput, passwordError, 'Password must contain at least one number');
            return false;
        }
        hideError(passwordInput, passwordError);
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (confirmPassword === '') {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
            return false;
        }
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            return false;
        }
        hideError(confirmPasswordInput, confirmPasswordError);
        return true;
    }

    function validateTerms() {
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, termsError, 'You must agree to the terms and conditions');
            return false;
        }
        hideError(termsCheckbox, termsError);
        return true;
    }

    function showError(input, errorElement, message) {
        input.closest('.form-group').classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    function hideError(input, errorElement) {
        input.closest('.form-group').classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }

    fullNameInput.addEventListener('blur', validateFullName);
    fullNameInput.addEventListener('input', function() {
        if (fullNameError.classList.contains('show')) {
            validateFullName();
        }
    });

    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', function() {
        if (emailError.classList.contains('show')) {
            validateEmail();
        }
    });

    passwordInput.addEventListener('input', function() {
        updatePasswordStrength();
        if (passwordError.classList.contains('show')) {
            validatePassword();
        }
        if (confirmPasswordInput.value !== '') {
            validateConfirmPassword();
        }
    });

    passwordInput.addEventListener('blur', validatePassword);

    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', function() {
        if (confirmPasswordError.classList.contains('show')) {
            validateConfirmPassword();
        }
    });

    termsCheckbox.addEventListener('change', function() {
        if (termsError.classList.contains('show')) {
            validateTerms();
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();

        if (isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsValid) {
            submitBtn.classList.add('loading');

            setTimeout(function() {
                submitBtn.classList.remove('loading');
                
                const formData = {
                    fullName: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value,
                    termsAccepted: termsCheckbox.checked
                };

                console.log('Form submitted successfully!', formData);
                alert('Account created successfully! 🎉\n\nWelcome, ' + formData.fullName + '!');
                
                form.reset();
                strengthBarFill.style.width = '0%';
                strengthText.style.display = 'none';
            }, 2000);
        } else {
            if (!isFullNameValid) fullNameInput.focus();
            else if (!isEmailValid) emailInput.focus();
            else if (!isPasswordValid) passwordInput.focus();
            else if (!isConfirmPasswordValid) confirmPasswordInput.focus();
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

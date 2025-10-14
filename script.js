document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = document.querySelector('.signup-btn');
    const successMessage = document.getElementById('successMessage');

    // Error message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');

    // Validation patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Real-time validation
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', clearEmailError);
    
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', clearPasswordError);
    
    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);
    confirmPasswordInput.addEventListener('input', clearConfirmPasswordError);

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    function validateEmail() {
        const email = emailInput.value.trim();
        
        if (!email) {
            showError(emailInput, emailError, 'Email is required');
            return false;
        }
        
        if (!emailPattern.test(email)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        showSuccess(emailInput, emailError);
        return true;
    }

    function validatePassword() {
        const password = passwordInput.value;
        
        if (!password) {
            showError(passwordInput, passwordError, 'Password is required');
            return false;
        }
        
        if (password.length < 8) {
            showError(passwordInput, passwordError, 'Password must be at least 8 characters long');
            return false;
        }
        
        if (!passwordPattern.test(password)) {
            showError(passwordInput, passwordError, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }
        
        showSuccess(passwordInput, passwordError);
        
        // Re-validate confirm password if it has a value
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        
        return true;
    }

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Please confirm your password');
            return false;
        }
        
        if (password !== confirmPassword) {
            showError(confirmPasswordInput, confirmPasswordError, 'Passwords do not match');
            return false;
        }
        
        showSuccess(confirmPasswordInput, confirmPasswordError);
        return true;
    }

    function showError(input, errorElement, message) {
        input.classList.remove('valid');
        input.classList.add('error');
        errorElement.textContent = message;
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('valid');
        errorElement.textContent = '';
    }

    function clearEmailError() {
        if (emailInput.classList.contains('error')) {
            emailInput.classList.remove('error');
            emailError.textContent = '';
        }
    }

    function clearPasswordError() {
        if (passwordInput.classList.contains('error')) {
            passwordInput.classList.remove('error');
            passwordError.textContent = '';
        }
    }

    function clearConfirmPasswordError() {
        if (confirmPasswordInput.classList.contains('error')) {
            confirmPasswordInput.classList.remove('error');
            confirmPasswordError.textContent = '';
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        
        // If all fields are valid, submit the form
        if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
            submitForm();
        }
    }

    function submitForm() {
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Hide loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Show success message
            showSuccessMessage();
            
            // Reset form after showing success
            setTimeout(() => {
                resetForm();
            }, 3000);
            
        }, 2000); // Simulate 2 second API call
    }

    function showSuccessMessage() {
        successMessage.classList.add('show');
    }

    function resetForm() {
        // Hide success message
        successMessage.classList.remove('show');
        
        // Reset form
        form.reset();
        
        // Remove all validation classes
        [emailInput, passwordInput, confirmPasswordInput].forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        // Clear error messages
        [emailError, passwordError, confirmPasswordError].forEach(errorElement => {
            errorElement.textContent = '';
        });
    }

    // Add some nice interactive effects
    const inputs = [emailInput, passwordInput, confirmPasswordInput];
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Add keyboard navigation enhancement
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
            const formElements = Array.from(form.elements);
            const currentIndex = formElements.indexOf(e.target);
            const nextElement = formElements[currentIndex + 1];
            
            if (nextElement && nextElement.type !== 'submit') {
                nextElement.focus();
            } else {
                submitButton.click();
            }
        }
    });
});

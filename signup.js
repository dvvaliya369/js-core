// Form validation and handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const termsInput = document.getElementById('terms');
    const submitButton = document.querySelector('.signup-btn');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const termsError = document.getElementById('termsError');
    
    // Password strength elements
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    // Success message
    const successMessage = document.getElementById('successMessage');

    // Validation rules
    const validators = {
        name: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Name must be at least 2 characters and contain only letters and spaces'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        password: {
            required: true,
            minLength: 8,
            message: 'Password must be at least 8 characters long'
        }
    };

    // Real-time validation
    nameInput.addEventListener('input', () => validateField('name', nameInput.value));
    nameInput.addEventListener('blur', () => validateField('name', nameInput.value));
    
    emailInput.addEventListener('input', () => validateField('email', emailInput.value));
    emailInput.addEventListener('blur', () => validateField('email', emailInput.value));
    
    passwordInput.addEventListener('input', () => {
        validateField('password', passwordInput.value);
        updatePasswordStrength(passwordInput.value);
    });
    passwordInput.addEventListener('blur', () => validateField('password', passwordInput.value));
    
    termsInput.addEventListener('change', () => validateTerms());

    // Validate individual field
    function validateField(fieldName, value) {
        const validator = validators[fieldName];
        const errorElement = document.getElementById(fieldName + 'Error');
        const inputElement = document.getElementById(fieldName);
        
        let isValid = true;
        let errorMessage = '';

        // Required check
        if (validator.required && (!value || value.trim() === '')) {
            isValid = false;
            errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
        // Length check
        else if (validator.minLength && value.length < validator.minLength) {
            isValid = false;
            errorMessage = validator.message;
        }
        // Pattern check
        else if (validator.pattern && !validator.pattern.test(value)) {
            isValid = false;
            errorMessage = validator.message;
        }
        // Additional password validation
        else if (fieldName === 'password' && value.length >= 8) {
            const passwordValidation = validatePasswordStrength(value);
            if (!passwordValidation.isStrong) {
                errorMessage = 'Password should contain uppercase, lowercase, numbers, and special characters';
            }
        }

        // Update UI
        errorElement.textContent = errorMessage;
        inputElement.classList.remove('error', 'valid');
        
        if (value && isValid) {
            inputElement.classList.add('valid');
        } else if (errorMessage) {
            inputElement.classList.add('error');
        }

        return isValid;
    }

    // Validate terms checkbox
    function validateTerms() {
        const isChecked = termsInput.checked;
        termsError.textContent = isChecked ? '' : 'You must accept the terms and conditions';
        return isChecked;
    }

    // Password strength validation
    function validatePasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const score = Object.values(checks).filter(Boolean).length;
        const isStrong = score >= 4;
        
        return { checks, score, isStrong };
    }

    // Update password strength meter
    function updatePasswordStrength(password) {
        if (!password) {
            strengthBar.className = 'strength-bar';
            strengthText.textContent = '';
            return;
        }

        const { score, isStrong } = validatePasswordStrength(password);
        
        // Update strength bar
        strengthBar.className = 'strength-bar';
        if (score <= 2) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#e74c3c';
        } else if (score === 3) {
            strengthBar.classList.add('fair');
            strengthText.textContent = 'Fair';
            strengthText.style.color = '#f39c12';
        } else if (score === 4) {
            strengthBar.classList.add('good');
            strengthText.textContent = 'Good';
            strengthText.style.color = '#f1c40f';
        } else if (score === 5) {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#27ae60';
        }
    }

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const nameValid = validateField('name', nameInput.value);
        const emailValid = validateField('email', emailInput.value);
        const passwordValid = validateField('password', passwordInput.value);
        const termsValid = validateTerms();
        
        // Check if all validations pass
        if (nameValid && emailValid && passwordValid && termsValid) {
            handleFormSubmission();
        } else {
            // Focus on first invalid field
            const firstInvalidField = form.querySelector('.error');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
    });

    // Handle form submission
    function handleFormSubmission() {
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // In a real application, you would send data to your server here
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };
            
            console.log('Form submitted with data:', {
                name: formData.name,
                email: formData.email,
                password: '***hidden***'
            });
            
            // Show success message
            showSuccessMessage();
            
            // Reset loading state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            
            // Clear form
            form.reset();
            clearValidationStates();
            
        }, 2000); // Simulate 2 second API call
    }

    // Show success message
    function showSuccessMessage() {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }

    // Clear validation states
    function clearValidationStates() {
        const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
        const errors = form.querySelectorAll('.error-message');
        
        inputs.forEach(input => {
            input.classList.remove('error', 'valid');
        });
        
        errors.forEach(error => {
            error.textContent = '';
        });
        
        // Clear password strength
        strengthBar.className = 'strength-bar';
        strengthText.textContent = '';
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add some polish: auto-focus first field
    nameInput.focus();
    
    // Prevent form submission on Enter in text fields (except submit button)
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'submit') {
            e.preventDefault();
            
            // Move to next field
            const inputs = Array.from(form.querySelectorAll('input:not([type="checkbox"])'));
            const currentIndex = inputs.indexOf(e.target);
            const nextInput = inputs[currentIndex + 1];
            
            if (nextInput) {
                nextInput.focus();
            } else if (termsInput.checked) {
                submitButton.click();
            } else {
                termsInput.focus();
            }
        }
    });

    // Accessibility improvements
    form.setAttribute('novalidate', 'true'); // Disable browser validation
    
    // Add ARIA labels for screen readers
    nameInput.setAttribute('aria-describedby', 'nameError');
    emailInput.setAttribute('aria-describedby', 'emailError');
    passwordInput.setAttribute('aria-describedby', 'passwordError');
    termsInput.setAttribute('aria-describedby', 'termsError');
});

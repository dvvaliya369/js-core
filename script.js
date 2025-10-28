// Form elements
const signupForm = document.getElementById('signupForm');
const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const termsCheckbox = document.getElementById('terms');
const submitBtn = document.getElementById('submitBtn');
const togglePasswordBtn = document.getElementById('togglePassword');

// Error message elements
const fullNameError = document.getElementById('fullNameError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');
const confirmPasswordError = document.getElementById('confirmPasswordError');
const termsError = document.getElementById('termsError');

// Password strength elements
const strengthBarFill = document.getElementById('strengthBarFill');
const strengthText = document.getElementById('strengthText');

// Toggle password visibility
let passwordVisible = false;
togglePasswordBtn.addEventListener('click', () => {
    passwordVisible = !passwordVisible;
    passwordInput.type = passwordVisible ? 'text' : 'password';
    togglePasswordBtn.querySelector('.eye-icon').textContent = passwordVisible ? '👁️' : '👁️';
    togglePasswordBtn.querySelector('.eye-icon').style.opacity = passwordVisible ? '1' : '0.6';
});

// Validation functions
function validateFullName(name) {
    if (!name || name.trim().length < 2) {
        return 'Please enter your full name (at least 2 characters)';
    }
    return '';
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return '';
}

function validatePassword(password) {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    return '';
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
}

function validateTerms(checked) {
    if (!checked) {
        return 'You must agree to the terms and conditions';
    }
    return '';
}

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
}

function updatePasswordStrength(password) {
    if (!password) {
        strengthBarFill.className = 'strength-bar-fill';
        strengthBarFill.style.width = '0%';
        strengthText.textContent = '';
        strengthText.className = 'strength-text';
        return;
    }
    
    const strength = checkPasswordStrength(password);
    
    strengthBarFill.className = 'strength-bar-fill';
    strengthText.className = 'strength-text';
    
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

// Real-time validation
fullNameInput.addEventListener('blur', () => {
    const error = validateFullName(fullNameInput.value);
    fullNameError.textContent = error;
    if (error) {
        fullNameInput.classList.add('error');
    } else {
        fullNameInput.classList.remove('error');
    }
});

fullNameInput.addEventListener('input', () => {
    if (fullNameError.textContent) {
        fullNameError.textContent = '';
        fullNameInput.classList.remove('error');
    }
});

emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    emailError.textContent = error;
    if (error) {
        emailInput.classList.add('error');
    } else {
        emailInput.classList.remove('error');
    }
});

emailInput.addEventListener('input', () => {
    if (emailError.textContent) {
        emailError.textContent = '';
        emailInput.classList.remove('error');
    }
});

passwordInput.addEventListener('input', () => {
    updatePasswordStrength(passwordInput.value);
    if (passwordError.textContent) {
        passwordError.textContent = '';
        passwordInput.classList.remove('error');
    }
    if (confirmPasswordInput.value) {
        const error = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        confirmPasswordError.textContent = error;
        if (error) {
            confirmPasswordInput.classList.add('error');
        } else {
            confirmPasswordInput.classList.remove('error');
        }
    }
});

passwordInput.addEventListener('blur', () => {
    const error = validatePassword(passwordInput.value);
    passwordError.textContent = error;
    if (error) {
        passwordInput.classList.add('error');
    } else {
        passwordInput.classList.remove('error');
    }
});

confirmPasswordInput.addEventListener('input', () => {
    if (confirmPasswordError.textContent) {
        const error = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        confirmPasswordError.textContent = error;
        if (error) {
            confirmPasswordInput.classList.add('error');
        } else {
            confirmPasswordInput.classList.remove('error');
        }
    }
});

confirmPasswordInput.addEventListener('blur', () => {
    const error = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
    confirmPasswordError.textContent = error;
    if (error) {
        confirmPasswordInput.classList.add('error');
    } else {
        confirmPasswordInput.classList.remove('error');
    }
});

termsCheckbox.addEventListener('change', () => {
    if (termsError.textContent) {
        termsError.textContent = '';
    }
});

// Form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear all previous errors
    fullNameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';
    termsError.textContent = '';
    
    // Remove error classes
    fullNameInput.classList.remove('error');
    emailInput.classList.remove('error');
    passwordInput.classList.remove('error');
    confirmPasswordInput.classList.remove('error');
    
    // Validate all fields
    const fullNameErr = validateFullName(fullNameInput.value);
    const emailErr = validateEmail(emailInput.value);
    const passwordErr = validatePassword(passwordInput.value);
    const confirmPasswordErr = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
    const termsErr = validateTerms(termsCheckbox.checked);
    
    // Display errors
    let hasError = false;
    
    if (fullNameErr) {
        fullNameError.textContent = fullNameErr;
        fullNameInput.classList.add('error');
        hasError = true;
    }
    
    if (emailErr) {
        emailError.textContent = emailErr;
        emailInput.classList.add('error');
        hasError = true;
    }
    
    if (passwordErr) {
        passwordError.textContent = passwordErr;
        passwordInput.classList.add('error');
        hasError = true;
    }
    
    if (confirmPasswordErr) {
        confirmPasswordError.textContent = confirmPasswordErr;
        confirmPasswordInput.classList.add('error');
        hasError = true;
    }
    
    if (termsErr) {
        termsError.textContent = termsErr;
        hasError = true;
    }
    
    if (hasError) {
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Success
        const formData = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            password: passwordInput.value
        };
        
        console.log('Form submitted successfully:', formData);
        
        // Show success message
        alert('Account created successfully! Welcome aboard! 🎉');
        
        // Reset form
        signupForm.reset();
        updatePasswordStrength('');
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('An error occurred. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
});

// Social button handlers
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'GitHub';
        console.log(`Sign up with ${provider} clicked`);
        alert(`Sign up with ${provider} - This would redirect to ${provider} OAuth`);
    });
});

// Prevent default on links
document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Link clicked:', e.target.textContent);
    });
});

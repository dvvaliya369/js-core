document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const signupBtn = document.querySelector('.signup-btn');

    // Error message elements
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const termsError = document.getElementById('termsError');

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Password validation
    function validatePassword(password) {
        return password.length >= 8;
    }

    // Real-time validation
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (!email) {
            emailError.textContent = 'Email is required';
            this.classList.add('error');
            this.classList.remove('success');
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            this.classList.add('error');
            this.classList.remove('success');
        } else {
            emailError.textContent = '';
            this.classList.remove('error');
            this.classList.add('success');
        }
    });

    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        if (!password) {
            passwordError.textContent = 'Password is required';
            this.classList.add('error');
            this.classList.remove('success');
        } else if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            this.classList.add('error');
            this.classList.remove('success');
        } else {
            passwordError.textContent = '';
            this.classList.remove('error');
            this.classList.add('success');
            
            // Revalidate confirm password if it has a value
            if (confirmPasswordInput.value) {
                validateConfirmPassword();
            }
        }
    });

    function validateConfirmPassword() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!confirmPassword) {
            confirmPasswordError.textContent = 'Please confirm your password';
            confirmPasswordInput.classList.add('error');
            confirmPasswordInput.classList.remove('success');
            return false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Passwords do not match';
            confirmPasswordInput.classList.add('error');
            confirmPasswordInput.classList.remove('success');
            return false;
        } else {
            confirmPasswordError.textContent = '';
            confirmPasswordInput.classList.remove('error');
            confirmPasswordInput.classList.add('success');
            return true;
        }
    }

    confirmPasswordInput.addEventListener('blur', validateConfirmPassword);

    // Clear error messages when user starts typing
    emailInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            emailError.textContent = '';
            this.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            passwordError.textContent = '';
            this.classList.remove('error');
        }
    });

    confirmPasswordInput.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            confirmPasswordError.textContent = '';
            this.classList.remove('error');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        termsError.textContent = '';
        
        // Remove error classes
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        confirmPasswordInput.classList.remove('error');
        
        let isValid = true;
        
        // Validate email
        const email = emailInput.value.trim();
        if (!email) {
            emailError.textContent = 'Email is required';
            emailInput.classList.add('error');
            isValid = false;
        } else if (!validateEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            isValid = false;
        }
        
        // Validate password
        const password = passwordInput.value;
        if (!password) {
            passwordError.textContent = 'Password is required';
            passwordInput.classList.add('error');
            isValid = false;
        } else if (!validatePassword(password)) {
            passwordError.textContent = 'Password must be at least 8 characters long';
            passwordInput.classList.add('error');
            isValid = false;
        }
        
        // Validate confirm password
        if (!validateConfirmPassword()) {
            isValid = false;
        }
        
        // Validate terms
        if (!termsCheckbox.checked) {
            termsError.textContent = 'You must agree to the Terms of Service and Privacy Policy';
            isValid = false;
        }
        
        if (isValid) {
            // Show loading state
            signupBtn.classList.add('loading');
            signupBtn.textContent = 'Creating Account...';
            
            // Simulate API call
            setTimeout(() => {
                // Reset button state
                signupBtn.classList.remove('loading');
                signupBtn.textContent = 'Sign Up';
                
                // Show success message (in a real app, you'd redirect or show a proper success state)
                alert(`Account created successfully for ${email}!\n\nIn a real application, this would:\n- Send the data to a server\n- Create the user account\n- Redirect to a welcome page or login`);
                
                // Reset form
                form.reset();
                document.querySelectorAll('.success').forEach(el => el.classList.remove('success'));
            }, 2000);
        }
    });
    
    // Add some interactive feedback
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
});

// Character sets for password generation
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const ambiguousChars = '0Ol1I';

// DOM elements
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const excludeAmbiguousCheck = document.getElementById('excludeAmbiguous');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const passwordOutput = document.getElementById('passwordOutput');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

// Update length display
lengthSlider.addEventListener('input', (e) => {
    lengthValue.textContent = e.target.value;
});

// Generate password function
function generatePassword() {
    const length = parseInt(lengthSlider.value);
    let charset = '';
    
    // Build character set based on selected options
    if (uppercaseCheck.checked) charset += charSets.uppercase;
    if (lowercaseCheck.checked) charset += charSets.lowercase;
    if (numbersCheck.checked) charset += charSets.numbers;
    if (symbolsCheck.checked) charset += charSets.symbols;
    
    // Check if at least one option is selected
    if (charset === '') {
        alert('Please select at least one character type!');
        return;
    }
    
    // Remove ambiguous characters if option is selected
    if (excludeAmbiguousCheck.checked) {
        charset = charset.split('').filter(char => !ambiguousChars.includes(char)).join('');
    }
    
    // Generate password
    let password = '';
    const charsetLength = charset.length;
    
    // Use crypto.getRandomValues for better randomness
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
        password += charset[randomValues[i] % charsetLength];
    }
    
    // Ensure password meets all selected criteria
    password = ensureCriteria(password, charset);
    
    passwordOutput.value = password;
    updateStrength(password);
}

// Ensure password meets all selected criteria
function ensureCriteria(password, charset) {
    const criteria = [];
    
    if (uppercaseCheck.checked) criteria.push({ chars: charSets.uppercase, regex: /[A-Z]/ });
    if (lowercaseCheck.checked) criteria.push({ chars: charSets.lowercase, regex: /[a-z]/ });
    if (numbersCheck.checked) criteria.push({ chars: charSets.numbers, regex: /[0-9]/ });
    if (symbolsCheck.checked) criteria.push({ chars: charSets.symbols, regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/ });
    
    let result = password;
    
    // Check each criterion and replace a random character if not met
    criteria.forEach((criterion, index) => {
        if (!criterion.regex.test(result)) {
            let validChars = criterion.chars;
            if (excludeAmbiguousCheck.checked) {
                validChars = validChars.split('').filter(char => !ambiguousChars.includes(char)).join('');
            }
            const randomChar = validChars[Math.floor(Math.random() * validChars.length)];
            const randomIndex = Math.floor(Math.random() * result.length);
            result = result.substring(0, randomIndex) + randomChar + result.substring(randomIndex + 1);
        }
    });
    
    return result;
}

// Calculate password strength
function updateStrength(password) {
    let strength = 0;
    const length = password.length;
    
    // Length score
    if (length >= 8) strength += 1;
    if (length >= 12) strength += 1;
    if (length >= 16) strength += 1;
    if (length >= 20) strength += 1;
    
    // Character variety score
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Calculate percentage and determine strength level
    const percentage = (strength / 8) * 100;
    let strengthLevel = '';
    let strengthClass = '';
    
    if (strength <= 3) {
        strengthLevel = 'Weak';
        strengthClass = 'strength-weak';
    } else if (strength <= 5) {
        strengthLevel = 'Fair';
        strengthClass = 'strength-fair';
    } else if (strength <= 6) {
        strengthLevel = 'Good';
        strengthClass = 'strength-good';
    } else {
        strengthLevel = 'Strong';
        strengthClass = 'strength-strong';
    }
    
    // Update UI
    strengthBar.style.width = percentage + '%';
    strengthBar.className = 'strength-bar ' + strengthClass;
    strengthText.textContent = `Password Strength: ${strengthLevel}`;
    strengthText.style.color = getComputedStyle(strengthBar).backgroundColor;
}

// Copy to clipboard
async function copyToClipboard() {
    const password = passwordOutput.value;
    
    if (password === 'Click Generate to create password' || password === '') {
        alert('Please generate a password first!');
        return;
    }
    
    try {
        await navigator.clipboard.writeText(password);
        
        // Visual feedback
        copyBtn.classList.add('copied');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = originalHTML;
        }, 1500);
        
    } catch (err) {
        // Fallback for older browsers
        passwordOutput.select();
        document.execCommand('copy');
        alert('Password copied to clipboard!');
    }
}

// Event listeners
generateBtn.addEventListener('click', generatePassword);
copyBtn.addEventListener('click', copyToClipboard);

// Generate initial password on load
window.addEventListener('load', generatePassword);

// Allow Enter key to generate password
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generatePassword();
    }
});

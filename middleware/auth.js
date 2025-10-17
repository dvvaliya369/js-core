// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/auth/login');
};

// Middleware to ensure user is NOT authenticated (for login/register pages)
const ensureNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    next();
};

// Middleware to check if user is admin (example for role-based access)
const ensureAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'You do not have permission to access this resource');
    res.redirect('/dashboard');
};

// Middleware to validate registration input
const validateRegistration = (req, res, next) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password && password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    // Check email format (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push({ msg: 'Please enter a valid email address' });
    }

    if (errors.length > 0) {
        return res.render('register', {
            errors,
            name: name || '',
            email: email || '',
            password: password || '',
            password2: password2 || ''
        });
    }

    next();
};

module.exports = {
    ensureAuthenticated,
    ensureNotAuthenticated,
    ensureAdmin,
    validateRegistration
};

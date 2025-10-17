const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Simple in-memory user store (in production, use a database)
const users = [];

// Passport Local Strategy Configuration
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        // Find user by email
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return done(null, false, { message: 'No user found with this email' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return done(null, false, { message: 'Incorrect password' });
        }

        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Serialize user for session storage
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
});

// Helper function to create a new user
const createUser = async (email, password, name) => {
    try {
        // Check if user already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = {
            id: users.length + 1,
            email: email,
            password: hashedPassword,
            name: name,
            createdAt: new Date()
        };

        users.push(newUser);
        return newUser;
    } catch (error) {
        throw error;
    }
};

// Helper function to get user by email
const getUserByEmail = (email) => {
    return users.find(u => u.email === email);
};

// Helper function to get user by id
const getUserById = (id) => {
    return users.find(u => u.id === id);
};

module.exports = {
    passport,
    createUser,
    getUserByEmail,
    getUserById,
    users
};

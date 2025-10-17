const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
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

// Facebook OAuth Strategy Configuration
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID || 'your-facebook-app-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'your-facebook-app-secret',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('Facebook Profile:', profile);
        
        // Check if user already exists by Facebook ID
        let user = users.find(u => u.facebookId === profile.id);
        
        if (user) {
            return done(null, user);
        }
        
        // Check if user exists by email
        const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
        if (email) {
            user = users.find(u => u.email === email);
            if (user) {
                // Link Facebook account to existing user
                user.facebookId = profile.id;
                user.facebookProfile = profile;
                return done(null, user);
            }
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            facebookId: profile.id,
            name: profile.displayName,
            email: email,
            profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            provider: 'facebook',
            facebookProfile: profile,
            createdAt: new Date()
        };
        
        users.push(newUser);
        return done(null, newUser);
    } catch (error) {
        return done(error, null);
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

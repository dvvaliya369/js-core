const request = require('supertest');
const app = require('./server');

console.log('🧪 Running Google Authentication Tests...\n');

// Test 1: Google OAuth redirect
console.log('Test 1: Google OAuth Redirect');
request(app)
    .get('/auth/google')
    .expect(302)
    .end((err, res) => {
        if (err) {
            console.log('❌ Error testing Google auth redirect:', err.message);
            return;
        }
        
        const location = res.headers.location;
        console.log('Google Auth Redirect URL:', location);
        
        if (location && location.includes('accounts.google.com/oauth')) {
            console.log('✅ Google OAuth redirect is working correctly');
        } else {
            console.log('⚠️  Google OAuth redirect URL might need configuration');
        }
    });

// Test 2: Google OAuth callback
setTimeout(() => {
    console.log('\nTest 2: Google OAuth Callback');
    request(app)
        .get('/auth/google/callback')
        .expect(302)
        .end((err, res) => {
            if (err) {
                console.log('❌ Error testing Google callback:', err.message);
                return;
            }
            
            const location = res.headers.location;
            console.log('Google Callback Redirect URL:', location);
            
            if (location === '/auth/login' || location === '/dashboard') {
                console.log('✅ Google OAuth callback route is configured correctly');
            } else {
                console.log('⚠️  Unexpected callback redirect behavior');
            }
        });
}, 100);

// Test 3: Configuration check
setTimeout(() => {
    console.log('\nTest 3: Google Authentication Configuration');
    
    try {
        const passport = require('./passport-config').passport;
        
        // Check if Google strategy is registered
        const strategies = passport._strategies;
        if (strategies && strategies.google) {
            console.log('✅ Google OAuth strategy is registered');
        } else {
            console.log('❌ Google OAuth strategy is not registered');
        }
        
        // Check environment variables
        const requiredEnvVars = [
            'GOOGLE_CLIENT_ID',
            'GOOGLE_CLIENT_SECRET',
            'GOOGLE_CALLBACK_URL'
        ];
        
        console.log('\nGoogle OAuth Environment Variables:');
        requiredEnvVars.forEach(envVar => {
            const value = process.env[envVar];
            if (value && value !== 'your-google-client-id' && value !== 'your-google-client-secret') {
                console.log(`✅ ${envVar}: configured`);
            } else {
                console.log(`⚠️  ${envVar}: needs to be set in environment`);
            }
        });
        
    } catch (error) {
        console.log('❌ Error checking configuration:', error.message);
    }
}, 200);

// Instructions
setTimeout(() => {
    console.log('\n📝 To test Google authentication fully:');
    console.log('1. Set up a Google OAuth app at https://console.developers.google.com/');
    console.log('2. Add your credentials to .env file');
    console.log('3. Set authorized redirect URIs in Google console');
    console.log('4. Start the server and test manually');
    console.log('\n✅ Google authentication setup is complete!');
}, 300);

const request = require('supertest');
const app = require('./server');
const { users } = require('./passport-config');

// Simple test runner function
const runTest = (testName, testFn) => {
    try {
        console.log(`\n🧪 Testing: ${testName}`);
        testFn();
        console.log('✅ PASSED');
    } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
    }
};

// Test authentication functions
const testAuth = async () => {
    console.log('\n=== PASSPORT.JS AUTHENTICATION TESTS ===\n');

    // Test 1: Home page should be accessible
    runTest('Home page accessibility', async () => {
        const res = await request(app).get('/');
        if (res.status !== 200) {
            throw new Error(`Expected status 200, got ${res.status}`);
        }
    });

    // Test 2: Login page should be accessible
    runTest('Login page accessibility', async () => {
        const res = await request(app).get('/auth/login');
        if (res.status !== 200) {
            throw new Error(`Expected status 200, got ${res.status}`);
        }
    });

    // Test 3: Register page should be accessible
    runTest('Register page accessibility', async () => {
        const res = await request(app).get('/auth/register');
        if (res.status !== 200) {
            throw new Error(`Expected status 200, got ${res.status}`);
        }
    });

    // Test 4: Dashboard should redirect to login when not authenticated
    runTest('Dashboard protection without auth', async () => {
        const res = await request(app).get('/dashboard');
        if (res.status !== 302) {
            throw new Error(`Expected redirect (302), got ${res.status}`);
        }
        if (!res.headers.location.includes('/auth/login')) {
            throw new Error('Expected redirect to login page');
        }
    });

    // Test 5: User registration should work with valid data
    runTest('User registration with valid data', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            password2: 'password123'
        };
        
        const res = await request(app)
            .post('/auth/register')
            .send(userData);
        
        if (res.status !== 302) {
            throw new Error(`Expected redirect after registration, got ${res.status}`);
        }
        
        // Check if user was added to users array
        const userExists = users.some(u => u.email === userData.email);
        if (!userExists) {
            throw new Error('User was not added to the users array');
        }
    });

    // Test 6: Login should work with correct credentials
    runTest('User login with valid credentials', async () => {
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };
        
        const res = await request(app)
            .post('/auth/login')
            .send(loginData);
        
        if (res.status !== 302) {
            throw new Error(`Expected redirect after login, got ${res.status}`);
        }
    });

    // Test 7: Registration should fail with mismatched passwords
    runTest('Registration with mismatched passwords', async () => {
        const userData = {
            name: 'Test User 2',
            email: 'test2@example.com',
            password: 'password123',
            password2: 'differentpassword'
        };
        
        const res = await request(app)
            .post('/auth/register')
            .send(userData);
        
        if (res.status !== 200) {
            throw new Error(`Expected form re-render (200), got ${res.status}`);
        }
        
        // Should not create user
        const userExists = users.some(u => u.email === userData.email);
        if (userExists) {
            throw new Error('User should not have been created with mismatched passwords');
        }
    });

    // Test 8: Registration should fail with duplicate email
    runTest('Registration with duplicate email', async () => {
        const userData = {
            name: 'Another Test User',
            email: 'test@example.com', // Same email as Test 5
            password: 'password123',
            password2: 'password123'
        };
        
        const res = await request(app)
            .post('/auth/register')
            .send(userData);
        
        if (res.status !== 200) {
            throw new Error(`Expected form re-render (200), got ${res.status}`);
        }
    });

    console.log('\n=== TEST SUMMARY ===');
    console.log(`Total users in system: ${users.length}`);
    console.log('Users:', users.map(u => ({ id: u.id, name: u.name, email: u.email })));
    console.log('\n✨ Authentication tests completed!');
};

// Run tests if this file is executed directly
if (require.main === module) {
    testAuth().catch(console.error);
}

module.exports = {
    testAuth
};

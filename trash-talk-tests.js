/**
 * Trash Talk Engine Tests
 * Unit tests for the trash talk functionality
 */

// Test setup - create a test instance
const testTrashTalk = new TrashTalkEngine();

// Test utilities
function runTests() {
    console.log('🧪 Starting Trash Talk Engine Tests...\n');
    
    let passed = 0;
    let failed = 0;
    
    function test(name, testFn) {
        try {
            testFn();
            console.log(`✅ ${name}`);
            passed++;
        } catch (error) {
            console.error(`❌ ${name}: ${error.message}`);
            failed++;
        }
    }
    
    function assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message}: Expected ${expected}, got ${actual}`);
        }
    }
    
    function assertNotNull(value, message) {
        if (value === null || value === undefined) {
            throw new Error(`${message}: Value should not be null/undefined`);
        }
    }
    
    function assertContains(text, substring, message) {
        if (!text.includes(substring)) {
            throw new Error(`${message}: Text "${text}" should contain "${substring}"`);
        }
    }
    
    // Test 1: Initial state
    test('Initial state should be disabled', () => {
        assertEqual(testTrashTalk.isEnabled, false, 'Should start disabled');
        assertEqual(testTrashTalk.opponent, 'Unknown Challenger', 'Should have default opponent');
    });
    
    // Test 2: Toggle functionality
    test('Toggle functionality works', () => {
        const initialState = testTrashTalk.isEnabled;
        const newState = testTrashTalk.toggle();
        assertEqual(newState, !initialState, 'Toggle should flip state');
        assertEqual(testTrashTalk.isEnabled, newState, 'Internal state should match return value');
    });
    
    // Test 3: Opponent setting
    test('Opponent setting works', () => {
        testTrashTalk.setOpponent('Test Opponent');
        assertEqual(testTrashTalk.opponent, 'Test Opponent', 'Opponent should be set correctly');
    });
    
    // Test 4: Roast generation when disabled
    test('Roast generation returns null when disabled', () => {
        testTrashTalk.isEnabled = false;
        const roast = testTrashTalk.generateRoast();
        assertEqual(roast, null, 'Should return null when disabled');
    });
    
    // Test 5: Roast generation when enabled
    test('Roast generation works when enabled', () => {
        testTrashTalk.isEnabled = true;
        const roast = testTrashTalk.generateRoast('general');
        assertNotNull(roast, 'Should return a roast when enabled');
        assertContains(roast, 'Test Opponent', 'Roast should contain opponent name');
    });
    
    // Test 6: Category-specific roasts
    test('Category-specific roasts work', () => {
        testTrashTalk.isEnabled = true;
        const categories = ['general', 'skillBased', 'technology', 'competitive', 'appearance'];
        
        categories.forEach(category => {
            const roast = testTrashTalk.generateRoast(category);
            assertNotNull(roast, `Should generate roast for ${category}`);
        });
    });
    
    // Test 7: Multiple roasts generation
    test('Multiple roasts generation works', () => {
        testTrashTalk.isEnabled = true;
        const roasts = testTrashTalk.generateMultipleRoasts(3);
        assertEqual(roasts.length, 3, 'Should generate requested number of roasts');
        
        roasts.forEach(roast => {
            assertNotNull(roast, 'Each roast should not be null');
        });
    });
    
    // Test 8: History tracking
    test('History tracking works', () => {
        testTrashTalk.isEnabled = true;
        testTrashTalk.clearHistory();
        
        // Generate some roasts
        testTrashTalk.generateRoast('general');
        testTrashTalk.generateRoast('skillBased');
        
        const history = testTrashTalk.getHistory();
        assertEqual(history.length, 2, 'History should contain 2 entries');
        
        // Check history structure
        const firstEntry = history[0];
        assertNotNull(firstEntry.roast, 'History entry should have roast');
        assertNotNull(firstEntry.opponent, 'History entry should have opponent');
        assertNotNull(firstEntry.timestamp, 'History entry should have timestamp');
    });
    
    // Test 9: Custom roast addition
    test('Custom roast addition works', () => {
        const customRoast = 'is a test roast for testing';
        testTrashTalk.addCustomRoast('test', customRoast);
        
        assertNotNull(testTrashTalk.roasts.test, 'Test category should exist');
        assertContains(testTrashTalk.roasts.test, customRoast, 'Custom roast should be added');
    });
    
    // Test 10: Special scenario roasts
    test('Special scenario roasts work', () => {
        testTrashTalk.isEnabled = true;
        
        const welcome = testTrashTalk.generateWelcomeRoast();
        const victory = testTrashTalk.generateVictoryRoast();
        const defeat = testTrashTalk.generateDefeatRoast();
        
        assertNotNull(welcome, 'Welcome roast should be generated');
        assertNotNull(victory, 'Victory roast should be generated');
        assertNotNull(defeat, 'Defeat roast should be generated');
        
        [welcome, victory, defeat].forEach(roast => {
            assertContains(roast, testTrashTalk.opponent, 'Special roasts should contain opponent name');
        });
    });
    
    // Test 11: Status reporting
    test('Status reporting works', () => {
        const status = testTrashTalk.getStatus();
        
        assertNotNull(status.enabled, 'Status should include enabled state');
        assertNotNull(status.opponent, 'Status should include opponent');
        assertNotNull(status.roastCategories, 'Status should include categories');
        assertNotNull(status.historyCount, 'Status should include history count');
    });
    
    // Test 12: Random item selection
    test('Random item selection works', () => {
        const testArray = ['item1', 'item2', 'item3'];
        const randomItem = testTrashTalk.getRandomItem(testArray);
        
        assertContains(testArray, randomItem, 'Should return item from array');
    });
    
    // Test 13: History size limit
    test('History size limit works', () => {
        testTrashTalk.isEnabled = true;
        testTrashTalk.clearHistory();
        testTrashTalk.maxHistorySize = 3; // Set small limit for testing
        
        // Generate more roasts than the limit
        for (let i = 0; i < 5; i++) {
            testTrashTalk.generateRoast('general');
        }
        
        const history = testTrashTalk.getHistory();
        assertEqual(history.length, 3, 'History should respect size limit');
    });
    
    // Test 14: Global functions
    test('Global functions work', () => {
        // Test toggle
        const oldState = trashTalk.isEnabled;
        const newState = toggleTrashTalk();
        assertEqual(newState, !oldState, 'Global toggle should work');
        
        // Test opponent setting
        setOpponent('Global Test');
        assertEqual(trashTalk.opponent, 'Global Test', 'Global setOpponent should work');
        
        // Test roast generation
        if (trashTalk.isEnabled) {
            const roast = getRandomRoast();
            assertNotNull(roast, 'Global getRandomRoast should work');
        }
    });
    
    // Test 15: Edge cases
    test('Edge cases handled properly', () => {
        // Empty opponent name
        testTrashTalk.setOpponent('');
        assertEqual(testTrashTalk.opponent, 'Unknown Challenger', 'Should default to Unknown Challenger');
        
        // Invalid category
        testTrashTalk.isEnabled = true;
        const invalidCategoryRoast = testTrashTalk.generateRoast('nonexistent');
        assertNotNull(invalidCategoryRoast, 'Should fall back to general category');
        
        // Zero roasts request
        const zeroRoasts = testTrashTalk.generateMultipleRoasts(0);
        assertEqual(zeroRoasts.length, 0, 'Should return empty array for zero count');
    });
    
    // Test Results
    console.log('\n🏁 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📊 Total: ${passed + failed}`);
    
    if (failed === 0) {
        console.log('🎉 All tests passed! The Trash Talk Engine is ready to roast! 🔥');
    } else {
        console.log(`⚠️ ${failed} test(s) failed. Please check the implementation.`);
    }
    
    return { passed, failed, total: passed + failed };
}

// Performance tests
function runPerformanceTests() {
    console.log('\n⚡ Performance Tests:');
    
    testTrashTalk.isEnabled = true;
    
    // Test roast generation speed
    const iterations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
        testTrashTalk.generateRoast('general');
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    
    console.log(`🏃 Generated ${iterations} roasts in ${totalTime.toFixed(2)}ms`);
    console.log(`📈 Average time per roast: ${avgTime.toFixed(4)}ms`);
    
    if (avgTime < 1) {
        console.log('✅ Performance: Excellent! 🚀');
    } else if (avgTime < 5) {
        console.log('✅ Performance: Good! 👍');
    } else {
        console.log('⚠️ Performance: Could be better. Consider optimization.');
    }
}

// Demo test function
function runDemoTests() {
    console.log('\n🎭 Demo Tests:');
    
    // Enable trash talk
    testTrashTalk.toggle();
    testTrashTalk.setOpponent('Demo Target');
    
    // Generate sample roasts
    console.log('\n🔥 Sample Roasts:');
    const categories = ['general', 'skillBased', 'technology', 'competitive'];
    
    categories.forEach(category => {
        const roast = testTrashTalk.generateRoast(category);
        console.log(`${category.toUpperCase()}: ${roast}`);
    });
    
    console.log('\n🎯 Special Roasts:');
    console.log(`WELCOME: ${testTrashTalk.generateWelcomeRoast()}`);
    console.log(`VICTORY: ${testTrashTalk.generateVictoryRoast()}`);
    console.log(`DEFEAT: ${testTrashTalk.generateDefeatRoast()}`);
    
    console.log('\n🔥🔥🔥 Triple Threat:');
    const tripleRoast = testTrashTalk.generateMultipleRoasts(3);
    tripleRoast.forEach((roast, index) => {
        console.log(`${index + 1}. ${roast}`);
    });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        runTests, 
        runPerformanceTests, 
        runDemoTests,
        testTrashTalk
    };
}

// Auto-run tests if this file is loaded directly
if (typeof window !== 'undefined') {
    // Browser environment - add test button to page if it exists
    document.addEventListener('DOMContentLoaded', () => {
        const testButton = document.createElement('button');
        testButton.textContent = '🧪 Run Tests';
        testButton.onclick = () => {
            runTests();
            runPerformanceTests();
            runDemoTests();
        };
        testButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #6c5ce7;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
        `;
        document.body.appendChild(testButton);
    });
}

console.log('🧪 Trash Talk Tests loaded. Call runTests() to execute all tests.');

// TypeScript test file for the debounce function
import { debounce, deeeebounceee, DebouncedFunction } from './utils.js';

console.log('Testing TypeScript debounce function...\n');

// Test 1: Type-safe debouncing
console.log('Test 1: Type-safe debouncing');

interface User {
    id: number;
    name: string;
}

// Function with specific signature
const saveUser = (user: User, comment: string): void => {
    console.log(`Saving user ${user.name} (ID: ${user.id}) with comment: "${comment}"`);
};

// Type-safe debounced function
const debouncedSaveUser: DebouncedFunction<typeof saveUser> = debounce(saveUser, 300);

const testUser: User = { id: 1, name: 'John Doe' };

console.log('Making rapid calls with typed parameters...');
debouncedSaveUser(testUser, 'First save');
debouncedSaveUser(testUser, 'Second save');
debouncedSaveUser(testUser, 'Final save');

setTimeout(() => {
    console.log('Expected: Only "Final save" should execute after 300ms\n');
    
    // Test 2: Search function with leading edge
    console.log('Test 2: Search function with leading edge');
    
    let searchCount = 0;
    const performSearch = (query: string, filters?: string[]): Promise<string[]> => {
        searchCount++;
        console.log(`Search #${searchCount}: "${query}" with filters: [${filters?.join(', ') || 'none'}]`);
        return Promise.resolve([`result1 for ${query}`, `result2 for ${query}`]);
    };
    
    const debouncedSearch = debounce(performSearch, 500, { leading: true });
    
    console.log('Making search calls with leading execution...');
    debouncedSearch('typescript', ['code', 'docs']);
    debouncedSearch('javascript', ['code']);
    debouncedSearch('react', ['framework']);
    
    setTimeout(() => {
        console.log('Expected: First search executes immediately, others are debounced\n');
        
        // Test 3: Cancel and flush methods
        console.log('Test 3: Cancel and flush methods');
        
        let processCount = 0;
        const processData = (data: number[]): number => {
            processCount++;
            const sum = data.reduce((a, b) => a + b, 0);
            console.log(`Processing data #${processCount}: [${data.join(', ')}] = ${sum}`);
            return sum;
        };
        
        const debouncedProcess = debounce(processData, 1000);
        
        console.log('Making calls then testing cancel...');
        debouncedProcess([1, 2, 3]);
        debouncedProcess([4, 5, 6]);
        
        // Cancel after 200ms
        setTimeout(() => {
            console.log('Canceling pending execution...');
            debouncedProcess.cancel();
        }, 200);
        
        setTimeout(() => {
            console.log(`Process count after cancel: ${processCount}`);
            console.log('Expected: 0 (should be canceled)\n');
            
            console.log('Testing flush method...');
            debouncedProcess([7, 8, 9]);
            debouncedProcess([10, 11, 12]);
            
            // Flush immediately
            setTimeout(() => {
                console.log('Flushing immediately...');
                debouncedProcess.flush();
                console.log(`Process count after flush: ${processCount}`);
                console.log('Expected: 1 (should flush immediately)');
                
                console.log('\n✅ All TypeScript tests completed!');
            }, 100);
        }, 1200);
    }, 700);
}, 500);

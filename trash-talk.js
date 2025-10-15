/**
 * Trash Talk Feature - A humorous roasting system for any application
 * Toggleable trash talk that generates funny insults based on opponent context
 */

class TrashTalkEngine {
    constructor() {
        this.isEnabled = false;
        this.opponent = 'Unknown Challenger';
        this.roastHistory = [];
        this.maxHistorySize = 50;
        
        // Initialize with some base roasts
        this.initializeRoastDatabase();
    }

    /**
     * Initialize the database of roasts and insults
     */
    initializeRoastDatabase() {
        this.roasts = {
            general: [
                "is about as sharp as a bowling ball",
                "couldn't find water if they fell out of a boat",
                "has the programming skills of a potato",
                "writes code like they're playing Jenga blindfolded",
                "debugs with console.log like it's going out of style",
                "thinks CSS stands for 'Can't Style Stuff'",
                "codes like they're trying to summon demons",
                "has more bugs than a rainforest",
                "writes documentation like they're allergic to words",
                "thinks refactoring means adding more comments"
            ],
            
            skillBased: [
                "codes slower than Internet Explorer loads",
                "has the problem-solving skills of a rubber duck",
                "writes spaghetti code that would make Italians cry",
                "thinks Big O notation is what you say when surprised",
                "designs algorithms like they're playing darts blindfolded",
                "handles errors like they're hot potatoes",
                "writes tests about as often as Halley's Comet appears",
                "optimizes code like they're trying to make it slower",
                "uses git like they're afraid of commitment",
                "names variables like they're writing hieroglyphics"
            ],

            appearance: [
                "looks like they debug with a magnifying glass",
                "has the aesthetic sense of a 90s website",
                "dresses like they raided a thrift store's reject bin",
                "has a face that would make a recursion loop break",
                "looks like they were designed by committee",
                "has the fashion sense of a console application",
                "appears to have been styled with CSS from 1995",
                "looks like a placeholder image that never got replaced",
                "has the visual appeal of a blue screen of death",
                "resembles a broken favicon"
            ],

            technology: [
                "still thinks jQuery is cutting-edge",
                "codes in Notepad and thinks it's an IDE",
                "uses Internet Explorer by choice",
                "thinks the cloud is just someone else's computer",
                "believes JavaScript and Java are the same thing",
                "uses Comic Sans for code comments",
                "thinks responsive design means it responds sometimes",
                "codes like accessibility is optional",
                "treats version control like a suggestion",
                "thinks AI stands for 'Absolutely Incompetent'"
            ],

            competitive: [
                "competes like they're playing on easy mode",
                "brings a rubber duck to a coding competition",
                "has the competitive spirit of a participation trophy",
                "plays like they're lagging on dial-up",
                "strategizes like they're reading the manual upside down",
                "performs under pressure like a deflated balloon",
                "has the reaction time of a Windows 95 startup",
                "competes with the intensity of a screensaver",
                "brings their A-game, but it's more like a C-",
                "fights like their keyboard is missing keys"
            ]
        };

        this.responseFormats = [
            "Hey {opponent}, you {roast}!",
            "{opponent} {roast} - and that's being generous!",
            "Listen up {opponent}, you {roast}.",
            "Breaking news: {opponent} {roast}!",
            "Fun fact: {opponent} {roast}.",
            "Roses are red, violets are blue, {opponent} {roast} - and everyone knows it's true!",
            "Warning: {opponent} {roast}. Proceed with caution!",
            "Scientific fact: {opponent} {roast}.",
            "Plot twist: {opponent} {roast}!",
            "Achievement unlocked: {opponent} {roast}!"
        ];

        this.comebacks = [
            "But hey, at least you're consistent!",
            "Don't worry, practice makes... well, slightly less terrible.",
            "Keep trying, champion - you'll get there eventually!",
            "Remember, everyone starts somewhere... even this low.",
            "But I believe in you! Sort of. Maybe. Not really.",
            "At least you're entertaining!",
            "You're doing great, sweetie. 😏",
            "Bless your heart for trying!",
            "Keep that energy, you beautiful disaster!",
            "Never change - the world needs more comedy!"
        ];
    }

    /**
     * Toggle trash talk on/off
     */
    toggle() {
        this.isEnabled = !this.isEnabled;
        const status = this.isEnabled ? '🔥 ON' : '😇 OFF';
        console.log(`🗣️ Trash Talk is now ${status}`);
        return this.isEnabled;
    }

    /**
     * Set the opponent name
     */
    setOpponent(opponentName) {
        this.opponent = opponentName || 'Unknown Challenger';
        console.log(`🎯 Target acquired: ${this.opponent}`);
    }

    /**
     * Get a random item from an array
     */
    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Generate a contextual roast based on category
     */
    generateRoast(category = 'general') {
        if (!this.isEnabled) {
            return null;
        }

        const roastCategory = this.roasts[category] || this.roasts.general;
        const roast = this.getRandomItem(roastCategory);
        const format = this.getRandomItem(this.responseFormats);
        const comeback = this.getRandomItem(this.comebacks);

        const fullRoast = format.replace('{opponent}', this.opponent).replace('{roast}', roast);
        const roastWithComeback = Math.random() > 0.6 ? `${fullRoast} ${comeback}` : fullRoast;

        // Add to history
        this.roastHistory.unshift({
            roast: roastWithComeback,
            opponent: this.opponent,
            category: category,
            timestamp: new Date()
        });

        // Keep history size manageable
        if (this.roastHistory.length > this.maxHistorySize) {
            this.roastHistory = this.roastHistory.slice(0, this.maxHistorySize);
        }

        return roastWithComeback;
    }

    /**
     * Generate multiple roasts for variety
     */
    generateMultipleRoasts(count = 3) {
        if (!this.isEnabled) {
            return [];
        }

        const categories = Object.keys(this.roasts);
        const roasts = [];

        for (let i = 0; i < count; i++) {
            const category = this.getRandomItem(categories);
            const roast = this.generateRoast(category);
            if (roast) {
                roasts.push(roast);
            }
        }

        return roasts;
    }

    /**
     * Get a random roast from any category
     */
    getRandomRoast() {
        const categories = Object.keys(this.roasts);
        const randomCategory = this.getRandomItem(categories);
        return this.generateRoast(randomCategory);
    }

    /**
     * Add a custom roast to a category
     */
    addCustomRoast(category, roast) {
        if (!this.roasts[category]) {
            this.roasts[category] = [];
        }
        this.roasts[category].push(roast);
        console.log(`🔥 Added custom roast to ${category}: "${roast}"`);
    }

    /**
     * Get trash talk history
     */
    getHistory(limit = 10) {
        return this.roastHistory.slice(0, limit);
    }

    /**
     * Clear trash talk history
     */
    clearHistory() {
        this.roastHistory = [];
        console.log('🧹 Trash talk history cleared');
    }

    /**
     * Get current status
     */
    getStatus() {
        return {
            enabled: this.isEnabled,
            opponent: this.opponent,
            roastCategories: Object.keys(this.roasts),
            historyCount: this.roastHistory.length
        };
    }

    /**
     * Generate a welcome roast when someone enters
     */
    generateWelcomeRoast() {
        if (!this.isEnabled) {
            return null;
        }

        const welcomeRoasts = [
            `Well, well, well... look who decided to show up! ${this.opponent}, ready to get absolutely demolished?`,
            `${this.opponent} has entered the chat! Time to witness some legendary fails!`,
            `Oh no, ${this.opponent} is here! Hide your code, everyone!`,
            `Breaking: ${this.opponent} arrives, bringing the average IQ down by 20 points!`,
            `Alert! ${this.opponent} has joined. Prepare for maximum chaos!`
        ];

        return this.getRandomItem(welcomeRoasts);
    }

    /**
     * Generate a victory roast
     */
    generateVictoryRoast() {
        if (!this.isEnabled) {
            return null;
        }

        const victoryRoasts = [
            `GG ${this.opponent}! That was easier than debugging "Hello World"!`,
            `Victory! ${this.opponent}, you fought bravely... like a broken calculator!`,
            `And that's how it's done! ${this.opponent}, better luck next millennium!`,
            `Flawless victory! ${this.opponent}, you played like your monitor was off!`,
            `Game over! ${this.opponent}, that was more predictable than a Windows update!`
        ];

        return this.getRandomItem(victoryRoasts);
    }

    /**
     * Generate a defeat roast (when losing)
     */
    generateDefeatRoast() {
        if (!this.isEnabled) {
            return null;
        }

        const defeatRoasts = [
            `Fine, you got me this time, ${this.opponent}! Even a broken clock is right twice a day!`,
            `Okay ${this.opponent}, you win this round! Must be beginners luck!`,
            `Well played, ${this.opponent}! You finally managed to do something right!`,
            `Victory to ${this.opponent}! I'll let you have this one out of pity!`,
            `${this.opponent} wins! I was obviously going easy on you!`
        ];

        return this.getRandomItem(defeatRoasts);
    }
}

// Create global instance
const trashTalk = new TrashTalkEngine();

// Convenience functions for global access
function toggleTrashTalk() {
    return trashTalk.toggle();
}

function setOpponent(name) {
    trashTalk.setOpponent(name);
}

function roastOpponent(category = 'general') {
    return trashTalk.generateRoast(category);
}

function getRandomRoast() {
    return trashTalk.getRandomRoast();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        TrashTalkEngine, 
        trashTalk, 
        toggleTrashTalk, 
        setOpponent, 
        roastOpponent, 
        getRandomRoast 
    };
}

// Log initialization
console.log('🗣️ Trash Talk Engine initialized! Use toggleTrashTalk() to enable/disable.');

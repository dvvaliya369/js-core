# 🗣️ Trash Talk Engine

A hilarious roasting system that generates funny, context-aware insults for your applications. Perfect for adding some competitive banter to games, coding competitions, or just having fun with friends!

## 🔥 Features

- **Toggleable Mode**: Easy on/off switch for trash talk
- **Opponent Context**: Set specific targets for personalized roasts
- **Multiple Categories**: Different types of roasts (general, skills, tech, competitive, etc.)
- **Smart Generation**: Contextual insults with varied response formats
- **History Tracking**: Keep track of your best roasts
- **Welcome/Victory/Defeat Roasts**: Special roasts for different scenarios
- **Custom Roasts**: Add your own roasts to any category
- **Clean & Funny**: All roasts are humorous and not genuinely offensive

## 🚀 Quick Start

### Basic Usage

```javascript
// Include the trash-talk.js file
<script src="trash-talk.js"></script>

// Toggle trash talk mode
toggleTrashTalk(); // Returns true/false

// Set your opponent
setOpponent("John Doe");

// Generate a roast
const roast = getRandomRoast();
console.log(roast); // "Hey John Doe, you code like you're playing Jenga blindfolded!"
```

### Advanced Usage

```javascript
// Create your own trash talk engine instance
const myTrashTalk = new TrashTalkEngine();

// Enable and configure
myTrashTalk.toggle();
myTrashTalk.setOpponent("The Competition");

// Generate specific category roasts
const techRoast = myTrashTalk.generateRoast('technology');
const skillRoast = myTrashTalk.generateRoast('skillBased');

// Generate multiple roasts at once
const multiRoast = myTrashTalk.generateMultipleRoasts(3);

// Special scenario roasts
const welcome = myTrashTalk.generateWelcomeRoast();
const victory = myTrashTalk.generateVictoryRoast();
const defeat = myTrashTalk.generateDefeatRoast();
```

## 📝 API Reference

### Main Functions

#### `toggleTrashTalk()`
Toggles trash talk mode on/off.
- **Returns**: `boolean` - Current state (true = enabled, false = disabled)

#### `setOpponent(name)`
Sets the target opponent for roasts.
- **Parameters**: 
  - `name` (string) - The opponent's name
- **Example**: `setOpponent("Bob the Builder")`

#### `roastOpponent(category)`
Generates a roast in a specific category.
- **Parameters**: 
  - `category` (string) - Category of roast ('general', 'skillBased', 'technology', 'competitive', 'appearance')
- **Returns**: `string` - Generated roast or null if disabled
- **Example**: `roastOpponent('technology')`

#### `getRandomRoast()`
Generates a random roast from any category.
- **Returns**: `string` - Random roast or null if disabled

### TrashTalkEngine Class Methods

#### `generateMultipleRoasts(count)`
Generate multiple roasts for variety.
- **Parameters**: 
  - `count` (number) - Number of roasts to generate (default: 3)
- **Returns**: `array` - Array of roast strings

#### `addCustomRoast(category, roast)`
Add a custom roast to any category.
- **Parameters**: 
  - `category` (string) - Category name
  - `roast` (string) - The roast text
- **Example**: `trashTalk.addCustomRoast('general', 'thinks debugging means removing insects')`

#### `getHistory(limit)`
Get recent roast history.
- **Parameters**: 
  - `limit` (number) - Maximum number of roasts to return (default: 10)
- **Returns**: `array` - Array of roast objects with metadata

#### `getStatus()`
Get current engine status.
- **Returns**: `object` - Status information including enabled state, opponent, categories, etc.

## 🎯 Roast Categories

- **general**: Basic, all-purpose roasts
- **skillBased**: Roasts about abilities and competence  
- **technology**: Tech and programming focused
- **competitive**: Competition and gaming focused
- **appearance**: Visual and aesthetic roasts

## 🎮 Integration Examples

### Game Integration
```javascript
// In a gaming application
function onPlayerJoin(playerName) {
    setOpponent(playerName);
    const welcomeRoast = trashTalk.generateWelcomeRoast();
    if (welcomeRoast) {
        displayMessage(welcomeRoast);
    }
}

function onPlayerWin() {
    const victoryRoast = trashTalk.generateVictoryRoast();
    if (victoryRoast) {
        celebrateWithTrashTalk(victoryRoast);
    }
}
```

### Coding Competition
```javascript
// For coding competitions
function setupTrashTalk(competitors) {
    toggleTrashTalk(); // Enable
    
    competitors.forEach(competitor => {
        setOpponent(competitor.name);
        const roast = roastOpponent('skillBased');
        console.log(`${competitor.name}: ${roast}`);
    });
}
```

### Chat Bot Integration
```javascript
// Add to chat bot responses
function generateResponse(userMessage, username) {
    setOpponent(username);
    
    if (shouldRoast(userMessage)) {
        const roast = getRandomRoast();
        return roast || "You're actually pretty cool! 😊";
    }
    
    return normalResponse(userMessage);
}
```

## 🎨 Demo

Check out `trash-talk-demo.html` for a full interactive demo with:
- Toggle controls
- Category selection
- Live roast generation
- History tracking
- Toast notifications

## 📦 File Structure

```
├── trash-talk.js          # Main engine file
├── trash-talk-demo.html   # Interactive demo
├── README_trash_talk.md   # This documentation
└── TODO_trash_talk.md     # Development checklist
```

## 🛠️ Customization

### Adding Custom Roast Categories
```javascript
// Add a new category
trashTalk.roasts.newCategory = [
    "your custom roast here",
    "another custom roast",
    // ... more roasts
];

// Use the new category
const customRoast = trashTalk.generateRoast('newCategory');
```

### Custom Response Formats
```javascript
// Add new response formats
trashTalk.responseFormats.push("Breaking: {opponent} {roast}!");
trashTalk.responseFormats.push("In other news: {opponent} {roast}.");
```

## 🤝 Contributing

Feel free to add more roasts, categories, or features! The system is designed to be easily extensible.

### Guidelines for New Roasts:
- Keep it funny, not genuinely mean
- Avoid personal attacks or sensitive topics
- Focus on harmless, silly observations
- Make it programming/tech themed when possible

## 🎭 Example Roasts

Here are some examples of what the engine generates:

- "Hey Bob, you code slower than Internet Explorer loads!"
- "Listen up Alice, you debug with console.log like it's going out of style!"  
- "Breaking news: Charlie writes spaghetti code that would make Italians cry!"
- "Fun fact: Dave thinks Big O notation is what you say when surprised!"

## 🔧 Browser Compatibility

Works in all modern browsers that support ES6+ features:
- Chrome 60+
- Firefox 55+  
- Safari 12+
- Edge 79+

## 📄 License

Open source - feel free to use, modify, and distribute as needed!

---

**Remember**: This is all in good fun! The goal is humor, not hurt feelings. Use responsibly! 🎯🔥😄

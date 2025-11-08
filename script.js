class AnalogWatch {
    constructor() {
        this.hourHand = document.getElementById('hourHand');
        this.minuteHand = document.getElementById('minuteHand');
        this.secondHand = document.getElementById('secondHand');
        this.digitalTime = document.getElementById('digitalTime');
        
        this.init();
    }

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const milliseconds = now.getMilliseconds();

        // Calculate degrees for each hand
        // Second hand: 6 degrees per second (360/60)
        // Add smooth sub-second movement
        const secondDegrees = (seconds * 6) + (milliseconds * 0.006);
        
        // Minute hand: 6 degrees per minute (360/60)
        // Add smooth movement based on seconds
        const minuteDegrees = (minutes * 6) + (seconds * 0.1);
        
        // Hour hand: 30 degrees per hour (360/12)
        // Add smooth movement based on minutes
        const hourDegrees = (hours % 12) * 30 + (minutes * 0.5);

        // Apply rotation to hands
        this.secondHand.style.transform = `rotate(${secondDegrees}deg)`;
        this.minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        this.hourHand.style.transform = `rotate(${hourDegrees}deg)`;

        // Update digital time display
        this.updateDigitalTime(hours, minutes, seconds);
    }

    updateDigitalTime(hours, minutes, seconds) {
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        
        this.digitalTime.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }
}

// Initialize the watch when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalogWatch();
});

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalogWatch };
}

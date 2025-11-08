// Digital Watch Functionality

function updateTime() {
    const now = new Date();
    
    // Get time components
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Format with leading zeros
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    // Update time display
    document.getElementById('hours').textContent = formattedHours;
    document.getElementById('minutes').textContent = formattedMinutes;
    document.getElementById('seconds').textContent = formattedSeconds;
    document.getElementById('period').textContent = period;
    
    // Get date components
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    
    // Update date display
    document.getElementById('day').textContent = dayName;
    document.getElementById('date').textContent = `${monthName} ${date}, ${year}`;
}

// Update time immediately on load
updateTime();

// Update time every second
setInterval(updateTime, 1000);

// Add smooth transition effect when numbers change
const timeUnits = document.querySelectorAll('.time-unit');
timeUnits.forEach(unit => {
    const observer = new MutationObserver(() => {
        unit.style.transform = 'scale(1.05)';
        setTimeout(() => {
            unit.style.transform = 'scale(1)';
        }, 100);
    });
    
    observer.observe(unit, {
        childList: true,
        characterData: true,
        subtree: true
    });
});

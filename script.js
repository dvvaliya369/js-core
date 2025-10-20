// DOM Elements
const filterTabs = document.querySelectorAll('.tab-btn');
const notificationItems = document.querySelectorAll('.notification-item');
const markAllReadBtn = document.getElementById('markAllRead');
const clearAllBtn = document.getElementById('clearAll');
const notificationsContainer = document.querySelector('.notifications-container');
const emptyState = document.querySelector('.empty-state');

// Counters
const allCount = document.getElementById('allCount');
const unreadCount = document.getElementById('unreadCount');
const readCount = document.getElementById('readCount');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateCounts();
    addEventListeners();
});

// Event Listeners
function addEventListeners() {
    // Filter tab clicks
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            setActiveTab(tab);
            filterNotifications(filter);
        });
    });

    // Mark all as read
    markAllReadBtn.addEventListener('click', markAllAsRead);

    // Clear all notifications
    clearAllBtn.addEventListener('click', clearAllNotifications);

    // Individual notification actions
    notificationItems.forEach(item => {
        const dismissBtn = item.querySelector('.action-btn.dismiss');
        const viewBtn = item.querySelector('.action-btn.view');
        
        if (dismissBtn) {
            dismissBtn.addEventListener('click', () => dismissNotification(item));
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => viewNotification(item));
        }

        // Click on notification to mark as read
        item.addEventListener('click', (e) => {
            if (!e.target.classList.contains('action-btn')) {
                markAsRead(item);
            }
        });
    });
}

// Filter Functions
function setActiveTab(activeTab) {
    filterTabs.forEach(tab => {
        tab.classList.remove('active');
    });
    activeTab.classList.add('active');
}

function filterNotifications(filter) {
    let visibleCount = 0;
    
    notificationItems.forEach(item => {
        const status = item.getAttribute('data-status');
        let shouldShow = false;

        switch(filter) {
            case 'all':
                shouldShow = true;
                break;
            case 'unread':
                shouldShow = status === 'unread';
                break;
            case 'read':
                shouldShow = status === 'read';
                break;
        }

        if (shouldShow) {
            item.classList.remove('hidden');
            visibleCount++;
        } else {
            item.classList.add('hidden');
        }
    });

    // Show empty state if no notifications are visible
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        notificationsContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        notificationsContainer.style.display = 'flex';
    }
}

// Action Functions
function markAsRead(item) {
    if (item.getAttribute('data-status') === 'unread') {
        item.setAttribute('data-status', 'read');
        item.classList.remove('unread');
        item.classList.add('read');
        
        // Remove unread indicator
        const indicator = item.querySelector('.unread-indicator');
        if (indicator) {
            indicator.remove();
        }
        
        updateCounts();
        showNotification('Notification marked as read', 'success');
    }
}

function markAllAsRead() {
    const unreadItems = document.querySelectorAll('.notification-item.unread');
    
    unreadItems.forEach(item => {
        item.setAttribute('data-status', 'read');
        item.classList.remove('unread');
        item.classList.add('read');
        
        // Remove unread indicator
        const indicator = item.querySelector('.unread-indicator');
        if (indicator) {
            indicator.remove();
        }
    });
    
    updateCounts();
    
    if (unreadItems.length > 0) {
        showNotification(`${unreadItems.length} notifications marked as read`, 'success');
    } else {
        showNotification('No unread notifications to mark', 'info');
    }
}

function dismissNotification(item) {
    // Add fade out animation
    item.style.opacity = '0';
    item.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        item.remove();
        updateCounts();
        
        // Check if we need to show empty state
        const activeFilter = document.querySelector('.tab-btn.active').getAttribute('data-filter');
        filterNotifications(activeFilter);
        
        showNotification('Notification dismissed', 'success');
    }, 300);
}

function clearAllNotifications() {
    if (notificationItems.length === 0) {
        showNotification('No notifications to clear', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
        // Add fade out animation to all items
        notificationItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(100%)';
                
                setTimeout(() => {
                    item.remove();
                    
                    // After the last item is removed
                    if (index === notificationItems.length - 1) {
                        updateCounts();
                        emptyState.style.display = 'block';
                        notificationsContainer.style.display = 'none';
                        showNotification('All notifications cleared', 'success');
                    }
                }, 300);
            }, index * 100); // Stagger the animations
        });
    }
}

function viewNotification(item) {
    const title = item.querySelector('h3').textContent;
    const message = item.querySelector('.notification-message').textContent;
    
    // Mark as read when viewed
    markAsRead(item);
    
    // This would typically open a modal or navigate to a detail page
    alert(`Viewing: ${title}\n\n${message}`);
    
    showNotification('Opening notification details', 'info');
}

// Utility Functions
function updateCounts() {
    const currentNotifications = document.querySelectorAll('.notification-item');
    const currentUnread = document.querySelectorAll('.notification-item[data-status="unread"]');
    const currentRead = document.querySelectorAll('.notification-item[data-status="read"]');
    
    allCount.textContent = currentNotifications.length;
    unreadCount.textContent = currentUnread.length;
    readCount.textContent = currentRead.length;
    
    // Update button states
    markAllReadBtn.disabled = currentUnread.length === 0;
    clearAllBtn.disabled = currentNotifications.length === 0;
    
    // Update tab visibility based on counts
    if (currentUnread.length === 0) {
        markAllReadBtn.style.opacity = '0.5';
    } else {
        markAllReadBtn.style.opacity = '1';
    }
}

function showNotification(message, type = 'info') {
    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transform: 'translateY(-10px)',
        transition: 'all 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    switch(type) {
        case 'success':
            toast.style.background = '#27ae60';
            break;
        case 'error':
            toast.style.background = '#e74c3c';
            break;
        case 'warning':
            toast.style.background = '#f39c12';
            break;
        default:
            toast.style.background = '#3498db';
    }
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'M' to mark all as read
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        markAllAsRead();
    }
    
    // Press 'C' to clear all
    if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        clearAllNotifications();
    }
    
    // Press numbers 1-3 to switch tabs
    if (['1', '2', '3'].includes(e.key) && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        if (filterTabs[tabIndex]) {
            filterTabs[tabIndex].click();
        }
    }
});

// Auto-refresh functionality (simulated)
function simulateNewNotification() {
    // This would typically come from a WebSocket or polling mechanism
    const notificationTypes = [
        {
            icon: 'fas fa-envelope',
            type: 'info',
            title: 'New Message',
            message: 'You have received a new message from a colleague.',
            time: 'Just now'
        },
        {
            icon: 'fas fa-heart',
            type: 'success',
            title: 'Like Received',
            message: 'Someone liked your recent post!',
            time: 'Just now'
        },
        {
            icon: 'fas fa-comment',
            type: 'info',
            title: 'New Comment',
            message: 'There\'s a new comment on your project.',
            time: 'Just now'
        }
    ];
    
    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    // Create new notification element
    const newNotification = document.createElement('div');
    newNotification.className = 'notification-item unread';
    newNotification.setAttribute('data-status', 'unread');
    
    newNotification.innerHTML = `
        <div class="notification-icon ${randomNotification.type}">
            <i class="${randomNotification.icon}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h3>${randomNotification.title}</h3>
                <span class="timestamp">${randomNotification.time}</span>
            </div>
            <p class="notification-message">${randomNotification.message}</p>
            <div class="notification-actions">
                <button class="action-btn view">View Details</button>
                <button class="action-btn dismiss">Dismiss</button>
            </div>
        </div>
        <div class="unread-indicator"></div>
    `;
    
    // Add to the beginning of notifications
    notificationsContainer.insertBefore(newNotification, notificationsContainer.firstChild);
    
    // Add event listeners to new notification
    const dismissBtn = newNotification.querySelector('.action-btn.dismiss');
    const viewBtn = newNotification.querySelector('.action-btn.view');
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => dismissNotification(newNotification));
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => viewNotification(newNotification));
    }
    
    newNotification.addEventListener('click', (e) => {
        if (!e.target.classList.contains('action-btn')) {
            markAsRead(newNotification);
        }
    });
    
    updateCounts();
    showNotification(`New notification: ${randomNotification.title}`, 'info');
}

// Simulate new notifications every 30 seconds (for demo purposes)
// Uncomment the line below to enable auto-refresh
// setInterval(simulateNewNotification, 30000);

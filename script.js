// Global variables to track notification state
let notificationCount = 0;
let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    updateNotificationCount();
    addClickListeners();
});

// Add click listeners to notification items
function addClickListeners() {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't trigger if clicking the close button
            if (e.target.closest('.notification-close')) {
                return;
            }
            
            // Mark as read when clicked
            if (item.classList.contains('unread')) {
                markAsRead(item);
            }
        });
    });
}

// Filter notifications based on type
function filterNotifications(type) {
    currentFilter = type;
    const notifications = document.querySelectorAll('.notification-item');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const emptyState = document.querySelector('.empty-state');
    const notificationsContainer = document.querySelector('.notifications-container');
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    let visibleCount = 0;
    
    notifications.forEach(notification => {
        let shouldShow = false;
        
        switch(type) {
            case 'all':
                shouldShow = true;
                break;
            case 'unread':
                shouldShow = notification.classList.contains('unread');
                break;
            case 'read':
                shouldShow = !notification.classList.contains('unread');
                break;
        }
        
        if (shouldShow) {
            notification.classList.remove('hidden');
            notification.style.display = 'flex';
            visibleCount++;
        } else {
            notification.classList.add('hidden');
            notification.style.display = 'none';
        }
    });
    
    // Show empty state if no notifications match filter
    if (visibleCount === 0) {
        emptyState.style.display = 'block';
        notificationsContainer.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        notificationsContainer.style.display = 'block';
    }
}

// Mark a single notification as read
function markAsRead(notificationElement) {
    if (notificationElement.classList.contains('unread')) {
        notificationElement.classList.remove('unread');
        
        // Remove the unread indicator
        const unreadIndicator = notificationElement.querySelector('.unread-indicator');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
        
        // Add a subtle animation
        notificationElement.style.transform = 'scale(0.98)';
        setTimeout(() => {
            notificationElement.style.transform = 'scale(1)';
        }, 150);
        
        updateNotificationCount();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
        
        // Remove unread indicators
        const unreadIndicator = notification.querySelector('.unread-indicator');
        if (unreadIndicator) {
            unreadIndicator.remove();
        }
    });
    
    updateNotificationCount();
    
    // Show a brief confirmation
    showToast('All notifications marked as read');
}

// Remove a notification
function removeNotification(closeButton) {
    const notification = closeButton.closest('.notification-item');
    
    // Add fade-out animation
    notification.classList.add('fade-out');
    
    setTimeout(() => {
        notification.remove();
        updateNotificationCount();
        checkEmptyState();
    }, 300);
}

// Clear all notifications
function clearAllNotifications() {
    const allNotifications = document.querySelectorAll('.notification-item');
    
    if (allNotifications.length === 0) {
        showToast('No notifications to clear');
        return;
    }
    
    // Confirm before clearing
    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
        allNotifications.forEach((notification, index) => {
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                    if (index === allNotifications.length - 1) {
                        updateNotificationCount();
                        checkEmptyState();
                    }
                }, 300);
            }, index * 100);
        });
        
        showToast('All notifications cleared');
    }
}

// Update notification count and page title
function updateNotificationCount() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const totalCount = document.querySelectorAll('.notification-item').length;
    
    // Update page title with unread count
    document.title = unreadCount > 0 ? `(${unreadCount}) Notifications` : 'Notifications';
    
    notificationCount = totalCount;
}

// Check if notifications container should show empty state
function checkEmptyState() {
    const notifications = document.querySelectorAll('.notification-item');
    const emptyState = document.querySelector('.empty-state');
    const notificationsContainer = document.querySelector('.notifications-container');
    
    if (notifications.length === 0) {
        emptyState.style.display = 'block';
        notificationsContainer.style.display = 'none';
        
        // Reset filter to 'all' when no notifications
        currentFilter = 'all';
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.tab-btn[onclick="filterNotifications(\'all\')"]').classList.add('active');
    } else {
        emptyState.style.display = 'none';
        notificationsContainer.style.display = 'block';
        
        // Re-apply current filter
        filterNotifications(currentFilter);
    }
}

// Show toast notification
function showToast(message) {
    // Remove existing toast if present
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Add toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '1000',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(100px)',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        opacity: '0'
    });
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add new notification (for demo purposes)
function addNotification(type, title, message) {
    const notificationsContainer = document.querySelector('.notifications-container');
    const emptyState = document.querySelector('.empty-state');
    
    // Hide empty state if visible
    if (emptyState.style.display === 'block') {
        emptyState.style.display = 'none';
        notificationsContainer.style.display = 'block';
    }
    
    const iconMap = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        message: 'fas fa-envelope',
        system: 'fas fa-cog'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification-item unread ${type} new`;
    notification.setAttribute('data-type', type);
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="${iconMap[type] || 'fas fa-bell'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-header">
                <h3>${title}</h3>
                <div class="notification-meta">
                    <span class="time">Just now</span>
                    <div class="unread-indicator"></div>
                </div>
            </div>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="removeNotification(this)">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add click listener
    notification.addEventListener('click', function(e) {
        if (e.target.closest('.notification-close')) {
            return;
        }
        if (notification.classList.contains('unread')) {
            markAsRead(notification);
        }
    });
    
    // Insert at the top
    notificationsContainer.insertBefore(notification, notificationsContainer.firstChild);
    
    // Remove 'new' class after animation
    setTimeout(() => {
        notification.classList.remove('new');
    }, 500);
    
    updateNotificationCount();
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + A: Mark all as read
    if ((e.ctrlKey || e.metaKey) && e.key === 'a' && e.shiftKey) {
        e.preventDefault();
        markAllAsRead();
    }
    
    // Ctrl/Cmd + Shift + X: Clear all
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        clearAllNotifications();
    }
    
    // Number keys 1-3 for filtering
    if (e.key >= '1' && e.key <= '3') {
        const filters = ['all', 'unread', 'read'];
        const tabButtons = document.querySelectorAll('.tab-btn');
        const targetButton = tabButtons[parseInt(e.key) - 1];
        if (targetButton) {
            targetButton.click();
        }
    }
});

// Auto-refresh time stamps (optional feature)
setInterval(() => {
    const timeElements = document.querySelectorAll('.time');
    const now = new Date();
    
    timeElements.forEach(element => {
        // This is a simple example - in a real app, you'd calculate based on actual timestamps
        const currentText = element.textContent;
        if (currentText === 'Just now') {
            element.textContent = '1 minute ago';
        } else if (currentText === '1 minute ago') {
            element.textContent = '2 minutes ago';
        }
        // ... and so on
    });
}, 60000); // Update every minute

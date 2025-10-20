document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notifications = document.querySelectorAll('.notification');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const clearAllBtn = document.querySelector('.clear-all');
    const notificationsContainer = document.querySelector('.notifications-container');
    const emptyState = document.querySelector('.empty-state');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            filterNotifications(filter);
        });
    });

    function filterNotifications(filter) {
        let visibleCount = 0;
        
        notifications.forEach(notification => {
            const isRead = notification.classList.contains('read');
            let shouldShow = false;

            switch(filter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'unread':
                    shouldShow = !isRead;
                    break;
                case 'read':
                    shouldShow = isRead;
                    break;
            }

            if (shouldShow) {
                notification.classList.remove('hidden');
                visibleCount++;
            } else {
                notification.classList.add('hidden');
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

    // Mark all as read functionality
    markAllReadBtn.addEventListener('click', function() {
        notifications.forEach(notification => {
            if (!notification.classList.contains('read')) {
                markAsRead(notification);
            }
        });
        updateFilterCounts();
    });

    // Clear all notifications
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all notifications?')) {
            notifications.forEach(notification => {
                deleteNotification(notification);
            });
        }
    });

    // Individual notification actions
    notifications.forEach(notification => {
        const markReadBtn = notification.querySelector('.mark-read');
        const markUnreadBtn = notification.querySelector('.mark-unread');
        const deleteBtn = notification.querySelector('.delete');

        if (markReadBtn) {
            markReadBtn.addEventListener('click', function() {
                markAsRead(notification);
                updateFilterCounts();
            });
        }

        if (markUnreadBtn) {
            markUnreadBtn.addEventListener('click', function() {
                markAsUnread(notification);
                updateFilterCounts();
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                deleteNotification(notification);
            });
        }
    });

    function markAsRead(notification) {
        notification.classList.remove('unread');
        notification.classList.add('read');
        
        // Update button
        const markReadBtn = notification.querySelector('.mark-read');
        const actionsContainer = notification.querySelector('.notification-actions');
        
        if (markReadBtn) {
            markReadBtn.outerHTML = '<button class="mark-unread">Mark as unread</button>';
            // Re-attach event listener
            const markUnreadBtn = notification.querySelector('.mark-unread');
            markUnreadBtn.addEventListener('click', function() {
                markAsUnread(notification);
                updateFilterCounts();
            });
        }
    }

    function markAsUnread(notification) {
        notification.classList.remove('read');
        notification.classList.add('unread');
        
        // Update button
        const markUnreadBtn = notification.querySelector('.mark-unread');
        
        if (markUnreadBtn) {
            markUnreadBtn.outerHTML = '<button class="mark-read">Mark as read</button>';
            // Re-attach event listener
            const markReadBtn = notification.querySelector('.mark-read');
            markReadBtn.addEventListener('click', function() {
                markAsRead(notification);
                updateFilterCounts();
            });
        }
    }

    function deleteNotification(notification) {
        notification.classList.add('removing');
        
        setTimeout(() => {
            notification.remove();
            updateFilterCounts();
            
            // Check if we need to show empty state
            const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            filterNotifications(currentFilter);
        }, 300);
    }

    function updateFilterCounts() {
        const allNotifications = document.querySelectorAll('.notification:not(.removing)');
        const unreadNotifications = document.querySelectorAll('.notification.unread:not(.removing)');
        const readNotifications = document.querySelectorAll('.notification.read:not(.removing)');

        // Update filter button text with counts
        document.querySelector('[data-filter="all"]').textContent = `All (${allNotifications.length})`;
        document.querySelector('[data-filter="unread"]').textContent = `Unread (${unreadNotifications.length})`;
        document.querySelector('[data-filter="read"]').textContent = `Read (${readNotifications.length})`;

        // Disable mark all read button if no unread notifications
        if (unreadNotifications.length === 0) {
            markAllReadBtn.disabled = true;
            markAllReadBtn.style.opacity = '0.5';
            markAllReadBtn.style.cursor = 'not-allowed';
        } else {
            markAllReadBtn.disabled = false;
            markAllReadBtn.style.opacity = '1';
            markAllReadBtn.style.cursor = 'pointer';
        }

        // Disable clear all button if no notifications
        if (allNotifications.length === 0) {
            clearAllBtn.disabled = true;
            clearAllBtn.style.opacity = '0.5';
            clearAllBtn.style.cursor = 'not-allowed';
        } else {
            clearAllBtn.disabled = false;
            clearAllBtn.style.opacity = '1';
            clearAllBtn.style.cursor = 'pointer';
        }
    }

    // Format time stamps (simple implementation)
    function formatTimeStamp() {
        const timeElements = document.querySelectorAll('.notification-time');
        
        timeElements.forEach(element => {
            const timeText = element.textContent;
            // You can implement more sophisticated time formatting here
            // For now, we'll keep the static text
        });
    }

    // Add click handler for notification body to mark as read
    notifications.forEach(notification => {
        const content = notification.querySelector('.notification-content');
        content.addEventListener('click', function() {
            if (notification.classList.contains('unread')) {
                markAsRead(notification);
                updateFilterCounts();
            }
        });
    });

    // Initialize filter counts
    updateFilterCounts();

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + A: Mark all as read
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            markAllReadBtn.click();
        }
        
        // Ctrl/Cmd + D: Clear all
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            clearAllBtn.click();
        }
        
        // Number keys 1-3 for filters
        if (e.key >= '1' && e.key <= '3') {
            e.preventDefault();
            const filterIndex = parseInt(e.key) - 1;
            filterButtons[filterIndex].click();
        }
    });

    // Auto-refresh functionality (optional)
    function autoRefresh() {
        // You can implement auto-refresh logic here
        // For example, fetch new notifications from an API
        console.log('Auto-refresh triggered');
    }

    // Uncomment to enable auto-refresh every 30 seconds
    // setInterval(autoRefresh, 30000);

    // Initial load animation
    setTimeout(() => {
        notifications.forEach((notification, index) => {
            notification.style.animation = `slideInRight 0.5s ease-out ${index * 0.1}s both`;
        });
    }, 100);
});

// CSS animation for slide in effect (add this to your CSS)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

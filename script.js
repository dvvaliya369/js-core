// Profile Card Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Profile image click handler
    const profileImg = document.getElementById('profileImg');
    const profileImages = [
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612c3d2?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    ];
    
    let currentImageIndex = 0;
    
    profileImg.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % profileImages.length;
        profileImg.src = profileImages[currentImageIndex];
        
        // Add a subtle animation
        profileImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            profileImg.style.transform = 'scale(1)';
        }, 150);
    });

    // Button click handlers with feedback
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.4)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Button-specific actions
            const buttonText = this.textContent.trim();
            switch(buttonText) {
                case 'Follow':
                    this.innerHTML = '<i class="fas fa-check"></i> Following';
                    this.style.background = '#10b981';
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
                        this.style.background = '';
                    }, 2000);
                    break;
                case 'Message':
                    showNotification('Message feature coming soon!');
                    break;
                case 'Share':
                    copyProfileLink();
                    break;
            }
        });
    });

    // Social link hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Skill tag interactions
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            showNotification(`Learning more about ${this.textContent}...`);
            this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                this.style.background = '';
            }, 1000);
        });
    });

    // Stats hover effects
    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            const number = this.querySelector('.stat-number');
            const currentNumber = parseInt(number.textContent.replace('k', '000').replace('.', ''));
            animateNumber(number, currentNumber, currentNumber + Math.floor(Math.random() * 10) + 1);
        });
    });

    // Contact item click handlers
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            if (text.includes('@')) {
                window.open(`mailto:${text}`, '_blank');
            } else if (text.includes(',')) {
                window.open(`https://maps.google.com/?q=${encodeURIComponent(text)}`, '_blank');
            } else {
                copyToClipboard(text);
            }
        });
        
        // Add hover cursor
        item.style.cursor = 'pointer';
    });
});

// Utility Functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification(`Copied: ${text}`);
    }).catch(() => {
        showNotification('Copy failed - please copy manually');
    });
}

function copyProfileLink() {
    const profileData = {
        name: document.querySelector('.name').textContent,
        title: document.querySelector('.title').textContent,
        url: window.location.href
    };
    
    const shareText = `Check out ${profileData.name}'s profile: ${profileData.title} - ${profileData.url}`;
    copyToClipboard(shareText);
}

function animateNumber(element, start, end) {
    const duration = 500;
    const startTime = performance.now();
    const originalText = element.textContent;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentNumber = Math.floor(start + (end - start) * progress);
        let displayText = currentNumber.toString();
        
        if (originalText.includes('k')) {
            displayText = (currentNumber / 1000).toFixed(1) + 'k';
        }
        
        element.textContent = displayText;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            // Restore original text after animation
            setTimeout(() => {
                element.textContent = originalText;
            }, 1000);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

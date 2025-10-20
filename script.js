// DOM Elements
const navTabs = document.querySelectorAll('.nav-tab');
const contentSections = document.querySelectorAll('.content-section');
const editProfileBtn = document.getElementById('edit-profile-btn');
const editBioBtn = document.getElementById('edit-bio-btn');
const modal = document.getElementById('edit-modal');
const closeModal = document.querySelector('.close');
const cancelBtn = document.querySelector('.cancel-btn');
const editForm = document.getElementById('edit-form');
const contactForm = document.getElementById('contact-form');
const skillBars = document.querySelectorAll('.skill-progress');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeSkillBars();
    setupEventListeners();
    animateStatsOnScroll();
});

// Tab Navigation
function setupEventListeners() {
    // Navigation tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
            
            // Update active tab
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Modal event listeners
    editProfileBtn.addEventListener('click', openEditModal);
    editBioBtn.addEventListener('click', openEditModal);
    closeModal.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditModal();
        }
    });

    // Form submissions
    editForm.addEventListener('submit', handleEditSubmit);
    contactForm.addEventListener('submit', handleContactSubmit);

    // Image upload simulation
    document.getElementById('edit-cover-btn').addEventListener('click', () => {
        simulateImageUpload('cover');
    });
    
    document.getElementById('edit-avatar-btn').addEventListener('click', () => {
        simulateImageUpload('avatar');
    });
}

// Tab switching functionality
function switchTab(tabName) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(`${tabName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Re-animate skill bars if skills tab is selected
        if (tabName === 'skills') {
            setTimeout(() => {
                animateSkillBars();
            }, 100);
        }
    }
}

// Skill bars animation
function initializeSkillBars() {
    // Reset all skill bars to 0%
    skillBars.forEach(bar => {
        bar.style.width = '0%';
    });
}

function animateSkillBars() {
    skillBars.forEach(bar => {
        const skillLevel = bar.getAttribute('data-skill');
        setTimeout(() => {
            bar.style.width = skillLevel + '%';
        }, 200);
    });
}

// Stats animation on scroll
function animateStatsOnScroll() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

function animateNumber(element) {
    const targetText = element.textContent;
    const targetNumber = parseInt(targetText.replace(/\D/g, ''));
    const suffix = targetText.replace(/[\d]/g, '');
    
    let current = 0;
    const increment = targetNumber / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 30);
}

// Modal functionality
function openEditModal() {
    // Pre-fill form with current values
    document.getElementById('edit-name').value = document.getElementById('profile-name').textContent;
    document.getElementById('edit-title').value = document.getElementById('profile-title').textContent;
    document.getElementById('edit-location').value = document.getElementById('profile-location').textContent;
    document.getElementById('edit-bio').value = document.getElementById('profile-bio').textContent.trim();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Form handlers
function handleEditSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(editForm);
    const name = formData.get('name');
    const title = formData.get('title');
    const location = formData.get('location');
    const bio = formData.get('bio');
    
    // Update profile information
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-title').textContent = title;
    document.getElementById('profile-location').textContent = location;
    document.getElementById('profile-bio').textContent = bio;
    
    // Show success message
    showNotification('Profile updated successfully!', 'success');
    
    // Close modal
    closeEditModal();
}

function handleContactSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    
    // Simulate sending message
    console.log('Message sent:', { name, email, subject, message });
    
    // Show success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
}

// Image upload simulation
function simulateImageUpload(type) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (type === 'avatar') {
                    document.getElementById('avatar').src = e.target.result;
                    showNotification('Avatar updated successfully!', 'success');
                } else if (type === 'cover') {
                    document.getElementById('cover-image').src = e.target.result;
                    showNotification('Cover photo updated successfully!', 'success');
                }
            };
            reader.readAsDataURL(file);
        }
    };
    
    fileInput.click();
}

// Notification system
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : '#667eea'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Smooth scrolling for better UX
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeEditModal();
    }
    
    // Tab navigation with arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeTab = document.querySelector('.nav-tab.active');
        const tabs = Array.from(navTabs);
        const currentIndex = tabs.indexOf(activeTab);
        
        let newIndex;
        if (e.key === 'ArrowLeft') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
            newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }
        
        tabs[newIndex].click();
    }
});

// Theme toggle functionality (bonus feature)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Add dark theme styles dynamically
const darkThemeStyles = `
    .dark-theme {
        filter: invert(1) hue-rotate(180deg);
    }
    
    .dark-theme img {
        filter: invert(1) hue-rotate(180deg);
    }
`;

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.stat-card, .bio-card, .skill-category, .timeline-item, .contact-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Profile data management (for future backend integration)
const ProfileManager = {
    data: {
        name: 'Alex Johnson',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        bio: 'Passionate software engineer with 8+ years of experience...',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop'
    },
    
    update(field, value) {
        this.data[field] = value;
        this.save();
    },
    
    save() {
        localStorage.setItem('profileData', JSON.stringify(this.data));
    },
    
    load() {
        const saved = localStorage.getItem('profileData');
        if (saved) {
            this.data = { ...this.data, ...JSON.parse(saved) };
            this.render();
        }
    },
    
    render() {
        document.getElementById('profile-name').textContent = this.data.name;
        document.getElementById('profile-title').textContent = this.data.title;
        document.getElementById('profile-location').textContent = this.data.location;
        document.getElementById('profile-bio').textContent = this.data.bio;
        document.getElementById('avatar').src = this.data.avatar;
        document.getElementById('cover-image').src = this.data.cover;
    }
};

// Load profile data on page load
ProfileManager.load();

// Export functions for external use
window.ProfilePage = {
    switchTab,
    showNotification,
    ProfileManager
};

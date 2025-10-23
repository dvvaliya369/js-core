// Profile page JavaScript functionality

// Profile data storage
let profileData = {
    name: 'John Doe',
    title: 'Frontend Developer',
    location: 'San Francisco, CA',
    bio: 'Passionate frontend developer with 5+ years of experience creating beautiful, responsive web applications. Love working with modern JavaScript frameworks and creating delightful user experiences.',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    website: 'www.johndoe.dev',
    linkedin: 'LinkedIn Profile',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face'
};

// Avatar options for demonstration
const avatarOptions = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612d3e5?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
];

// Initialize profile page
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    
    // Close modal when clicking outside
    document.getElementById('editModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeEditModal();
        }
    });
    
    // Handle escape key for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeEditModal();
        }
    });
});

// Load profile data into the UI
function loadProfileData() {
    document.getElementById('profileName').textContent = profileData.name;
    document.getElementById('profileTitle').textContent = profileData.title;
    document.getElementById('profileLocation').textContent = `📍 ${profileData.location}`;
    document.getElementById('profileBio').textContent = profileData.bio;
    document.getElementById('profileEmail').textContent = profileData.email;
    document.getElementById('profilePhone').textContent = profileData.phone;
    document.getElementById('profileWebsite').textContent = profileData.website;
    document.getElementById('profileLinkedin').textContent = profileData.linkedin;
    document.getElementById('profileAvatar').src = profileData.avatar;
}

// Toggle edit mode / show edit modal
function toggleEditMode() {
    const modal = document.getElementById('editModal');
    
    // Populate form with current data
    document.getElementById('editName').value = profileData.name;
    document.getElementById('editTitle').value = profileData.title;
    document.getElementById('editLocation').value = profileData.location;
    document.getElementById('editBio').value = profileData.bio;
    document.getElementById('editEmail').value = profileData.email;
    document.getElementById('editPhone').value = profileData.phone;
    document.getElementById('editWebsite').value = profileData.website;
    
    // Show modal
    modal.classList.add('show');
    
    // Focus first input
    setTimeout(() => {
        document.getElementById('editName').focus();
    }, 100);
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('show');
}

// Save profile changes
function saveProfile() {
    // Get form values
    const newData = {
        name: document.getElementById('editName').value.trim(),
        title: document.getElementById('editTitle').value.trim(),
        location: document.getElementById('editLocation').value.trim(),
        bio: document.getElementById('editBio').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        website: document.getElementById('editWebsite').value.trim(),
        linkedin: profileData.linkedin, // Keep existing
        avatar: profileData.avatar // Keep existing
    };
    
    // Basic validation
    if (!newData.name || !newData.email) {
        showToast('error', 'Name and email are required fields!');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newData.email)) {
        showToast('error', 'Please enter a valid email address!');
        return;
    }
    
    // Update profile data
    profileData = { ...profileData, ...newData };
    
    // Update UI
    loadProfileData();
    
    // Close modal
    closeEditModal();
    
    // Show success message
    showToast('success', 'Profile updated successfully!');
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(profileData));
}

// Change avatar
function changeAvatar() {
    const currentAvatarIndex = avatarOptions.indexOf(profileData.avatar);
    const nextIndex = (currentAvatarIndex + 1) % avatarOptions.length;
    
    profileData.avatar = avatarOptions[nextIndex];
    document.getElementById('profileAvatar').src = profileData.avatar;
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    showToast('success', 'Avatar updated!');
}

// Load profile from localStorage on page load
window.addEventListener('load', function() {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
        try {
            profileData = { ...profileData, ...JSON.parse(savedProfile) };
            loadProfileData();
        } catch (error) {
            console.error('Error loading saved profile:', error);
        }
    }
});

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate profile sections on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all profile sections
    document.querySelectorAll('.profile-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Add click animation to skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px)';
            }, 150);
        });
    });
    
    // Add pulse animation to stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        stat.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });
});

// Add pulse animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .profile-section {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E to edit profile
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        toggleEditMode();
    }
    
    // Ctrl/Cmd + S to save when modal is open
    if ((e.ctrlKey || e.metaKey) && e.key === 's' && document.getElementById('editModal').classList.contains('show')) {
        e.preventDefault();
        saveProfile();
    }
});

// Export profile data functionality
function exportProfile() {
    const dataStr = JSON.stringify(profileData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'profile-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('success', 'Profile data exported!');
}

// Random profile data generator for demo purposes
function generateRandomProfile() {
    const names = ['Alex Johnson', 'Sarah Chen', 'Michael Brown', 'Emma Wilson', 'David Rodriguez'];
    const titles = ['Frontend Developer', 'Full Stack Engineer', 'UI/UX Designer', 'Software Architect', 'Product Manager'];
    const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomAvatar = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];
    
    profileData = {
        ...profileData,
        name: randomName,
        title: randomTitle,
        location: randomLocation,
        avatar: randomAvatar,
        email: `${randomName.toLowerCase().replace(' ', '.')}@email.com`
    };
    
    loadProfileData();
    showToast('success', 'Random profile generated!');
}

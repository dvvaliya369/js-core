// Side Panel Functionality
class SidePanel {
    constructor() {
        this.panel = document.getElementById('sidePanel');
        this.overlay = document.getElementById('overlay');
        this.toggleBtn = document.getElementById('panelToggle');
        this.closeBtn = document.getElementById('closeBtn');
        this.isOpen = false;

        this.init();
    }

    init() {
        // Bind event listeners
        this.toggleBtn.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        this.overlay.addEventListener('click', () => this.closePanel());

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Add smooth hover effects to nav items
        this.addNavHoverEffects();
    }

    togglePanel() {
        if (this.isOpen) {
            this.closePanel();
        } else {
            this.openPanel();
        }
    }

    openPanel() {
        this.panel.classList.add('active');
        this.overlay.classList.add('active');
        this.toggleBtn.classList.add('active');
        this.isOpen = true;
        
        // Prevent body scroll when panel is open
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.closeBtn.focus();
        
        // Add animation callback
        this.panel.addEventListener('transitionend', this.onPanelOpened.bind(this), { once: true });
    }

    closePanel() {
        this.panel.classList.remove('active');
        this.overlay.classList.remove('active');
        this.toggleBtn.classList.remove('active');
        this.isOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        this.toggleBtn.focus();
        
        // Add animation callback
        this.panel.addEventListener('transitionend', this.onPanelClosed.bind(this), { once: true });
    }

    onPanelOpened() {
        console.log('Panel opened');
        // Additional actions when panel is fully opened
    }

    onPanelClosed() {
        console.log('Panel closed');
        // Additional actions when panel is fully closed
    }

    handleKeydown(e) {
        // Close panel on Escape key
        if (e.key === 'Escape' && this.isOpen) {
            this.closePanel();
        }

        // Handle tab navigation within panel
        if (e.key === 'Tab' && this.isOpen) {
            this.handleTabNavigation(e);
        }
    }

    handleTabNavigation(e) {
        const focusableElements = this.panel.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    }

    handleResize() {
        // Close panel on mobile orientation change for better UX
        if (window.innerWidth > 768 && this.isOpen) {
            // Optionally keep panel open on larger screens
        }
    }

    addNavHoverEffects() {
        const navLinks = document.querySelectorAll('.nav-list a');
        
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(5px)';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.transform = 'translateX(0)';
            });
            
            // Add click animation
            link.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default for demo
                
                // Add active state animation
                this.style.background = '#3498db';
                this.style.color = 'white';
                
                setTimeout(() => {
                    this.style.background = '';
                    this.style.color = '';
                }, 200);
                
                console.log('Navigation clicked:', this.textContent);
            });
        });
    }

    // Public method to programmatically control the panel
    open() {
        if (!this.isOpen) this.openPanel();
    }

    close() {
        if (this.isOpen) this.closePanel();
    }

    toggle() {
        this.togglePanel();
    }

    // Get panel state
    getState() {
        return {
            isOpen: this.isOpen,
            width: this.panel.offsetWidth,
            height: this.panel.offsetHeight
        };
    }
}

// Utility functions for enhanced functionality
const PanelUtils = {
    // Add loading state to navigation items
    addLoadingState: (element) => {
        element.innerHTML += ' <span class="loading">⟳</span>';
        element.style.opacity = '0.6';
    },

    // Remove loading state
    removeLoadingState: (element) => {
        const loading = element.querySelector('.loading');
        if (loading) loading.remove();
        element.style.opacity = '1';
    },

    // Add notification badge
    addBadge: (element, count) => {
        const badge = document.createElement('span');
        badge.className = 'nav-badge';
        badge.textContent = count;
        badge.style.cssText = `
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.8rem;
            margin-left: 10px;
            display: inline-block;
            min-width: 18px;
            text-align: center;
        `;
        element.appendChild(badge);
    },

    // Smooth scroll to section
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
};

// Theme switcher functionality
const ThemeManager = {
    themes: {
        light: {
            '--bg-color': '#f5f5f5',
            '--panel-bg': 'white',
            '--text-color': '#333',
            '--header-bg': '#2c3e50'
        },
        dark: {
            '--bg-color': '#1a1a1a',
            '--panel-bg': '#2d2d2d',
            '--text-color': '#e0e0e0',
            '--header-bg': '#1f1f1f'
        }
    },

    setTheme: (themeName) => {
        const theme = this.themes[themeName];
        if (theme) {
            Object.entries(theme).forEach(([property, value]) => {
                document.documentElement.style.setProperty(property, value);
            });
            localStorage.setItem('selectedTheme', themeName);
        }
    },

    loadSavedTheme: () => {
        const savedTheme = localStorage.getItem('selectedTheme') || 'light';
        this.setTheme(savedTheme);
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the side panel
    const sidePanel = new SidePanel();
    
    // Load saved theme
    ThemeManager.loadSavedTheme();
    
    // Make side panel globally accessible for debugging
    window.sidePanel = sidePanel;
    window.PanelUtils = PanelUtils;
    window.ThemeManager = ThemeManager;
    
    // Add some demo badges after a delay
    setTimeout(() => {
        const blogLink = document.querySelector('a[href="#blog"]');
        const contactLink = document.querySelector('a[href="#contact"]');
        
        if (blogLink) PanelUtils.addBadge(blogLink, '3');
        if (contactLink) PanelUtils.addBadge(contactLink, '!');
    }, 2000);
    
    console.log('Side Panel initialized successfully!');
    console.log('Available methods: sidePanel.open(), sidePanel.close(), sidePanel.toggle()');
});

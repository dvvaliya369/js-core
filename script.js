// Modal functionality
class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        // Add event listeners for opening modals
        document.getElementById('openModalBtn').addEventListener('click', () => this.openModal('modal1'));
        document.getElementById('openModal2Btn').addEventListener('click', () => this.openModal('modal2'));
        document.getElementById('openModal3Btn').addEventListener('click', () => this.openModal('modal3'));

        // Add event listeners for closing modals
        document.addEventListener('click', (e) => this.handleCloseClick(e));
        
        // Add keyboard event listener
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Prevent modal content clicks from closing modal
        document.querySelectorAll('.modal-content').forEach(content => {
            content.addEventListener('click', (e) => e.stopPropagation());
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Close any currently open modal
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }

        modal.style.display = 'flex';
        
        // Use requestAnimationFrame to ensure display change is applied before adding active class
        requestAnimationFrame(() => {
            modal.classList.add('active');
            this.activeModal = modalId;
            
            // Focus management for accessibility
            const firstFocusableElement = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusableElement) {
                firstFocusableElement.focus();
            }
        });

        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('active');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            modal.style.display = 'none';
            if (this.activeModal === modalId) {
                this.activeModal = null;
                // Restore body scrolling
                document.body.style.overflow = 'auto';
            }
        }, 300);
    }

    closeActiveModal() {
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
    }

    handleCloseClick(e) {
        // Close button clicked
        if (e.target.classList.contains('close')) {
            const modalId = e.target.getAttribute('data-modal');
            if (modalId) {
                this.closeModal(modalId);
            }
            return;
        }

        // Button with data-close attribute clicked
        if (e.target.hasAttribute('data-close')) {
            const modalId = e.target.getAttribute('data-close');
            this.closeModal(modalId);
            return;
        }

        // Overlay clicked
        if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal')) {
            this.closeActiveModal();
        }
    }

    handleKeydown(e) {
        // Close modal on Escape key
        if (e.key === 'Escape' && this.activeModal) {
            this.closeActiveModal();
        }

        // Tab key handling for modal focus trapping
        if (e.key === 'Tab' && this.activeModal) {
            this.handleTabKey(e);
        }
    }

    handleTabKey(e) {
        const modal = document.getElementById(this.activeModal);
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                e.preventDefault();
            }
        } else {
            // Tab
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Utility functions for enhanced functionality
class ModalUtils {
    static createModal(options = {}) {
        const {
            id = 'dynamic-modal',
            title = 'Modal Title',
            content = 'Modal Content',
            size = 'medium',
            buttons = [{ text: 'Close', action: 'close', class: 'btn-secondary' }]
        } = options;

        // Check if modal already exists
        let modal = document.getElementById(id);
        if (modal) {
            modal.remove();
        }

        // Create modal HTML
        const modalHTML = `
            <div id="${id}" class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-content ${size}">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <span class="close" data-modal="${id}">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        ${buttons.map(btn => 
                            `<button class="btn ${btn.class || 'btn-primary'}" 
                                    data-close="${id}" 
                                    data-action="${btn.action || 'close'}">${btn.text}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add modal to DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Return modal element
        return document.getElementById(id);
    }

    static showAlert(title, message, type = 'info') {
        const typeClasses = {
            success: 'btn-primary',
            error: 'btn-danger',
            warning: 'btn-warning',
            info: 'btn-secondary'
        };

        const modal = ModalUtils.createModal({
            id: 'alert-modal',
            title: title,
            content: `<p>${message}</p>`,
            size: 'small',
            buttons: [{ text: 'OK', action: 'close', class: typeClasses[type] }]
        });

        // Auto-open the alert
        setTimeout(() => modalManager.openModal('alert-modal'), 100);
    }

    static showConfirm(title, message, onConfirm, onCancel) {
        const modal = ModalUtils.createModal({
            id: 'confirm-modal',
            title: title,
            content: `<p>${message}</p>`,
            size: 'small',
            buttons: [
                { text: 'Confirm', action: 'confirm', class: 'btn-primary' },
                { text: 'Cancel', action: 'cancel', class: 'btn-secondary' }
            ]
        });

        // Add event listeners for confirm/cancel
        modal.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (action === 'confirm' && onConfirm) {
                onConfirm();
            } else if (action === 'cancel' && onCancel) {
                onCancel();
            }
        });

        // Auto-open the confirmation
        setTimeout(() => modalManager.openModal('confirm-modal'), 100);
    }
}

// Initialize the modal manager when DOM is loaded
let modalManager;

document.addEventListener('DOMContentLoaded', () => {
    modalManager = new ModalManager();
    
    // Add some demo functionality
    addDemoFeatures();
});

// Demo features
function addDemoFeatures() {
    // Add a demo button for dynamic modal creation
    const container = document.querySelector('.container');
    const demoSection = document.createElement('div');
    demoSection.innerHTML = `
        <div style="margin-top: 40px; padding-top: 30px; border-top: 2px solid #eee;">
            <h3 style="color: #4a5568; margin-bottom: 20px;">Advanced Modal Features</h3>
            <div class="demo-buttons">
                <button id="alertBtn" class="open-btn" style="background: #28a745;">Show Alert</button>
                <button id="confirmBtn" class="open-btn" style="background: #ffc107; color: #212529;">Show Confirm</button>
                <button id="dynamicBtn" class="open-btn" style="background: #17a2b8;">Dynamic Modal</button>
            </div>
        </div>
    `;
    container.appendChild(demoSection);

    // Add event listeners for demo buttons
    document.getElementById('alertBtn').addEventListener('click', () => {
        ModalUtils.showAlert('Success!', 'This is a dynamically created alert modal.', 'success');
    });

    document.getElementById('confirmBtn').addEventListener('click', () => {
        ModalUtils.showConfirm(
            'Confirm Action', 
            'Are you sure you want to proceed?',
            () => ModalUtils.showAlert('Confirmed', 'You clicked confirm!', 'success'),
            () => ModalUtils.showAlert('Cancelled', 'You clicked cancel!', 'info')
        );
    });

    document.getElementById('dynamicBtn').addEventListener('click', () => {
        const content = `
            <p>This modal was created dynamically using JavaScript!</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <strong>Features:</strong>
                <ul style="margin-top: 10px;">
                    <li>Created on-the-fly</li>
                    <li>Customizable content</li>
                    <li>Flexible button configuration</li>
                    <li>Automatic cleanup</li>
                </ul>
            </div>
        `;

        ModalUtils.createModal({
            id: 'dynamic-demo',
            title: '🚀 Dynamic Modal',
            content: content,
            size: 'large',
            buttons: [
                { text: 'Awesome!', action: 'close', class: 'btn-primary' },
                { text: 'Close', action: 'close', class: 'btn-secondary' }
            ]
        });

        modalManager.openModal('dynamic-demo');
    });
}

// Export for use in other scripts if needed
window.ModalManager = ModalManager;
window.ModalUtils = ModalUtils;

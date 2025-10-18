// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .cta-button').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.email.value.trim();
    const message = this.querySelector('textarea').value.trim();

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    if (!message) {
        alert('Please enter a message.');
        return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // In a real application, you would send the form data to a server here
    alert('Thank you for your message! We\'ll get back to you soon.');
    this.reset();
});

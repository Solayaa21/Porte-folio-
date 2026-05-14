// Logic for Strict Single Page App views
function showView(viewId) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => {
        view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Always scroll to top when changing views
    window.scrollTo(0, 0);

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        // Match the onclick attribute to set active state (simplified)
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(viewId)) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu if open
    const nav = document.querySelector('.nav');
    if (nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
}

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Lightbox logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
    }
});

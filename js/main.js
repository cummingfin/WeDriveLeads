// Main JavaScript for WeDriveLeads
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Add loading states to buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-hero');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading for external links
            if (this.href && this.href.startsWith('http') && !this.href.includes(window.location.hostname)) {
                return;
            }
            
            // Add loading state for internal navigation
            if (this.href && !this.href.startsWith('mailto:')) {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.style.pointerEvents = 'none';
                
                // Reset after navigation (this will happen naturally on page load)
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });

    // Add hover effects to value cards
    const valueCards = document.querySelectorAll('.value-card');
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add animation on scroll for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.value-card, .step, .hero-content, .hero-image');
    animateElements.forEach(element => {
        element.classList.add('animate-ready');
        observer.observe(element);
    });

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Add form validation styles
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('error');
                } else {
                    this.classList.remove('error');
                }
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    this.classList.remove('error');
                }
            });
        });
    });

    // Add search functionality (placeholder for future implementation)
    function initializeSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const query = e.target.value.toLowerCase();
                // Implement search logic here
                console.log('Searching for:', query);
            });
        }
    }

    // Initialize search if it exists
    initializeSearch();

    // Add cookie consent (placeholder for future implementation)
    function checkCookieConsent() {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Show cookie consent banner
            showCookieConsent();
        }
    }

    function showCookieConsent() {
        const banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-content">
                <p>We use cookies to improve your experience. By continuing to use this site, you agree to our use of cookies.</p>
                <div class="cookie-buttons">
                    <button class="btn-primary accept-cookies">Accept</button>
                    <button class="btn-secondary decline-cookies">Decline</button>
                </div>
            </div>
        `;
        
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #1a1a1a;
            color: #ffffff;
            padding: 1rem;
            z-index: 10000;
            box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(banner);
        
        // Handle cookie consent
        banner.querySelector('.accept-cookies').addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'accepted');
            banner.remove();
        });
        
        banner.querySelector('.decline-cookies').addEventListener('click', function() {
            localStorage.setItem('cookie-consent', 'declined');
            banner.remove();
        });
    }

    // Check cookie consent
    checkCookieConsent();

    // Add analytics tracking (placeholder for future implementation)
    function trackPageView() {
        // This would integrate with your analytics service
        console.log('Page viewed:', window.location.pathname);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname
            });
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView');
        }
    }

    // Track page view
    trackPageView();

    // Add error handling for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
        });
    });

    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            }, 0);
        });
    }

    // Add service worker registration (placeholder for future PWA implementation)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #ffffff;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        gap: 1rem;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-toggle span {
        transition: 0.3s;
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .cookie-banner .cookie-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        gap: 1rem;
    }
    
    .cookie-buttons {
        display: flex;
        gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .cookie-banner .cookie-content {
            flex-direction: column;
            text-align: center;
        }
        
        .nav-links {
            display: none;
        }
    }
`;

document.head.appendChild(style);

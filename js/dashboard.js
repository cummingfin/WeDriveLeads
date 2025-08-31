// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const embedCode = document.getElementById('embedCode');

    // Copy embed code functionality
    copyCodeBtn.addEventListener('click', function() {
        const codeToCopy = embedCode.textContent;
        
        navigator.clipboard.writeText(codeToCopy).then(function() {
            // Change button text temporarily
            const originalText = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyCodeBtn.style.background = '#00ff88';
            copyCodeBtn.style.color = '#1a1a1a';
            
            // Reset button after 2 seconds
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalText;
                copyCodeBtn.style.background = '#00ff88';
                copyCodeBtn.style.color = '#1a1a1a';
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
            
            // Fallback for older browsers
            fallbackCopyTextToClipboard(codeToCopy);
        });
    });

    // Fallback copy function for older browsers
    function fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                // Show success message
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyCodeBtn.style.background = '#00ff88';
                copyCodeBtn.style.color = '#1a1a1a';
                
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                    copyCodeBtn.style.background = '#00ff88';
                    copyCodeBtn.style.color = '#1a1a1a';
                }, 2000);
            } else {
                alert('Could not copy code. Please copy manually.');
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Could not copy code. Please copy manually.');
        }
        
        document.body.removeChild(textArea);
    }

    // Add smooth scrolling for anchor links
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

    // Add animation on scroll for step cards
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

    // Observe step cards for animation
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects for help options
    const helpOptions = document.querySelectorAll('.help-option');
    helpOptions.forEach(option => {
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add success animation for the success message
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.style.opacity = '0';
        successMessage.style.transform = 'translateY(30px)';
        successMessage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add loading animation for buttons
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading for external links or mailto
            if (this.href && (this.href.startsWith('mailto:') || this.href.startsWith('http'))) {
                return;
            }
            
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.style.pointerEvents = 'none';
            
            // Simulate loading (remove this in production)
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });

    // Add tooltip for code block
    const codeBlock = document.querySelector('.code-block');
    if (codeBlock) {
        codeBlock.addEventListener('click', function() {
            // Select all text in code block
            const range = document.createRange();
            range.selectNodeContents(this);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Show tooltip
            showTooltip('Code selected! Press Ctrl+C to copy', this);
        });
    }

    // Tooltip function
    function showTooltip(message, element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: #1a1a1a;
            color: #ffffff;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        // Show tooltip
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);
        
        // Hide tooltip after 3 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 300);
        }, 3000);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + C to copy code
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            const selection = window.getSelection();
            if (selection.toString().includes('<script')) {
                e.preventDefault();
                copyCodeBtn.click();
            }
        }
        
        // Escape key to close any open modals (if we add them later)
        if (e.key === 'Escape') {
            // Close any open modals here
        }
    });

    // Add analytics tracking (placeholder for future implementation)
    function trackEvent(eventName, eventData) {
        // This would integrate with your analytics service
        console.log('Event tracked:', eventName, eventData);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventData);
        }
    }

    // Track dashboard view
    trackEvent('dashboard_viewed', {
        page: 'dashboard',
        timestamp: new Date().toISOString()
    });

    // Track copy code events
    copyCodeBtn.addEventListener('click', function() {
        trackEvent('embed_code_copied', {
            page: 'dashboard',
            timestamp: new Date().toISOString()
        });
    });
});

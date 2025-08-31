// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const chatBtn = document.querySelector('.chat-btn');

    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission();
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            contactForm.reset();
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });

    // Close modal when clicking close button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            hideSuccessModal();
        });
    }

    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.style.display !== 'none') {
            hideSuccessModal();
        }
    });

    // Live chat button functionality
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // This would integrate with your live chat service
            alert('Live chat feature coming soon! For now, please email us at support@wedriveleads.co');
        });
    }

    // Form validation
    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
            } else {
                clearFieldError(field);
            }
        });
        
        // Validate email format
        const emailField = contactForm.querySelector('#email');
        if (emailField && emailField.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value.trim())) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Validate message length
        const messageField = contactForm.querySelector('#message');
        if (messageField && messageField.value.trim()) {
            if (messageField.value.trim().length < 10) {
                showFieldError(messageField, 'Message must be at least 10 characters long');
                isValid = false;
            }
        }
        
        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        // Remove existing error
        clearFieldError(field);
        
        // Add error styling
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            font-weight: 500;
        `;
        
        // Insert error message after field
        field.parentNode.appendChild(errorDiv);
    }

    // Clear field error
    function clearFieldError(field) {
        field.style.borderColor = '#e2e8f0';
        field.style.boxShadow = 'none';
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Simulate form submission
    async function simulateFormSubmission() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000); // Simulate 2 second API call
        });
    }

    // Show success modal
    function showSuccessModal() {
        if (successModal) {
            successModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            // Add animation
            const modalContent = successModal.querySelector('.modal-content');
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                modalContent.style.transition = 'all 0.3s ease';
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // Hide success modal
    function hideSuccessModal() {
        if (successModal) {
            const modalContent = successModal.querySelector('.modal-content');
            modalContent.style.transform = 'scale(0.9)';
            modalContent.style.opacity = '0';
            
            setTimeout(() => {
                successModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else {
                clearFieldError(this);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error') || this.parentNode.querySelector('.field-error')) {
                clearFieldError(this);
            }
        });
    });

    // Character counter for message field
    const messageField = contactForm.querySelector('#message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: #9ca3af;
            text-align: right;
            margin-top: 0.25rem;
        `;
        counter.textContent = '0/1000 characters';
        
        messageField.parentNode.appendChild(counter);
        
        messageField.addEventListener('input', function() {
            const remaining = 1000 - this.value.length;
            counter.textContent = `${this.value.length}/1000 characters`;
            
            if (remaining < 100) {
                counter.style.color = '#ef4444';
            } else if (remaining < 200) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#9ca3af';
            }
        });
    }

    // Auto-save form data to localStorage
    function autoSaveForm() {
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        localStorage.setItem('contactFormData', JSON.stringify(data));
    }

    // Load saved form data
    function loadSavedFormData() {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const field = contactForm.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                    }
                });
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    }

    // Auto-save on input
    formInputs.forEach(input => {
        input.addEventListener('input', autoSaveForm);
    });

    // Load saved data on page load
    loadSavedFormData();

    // Clear saved data after successful submission
    contactForm.addEventListener('submit', function() {
        localStorage.removeItem('contactFormData');
    });

    // Add analytics tracking (placeholder for future implementation)
    function trackContactFormSubmission(formData) {
        // This would integrate with your analytics service
        console.log('Contact form submitted:', formData);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_form_submitted', {
                event_category: 'engagement',
                event_label: 'contact_page'
            });
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead');
        }
    }

    // Enhanced form submission with analytics
    contactForm.addEventListener('submit', function() {
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        trackContactFormSubmission(data);
    });

    // Add accessibility improvements
    contactForm.addEventListener('keydown', function(e) {
        // Submit form with Ctrl/Cmd + Enter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            contactForm.dispatchEvent(new Event('submit'));
        }
    });

    // Add focus management for modal
    if (successModal) {
        successModal.addEventListener('shown.bs.modal', function() {
            closeModalBtn.focus();
        });
    }

    // Add form reset confirmation
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.className = 'btn-secondary';
    resetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset Form';
    resetBtn.style.cssText = `
        margin-top: 1rem;
        margin-right: 1rem;
        background: #f1f5f9;
        color: #1a1a1a;
        border: 2px solid #e2e8f0;
        padding: 0.875rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All entered data will be lost.')) {
            contactForm.reset();
            localStorage.removeItem('contactFormData');
            
            // Clear any error messages
            contactForm.querySelectorAll('.field-error').forEach(error => error.remove());
            contactForm.querySelectorAll('input, select, textarea').forEach(field => {
                field.style.borderColor = '#e2e8f0';
                field.style.boxShadow = 'none';
            });
        }
    });
    
    // Insert reset button after submit button
    const submitBtn = contactForm.querySelector('.btn-submit');
    submitBtn.parentNode.insertBefore(resetBtn, submitBtn);
});

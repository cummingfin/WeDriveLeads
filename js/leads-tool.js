// Leads Tool JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const leadsForm = document.getElementById('leadsForm');
    const resultsSection = document.getElementById('resultsSection');
    const demoResults = document.getElementById('demoResults');
    const leadsGrid = document.getElementById('leadsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const exportBtn = document.getElementById('exportBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    // Form submission handler
    leadsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const searchBtn = leadsForm.querySelector('.btn-search');
        const originalText = searchBtn.innerHTML;
        searchBtn.classList.add('loading');
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        searchBtn.disabled = true;
        
        try {
            // Simulate API call
            const results = await simulateLeadSearch();
            
            // Hide demo results and show search results
            demoResults.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Display results
            displayResults(results);
            
        } catch (error) {
            console.error('Error searching for leads:', error);
            alert('There was an error searching for leads. Please try again.');
        } finally {
            // Reset button state
            searchBtn.classList.remove('loading');
            searchBtn.innerHTML = originalText;
            searchBtn.disabled = false;
        }
    });

    // Export CSV functionality
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportToCSV();
        });
    }

    // Refresh functionality
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // Reset to demo results
            resultsSection.style.display = 'none';
            demoResults.style.display = 'block';
        });
    }

    // Form validation
    function validateForm() {
        const industry = document.getElementById('industry');
        const location = document.getElementById('location');
        let isValid = true;
        
        // Clear previous errors
        clearFieldErrors();
        
        if (!industry.value.trim()) {
            showFieldError(industry, 'Please select an industry');
            isValid = false;
        }
        
        if (!location.value.trim()) {
            showFieldError(location, 'Please enter a location');
            isValid = false;
        }
        
        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
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

    // Clear field errors
    function clearFieldErrors() {
        const fields = leadsForm.querySelectorAll('input, select');
        fields.forEach(field => {
            field.style.borderColor = '#e2e8f0';
            field.style.boxShadow = 'none';
        });
        
        const errors = leadsForm.querySelectorAll('.field-error');
        errors.forEach(error => error.remove());
    }

    // Simulate lead search
    async function simulateLeadSearch() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate sample leads based on form data
                const industry = document.getElementById('industry').value;
                const location = document.getElementById('location').value;
                const radius = document.getElementById('radius').value;
                const businessSize = document.getElementById('businessSize').value;
                
                const leads = generateSampleLeads(industry, location, radius, businessSize);
                resolve(leads);
            }, 2000); // Simulate 2 second API call
        });
    }

    // Generate sample leads
    function generateSampleLeads(industry, location, radius, businessSize) {
        const sampleBusinesses = [
            {
                name: `${industry.charAt(0).toUpperCase() + industry.slice(1)} Solutions Ltd`,
                distance: (Math.random() * parseFloat(radius)).toFixed(1),
                address: `${Math.floor(Math.random() * 999) + 1} High Street, ${location}`,
                phone: `0${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `info@${industry}${Math.floor(Math.random() * 1000)}.co.uk`,
                website: `www.${industry}${Math.floor(Math.random() * 1000)}.co.uk`
            },
            {
                name: `Elite ${industry.charAt(0).toUpperCase() + industry.slice(1)} Services`,
                distance: (Math.random() * parseFloat(radius)).toFixed(1),
                address: `${Math.floor(Math.random() * 999) + 1} Queen's Road, ${location}`,
                phone: `0${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `hello@elite${industry}.com`,
                website: `www.elite${industry}.com`
            },
            {
                name: `Premier ${industry.charAt(0).toUpperCase() + industry.slice(1)} Co`,
                distance: (Math.random() * parseFloat(radius)).toFixed(1),
                address: `${Math.floor(Math.random() * 999) + 1} Victoria Street, ${location}`,
                phone: `0${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `contact@premier${industry}.co.uk`,
                website: `www.premier${industry}.co.uk`
            },
            {
                name: `Professional ${industry.charAt(0).toUpperCase() + industry.slice(1)}`,
                distance: (Math.random() * parseFloat(radius)).toFixed(1),
                address: `${Math.floor(Math.random() * 999) + 1} Oxford Street, ${location}`,
                phone: `0${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `info@professional${industry}.com`,
                website: `www.professional${industry}.com`
            },
            {
                name: `Quality ${industry.charAt(0).toUpperCase() + industry.slice(1)} Ltd`,
                distance: (Math.random() * parseFloat(radius)).toFixed(1),
                address: `${Math.floor(Math.random() * 999) + 1} Park Lane, ${location}`,
                phone: `0${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `hello@quality${industry}.co.uk`,
                website: `www.quality${industry}.co.uk`
            }
        ];
        
        return sampleBusinesses;
    }

    // Display search results
    function displayResults(leads) {
        // Update results count
        resultsCount.textContent = leads.length;
        
        // Clear existing leads
        leadsGrid.innerHTML = '';
        
        // Add new leads
        leads.forEach(lead => {
            const leadCard = createLeadCard(lead);
            leadsGrid.appendChild(leadCard);
        });
    }

    // Create lead card
    function createLeadCard(lead) {
        const card = document.createElement('div');
        card.className = 'lead-card';
        
        card.innerHTML = `
            <div class="lead-header">
                <h3>${lead.name}</h3>
                <span class="lead-distance">${lead.distance} miles away</span>
            </div>
            <div class="lead-details">
                <p><i class="fas fa-map-marker-alt"></i> ${lead.address}</p>
                <p><i class="fas fa-phone"></i> ${lead.phone}</p>
                <p><i class="fas fa-envelope"></i> ${lead.email}</p>
                <p><i class="fas fa-globe"></i> <a href="#" target="_blank">${lead.website}</a></p>
            </div>
            <div class="lead-actions">
                <button class="btn-primary btn-small contact-btn">Contact</button>
                <button class="btn-secondary btn-small save-btn">Save Lead</button>
            </div>
        `;
        
        // Add event listeners
        const contactBtn = card.querySelector('.contact-btn');
        const saveBtn = card.querySelector('.save-btn');
        
        contactBtn.addEventListener('click', function() {
            alert(`Contact functionality coming soon! You would contact ${lead.name} at ${lead.email}`);
        });
        
        saveBtn.addEventListener('click', function() {
            saveLead(lead);
            this.textContent = 'Saved!';
            this.style.background = '#00ff88';
            this.style.color = '#1a1a1a';
            setTimeout(() => {
                this.textContent = 'Save Lead';
                this.style.background = '#f1f5f9';
                this.style.color = '#1a1a1a';
            }, 2000);
        });
        
        return card;
    }

    // Save lead to localStorage
    function saveLead(lead) {
        const savedLeads = JSON.parse(localStorage.getItem('savedLeads') || '[]');
        savedLeads.push({
            ...lead,
            savedAt: new Date().toISOString()
        });
        localStorage.setItem('savedLeads', JSON.stringify(savedLeads));
    }

    // Export to CSV
    function exportToCSV() {
        const leads = Array.from(leadsGrid.querySelectorAll('.lead-card')).map(card => {
            const name = card.querySelector('h3').textContent;
            const distance = card.querySelector('.lead-distance').textContent;
            const address = card.querySelector('.lead-details p:nth-child(1)').textContent.replace('📍 ', '');
            const phone = card.querySelector('.lead-details p:nth-child(2)').textContent.replace('📞 ', '');
            const email = card.querySelector('.lead-details p:nth-child(3)').textContent.replace('✉️ ', '');
            const website = card.querySelector('.lead-details p:nth-child(4)').textContent.replace('🌐 ', '');
            
            return { name, distance, address, phone, email, website };
        });
        
        if (leads.length === 0) {
            alert('No leads to export');
            return;
        }
        
        // Create CSV content
        const headers = ['Business Name', 'Distance', 'Address', 'Phone', 'Email', 'Website'];
        const csvContent = [
            headers.join(','),
            ...leads.map(lead => [
                `"${lead.name}"`,
                `"${lead.distance}"`,
                `"${lead.address}"`,
                `"${lead.phone}"`,
                `"${lead.email}"`,
                `"${lead.website}"`
            ].join(','))
        ].join('\n');
        
        // Download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Add real-time validation
    const formInputs = leadsForm.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this, 'This field is required');
            } else {
                clearFieldErrors();
            }
        });
        
        input.addEventListener('input', function() {
            if (this.parentNode.querySelector('.field-error')) {
                clearFieldErrors();
            }
        });
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            leadsForm.dispatchEvent(new Event('submit'));
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            leadsForm.reset();
            clearFieldErrors();
        }
    });

    // Add analytics tracking (placeholder for future implementation)
    function trackLeadSearch(searchData) {
        // This would integrate with your analytics service
        console.log('Lead search performed:', searchData);
        
        // Example: Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead_search_performed', {
                event_category: 'engagement',
                event_label: 'leads_tool',
                search_industry: searchData.industry,
                search_location: searchData.location
            });
        }
        
        // Example: Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Search');
        }
    }

    // Enhanced form submission with analytics
    leadsForm.addEventListener('submit', function() {
        const formData = new FormData(leadsForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        trackLeadSearch(data);
    });

    // Add demo results interaction
    const demoLeadCards = demoResults.querySelectorAll('.lead-card');
    demoLeadCards.forEach(card => {
        const contactBtn = card.querySelector('.contact-btn');
        const saveBtn = card.querySelector('.save-btn');
        
        contactBtn.addEventListener('click', function() {
            alert('This is a demo! In the full version, you would be able to contact these businesses directly.');
        });
        
        saveBtn.addEventListener('click', function() {
            alert('This is a demo! In the full version, you would be able to save leads to your account.');
        });
    });

    // Add search suggestions
    const locationInput = document.getElementById('location');
    if (locationInput) {
        const suggestions = [
            'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool',
            'Sheffield', 'Edinburgh', 'Bristol', 'Glasgow', 'Leicester'
        ];
        
        locationInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            const filteredSuggestions = suggestions.filter(suggestion => 
                suggestion.toLowerCase().includes(value)
            );
            
            // Remove existing suggestions
            const existingSuggestions = document.querySelector('.location-suggestions');
            if (existingSuggestions) {
                existingSuggestions.remove();
            }
            
            if (value && filteredSuggestions.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'location-suggestions';
                suggestionsDiv.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #ffffff;
                    border: 2px solid #e2e8f0;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    max-height: 200px;
                    overflow-y: auto;
                    z-index: 1000;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                `;
                
                filteredSuggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = suggestion;
                    suggestionItem.style.cssText = `
                        padding: 0.75rem 1rem;
                        cursor: pointer;
                        border-bottom: 1px solid #f1f5f9;
                        transition: background 0.2s ease;
                    `;
                    
                    suggestionItem.addEventListener('mouseenter', function() {
                        this.style.background = '#f8fafc';
                    });
                    
                    suggestionItem.addEventListener('mouseleave', function() {
                        this.style.background = '#ffffff';
                    });
                    
                    suggestionItem.addEventListener('click', function() {
                        locationInput.value = suggestion;
                        suggestionsDiv.remove();
                    });
                    
                    suggestionsDiv.appendChild(suggestionItem);
                });
                
                // Position suggestions below input
                const inputContainer = locationInput.parentNode;
                inputContainer.style.position = 'relative';
                inputContainer.appendChild(suggestionsDiv);
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.form-group')) {
                const existingSuggestions = document.querySelector('.location-suggestions');
                if (existingSuggestions) {
                    existingSuggestions.remove();
                }
            }
        });
    }

    // Add search history
    function saveSearchHistory(searchData) {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const searchEntry = {
            ...searchData,
            timestamp: new Date().toISOString()
        };
        
        // Add to beginning of array
        history.unshift(searchEntry);
        
        // Keep only last 10 searches
        if (history.length > 10) {
            history.pop();
        }
        
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }

    // Load search history
    function loadSearchHistory() {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        if (history.length > 0) {
            // You could display this as recent searches
            console.log('Recent searches:', history);
        }
    }

    // Load search history on page load
    loadSearchHistory();

    // Save search when form is submitted
    leadsForm.addEventListener('submit', function() {
        const formData = new FormData(leadsForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        saveSearchHistory(data);
    });
});

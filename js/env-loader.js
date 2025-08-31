// Secure Environment Loader
// This file safely loads environment variables for development
// In production, these would be loaded from server-side environment variables

class SecureEnvLoader {
    constructor() {
        this.config = {};
        this.loaded = false;
    }

    // Load configuration safely
    async loadConfig() {
        try {
            // For development, we'll load from a secure endpoint
            // In production, this would be handled server-side
            const response = await fetch('/api/config');
            
            if (response.ok) {
                this.config = await response.json();
                this.loaded = true;
                return true;
            } else {
                // Fallback for development - load from local storage (temporary)
                this.loadFromLocalStorage();
                return true;
            }
        } catch (error) {
            console.log('Loading config from local storage for development...');
            this.loadFromLocalStorage();
            return true;
        }
    }

    // Load from local storage (development only)
    loadFromLocalStorage() {
        try {
            const storedConfig = localStorage.getItem('wedriveleads_config');
            if (storedConfig) {
                this.config = JSON.parse(storedConfig);
                this.loaded = true;
            } else {
                // Set up initial config
                this.setupInitialConfig();
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.setupInitialConfig();
        }
    }

    // Set up initial configuration
    setupInitialConfig() {
        this.config = {
            openai_api_key: null,
            supabase_url: null,
            supabase_anon_key: null,
            environment: 'development'
        };
        this.loaded = true;
    }

    // Get configuration value safely
    get(key) {
        if (!this.loaded) {
            throw new Error('Configuration not loaded. Call loadConfig() first.');
        }
        return this.config[key] || null;
    }

    // Set configuration value (development only)
    set(key, value) {
        if (this.config.environment === 'production') {
            throw new Error('Cannot set configuration in production');
        }
        this.config[key] = value;
        this.saveToLocalStorage();
    }

    // Save to local storage (development only)
    saveToLocalStorage() {
        try {
            localStorage.setItem('wedriveleads_config', JSON.stringify(this.config));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    // Check if configuration is complete
    isConfigComplete() {
        return this.config.openai_api_key && 
               this.config.supabase_url && 
               this.config.supabase_anon_key;
    }

    // Get missing configuration items
    getMissingConfig() {
        const missing = [];
        if (!this.config.openai_api_key) missing.push('OpenAI API Key');
        if (!this.config.supabase_url) missing.push('Supabase URL');
        if (!this.config.supabase_anon_key) missing.push('Supabase Anon Key');
        return missing;
    }
}

// Create global instance
window.envLoader = new SecureEnvLoader();

// Auto-load configuration
document.addEventListener('DOMContentLoaded', async () => {
    await window.envLoader.loadConfig();
    
    // Check if configuration is complete
    if (!window.envLoader.isConfigComplete()) {
        console.log('Configuration incomplete. Missing:', window.envLoader.getMissingConfig());
        
        // Show setup instructions
        showSetupInstructions();
    } else {
        console.log('Configuration loaded successfully');
    }
});

// Show setup instructions for missing configuration
function showSetupInstructions() {
    const setupDiv = document.createElement('div');
    setupDiv.innerHTML = `
        <div style="
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 1rem;
            margin: 1rem 0;
            color: #92400e;
        ">
            <h4>🔧 Configuration Required</h4>
            <p>To test the OpenAI API, you need to set up your configuration:</p>
            <ol>
                <li>Open your browser's Developer Tools (F12)</li>
                <li>Go to the Console tab</li>
                <li>Run: <code>envLoader.set('openai_api_key', 'your-api-key-here')</code></li>
                <li>Replace 'your-api-key-here' with your actual OpenAI API key</li>
            </ol>
            <p><strong>Note:</strong> This is for development only. In production, keys are stored securely server-side.</p>
        </div>
    `;
    
    // Insert at the top of the page
    const container = document.querySelector('.test-container');
    if (container) {
        container.insertBefore(setupDiv, container.firstChild);
    }
}

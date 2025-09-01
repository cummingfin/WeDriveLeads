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

    // Expose configuration to window object for easy access
    exposeToWindow() {
        if (this.loaded) {
            window.env = this.config;
            window.SUPABASE_ANON_KEY = this.config.supabase_anon_key;
            window.SUPABASE_URL = this.config.supabase_url;
            window.OPENAI_API_KEY = this.config.openai_api_key;
        }
    }
}

// Create global instance
window.secureEnvLoader = new SecureEnvLoader();

// Auto-load configuration when script loads
window.secureEnvLoader.loadConfig().then(() => {
    window.secureEnvLoader.exposeToWindow();
    console.log('Environment configuration loaded');
}).catch(error => {
    console.error('Failed to load environment configuration:', error);
});

// For development - allow manual configuration
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Development mode: You can manually set environment variables');
    console.log('Example: window.secureEnvLoader.set("supabase_anon_key", "your-key-here")');
}

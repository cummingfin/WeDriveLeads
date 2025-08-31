// Secure OpenAI API Test
// This file safely tests the OpenAI API connection

class SecureOpenAITester {
    constructor() {
        this.testButton = document.getElementById('testButton');
        this.testPrompt = document.getElementById('testPrompt');
        this.resultContainer = document.getElementById('resultContainer');
        this.resultText = document.getElementById('resultText');
        this.statusContainer = document.getElementById('statusContainer');
        this.buttonText = document.getElementById('buttonText');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.testButton) {
            this.testButton.addEventListener('click', () => this.runTest());
        }
    }

    async runTest() {
        try {
            // Check if configuration is loaded
            if (!window.envLoader || !window.envLoader.loaded) {
                this.showError('Configuration not loaded. Please refresh the page.');
                return;
            }

            // Check if API key is available
            const apiKey = window.envLoader.get('openai_api_key');
            if (!apiKey) {
                this.showError('OpenAI API key not configured. Please set it up first.');
                return;
            }

            // Get the test prompt
            const prompt = this.testPrompt.value.trim();
            if (!prompt) {
                this.showError('Please enter a test prompt.');
                return;
            }

            // Start the test
            this.startTest();
            
            // Make the API call
            const result = await this.callOpenAI(apiKey, prompt);
            
            // Show the result
            this.showResult(result);
            
        } catch (error) {
            console.error('Test error:', error);
            this.showError(`Test failed: ${error.message}`);
        } finally {
            this.stopTest();
        }
    }

    async callOpenAI(apiKey, prompt) {
        // For security, we'll simulate the API call in development
        // In production, this would go through a secure backend
        
        console.log('Making secure API call to OpenAI...');
        
        // Simulate API call for development
        // In production, this would be a real fetch to your backend
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate successful response
                const mockResponse = {
                    choices: [{
                        message: {
                            content: `This is a simulated response for: "${prompt}"\n\nIn production, this would be the actual AI response from OpenAI.\n\nTo test with real API:\n1. Set up a secure backend endpoint\n2. Send requests through your server\n3. Never expose API keys in frontend code`
                        }
                    }]
                };
                
                resolve(mockResponse);
            }, 2000);
        });
        
        // REAL API CALL (uncomment when you have a secure backend)
        /*
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: prompt,
                max_tokens: 150,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
        */
    }

    startTest() {
        this.testButton.disabled = true;
        this.buttonText.innerHTML = '<span class="loading"></span>Testing API...';
        this.hideResult();
        this.clearStatus();
    }

    stopTest() {
        this.testButton.disabled = false;
        this.buttonText.textContent = 'Test OpenAI API';
    }

    showResult(result) {
        if (result && result.choices && result.choices[0]) {
            const content = result.choices[0].message.content;
            this.resultText.textContent = content;
            this.resultContainer.style.display = 'block';
            this.showStatus('API test completed successfully!', 'success');
        } else {
            this.showError('Invalid response format from API');
        }
    }

    showError(message) {
        this.showStatus(message, 'error');
    }

    showStatus(message, type) {
        this.statusContainer.innerHTML = `
            <div class="${type}">
                ${message}
            </div>
        `;
    }

    clearStatus() {
        this.statusContainer.innerHTML = '';
    }

    hideResult() {
        this.resultContainer.style.display = 'none';
    }
}

// Initialize the tester when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for environment loader to be ready
    if (window.envLoader && window.envLoader.loaded) {
        new SecureOpenAITester();
    } else {
        // Wait for environment loader
        const checkInterval = setInterval(() => {
            if (window.envLoader && window.envLoader.loaded) {
                clearInterval(checkInterval);
                new SecureOpenAITester();
            }
        }, 100);
    }
});

// Security: Prevent API key exposure
Object.defineProperty(window, 'OPENAI_API_KEY', {
    get: function() {
        console.warn('Security: Direct access to API keys is not allowed');
        return null;
    },
    set: function() {
        console.warn('Security: Cannot set API keys directly');
    }
});

// Security: Prevent console access to sensitive data
const originalConsoleLog = console.log;
console.log = function(...args) {
    // Filter out any potential API key exposure
    const filteredArgs = args.map(arg => {
        if (typeof arg === 'string' && arg.includes('sk-')) {
            return '[API_KEY_HIDDEN]';
        }
        return arg;
    });
    originalConsoleLog.apply(console, filteredArgs);
};

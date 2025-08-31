// Chatbot Generator JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('chatbotForm');
    const loadingModal = document.getElementById('loadingModal');
    const chatbotPreview = document.getElementById('chatbotPreview');
    const generatedContent = document.getElementById('generatedContent');
    const copyCodeBtn = document.getElementById('copyCodeBtn');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Form submitted!'); // Debug log
        
        // Show loading modal
        loadingModal.style.display = 'flex';
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            businessName: formData.get('businessName'),
            businessType: formData.get('businessType'),
            chatbotTone: formData.get('chatbotTone'),
            chatbotGoal: formData.get('chatbotGoal'),
            businessDescription: formData.get('businessDescription')
        };

        console.log('Form data:', data); // Debug log

        try {
            // Call the chatbot generation function
            const response = await simulateGenerateChatbot(data);
            
            console.log('Response received:', response); // Debug log
            
            // Hide loading modal
            loadingModal.style.display = 'none';
            
            // Display generated chatbot
            displayGeneratedChatbot(response);
            
            // Show generated content section
            generatedContent.style.display = 'block';
            
        } catch (error) {
            console.error('Error generating chatbot:', error);
            loadingModal.style.display = 'none';
            alert('There was an error generating your chatbot. Please try again. Error: ' + error.message);
        }
    });

    // Copy embed code functionality
    copyCodeBtn.addEventListener('click', function() {
        const embedCode = '<script src="https://wedriveleads.co/bots/user123.js"></script>';
        
        navigator.clipboard.writeText(embedCode).then(function() {
            // Change button text temporarily
            const originalText = copyCodeBtn.innerHTML;
            copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyCodeBtn.style.background = '#00ff88';
            copyCodeBtn.style.color = '#1a1a1a';
            
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalText;
                copyCodeBtn.style.background = '#f1f5f9';
                copyCodeBtn.style.color = '#1a1a1a';
            }, 2000);
        }).catch(function(err) {
            console.error('Could not copy text: ', err);
            alert('Could not copy code. Please copy manually.');
        });
    });
});

// Call real Supabase Edge Function for AI chatbot generation
async function simulateGenerateChatbot(data) {
    try {
        // Check if we have Supabase configuration
        if (!window.envLoader || !window.envLoader.get('supabase_url')) {
            console.log('Supabase not configured, using simulation');
            return new Promise((resolve) => {
                setTimeout(() => {
                    const responses = generateSampleResponses(data);
                    resolve(responses);
                }, 3000);
            });
        }

        // Call the real Supabase Edge Function
        const response = await fetch(`${window.envLoader.get('supabase_url')}/functions/v1/generate-chatbot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.envLoader.get('supabase_anon_key')}`
            },
            body: JSON.stringify({
                prompt: `Generate a chatbot for ${data.businessName}`,
                businessName: data.businessName,
                businessType: data.businessType,
                tone: data.chatbotTone,
                goal: data.chatbotGoal,
                description: data.businessDescription
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        const aiResponse = await response.json();
        
        if (aiResponse.success) {
            // Transform AI response to match expected format
            return {
                businessName: data.businessName,
                businessType: data.businessType,
                tone: data.chatbotTone,
                goal: data.chatbotGoal,
                conversation: [
                    { type: 'bot', message: aiResponse.chatbotIntro },
                    { type: 'user', message: 'Tell me about your services' },
                    { type: 'bot', message: aiResponse.sampleResponses[0] || 'I can help you with your project. What do you need?' }
                ],
                embedCode: aiResponse.embedCode || '<script src="https://wedriveleads.co/bots/user123.js"></script>',
                isRealAI: true
            };
        } else {
            throw new Error(aiResponse.error || 'AI generation failed');
        }
    } catch (error) {
        console.error('AI API call error:', error);
        // Fallback to simulation if AI call fails
        console.log('Falling back to simulation');
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = generateSampleResponses(data);
                resolve(responses);
            }, 3000);
        });
    }
}

// Generate sample chatbot responses based on form data
function generateSampleResponses(data) {
    const businessName = data.businessName;
    const businessType = data.businessType;
    const tone = data.chatbotTone;
    const goal = data.chatbotGoal;
    
    // Generate opening message based on tone
    let openingMessage = '';
    switch(tone) {
        case 'friendly':
            openingMessage = `Hi there! I'm the friendly assistant for ${businessName}. How can I help you today? 😊`;
            break;
        case 'professional':
            openingMessage = `Hello, I'm the professional assistant for ${businessName}. How may I assist you today?`;
            break;
        case 'funny':
            openingMessage = `Hey! I'm the witty assistant for ${businessName}. What can I do for you today? 😄`;
            break;
        case 'helpful':
            openingMessage = `Hi! I'm here to help with ${businessName}. What do you need assistance with today?`;
            break;
        default:
            openingMessage = `Hello! I'm the assistant for ${businessName}. How can I help you today?`;
    }
    
    // Generate sample conversation based on goal
    let conversation = [];
    
    switch(goal) {
        case 'book-jobs':
            conversation = [
                { type: 'bot', message: openingMessage },
                { type: 'user', message: 'I need a quote for a roofing job' },
                { type: 'bot', message: `Great! I'd be happy to help you get a quote from ${businessName}. Can you tell me a bit about your project? What type of roofing work do you need?` },
                { type: 'user', message: 'I have a leak in my roof' },
                { type: 'bot', message: `I understand you have a roof leak. This is urgent and we can help! To get you the best quote, I'll need a few details. What's your address and when would you like us to come take a look?` }
            ];
            break;
        case 'answer-questions':
            conversation = [
                { type: 'bot', message: openingMessage },
                { type: 'user', message: 'What services do you offer?' },
                { type: 'bot', message: `${businessName} offers a full range of ${businessType} services including repairs, installations, and maintenance. We're fully licensed and insured. What specific service are you looking for?` },
                { type: 'user', message: 'Do you work on weekends?' },
                { type: 'bot', message: `Yes, we do offer weekend appointments for urgent repairs and emergency services. For regular appointments, we typically schedule Monday through Friday. When would you like us to come by?` }
            ];
            break;
        case 'capture-leads':
            conversation = [
                { type: 'bot', message: openingMessage },
                { type: 'user', message: 'I\'m interested in your services' },
                { type: 'bot', message: `Excellent! I\'d love to help you get started with ${businessName}. To better assist you, could you share your name and contact information? I\'ll make sure our team reaches out right away.` },
                { type: 'user', message: 'My name is John, my number is 07700 900000' },
                { type: 'bot', message: `Perfect John! I\'ve got your details. Our team will call you within the next hour to discuss your project. Is there anything specific you\'d like me to tell them about what you need?` }
            ];
            break;
        case 'provide-quotes':
            conversation = [
                { type: 'bot', message: openingMessage },
                { type: 'user', message: 'Can you give me a quote?' },
                { type: 'bot', message: `Absolutely! I\'d be happy to help you get a quote from ${businessName}. To give you the most accurate estimate, I\'ll need some details about your project. What type of work do you need done?` },
                { type: 'user', message: 'I need a new bathroom fitted' },
                { type: 'bot', message: `A new bathroom installation! That\'s a great project. To get you a detailed quote, I\'ll need to know the size of your bathroom, any specific fixtures you want, and when you\'d like the work done. Can you share these details?` }
            ];
            break;
        default:
            conversation = [
                { type: 'bot', message: openingMessage },
                { type: 'user', message: 'Tell me about your services' },
                { type: 'bot', message: `${businessName} is a professional ${businessType} company serving the local area. We're known for quality work, fair pricing, and excellent customer service. What can I help you with today?` }
            ];
    }
    
    return {
        businessName: businessName,
        businessType: businessType,
        tone: tone,
        goal: goal,
        conversation: conversation,
        embedCode: '<script src="https://wedriveleads.co/bots/user123.js"></script>'
    };
}

// Display the generated chatbot
function displayGeneratedChatbot(data) {
    const chatbotPreview = document.getElementById('chatbotPreview');
    
    // Create chatbot preview HTML
    const previewHTML = `
        <div class="chatbot-preview">
            <div class="chat-header">
                <i class="fas fa-robot"></i>
                <span>${data.businessName} Assistant</span>
                ${data.isRealAI ? '<span class="ai-badge">🤖 AI Generated</span>' : ''}
            </div>
            <div class="chat-messages">
                ${data.conversation.map(msg => `
                    <div class="message ${msg.type}">
                        <p>${msg.message}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    chatbotPreview.innerHTML = previewHTML;
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add form validation feedback
    const form = document.getElementById('chatbotForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
    
    // Add character counter for business description
    const businessDescription = document.getElementById('businessDescription');
    if (businessDescription) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size: 0.8rem; color: #9ca3af; text-align: right; margin-top: 0.25rem;';
        counter.textContent = '0/500 characters';
        
        businessDescription.parentNode.appendChild(counter);
        
        businessDescription.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            counter.textContent = `${this.value.length}/500 characters`;
            
            if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#9ca3af';
            }
        });
    }
});

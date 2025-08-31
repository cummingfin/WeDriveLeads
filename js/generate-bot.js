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

// Interactive preview functions
window.sendPreviewMessage = function() {
    const input = document.getElementById('previewInput');
    const message = input.value.trim();
    
    if (message && window.previewBusinessData) {
        addPreviewMessage(message, 'user');
        input.value = '';
        
        // Generate contextual response based on business data
        setTimeout(() => {
            const response = generateContextualResponse(message, window.previewBusinessData);
            addPreviewMessage(response, 'bot');
        }, 1000);
    }
};

window.handlePreviewKeyPress = function(event) {
    if (event.key === 'Enter') {
        sendPreviewMessage();
    }
};

function addPreviewMessage(text, sender) {
    const messagesDiv = document.getElementById('previewMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function generateContextualResponse(userMessage, businessData) {
    const businessName = businessData.businessName;
    const businessType = businessData.businessType;
    const goal = businessData.goal;
    
    const lowerMessage = userMessage.toLowerCase();
    
    // Generate responses based on business type and user input
    if (lowerMessage.includes('quote') || lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        return `I'd be happy to help you get a quote from ${businessName}! To give you the most accurate estimate, I'll need some details about your project. What type of ${businessType} work do you need done?`;
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
        return `Great! I can help you schedule an appointment with ${businessName}. What day works best for you? We typically have availability Monday through Friday, and we can also accommodate urgent requests.`;
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
        return `${businessName} offers a full range of ${businessType} services including repairs, installations, maintenance, and emergency services. We're fully licensed and insured. What specific service are you looking for?`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('help')) {
        return `I understand this is urgent! ${businessName} provides emergency ${businessType} services 24/7. I'll connect you with our emergency team right away. Can you provide your address and describe the issue?`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
        return `I'd be happy to connect you with ${businessName}! Our team will call you within the next hour to discuss your project. What's the best phone number to reach you?`;
    }
    
    // Default response
    const responses = [
        `Thank you for your message! I'll make sure the ${businessName} team gets back to you soon.`,
        `That's great! Can you tell me more about your ${businessType} project?`,
        `I understand your needs. Let me connect you with our ${businessType} specialist.`,
        `Perfect! I've noted your requirements. Someone from ${businessName} will contact you within the hour.`,
        `Excellent! I can help you with that. What's your preferred contact method?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

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
        embedCode: generateEmbedCode(businessName, businessType)
    };
}

// Generate embed code for the chatbot
function generateEmbedCode(businessName, businessType) {
    return `<div id="wedriveleads-chatbot" data-business="${businessName}" data-type="${businessType}">
  <div class="chatbot-header">
    <h3>${businessName}</h3>
    <p>Professional ${businessType} Services</p>
  </div>
  <div class="chatbot-messages" id="chatbot-messages">
    <div class="message bot-message">
      <p>Hello! I'm here to help you with your ${businessType} needs. How can I assist you today?</p>
    </div>
  </div>
  <div class="chatbot-input">
    <input type="text" id="chatbot-input" placeholder="Type your message...">
    <button onclick="sendMessage()">Send</button>
  </div>
</div>

<script>
// Chatbot functionality
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (message) {
    addMessage(message, 'user');
    // Simulate bot response
    setTimeout(() => {
      addMessage('Thank you for your message! A ${businessType} specialist will contact you soon.', 'bot');
    }, 1000);
    input.value = '';
  }
}

function addMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = \`message \${sender}-message\`;
  messageDiv.innerHTML = \`<p>\${text}</p>\`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}
</script>`;
}

// Display the generated chatbot
function displayGeneratedChatbot(data) {
    const chatbotPreview = document.getElementById('chatbotPreview');
    
    // Create interactive chatbot preview HTML
    const previewHTML = `
        <div class="chatbot-preview">
            <div class="chat-header">
                <i class="fas fa-robot"></i>
                <span>${data.businessName} Assistant</span>
                ${data.isRealAI ? '<span class="ai-badge">🤖 AI Generated</span>' : ''}
            </div>
            <div class="chat-messages" id="previewMessages">
                ${data.conversation.map(msg => `
                    <div class="message ${msg.type}">
                        <p>${msg.message}</p>
                    </div>
                `).join('')}
            </div>
            <div class="chat-input">
                <input type="text" id="previewInput" placeholder="Type your message..." onkeypress="handlePreviewKeyPress(event)">
                <button onclick="sendPreviewMessage()">Send</button>
            </div>
        </div>
    `;
    
    chatbotPreview.innerHTML = previewHTML;
    
    // Store the business data for responses
    window.previewBusinessData = data;
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

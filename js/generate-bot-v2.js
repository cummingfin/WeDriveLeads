// Multi-step chatbot generator with conversational training
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

// Global variables
let currentStep = 1;
let businessData = {};
let trainingData = {};
let currentQuestionIndex = 0;

// Training questions based on business type
const trainingQuestions = {
    general: [
        {
            question: "What's the name of your business?",
            key: "businessName",
            type: "text"
        },
        {
            question: "What type of business do you run?",
            key: "businessType",
            type: "text"
        },
        {
            question: "What services do you offer? Please list your main services.",
            key: "services",
            type: "textarea"
        },
        {
            question: "What areas do you serve? (cities, regions, etc.)",
            key: "serviceAreas",
            type: "text"
        },
        {
            question: "What makes your business unique? What sets you apart from competitors?",
            key: "uniqueSellingPoints",
            type: "textarea"
        },
        {
            question: "What are your typical price ranges? (e.g., '£50-200 for small jobs, £500-2000 for larger projects')",
            key: "pricing",
            type: "text"
        },
        {
            question: "Do you offer any guarantees or warranties?",
            key: "guarantees",
            type: "text"
        },
        {
            question: "What are your business hours?",
            key: "businessHours",
            type: "text"
        },
        {
            question: "Do you offer emergency services? If yes, what's your emergency contact process?",
            key: "emergencyServices",
            type: "text"
        },
        {
            question: "What's your typical response time for customer inquiries?",
            key: "responseTime",
            type: "text"
        }
    ],
    roofer: [
        {
            question: "What roofing services do you specialize in? (repairs, installations, maintenance, etc.)",
            key: "specializedServices",
            type: "textarea"
        },
        {
            question: "What types of roofing materials do you work with?",
            key: "materials",
            type: "text"
        },
        {
            question: "Do you handle both residential and commercial roofing?",
            key: "projectTypes",
            type: "text"
        },
        {
            question: "What's your typical project timeline?",
            key: "projectTimeline",
            type: "text"
        },
        {
            question: "Do you provide free estimates?",
            key: "estimates",
            type: "text"
        }
    ],
    plumber: [
        {
            question: "What plumbing services do you offer? (repairs, installations, emergency, etc.)",
            key: "plumbingServices",
            type: "textarea"
        },
        {
            question: "Do you handle both residential and commercial plumbing?",
            key: "plumbingProjectTypes",
            type: "text"
        },
        {
            question: "What emergency plumbing services do you provide?",
            key: "emergencyPlumbing",
            type: "text"
        },
        {
            question: "Do you work with gas systems?",
            key: "gasSystems",
            type: "text"
        }
    ],
    electrician: [
        {
            question: "What electrical services do you provide?",
            key: "electricalServices",
            type: "textarea"
        },
        {
            question: "Are you certified for commercial electrical work?",
            key: "certifications",
            type: "text"
        },
        {
            question: "Do you handle emergency electrical repairs?",
            key: "emergencyElectrical",
            type: "text"
        },
        {
            question: "What safety standards do you follow?",
            key: "safetyStandards",
            type: "text"
        }
    ]
};

function initializeApp() {
    // Set up color picker
    setupColorPicker();
    
    // Set up live preview updates
    setupLivePreview();
    
    // Set up form validation
    setupFormValidation();
}

function setupColorPicker() {
    const colorOptions = document.querySelectorAll('.color-option');
    const previewChatbot = document.getElementById('previewChatbot');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Update preview with new color
            const color = this.dataset.color;
            updatePreviewColor(color);
        });
    });
}

function updatePreviewColor(color) {
    const previewChatbot = document.getElementById('previewChatbot');
    previewChatbot.style.setProperty('--chatbot-primary', color);
    
    // Update button colors
    const buttons = previewChatbot.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.background = color;
    });
}

function setupLivePreview() {
    const businessNameInput = document.getElementById('businessName');
    const chatbotNameInput = document.getElementById('chatbotName');
    const businessTypeSelect = document.getElementById('businessType');
    
    // Update preview name when business name changes
    businessNameInput.addEventListener('input', function() {
        const previewName = document.getElementById('previewName');
        const chatbotName = chatbotNameInput.value || this.value + ' Assistant';
        previewName.textContent = chatbotName;
    });
    
    // Update preview name when chatbot name changes
    chatbotNameInput.addEventListener('input', function() {
        const previewName = document.getElementById('previewName');
        previewName.textContent = this.value || businessNameInput.value + ' Assistant';
    });
    
    // Update preview when business type changes
    businessTypeSelect.addEventListener('change', function() {
        updatePreviewBasedOnBusinessType(this.value);
    });
}

function updatePreviewBasedOnBusinessType(businessType) {
    const previewMessages = document.querySelector('.preview-messages');
    let welcomeMessage = "Hello! I'm here to help you. How can I assist you today?";
    
    if (businessType) {
        switch(businessType) {
            case 'roofer':
                welcomeMessage = "Hello! I'm here to help with your roofing needs. How can I assist you today?";
                break;
            case 'plumber':
                welcomeMessage = "Hello! I'm here to help with your plumbing needs. How can I assist you today?";
                break;
            case 'electrician':
                welcomeMessage = "Hello! I'm here to help with your electrical needs. How can I assist you today?";
                break;
            case 'carpenter':
                welcomeMessage = "Hello! I'm here to help with your carpentry needs. How can I assist you today?";
                break;
            case 'painter':
                welcomeMessage = "Hello! I'm here to help with your painting needs. How can I assist you today?";
                break;
            case 'landscaper':
                welcomeMessage = "Hello! I'm here to help with your landscaping needs. How can I assist you today?";
                break;
            case 'builder':
                welcomeMessage = "Hello! I'm here to help with your building needs. How can I assist you today?";
                break;
        }
    }
    
    const botMessage = previewMessages.querySelector('.preview-message.bot p');
    if (botMessage) {
        botMessage.textContent = welcomeMessage;
    }
}

function setupFormValidation() {
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#e2e8f0';
            }
        });
    });
}

function nextStep() {
    // Validate current step
    if (currentStep === 1 && !validateStep1()) {
        return;
    }
    
    // Hide current step
    document.getElementById(`step${currentStep}Content`).classList.remove('active');
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep}`).classList.add('completed');
    
    // Show next step
    currentStep++;
    document.getElementById(`step${currentStep}Content`).classList.add('active');
    document.getElementById(`step${currentStep}`).classList.add('active');
    
    // If moving to step 2, collect data from step 1 and start training
    if (currentStep === 2) {
        collectStep1Data();
        startTraining();
    }
}

function validateStep1() {
    const businessName = document.getElementById('businessName').value.trim();
    const businessType = document.getElementById('businessType').value;
    
    if (!businessName) {
        alert('Please enter your business name');
        document.getElementById('businessName').focus();
        return false;
    }
    
    if (!businessType) {
        alert('Please select your business type');
        document.getElementById('businessType').focus();
        return false;
    }
    
    return true;
}

function collectStep1Data() {
    businessData = {
        businessName: document.getElementById('businessName').value.trim(),
        businessType: document.getElementById('businessType').value,
        chatbotName: document.getElementById('chatbotName').value.trim() || document.getElementById('businessName').value.trim() + ' Assistant',
        primaryColor: document.querySelector('.color-option.selected').dataset.color,
        tone: document.getElementById('chatbotTone').value
    };
}

function startTraining() {
    // Update training title with business name
    document.getElementById('trainingTitle').textContent = `${businessData.chatbotName} Training`;
    
    // Start with first question
    currentQuestionIndex = 0;
    askNextQuestion();
}

function askNextQuestion() {
    const questions = getQuestionsForBusinessType(businessData.businessType);
    
    if (currentQuestionIndex >= questions.length) {
        // Training complete
        completeTraining();
        return;
    }
    
    const question = questions[currentQuestionIndex];
    addTrainingMessage(question.question, 'bot');
}

function getQuestionsForBusinessType(businessType) {
    const generalQuestions = trainingQuestions.general;
    const specificQuestions = trainingQuestions[businessType] || [];
    return [...generalQuestions, ...specificQuestions];
}

function sendTrainingMessage() {
    const input = document.getElementById('trainingInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addTrainingMessage(message, 'user');
    input.value = '';
    
    if (window.testMode) {
        // In test mode, generate AI response
        setTimeout(() => {
            const aiResponse = generateTestResponse(message);
            addTrainingMessage(aiResponse, 'bot');
        }, 1000);
    } else {
        // In training mode, store the answer and ask next question
        const questions = getQuestionsForBusinessType(businessData.businessType);
        const currentQuestion = questions[currentQuestionIndex];
        trainingData[currentQuestion.key] = message;
        
        // Move to next question
        currentQuestionIndex++;
        
        // Ask next question after a short delay
        setTimeout(() => {
            askNextQuestion();
        }, 1000);
    }
}

function addTrainingMessage(text, sender) {
    const messagesDiv = document.getElementById('trainingMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleTrainingKeyPress(event) {
    if (event.key === 'Enter') {
        sendTrainingMessage();
    }
}

function completeTraining() {
    addTrainingMessage("Perfect! I've learned everything I need to know about your business. Now let me train your AI model with all this information...", 'bot');
    
    setTimeout(() => {
        addTrainingMessage("Training your AI model with OpenAI... This will make your chatbot much smarter and more natural!", 'bot');
        
        // Train the AI model with OpenAI
        trainAIModel();
    }, 2000);
}

async function trainAIModel() {
    try {
        // Show training status
        addTrainingMessage("🤖 Training in progress...", 'bot');
        
        // Prepare the training data
        const trainingPrompt = createTrainingPrompt();
        
        // Call our secure backend endpoint (not directly to OpenAI)
        const response = await fetch('/api/train-chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                businessName: businessData.businessName,
                businessType: businessData.businessType,
                tone: businessData.tone,
                goal: 'Generate qualified leads',
                description: `Professional ${businessData.businessType} business with detailed training data`,
                trainingData: trainingData
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.success) {
                // Store the trained model data
                window.trainedModelData = result;
                
                addTrainingMessage("🎉 Your AI model is trained and ready! Now I have everything I need - test me out!", 'bot');
                
                setTimeout(() => {
                    addTrainingMessage("Ask me anything about your business, services, pricing, or anything a customer might ask!", 'bot');
                    
                    // Switch to test mode with the trained model
                    window.testMode = true;
                    window.trainedModel = true;
                    
                    // Change the input placeholder to indicate test mode
                    const trainingInput = document.getElementById('trainingInput');
                    trainingInput.placeholder = "Ask me anything about your business...";
                    
                    // Add sample questions and exit button
                    setTimeout(() => {
                        addTrainingMessage("💡 **Try asking me:**\n• What services do you offer?\n• What are your prices?\n• Do you offer emergency services?\n• What areas do you serve?\n• What makes you different from competitors?", 'bot');
                        
                        // Add exit test mode button
                        const messagesDiv = document.getElementById('trainingMessages');
                        const exitDiv = document.createElement('div');
                        exitDiv.className = 'message bot';
                        exitDiv.innerHTML = `
                            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                                <p style="margin-bottom: 0.5rem;">Ready to get your embed code?</p>
                                <button onclick="exitTestMode()" style="background: #00ff88; color: #1a1a1a; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                                    ✅ I'm Happy - Get My Embed Code
                                </button>
                            </div>
                        `;
                        messagesDiv.appendChild(exitDiv);
                        messagesDiv.scrollTop = messagesDiv.scrollHeight;
                    }, 1000);
                }, 1000);
                
            } else {
                throw new Error(result.error || 'Training failed');
            }
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Training error:', error);
        
        // Check if it's a backend not available error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            addTrainingMessage("🔄 Backend not available yet. Using enhanced local training mode...", 'bot');
        } else {
            addTrainingMessage("❌ Training failed. Using enhanced local mode...", 'bot');
        }
        
        // Enhanced fallback mode with better responses
        setTimeout(() => {
            addTrainingMessage("Now I have everything I need - test me out!", 'bot');
            window.testMode = true;
            window.trainedModel = false;
            
            const trainingInput = document.getElementById('trainingInput');
            trainingInput.placeholder = "Ask me anything about your business...";
            
            setTimeout(() => {
                addTrainingMessage("💡 **Try asking me:**\n• What services do you offer?\n• What are your prices?\n• Do you offer emergency services?\n• What areas do you serve?\n• What makes you different from competitors?", 'bot');
                
                const messagesDiv = document.getElementById('trainingMessages');
                const exitDiv = document.createElement('div');
                exitDiv.className = 'message bot';
                exitDiv.innerHTML = `
                    <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                        <p style="margin-bottom: 0.5rem;">Ready to get your embed code?</p>
                        <button onclick="exitTestMode()" style="background: #00ff88; color: #1a1a1a; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                            ✅ I'm Happy - Get My Embed Code
                        </button>
                    </div>
                `;
                messagesDiv.appendChild(exitDiv);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
            }, 1000);
        }, 1000);
    }
}

function createTrainingPrompt() {
    const services = trainingData.services || 'professional services';
    const serviceAreas = trainingData.serviceAreas || 'your area';
    const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service';
    const pricing = trainingData.pricing || 'competitive pricing';
    const guarantees = trainingData.guarantees || 'satisfaction guarantee';
    const businessHours = trainingData.businessHours || 'Monday to Friday';
    const emergencyServices = trainingData.emergencyServices || 'emergency services available';
    const responseTime = trainingData.responseTime || 'within 24 hours';
    
    return `Create a comprehensive training prompt for an AI chatbot representing ${businessData.businessName}, a ${businessData.businessType} business.

Business Details:
- Name: ${businessData.businessName}
- Type: ${businessData.businessType}
- Services: ${services}
- Service Areas: ${serviceAreas}
- Unique Selling Points: ${uniquePoints}
- Pricing: ${pricing}
- Guarantees: ${guarantees}
- Business Hours: ${businessHours}
- Emergency Services: ${emergencyServices}
- Response Time: ${responseTime}

Additional Training Data:
${Object.entries(trainingData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Instructions:
Train the AI to respond naturally and professionally to customer inquiries about this business. The AI should:
1. Sound natural and conversational, not robotic
2. Provide detailed, helpful responses based on the training data
3. Ask follow-up questions when appropriate
4. Maintain a ${businessData.tone} tone
5. Focus on lead generation and customer service
6. Use the specific business information provided, not generic responses

The AI should be able to handle questions about services, pricing, areas served, guarantees, emergency services, business hours, and what makes this business unique.`;
}

function generateTestResponse(userMessage) {
    // If we have a trained model, use it
    if (window.trainedModel && window.trainedModelData) {
        return generateTrainedResponse(userMessage);
    }
    
    // Fallback to basic responses
    return generateBasicResponse(userMessage);
}

function generateTrainedResponse(userMessage) {
    // This would ideally call the trained model
    // For now, we'll use the training data more intelligently
    const lowerMessage = userMessage.toLowerCase();
    
    // Create more natural, detailed responses based on training data
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
        const services = trainingData.services || 'professional services';
        const serviceAreas = trainingData.serviceAreas || 'your area';
        const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service';
        
        return `At ${businessData.businessName}, we specialize in ${services}. We serve ${serviceAreas} and what really sets us apart is ${uniquePoints}. We're committed to providing exceptional service and ensuring every customer is completely satisfied with our work.`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('how much')) {
        const pricing = trainingData.pricing || 'competitive pricing';
        const guarantees = trainingData.guarantees || 'satisfaction guarantee';
        
        return `We offer ${pricing} for our services. We believe in transparent pricing with no hidden costs. Plus, we provide ${guarantees} so you can have complete confidence in our work. I'd be happy to provide you with a detailed quote based on your specific needs. Can you tell me more about your project?`;
    }
    
    if (lowerMessage.includes('guarantee') || lowerMessage.includes('warranty')) {
        const guarantees = trainingData.guarantees || 'satisfaction guarantee';
        
        return `We provide ${guarantees} on all our work. Your satisfaction is our top priority, and we stand behind the quality of our services. We want you to feel completely confident choosing ${businessData.businessName} for your ${businessData.businessType} needs.`;
    }
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('available')) {
        const businessHours = trainingData.businessHours || 'Monday to Friday';
        const emergencyServices = trainingData.emergencyServices || 'emergency services available';
        const responseTime = trainingData.responseTime || 'within 24 hours';
        
        return `We're available ${businessHours} for regular appointments. ${emergencyServices} and we respond to inquiries ${responseTime}. We understand that ${businessData.businessType} issues can be urgent, so we're committed to being there when you need us most.`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
        const emergencyServices = trainingData.emergencyServices || 'emergency services available';
        
        return `${emergencyServices}. We know that ${businessData.businessType} emergencies can't wait, so we're available 24/7 for urgent situations. Please provide your contact information and describe the issue, and we'll get back to you immediately.`;
    }
    
    if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
        const serviceAreas = trainingData.serviceAreas || 'your area';
        
        return `We serve ${serviceAreas}. If you're in our service area, we'd be happy to help with your project! We're committed to providing reliable ${businessData.businessType} services to our local community.`;
    }
    
    if (lowerMessage.includes('different') || lowerMessage.includes('unique') || lowerMessage.includes('special') || lowerMessage.includes('why choose')) {
        const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service';
        const guarantees = trainingData.guarantees || 'satisfaction guarantee';
        
        return `What sets ${businessData.businessName} apart is ${uniquePoints}. We're committed to ${guarantees} and providing exceptional value. We believe in building long-term relationships with our customers through trust, quality, and reliability.`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
        const responseTime = trainingData.responseTime || 'within 24 hours';
        
        return `Thank you for your interest in ${businessData.businessName}! I'll make sure our team gets back to you ${responseTime}. You can also leave your contact information and I'll have someone reach out to you personally. We're excited to help with your ${businessData.businessType} needs!`;
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('years') || lowerMessage.includes('qualified') || lowerMessage.includes('certified')) {
        const services = trainingData.services || 'professional services';
        
        return `Our team at ${businessData.businessName} is highly qualified and experienced in ${services}. We maintain the highest standards of quality and safety in all our work. We're committed to ongoing training and staying up-to-date with the latest industry standards and best practices.`;
    }
    
    if (lowerMessage.includes('estimate') || lowerMessage.includes('quote') || lowerMessage.includes('assessment')) {
        return `I'd be happy to help you get an estimate! Can you provide some details about your project? This will help me give you the most accurate quote possible. We believe in transparent pricing and want you to feel confident about your investment.`;
    }
    
    // Default response for questions not covered
    return `Thank you for your question! I'm here to help with any information about ${businessData.businessName}. Is there anything specific about our ${trainingData.services || 'services'} that you'd like to know more about? I'm happy to provide detailed answers to help you make the best decision for your needs.`;
}

function generateBasicResponse(userMessage) {
    // Basic fallback responses (the old system)
    const lowerMessage = userMessage.toLowerCase();
    const services = trainingData.services || 'professional services';
    const serviceAreas = trainingData.serviceAreas || 'your area';
    const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service';
    const pricing = trainingData.pricing || 'competitive pricing';
    const guarantees = trainingData.guarantees || 'satisfaction guarantee';
    const businessHours = trainingData.businessHours || 'Monday to Friday';
    const emergencyServices = trainingData.emergencyServices || 'emergency services available';
    const responseTime = trainingData.responseTime || 'within 24 hours';
    
    // Generate contextual responses based on the user's question
    if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
        return `At ${businessData.businessName}, we offer ${services} in ${serviceAreas}. We're known for ${uniquePoints} and provide ${guarantees} on all our work.`;
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote') || lowerMessage.includes('how much')) {
        return `We offer ${pricing} for our services. I'd be happy to provide you with a detailed quote based on your specific needs. Can you tell me more about your project?`;
    }
    
    if (lowerMessage.includes('guarantee') || lowerMessage.includes('warranty')) {
        return `We provide ${guarantees} on all our work. Your satisfaction is our top priority, and we stand behind the quality of our services.`;
    }
    
    if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('available')) {
        return `We're available ${businessHours}. ${emergencyServices} and we respond to inquiries ${responseTime}.`;
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent') || lowerMessage.includes('asap')) {
        return `${emergencyServices}. Please provide your contact information and describe the issue, and we'll get back to you immediately.`;
    }
    
    if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('location') || lowerMessage.includes('where')) {
        return `We serve ${serviceAreas}. If you're in your service area, we'd be happy to help with your project!`;
    }
    
    if (lowerMessage.includes('different') || lowerMessage.includes('unique') || lowerMessage.includes('special') || lowerMessage.includes('why choose')) {
        return `What sets ${businessData.businessName} apart is ${uniquePoints}. We're committed to ${guarantees} and providing ${pricing} for quality work.`;
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('call')) {
        return `Thank you for your interest! I'll make sure the ${businessData.businessName} team gets back to you ${responseTime}. You can also leave your contact information and I'll have someone reach out to you.`;
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('years') || lowerMessage.includes('qualified') || lowerMessage.includes('certified')) {
        return `Our team at ${businessData.businessName} is highly qualified and experienced in ${services}. We maintain the highest standards of quality and safety in all our work.`;
    }
    
    if (lowerMessage.includes('estimate') || lowerMessage.includes('quote') || lowerMessage.includes('assessment')) {
        return `I'd be happy to help you get an estimate! Can you provide some details about your project? This will help me give you the most accurate quote possible.`;
    }
    
    // Default response for questions not covered
    return `Thank you for your question! I'm here to help with any information about ${businessData.businessName}. Is there anything specific about our ${services} that you'd like to know more about?`;
}

function exitTestMode() {
    addTrainingMessage("Perfect! I'm glad you're happy with your trained AI. Let me generate your embed code now.", 'user');
    
    setTimeout(() => {
        addTrainingMessage("Generating your personalized embed code with all your business knowledge...", 'bot');
        
        setTimeout(() => {
            // Move to step 3
            nextStep();
        }, 2000);
    }, 1000);
}

function closeTraining() {
    document.getElementById('trainingOverlay').style.display = 'none';
    document.getElementById('trainingChatbot').style.display = 'none';
}

function generateFinalChatbot() {
    // Combine business data with training data
    const finalData = { ...businessData, ...trainingData };
    
    // Generate personalized chatbot
    const chatbotHTML = generatePersonalizedChatbot(finalData);
    
    // Display final result
    document.getElementById('finalChatbotPreview').innerHTML = chatbotHTML;
    
    // Move to step 3
    nextStep();
}

function generatePersonalizedChatbot(data) {
    const services = data.services || 'professional services';
    const serviceAreas = data.serviceAreas || 'your area';
    const uniquePoints = data.uniqueSellingPoints || 'quality work and excellent customer service';
    const pricing = data.pricing || 'competitive pricing';
    const guarantees = data.guarantees || 'satisfaction guarantee';
    const businessHours = data.businessHours || 'Monday to Friday';
    const emergencyServices = data.emergencyServices || 'emergency services available';
    const responseTime = data.responseTime || 'within 24 hours';
    
    return `
        <div class="chatbot-preview" style="max-width: 400px; margin: 0 auto;">
            <div class="chat-header" style="background: ${data.primaryColor}; color: #1a1a1a; padding: 1rem; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
                <i class="fas fa-robot"></i>
                <span>${data.chatbotName}</span>
            </div>
            <div class="chat-messages" style="padding: 1rem; height: 300px; overflow-y: auto; background: #f8fafc;">
                <div class="message bot" style="margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 12px; max-width: 80%; background: #e2e8f0; color: #1a1a1a; margin-right: auto;">
                    <p>Hello! I'm ${data.chatbotName}, your AI assistant. I'm here to help with your ${data.businessType} needs. How can I assist you today?</p>
                </div>
                <div class="message user" style="margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 12px; max-width: 80%; background: ${data.primaryColor}; color: #1a1a1a; margin-left: auto;">
                    <p>Tell me about your services</p>
                </div>
                <div class="message bot" style="margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 12px; max-width: 80%; background: #e2e8f0; color: #1a1a1a; margin-right: auto;">
                    <p>${data.businessName} offers ${services} in ${serviceAreas}. We're known for ${uniquePoints} and offer ${pricing}. We provide ${guarantees} and are available ${businessHours}. ${emergencyServices} and we respond to inquiries ${responseTime}.</p>
                </div>
            </div>
            <div class="chat-input" style="padding: 1rem; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem;">
                <input type="text" placeholder="Type your message..." style="flex: 1; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;">
                <button style="background: ${data.primaryColor}; color: #1a1a1a; border: none; padding: 0.75rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Send</button>
            </div>
        </div>
    `;
}

// Copy final embed code
document.addEventListener('DOMContentLoaded', function() {
    const copyFinalCodeBtn = document.getElementById('copyFinalCode');
    if (copyFinalCodeBtn) {
        copyFinalCodeBtn.addEventListener('click', function() {
            const embedCode = generateEmbedCode(businessData, trainingData);
            
            navigator.clipboard.writeText(embedCode).then(function() {
                const originalText = copyFinalCodeBtn.innerHTML;
                copyFinalCodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyFinalCodeBtn.style.background = '#00ff88';
                copyFinalCodeBtn.style.color = '#1a1a1a';
                
                setTimeout(() => {
                    copyFinalCodeBtn.innerHTML = originalText;
                    copyFinalCodeBtn.style.background = '#f1f5f9';
                    copyFinalCodeBtn.style.color = '#1a1a1a';
                }, 2000);
            }).catch(function(err) {
                console.error('Could not copy text: ', err);
                alert('Could not copy code. Please copy manually.');
            });
        });
    }
});

function generateEmbedCode(businessData, trainingData) {
    const services = trainingData.services || 'professional services';
    const serviceAreas = trainingData.serviceAreas || 'your area';
    const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service';
    const pricing = trainingData.pricing || 'competitive pricing';
    const guarantees = trainingData.guarantees || 'satisfaction guarantee';
    const businessHours = trainingData.businessHours || 'Monday to Friday';
    const emergencyServices = trainingData.emergencyServices || 'emergency services available';
    const responseTime = trainingData.responseTime || 'within 24 hours';
    
    return `<div id="wedriveleads-chatbot" data-business="${businessData.businessName}" data-type="${businessData.businessType}">
  <div class="chatbot-header" style="background: ${businessData.primaryColor}; color: #1a1a1a; padding: 1rem; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 0.5rem; font-weight: 600;">
    <i class="fas fa-robot"></i>
    <h3 style="margin: 0;">${businessData.chatbotName}</h3>
  </div>
  <div class="chatbot-messages" id="chatbot-messages" style="padding: 1rem; height: 300px; overflow-y: auto; background: #f8fafc;">
    <div class="message bot-message" style="margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 12px; max-width: 80%; background: #e2e8f0; color: #1a1a1a; margin-right: auto;">
      <p>Hello! I'm ${businessData.chatbotName}, your AI assistant. I'm here to help with your ${businessData.businessType} needs. How can I assist you today?</p>
    </div>
  </div>
  <div class="chatbot-input" style="padding: 1rem; border-top: 1px solid #e2e8f0; display: flex; gap: 0.5rem;">
    <input type="text" id="chatbot-input" placeholder="Type your message..." style="flex: 1; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;">
    <button onclick="sendMessage()" style="background: ${businessData.primaryColor}; color: #1a1a1a; border: none; padding: 0.75rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">Send</button>
  </div>
</div>

<script>
// Personalized chatbot functionality
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (message) {
    addMessage(message, 'user');
    // Generate personalized response based on training data
    setTimeout(() => {
      const response = generatePersonalizedResponse(message, ${JSON.stringify(trainingData)});
      addMessage(response, 'bot');
    }, 1000);
    input.value = '';
  }
}

function generatePersonalizedResponse(userMessage, trainingData) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
    return "${businessData.businessName} offers ${services} in ${serviceAreas}. We're known for ${uniquePoints} and offer ${pricing}.";
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
    return "We offer ${pricing} for our services. I'd be happy to provide you with a detailed quote. Can you tell me more about your project?";
  }
  
  if (lowerMessage.includes('guarantee') || lowerMessage.includes('warranty')) {
    return "We provide ${guarantees} on all our work. Your satisfaction is our top priority.";
  }
  
  if (lowerMessage.includes('hour') || lowerMessage.includes('time') || lowerMessage.includes('when')) {
    return "We're available ${businessHours}. ${emergencyServices} and we respond to inquiries ${responseTime}.";
  }
  
  if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
    return "${emergencyServices}. Please provide your contact information and describe the issue, and we'll get back to you immediately.";
  }
  
  return "Thank you for your message! I'll make sure the ${businessData.businessName} team gets back to you ${responseTime}.";
}

function addMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = \`message \${sender}-message\`;
  messageDiv.style.cssText = 'margin-bottom: 1rem; padding: 0.75rem 1rem; border-radius: 12px; max-width: 80%; font-size: 0.9rem;';
  
  if (sender === 'user') {
    messageDiv.style.background = '${businessData.primaryColor}';
    messageDiv.style.color = '#1a1a1a';
    messageDiv.style.marginLeft = 'auto';
  } else {
    messageDiv.style.background = '#e2e8f0';
    messageDiv.style.color = '#1a1a1a';
    messageDiv.style.marginRight = 'auto';
  }
  
  messageDiv.innerHTML = \`<p>\${text}</p>\`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}
</script>`;
}

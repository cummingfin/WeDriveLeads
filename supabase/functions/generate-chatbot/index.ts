import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, businessName, businessType, tone, goal, description, trainingData } = await req.json()

    if (!businessName || !businessType) {
      throw new Error('Missing required fields: businessName, businessType')
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create a comprehensive training prompt if trainingData is provided
    let aiPrompt = prompt
    if (trainingData && Object.keys(trainingData).length > 0) {
      aiPrompt = createComprehensivePrompt(businessName, businessType, tone, trainingData)
    } else {
      // Fallback to basic prompt
      aiPrompt = `Create a professional chatbot introduction for a ${businessType} business called "${businessName}".

Business Details:
- Type: ${businessType}
- Tone: ${tone || 'Professional and friendly'}
- Goal: ${goal || 'Generate qualified leads'}
- Description: ${description || 'Professional service business'}

Requirements:
- Keep it under 100 words
- Make it engaging and professional
- Include a clear call-to-action
- Match the specified tone
- Focus on lead generation

Format the response as a natural, conversational introduction that the chatbot would use to greet visitors.`
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional business consultant specializing in creating engaging, natural-sounding chatbot responses for tradespeople and service businesses. Your responses should sound human, not robotic, and should be based on the specific business information provided.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openaiData = await openaiResponse.json()
    const chatbotIntro = openaiData.choices[0]?.message?.content || 'Unable to generate chatbot introduction.'

    // Generate intelligent sample responses based on training data
    const sampleResponses = generateIntelligentResponses(businessType, tone, trainingData)

    const response = {
      success: true,
      chatbotIntro,
      sampleResponses,
      embedCode: generateEmbedCode(businessName, businessType, trainingData),
      usage: {
        tokens: openaiData.usage?.total_tokens || 0,
        cost: calculateCost(openaiData.usage?.total_tokens || 0)
      },
      trainingData: trainingData || {}
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error:', error.message)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

function createComprehensivePrompt(businessName: string, businessType: string, tone: string, trainingData: any): string {
  const services = trainingData.services || 'professional services'
  const serviceAreas = trainingData.serviceAreas || 'your area'
  const uniquePoints = trainingData.uniqueSellingPoints || 'quality work and excellent customer service'
  const pricing = trainingData.pricing || 'competitive pricing'
  const guarantees = trainingData.guarantees || 'satisfaction guarantee'
  const businessHours = trainingData.businessHours || 'Monday to Friday'
  const emergencyServices = trainingData.emergencyServices || 'emergency services available'
  const responseTime = trainingData.responseTime || 'within 24 hours'

  return `Create a comprehensive, natural-sounding AI chatbot for ${businessName}, a ${businessType} business.

Business Details:
- Name: ${businessName}
- Type: ${businessType}
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
Create an AI chatbot that responds naturally and professionally to customer inquiries. The AI should:

1. Sound completely human and conversational, not robotic or templated
2. Provide detailed, helpful responses based on the specific business information
3. Ask follow-up questions when appropriate to generate leads
4. Maintain a ${tone} tone throughout all interactions
5. Focus on lead generation and excellent customer service
6. Use the exact business information provided, not generic responses
7. Sound like a knowledgeable employee who really knows this business

The AI should be able to handle questions about:
- Services offered and specializations
- Pricing and quotes
- Service areas and coverage
- Guarantees and warranties
- Business hours and availability
- Emergency services and response times
- What makes this business unique
- Contact information and next steps

Make the responses sound like they're coming from someone who actually works at ${businessName} and knows the business inside out.`
}

function generateIntelligentResponses(businessType: string, tone: string, trainingData: any): string[] {
  if (!trainingData || Object.keys(trainingData).length === 0) {
    // Fallback to basic responses
    return generateSampleResponses(businessType, tone)
  }

  // Generate intelligent responses based on training data
  const responses = []
  
  if (trainingData.services) {
    responses.push(`I can help you with ${trainingData.services}. What specific service do you need?`)
  }
  
  if (trainingData.serviceAreas) {
    responses.push(`We serve ${trainingData.serviceAreas}. Are you in our service area?`)
  }
  
  if (trainingData.pricing) {
    responses.push(`Our pricing is ${trainingData.pricing}. I'd be happy to provide you with a detailed quote.`)
  }
  
  if (trainingData.emergencyServices) {
    responses.push(`${trainingData.emergencyServices}. What's the issue you're experiencing?`)
  }
  
  if (trainingData.uniqueSellingPoints) {
    responses.push(`What sets us apart is ${trainingData.uniqueSellingPoints}. How can I help you today?`)
  }

  // Fill remaining slots with basic responses if needed
  while (responses.length < 3) {
    responses.push(generateSampleResponses(businessType, tone)[responses.length] || 
      `I can help you with your ${businessType} needs. What do you need assistance with?`)
  }

  return responses.slice(0, 3)
}

function generateSampleResponses(businessType: string, tone: string): string[] {
  const responses = {
    roofing: [
      "I can help you get a free roof inspection and quote within 24 hours. What's your address?",
      "Are you looking for emergency repairs or a full roof replacement?",
      "I can schedule a qualified roofer to visit your property this week. When works best for you?"
    ],
    plumbing: [
      "I can connect you with a licensed plumber in your area. What's the issue you're experiencing?",
      "Emergency plumbing service available 24/7. What's your postcode?",
      "I can get you a quote for your plumbing work. Can you describe the job?"
    ],
    electrical: [
      "I can help you find a certified electrician. What electrical work do you need?",
      "Emergency electrical service available. What's your location?",
      "I can get you multiple quotes for your electrical project. What's the scope of work?"
    ],
    general: [
      "I can help you find qualified tradespeople in your area. What service do you need?",
      "I can get you free quotes from verified professionals. What's your postcode?",
      "I can schedule a site visit and quote. When would you like someone to call?"
    ]
  }

  let category = 'general'
  if (businessType.toLowerCase().includes('roof')) category = 'roofing'
  if (businessType.toLowerCase().includes('plumb')) category = 'plumbing'
  if (businessType.toLowerCase().includes('electr')) category = 'electrical'

  return responses[category] || responses.general
}

function generateEmbedCode(businessName: string, businessType: string, trainingData?: any): string {
  const services = trainingData?.services || 'professional services'
  const serviceAreas = trainingData?.serviceAreas || 'your area'
  const uniquePoints = trainingData?.uniqueSellingPoints || 'quality work and excellent customer service'
  
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
// Intelligent chatbot functionality based on training data
const businessData = ${JSON.stringify({
  businessName,
  businessType,
  services,
  serviceAreas,
  uniquePoints,
  ...trainingData
})}

function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (message) {
    addMessage(message, 'user');
    // Generate intelligent response based on training data
    setTimeout(() => {
      const response = generateIntelligentResponse(message);
      addMessage(response, 'bot');
    }, 1000);
    input.value = '';
  }
}

function generateIntelligentResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('service') || lowerMessage.includes('offer') || lowerMessage.includes('do')) {
    return \`At \${businessData.businessName}, we specialize in \${businessData.services}. We serve \${businessData.serviceAreas} and what really sets us apart is \${businessData.uniquePoints}. We're committed to providing exceptional service and ensuring every customer is completely satisfied with our work.\`;
  }
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
    return \`We offer competitive pricing for our services. I'd be happy to provide you with a detailed quote based on your specific needs. Can you tell me more about your project?\`;
  }
  
  if (lowerMessage.includes('area') || lowerMessage.includes('serve') || lowerMessage.includes('where')) {
    return \`We serve \${businessData.serviceAreas}. If you're in our service area, we'd be happy to help with your project! We're committed to providing reliable \${businessData.businessType} services to our local community.\`;
  }
  
  return \`Thank you for your message! I'll make sure the \${businessData.businessName} team gets back to you soon. Is there anything specific about our \${businessData.services} that you'd like to know more about?\`;
}

function addMessage(text, sender) {
  const messages = document.getElementById('chatbot-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = \`message \${sender}-message\`;
  messageDiv.innerHTML = \`<p>\${text}</p>\`;
  messages.appendChild(messageDiv);
  messages.scrollTop = messages.scrollHeight;
}
</script>`
}

function calculateCost(tokens: number): number {
  const costUSD = (tokens / 1000) * 0.002
  const costGBP = costUSD * 0.8
  return Math.round(costGBP * 100)
}

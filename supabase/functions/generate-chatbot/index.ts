import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { prompt, businessName, businessType, tone, goal, description } = await req.json()

    // Validate required fields
    if (!prompt || !businessName || !businessType) {
      throw new Error('Missing required fields: prompt, businessName, businessType')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Create the AI prompt
    const aiPrompt = `Create a professional chatbot introduction for a ${businessType} business called "${businessName}".

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

    // Call OpenAI API
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
            content: 'You are a professional business consultant specializing in creating engaging chatbot introductions for tradespeople and service businesses.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openaiData = await openaiResponse.json()
    const chatbotIntro = openaiData.choices[0]?.message?.content || 'Unable to generate chatbot introduction.'

    // Generate sample responses
    const sampleResponses = generateSampleResponses(businessType, tone)

    // Create the response
    const response = {
      success: true,
      chatbotIntro,
      sampleResponses,
      embedCode: generateEmbedCode(businessName, businessType),
      usage: {
        tokens: openaiData.usage?.total_tokens || 0,
        cost: calculateCost(openaiData.usage?.total_tokens || 0)
      }
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

  // Determine business category
  let category = 'general'
  if (businessType.toLowerCase().includes('roof')) category = 'roofing'
  if (businessType.toLowerCase().includes('plumb')) category = 'plumbing'
  if (businessType.toLowerCase().includes('electr')) category = 'electrical'

  return responses[category] || responses.general
}

function generateEmbedCode(businessName: string, businessType: string): string {
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
// Chatbot functionality will be loaded here
// This is a placeholder for the actual chatbot implementation
function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  if (message) {
    // Add user message
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
</script>`
}

function calculateCost(tokens: number): number {
  // GPT-3.5-turbo pricing: $0.002 per 1K tokens
  // Convert to pence for UK pricing
  const costUSD = (tokens / 1000) * 0.002
  const costGBP = costUSD * 0.8 // Approximate USD to GBP conversion
  return Math.round(costGBP * 100) // Convert to pence
}

// Supabase Client Integration
// Handles authentication and secure API calls

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize Supabase client
const supabaseUrl = window.envLoader.get('supabase_url')
const supabaseAnonKey = window.envLoader.get('supabase_anon_key')

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration missing. Please check your .env file.')
} else {
    window.supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Authentication functions
class AuthManager {
    constructor() {
        this.user = null
        this.session = null
        this.setupAuthListener()
    }

    setupAuthListener() {
        // Listen for auth changes
        window.supabase.auth.onAuthStateChange((event, session) => {
            this.session = session
            this.user = session?.user || null
            
            if (event === 'SIGNED_IN') {
                this.onSignIn(session)
            } else if (event === 'SIGNED_OUT') {
                this.onSignOut()
            }
            
            // Update UI
            this.updateAuthUI()
        })
    }

    async signUp(email, password, fullName) {
        try {
            const { data, error } = await window.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName
                    }
                }
            })

            if (error) throw error

            return { success: true, data }
        } catch (error) {
            console.error('Sign up error:', error)
            return { success: false, error: error.message }
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await window.supabase.auth.signInWithPassword({
                email,
                password
            })

            if (error) throw error

            return { success: true, data }
        } catch (error) {
            console.error('Sign in error:', error)
            return { success: false, error: error.message }
        }
    }

    async signOut() {
        try {
            const { error } = await window.supabase.auth.signOut()
            if (error) throw error
            return { success: true }
        } catch (error) {
            console.error('Sign out error:', error)
            return { success: false, error: error.message }
        }
    }

    async resetPassword(email) {
        try {
            const { error } = await window.supabase.auth.resetPasswordForEmail(email)
            if (error) throw error
            return { success: true }
        } catch (error) {
            console.error('Password reset error:', error)
            return { success: false, error: error.message }
        }
    }

    onSignIn(session) {
        console.log('User signed in:', session.user.email)
        // Store user info in localStorage for persistence
        localStorage.setItem('wedriveleads_user', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name
        }))
    }

    onSignOut() {
        console.log('User signed out')
        // Clear user info
        localStorage.removeItem('wedriveleads_user')
        this.user = null
        this.session = null
    }

    updateAuthUI() {
        // Update navigation and UI elements based on auth state
        const authElements = document.querySelectorAll('[data-auth]')
        const noAuthElements = document.querySelectorAll('[data-no-auth]')
        
        if (this.user) {
            // User is signed in
            authElements.forEach(el => el.style.display = 'block')
            noAuthElements.forEach(el => el.style.display = 'none')
            
            // Update user info display
            const userInfoElements = document.querySelectorAll('[data-user-info]')
            userInfoElements.forEach(el => {
                if (el.dataset.userInfo === 'email') {
                    el.textContent = this.user.email
                } else if (el.dataset.userInfo === 'name') {
                    el.textContent = this.user.user_metadata?.full_name || 'User'
                }
            })
        } else {
            // User is signed out
            authElements.forEach(el => el.style.display = 'none')
            noAuthElements.forEach(el => el.style.display = 'block')
        }
    }

    isAuthenticated() {
        return !!this.user
    }

    getCurrentUser() {
        return this.user
    }

    getCurrentSession() {
        return this.session
    }
}

// Chatbot management functions
class ChatbotManager {
    constructor() {
        this.supabase = window.supabase
    }

    async generateChatbot(botData) {
        try {
            // Call the Supabase Edge Function
            const { data, error } = await this.supabase.functions.invoke('generate-chatbot', {
                body: {
                    prompt: `Generate a chatbot for ${botData.businessName}`,
                    businessName: botData.businessName,
                    businessType: botData.businessType,
                    tone: botData.tone,
                    goal: botData.goal,
                    description: botData.description
                }
            })

            if (error) throw error

            // Save chatbot to database
            const savedBot = await this.saveChatbot(botData, data)
            
            return { success: true, data: data, savedBot }
        } catch (error) {
            console.error('Chatbot generation error:', error)
            return { success: false, error: error.message }
        }
    }

    async saveChatbot(botData, aiResponse) {
        try {
            const { data, error } = await this.supabase
                .from('chatbots')
                .insert({
                    user_id: window.authManager.getCurrentUser().id,
                    name: botData.businessName,
                    business_type: botData.businessType,
                    tone: botData.tone,
                    goal: botData.goal,
                    description: botData.description,
                    embed_code: aiResponse.embedCode
                })
                .select()
                .single()

            if (error) throw error

            return data
        } catch (error) {
            console.error('Save chatbot error:', error)
            throw error
        }
    }

    async getUserChatbots() {
        try {
            const { data, error } = await this.supabase
                .from('chatbots')
                .select('*')
                .eq('user_id', window.authManager.getCurrentUser().id)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data
        } catch (error) {
            console.error('Get chatbots error:', error)
            return []
        }
    }

    async deleteChatbot(botId) {
        try {
            const { error } = await this.supabase
                .from('chatbots')
                .delete()
                .eq('id', botId)
                .eq('user_id', window.authManager.getCurrentUser().id)

            if (error) throw error

            return { success: true }
        } catch (error) {
            console.error('Delete chatbot error:', error)
            return { success: false, error: error.message }
        }
    }
}

// Lead management functions
class LeadManager {
    constructor() {
        this.supabase = window.supabase
    }

    async saveLead(chatbotId, leadData) {
        try {
            const { data, error } = await this.supabase
                .from('leads')
                .insert({
                    chatbot_id: chatbotId,
                    user_id: window.authManager.getCurrentUser().id,
                    lead_data: leadData,
                    source: 'chatbot'
                })
                .select()
                .single()

            if (error) throw error

            return data
        } catch (error) {
            console.error('Save lead error:', error)
            throw error
        }
    }

    async getUserLeads() {
        try {
            const { data, error } = await this.supabase
                .from('leads')
                .select(`
                    *,
                    chatbots (
                        name,
                        business_type
                    )
                `)
                .eq('user_id', window.authManager.getCurrentUser().id)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data
        } catch (error) {
            console.error('Get leads error:', error)
            return []
        }
    }

    async updateLeadStatus(leadId, status) {
        try {
            const { error } = await this.supabase
                .from('leads')
                .update({ status })
                .eq('id', leadId)
                .eq('user_id', window.authManager.getCurrentUser().id)

            if (error) throw error

            return { success: true }
        } catch (error) {
            console.error('Update lead error:', error)
            return { success: false, error: error.message }
        }
    }
}

// Initialize managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for environment loader
    if (window.envLoader && window.envLoader.loaded && window.supabase) {
        // Initialize authentication manager
        window.authManager = new AuthManager()
        
        // Initialize chatbot manager
        window.chatbotManager = new ChatbotManager()
        
        // Initialize lead manager
        window.leadManager = new LeadManager()
        
        console.log('Supabase managers initialized')
    } else {
        console.log('Waiting for environment loader...')
        // Check again in a moment
        setTimeout(() => {
            if (window.envLoader && window.envLoader.loaded && window.supabase) {
                window.authManager = new AuthManager()
                window.chatbotManager = new ChatbotManager()
                window.leadManager = new LeadManager()
                console.log('Supabase managers initialized (delayed)')
            }
        }, 1000)
    }
})

// Export for use in other modules
window.SupabaseClient = {
    AuthManager,
    ChatbotManager,
    LeadManager
}

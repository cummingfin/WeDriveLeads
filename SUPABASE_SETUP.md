# 🚀 WeDriveLeads Supabase Setup Guide

## 📋 **Prerequisites**
- ✅ Supabase free account created
- ✅ Project keys in your `.env` file
- ✅ OpenAI API key ready

## 🗄️ **Step 1: Set Up Database**

1. **Go to your Supabase Dashboard**
   - Navigate to [supabase.com](https://supabase.com)
   - Sign in and select your WeDriveLeads project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Database Setup**
   - Copy the contents of `supabase-setup.sql`
   - Paste into the SQL Editor
   - Click "Run" to execute

4. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see these tables:
     - `profiles`
     - `chatbots`
     - `leads`
     - `payments`
     - `api_usage`

## ⚡ **Step 2: Deploy Edge Function**

1. **Install Supabase CLI** (if you haven't):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link Your Project**:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   (Find your project ref in Project Settings → API)

4. **Deploy the Function**:
   ```bash
   supabase functions deploy generate-chatbot
   ```

5. **Set Environment Variables**:
   ```bash
   supabase secrets set OPENAI_API_KEY=your_openai_key_here
   ```

## 🔧 **Step 3: Test the Setup**

1. **Test Authentication**:
   - Go to your website
   - Try to sign up/sign in
   - Check Supabase Dashboard → Authentication → Users

2. **Test Chatbot Generation**:
   - Fill out the chatbot form
   - Submit and check the response
   - Verify data is saved in the `chatbots` table

3. **Test Lead Capture**:
   - Use the generated chatbot
   - Submit a test lead
   - Check the `leads` table

## 🎯 **Step 4: Revenue Setup**

1. **Create Stripe Account** (when ready):
   - Sign up at [stripe.com](https://stripe.com)
   - Get your publishable and secret keys

2. **Update Environment Variables**:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

3. **Deploy Payment Function**:
   ```bash
   supabase functions deploy process-payment
   ```

## 🔒 **Security Features**

- ✅ **Row Level Security (RLS)** enabled on all tables
- ✅ **User isolation** - users can only see their own data
- ✅ **API key protection** - keys stored securely in Supabase
- ✅ **Input validation** - all inputs sanitized
- ✅ **Rate limiting** - built into Supabase Edge Functions

## 📊 **Monitoring & Analytics**

1. **Database Usage**:
   - Supabase Dashboard → Database → Logs
   - Monitor query performance

2. **Function Logs**:
   - Supabase Dashboard → Edge Functions → Logs
   - Track API calls and errors

3. **Authentication**:
   - Supabase Dashboard → Authentication → Users
   - Monitor sign-ups and logins

## 🚨 **Troubleshooting**

### **Common Issues**

1. **"Function not found"**
   - Ensure Edge Function is deployed
   - Check function name matches exactly

2. **"Permission denied"**
   - Verify RLS policies are active
   - Check user authentication status

3. **"OpenAI API error"**
   - Verify API key is set in Supabase secrets
   - Check OpenAI account has credits

### **Debug Steps**

1. **Check Function Logs**:
   ```bash
   supabase functions logs generate-chatbot
   ```

2. **Test Database Connection**:
   - Use Supabase Dashboard → SQL Editor
   - Run simple queries to verify tables

3. **Verify Environment Variables**:
   ```bash
   supabase secrets list
   ```

## 🎉 **Success Indicators**

- ✅ Users can sign up and sign in
- ✅ Chatbots are generated with AI
- ✅ Data is saved to database
- ✅ Leads are captured and stored
- ✅ No API keys exposed in frontend

## 🚀 **Next Steps**

1. **Test the complete flow** end-to-end
2. **Set up Stripe payments** for revenue
3. **Add analytics tracking** for insights
4. **Implement email notifications** for leads
5. **Add advanced AI features** for chatbots

## 📞 **Support**

If you encounter issues:
1. Check Supabase Dashboard logs
2. Review function deployment status
3. Verify environment variables
4. Test with simple queries first

---

**Your WeDriveLeads SaaS is now ready to generate revenue!** 🎯💰

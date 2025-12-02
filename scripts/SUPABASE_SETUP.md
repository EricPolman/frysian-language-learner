# Supabase Setup Guide

This guide walks you through setting up Supabase for the Frysian Learning App.

## Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the details:
   - **Name**: frysian-learning (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

5. Wait for the project to be provisioned (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with https://)
   - **anon/public key** (starts with eyJ...)
   - **service_role key** (starts with eyJ... - keep this secret!)

## Step 3: Configure Environment Variables

1. Create or update `.env.local` in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# OpenAI (if using content generation)
OPENAI_API_KEY=sk-...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

2. Never commit `.env.local` to Git (it's already in .gitignore)

## Step 4: Run Database Migration

### Option A: Using Supabase Dashboard (Easiest)

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `scripts/setup-db.sql`
4. Paste into the SQL Editor
5. Click "Run" or press Ctrl+Enter
6. Verify the tables were created in **Table Editor**

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-id

# Run migration
supabase db push
```

## Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Toggle "Enable Email provider" to ON
   - Enable "Confirm email" (recommended for production)
   - Customize email templates if desired

3. (Optional) Enable OAuth providers:
   - **Google**: Add OAuth credentials
   - **Apple**: Add OAuth credentials
   - Configure redirect URLs

## Step 6: Set Up Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize these templates:
   - **Confirm Signup**: Welcome message
   - **Magic Link**: Passwordless login
   - **Reset Password**: Password recovery
   - **Email Change**: Email update confirmation

## Step 7: Configure URL Settings

1. Go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add redirect URLs:
   - `http://localhost:3000/**`
   - `https://your-domain.com/**`

## Step 8: Test the Connection

1. Start your Next.js dev server:
   ```bash
   npm run dev
   ```

2. Open browser console and test:
   ```javascript
   // This should not throw an error
   const supabase = createClient()
   console.log('Supabase connected!')
   ```

## Step 9: Verify Database Tables

In Supabase Dashboard → **Table Editor**, you should see:

- ✅ `profiles` - User profiles
- ✅ `user_progress` - Lesson completion tracking
- ✅ `word_progress` - Spaced repetition data
- ✅ `lesson_attempts` - Learning attempts

## Database Schema Overview

### Tables

**profiles**
- Extends Supabase auth.users
- Stores user level, XP, display name, avatar

**user_progress**
- Tracks which lessons are completed
- Stores accuracy and XP earned per lesson

**word_progress**
- Implements spaced repetition algorithm
- Tracks vocabulary strength (1-5)
- Schedules next review dates

**lesson_attempts**
- Records each attempt at a lesson
- Tracks questions answered and correctness

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic profile creation on signup
- Secure authentication with JWT tokens

## Troubleshooting

### "Invalid API key"
- Double-check your keys in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing env vars

### "Failed to fetch"
- Check your internet connection
- Verify the Supabase URL is correct
- Ensure your Supabase project is active (not paused)

### "Permission denied"
- RLS policies may be blocking access
- Check that you're authenticated when accessing protected routes
- Verify policies in Supabase Dashboard → **Authentication** → **Policies**

### Tables not created
- Re-run the SQL migration
- Check for errors in SQL Editor
- Verify UUID extension is enabled

## Next Steps

After Supabase is set up:

1. ✅ Test user registration and login
2. ✅ Create API routes for progress tracking
3. ✅ Implement TanStack Query hooks
4. ✅ Build authentication UI components
5. ✅ Test data persistence

## Production Checklist

Before deploying to production:

- [ ] Enable email confirmation
- [ ] Set up custom SMTP (optional)
- [ ] Configure proper redirect URLs
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Configure password policies
- [ ] Review RLS policies
- [ ] Enable database webhooks (if needed)
- [ ] Set up monitoring and alerts

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

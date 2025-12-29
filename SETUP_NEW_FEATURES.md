# Quick Setup Guide: Streaks, Settings & Achievements

## Step 1: Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# Navigate to Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of:
scripts/add-streaks-achievements.sql
```

**Or manually run these commands:**

```sql
-- Add columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS last_practice_date DATE,
ADD COLUMN IF NOT EXISTS daily_goal_xp INTEGER DEFAULT 50 NOT NULL,
ADD COLUMN IF NOT EXISTS audio_enabled BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE NOT NULL;

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);

-- Enable RLS
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own achievements"
  ON public.user_achievements FOR DELETE
  USING (auth.uid() = user_id);
```

## Step 2: Verify Installation

### Check Database Tables

In Supabase Dashboard → Table Editor:

1. **profiles** table should have new columns:
   - `current_streak` (int4, default 0)
   - `longest_streak` (int4, default 0)
   - `last_practice_date` (date, nullable)
   - `daily_goal_xp` (int4, default 50)
   - `audio_enabled` (bool, default true)
   - `notifications_enabled` (bool, default true)

2. **user_achievements** table should exist with:
   - `id` (uuid, primary key)
   - `user_id` (uuid, foreign key)
   - `achievement_id` (text)
   - `unlocked_at` (timestamptz)
   - `created_at` (timestamptz)

### Check RLS Policies

In Supabase Dashboard → Authentication → Policies:

- `user_achievements` should have 3 policies (SELECT, INSERT, DELETE)

## Step 3: Test Features

### Test Daily Streaks

1. Complete a lesson
2. Check dashboard → should show streak = 1
3. Complete another lesson same day → streak stays 1
4. (Tomorrow) Complete a lesson → streak = 2

### Test Settings

1. Navigate to `/settings` or click ⚙️ in header
2. Change daily goal to 100 XP
3. Toggle audio off
4. Click "Save Settings"
5. Refresh page → settings persist

### Test Achievements

1. Complete your first lesson
2. Results page should show "Achievement Unlocked!" modal
3. See "First Steps" badge with +25 XP bonus
4. Navigate to `/achievements`
5. See full achievement grid

## Step 4: Verify Existing Users

For users who already have profiles, run this update to initialize new fields:

```sql
-- Set default values for existing users
UPDATE public.profiles 
SET 
  current_streak = 0,
  longest_streak = 0,
  daily_goal_xp = 50,
  audio_enabled = true,
  notifications_enabled = true
WHERE 
  current_streak IS NULL 
  OR daily_goal_xp IS NULL;
```

## Troubleshooting

### Issue: Streaks not updating

**Solution:**
- Check that `/api/lessons/complete` is being called
- Verify `last_practice_date` is updating in database
- Check browser console for API errors

### Issue: Achievements not unlocking

**Solution:**
- Verify `user_achievements` table exists
- Check RLS policies are enabled
- Look for errors in `/api/lessons/complete` response
- Test with browser dev tools network tab

### Issue: Settings not saving

**Solution:**
- Check `/api/settings` endpoint with network tab
- Verify PATCH request completes successfully
- Check that columns exist in `profiles` table
- Ensure user is authenticated

### Issue: Dashboard not showing new features

**Solution:**
- Clear browser cache and reload
- Check that dashboard query includes new columns:
```typescript
.select("*, current_streak, longest_streak, last_practice_date, daily_goal_xp")
```
- Verify achievement query is working

## New Routes

Your app now has these additional routes:

- `/settings` - User settings page
- `/achievements` - Achievement grid page
- `/api/settings` - GET/PATCH user settings
- `/api/achievements` - GET user achievements
- `/api/streak/update` - POST update streak

## Component Structure

```
components/
├── settings/
│   └── SettingsClient.tsx
├── achievements/
│   ├── AchievementBadge.tsx
│   └── AchievementGrid.tsx
└── animations/
    └── AchievementUnlock.tsx

lib/
├── achievements.ts
└── streaks.ts

app/
├── settings/
│   └── page.tsx
├── achievements/
│   └── page.tsx
└── api/
    ├── settings/
    │   └── route.ts
    ├── achievements/
    │   └── route.ts
    └── streak/
        └── update/
            └── route.ts
```

## Next Steps

1. ✅ Database migration complete
2. ✅ Test streak tracking
3. ✅ Test achievement unlocks
4. ✅ Test settings persistence
5. ✅ Verify dashboard updates
6. 🎯 Optional: Customize achievement list
7. 🎯 Optional: Add more streak features

## Support

If you encounter issues:
1. Check database schema matches migration
2. Verify RLS policies are correct
3. Look at browser console for errors
4. Check API responses in network tab
5. Review `FEATURES_STREAKS_ACHIEVEMENTS.md` for detailed docs

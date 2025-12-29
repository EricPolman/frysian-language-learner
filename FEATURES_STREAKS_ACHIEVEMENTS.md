# New Features: Streaks, Settings & Achievements

This document describes the newly implemented features: daily streaks, user settings, and achievement badges.

## 🔥 Daily Streaks

### Overview
Users now earn and maintain a daily practice streak by completing lessons each day. Streaks motivate consistent learning habits.

### Features
- **Current Streak**: Count of consecutive days practicing
- **Longest Streak**: Personal best streak record
- **Streak Status**: Shows days until streak is lost
- **Automatic Tracking**: Updates on lesson completion

### Implementation
- **Database**: New columns in `profiles` table
  - `current_streak`: Current consecutive days
  - `longest_streak`: Highest streak achieved
  - `last_practice_date`: Last practice date (YYYY-MM-DD)

- **Logic** (`lib/streaks.ts`):
  - Increments streak if practiced yesterday
  - Resets to 1 if gap > 1 day
  - Maintains streak if practiced today

- **API**: Automatically updated via `/api/lessons/complete`

### Display Locations
- Dashboard (dedicated streak card)
- Lesson results page
- Header (future: streak reminder)

## ⚙️ Settings Page

### Overview
Users can customize their learning experience through a dedicated settings page at `/settings`.

### Available Settings

1. **Daily Goal**
   - Set target XP per day (20, 50, 100, 200, 500)
   - Visual progress tracking on dashboard
   - Default: 50 XP

2. **Audio**
   - Enable/disable audio pronunciation
   - Affects intro cards and exercises
   - Default: Enabled

3. **Notifications**
   - Enable/disable practice reminders
   - Future: push notifications
   - Default: Enabled

### Implementation
- **Page**: `/app/settings/page.tsx`
- **Component**: `SettingsClient.tsx`
- **API**: `/api/settings/route.ts` (GET, PATCH)
- **Database**: Columns in `profiles` table
  - `daily_goal_xp`
  - `audio_enabled`
  - `notifications_enabled`

### Access
- Header settings icon (⚙️)
- Dashboard daily goal card
- Mobile navigation (future)

## 🏆 Achievement Badges

### Overview
28 unique achievements unlock as users reach learning milestones. Each badge awards bonus XP.

### Achievement Categories

1. **📚 Lessons** (5 achievements)
   - First lesson → Master Student (50 lessons)
   - 25 to 500 XP rewards

2. **⭐ Experience** (4 achievements)
   - 100 XP → 5,000 XP milestones
   - 25 to 500 XP rewards

3. **🔥 Streaks** (5 achievements)
   - 3 days → 100 day streak
   - 50 to 1,000 XP rewards

4. **✨ Accuracy** (3 achievements)
   - Perfect lessons: 1, 5, 10
   - 50 to 250 XP rewards

5. **🏆 Special** (6 achievements)
   - Words learned, skills completed
   - 25 to 500 XP rewards

### Features
- **Unlock Animation**: Celebration modal with confetti
- **Multiple Unlocks**: Shows all new achievements in sequence
- **Badge Display**: Locked (grayscale) vs unlocked (colorful)
- **Progress Tracking**: Per-category completion percentages

### Implementation

**Achievement Definitions** (`lib/achievements.ts`):
```typescript
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji
  category: 'lessons' | 'xp' | 'streak' | 'accuracy' | 'special';
  requirement: { type: string; value: number };
  xpReward: number;
}
```

**Database** (`user_achievements` table):
- `user_id`: Foreign key to profiles
- `achievement_id`: Achievement identifier
- `unlocked_at`: Timestamp

**Components**:
- `AchievementBadge.tsx`: Individual badge display
- `AchievementGrid.tsx`: Category-organized grid
- `AchievementUnlock.tsx`: Unlock animation modal

**API**: 
- `/api/achievements/route.ts`: GET user achievements
- Automatic checking in `/api/lessons/complete`

### Display Locations
- `/achievements`: Full grid view
- Dashboard: Recent 6 achievements
- Lesson results: Unlock animations

## Database Migration

Run this SQL in Supabase to add the new features:

```bash
# File: scripts/add-streaks-achievements.sql
```

Or manually add columns to existing `profiles` table:
- `current_streak` (integer, default 0)
- `longest_streak` (integer, default 0)
- `last_practice_date` (date, nullable)
- `daily_goal_xp` (integer, default 50)
- `audio_enabled` (boolean, default true)
- `notifications_enabled` (boolean, default true)

Plus create the `user_achievements` table with RLS policies.

## Integration Points

### Lesson Completion Flow
1. User completes lesson
2. API calculates:
   - XP earned (including bonuses)
   - New level
   - **New streak** (updated)
   - **Achievements earned** (checked)
3. Results page shows:
   - XP and accuracy
   - Level up animation (if applicable)
   - **Streak status** (new)
   - **Achievement unlocks** (new)

### Dashboard Enhancements
- Daily goal progress bar
- Streak card with status
- Recent achievements carousel
- Link to full achievement grid

### Header Updates
- Settings icon (⚙️) links to settings page
- (Future: streak indicator)

## User Flow Examples

### First Lesson Achievement
1. User completes first lesson
2. API detects: `lessonsCompleted === 1`
3. Unlocks "First Steps" achievement
4. Results page shows celebration modal
5. User earns +25 bonus XP
6. Dashboard shows new badge

### Streak Building
1. User practices Day 1: streak = 1
2. User practices Day 2: streak = 2
3. User practices Day 3: streak = 3
4. Unlocks "Warming Up" achievement (+50 XP)
5. Skips Day 4: streak resets to 0
6. Dashboard shows streak status

### Settings Customization
1. User visits `/settings`
2. Changes daily goal to 100 XP
3. Enables/disables audio
4. Saves settings
5. Dashboard reflects new goal
6. Lessons respect audio setting

## Testing Checklist

- [ ] Complete lesson → streak increments
- [ ] Skip day → streak resets
- [ ] Earn achievement → unlock animation plays
- [ ] Visit settings → current values load
- [ ] Change settings → persists to database
- [ ] Dashboard shows correct streak
- [ ] Dashboard shows recent achievements
- [ ] Achievement grid shows all badges
- [ ] Daily goal progress updates
- [ ] Multiple achievements unlock in sequence

## Future Enhancements

### Streaks
- [ ] Streak freeze (1 day grace period)
- [ ] Weekend warrior mode
- [ ] Streak repair with XP cost
- [ ] Calendar view of practice history

### Settings
- [ ] Theme selection (light/dark)
- [ ] Language preference
- [ ] Exercise type preferences
- [ ] Privacy settings

### Achievements
- [ ] Rare/secret achievements
- [ ] Time-based achievements (night owl, early bird)
- [ ] Social achievements (invite friends)
- [ ] Seasonal/event achievements
- [ ] Achievement showcase on profile

### Notifications
- [ ] Push notifications for streaks
- [ ] Daily reminder at custom time
- [ ] Achievement unlock notifications
- [ ] Weekly progress summary

## Files Created/Modified

### New Files
- `lib/achievements.ts` - Achievement definitions
- `lib/streaks.ts` - Streak calculation logic
- `app/api/streak/update/route.ts` - Streak update API
- `app/api/achievements/route.ts` - Achievement API
- `app/api/settings/route.ts` - Settings API
- `app/settings/page.tsx` - Settings page
- `app/achievements/page.tsx` - Achievements page
- `components/settings/SettingsClient.tsx` - Settings component
- `components/achievements/AchievementBadge.tsx` - Badge component
- `components/achievements/AchievementGrid.tsx` - Grid component
- `components/animations/AchievementUnlock.tsx` - Unlock animation
- `scripts/add-streaks-achievements.sql` - Migration script
- `types/achievements.ts` - TypeScript types

### Modified Files
- `scripts/setup-db.sql` - Added new columns and table
- `app/api/lessons/complete/route.ts` - Streak & achievement tracking
- `app/dashboard/page.tsx` - Streak and achievement display
- `components/shared/Header.tsx` - Settings link
- `components/lesson/ResultsClient.tsx` - Achievement unlocks
- `components/lesson/LessonClient.tsx` - Pass achievement data
- `app/learn/lesson/[lessonId]/results/page.tsx` - New props
- `types/user.ts` - Updated UserProfile interface

## Support

For questions or issues with these features:
1. Check database schema matches migration
2. Verify RLS policies are enabled
3. Check browser console for API errors
4. Ensure all files are properly imported

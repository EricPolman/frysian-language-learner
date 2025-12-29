// Database types for achievements and settings

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
}

export interface ProfileSettings {
  current_streak: number;
  longest_streak: number;
  last_practice_date: string | null;
  daily_goal_xp: number;
  audio_enabled: boolean;
  notifications_enabled: boolean;
}

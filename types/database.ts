// Database schema types for Supabase

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          level: number;
          total_xp: number;
          current_streak: number;
          longest_streak: number;
          last_practice_date: string | null;
          daily_goal_xp: number;
          audio_enabled: boolean;
          notifications_enabled: boolean;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
          daily_goal_xp?: number;
          audio_enabled?: boolean;
          notifications_enabled?: boolean;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          level?: number;
          total_xp?: number;
          current_streak?: number;
          longest_streak?: number;
          last_practice_date?: string | null;
          daily_goal_xp?: number;
          audio_enabled?: boolean;
          notifications_enabled?: boolean;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          completed_lessons: string[];
          current_skill: string | null;
          total_xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          completed_lessons?: string[];
          current_skill?: string | null;
          total_xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          completed_lessons?: string[];
          current_skill?: string | null;
          total_xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      word_progress: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          strength: number;
          correct_count: number;
          incorrect_count: number;
          last_practiced: string;
          next_review: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          strength?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_practiced?: string;
          next_review?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word_id?: string;
          strength?: number;
          correct_count?: number;
          incorrect_count?: number;
          last_practiced?: string;
          next_review?: string;
          created_at?: string;
        };
      };
      lesson_attempts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          questions_answered: number;
          questions_correct: number;
          xp_earned: number;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          questions_answered?: number;
          questions_correct?: number;
          xp_earned?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          questions_answered?: number;
          questions_correct?: number;
          xp_earned?: number;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
          created_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_message: string;
          ai_response: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_message?: string;
          ai_response?: string;
          created_at?: string;
        };
      };
    };
  };
}

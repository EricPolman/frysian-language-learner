// Database schema types for Supabase

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          current_level: number;
          total_xp: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          current_level?: number;
          total_xp?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          current_level?: number;
          total_xp?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          lesson_id: string;
          completed: boolean;
          accuracy: number;
          xp_earned: number;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          lesson_id: string;
          completed?: boolean;
          accuracy?: number;
          xp_earned?: number;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_id?: string;
          lesson_id?: string;
          completed?: boolean;
          accuracy?: number;
          xp_earned?: number;
          completed_at?: string | null;
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
        };
      };
    };
  };
}

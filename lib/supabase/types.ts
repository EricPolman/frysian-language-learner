export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blog_post_views: {
        Row: {
          blog_post_id: string
          id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          blog_post_id: string
          id?: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          blog_post_id?: string
          id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          id: string
          level: string
          published_date: string
          source_name: string | null
          source_url: string | null
          summary: string
          title: string
          title_fy: string
          updated_at: string
          vocabulary: Json
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          level: string
          published_date?: string
          source_name?: string | null
          source_url?: string | null
          summary: string
          title: string
          title_fy: string
          updated_at?: string
          vocabulary?: Json
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          level?: string
          published_date?: string
          source_name?: string | null
          source_url?: string | null
          summary?: string
          title?: string
          title_fy?: string
          updated_at?: string
          vocabulary?: Json
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          ai_response: string
          created_at: string
          id: string
          user_id: string
          user_message: string
        }
        Insert: {
          ai_response: string
          created_at?: string
          id?: string
          user_id: string
          user_message: string
        }
        Update: {
          ai_response?: string
          created_at?: string
          id?: string
          user_id?: string
          user_message?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          lesson_id: string
          order: number
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data: Json
          id: string
          lesson_id: string
          order?: number
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          lesson_id?: string
          order?: number
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      intro_cards: {
        Row: {
          created_at: string | null
          example_sentence: string | null
          example_translation: string | null
          id: string
          lesson_id: string
          order: number
          vocabulary_id: string
        }
        Insert: {
          created_at?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          id: string
          lesson_id: string
          order?: number
          vocabulary_id: string
        }
        Update: {
          created_at?: string | null
          example_sentence?: string | null
          example_translation?: string | null
          id?: string
          lesson_id?: string
          order?: number
          vocabulary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intro_cards_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intro_cards_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_attempts: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          questions_answered: number
          questions_correct: number
          started_at: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          questions_answered?: number
          questions_correct?: number
          started_at?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          questions_answered?: number
          questions_correct?: number
          started_at?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "lesson_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: number | null
          estimated_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_number: number
          skill_id: string
          title: string
          topic: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_minutes?: number | null
          id: string
          is_published?: boolean | null
          lesson_number: number
          skill_id: string
          title: string
          topic?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: number | null
          estimated_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          skill_id?: string
          title?: string
          topic?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          audio_enabled: boolean
          avatar_url: string | null
          created_at: string
          current_streak: number
          daily_goal_xp: number
          display_name: string | null
          id: string
          is_admin: boolean | null
          last_practice_date: string | null
          level: number
          longest_streak: number
          notifications_enabled: boolean
          total_xp: number
          updated_at: string
        }
        Insert: {
          audio_enabled?: boolean
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          daily_goal_xp?: number
          display_name?: string | null
          id: string
          is_admin?: boolean | null
          last_practice_date?: string | null
          level?: number
          longest_streak?: number
          notifications_enabled?: boolean
          total_xp?: number
          updated_at?: string
        }
        Update: {
          audio_enabled?: boolean
          avatar_url?: string | null
          created_at?: string
          current_streak?: number
          daily_goal_xp?: number
          display_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_practice_date?: string | null
          level?: number
          longest_streak?: number
          notifications_enabled?: boolean
          total_xp?: number
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          color: string | null
          created_at: string | null
          description: string
          difficulty: number
          icon: string | null
          id: string
          is_published: boolean | null
          long_description: string | null
          order: number
          prerequisites: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description: string
          difficulty?: number
          icon?: string | null
          id: string
          is_published?: boolean | null
          long_description?: string | null
          order?: number
          prerequisites?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string
          difficulty?: number
          icon?: string | null
          id?: string
          is_published?: boolean | null
          long_description?: string | null
          order?: number
          prerequisites?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          created_at: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed_lessons: string[]
          created_at: string
          current_skill: string | null
          id: string
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: string[]
          created_at?: string
          current_skill?: string | null
          id?: string
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: string[]
          created_at?: string
          current_skill?: string | null
          id?: string
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          audio_url: string | null
          created_at: string | null
          dutch: string
          example_sentence: string | null
          example_translation: string | null
          frysian: string
          id: string
          image_url: string | null
          part_of_speech: string | null
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          dutch: string
          example_sentence?: string | null
          example_translation?: string | null
          frysian: string
          id: string
          image_url?: string | null
          part_of_speech?: string | null
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          dutch?: string
          example_sentence?: string | null
          example_translation?: string | null
          frysian?: string
          id?: string
          image_url?: string | null
          part_of_speech?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      word_progress: {
        Row: {
          correct_count: number
          created_at: string
          id: string
          incorrect_count: number
          last_practiced: string
          next_review: string
          strength: number
          user_id: string
          word_id: string
        }
        Insert: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_practiced?: string
          next_review?: string
          strength?: number
          user_id: string
          word_id: string
        }
        Update: {
          correct_count?: number
          created_at?: string
          id?: string
          incorrect_count?: number
          last_practiced?: string
          next_review?: string
          strength?: number
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "word_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

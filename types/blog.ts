// Blog post types

export interface VocabularyItem {
  word_fy: string;  // Frisian word
  word_nl: string;  // Dutch translation
  word_en: string;  // English translation
  explanation: string;
}

export type BlogPostLevel = string;// 'beginner' | 'intermediate' | 'advanced';

export interface BlogPost {
  id: string;
  title: string;
  title_fy: string;
  content: string;
  summary: string;
  level: BlogPostLevel;
  vocabulary: VocabularyItem[];
  source_url?: string | null;
  source_name?: string | null;
  published_date: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPostView {
  id: string;
  blog_post_id: string;
  user_id: string;
  viewed_at: string;
}

export interface BlogPostWithViewStatus extends BlogPost {
  has_viewed: boolean;
}

-- Lessons Management Tables
-- This migration creates tables for storing skills, lessons, and exercises in the database

-- Skills table (skill tree nodes)
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  icon TEXT DEFAULT '📚',
  "order" INTEGER NOT NULL DEFAULT 0,
  difficulty INTEGER NOT NULL DEFAULT 1,
  prerequisites TEXT[] DEFAULT '{}',
  color TEXT DEFAULT '#3b82f6',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  difficulty INTEGER DEFAULT 1,
  estimated_minutes INTEGER DEFAULT 10,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, lesson_number)
);

-- Vocabulary items table
CREATE TABLE IF NOT EXISTS vocabulary (
  id TEXT PRIMARY KEY,
  frysian TEXT NOT NULL,
  dutch TEXT NOT NULL,
  part_of_speech TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  audio_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Intro cards for lessons (vocabulary introduction)
CREATE TABLE IF NOT EXISTS intro_cards (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  vocabulary_id TEXT NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL DEFAULT 0,
  example_sentence TEXT,
  example_translation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lesson_id, vocabulary_id)
);

-- Exercises table with JSONB for flexible exercise data
CREATE TABLE IF NOT EXISTS exercises (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('translation', 'fill-in-blank', 'multiple-choice', 'sentence-build')),
  "order" INTEGER NOT NULL DEFAULT 0,
  data JSONB NOT NULL, -- Stores exercise-specific fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lessons_skill_id ON lessons(skill_id);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_intro_cards_lesson_id ON intro_cards(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(type);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills("order");
CREATE INDEX IF NOT EXISTS idx_skills_published ON skills(is_published);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_skills_updated_at ON skills;
CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vocabulary_updated_at ON vocabulary;
CREATE TRIGGER update_vocabulary_updated_at
  BEFORE UPDATE ON vocabulary
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE intro_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Read access for all authenticated users (published content only)
CREATE POLICY "Users can read published skills" ON skills
  FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can read published lessons" ON lessons
  FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "Users can read vocabulary" ON vocabulary
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can read intro cards for published lessons" ON intro_cards
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l 
      WHERE l.id = intro_cards.lesson_id AND l.is_published = true
    )
  );

CREATE POLICY "Users can read exercises for published lessons" ON exercises
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lessons l 
      WHERE l.id = exercises.lesson_id AND l.is_published = true
    )
  );

-- Admin full access (using service role)
-- These are for the lesson editor - we use service role key for admin operations

-- Grant public read for unauthenticated users to see published content
CREATE POLICY "Public can read published skills" ON skills
  FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Public can read published lessons" ON lessons
  FOR SELECT TO anon
  USING (is_published = true);

-- Admin role policies (for users with admin flag in profiles)
-- First, add admin column to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Admin can do everything on skills
CREATE POLICY "Admins can manage skills" ON skills
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admin can do everything on lessons
CREATE POLICY "Admins can manage lessons" ON lessons
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admin can do everything on vocabulary
CREATE POLICY "Admins can manage vocabulary" ON vocabulary
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admin can do everything on intro_cards
CREATE POLICY "Admins can manage intro_cards" ON intro_cards
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- Admin can do everything on exercises
CREATE POLICY "Admins can manage exercises" ON exercises
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
  );

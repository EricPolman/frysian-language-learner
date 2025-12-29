-- Create blog_posts table for daily Frisian language blog content
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_fy TEXT NOT NULL, -- Frisian translation of title
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  vocabulary JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {word_fy, word_nl, word_en, explanation}
  source_url TEXT, -- Original news source if applicable
  source_name TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient querying by published date
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON blog_posts(published_date DESC);

-- Create index for level filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_level ON blog_posts(level);

-- Create blog_post_views table to track user engagement
CREATE TABLE IF NOT EXISTS blog_post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(blog_post_id, user_id)
);

-- Create index for user views
CREATE INDEX IF NOT EXISTS idx_blog_post_views_user ON blog_post_views(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post ON blog_post_views(blog_post_id);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_views ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read blog posts (even unauthenticated users)
CREATE POLICY "Blog posts are publicly readable"
  ON blog_posts FOR SELECT
  USING (true);

-- Policy: Users can view their own blog post views
CREATE POLICY "Users can view their own blog post views"
  ON blog_post_views FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own blog post views
CREATE POLICY "Users can insert their own blog post views"
  ON blog_post_views FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- Insert a sample blog post
INSERT INTO blog_posts (
  title,
  title_fy,
  content,
  summary,
  level,
  vocabulary,
  source_name,
  published_date
) VALUES (
  'Wolkom by it Frysk Leare',
  'Wolkom by it Frysk Leare',
  E'It learen fan it Frysk is in spannende reis yn ien fan Europa syn unike talen. Frysk, of "Frysk" lykas natives it neame, wurdt benammen praat yn de noardlike provinsje Fryslân yn Nederlân.\n\nDe Fryske taal hat in rike skiednis en is nau besibbe oan it Ingelsk en Nederlânsk. Eins wurdt it Frysk faak beskôge as de tichtste libjende taal by it Ingelsk! Dat betsjut dat Ingelsktaligen bepaalde wurden en struktueren ferrassen fertroud fine kinne.\n\nOp dit stuit prate sawat 450.000 minsken Frysk as harren earste taal. De taal hat offisjele status yn Fryslân neist it Nederlânsk, en wurdt brûkt yn it ûnderwiis, media en oerheid.\n\nOf jo no ynteressearre binne yn jo erfgoed, de taalferskaat ûndersykje wolle, of gewoan wat nijs leare wolle, Frysk biedt in longjende learûnderfining. Wolkom!',
  'In yntroduksje oer de Fryske taal, har skiednis, en har relaasje mei it Ingelsk en Nederlânsk.',
  'beginner',
  '[
    {
      "word_fy": "wolkom",
      "word_nl": "welkom",
      "word_en": "welcome",
      "explanation": "Een warme begroeting om iemand te verwelkomen"
    },
    {
      "word_fy": "Frysk",
      "word_nl": "Fries",
      "word_en": "Frisian",
      "explanation": "De naam van de taal in het Fries"
    },
    {
      "word_fy": "Fryslân",
      "word_nl": "Friesland",
      "word_en": "Friesland",
      "explanation": "De provincie in Nederland waar Fries gesproken wordt"
    },
    {
      "word_fy": "taal",
      "word_nl": "taal",
      "word_en": "language",
      "explanation": "Het communicatiemiddel"
    },
    {
      "word_fy": "leare",
      "word_nl": "leren",
      "word_en": "to learn",
      "explanation": "Kennis of vaardigheden opdoen"
    }
  ]'::jsonb,
  'Frysk Leare',
  CURRENT_DATE
);

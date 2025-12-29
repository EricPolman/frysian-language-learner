-- Add INSERT policy for blog posts
-- This allows the API (service role) to insert new blog posts
-- Only authenticated users can insert, which will be the API using service role key

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

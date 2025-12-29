# Daily Blog Feature

## Overview

The Frisian Language Learner now includes a daily blog feature that generates educational content based on Frisian or Dutch news, with highlighted vocabulary and difficulty levels.

## Features

- **AI-Generated Content**: Blog posts are generated using OpenAI GPT-4, focusing on Frisian language and culture
- **Difficulty Levels**: Each post is tagged as beginner, intermediate, or advanced
- **Vocabulary Highlighting**: Key Frisian words with Dutch and English translations
- **User Engagement Tracking**: Track which posts users have read
- **Responsive Design**: Works beautifully on mobile and desktop

## Database Setup

### 1. Run Migration

Execute the migration to create the necessary database tables:

```bash
# If using Supabase CLI
supabase migration up

# Or manually run the migration file in Supabase dashboard
```

The migration file is located at: `supabase/migrations/20251229_add_blog_posts.sql`

### 2. Tables Created

- **blog_posts**: Stores blog content, vocabulary, and metadata
- **blog_post_views**: Tracks which users have viewed which posts

### 3. Update TypeScript Types

Regenerate your Supabase types to include the new tables:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > ./lib/supabase/types.ts
```

## Generating Blog Posts

### Using the API

Send a POST request to `/api/blog/generate`:

```javascript
const response = await fetch('/api/blog/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'Frisian winter traditions',
    level: 'intermediate', // beginner, intermediate, or advanced
    newsUrl: 'https://example.com/news-article' // optional
  })
});

const { post } = await response.json();
```

### Manual Generation Script

You can create a script to generate daily blog posts automatically:

```javascript
// scripts/generate-daily-blog.js
const topics = [
  'Frisian traditional food',
  'Friesland weather and seasons',
  'Famous Frisian people',
  'Frisian cultural festivals',
  'Modern life in Friesland',
  // Add more topics
];

async function generateDailyBlog() {
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const levels = ['beginner', 'intermediate', 'advanced'];
  const randomLevel = levels[Math.floor(Math.random() * levels.length)];

  const response = await fetch('http://localhost:3000/api/blog/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add authentication header if required
    },
    body: JSON.stringify({
      topic: randomTopic,
      level: randomLevel
    })
  });

  const result = await response.json();
  console.log('Generated blog post:', result.post.title);
}

generateDailyBlog();
```

### Automation with Cron Jobs

**✅ IMPLEMENTED**: The project now includes a ready-to-use cron job!

The cron job is already configured in `vercel.json` to run daily at 6:00 AM UTC:

```json
{
  "crons": [{
    "path": "/api/cron/generate-daily-blog",
    "schedule": "0 6 * * *"
  }]
}
```

**Setup:**

1. Add `CRON_SECRET` to your environment variables:
   ```bash
   # Generate a random secret
   openssl rand -base64 32
   ```

2. Add to Vercel environment variables:
   - Go to your Vercel project settings
   - Navigate to Environment Variables
   - Add `CRON_SECRET` with your generated value

3. Deploy to Vercel - the cron job will automatically start running!

**How it works:**
- Runs every day at 6:00 AM UTC
- Automatically selects a diverse topic from 20+ predefined topics
- Rotates difficulty levels throughout the week:
  - Monday & Thursday: Beginner
  - Tuesday & Friday: Intermediate  
  - Wednesday, Saturday & Sunday: Advanced
- Checks if a post already exists for today (prevents duplicates)
- Generates and publishes the post automatically

**Manual trigger for testing:**
```bash
curl -X GET https://your-app.vercel.app/api/cron/generate-daily-blog \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

The implementation is in `app/api/cron/generate-daily-blog/route.ts`.

## Using the Blog Feature

### User Flow

1. **Browse Posts**: Users visit `/blog` to see all blog posts
2. **Filter by Level**: Posts are tagged with difficulty levels
3. **Read Post**: Click any post to read the full content at `/blog/[id]`
4. **Learn Vocabulary**: Each post includes a vocabulary section with translations
5. **Track Progress**: The system tracks which posts users have read

### Navigation

The blog is accessible from:
- Desktop: Top navigation bar (📰 Blog button)
- Mobile: Bottom navigation bar (📰 Blog tab)
- Dashboard: You can add a link from the dashboard

## API Endpoints

### GET /api/blog
Fetch all blog posts with optional filtering

**Query Parameters:**
- `level`: Filter by difficulty (beginner, intermediate, advanced)
- `limit`: Number of posts to return (default: 10)
- `offset`: Pagination offset (default: 0)

### GET /api/blog/[id]
Fetch a single blog post by ID

### POST /api/blog/[id]/view
Record that a user has viewed a post (requires authentication)

### POST /api/blog/generate
Generate a new blog post using AI (requires authentication)

**Body:**
```json
{
  "topic": "String describing the topic",
  "level": "beginner|intermediate|advanced",
  "newsUrl": "Optional source URL"
}
```

## Blog Post Structure

Each blog post includes:

- **Title** (English and Frisian)
- **Content** (educational article)
- **Summary** (brief description)
- **Level** (beginner, intermediate, advanced)
- **Vocabulary** array with:
  - `word_fy`: Frisian word
  - `word_nl`: Dutch translation
  - `word_en`: English translation
  - `explanation`: Context and usage notes
- **Source** (optional news source)
- **Published Date**

## Future Enhancements

Ideas for expanding the blog feature:

1. **Search Functionality**: Search posts by topic or vocabulary
2. **Favorites**: Let users save favorite posts
3. **Comments**: Enable discussion on posts
4. **Related Posts**: Show similar posts
5. **Audio Narration**: Add text-to-speech for Frisian words
6. **Vocabulary Practice**: Turn blog vocabulary into exercises
7. **User Submissions**: Allow community blog posts
8. **Categories/Tags**: Organize posts by topic
9. **RSS Feed**: Let users subscribe to new posts
10. **Email Notifications**: Send new posts to subscribers

## Troubleshooting

### Blog posts not appearing
- Check that the migration ran successfully
- Verify posts exist in the database
- Check console for API errors

### Generation API fails
- Verify OpenAI API key is set in environment variables
- Check API rate limits
- Review error logs in the API route

### Vocabulary not displaying
- Ensure vocabulary is properly formatted as JSONB in database
- Check that the TypeScript types are up to date

## Environment Variables

Make sure these are set:

```env
OPENAI_API_KEY=your_openai_api_key
CRON_SECRET=your_random_secret_for_cron_jobs
```

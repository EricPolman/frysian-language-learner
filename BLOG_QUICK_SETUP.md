# 🚀 Quick Setup: Blog Feature

## Quick Start (3 steps)

### 1. Run the Migration

**Option A - Using Supabase CLI:**
```bash
./scripts/setup-blog-feature.sh
```

**Option B - Manual:**
1. Go to your Supabase dashboard
2. Open SQL Editor
3. Copy and run the SQL from `supabase/migrations/20251229_add_blog_posts.sql`

### 2. Update TypeScript Types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > ./lib/supabase/types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

### 3. Test It Out

1. Start your dev server: `npm run dev`
2. Navigate to `/blog/generate`
3. Create your first blog post!

## That's It! 🎉

The blog feature is now fully integrated:
- ✅ Database tables created
- ✅ API routes configured
- ✅ UI components ready
- ✅ Navigation updated
- ✅ AI generation ready (needs OPENAI_API_KEY)

## Need Help?

See `BLOG_FEATURE.md` for detailed documentation.

# Blog Feature - Setup Checklist

Use this checklist to ensure the blog feature is fully set up and working.

## ☐ 1. Database Setup

- [ ] Run the migration file `supabase/migrations/20251229_add_blog_posts.sql`
  - Option A: `./scripts/setup-blog-feature.sh`
  - Option B: Run SQL manually in Supabase dashboard
- [ ] Verify tables were created:
  - `blog_posts`
  - `blog_post_views`
- [ ] Check that sample blog post was inserted
- [ ] Verify RLS policies are enabled

## ☐ 2. TypeScript Configuration

- [ ] Regenerate Supabase types:
  ```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > ./lib/supabase/types.ts
  ```
- [ ] Verify no TypeScript errors in blog-related files:
  - `app/blog/page.tsx`
  - `app/blog/[id]/page.tsx`
  - `app/api/blog/route.ts`
  - `app/api/blog/[id]/route.ts`
  - `app/api/blog/generate/route.ts`

## ☐ 3. Environment Variables

- [ ] Add `OPENAI_API_KEY` to `.env.local`:
  ```env
  OPENAI_API_KEY=sk-...
  ```
- [ ] Generate and add `CRON_SECRET` for automated blog generation:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Add to `.env.local`:
  ```env
  CRON_SECRET=your_generated_secret
  ```

## ☐ 4. Local Testing

- [ ] Start development server: `npm run dev`
- [ ] Navigate to `/blog` - should see sample blog post
- [ ] Click on sample post - should display full content with vocabulary
- [ ] Navigate to `/blog/generate`
- [ ] Generate a test blog post:
  - Enter topic: "Frisian cheese making traditions"
  - Select level: Beginner
  - Click Generate
- [ ] Verify the new post appears in `/blog`
- [ ] Test view tracking (must be logged in)

## ☐ 5. Navigation Integration

- [ ] Verify blog link appears in desktop header (📰 Blog)
- [ ] Verify blog tab appears in mobile navigation
- [ ] Test navigation from:
  - Dashboard → Blog
  - Blog → Post → Back to Blog
  - Mobile nav → Blog

## ☐ 6. API Testing

Test each endpoint:

- [ ] **GET /api/blog**
  ```bash
  curl http://localhost:3000/api/blog
  ```
  
- [ ] **GET /api/blog/[id]**
  ```bash
  curl http://localhost:3000/api/blog/POST_ID
  ```
  
- [ ] **POST /api/blog/generate** (requires auth)
  ```bash
  curl -X POST http://localhost:3000/api/blog/generate \
    -H "Content-Type: application/json" \
    -d '{"topic":"Test","level":"beginner"}'
  ```

## ☐ 7. Deployment (Vercel)

- [ ] Push code to repository
- [ ] Deploy to Vercel
- [ ] Add environment variables in Vercel dashboard:
  - `OPENAI_API_KEY`
  - `CRON_SECRET`
  - All existing Supabase variables
- [ ] Verify deployment successful
- [ ] Test live site: `https://your-app.vercel.app/blog`

## ☐ 8. Cron Job Setup (Automated Daily Posts)

- [ ] Verify `vercel.json` includes cron configuration:
  ```json
  "crons": [{
    "path": "/api/cron/generate-daily-blog",
    "schedule": "0 6 * * *"
  }]
  ```
- [ ] Enable cron jobs in Vercel project settings
- [ ] Test cron endpoint manually:
  ```bash
  curl -X GET https://your-app.vercel.app/api/cron/generate-daily-blog \
    -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```
- [ ] Check Vercel logs for successful execution
- [ ] Wait for scheduled run (6 AM UTC) and verify new post appears

## ☐ 9. Content Verification

- [ ] Review generated blog posts for quality
- [ ] Verify vocabulary includes:
  - Frisian word (`word_fy`)
  - Dutch translation (`word_nl`)
  - English translation (`word_en`)
  - Explanation
- [ ] Check that difficulty levels are appropriate
- [ ] Verify Frisian titles are accurate

## ☐ 10. User Experience Testing

- [ ] Test as unauthenticated user:
  - [ ] Can view blog listing
  - [ ] Can read blog posts
  - [ ] Cannot record views (expected)
  
- [ ] Test as authenticated user:
  - [ ] Can view blog listing
  - [ ] Can read blog posts
  - [ ] Views are tracked
  - [ ] Can generate new posts
  
- [ ] Test mobile responsive design:
  - [ ] Blog listing displays correctly
  - [ ] Individual posts are readable
  - [ ] Vocabulary cards are properly formatted
  - [ ] Navigation works

## ☐ 11. Performance & Optimization

- [ ] Check page load times
- [ ] Verify images/media load properly (if added)
- [ ] Test with multiple posts (generate 10+ posts)
- [ ] Check pagination/infinite scroll (if implemented)
- [ ] Monitor database query performance

## ☐ 12. Documentation Review

- [ ] Read `BLOG_FEATURE.md` for full documentation
- [ ] Review `BLOG_IMPLEMENTATION_SUMMARY.md` for overview
- [ ] Check `.env.blog.example` for required variables
- [ ] Understand cron job configuration

## ☐ 13. Optional Enhancements

Consider implementing:

- [ ] Search functionality
- [ ] Filter by difficulty level
- [ ] Favorite/bookmark posts
- [ ] Share buttons (Twitter, Facebook, etc.)
- [ ] Print-friendly version
- [ ] RSS feed
- [ ] Email newsletter subscription
- [ ] Related posts suggestions
- [ ] Comments or discussion
- [ ] Audio pronunciation for vocabulary

## ☐ 14. Monitoring & Maintenance

Set up monitoring for:

- [ ] Daily cron job execution
- [ ] OpenAI API usage/costs
- [ ] Database storage growth
- [ ] User engagement metrics
- [ ] Error tracking
- [ ] Blog post quality reviews

## 🎉 Completion

Once all items are checked:
- ✅ Blog feature is fully operational
- ✅ Daily automated posts are running
- ✅ Users can read and engage with content
- ✅ Vocabulary learning is enhanced

## 📞 Support

If you encounter issues:
1. Check TypeScript errors
2. Review Supabase logs
3. Check Vercel deployment logs
4. Verify environment variables
5. Test API endpoints individually
6. Review documentation files

## 📈 Success Metrics to Track

After deployment, monitor:
- Number of blog posts generated
- User engagement (views per post)
- Most popular topics
- Vocabulary retention
- User feedback
- Time spent on blog posts
- Return visits to blog section

---

**Ready to launch!** 🚀

Once this checklist is complete, your Frisian Language Learner app will have a fully functional, AI-powered blog feature that generates daily educational content!

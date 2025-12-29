# Chat Feature - Frysian Language Coach

## Overview

The chat feature allows users to practice Frysian (West Frisian / Frysk) through natural conversation with an AI-powered language coach. The AI provides gentle corrections, explanations, and encouragement to help learners improve their Frysian skills.

## Features

✅ **Natural Conversation** - Chat in Frysian with an AI that responds contextually  
✅ **Personalized Coaching** - AI adapts difficulty based on user's level  
✅ **Grammar Corrections** - Gentle corrections with explanations in Dutch  
✅ **Cultural Context** - Learn about Frisian culture and traditions  
✅ **Persistent History** - Chat messages are saved to the database  
✅ **Responsive Design** - Works seamlessly on mobile and desktop

## Components

### 1. API Route (`/app/api/chat/route.ts`)
- **POST** - Send a message and receive AI response
- **GET** - Retrieve chat history (last 50 messages)
- Uses OpenAI GPT-4o-mini for AI responses
- Personalizes responses based on user level

### 2. Chat Client (`/components/chat/ChatbotClient.tsx`)
- Real-time chat interface
- Auto-scrolling message list
- Loading indicators
- Keyboard shortcuts (Enter to send)
- Error handling

### 3. Chat Page (`/app/chat/page.tsx`)
- Full chat experience
- Usage instructions in Frysian
- Example prompts to get started
- Protected route (requires authentication)

### 4. Database Schema
```sql
chat_messages:
  - id (UUID)
  - user_id (UUID, references auth.users)
  - user_message (TEXT)
  - ai_response (TEXT)
  - created_at (TIMESTAMP)
```

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```bash
# The setup script is located at:
scripts/setup-chat.sql
```

Or apply the migration:

```bash
# If using Supabase CLI:
supabase migration up
```

### 2. Environment Variables

Ensure you have the OpenAI API key in your `.env.local`:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Access the Feature

1. Log in to your account
2. Click on "💬 Chat" in the navigation
3. Start chatting in Frysian!

## How It Works

### AI Coaching Approach

The AI coach:
1. **Responds primarily in Frysian** to maximize immersion
2. **Uses Dutch for explanations** when explaining complex grammar
3. **Adapts difficulty** based on user's level (1-6+)
4. **Provides corrections** gently and constructively
5. **Asks questions** to keep conversation flowing
6. **Shares cultural insights** about Frisian culture

### Example Conversation

```
User: Hoi, hoe giet it?
AI: Hoi! It giet hiel goed, tank! 😊 En mei dy? 

(Great use of "giet" instead of the Dutch "gaat"!)

User: Goed! Wat dochst hjoed?
AI: Hjoed help ik dy mei it Frysk leare! 📚 

(Perfect! "hjoed" = today, "dochst" = do you do)

Want to practice some vocabulary? We could talk about 
food, animals, or daily activities. What interests you?
```

## Navigation Integration

The chat feature is integrated into:
- **Header Navigation** (desktop) - "💬 Chat" button
- **Mobile Navigation** (mobile) - Chat icon in bottom nav
- **Order**: Learn → Chat → Practice → Dashboard

## User Experience

### Mobile
- Full-screen chat interface
- Touch-optimized message bubbles
- Bottom navigation for easy access
- Optimized input area

### Desktop
- Comfortable reading width (max-w-4xl)
- Clear visual hierarchy
- Keyboard-friendly interactions
- Info section with tips

## Technical Details

### AI Configuration
- **Model**: GPT-4o-mini (cost-effective, fast)
- **Temperature**: 0.8 (creative but focused)
- **Max Tokens**: 500 (concise responses)
- **Context**: Includes conversation history

### Database
- **Row Level Security** enabled
- Users can only see/create their own messages
- Indexed for performance (user_id, created_at)
- Automatic timestamps

### Error Handling
- Network errors → Friendly error message in Frysian
- API failures → Graceful fallback
- Loading states → Animated typing indicator

## Future Enhancements

Potential improvements:
- [ ] Voice input/output for pronunciation practice
- [ ] Export conversation as study material
- [ ] Conversation topics/themes selector
- [ ] Difficulty level override
- [ ] Grammar hints on hover
- [ ] Vocabulary suggestions
- [ ] Achievement integration (e.g., "Chat 10 messages")
- [ ] Conversation analytics

## Testing

To test the feature:

1. Ensure database is set up (run setup-chat.sql)
2. Verify OPENAI_API_KEY is configured
3. Log in to the application
4. Navigate to /chat
5. Try example phrases:
   - "Goeie, hoe giet it?"
   - "Wat is dyn namme?"
   - "Ik wol Frysk leare!"

## Troubleshooting

### "Unauthorized" error
- Ensure user is logged in
- Check auth token is valid

### AI not responding
- Verify OPENAI_API_KEY is set
- Check API key has credits
- Review API error logs

### Database errors
- Confirm chat_messages table exists
- Verify RLS policies are active
- Check user_id foreign key constraint

## Cost Considerations

**OpenAI API Costs** (approximate):
- GPT-4o-mini: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Average message: ~100-200 tokens
- Estimated cost: <$0.01 per conversation

**Optimization tips**:
- Limit conversation history to 50 messages
- Use max_tokens to control response length
- Consider caching common responses

## Files Created/Modified

### New Files
- `/app/api/chat/route.ts` - API endpoint
- `/app/chat/page.tsx` - Chat page
- `/components/chat/ChatbotClient.tsx` - Chat UI component
- `/supabase/migrations/20251229_add_chat_messages.sql` - Database migration
- `/scripts/setup-chat.sql` - Setup script
- `CHAT_FEATURE.md` - This documentation

### Modified Files
- `/types/database.ts` - Added chat_messages table types
- `/components/shared/MobileNav.tsx` - Added chat to navigation
- `/components/shared/Header.tsx` - Added chat to desktop navigation

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Supabase logs for database errors
3. Check browser console for client-side errors
4. Verify OpenAI API status

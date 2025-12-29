# Frysian Language Learning App - Project Specification

## Project Overview

A mobile-friendly web application for learning Frysian (West Frisian) from Dutch, built with Next.js. The app will provide an engaging, gamified learning experience similar to Duolingo.

**Target Users**: Dutch speakers who want to learn Frysian
**Platform**: Web (mobile-first, responsive design)
**Tech Stack**: Next.js, React, TypeScript

---

## Core Features

### 1. Learning Exercises

#### MVP Exercise Types (Phase 1)

1. **Translation Exercises**
   - User translates Frysian sentence to Dutch or vice versa
   - Text input field with answer validation
   - Accept minor variations (articles, punctuation)
2. **Fill-in-the-Blank**
   - Sentence with missing word(s)
   - Word bank provided or free text input
   - Context clues to help learners
3. **Picture Matching**
   - Visual representation of vocabulary
   - Select correct image for given Frysian word
   - Or select correct Frysian word for given image
4. **Sentence Building**
   - Arrange word tiles to form correct Frysian sentence
   - Drag-and-drop or tap interface
   - Includes distractor words

#### Future Exercise Types (Phase 2+)

- Multiple choice
- Listening exercises (audio comprehension)
- Speaking exercises (pronunciation practice)
- Matching pairs (connect words to translations)
- Read short stories with AI evaluation of user comprehension

### 2. Lesson Structure

#### Organization: Skill Tree (Duolingo-style)

- **Tree-based progression** with multiple paths
- **Skills unlock sequentially** based on completion
- Each skill contains multiple lessons
- Skills can have prerequisites (must complete Skill A to unlock Skill B)

#### Lesson Configuration

- **Questions per lesson**: 10 (configurable parameter)
- **Exercise mix**: Varied exercise types within each lesson
- **Review lessons**: Periodic reinforcement of previous material

#### Lesson Flow

1. **Teaching Phase** (Introduction)
   - New vocabulary cards with:
     - Frysian word/phrase
     - Dutch translation
     - Example sentence
     - Optional image
     - Optional audio pronunciation
   - User taps through 3-5 intro cards before exercises
2. **Exercise Phase** (10 questions)
   - Mix of 4 exercise types
   - Randomized order
   - Progressive difficulty within lesson
   - Includes both new and review content
3. **Completion Screen**
   - Results summary (accuracy, XP earned)
   - Celebration animation
   - Weak words highlighted (if any)
   - Continue/Review buttons

### 3. Difficulty Progression

#### Content Complexity

- **Level 1**: Single words (nouns, basic verbs)
- **Level 2**: Simple phrases (2-3 words)
- **Level 3**: Simple sentences (subject-verb-object)
- **Level 4**: Complex sentences (compound, subordinate clauses)
- **Level 5**: Conversational expressions and idioms

#### Vocabulary Introduction

- 3-5 new words per lesson
- Previously learned words mixed in for reinforcement
- Spaced repetition algorithm to optimize retention

#### Skill Progression

- Early skills: Basic vocabulary and simple grammar
- Mid-level skills: Common phrases, daily situations
- Advanced skills: Complex grammar, abstract concepts

### 4. Feedback & Error Handling

#### Answer Validation

- **First attempt**: Submit answer
  - ✅ Correct: Green checkmark, positive feedback, earn full XP
  - ❌ Incorrect: Red X, "Try again" prompt
- **Second attempt**: Retry with same question
  - ✅ Correct: Green checkmark, reduced XP (50% of original)
  - ❌ Incorrect: Show correct answer with explanation
- **Unlimited attempts**: No lives/hearts system
- **Move forward**: Always proceed to next question after seeing correct answer

#### Explanations & Tooltips

- **Grammar tips**: Contextual explanations for errors
- **Translation notes**: Why certain translations work
- **Tooltip hints**: Available on question cards (optional hints before answering)
- **Word definitions**: Tap words to see meanings

#### Visual Feedback

- Green highlights for correct answers
- Red highlights for incorrect answers
- Smooth animations for transitions
- Encouraging messages ("Good job!", "Almost there!", "You've got this!")

### 5. Gamification System

#### XP & Points

- **Base XP per question**: 10 XP for correct answer
- **Retry penalty**: 5 XP if correct on second attempt
- **Lesson completion bonus**: +50 XP
- **Perfect lesson bonus**: +25 XP (all answers correct on first try)

#### Levels

- XP accumulates to increase user level
- **Level thresholds**:
  - Level 1: 0 XP
  - Level 2: 100 XP
  - Level 3: 250 XP
  - Level 4: 500 XP
  - (Formula: increases exponentially)
- Level-up animation and celebration

#### Progress Tracking

- **Skill tree visualization**: Show locked/unlocked/completed skills
- **Progress bars**:
  - Per-lesson progress (questions completed)
  - Per-skill progress (lessons completed)
  - Overall course progress
- **Statistics dashboard**:
  - Total XP earned
  - Current level
  - Lessons completed
  - Accuracy percentage
  - Words learned

#### Celebrations

- **Lesson completion**: Confetti animation, success sound, motivational message
- **Level up**: Special animation, fanfare sound, achievement unlock
- **Perfect lesson**: Extra celebration, bonus XP notification
- **Skill completion**: Crown/badge awarded, skill marked as complete

#### Future Gamification (Phase 2+)

- Daily streaks (consecutive days of practice)
- Achievement badges (milestones)
- Leaderboards (weekly competitions)
- Daily goals (customizable XP targets)
- Friend challenges

### 6. Practice & Reinforcement

#### Spaced Repetition System

- **Track word performance**: Success rate per vocabulary item
- **Weak words identification**: Words with <70% accuracy
- **Review scheduling**:
  - Day 1: Learn new word
  - Day 2: First review
  - Day 4: Second review
  - Day 7: Third review
  - Day 14: Fourth review
  - (Intervals increase with successful recalls)

#### Review Lessons

- **Automatic review lessons**: Every 5th lesson focuses on review
- **Manual practice**: "Practice Weak Words" button on dashboard
- **Skill strengthening**: Re-practice completed skills that need reinforcement

#### Word Strength Indicator

- Visual indicator (1-5 bars) showing word mastery
- Decreases over time without practice
- Increases with successful recalls

### 7. Content Structure

#### MVP Skill Tree (8-12 Skills)

Suggested progression for MVP:

1. **Basics 1** - Essential phrases, greetings
   - Lessons: Hello, yes/no, thank you, please, basic courtesy
2. **Basics 2** - Personal pronouns, to be, to have
   - Lessons: I am, you are, he/she is, basic sentence structure
3. **Numbers** - Counting and basic math
   - Lessons: 1-10, 11-20, 21-100, ordinal numbers
4. **Family** - Family members and relationships
   - Lessons: Parents, siblings, extended family, my family
5. **Colors & Shapes** - Descriptive vocabulary
   - Lessons: Common colors, basic shapes, describing objects
6. **Food & Drink** - Everyday vocabulary
   - Lessons: Meals, fruits/vegetables, drinks, at the restaurant
7. **Animals** - Common animals and pets
   - Lessons: Pets, farm animals, wild animals
8. **Common Phrases** - Practical expressions
   - Lessons: Questions, time, weather, directions
9. **Home** - House vocabulary
   - Lessons: Rooms, furniture, household items
10. **Verbs 1** - Common action verbs
    - Lessons: Daily activities, present tense conjugation
11. **Clothing** - What to wear
    - Lessons: Basic clothes, accessories, seasons
12. **Basics 3** - Review and consolidation
    - Lessons: Mixed review of all previous skills

#### Lesson Structure per Skill

- **3-5 lessons per skill** (typically 4)
- Each lesson: 10 questions
- Every 5th lesson in the tree: Review lesson
- Total MVP: ~40-50 lessons

#### Translation Direction

- **Primary focus**: Dutch → Frysian (80% of exercises)
- **Secondary**: Frysian → Dutch (20% of exercises)
- This reflects natural learning progression (comprehension before production)

#### Content Dependencies

- Skills must be completed sequentially initially
- Later phases: Allow some parallel progression in skill tree branches

### 8. Content Management Strategy

#### Phase 1: AI-Generated Content

- **Use AI (LLMs) to generate initial content**:
  - Vocabulary lists with translations
  - Example sentences
  - Exercise questions and answers
  - Grammar explanations
- **AI Content Generation Tools**:
  - GPT-4/Claude for sentence generation and translations
  - Validation against Frysian language resources
  - Structured prompts to ensure consistency

#### Phase 2: Human Curation

- **Content Management System (CMS)**:
  - Admin interface to review AI-generated content
  - Ability to edit, approve, or reject content
  - Flag content for native speaker review
- **Community Contributions**:
  - Allow verified users to suggest corrections
  - Native speaker review queue
  - Version control for content changes

#### Content Storage

- **Structured JSON/YAML files** for MVP:
  - Easy to version control
  - Simple to edit and review
  - Can migrate to database later
- **Content Schema** (per lesson):
  ```
  {
    "id": "basics-1-1",
    "skill": "basics-1",
    "lessonNumber": 1,
    "title": "Greetings",
    "vocabulary": [
      {
        "frysian": "goeie",
        "dutch": "goeie",
        "english": "good",
        "audioUrl": "/audio/goeie.mp3",
        "imageUrl": "/images/greeting.jpg"
      }
    ],
    "exercises": [
      {
        "type": "translation",
        "question": "Goeie moarn",
        "correctAnswer": "Goedemorgen",
        "acceptedAnswers": ["Goedemorgen", "goedemorgen"],
        "hint": "Morning greeting"
      }
    ]
  }
  ```

### 9. User Features

#### Authentication & Accounts

- **Optional for MVP**: Allow guest progress (localStorage)
- **Account creation**: Email/password or OAuth (Google, Apple)
- **Benefits of account**:
  - Progress saved across devices
  - Access to statistics and history
  - Future: social features, leaderboards

#### Progress Tracking

- **Local storage** (no account):
  - Current lesson/skill
  - XP and level
  - Completed lessons
  - Basic statistics
- **Database** (with account):
  - Full learning history
  - Detailed word performance
  - Time spent learning
  - Historical statistics

#### User Profile

- **Basic info**: Name, avatar (optional)
- **Learning stats**: Level, XP, lessons completed
- **Settings**: Audio on/off, notifications, language preferences

### 10. Audio & Media

#### Audio Strategy

- **Phase 1 (MVP)**: Text-to-Speech (TTS)
  - Google Cloud TTS or Azure TTS
  - May not have perfect Frysian pronunciation
  - Cost-effective and scalable
- **Phase 2**: Pre-recorded native audio
  - Record with native Frysian speakers
  - Higher quality, authentic pronunciation
  - Can be added incrementally

#### Images for Picture Matching

- **Sources**:
  - Royalty-free stock photos (Unsplash, Pexels)
  - AI-generated images (DALL-E, Midjourney) for consistency
  - Simple illustrations for clarity
- **Requirements**:
  - Clear, unambiguous representations
  - Consistent style across lessons
  - Optimized for web (WebP format)
  - Responsive sizing for mobile

#### Media Organization

```
/public
  /audio
    /vocabulary  (word pronunciations)
    /sentences   (full sentences)
  /images
    /vocabulary  (picture matching)
    /illustrations (lesson concepts)
```

---

## Technical Architecture

### Frontend Stack

#### Core Framework

- **Next.js 14+** (App Router)
- **React 18**
- **TypeScript** (strict mode)

#### Styling & UI

- **Tailwind CSS** - Utility-first CSS framework
  - Mobile-first responsive design
  - Custom color palette for branding
  - Dark mode support (optional)
- **shadcn/ui** - Component library
  - Built on Radix UI primitives
  - Accessible by default
  - Customizable and composable
  - Components: Button, Card, Dialog, Progress, Tooltip, etc.
- **Framer Motion** - Animation library
  - Celebration animations (confetti, success states)
  - Page transitions
  - Micro-interactions
  - Spring physics for natural motion

#### State Management

- **Zustand** - Client state management
  - Lesson state (current question, answers, progress)
  - UI state (modals, notifications)
  - User preferences
  - Lightweight and performant
- **TanStack Query (React Query)** - Server state management
  - Data fetching and caching
  - Mutations (progress updates, answer submissions)
  - Optimistic updates
  - Automatic refetching and background updates
  - Error handling and retry logic

#### Form Handling

- **React Hook Form** - Form management
  - Translation input validation
  - Fill-in-the-blank forms
  - Minimal re-renders

### Backend & Database

#### Backend Architecture

- **Next.js API Routes** - Serverless functions
  - RESTful API endpoints
  - Authentication endpoints
  - Progress tracking endpoints
  - Answer validation

#### Database

- **Supabase** (Recommended)
  - PostgreSQL database
  - Built-in authentication
  - Real-time subscriptions (future features)
  - Row Level Security (RLS)
  - Edge Functions support
  - Generous free tier

**Database Schema** (Initial):

```sql
-- Users (handled by Supabase Auth)
users
  - id (uuid, primary key)
  - email
  - created_at

-- User Profiles
profiles
  - id (uuid, foreign key to users)
  - display_name
  - avatar_url
  - current_level
  - total_xp
  - created_at
  - updated_at

-- User Progress
user_progress
  - id (uuid, primary key)
  - user_id (foreign key)
  - skill_id (text)
  - lesson_id (text)
  - completed (boolean)
  - accuracy (decimal)
  - xp_earned (integer)
  - completed_at (timestamp)

-- Word Progress (for spaced repetition)
word_progress
  - id (uuid, primary key)
  - user_id (foreign key)
  - word_id (text)
  - strength (integer 1-5)
  - correct_count (integer)
  - incorrect_count (integer)
  - last_practiced (timestamp)
  - next_review (timestamp)

-- Lesson Attempts
lesson_attempts
  - id (uuid, primary key)
  - user_id (foreign key)
  - lesson_id (text)
  - questions_answered (integer)
  - questions_correct (integer)
  - xp_earned (integer)
  - started_at (timestamp)
  - completed_at (timestamp)
```

#### Authentication

- **Supabase Auth**
  - Email/password sign up and login
  - OAuth providers (Google, Apple) - optional
  - Email verification
  - Password reset
  - Session management
  - JWT tokens

### Content Management

#### Content Storage Strategy

**Phase 1: Pre-generated Static Content**

- All lesson content stored as **JSON files** in repository
- Content generated offline using AI scripts
- Version controlled in Git
- Easy to review and edit
- Fast loading (no runtime generation)

**Content Generation Pipeline**:

1. **AI Script** (`scripts/generate-content.ts`)
   - Uses OpenAI/Anthropic API
   - Generates vocabulary, sentences, exercises
   - Validates against Frysian language rules
   - Outputs structured JSON
2. **Human Review**
   - Review generated JSON files
   - Edit/approve/reject content
   - Commit approved content to repo
3. **Build Integration**
   - Content bundled with app at build time
   - Type-safe content access
   - Optimized for fast loading

**Content File Structure**:

```
data/
├── skills.json           # Skill tree definition
├── vocabulary.json       # All vocabulary with translations
└── lessons/
    ├── basics-1-1.json   # Individual lesson files
    ├── basics-1-2.json
    └── ...
```

**Phase 2: CMS for Human Curation**

- Admin panel built with Next.js
- CRUD operations for content
- Content stored in Supabase database
- Review queue for AI-generated content
- Version history and approval workflow

### Data Flow

#### Content Delivery

```
Build Time:
  JSON files → Next.js build → Static optimization

Runtime:
  Client → TanStack Query → API Route → Supabase → Response
```

#### Progress Tracking

```
User Action:
  Answer question → Submit → API Route → Validate
  → Update Supabase → TanStack Query cache update
  → UI optimistic update → Celebration animation
```

### Progressive Web App (PWA)

#### PWA Features

- **Installable**: Add to home screen prompt
- **Offline Support**:
  - Service Worker caching
  - Cache lesson content for offline access
  - Queue progress updates when offline
  - Sync when connection restored
- **App-like Experience**:
  - Fullscreen mode
  - Custom splash screen
  - Native-like navigation
  - No browser UI
- **Performance**:
  - Fast loading with pre-caching
  - Background sync for progress
  - Push notifications (Phase 2)

#### PWA Implementation

- **next-pwa** plugin for Next.js
- **Workbox** for service worker
- **Manifest.json** for app metadata
  - App name, icons, theme colors
  - Display mode: standalone
  - Start URL

```json
// manifest.json
{
  "name": "Frysian Learning",
  "short_name": "Frysian",
  "description": "Learn Frysian from Dutch",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [...]
}
```

### Project Structure

```
frysian-duolingo/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── signup/
│   ├── (main)/                   # Main app routes
│   │   ├── page.tsx              # Dashboard/Home
│   │   ├── learn/                # Skill tree view
│   │   │   └── page.tsx
│   │   ├── lesson/[id]/          # Lesson interface
│   │   │   └── page.tsx
│   │   ├── practice/             # Practice mode
│   │   │   └── page.tsx
│   │   └── profile/              # User profile
│   │       └── page.tsx
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Auth endpoints
│   │   ├── progress/             # Progress tracking
│   │   ├── lessons/              # Lesson data
│   │   └── validation/           # Answer validation
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React Components
│   ├── exercises/                # Exercise types
│   │   ├── TranslationExercise.tsx
│   │   ├── FillInBlankExercise.tsx
│   │   ├── PictureMatchExercise.tsx
│   │   ├── SentenceBuildExercise.tsx
│   │   └── ExerciseWrapper.tsx
│   ├── lesson/                   # Lesson components
│   │   ├── LessonIntro.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── FeedbackModal.tsx
│   │   └── CompletionScreen.tsx
│   ├── skill-tree/               # Skill tree components
│   │   ├── SkillTree.tsx
│   │   ├── SkillNode.tsx
│   │   └── SkillPath.tsx
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   └── ...
│   ├── animations/               # Framer Motion animations
│   │   ├── Confetti.tsx
│   │   ├── LevelUp.tsx
│   │   └── SuccessAnimation.tsx
│   └── shared/                   # Shared components
│       ├── Header.tsx
│       ├── Navigation.tsx
│       └── LoadingSpinner.tsx
│
├── lib/                          # Utilities & Logic
│   ├── supabase/                 # Supabase client
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── types.ts              # Database types
│   ├── content/                  # Content management
│   │   ├── loader.ts             # Load lesson content
│   │   ├── types.ts              # Content types
│   │   └── validator.ts          # Validate answers
│   ├── exercises/                # Exercise logic
│   │   ├── translation.ts
│   │   ├── fillInBlank.ts
│   │   ├── pictureMatch.ts
│   │   └── sentenceBuild.ts
│   ├── progress/                 # Progress tracking
│   │   ├── xp-calculator.ts
│   │   ├── level-system.ts
│   │   └── spaced-repetition.ts
│   ├── stores/                   # Zustand stores
│   │   ├── lesson-store.ts
│   │   ├── user-store.ts
│   │   └── ui-store.ts
│   └── utils/                    # Utility functions
│       ├── cn.ts                 # className utility
│       └── formatters.ts
│
├── hooks/                        # Custom React hooks
│   ├── use-lesson.ts             # Lesson logic hook
│   ├── use-progress.ts           # Progress queries
│   ├── use-auth.ts               # Auth state
│   └── use-sound.ts              # Sound effects
│
├── data/                         # Static content
│   ├── skills.json               # Skill tree
│   ├── vocabulary.json           # All vocabulary
│   └── lessons/                  # Lesson JSON files
│       ├── basics-1-1.json
│       └── ...
│
├── public/                       # Static assets
│   ├── audio/                    # Audio files
│   │   ├── vocabulary/
│   │   └── sentences/
│   ├── images/                   # Images
│   │   ├── vocabulary/
│   │   ├── illustrations/
│   │   └── icons/
│   ├── icons/                    # PWA icons
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── manifest.json             # PWA manifest
│   └── sw.js                     # Service worker
│
├── scripts/                      # Build & generation
│   ├── generate-content.ts       # AI content generation
│   ├── validate-content.ts       # Content validation
│   └── setup-db.ts               # Database setup
│
├── types/                        # TypeScript types
│   ├── content.ts                # Content types
│   ├── exercises.ts              # Exercise types
│   ├── user.ts                   # User types
│   └── database.ts               # Supabase types
│
├── .env.local                    # Environment variables
├── next.config.js                # Next.js config
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json
```

### Deployment & DevOps

#### Hosting

- **Vercel** (Recommended)
  - Seamless Next.js integration
  - Automatic deployments from Git
  - Edge network (CDN)
  - Serverless functions
  - Environment variables
  - Free SSL/HTTPS
  - Preview deployments for PRs

#### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI (for content generation)
OPENAI_API_KEY=

# App Config
NEXT_PUBLIC_APP_URL=
```

#### CI/CD Pipeline

- GitHub Actions or Vercel Git integration
- Automated testing (Phase 2)
- Content validation on PR
- Automatic deployments to production

### Performance Optimization

#### Next.js Optimizations

- Static generation for content pages
- Image optimization (next/image)
- Font optimization (next/font)
- Code splitting and lazy loading
- Bundle size analysis

#### Data Fetching

- TanStack Query caching
- Prefetching next lessons
- Stale-while-revalidate strategy
- Optimistic updates for instant feedback

#### PWA Caching Strategy

- **Precache**: Core app shell, CSS, JS
- **Cache First**: Images, audio files
- **Network First**: API calls with fallback
- **Background Sync**: Progress updates when offline

---

## User Experience Flow (Draft)

### 1. Landing Page

- Overview of Frysian language
- Call to action to start learning
- Demo/preview of the app

### 2. Onboarding

- [Optional] User registration/login
- Goal setting (e.g., 5 min/day, 15 min/day)
- Initial placement test or start from beginning

### 3. Learning Interface

- Lesson selection screen
- Exercise screen with:
  - Question prompt
  - Answer input/selection
  - Feedback on correctness
  - Progress indicator
  - Exit/pause options

### 4. Progress Tracking

- Dashboard showing:
  - Current streak
  - XP/level
  - Lessons completed
  - Statistics

---

## MVP Scope (Minimum Viable Product)

### Phase 1: Core Learning Experience (MVP Launch)

**Timeline: 6-8 weeks**

#### Must-Have Features

- [x] **Content Structure**
  - 8-12 skills in skill tree
  - 3-5 lessons per skill (~40-50 total lessons)
  - AI-generated content (pre-generated JSON files)
- [x] **Exercise Types**
  - Translation exercises (Dutch → Frysian)
  - Fill-in-the-blank
  - Picture matching
  - Sentence building
- [x] **Lesson Flow**
  - Teaching phase (intro cards)
  - 10 questions per lesson
  - Feedback system (2 attempts)
  - Completion screen with celebration
- [x] **Gamification**
  - XP system with levels
  - Progress bars
  - Celebration animations
  - Statistics dashboard
- [x] **User Accounts**
  - Authentication (Supabase)
  - Progress tracking across devices
  - User profiles
- [x] **Technical Foundation**
  - Next.js 14 with App Router
  - Tailwind CSS + shadcn/ui
  - Zustand + TanStack Query
  - Supabase backend
  - PWA support
- [x] **Mobile Experience**
  - Responsive design
  - Touch-optimized
  - PWA installable
  - Offline lesson caching

#### Nice-to-Have (if time permits)

- [ ] Audio support (TTS)
- [ ] Dark mode
- [ ] Multiple language UI (English/Dutch interface)

### Phase 2: Enhanced Learning (Post-MVP)

**Timeline: 4-6 weeks after MVP**

- [ ] **Audio Integration**
  - Text-to-speech for all vocabulary
  - Audio exercises (listening comprehension)
  - Pronunciation feedback
- [ ] **Advanced Gamification**
  - Daily streaks
  - Achievement badges
  - Weekly leaderboards
  - Friend challenges
- [ ] **Spaced Repetition Optimization**
  - Enhanced algorithm
  - Personalized review scheduling
  - Weak word practice sessions
- [ ] **Content Expansion**
  - Additional skills and lessons
  - More advanced grammar
  - Conversational scenarios
- [ ] **Quality Improvements**
  - Native audio recordings
  - Professional illustrations
  - Enhanced animations

### Phase 3: Community & Management (Future)

**Timeline: 3-6 months after MVP**

- [ ] **Content Management System**
  - Admin panel for content editing
  - Review queue for AI content
  - Version control and approval workflow
  - Native speaker verification system
- [ ] **Community Features**
  - Discussion forums
  - User-contributed content
  - Correction suggestions
  - Learning groups
- [ ] **Advanced Features**
  - Speaking exercises with speech recognition
  - Video lessons
  - Live tutoring integration
  - Mobile native apps (React Native)
- [ ] **Analytics & Optimization**
  - A/B testing platform
  - Learning analytics dashboard
  - Personalized learning paths
  - AI-powered recommendations

---

## Content Requirements

### Vocabulary Lists

- [ ] How many words/phrases for MVP?
- [ ] Categories/topics to cover
- [ ] Translations and example sentences

### Grammar Concepts

- [ ] Basic grammar rules to teach
- [ ] Order of introduction

### Audio Assets

- [ ] Source of Frysian audio
- [ ] Quality requirements

---

## Design Considerations

### Mobile-First Approach

- Touch-friendly interface
- Large buttons and input areas
- Swipe gestures?
- Thumb-reachable navigation

### Accessibility

- Screen reader support
- High contrast mode
- Adjustable font sizes
- Keyboard navigation

### Performance

- Fast page loads
- Smooth animations
- Optimized images and assets

## Implementation Roadmap

### Week 1-2: Project Setup & Infrastructure

- [ ] **Project Initialization**
  - Set up Next.js 14 project with TypeScript
  - Configure Tailwind CSS and shadcn/ui
  - Set up ESLint, Prettier, Git hooks
  - Configure PWA with next-pwa
- [ ] **Supabase Setup**
  - Create Supabase project
  - Design and implement database schema
  - Set up Row Level Security (RLS) policies
  - Configure authentication providers
  - Test database connections
- [ ] **Core Architecture**

  - Set up Zustand stores structure
  - Configure TanStack Query
  - Create base API routes
  - Set up environment variables
  - Create TypeScript types for content and database

- [ ] **Content Generation**
  - Write AI content generation script
  - Generate initial skill tree structure
  - Generate first 10 lessons (Basics 1-2)
  - Review and validate generated content
  - Set up content loading utilities

### Week 3-4: Core Components & UI

- [ ] **Layout & Navigation**
  - Create responsive layout
  - Header with user info/login
  - Bottom navigation for mobile
  - Loading states and error boundaries
- [ ] **Authentication UI**
  - Login/Signup pages
  - Password reset flow
  - Protected routes
  - User profile page
- [ ] **Skill Tree Interface**
  - Skill tree visualization
  - Skill nodes (locked/unlocked/completed)
  - Progress indicators
  - Skill selection and navigation
- [ ] **Design System**
  - Color palette and theming
  - Typography scale
  - Spacing system
  - Component variants

### Week 5-6: Exercise Components

- [ ] **Exercise Framework**
  - Lesson state management
  - Question navigation
  - Answer validation logic
  - Feedback system (2 attempts)
  - Progress tracking within lesson
- [ ] **Exercise Types**
  - Translation exercise component
  - Fill-in-the-blank component
  - Picture matching component
  - Sentence building component
  - Exercise wrapper with consistent UI
- [ ] **Lesson Flow**
  - Intro cards (teaching phase)
  - Question card layout
  - Answer input handling
  - Feedback modals (correct/incorrect)
  - Hint/tooltip system
  - Completion screen

### Week 7-8: Gamification & Polish

- [ ] **XP & Levels System**
  - XP calculation logic
  - Level progression system
  - XP display in UI
  - Level-up detection
- [ ] **Animations**
  - Success animations (correct answer)
  - Error shake (incorrect answer)
  - Confetti for lesson completion
  - Level-up celebration
  - Smooth transitions
- [ ] **Progress Tracking**
  - Save lesson completion to Supabase
  - Update word progress
  - Calculate statistics
  - Dashboard with stats
  - Progress bars throughout UI
- [ ] **Content Completion**
  - Generate remaining lessons (40-50 total)
  - Add vocabulary images
  - Review all content
  - Test all exercise variations

### Week 9-10: Testing & Refinement

- [ ] **Testing**
  - Manual testing on mobile devices
  - Test all exercise types
  - Test progress tracking
  - Test offline functionality (PWA)
  - Cross-browser testing
- [ ] **Performance Optimization**
  - Optimize images and assets
  - Test loading times
  - Implement lazy loading
  - Bundle size analysis
  - Lighthouse audit
- [ ] **Bug Fixes & Polish**
  - Fix reported issues
  - Improve animations
  - Refine copy and messaging
  - Add loading states
  - Error handling improvements
- [ ] **Documentation**
  - README with setup instructions
  - Contributing guidelines
  - Code documentation
  - Deployment guide

### Week 11-12: Launch Preparation

- [ ] **Deployment**
  - Set up Vercel project
  - Configure environment variables
  - Set up custom domain (if available)
  - Enable analytics
  - Test production build
- [ ] **Launch Assets**
  - Create landing page copy
  - App screenshots
  - Demo video
  - Social media assets
- [ ] **Soft Launch**
  - Deploy to production
  - Test with small group of users
  - Gather initial feedback
  - Monitor errors and performance
- [ ] **Official Launch**
  - Public announcement
  - Share on relevant platforms
  - Monitor user feedback
  - Begin Phase 2 planning

---

## Technical Decisions Summary

### ✅ Decided

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State**: Zustand (client) + TanStack Query (server)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Content**: Pre-generated JSON files with AI
- **Deployment**: Vercel
- **PWA**: Enabled from start
- **Exercise Types**: Translation, Fill-in-blank, Picture match, Sentence build
- **Skill Tree**: Duolingo-style with 8-12 skills
- **Gamification**: XP, levels, celebrations (no streaks/leaderboards in MVP)

### 📋 To Be Decided Later

- Audio provider (Google TTS vs Azure vs custom)
- Image source strategy (stock vs AI-generated vs custom)
- Analytics platform (Vercel Analytics vs Google Analytics vs PostHog)
- Testing framework (Jest + React Testing Library vs Vitest)
- Error monitoring (Sentry vs LogRocket)

---

## Content Requirements

### For Content Generation Script

To generate quality lesson content, the AI script will need:

1. **Frysian-Dutch Translation Pairs**
   - Common vocabulary (500-1000 words for MVP)
   - Everyday phrases
   - Grammar examples
2. **Context for Each Skill**
   - Topic/theme (e.g., "Family", "Food")
   - Difficulty level
   - Grammar concepts to introduce
   - Target vocabulary count
3. **Exercise Templates**
   - Question patterns for each exercise type
   - Distractor generation rules
   - Answer validation rules
4. **Quality Criteria**
   - Natural Dutch sentences
   - Accurate Frysian translations
   - Appropriate difficulty progression
   - Cultural relevance

### Content Validation Checklist

- [ ] Frysian spelling and grammar correct
- [ ] Dutch translations accurate
- [ ] Difficulty appropriate for lesson position
- [ ] No offensive or inappropriate content
- [ ] Images match vocabulary (for picture matching)
- [ ] Sentences use previously taught vocabulary
- [ ] Grammar explanations clear and helpful

---

## Design Considerations

### Color Palette (Suggested)

```css
Primary: #3b82f6    /* Blue - trust, learning */
Success: #10b981    /* Green - correct answers */
Error: #ef4444      /* Red - incorrect answers */
Warning: #f59e0b    /* Orange - hints */
Neutral: #6b7280    /* Gray - secondary content */
Background: #f9fafb /* Light gray */
```

### Typography

- **Headings**: Inter or Plus Jakarta Sans (modern, friendly)
- **Body**: Inter or System fonts (readable)
- **Frysian text**: Slightly larger, bold for emphasis

### Accessibility

- [ ] WCAG AA compliance minimum
- [ ] Keyboard navigation support
- [ ] Screen reader friendly
- [ ] High contrast mode
- [ ] Focus indicators
- [ ] Alt text for images
- [ ] ARIA labels

### Mobile-First Breakpoints

```css
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
```

---

## Success Metrics (Post-Launch)

### User Engagement

- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average session duration
- Lessons completed per user
- Retention rate (Day 1, Day 7, Day 30)

### Learning Effectiveness

- Lesson completion rate
- Exercise accuracy rate
- Time to complete lessons
- Words learned per user
- Weak word improvement rate

### Technical Performance

- Page load time
- Time to Interactive (TTI)
- Lighthouse score (>90)
- API response times
- Error rate
- PWA install rate

---

## Risk Assessment

### Technical Risks

| Risk                         | Impact | Probability | Mitigation                                     |
| ---------------------------- | ------ | ----------- | ---------------------------------------------- |
| AI-generated content quality | High   | Medium      | Manual review process, validation scripts      |
| Supabase scaling issues      | Medium | Low         | Start with free tier, monitor usage            |
| PWA offline complexity       | Medium | Medium      | Incremental implementation, good documentation |
| Answer validation edge cases | Medium | High        | Comprehensive testing, fuzzy matching          |

### Product Risks

| Risk                      | Impact | Probability | Mitigation                        |
| ------------------------- | ------ | ----------- | --------------------------------- |
| Low user retention        | High   | Medium      | Focus on gamification, quick wins |
| Content not engaging      | High   | Medium      | User testing, iterate on feedback |
| Too complex for beginners | Medium | Medium      | Clear onboarding, tooltips        |
| Not enough content        | Medium | Low         | Plan for 40-50 lessons in MVP     |

---

## Open Questions & Decisions Needed

### Before Development Starts

- [ ] Choose specific Frysian dialect (West Frisian standard?)
- [ ] Define app name and branding
- [ ] Decide on audio provider
- [ ] Select image sources/strategy
- [ ] Determine analytics platform

### During Development

- [ ] Finalize exact skill progression
- [ ] Review AI-generated content quality
- [ ] Test answer validation accuracy
- [ ] Decide on dark mode priority
- [ ] Choose error monitoring tool

---

## Next Immediate Steps

1. **Create Next.js project**: `npx create-next-app@latest frysian-duolingo`
2. **Install dependencies**: Tailwind, shadcn/ui, Supabase, TanStack Query, Zustand, Framer Motion
3. **Initialize Supabase project**: Create account, set up database
4. **Set up project structure**: Folders, base files, TypeScript config
5. **Write content generation script**: Start with Basics 1 skill
6. **Build first components**: Layout, SkillTree, basic UI
7. **Implement first exercise type**: Translation exercise
8. **Set up authentication**: Supabase Auth integration
9. **Deploy preview**: Get it on Vercel early for testing

**Ready to start building?** 🚀

# Frysian Language Learner - Project Todos

This file tracks the development progress and remaining tasks. Updated regularly during development.

## Core Infrastructure (Priority 1)

- [x] **1. Set up Supabase database schema**
  - Create database tables for users, lessons, progress, vocabulary, and XP tracking
  - Run setup-db.sql in Supabase dashboard
  - Tables: profiles, user_progress, word_progress, lesson_attempts

- [x] **2. Implement Row Level Security (RLS) policies**
  - Configure Supabase RLS to ensure users can only access their own data
  - Restrict access to profiles, lesson_progress, and user stats based on auth.uid()

- [x] **3. Track exercise accuracy in LessonClient**
  - Track correct/incorrect answers per exercise
  - Track which vocabulary words the user struggled with (weak words)
  - Pass accuracy data to results page and API

## Core Features (Priority 2)

- [x] **4. Build Skill Tree component with database**
  - Connect SkillTree.tsx to fetch user progress from Supabase
  - Show locked/unlocked/completed states based on prerequisites
  - Display user's completed skills visually

- [x] **5. Enhance results page after lesson**
  - Display accuracy percentage
  - Show weak words list (words to review)
  - Perfect lesson indicator with bonus XP
  - Confetti animation on completion
  - Level-up celebration modal

- [x] **6. Implement XP and leveling system**
  - Base XP per question (10 XP correct, 5 XP retry)
  - Lesson completion bonus (+50 XP)
  - Perfect lesson bonus (+25 XP)
  - Level calculation based on total XP

- [x] **7. Add celebration animations**
  - Confetti animation on lesson completion (Confetti.tsx)
  - Level-up celebration modal (LevelUpAnimation.tsx)
  - Success/shake animations (SuccessAnimation.tsx)

## Content & Polish (Priority 3)

- [x] **8. Add audio playback to IntroCard**
  - Web Speech API as fallback for TTS
  - Support for pre-recorded audio files when available
  - Dutch voice selection for closest pronunciation

- [ ] **9. Generate remaining lesson content**
  - Use generate-content.js script to create lesson files
  - Generate: basics-2 (4), numbers (4), family (4), colors (4), food (4), actions (4)
  - Total: ~50 lessons with exercises

- [x] **10. Create user dashboard**
  - Level and XP progress bar
  - Stats grid (lessons, skills, accuracy, weak words count)
  - Weak words section with words to practice
  - Recent activity feed
  - Dashboard link in header navigation

- [x] **11. Mobile navigation**
  - Bottom navigation bar for mobile devices
  - Hidden during lesson flow
  - Links to Learn and Dashboard

---

## Progress Summary

**Completed**: 10 / 11 items
**In Progress**: 0 / 11 items
**Not Started**: 1 / 11 items (Content generation)

## What's Implemented

### Pages
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page
- `/learn` - Skill tree with lesson selection
- `/learn/skill/[skillId]` - Skill detail page
- `/learn/lesson/[lessonId]` - Lesson flow with exercises
- `/learn/lesson/[lessonId]/results` - Results with confetti & stats
- `/dashboard` - User statistics and progress

### Components
- 4 Exercise types: Translation, Fill-in-blank, Multiple-choice, Sentence-build
- Skill tree with progress tracking
- Intro cards with audio playback
- Celebration animations (confetti, level-up)
- Mobile bottom navigation
- Responsive header with auth state

### Backend
- Supabase auth (email/password)
- Database tables with RLS
- API routes for lesson completion
- Progress and weak word tracking

Last updated: December 3, 2025

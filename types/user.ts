// User profile and progress types

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  currentLevel: number;
  totalXP: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProgress {
  userId: string;
  skillId: string;
  lessonId: string;
  completed: boolean;
  accuracy: number; // 0-100
  xpEarned: number;
  completedAt?: Date;
}

export interface WordProgress {
  userId: string;
  wordId: string;
  strength: 1 | 2 | 3 | 4 | 5;
  correctCount: number;
  incorrectCount: number;
  lastPracticed: Date;
  nextReview: Date;
}

export interface LessonAttempt {
  id: string;
  userId: string;
  lessonId: string;
  questionsAnswered: number;
  questionsCorrect: number;
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface UserStats {
  totalXP: number;
  currentLevel: number;
  lessonsCompleted: number;
  wordsLearned: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  xpToNext: number;
  progress: number; // 0-100
}

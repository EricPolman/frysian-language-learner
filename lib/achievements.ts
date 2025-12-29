// Achievement system for Frisian Language Learner

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon name
  category: 'lessons' | 'xp' | 'streak' | 'accuracy' | 'special';
  requirement: {
    type: 'lessons_completed' | 'xp_earned' | 'streak_days' | 'perfect_lessons' | 'words_learned' | 'skill_completed';
    value: number;
  };
  xpReward: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Lesson Achievements
  {
    id: 'first_lesson',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 1 },
    xpReward: 25,
  },
  {
    id: 'lessons_5',
    title: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 5 },
    xpReward: 50,
  },
  {
    id: 'lessons_10',
    title: 'Committed Learner',
    description: 'Complete 10 lessons',
    icon: '📖',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 10 },
    xpReward: 100,
  },
  {
    id: 'lessons_25',
    title: 'Dedicated Student',
    description: 'Complete 25 lessons',
    icon: '🎓',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 25 },
    xpReward: 250,
  },
  {
    id: 'lessons_50',
    title: 'Master Student',
    description: 'Complete 50 lessons',
    icon: '🏆',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 50 },
    xpReward: 500,
  },

  // XP Achievements
  {
    id: 'xp_100',
    title: 'Century',
    description: 'Earn 100 XP',
    icon: '💯',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 100 },
    xpReward: 25,
  },
  {
    id: 'xp_500',
    title: 'Rising Star',
    description: 'Earn 500 XP',
    icon: '⭐',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 500 },
    xpReward: 50,
  },
  {
    id: 'xp_1000',
    title: 'Thousand Club',
    description: 'Earn 1,000 XP',
    icon: '🌟',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 1000 },
    xpReward: 100,
  },
  {
    id: 'xp_5000',
    title: 'XP Master',
    description: 'Earn 5,000 XP',
    icon: '💫',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 5000 },
    xpReward: 500,
  },

  // Streak Achievements
  {
    id: 'streak_3',
    title: 'Warming Up',
    description: 'Practice 3 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 3 },
    xpReward: 50,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Practice 7 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
    xpReward: 100,
  },
  {
    id: 'streak_14',
    title: 'Two Week Champion',
    description: 'Practice 14 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 14 },
    xpReward: 200,
  },
  {
    id: 'streak_30',
    title: 'Monthly Master',
    description: 'Practice 30 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 },
    xpReward: 500,
  },
  {
    id: 'streak_100',
    title: 'Unstoppable',
    description: 'Practice 100 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 100 },
    xpReward: 1000,
  },

  // Perfect Lesson Achievements
  {
    id: 'perfect_1',
    title: 'Perfectionist',
    description: 'Complete a lesson with 100% accuracy',
    icon: '✨',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 1 },
    xpReward: 50,
  },
  {
    id: 'perfect_5',
    title: 'Precision Expert',
    description: 'Complete 5 perfect lessons',
    icon: '💎',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 5 },
    xpReward: 100,
  },
  {
    id: 'perfect_10',
    title: 'Flawless',
    description: 'Complete 10 perfect lessons',
    icon: '👑',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 10 },
    xpReward: 250,
  },

  // Word Learning Achievements
  {
    id: 'words_10',
    title: 'Word Collector',
    description: 'Learn 10 words',
    icon: '📝',
    category: 'special',
    requirement: { type: 'words_learned', value: 10 },
    xpReward: 25,
  },
  {
    id: 'words_50',
    title: 'Vocabulary Builder',
    description: 'Learn 50 words',
    icon: '📚',
    category: 'special',
    requirement: { type: 'words_learned', value: 50 },
    xpReward: 100,
  },
  {
    id: 'words_100',
    title: 'Word Master',
    description: 'Learn 100 words',
    icon: '📖',
    category: 'special',
    requirement: { type: 'words_learned', value: 100 },
    xpReward: 250,
  },

  // Skill Completion
  {
    id: 'first_skill',
    title: 'Skill Unlocked',
    description: 'Complete your first skill',
    icon: '🎯',
    category: 'special',
    requirement: { type: 'skill_completed', value: 1 },
    xpReward: 100,
  },
  {
    id: 'skills_3',
    title: 'Triple Threat',
    description: 'Complete 3 skills',
    icon: '🎖️',
    category: 'special',
    requirement: { type: 'skill_completed', value: 3 },
    xpReward: 200,
  },
  {
    id: 'skills_5',
    title: 'Skill Master',
    description: 'Complete 5 skills',
    icon: '👑',
    category: 'special',
    requirement: { type: 'skill_completed', value: 5 },
    xpReward: 500,
  },
];

// Check which achievements a user has earned based on their stats
export function checkAchievements(stats: {
  lessonsCompleted: number;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  perfectLessons: number;
  wordsLearned: number;
  skillsCompleted: number;
}): string[] {
  const earnedAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    const { type, value } = achievement.requirement;
    
    let isEarned = false;
    switch (type) {
      case 'lessons_completed':
        isEarned = stats.lessonsCompleted >= value;
        break;
      case 'xp_earned':
        isEarned = stats.totalXp >= value;
        break;
      case 'streak_days':
        isEarned = stats.longestStreak >= value;
        break;
      case 'perfect_lessons':
        isEarned = stats.perfectLessons >= value;
        break;
      case 'words_learned':
        isEarned = stats.wordsLearned >= value;
        break;
      case 'skill_completed':
        isEarned = stats.skillsCompleted >= value;
        break;
    }

    if (isEarned) {
      earnedAchievements.push(achievement.id);
    }
  }

  return earnedAchievements;
}

// Get achievement by ID
export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

// Get achievements by category
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}

// Calculate progress towards an achievement (0-100)
export function getAchievementProgress(achievement: Achievement, currentValue: number): number {
  const progress = (currentValue / achievement.requirement.value) * 100;
  return Math.min(100, Math.max(0, progress));
}

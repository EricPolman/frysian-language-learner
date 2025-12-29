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
    title: 'Eerste Stappen',
    description: 'Voltooi je eerste les',
    icon: '🎯',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 1 },
    xpReward: 25,
  },
  {
    id: 'lessons_5',
    title: 'Aan de Slag',
    description: 'Voltooi 5 lessen',
    icon: '📚',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 5 },
    xpReward: 50,
  },
  {
    id: 'lessons_10',
    title: 'Toegewijde Leerling',
    description: 'Voltooi 10 lessen',
    icon: '📖',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 10 },
    xpReward: 100,
  },
  {
    id: 'lessons_25',
    title: 'Toegewijde Student',
    description: 'Voltooi 25 lessen',
    icon: '🎓',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 25 },
    xpReward: 250,
  },
  {
    id: 'lessons_50',
    title: 'Meesterstudent',
    description: 'Voltooi 50 lessen',
    icon: '🏆',
    category: 'lessons',
    requirement: { type: 'lessons_completed', value: 50 },
    xpReward: 500,
  },

  // XP Prestaties
  {
    id: 'xp_100',
    title: 'Eerste Honderd',
    description: 'Verdien 100 XP',
    icon: '💯',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 100 },
    xpReward: 25,
  },
  {
    id: 'xp_500',
    title: 'Rijzende Ster',
    description: 'Verdien 500 XP',
    icon: '⭐',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 500 },
    xpReward: 50,
  },
  {
    id: 'xp_1000',
    title: 'Duizend Club',
    description: 'Verdien 1.000 XP',
    icon: '🌟',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 1000 },
    xpReward: 100,
  },
  {
    id: 'xp_5000',
    title: 'XP Meester',
    description: 'Verdien 5.000 XP',
    icon: '💫',
    category: 'xp',
    requirement: { type: 'xp_earned', value: 5000 },
    xpReward: 500,
  },

  // Reeks Prestaties
  {
    id: 'streak_3',
    title: 'Opwarmen',
    description: 'Oefen 3 dagen achter elkaar',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 3 },
    xpReward: 50,
  },
  {
    id: 'streak_7',
    title: 'Weekstrijder',
    description: 'Oefen 7 dagen achter elkaar',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 7 },
    xpReward: 100,
  },
  {
    id: 'streak_14',
    title: 'Twee Weken Kampioen',
    description: 'Oefen 14 dagen achter elkaar',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 14 },
    xpReward: 200,
  },
  {
    id: 'streak_30',
    title: 'Maandmeester',
    description: 'Oefen 30 dagen achter elkaar',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 30 },
    xpReward: 500,
  },
  {
    id: 'streak_100',
    title: 'Onstuitbaar',
    description: 'Oefen 100 dagen achter elkaar',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak_days', value: 100 },
    xpReward: 1000,
  },

  // Perfecte Les Prestaties
  {
    id: 'perfect_1',
    title: 'Perfectionist',
    description: 'Voltooi een les met 100% nauwkeurigheid',
    icon: '✨',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 1 },
    xpReward: 50,
  },
  {
    id: 'perfect_5',
    title: 'Precisie Expert',
    description: 'Voltooi 5 perfecte lessen',
    icon: '💎',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 5 },
    xpReward: 100,
  },
  {
    id: 'perfect_10',
    title: 'Foutloos',
    description: 'Voltooi 10 perfecte lessen',
    icon: '👑',
    category: 'accuracy',
    requirement: { type: 'perfect_lessons', value: 10 },
    xpReward: 250,
  },

  // Woorden Leren Prestaties
  {
    id: 'words_10',
    title: 'Woordenverzamelaar',
    description: 'Leer 10 woorden',
    icon: '📝',
    category: 'special',
    requirement: { type: 'words_learned', value: 10 },
    xpReward: 25,
  },
  {
    id: 'words_50',
    title: 'Woordenschatbouwer',
    description: 'Leer 50 woorden',
    icon: '📚',
    category: 'special',
    requirement: { type: 'words_learned', value: 50 },
    xpReward: 100,
  },
  {
    id: 'words_100',
    title: 'Woordenmeester',
    description: 'Leer 100 woorden',
    icon: '📖',
    category: 'special',
    requirement: { type: 'words_learned', value: 100 },
    xpReward: 250,
  },

  // Vaardigheid Voltooiing
  {
    id: 'first_skill',
    title: 'Vaardigheid Ontgrendeld',
    description: 'Voltooi je eerste vaardigheid',
    icon: '🎯',
    category: 'special',
    requirement: { type: 'skill_completed', value: 1 },
    xpReward: 100,
  },
  {
    id: 'skills_3',
    title: 'Drievoudige Dreiging',
    description: 'Voltooi 3 vaardigheden',
    icon: '🎖️',
    category: 'special',
    requirement: { type: 'skill_completed', value: 3 },
    xpReward: 200,
  },
  {
    id: 'skills_5',
    title: 'Vaardigheidsmeester',
    description: 'Voltooi 5 vaardigheden',
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

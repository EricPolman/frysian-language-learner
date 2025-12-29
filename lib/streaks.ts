// Streak tracking utilities for Frisian Language Learner

/**
 * Calculate the updated streak based on last practice date
 * @param lastPracticeDate - The date of the last practice (YYYY-MM-DD format)
 * @param currentStreak - Current streak count
 * @returns Updated streak count
 */
export function calculateStreak(
  lastPracticeDate: string | null,
  currentStreak: number
): number {
  if (!lastPracticeDate) {
    // First time practicing
    return 1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPractice = new Date(lastPracticeDate);
  lastPractice.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastPractice.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Practiced today already
    return currentStreak;
  } else if (diffDays === 1) {
    // Practiced yesterday, increment streak
    return currentStreak + 1;
  } else {
    // Streak broken, start fresh
    return 1;
  }
}

/**
 * Check if user practiced today
 * @param lastPracticeDate - The date of the last practice (YYYY-MM-DD format)
 * @returns true if practiced today
 */
export function practicedToday(lastPracticeDate: string | null): boolean {
  if (!lastPracticeDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPractice = new Date(lastPracticeDate);
  lastPractice.setHours(0, 0, 0, 0);
  
  return today.getTime() === lastPractice.getTime();
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Calculate days until streak is lost
 * @param lastPracticeDate - The date of the last practice (YYYY-MM-DD format)
 * @returns Number of days until streak is lost (0 = today, -1 = already lost)
 */
export function daysUntilStreakLost(lastPracticeDate: string | null): number {
  if (!lastPracticeDate) return -1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastPractice = new Date(lastPracticeDate);
  lastPractice.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastPractice.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 1; // Already practiced today, have until tomorrow
  } else if (diffDays === 1) {
    return 0; // Last practiced yesterday, must practice today
  } else {
    return -1; // Streak already lost
  }
}

/**
 * Get streak status message
 */
export function getStreakStatus(
  currentStreak: number,
  lastPracticeDate: string | null
): string {
  const daysUntil = daysUntilStreakLost(lastPracticeDate);
  
  if (currentStreak === 0) {
    return "Start your streak today!";
  } else if (daysUntil === 1) {
    return `${currentStreak} day streak! Keep it going tomorrow!`;
  } else if (daysUntil === 0) {
    return `${currentStreak} day streak! Practice today to keep it alive!`;
  } else if (daysUntil === -1) {
    return "Your streak ended. Start a new one!";
  }
  
  return `${currentStreak} day streak!`;
}

/**
 * Level calculation utilities with progressive XP scaling
 * 
 * XP required per level (progressive scaling):
 * Level 1 → 2:   100 XP
 * Level 2 → 3:   150 XP
 * Level 3 → 4:   200 XP
 * Level 4 → 5:   275 XP
 * Level 5 → 6:   350 XP
 * Level 6 → 7:   450 XP
 * ...and so on
 * 
 * Formula: XP for level N = 100 + (N-1) * 50 + floor((N-1)/3) * 25
 */

/**
 * Get the XP required to reach a specific level from level 1
 */
export function getTotalXPForLevel(level: number): number {
  if (level <= 1) return 0;
  
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += getXPRequiredForLevel(i);
  }
  return totalXP;
}

/**
 * Get the XP required to go from level N to level N+1
 */
export function getXPRequiredForLevel(level: number): number {
  // Base: 100 XP for level 1→2
  // Progressive increase: +50 XP per level
  // Extra bonus every 3 levels: +25 XP
  const base = 100;
  const perLevel = 50;
  const bonusEvery3Levels = Math.floor((level - 1) / 3) * 25;
  
  return base + (level - 1) * perLevel + bonusEvery3Levels;
}

/**
 * Calculate the user's level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  let xpRequired = 0;
  
  while (true) {
    const xpForNextLevel = getXPRequiredForLevel(level);
    if (xpRequired + xpForNextLevel > totalXP) {
      break;
    }
    xpRequired += xpForNextLevel;
    level++;
  }
  
  return level;
}

/**
 * Get progress towards the next level (0-100)
 */
export function getLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpAtCurrentLevel = getTotalXPForLevel(currentLevel);
  const xpForNextLevel = getXPRequiredForLevel(currentLevel);
  const xpIntoCurrentLevel = totalXP - xpAtCurrentLevel;
  
  return Math.min(100, Math.max(0, (xpIntoCurrentLevel / xpForNextLevel) * 100));
}

/**
 * Get XP remaining until next level
 */
export function getXPUntilNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  const xpAtCurrentLevel = getTotalXPForLevel(currentLevel);
  const xpForNextLevel = getXPRequiredForLevel(currentLevel);
  const xpIntoCurrentLevel = totalXP - xpAtCurrentLevel;
  
  return xpForNextLevel - xpIntoCurrentLevel;
}

/**
 * Level thresholds for reference (pre-calculated)
 * Level 1:    0 XP
 * Level 2:  100 XP
 * Level 3:  250 XP
 * Level 4:  450 XP
 * Level 5:  700 XP
 * Level 6: 1025 XP
 * Level 7: 1400 XP
 * Level 8: 1850 XP
 * Level 9: 2350 XP
 * Level 10: 2925 XP
 */

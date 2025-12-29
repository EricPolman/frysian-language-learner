"use client";

import { Achievement, getAchievement } from "@/lib/achievements";
import { motion } from "framer-motion";

interface AchievementBadgeProps {
  achievementId: string;
  unlocked: boolean;
  unlockedAt?: string;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
}

export function AchievementBadge({
  achievementId,
  unlocked,
  unlockedAt,
  size = "md",
  showDetails = false,
}: AchievementBadgeProps) {
  const achievement = getAchievement(achievementId);

  if (!achievement) {
    return null;
  }

  const sizeClasses = {
    sm: "w-16 h-16 text-2xl",
    md: "w-20 h-20 text-3xl",
    lg: "w-24 h-24 text-4xl",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        whileHover={unlocked ? { scale: 1.05 } : {}}
        className={`
          ${sizeClasses[size]} rounded-full 
          flex items-center justify-center
          ${
            unlocked
              ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg"
              : "bg-gray-200 opacity-50"
          }
          transition-all relative
        `}
      >
        <span className={unlocked ? "" : "grayscale opacity-40"}>
          {achievement.icon}
        </span>
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-full">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        )}
      </motion.div>
      
      {showDetails && (
        <div className="text-center max-w-[120px]">
          <p className={`font-semibold text-sm ${unlocked ? "text-gray-900" : "text-gray-500"}`}>
            {achievement.title}
          </p>
          <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
          {unlocked && unlockedAt && (
            <p className="text-xs text-gray-400 mt-1">
              {new Date(unlockedAt).toLocaleDateString()}
            </p>
          )}
          {!unlocked && (
            <p className="text-xs text-blue-600 font-semibold mt-1">
              +{achievement.xpReward} XP
            </p>
          )}
        </div>
      )}
    </div>
  );
}

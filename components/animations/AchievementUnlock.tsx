"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { getAchievement } from "@/lib/achievements";
import { Confetti } from "@/components/animations/Confetti";

interface AchievementUnlockProps {
  achievementIds: string[];
  onClose: () => void;
}

export function AchievementUnlock({ achievementIds, onClose }: AchievementUnlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (achievementIds.length === 0) {
      onClose();
      return;
    }

    // Auto-advance through achievements
    if (currentIndex < achievementIds.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Close after showing last achievement
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, achievementIds.length, onClose]);

  if (achievementIds.length === 0) {
    return null;
  }

  const achievement = getAchievement(achievementIds[currentIndex]);

  if (!achievement) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <Confetti isActive={showConfetti} />
        
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="inline-block w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-6xl shadow-lg mb-6">
                {achievement.icon}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Achievement Unlocked!
              </h2>
              <h3 className="text-2xl font-semibold text-blue-600 mb-3">
                {achievement.title}
              </h3>
              <p className="text-gray-600 mb-6">{achievement.description}</p>
              
              <div className="inline-block bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-bold text-lg">
                +{achievement.xpReward} XP Bonus
              </div>
            </motion.div>

            {achievementIds.length > 1 && (
              <div className="mt-6 flex gap-2 justify-center">
                {achievementIds.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

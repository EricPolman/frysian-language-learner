"use client";

import { Achievement, getAchievementsByCategory, ACHIEVEMENTS } from "@/lib/achievements";
import { AchievementBadge } from "./AchievementBadge";
import { Card } from "@/components/ui/card";

interface AchievementGridProps {
  unlockedAchievements: Array<{
    achievement_id: string;
    unlocked_at: string;
  }>;
}

export function AchievementGrid({ unlockedAchievements }: AchievementGridProps) {
  const unlockedIds = unlockedAchievements.map((a) => a.achievement_id);
  const categories: Achievement["category"][] = [
    "lessons",
    "xp",
    "streak",
    "accuracy",
    "special",
  ];

  const categoryTitles = {
    lessons: "📚 Lessons",
    xp: "⭐ Experience",
    streak: "🔥 Streaks",
    accuracy: "✨ Accuracy",
    special: "🏆 Special",
  };

  const categoryDescriptions = {
    lessons: "Complete lessons to unlock these achievements",
    xp: "Earn XP to unlock these achievements",
    streak: "Practice daily to unlock these achievements",
    accuracy: "Perfect lessons unlock these achievements",
    special: "Special milestones and achievements",
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const achievements = getAchievementsByCategory(category);
        const unlocked = achievements.filter((a) => unlockedIds.includes(a.id)).length;
        const total = achievements.length;

        return (
          <Card key={category} className="p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold flex items-center justify-between">
                <span>{categoryTitles[category]}</span>
                <span className="text-sm font-normal text-gray-600">
                  {unlocked}/{total}
                </span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {categoryDescriptions[category]}
              </p>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
              {achievements.map((achievement) => {
                const unlockedData = unlockedAchievements.find(
                  (a) => a.achievement_id === achievement.id
                );
                return (
                  <AchievementBadge
                    key={achievement.id}
                    achievementId={achievement.id}
                    unlocked={!!unlockedData}
                    unlockedAt={unlockedData?.unlocked_at}
                    size="md"
                    showDetails
                  />
                );
              })}
            </div>
          </Card>
        );
      })}

      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">
            {unlockedIds.length} / {ACHIEVEMENTS.length} Achievements
          </h3>
          <p className="text-gray-600">
            Keep learning to unlock more badges and earn bonus XP!
          </p>
          <div className="mt-4 bg-white rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-500"
              style={{
                width: `${(unlockedIds.length / ACHIEVEMENTS.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100)}% Complete
          </p>
        </div>
      </Card>
    </div>
  );
}

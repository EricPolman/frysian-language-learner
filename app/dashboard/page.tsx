import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import skillsData from "@/data/skills.json";
import { calculateLevel, getLevelProgress, getXPRequiredForLevel, getXPUntilNextLevel } from "@/lib/levels";
import { ResetProgressButton } from "@/components/dashboard/ResetProgressButton";
import { getStreakStatus } from "@/lib/streaks";
import { AchievementBadge } from "@/components/achievements/AchievementBadge";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user progress
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Get lesson attempts for statistics
  const { data: attempts } = await supabase
    .from("lesson_attempts")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(10);

  // Get weak words
  const { data: weakWords } = await supabase
    .from("word_progress")
    .select("*")
    .eq("user_id", user.id)
    .lt("strength", 3)
    .order("strength", { ascending: true })
    .limit(10);

  // Get user achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: false });

  const totalXP = (profile as any)?.total_xp || 0;
  const completedLessons = (progress as any)?.completed_lessons || [];
  const totalLessons = skillsData.skills.reduce(
    (acc, skill) => acc + skill.lessons.length,
    0
  );

  // Streak data
  const currentStreak = (profile as any)?.current_streak || 0;
  const longestStreak = (profile as any)?.longest_streak || 0;
  const lastPracticeDate = (profile as any)?.last_practice_date || null;
  const streakStatus = getStreakStatus(currentStreak, lastPracticeDate);
  const dailyGoalXp = (profile as any)?.daily_goal_xp || 50;

  // Calculate XP earned today
  const today = new Date().toISOString().split('T')[0];
  const todayXp = (attempts as any[])?.filter(a => {
    const attemptDate = new Date(a.completed_at).toISOString().split('T')[0];
    return attemptDate === today;
  }).reduce((sum, a) => sum + (a.xp_earned || 0), 0) || 0;

  const dailyGoalProgress = Math.min(100, (todayXp / dailyGoalXp) * 100);

  // Calculate level using progressive scaling
  const level = calculateLevel(totalXP);
  const xpProgress = getLevelProgress(totalXP);
  const xpForNextLevel = getXPRequiredForLevel(level);
  const xpUntilNext = getXPUntilNextLevel(totalXP);

  // Calculate overall accuracy from attempts
  const totalCorrect = (attempts as any[])?.reduce(
    (acc, a) => acc + (a.questions_correct || 0),
    0
  ) || 0;
  const totalAnswered = (attempts as any[])?.reduce(
    (acc, a) => acc + (a.questions_answered || 0),
    0
  ) || 0;
  const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Calculate skills completed
  const skillsCompleted = skillsData.skills.filter((skill) =>
    skill.lessons.every((lessonId) => completedLessons.includes(lessonId))
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welkom terug, {(profile as any)?.display_name || user.email}!</p>
          </div>

          {/* Level and XP Card */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500 uppercase font-medium">Level</div>
                <div className="text-4xl font-bold text-blue-600">{level}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 uppercase font-medium">Totaal XP</div>
                <div className="text-4xl font-bold text-yellow-500">{totalXP}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Voortgang naar Level {level + 1}</span>
                <span>Nog {xpUntilNext} XP ({xpForNextLevel} XP nodig)</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>
          </Card>

          {/* Daily Goal and Streak */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Daily Goal */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🎯 Dagelijks Doel
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{todayXp} / {dailyGoalXp} XP vandaag</span>
                  <span>{Math.round(dailyGoalProgress)}%</span>
                </div>
                <Progress value={dailyGoalProgress} className="h-3" />
                {dailyGoalProgress >= 100 ? (
                  <p className="text-sm text-green-600 font-semibold">✅ Doel bereikt!</p>
                ) : (
                  <p className="text-sm text-gray-500">Nog {dailyGoalXp - todayXp} XP te gaan!</p>
                )}
              </div>
              <Link href="/settings">
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Pas Doel Aan
                </Button>
              </Link>
            </Card>

            {/* Streak */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🔥 Streak
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-orange-600">{currentStreak}</div>
                    <div className="text-sm text-gray-500">Huidige Streak</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-400">{longestStreak}</div>
                    <div className="text-sm text-gray-500">Langste Streak</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{streakStatus}</p>
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{completedLessons.length}</div>
              <div className="text-sm text-gray-600">Lessen Voltooid</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{skillsCompleted}</div>
              <div className="text-sm text-gray-600">Vaardigheden</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{overallAccuracy}%</div>
              <div className="text-sm text-gray-600">Nauwkeurigheid</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-600">{(weakWords as any[])?.length || 0}</div>
              <div className="text-sm text-gray-600">Te Oefenen</div>
            </Card>
          </div>

          {/* Course Progress */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Cursus Voortgang</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{completedLessons.length} van {totalLessons} lessen voltooid</span>
                <span>{Math.round((completedLessons.length / totalLessons) * 100)}%</span>
              </div>
              <Progress 
                value={(completedLessons.length / totalLessons) * 100} 
                className="h-3" 
              />
            </div>
          </Card>

          {/* Achievements */}
          {(userAchievements as any[])?.length > 0 && (
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">🏆 Recente Prestaties</h2>
                <Link href="/achievements">
                  <Button variant="outline" size="sm">Bekijk Alles</Button>
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {(userAchievements as any[]).slice(0, 6).map((achievement) => (
                  <div key={achievement.id} className="flex-shrink-0">
                    <AchievementBadge
                      achievementId={achievement.achievement_id}
                      unlocked={true}
                      unlockedAt={achievement.unlocked_at}
                      size="md"
                      showDetails={true}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Weak Words Section */}
          {(weakWords as any[])?.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📚 Woorden om te Oefenen</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {(weakWords as any[]).map((word, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    {word.word_id}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Deze woorden hebben extra oefening nodig. Ze komen vaker terug in je lessen.
              </p>
            </Card>
          )}

          {/* Recent Activity */}
          {(attempts as any[])?.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Recente Activiteit</h2>
              <div className="space-y-3">
                {(attempts as any[]).slice(0, 5).map((attempt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{attempt.lesson_id}</div>
                      <div className="text-sm text-gray-500">
                        {attempt.questions_correct}/{attempt.questions_answered} goed
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-yellow-600">+{attempt.xp_earned} XP</div>
                      <div className="text-xs text-gray-400">
                        {new Date(attempt.completed_at).toLocaleDateString("nl-NL")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/learn" className="flex-1">
              <Button size="lg" className="w-full">
                Ga Verder met Leren
              </Button>
            </Link>
            <Link href="/practice" className="flex-1">
              <Button size="lg" variant="outline" className="w-full">
                🔄 Oefenen
              </Button>
            </Link>
          </div>

          {/* Danger Zone */}
          <Card className="p-6 mt-8 border-red-200 bg-red-50/50">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Gevarenzone</h2>
            <p className="text-sm text-gray-600 mb-4">
              Wil je opnieuw beginnen? Je kunt al je voortgang resetten en helemaal opnieuw starten.
            </p>
            <ResetProgressButton />
          </Card>
        </div>
      </div>
    </div>
  );
}

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

  const totalXP = (profile as any)?.total_xp || 0;
  const completedLessons = (progress as any)?.completed_lessons || [];
  const totalLessons = skillsData.skills.reduce(
    (acc, skill) => acc + skill.lessons.length,
    0
  );

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

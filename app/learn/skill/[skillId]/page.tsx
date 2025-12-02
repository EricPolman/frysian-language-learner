import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import skillsData from "@/data/skills.json";
import { redirect, notFound } from "next/navigation";

interface Props {
  params: Promise<{ skillId: string }>;
}

export default async function SkillPage({ params }: Props) {
  const { skillId } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Find the skill
  const skill = skillsData.skills.find((s) => s.id === skillId);
  if (!skill) {
    notFound();
  }

  // Get user progress
  const supabase = await createClient();
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const completedLessons = new Set<string>(
    (progressData as any)?.completed_lessons || []
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link href="/learn" className="inline-block mb-6">
            <Button variant="outline" size="sm">
              ← Terug naar Vaardigheden
            </Button>
          </Link>

          {/* Skill header */}
          <div className="mb-8 text-center">
            <div className="text-6xl mb-4">{skill.icon}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {skill.title}
            </h1>
            <p className="text-gray-600">{skill.description}</p>
          </div>

          {/* Lessons */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lessen</h2>
            {skill.lessons.map((lessonId, index) => {
              const isCompleted = completedLessons.has(lessonId);
              const isFirst = index === 0;
              const previousCompleted =
                isFirst || completedLessons.has(skill.lessons[index - 1]);
              const isUnlocked = isFirst || previousCompleted;

              return (
                <Card
                  key={lessonId}
                  className={`
                    p-6 transition-all
                    ${!isUnlocked ? "opacity-50" : "hover:shadow-lg"}
                    ${isCompleted ? "bg-green-50 border-green-200" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {isCompleted ? "✅" : isUnlocked ? "📖" : "🔒"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          Les {index + 1}
                        </h3>
                        <p className="text-sm text-gray-600">{lessonId}</p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <Link href={`/learn/lesson/${lessonId}`}>
                        <Button size="sm">
                          {isCompleted ? "Oefen" : "Start"}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" disabled>
                        Vergrendeld
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Progress summary */}
          <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {skill.lessons.filter((l) => completedLessons.has(l)).length} /{" "}
                {skill.lessons.length}
              </div>
              <div className="text-sm text-gray-600">Lessen Voltooid</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

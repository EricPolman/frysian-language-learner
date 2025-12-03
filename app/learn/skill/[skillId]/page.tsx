import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import skillsData from "@/data/skills.json";
import { redirect, notFound } from "next/navigation";

interface LessonInfo {
  id: string;
  title: string;
  description: string;
  topic: string;
}

interface Props {
  params: Promise<{ skillId: string }>;
}

// Helper to get lesson ID from lesson info or string
function getLessonId(lesson: LessonInfo | string): string {
  return typeof lesson === 'string' ? lesson : lesson.id;
}

// Helper to get lesson info
function getLessonInfo(lesson: LessonInfo | string, index: number): { id: string; title: string; description: string } {
  if (typeof lesson === 'string') {
    return { id: lesson, title: `Les ${index + 1}`, description: lesson };
  }
  return { id: lesson.id, title: lesson.title, description: lesson.description };
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

  // Cast skill to include optional longDescription
  const skillWithLongDesc = skill as typeof skill & { longDescription?: string };

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
            <p className="text-gray-600 mb-2">{skill.description}</p>
            {skillWithLongDesc.longDescription && (
              <p className="text-sm text-gray-500 max-w-xl mx-auto">
                {skillWithLongDesc.longDescription}
              </p>
            )}
          </div>

          {/* Lessons */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lessen</h2>
            {skill.lessons.map((lesson, index) => {
              const lessonInfo = getLessonInfo(lesson, index);
              const lessonId = lessonInfo.id;
              const isCompleted = completedLessons.has(lessonId);
              const isFirst = index === 0;
              const previousLessonId = index > 0 ? getLessonId(skill.lessons[index - 1]) : null;
              const previousCompleted = isFirst || (previousLessonId && completedLessons.has(previousLessonId));
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
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="text-3xl shrink-0">
                        {isCompleted ? "✅" : isUnlocked ? "📖" : "🔒"}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900">
                          Les {index + 1}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {lessonInfo.description}
                        </p>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <Link href={`/learn/lesson/${lessonId}`} className="shrink-0">
                        <Button size="sm">
                          {isCompleted ? "Oefen" : "Start"}
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" disabled className="shrink-0">
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

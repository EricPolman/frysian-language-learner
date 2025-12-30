import { SkillTree } from "@/components/skill-tree/SkillTree";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Get skills with their lessons from database
  const { data: skillsData } = await supabase
    .from("skills")
    .select(`
      id,
      title,
      description,
      long_description,
      icon,
      order,
      difficulty,
      prerequisites,
      color,
      lessons (
        id,
        title,
        description,
        topic,
        lesson_number,
        is_published
      )
    `)
    .eq("is_published", true)
    .order("order");

  // Get user progress from database
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Transform skills data to match the expected format
  const skills = (skillsData || []).map((skill) => ({
    id: skill.id,
    title: skill.title,
    description: skill.description,
    longDescription: skill.long_description || undefined,
    icon: skill.icon || "📚",
    order: skill.order,
    color: skill.color || "#3b82f6",
    prerequisites: skill.prerequisites || [],
    lessons: (skill.lessons || [])
      .filter((lesson: any) => lesson.is_published)
      .sort((a: any, b: any) => a.lesson_number - b.lesson_number)
      .map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        topic: lesson.topic,
      })),
  }));

  // Convert completed lessons array to Set for efficient lookup
  const completedLessons = new Set<string>(
    progressData?.completed_lessons || []
  );
  const currentSkill = progressData?.current_skill || undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📚 Leren</h1>
          <p className="text-gray-600 text-lg">
            Kies een vaardigheid om te beginnen met leren
          </p>
        </div>
        
        <SkillTree
          skills={skills}
          userProgress={{
            completedLessons,
            currentSkill,
          }}
        />
      </div>
    </div>
  );
}


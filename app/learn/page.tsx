import { SkillTree } from "@/components/skill-tree/SkillTree";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import skillsData from "@/data/skills.json";
import { redirect } from "next/navigation";

export default async function LearnPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  // Get user progress from database
  const supabase = await createClient();
  
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // Convert completed lessons array to Set for efficient lookup
  const completedLessons = new Set<string>(
    (progressData as any)?.completed_lessons || []
  );
  const currentSkill = (progressData as any)?.current_skill as
    | string
    | undefined;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4">
        <SkillTree
          skills={skillsData.skills}
          userProgress={{
            completedLessons,
            currentSkill,
          }}
        />
      </div>
    </div>
  );
}


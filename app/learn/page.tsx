import { SkillTree } from "@/components/skill-tree/SkillTree";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import skillsData from "@/data/skills.json";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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


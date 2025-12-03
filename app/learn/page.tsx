import { SkillTree } from "@/components/skill-tree/SkillTree";
import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import skillsData from "@/data/skills.json";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  // Check for weak words (strength < 4)
  const { data: weakWordsData } = await supabase
    .from("word_progress")
    .select("word_id")
    .eq("user_id", user.id)
    .lt("strength", 4)
    .limit(1);
  
  const hasWeakWords = (weakWordsData && weakWordsData.length > 0) || 
                       ((progressData as any)?.completed_lessons?.length > 0);

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
        {/* Practice Button */}
        {hasWeakWords && (
          <div className="max-w-md mx-auto mb-6">
            <Link href="/practice">
              <div className="bg-purple-600 hover:bg-purple-700 transition-colors text-white rounded-xl p-4 flex items-center justify-between cursor-pointer shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="font-bold">Oefenen</div>
                    <div className="text-sm text-purple-200">Versterk je zwakke woorden</div>
                  </div>
                </div>
                <div className="text-purple-200">→</div>
              </div>
            </Link>
          </div>
        )}
        
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


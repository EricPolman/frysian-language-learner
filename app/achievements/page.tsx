import { getUser } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/shared/Header";
import { MobileNav } from "@/components/shared/MobileNav";
import { AchievementGrid } from "@/components/achievements/AchievementGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = {
  title: "Prestaties - Frysk Leare",
  description: "View your achievements and progress",
};

export default async function AchievementsPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Get user achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("unlocked_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              ← Terug naar Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏆 Prestaties</h1>
          <p className="text-gray-600 text-lg">
            Ontgrendel badges door te leren en je doelen te bereiken
          </p>
        </div>

        <AchievementGrid unlockedAchievements={(userAchievements as any) || []} />
      </main>

      <MobileNav />
    </div>
  );
}

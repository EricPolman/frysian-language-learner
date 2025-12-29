import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUser, logout } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/client";
import { calculateLevel, getLevelProgress } from "@/lib/levels";

export async function Header() {
  const user = await getUser();
  
  // Get user profile for level and XP if logged in
  let level = 1;
  let totalXP = 0;
  let xpProgress = 0;
  
  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, total_xp")
      .eq("id", user.id)
      .single();
    
    totalXP = (profile as any)?.total_xp || 0;
    
    // Calculate level using progressive scaling
    level = calculateLevel(totalXP);
    xpProgress = getLevelProgress(totalXP);
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={user ? "/learn" : "/"} className="flex items-center gap-2">
            <div className="text-2xl"><img src="/Frisian_flag.png" alt="Frysk Leare Logo" className="w-8" /></div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline">
            Frysk Leare
          </span>
        </Link>

        {/* Level and XP indicator - visible on mobile and desktop for logged in users */}
        {user && (
          <Link href="/dashboard" className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="text-blue-600 font-bold text-xs sm:text-sm">Lvl {level}</span>
              <div className="w-10 sm:w-16 h-1.5 sm:h-2 bg-blue-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, xpProgress))}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <span className="text-yellow-600 font-bold text-xs sm:text-sm">{totalXP} XP</span>
            </div>
          </Link>
        )}

        <nav className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link href="/practice" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  🔄 Oefenen
                </Button>
              </Link>
              <Link href="/learn" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Leren
                </Button>
              </Link>
              <Link href="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Link href="/settings" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  ⚙️
                </Button>
              </Link>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm">
                  <span className="hidden sm:inline">Uitloggen</span>
                  <span className="sm:hidden">👋</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Inloggen
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Registreren</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

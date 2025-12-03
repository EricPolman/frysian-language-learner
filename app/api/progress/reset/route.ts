import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Delete all user progress data
    // 1. Reset user_progress
    await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id);

    // 2. Delete all word_progress
    await supabase
      .from("word_progress")
      .delete()
      .eq("user_id", user.id);

    // 3. Delete all lesson_attempts
    await supabase
      .from("lesson_attempts")
      .delete()
      .eq("user_id", user.id);

    // 4. Reset profile level and XP
    // @ts-ignore - Supabase types not fully configured
    await supabase
      .from("profiles")
      // @ts-ignore
      .update({ 
        level: 1, 
        total_xp: 0 
      })
      .eq("id", user.id);

    return NextResponse.json({ 
      success: true,
      message: "Alle voortgang is gereset"
    });
  } catch (error) {
    console.error("Error resetting progress:", error);
    return NextResponse.json(
      { error: "Fout bij resetten voortgang" },
      { status: 500 }
    );
  }
}

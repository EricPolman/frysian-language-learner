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

    console.log("Resetting progress for user:", user.id);

    // Delete all user progress data
    // 1. Reset user_progress (completed_lessons)
    const { error: progressError } = await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", user.id);
    
    if (progressError) {
      console.error("Error deleting user_progress:", progressError);
    } else {
      console.log("Deleted user_progress");
    }

    // 2. Delete all word_progress
    const { error: wordError } = await supabase
      .from("word_progress")
      .delete()
      .eq("user_id", user.id);
    
    if (wordError) {
      console.error("Error deleting word_progress:", wordError);
    } else {
      console.log("Deleted word_progress");
    }

    // 3. Delete all lesson_attempts
    const { error: attemptsError } = await supabase
      .from("lesson_attempts")
      .delete()
      .eq("user_id", user.id);
    
    if (attemptsError) {
      console.error("Error deleting lesson_attempts:", attemptsError);
    } else {
      console.log("Deleted lesson_attempts");
    }

    // 4. Reset profile level and XP
    // @ts-ignore - Supabase types not fully configured
    const { error: profileError } = await supabase
      .from("profiles")
      // @ts-ignore
      .update({ 
        level: 1, 
        total_xp: 0 
      })
      .eq("id", user.id);
    
    if (profileError) {
      console.error("Error resetting profile:", profileError);
    } else {
      console.log("Reset profile level and XP");
    }

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

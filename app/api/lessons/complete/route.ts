import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { lessonId, xpEarned, userId } = await request.json();

    const supabase = await createClient();

    // First, ensure the user has a profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (!profile) {
      // Create profile if it doesn't exist
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          display_name: "User",
          level: 1,
          total_xp: 0,
        } as any);

      if (profileError) {
        console.error("Failed to create profile:", profileError);
        throw profileError;
      }
    }

    // Get current progress
    const { data: currentProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!currentProgress) {
      // Create new progress record
      const { error: createError } = await supabase
        .from("user_progress")
        .insert({
          user_id: userId,
          completed_lessons: [lessonId],
          total_xp: xpEarned,
          current_skill: lessonId.split("-").slice(0, 2).join("-"),
        } as any);

      if (createError) throw createError;
    } else {
      // Update existing progress
      const completedLessons = (currentProgress as any).completed_lessons || [];
      
      // Only add if not already completed
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      // @ts-ignore - Supabase types not fully configured
      const { error: updateError } = await supabase
        .from("user_progress")
        // @ts-ignore
        .update({
          completed_lessons: completedLessons,
          total_xp: ((currentProgress as any).total_xp || 0) + xpEarned,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;
    }

    // Update user level based on XP
    const newTotalXp = ((currentProgress as any)?.total_xp || 0) + xpEarned;
    const newLevel = Math.floor(newTotalXp / 100) + 1;

    // @ts-ignore - Supabase types not fully configured
    await supabase
      .from("profiles")
      // @ts-ignore
      .update({ level: newLevel })
      .eq("id", userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

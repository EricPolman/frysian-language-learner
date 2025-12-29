import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/app/login/actions";
import { calculateStreak, getTodayString } from "@/lib/streaks";
import { checkAchievements } from "@/lib/achievements";

export async function POST(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Calculate new streak
    const newStreak = calculateStreak(
      profile.last_practice_date,
      profile.current_streak
    );
    const newLongestStreak = Math.max(newStreak, profile.longest_streak);

    // Update profile with new streak and today's date
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_practice_date: getTodayString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    // Check for new achievements
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("completed_lessons")
      .eq("user_id", user.id)
      .single();

    const { data: attempts } = await supabase
      .from("lesson_attempts")
      .select("*")
      .eq("user_id", user.id);

    const { data: wordProgress } = await supabase
      .from("word_progress")
      .select("*")
      .eq("user_id", user.id);

    // Calculate stats for achievement checking
    const lessonsCompleted = userProgress?.completed_lessons?.length || 0;
    const perfectLessons =
      attempts?.filter(
        (a) => a.questions_correct === a.questions_answered && a.questions_answered > 0
      ).length || 0;
    const wordsLearned = wordProgress?.length || 0;

    // Count completed skills (skills where all lessons are completed)
    const completedLessons = userProgress?.completed_lessons || [];
    const skillsCompleted = new Set(
      completedLessons.map((lessonId: string) => lessonId.split("-").slice(0, -1).join("-"))
    ).size;

    const earnedAchievementIds = checkAchievements({
      lessonsCompleted,
      totalXp: profile.total_xp,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      perfectLessons,
      wordsLearned,
      skillsCompleted,
    });

    // Get existing achievements
    const { data: existingAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", user.id);

    const existingIds = existingAchievements?.map((a) => a.achievement_id) || [];
    const newAchievements = earnedAchievementIds.filter(
      (id) => !existingIds.includes(id)
    );

    // Insert new achievements
    if (newAchievements.length > 0) {
      const achievementsToInsert = newAchievements.map((achievementId) => ({
        user_id: user.id,
        achievement_id: achievementId,
      }));

      await supabase.from("user_achievements").insert(achievementsToInsert);
    }

    return NextResponse.json({
      success: true,
      streak: {
        current: newStreak,
        longest: newLongestStreak,
        increased: newStreak > profile.current_streak,
      },
      newAchievements,
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { error: "Failed to update streak" },
      { status: 500 }
    );
  }
}

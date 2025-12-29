import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateLevel } from "@/lib/levels";
import { calculateStreak, getTodayString } from "@/lib/streaks";
import { checkAchievements } from "@/lib/achievements";

export async function POST(request: Request) {
  try {
    const { 
      lessonId, 
      xpEarned, 
      userId,
      accuracy,
      correctOnFirstTry,
      totalExercises,
      weakWords,
      isPerfect,
    } = await request.json();

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

    // Update user level based on XP (progressive scaling)
    const newTotalXp = ((currentProgress as any)?.total_xp || 0) + xpEarned;
    const newLevel = calculateLevel(newTotalXp);

    // Get current profile for streak calculation
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    // Calculate new streak
    const newStreak = calculateStreak(
      (currentProfile as any)?.last_practice_date || null,
      (currentProfile as any)?.current_streak || 0
    );
    const newLongestStreak = Math.max(newStreak, (currentProfile as any)?.longest_streak || 0);

    // @ts-ignore - Supabase types not fully configured
    await supabase
      .from("profiles")
      // @ts-ignore
      .update({ 
        level: newLevel, 
        total_xp: newTotalXp,
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_practice_date: getTodayString(),
      })
      .eq("id", userId);

    // Record lesson attempt with detailed stats
    await supabase
      .from("lesson_attempts")
      .insert({
        user_id: userId,
        lesson_id: lessonId,
        questions_answered: totalExercises || 0,
        questions_correct: correctOnFirstTry || 0,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      } as any);

    // Update word progress for weak words (spaced repetition)
    if (weakWords && weakWords.length > 0) {
      for (const word of weakWords) {
        // Check if word progress exists
        const { data: existingProgress } = await supabase
          .from("word_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("word_id", word)
          .single();

        if (existingProgress) {
          // Decrease strength for weak word
          const newStrength = Math.max(1, (existingProgress as any).strength - 1);
          await supabase
            .from("word_progress")
            // @ts-ignore
            .update({
              strength: newStrength,
              incorrect_count: ((existingProgress as any).incorrect_count || 0) + 1,
              last_practiced: new Date().toISOString(),
            })
            .eq("id", (existingProgress as any).id);
        } else {
          // Create new word progress entry
          await supabase
            .from("word_progress")
            .insert({
              user_id: userId,
              word_id: word,
              strength: 1,
              incorrect_count: 1,
              correct_count: 0,
            } as any);
        }
      }
    }

    // Check for new achievements
    const completedLessons = (currentProgress as any)?.completed_lessons || [];
    const lessonsCompleted = completedLessons.includes(lessonId) 
      ? completedLessons.length 
      : completedLessons.length + 1;

    const { data: attempts } = await supabase
      .from("lesson_attempts")
      .select("*")
      .eq("user_id", userId);

    const { data: wordProgress } = await supabase
      .from("word_progress")
      .select("*")
      .eq("user_id", userId);

    const perfectLessons =
      attempts?.filter(
        (a) => a.questions_correct === a.questions_answered && a.questions_answered > 0
      ).length || 0;
    const wordsLearned = wordProgress?.length || 0;

    // Count completed skills
    const skillsCompleted = new Set(
      completedLessons.map((lid: string) => lid.split("-").slice(0, -1).join("-"))
    ).size;

    const earnedAchievementIds = checkAchievements({
      lessonsCompleted,
      totalXp: newTotalXp,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      perfectLessons: isPerfect ? perfectLessons + 1 : perfectLessons,
      wordsLearned,
      skillsCompleted,
    });

    // Get existing achievements
    const { data: existingAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    const existingIds = existingAchievements?.map((a) => a.achievement_id) || [];
    const newAchievements = earnedAchievementIds.filter(
      (id) => !existingIds.includes(id)
    );

    // Insert new achievements
    if (newAchievements.length > 0) {
      const achievementsToInsert = newAchievements.map((achievementId) => ({
        user_id: userId,
        achievement_id: achievementId,
      }));

      await supabase.from("user_achievements").insert(achievementsToInsert);
    }

    return NextResponse.json({ 
      success: true,
      newLevel,
      newTotalXp,
      isPerfect,
      newAchievements,
      streak: {
        current: newStreak,
        longest: newLongestStreak,
      },
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

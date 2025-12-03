import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ResultsClient } from "@/components/lesson/ResultsClient";

interface Props {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{
    xp?: string;
    accuracy?: string;
    correct?: string;
    total?: string;
    perfect?: string;
    weakWords?: string;
  }>;
}

export default async function LessonResultsPage({
  params,
  searchParams,
}: Props) {
  const { lessonId } = await params;
  const { xp, accuracy, correct, total, perfect, weakWords } = await searchParams;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user's current level from database
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("level, total_xp")
    .eq("id", user.id)
    .single();

  const xpEarned = parseInt(xp || "0");
  const accuracyPercent = parseInt(accuracy || "0");
  const correctCount = parseInt(correct || "0");
  const totalCount = parseInt(total || "0");
  const isPerfect = perfect === "true";
  const weakWordsList = weakWords ? weakWords.split(",").filter(Boolean) : [];

  // Calculate if level up happened
  const currentLevel = (profile as any)?.level || 1;
  const previousXP = ((profile as any)?.total_xp || 0) - xpEarned;
  const previousLevel = Math.floor(previousXP / 100) + 1;

  return (
    <ResultsClient
      lessonId={lessonId}
      xpEarned={xpEarned}
      accuracyPercent={accuracyPercent}
      correctCount={correctCount}
      totalCount={totalCount}
      isPerfect={isPerfect}
      weakWordsList={weakWordsList}
      newLevel={currentLevel}
      previousLevel={previousLevel > 0 ? previousLevel : 1}
    />
  );
}

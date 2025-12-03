import { getUser } from "@/app/login/actions";
import { redirect } from "next/navigation";
import { PracticeResultsClient } from "@/components/lesson/PracticeResultsClient";

export const metadata = {
  title: "Oefenresultaten - Frysk Leare",
  description: "Je oefenresultaten",
};

interface PracticeResultsPageProps {
  searchParams: Promise<{
    xp?: string;
    accuracy?: string;
    correct?: string;
    total?: string;
  }>;
}

export default async function PracticeResultsPage({ searchParams }: PracticeResultsPageProps) {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const xp = parseInt(params.xp || "0");
  const accuracy = parseInt(params.accuracy || "0");
  const correct = parseInt(params.correct || "0");
  const total = parseInt(params.total || "0");

  return (
    <PracticeResultsClient
      xpEarned={xp}
      accuracy={accuracy}
      correctCount={correct}
      totalExercises={total}
    />
  );
}

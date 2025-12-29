"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { TranslationExercise } from "@/components/exercises/TranslationExercise";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import type { Exercise } from "@/types/content";

interface WordResult {
  wordId: string;
  correct: boolean;
}

interface PracticeClientProps {
  userId: string;
}

export function PracticeClient({ userId }: PracticeClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [totalXP, setTotalXP] = useState(0);
  const [wordResults, setWordResults] = useState<WordResult[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [hasWeakWords, setHasWeakWords] = useState(true);

  // Fetch practice exercises
  useEffect(() => {
    async function fetchPractice() {
      try {
        const response = await fetch("/api/practice");
        const data = await response.json();

        if (data.error && !data.hasWeakWords) {
          setHasWeakWords(false);
          setError(data.message || data.error);
        } else if (data.exercises && data.exercises.length > 0) {
          setExercises(data.exercises);
          setHasWeakWords(true);
        } else {
          setHasWeakWords(false);
          setError("Geen oefeningen beschikbaar. Voltooi eerst een les!");
        }
      } catch (err) {
        setError("Fout bij laden van oefeningen");
      } finally {
        setLoading(false);
      }
    }

    fetchPractice();
  }, []);

  const progress = exercises.length > 0 
    ? ((currentIndex + 1) / exercises.length) * 100 
    : 0;

  const handleExerciseComplete = (correct: boolean, xp: number) => {
    const exercise = exercises[currentIndex] as any;
    
    // Track word result
    if (exercise.vocabularyId) {
      setWordResults(prev => [
        ...prev,
        { wordId: exercise.vocabularyId, correct }
      ]);
    }
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setTotalXP(prev => prev + xp);
    }
    
    setShowExplanation(true);
  };

  const handleNext = async () => {
    if (currentIndex >= exercises.length - 1) {
      // Practice complete - save results
      await savePracticeResults();
      return;
    }
    
    setCurrentIndex(prev => prev + 1);
    setShowExplanation(false);
  };

  const savePracticeResults = async () => {
    try {
      await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wordResults }),
      });
    } catch (err) {
      console.error("Failed to save practice results:", err);
    }
    
    // Navigate to results
    const accuracy = Math.round((correctCount / exercises.length) * 100);
    const params = new URLSearchParams({
      xp: totalXP.toString(),
      accuracy: accuracy.toString(),
      correct: correctCount.toString(),
      total: exercises.length.toString(),
      practice: "true",
    });
    router.push(`/practice/results?${params.toString()}`);
  };

  const renderExercise = () => {
    const exercise = exercises[currentIndex];
    
    switch (exercise.type) {
      case "translation":
        return (
          <TranslationExercise
            exercise={exercise as any}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      case "multiple-choice":
        return (
          <MultipleChoiceExercise
            exercise={exercise as any}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      default:
        return <div>Onbekend oefentype</div>;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Oefeningen laden...</p>
        </div>
      </div>
    );
  }

  // No weak words or error state
  if (!hasWeakWords || error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {error || "Geen zwakke woorden!"}
              </h1>
              <p className="text-gray-600 mb-6">
                {hasWeakWords 
                  ? "Er is een fout opgetreden bij het laden van de oefeningen."
                  : "Je hebt geen woorden die extra oefening nodig hebben. Ga door met leren om nieuwe woorden te ontdekken!"}
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => router.push("/learn")} 
                  className="w-full"
                  size="lg"
                >
                  Doorgaan met leren
                </Button>
                <Button 
                  onClick={() => router.push("/dashboard")} 
                  variant="outline"
                  className="w-full"
                >
                  Naar dashboard
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/learn")}
            >
              ✕
            </Button>
            <div className="flex-1">
              <Progress value={progress} className="h-3" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                Oefenen
              </span>
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} / {exercises.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {renderExercise()}
        </div>
      </div>

      {/* XP Display */}
      {totalXP > 0 && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
          +{totalXP} XP
        </div>
      )}
    </div>
  );
}

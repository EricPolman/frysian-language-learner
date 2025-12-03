"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TranslationExercise } from "@/components/exercises/TranslationExercise";
import { FillInBlankExercise } from "@/components/exercises/FillInBlankExercise";
import { SentenceBuildExercise } from "@/components/exercises/SentenceBuildExercise";
import { MultipleChoiceExercise } from "@/components/exercises/MultipleChoiceExercise";
import { IntroCard } from "@/components/lesson/IntroCard";
import type { Lesson, Exercise } from "@/types/content";

// Track individual exercise results
interface ExerciseResultData {
  exerciseId: string;
  correct: boolean;
  firstTry: boolean;
  xpEarned: number;
  vocabulary?: string[]; // Related vocabulary words
}

interface LessonClientProps {
  lesson: Lesson;
  userId: string;
}

export function LessonClient({ lesson, userId }: LessonClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // New tracking state
  const [exerciseResults, setExerciseResults] = useState<ExerciseResultData[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [weakWords, setWeakWords] = useState<string[]>([]);

  const totalItems = lesson.introCards.length + lesson.exercises.length;
  const progress = (completedCount / totalItems) * 100;
  const isIntroCard = currentIndex < lesson.introCards.length;

  const currentItem = isIntroCard
    ? lesson.introCards[currentIndex]
    : lesson.exercises[currentIndex - lesson.introCards.length];

  const handleNext = () => {
    const isLastItem = currentIndex >= totalItems - 1;
    
    if (isLastItem) {
      // Last item - complete the lesson
      setCompletedCount(completedCount + 1);
      handleComplete();
    } else {
      // Move to next item
      setCurrentIndex(currentIndex + 1);
      setCompletedCount(completedCount + 1);
      setShowExplanation(false);
      setCurrentAttempt(1); // Reset attempt counter for next exercise
    }
  };

  // Helper to extract vocabulary from exercise
  const getExerciseVocabulary = (exercise: Exercise): string[] => {
    switch (exercise.type) {
      case "translation":
        return [exercise.correctAnswer];
      case "fill-in-blank":
        return [exercise.correctAnswer];
      case "multiple-choice":
        return [exercise.correctAnswer];
      case "sentence-build":
        return exercise.correctOrder;
      default:
        return [];
    }
  };

  const handleComplete = async () => {
    // Calculate stats
    const correctOnFirstTry = exerciseResults.filter(r => r.firstTry && r.correct).length;
    const totalExercises = lesson.exercises.length;
    const accuracy = totalExercises > 0 ? Math.round((correctOnFirstTry / totalExercises) * 100) : 0;
    const isPerfect = correctOnFirstTry === totalExercises;
    
    // Calculate bonus XP
    const lessonBonus = 50;
    const perfectBonus = isPerfect ? 25 : 0;
    const finalXP = totalXP + lessonBonus + perfectBonus;

    // Save progress to database
    try {
      const response = await fetch("/api/lessons/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: lesson.id,
          xpEarned: finalXP,
          userId,
          accuracy,
          correctOnFirstTry,
          totalExercises,
          weakWords,
          isPerfect,
        }),
      });

      if (response.ok) {
        // Pass stats to results page via URL params
        const params = new URLSearchParams({
          xp: finalXP.toString(),
          accuracy: accuracy.toString(),
          correct: correctOnFirstTry.toString(),
          total: totalExercises.toString(),
          perfect: isPerfect.toString(),
          weakWords: weakWords.join(","),
        });
        router.push(`/learn/lesson/${lesson.id}/results?${params.toString()}`);
      }
    } catch (error) {
      console.error("Failed to save lesson progress:", error);
    }
  };

  const handleExerciseComplete = (correct: boolean, xp: number) => {
    const exercise = lesson.exercises[currentIndex - lesson.introCards.length];
    const isFirstTry = currentAttempt === 1;
    
    // Track the result
    const result: ExerciseResultData = {
      exerciseId: exercise.id,
      correct,
      firstTry: isFirstTry,
      xpEarned: xp,
      vocabulary: getExerciseVocabulary(exercise),
    };
    
    setExerciseResults(prev => [...prev, result]);
    setTotalXP(totalXP + xp);
    
    // Track weak words if incorrect on first try
    if (!correct && isFirstTry) {
      const vocab = getExerciseVocabulary(exercise);
      setWeakWords(prev => [...new Set([...prev, ...vocab])]);
      setCurrentAttempt(2);
    }
    
    setShowExplanation(true);
  };

  const renderContent = () => {
    if (isIntroCard) {
      const intro = currentItem as any;
      return (
        <IntroCard
          vocabulary={intro.vocabulary}
          exampleSentence={intro.exampleSentence}
          onContinue={handleNext}
        />
      );
    }

    const exercise = currentItem as any;

    switch (exercise.type) {
      case "translation":
        return (
          <TranslationExercise
            exercise={exercise}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      case "fill-in-blank":
        return (
          <FillInBlankExercise
            exercise={exercise}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      case "sentence-build":
        return (
          <SentenceBuildExercise
            exercise={exercise}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      case "multiple-choice":
        return (
          <MultipleChoiceExercise
            exercise={exercise}
            onComplete={handleExerciseComplete}
            showExplanation={showExplanation}
            onContinue={handleNext}
          />
        );
      default:
        return <div>Onbekend oefentype</div>;
    }
  };

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
            <div className="text-sm font-medium text-gray-700">
              {completedCount} / {totalItems}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">{renderContent()}</div>
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

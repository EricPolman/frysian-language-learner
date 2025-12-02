"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TranslationExercise as TranslationExerciseType } from "@/types/content";

interface TranslationExerciseProps {
  exercise: TranslationExerciseType;
  onComplete: (correct: boolean, xp: number) => void;
  showExplanation: boolean;
  onContinue: () => void;
}

export function TranslationExercise({
  exercise,
  onComplete,
  showExplanation,
  onContinue,
}: TranslationExerciseProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setUserAnswer("");
    setIsCorrect(null);
    setAttempts(0);
  }, [exercise.id]);

  const handleCheck = () => {
    const normalized = userAnswer.toLowerCase().trim();
    const correct =
      normalized === exercise.correctAnswer.toLowerCase() ||
      exercise.acceptedAnswers?.some(
        (ans) => ans.toLowerCase() === normalized
      );

    setIsCorrect(correct);
    setAttempts(attempts + 1);

    // Award XP: 10 for first try, 5 for second try
    const xp = correct ? (attempts === 0 ? 10 : 5) : 0;
    onComplete(correct, xp);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !showExplanation) {
      handleCheck();
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Question */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase text-gray-500 font-medium">
            Vertaal dit naar het Fries
          </h2>
          <div className="text-3xl font-bold text-gray-900">
            {exercise.question}
          </div>
        </div>

        {/* Input */}
        <Input
          type="text"
          placeholder="Typ je antwoord..."
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={showExplanation}
          className="text-lg p-4"
          autoFocus
        />

        {/* Hint */}
        {exercise.hint && !showExplanation && attempts > 0 && !isCorrect && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">💡 Hint: {exercise.hint}</div>
          </div>
        )}

        {/* Feedback */}
        {showExplanation && isCorrect !== null && (
          <div
            className={`p-4 rounded-lg border ${
              isCorrect
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`font-medium mb-2 ${
                isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {isCorrect ? "✓ Correct!" : "✗ Niet helemaal"}
            </div>
            {!isCorrect && (
              <div className="text-sm text-gray-700 mb-2">
                Juiste antwoord: <strong>{exercise.correctAnswer}</strong>
              </div>
            )}
            {exercise.explanation && (
              <div className="text-sm text-gray-600">
                {exercise.explanation}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showExplanation ? (
            <Button
              size="lg"
              className="w-full"
              onClick={handleCheck}
              disabled={!userAnswer.trim()}
            >
              Controleer
            </Button>
          ) : (
            <Button size="lg" className="w-full" onClick={onContinue}>
              Doorgaan
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

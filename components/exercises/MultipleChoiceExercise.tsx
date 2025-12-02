"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MultipleChoiceExercise as MultipleChoiceExerciseType } from "@/types/content";

interface MultipleChoiceExerciseProps {
  exercise: MultipleChoiceExerciseType;
  onComplete: (correct: boolean, xp: number) => void;
  showExplanation: boolean;
  onContinue: () => void;
}

export function MultipleChoiceExercise({
  exercise,
  onComplete,
  showExplanation,
  onContinue,
}: MultipleChoiceExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setAttempts(0);
  }, [exercise.id]);

  const handleAnswerClick = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
  };

  const handleCheck = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    setAttempts(attempts + 1);

    const xp = correct ? (attempts === 0 ? 10 : 5) : 0;
    onComplete(correct, xp);
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Question */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase text-gray-500 font-medium">
            {exercise.direction === "dutch-to-frysian"
              ? "Wat is de Friese vertaling?"
              : "Wat is de Nederlandse vertaling?"}
          </h2>
          <div className="text-3xl font-bold text-gray-900">
            {exercise.question}
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {exercise.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              size="lg"
              className={`text-lg justify-start h-auto py-4 ${
                showExplanation && option === exercise.correctAnswer
                  ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  : showExplanation &&
                    selectedAnswer === option &&
                    !isCorrect
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : ""
              }`}
              onClick={() => handleAnswerClick(option)}
              disabled={showExplanation}
            >
              <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>

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
              disabled={!selectedAnswer}
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

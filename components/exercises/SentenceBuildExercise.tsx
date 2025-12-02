"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SentenceBuildExercise as SentenceBuildExerciseType } from "@/types/content";

interface SentenceBuildExerciseProps {
  exercise: SentenceBuildExerciseType;
  onComplete: (correct: boolean, xp: number) => void;
  showExplanation: boolean;
  onContinue: () => void;
}

export function SentenceBuildExercise({
  exercise,
  onComplete,
  showExplanation,
  onContinue,
}: SentenceBuildExerciseProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([
    ...exercise.correctOrder,
    ...exercise.distractorWords,
  ].sort(() => Math.random() - 0.5));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedWords([]);
    setAvailableWords([
      ...exercise.correctOrder,
      ...exercise.distractorWords,
    ].sort(() => Math.random() - 0.5));
    setIsCorrect(null);
    setAttempts(0);
  }, [exercise.id, exercise.correctOrder, exercise.distractorWords]);

  const handleWordClick = (word: string) => {
    if (showExplanation) return;
    
    setSelectedWords([...selectedWords, word]);
    setAvailableWords(availableWords.filter((w) => w !== word));
  };

  const handleRemoveWord = (index: number) => {
    if (showExplanation) return;
    
    const word = selectedWords[index];
    setAvailableWords([...availableWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const correct =
      selectedWords.length === exercise.correctOrder.length &&
      selectedWords.every((word, index) => word === exercise.correctOrder[index]);

    setIsCorrect(correct);
    setAttempts(attempts + 1);

    const xp = correct ? (attempts === 0 ? 10 : 5) : 0;
    onComplete(correct, xp);
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Prompt */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase text-gray-500 font-medium">
            Bouw deze zin
          </h2>
          <div className="text-2xl font-bold text-gray-900">
            {exercise.prompt}
          </div>
        </div>

        {/* Selected words area */}
        <div className="min-h-20 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          {selectedWords.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              Tik op woorden hieronder om je antwoord te bouwen
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedWords.map((word, index) => (
                <Button
                  key={index}
                  variant="default"
                  size="lg"
                  className="text-lg"
                  onClick={() => handleRemoveWord(index)}
                  disabled={showExplanation}
                >
                  {word}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Available words */}
        {!showExplanation && availableWords.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {availableWords.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => handleWordClick(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        )}

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
                Juiste antwoord: <strong>{exercise.correctOrder.join(" ")}</strong>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!showExplanation ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setAvailableWords([
                    ...exercise.correctOrder,
                    ...exercise.distractorWords,
                  ].sort(() => Math.random() - 0.5));
                  setSelectedWords([]);
                }}
              >
                Reset
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleCheck}
                disabled={selectedWords.length === 0}
              >
                Controleer
              </Button>
            </>
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

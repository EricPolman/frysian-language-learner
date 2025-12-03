"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FillInBlankExercise as FillInBlankExerciseType } from "@/types/content";

interface FillInBlankExerciseProps {
  exercise: FillInBlankExerciseType;
  onComplete: (correct: boolean, xp: number) => void;
  showExplanation: boolean;
  onContinue: () => void;
}

export function FillInBlankExercise({
  exercise,
  onComplete,
  showExplanation,
  onContinue,
}: FillInBlankExerciseProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Reset state when exercise changes
  useEffect(() => {
    setSelectedWord(null);
    setIsCorrect(null);
    setAttempts(0);
  }, [exercise.id]);

  // Keyboard navigation: 1-4 to select word, Enter to check/continue
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (showExplanation) {
        if (e.key === "Enter") {
          onContinue();
        }
        return;
      }

      // Number keys 1-4 to select word bank options
      const keyNum = parseInt(e.key);
      if (exercise.wordBank && keyNum >= 1 && keyNum <= exercise.wordBank.length) {
        setSelectedWord(exercise.wordBank[keyNum - 1]);
      } else if (e.key === "Enter" && selectedWord) {
        handleCheck();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showExplanation, onContinue, exercise.wordBank, selectedWord]);

  const words = exercise.sentence.split(" ");
  const blankWord = words[exercise.blankIndex];

  const handleCheck = () => {
    if (!selectedWord) return;

    const correct =
      selectedWord.toLowerCase() === exercise.correctAnswer.toLowerCase() ||
      exercise.acceptedAnswers?.some(
        (ans) => ans.toLowerCase() === selectedWord.toLowerCase()
      );

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
            Vul de lege plek in
          </h2>
          <div className="text-2xl text-gray-900 leading-relaxed">
            {words.map((word, index) => (
              <span key={index}>
                {index === exercise.blankIndex ? (
                  <span
                    className={`inline-block min-w-24 px-4 py-2 mx-1 border-2 rounded-lg text-center font-bold ${
                      showExplanation
                        ? isCorrect
                          ? "bg-green-100 border-green-500 text-green-700"
                          : "bg-red-100 border-red-500 text-red-700"
                        : selectedWord
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-100 border-gray-300 border-dashed"
                    }`}
                  >
                    {showExplanation
                      ? exercise.correctAnswer
                      : selectedWord || "___"}
                  </span>
                ) : (
                  <span>{word}</span>
                )}{" "}
              </span>
            ))}
          </div>
        </div>

        {/* Word bank */}
        {!showExplanation && exercise.wordBank && (
          <div className="grid grid-cols-2 gap-3">
            {exercise.wordBank.map((word, index) => (
              <Button
                key={word}
                variant={selectedWord === word ? "default" : "outline"}
                size="lg"
                className="text-lg"
                onClick={() => setSelectedWord(word)}
              >
                <kbd className="hidden sm:inline mr-2 px-2 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-300 rounded text-gray-600">
                  {index + 1}
                </kbd>
                {word}
              </Button>
            ))}
          </div>
        )}

        {/* Hint */}
        {exercise.hint && !showExplanation && attempts > 0 && !isCorrect && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">💡 Tip: {exercise.hint}</div>
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
              {isCorrect ? "✓ Goed!" : "✗ Niet helemaal"}
            </div>
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
              disabled={!selectedWord}
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

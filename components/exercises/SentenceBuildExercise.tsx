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

  // Keyboard navigation: number keys to select, Backspace to undo, Enter to check/continue
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

      // Number keys to select available words
      const keyNum = parseInt(e.key);
      if (keyNum >= 1 && keyNum <= availableWords.length) {
        const word = availableWords[keyNum - 1];
        setSelectedWords(prev => [...prev, word]);
        setAvailableWords(prev => prev.filter((w) => w !== word));
      } else if (e.key === "Backspace" && selectedWords.length > 0) {
        // Remove last selected word
        e.preventDefault();
        const lastWord = selectedWords[selectedWords.length - 1];
        setAvailableWords(prev => [...prev, lastWord]);
        setSelectedWords(prev => prev.slice(0, -1));
      } else if (e.key === "Enter" && selectedWords.length > 0) {
        handleCheck();
      } else if (e.key === "Escape") {
        // Reset all selections
        setAvailableWords([
          ...exercise.correctOrder,
          ...exercise.distractorWords,
        ].sort(() => Math.random() - 0.5));
        setSelectedWords([]);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showExplanation, onContinue, availableWords, selectedWords, exercise.correctOrder, exercise.distractorWords]);

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
              <span className="sm:hidden">Tik op woorden om je zin te bouwen</span>
              <span className="hidden sm:inline">Tik op woorden of gebruik toetsen 1-{availableWords.length} om je zin te bouwen</span>
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
                key={`${word}-${index}`}
                variant="outline"
                size="lg"
                className="text-lg"
                onClick={() => handleWordClick(word)}
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
                Opnieuw
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

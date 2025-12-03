"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Confetti } from "@/components/animations/Confetti";
import { LevelUpAnimation } from "@/components/animations/LevelUpAnimation";

interface ResultsClientProps {
  lessonId: string;
  xpEarned: number;
  accuracyPercent: number;
  correctCount: number;
  totalCount: number;
  isPerfect: boolean;
  weakWordsList: string[];
  newLevel?: number;
  previousLevel?: number;
}

export function ResultsClient({
  lessonId,
  xpEarned,
  accuracyPercent,
  correctCount,
  totalCount,
  isPerfect,
  weakWordsList,
  newLevel,
  previousLevel,
}: ResultsClientProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const didLevelUp = newLevel && previousLevel && newLevel > previousLevel;

  useEffect(() => {
    if (didLevelUp) {
      // Show level up after a brief delay
      const timer = setTimeout(() => {
        setShowLevelUp(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [didLevelUp]);

  return (
    <>
      <Confetti isActive={showConfetti} duration={4000} />
      
      {didLevelUp && (
        <LevelUpAnimation
          isVisible={showLevelUp}
          newLevel={newLevel}
          onComplete={() => setShowLevelUp(false)}
        />
      )}

      <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success animation */}
            <div className="text-8xl mb-6 animate-bounce">
              {isPerfect ? "🏆" : "🎉"}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {isPerfect ? "Perfect!" : "Les Voltooid!"}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {isPerfect
                ? "Fantastisch! Alles goed bij de eerste poging!"
                : "Goed gedaan! Je hebt deze les afgerond."}
            </p>

            {/* Stats */}
            <Card className="p-8 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-5xl font-bold text-yellow-500 mb-2">
                    +{xpEarned}
                  </div>
                  <div className="text-gray-600">XP Verdiend</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-blue-500 mb-2">
                    {accuracyPercent}%
                  </div>
                  <div className="text-gray-600">Nauwkeurigheid</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-lg text-gray-700">
                  <span className="font-semibold text-green-600">
                    {correctCount}
                  </span>{" "}
                  van <span className="font-semibold">{totalCount}</span> goed
                  bij eerste poging
                </div>
              </div>

              {/* Perfect bonus indicator */}
              {isPerfect && (
                <div className="mt-4 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg">
                  🌟 Perfecte bonus: +25 XP
                </div>
              )}

              {/* Level up indicator */}
              {didLevelUp && (
                <div className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-lg">
                  🎉 Nieuw Level! Je bent nu level {newLevel}!
                </div>
              )}
            </Card>

            {/* Weak words section */}
            {weakWordsList.length > 0 && (
              <Card className="p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-3">
                  📚 Woorden om te oefenen
                </h3>
                <div className="flex flex-wrap gap-2">
                  {weakWordsList.map((word, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                    >
                      {word}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Deze woorden komen vaker terug in toekomstige oefeningen.
                </p>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <Link href="/learn">
                <Button size="lg" className="w-full">
                  Ga Verder met Leren
                </Button>
              </Link>
              <Link href={`/learn/lesson/${lessonId}`}>
                <Button variant="outline" size="lg" className="w-full">
                  Oefen Opnieuw
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuccessAnimation } from "@/components/animations/SuccessAnimation";
import { useEffect, useState } from "react";

interface PracticeResultsClientProps {
  xpEarned: number;
  accuracy: number;
  correctCount: number;
  totalExercises: number;
}

export function PracticeResultsClient({
  xpEarned,
  accuracy,
  correctCount,
  totalExercises,
}: PracticeResultsClientProps) {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnimation(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (accuracy >= 90) return { emoji: "🌟", text: "Uitstekend!" };
    if (accuracy >= 70) return { emoji: "👏", text: "Goed gedaan!" };
    if (accuracy >= 50) return { emoji: "💪", text: "Blijf oefenen!" };
    return { emoji: "📚", text: "Oefening baart kunst!" };
  };

  const { emoji, text } = getMessage();

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-50 to-white py-8">
      {showAnimation && <SuccessAnimation isCorrect={true} />}
      
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            {/* Header */}
            <div className="mb-6">
              <div className="text-6xl mb-3">{emoji}</div>
              <h1 className="text-2xl font-bold text-gray-900">{text}</h1>
              <p className="text-gray-600 mt-2">Oefensessie voltooid</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
                <div className="text-sm text-gray-600">Nauwkeurigheid</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-yellow-600">+{xpEarned}</div>
                <div className="text-sm text-gray-600">XP verdiend</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-gray-600">{totalExercises}</div>
                <div className="text-sm text-gray-600">Totaal</div>
              </div>
            </div>

            {/* Encouragement */}
            {accuracy < 80 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-700">
                  💡 Tip: Blijf oefenen om je zwakke woorden te versterken. 
                  Hoe vaker je oefent, hoe beter je wordt!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/practice")}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                🔄 Nog een keer oefenen
              </Button>
              <Button
                onClick={() => router.push("/learn")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                📚 Doorgaan met leren
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
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

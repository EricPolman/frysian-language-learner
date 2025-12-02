"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Vocabulary } from "@/types/content";

interface IntroCardProps {
  vocabulary: Vocabulary;
  exampleSentence: string;
  onContinue: () => void;
}

export function IntroCard({
  vocabulary,
  exampleSentence,
  onContinue,
}: IntroCardProps) {
  return (
    <Card className="p-8">
      <div className="text-center space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-sm uppercase text-gray-500 font-medium">
            Nieuw Woord
          </h2>
          <div className="text-5xl font-bold text-blue-600">
            {vocabulary.frysian}
          </div>
        </div>

        {/* Translation */}
        <div className="space-y-2">
          <div className="text-2xl text-gray-700">{vocabulary.dutch}</div>
        </div>

        {/* Part of speech */}
        <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
          {vocabulary.partOfSpeech}
        </div>

        {/* Example sentence */}
        {exampleSentence && (
          <div className="pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 mb-2">Voorbeeld:</div>
            <div className="text-lg italic text-gray-700">{exampleSentence}</div>
          </div>
        )}

        {/* Audio button (placeholder) */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            // TODO: Play audio
            console.log("Play audio for:", vocabulary.frysian);
          }}
        >
          🔊 Beluister
        </Button>

        {/* Continue button */}
        <Button size="lg" className="w-full" onClick={onContinue}>
          Doorgaan
        </Button>
      </div>
    </Card>
  );
}

"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Vocabulary } from "@/types/content";

interface IntroCardProps {
  vocabulary: Vocabulary & { exampleTranslation?: string };
  exampleSentence: string;
  exampleTranslation?: string;
  onContinue: () => void;
}

export function IntroCard({
  vocabulary,
  exampleSentence,
  exampleTranslation,
  onContinue,
}: IntroCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get the translation from props or vocabulary object
  const translation = exampleTranslation || vocabulary.exampleTranslation;

  const playAudio = async () => {
    // Check if we have an audio URL from the vocabulary
    if (vocabulary.audioUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(vocabulary.audioUrl);
      }
      
      try {
        setIsPlaying(true);
        await audioRef.current.play();
        audioRef.current.onended = () => setIsPlaying(false);
      } catch (error) {
        console.error("Failed to play audio:", error);
        setIsPlaying(false);
        // Fallback to speech synthesis
        speakText(vocabulary.frysian);
      }
    } else {
      // Use Web Speech API as fallback
      speakText(vocabulary.frysian);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to use Dutch voice as closest to Frysian
      const voices = speechSynthesis.getVoices();
      const dutchVoice = voices.find(
        (voice) => voice.lang.startsWith("nl") || voice.lang.startsWith("fy")
      );
      if (dutchVoice) {
        utterance.voice = dutchVoice;
      }
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

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

        {/* Example sentence with translation */}
        {exampleSentence && (
          <div className="pt-6 border-t border-gray-200 space-y-2">
            <div className="text-sm text-gray-500">Voorbeeld:</div>
            <div className="text-lg italic text-gray-900">{exampleSentence}</div>
            {translation && (
              <div className="text-base text-gray-500">({translation})</div>
            )}
          </div>
        )}

        {/* Audio button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={playAudio}
          disabled={isPlaying}
        >
          {isPlaying ? "🔊 Speelt af..." : "🔊 Beluister"}
        </Button>

        {/* Continue button */}
        <Button size="lg" className="w-full" onClick={onContinue}>
          Doorgaan
        </Button>
      </div>
    </Card>
  );
}

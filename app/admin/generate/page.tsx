"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GeneratedVocabulary {
  frysian: string;
  dutch: string;
  partOfSpeech: string;
  exampleSentence: string;
  exampleTranslation: string;
}

interface GeneratedExercise {
  type: string;
  question?: string;
  correctAnswer?: string;
  acceptedAnswers?: string[];
  options?: string[];
  direction?: string;
  hint?: string;
  explanation?: string;
  sentence?: string;
  blankIndex?: number;
  wordBank?: string[];
  prompt?: string;
  correctOrder?: string[];
  distractorWords?: string[];
}

interface GeneratedLesson {
  lessonNumber: number;
  title: string;
  description: string;
  topic: string;
  vocabulary: GeneratedVocabulary[];
  exercises: GeneratedExercise[];
}

interface GeneratedSkill {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
}

interface GeneratedContent {
  skill: GeneratedSkill;
  lessons: GeneratedLesson[];
}

export default function GeneratePage() {
  const router = useRouter();
  const [mode, setMode] = useState<"skill" | "lesson">("skill");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Skill generation form
  const [skillForm, setSkillForm] = useState({
    theme: "",
    lessonCount: 4,
    difficulty: 1,
    vocabularyPerLesson: 5,
    exercisesPerLesson: 8,
  });

  // Lesson generation form
  const [lessonForm, setLessonForm] = useState({
    topic: "",
    skillTitle: "",
    lessonNumber: 1,
    difficulty: 1,
    vocabularyCount: 5,
    exerciseCount: 8,
  });

  async function generateSkill() {
    setGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      const res = await fetch("/api/admin/generate/skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skillForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      setGeneratedContent(data.content);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function generateLesson() {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/generate/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      // Wrap lesson in skill format for consistent display
      setGeneratedContent({
        skill: {
          id: "generated",
          title: lessonForm.skillTitle || "Nieuwe Vaardigheid",
          description: "",
          longDescription: "",
          icon: "📚",
          color: "#3b82f6",
        },
        lessons: [
          {
            lessonNumber: lessonForm.lessonNumber,
            title: data.content.title,
            description: data.content.description,
            topic: lessonForm.topic,
            vocabulary: data.content.vocabulary,
            exercises: data.content.exercises,
          },
        ],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function saveToDatabase() {
    if (!generatedContent) return;

    setSaving(true);
    setError(null);

    try {
      // First, create the skill if it's a full skill generation
      if (mode === "skill") {
        const skillRes = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: generatedContent.skill.id,
            title: generatedContent.skill.title,
            description: generatedContent.skill.description,
            longDescription: generatedContent.skill.longDescription,
            icon: generatedContent.skill.icon,
            color: generatedContent.skill.color,
            isPublished: false,
          }),
        });

        if (!skillRes.ok) {
          const err = await skillRes.json();
          throw new Error(`Failed to create skill: ${err.error}`);
        }
      }

      // Create each lesson with its content
      for (const lesson of generatedContent.lessons) {
        const skillId = mode === "skill" ? generatedContent.skill.id : lessonForm.skillTitle.toLowerCase().replace(/\s+/g, "-");
        const lessonId = `${skillId}-${lesson.lessonNumber}`;

        // Create lesson
        const lessonRes = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lessonId,
            skillId: skillId,
            lessonNumber: lesson.lessonNumber,
            title: lesson.title,
            description: lesson.description,
            topic: lesson.topic,
            difficulty: mode === "skill" ? skillForm.difficulty : lessonForm.difficulty,
            estimatedMinutes: 10,
            isPublished: false,
          }),
        });

        if (!lessonRes.ok) {
          const err = await lessonRes.json();
          throw new Error(`Failed to create lesson ${lesson.lessonNumber}: ${err.error}`);
        }

        // Add intro cards (vocabulary)
        for (let i = 0; i < lesson.vocabulary.length; i++) {
          const vocab = lesson.vocabulary[i];
          await fetch(`/api/admin/lessons/${lessonId}/intro-cards`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              vocabulary: {
                id: `${lessonId}-vocab-${i + 1}`,
                frysian: vocab.frysian,
                dutch: vocab.dutch,
                partOfSpeech: vocab.partOfSpeech,
                exampleSentence: vocab.exampleSentence,
                exampleTranslation: vocab.exampleTranslation,
              },
              exampleSentence: vocab.exampleSentence,
              exampleTranslation: vocab.exampleTranslation,
            }),
          });
        }

        // Add exercises
        for (let i = 0; i < lesson.exercises.length; i++) {
          const exercise = lesson.exercises[i];
          await fetch(`/api/admin/lessons/${lessonId}/exercises`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `${lessonId}-ex-${i + 1}`,
              ...exercise,
            }),
          });
        }
      }

      // Navigate to the created content
      if (mode === "skill") {
        router.push(`/admin/skills`);
      } else {
        const skillId = lessonForm.skillTitle.toLowerCase().replace(/\s+/g, "-");
        router.push(`/admin/lessons/${skillId}-${lessonForm.lessonNumber}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-blue-600">
            Admin
          </Link>
          <span>/</span>
          <span>Genereren</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🤖 AI Content Generator
            </h1>
            <p className="text-gray-600 mt-1">
              Genereer vaardigheden en lessen met AI
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={mode === "skill" ? "default" : "outline"}
            onClick={() => {
              setMode("skill");
              setGeneratedContent(null);
            }}
          >
            🌳 Complete Vaardigheid
          </Button>
          <Button
            variant={mode === "lesson" ? "default" : "outline"}
            onClick={() => {
              setMode("lesson");
              setGeneratedContent(null);
            }}
          >
            📖 Enkele Les
          </Button>
        </div>

        {/* Generation Form */}
        <Card className="p-6 mb-6">
          {mode === "skill" ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Complete Vaardigheid Genereren</h2>
              <p className="text-gray-600 text-sm">
                Genereer een complete vaardigheid met meerdere lessen, vocabulaire
                en oefeningen.
              </p>

              <div>
                <Label htmlFor="theme">Thema</Label>
                <Input
                  id="theme"
                  value={skillForm.theme}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, theme: e.target.value })
                  }
                  placeholder="bijv. Dieren, Eten, Reizen, Familie, Werk..."
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="lessonCount">Aantal Lessen</Label>
                  <Input
                    id="lessonCount"
                    type="number"
                    min={1}
                    max={10}
                    value={skillForm.lessonCount}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        lessonCount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Moeilijkheid</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min={1}
                    max={5}
                    value={skillForm.difficulty}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        difficulty: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vocabPerLesson">Woorden/Les</Label>
                  <Input
                    id="vocabPerLesson"
                    type="number"
                    min={3}
                    max={10}
                    value={skillForm.vocabularyPerLesson}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        vocabularyPerLesson: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="exercisesPerLesson">Oefeningen/Les</Label>
                  <Input
                    id="exercisesPerLesson"
                    type="number"
                    min={4}
                    max={15}
                    value={skillForm.exercisesPerLesson}
                    onChange={(e) =>
                      setSkillForm({
                        ...skillForm,
                        exercisesPerLesson: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={generateSkill}
                disabled={generating || !skillForm.theme}
                className="w-full"
              >
                {generating ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Genereren...
                  </>
                ) : (
                  <>🚀 Vaardigheid Genereren</>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Enkele Les Genereren</h2>
              <p className="text-gray-600 text-sm">
                Genereer een enkele les om toe te voegen aan een bestaande
                vaardigheid.
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topic">Onderwerp</Label>
                  <Input
                    id="topic"
                    value={lessonForm.topic}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, topic: e.target.value })
                    }
                    placeholder="bijv. Huisdieren, Ontbijt, Op het station..."
                  />
                </div>
                <div>
                  <Label htmlFor="skillTitle">Vaardigheid</Label>
                  <Input
                    id="skillTitle"
                    value={lessonForm.skillTitle}
                    onChange={(e) =>
                      setLessonForm({ ...lessonForm, skillTitle: e.target.value })
                    }
                    placeholder="bijv. Dieren"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="lessonNumber">Lesnummer</Label>
                  <Input
                    id="lessonNumber"
                    type="number"
                    min={1}
                    value={lessonForm.lessonNumber}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        lessonNumber: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lessonDifficulty">Moeilijkheid</Label>
                  <Input
                    id="lessonDifficulty"
                    type="number"
                    min={1}
                    max={5}
                    value={lessonForm.difficulty}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        difficulty: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="vocabCount">Woorden</Label>
                  <Input
                    id="vocabCount"
                    type="number"
                    min={3}
                    max={10}
                    value={lessonForm.vocabularyCount}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        vocabularyCount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="exerciseCount">Oefeningen</Label>
                  <Input
                    id="exerciseCount"
                    type="number"
                    min={4}
                    max={15}
                    value={lessonForm.exerciseCount}
                    onChange={(e) =>
                      setLessonForm({
                        ...lessonForm,
                        exerciseCount: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <Button
                onClick={generateLesson}
                disabled={generating || !lessonForm.topic}
                className="w-full"
              >
                {generating ? (
                  <>
                    <span className="animate-spin mr-2">⚙️</span>
                    Genereren...
                  </>
                ) : (
                  <>🚀 Les Genereren</>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Error */}
        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">❌ {error}</p>
          </Card>
        )}

        {/* Generated Content Preview */}
        {generatedContent && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">✨ Gegenereerde Content</h2>
              <Button onClick={saveToDatabase} disabled={saving}>
                {saving ? "Opslaan..." : "💾 Opslaan in Database"}
              </Button>
            </div>

            {/* Skill Info */}
            {mode === "skill" && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{generatedContent.skill.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg">
                      {generatedContent.skill.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {generatedContent.skill.description}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-2">
                  {generatedContent.skill.longDescription}
                </p>
              </div>
            )}

            {/* Lessons */}
            <div className="space-y-6">
              {generatedContent.lessons.map((lesson, lessonIndex) => (
                <div key={lessonIndex} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">
                    Les {lesson.lessonNumber}: {lesson.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>

                  {/* Vocabulary */}
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">
                      📚 Vocabulaire ({lesson.vocabulary.length} woorden)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {lesson.vocabulary.map((vocab, i) => (
                        <div
                          key={i}
                          className="p-2 bg-blue-50 rounded text-sm"
                        >
                          <div className="font-medium">
                            {vocab.frysian} = {vocab.dutch}
                          </div>
                          <div className="text-gray-600 text-xs">
                            {vocab.partOfSpeech} • {vocab.exampleSentence}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exercises Summary */}
                  <div>
                    <h4 className="font-semibold mb-2">
                      📝 Oefeningen ({lesson.exercises.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {lesson.exercises.map((ex, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded ${
                            ex.type === "translation"
                              ? "bg-green-100 text-green-800"
                              : ex.type === "multiple-choice"
                              ? "bg-purple-100 text-purple-800"
                              : ex.type === "fill-in-blank"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {ex.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

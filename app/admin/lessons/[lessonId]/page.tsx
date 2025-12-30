"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vocabulary {
  id: string;
  frysian: string;
  dutch: string;
  part_of_speech: string | null;
  example_sentence: string | null;
  example_translation: string | null;
}

interface IntroCard {
  id: string;
  lesson_id: string;
  vocabulary_id: string;
  order: number;
  example_sentence: string | null;
  example_translation: string | null;
  vocabulary: Vocabulary;
}

interface Exercise {
  id: string;
  lesson_id: string;
  type: string;
  order: number;
  data: Record<string, any>;
}

interface Lesson {
  id: string;
  skill_id: string;
  lesson_number: number;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: number;
  estimated_minutes: number;
  is_published: boolean;
}

interface Props {
  params: Promise<{ lessonId: string }>;
}

export default function LessonEditorPage({ params }: Props) {
  const { lessonId } = use(params);
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [introCards, setIntroCards] = useState<IntroCard[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "intro" | "exercises">("info");

  // Form states
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    topic: "",
    difficulty: 1,
    estimatedMinutes: 10,
    isPublished: false,
  });

  const [newIntroCard, setNewIntroCard] = useState({
    frysian: "",
    dutch: "",
    partOfSpeech: "",
    exampleSentence: "",
    exampleTranslation: "",
  });

  const [newExercise, setNewExercise] = useState({
    type: "translation",
    question: "",
    correctAnswer: "",
    acceptedAnswers: "",
    hint: "",
    explanation: "",
    direction: "dutch-to-frysian",
    options: "",
    sentence: "",
    blankIndex: 0,
    wordBank: "",
    prompt: "",
    correctOrder: "",
    distractorWords: "",
  });

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  async function fetchLesson() {
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`);
      const data = await res.json();

      if (data.lesson) {
        setLesson(data.lesson);
        setLessonForm({
          title: data.lesson.title,
          description: data.lesson.description || "",
          topic: data.lesson.topic || "",
          difficulty: data.lesson.difficulty,
          estimatedMinutes: data.lesson.estimated_minutes,
          isPublished: data.lesson.is_published,
        });
      }
      if (data.introCards) {
        setIntroCards(data.introCards);
      }
      if (data.exercises) {
        setExercises(data.exercises);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveLesson() {
    setSaving(true);
    try {
      await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lessonForm),
      });
      await fetchLesson();
    } catch (error) {
      console.error("Error saving lesson:", error);
    } finally {
      setSaving(false);
    }
  }

  async function addIntroCard() {
    try {
      await fetch(`/api/admin/lessons/${lessonId}/intro-cards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vocabulary: {
            id: `vocab-${Date.now()}`,
            frysian: newIntroCard.frysian,
            dutch: newIntroCard.dutch,
            partOfSpeech: newIntroCard.partOfSpeech || null,
            exampleSentence: newIntroCard.exampleSentence || null,
            exampleTranslation: newIntroCard.exampleTranslation || null,
          },
          exampleSentence: newIntroCard.exampleSentence || null,
          exampleTranslation: newIntroCard.exampleTranslation || null,
        }),
      });
      await fetchLesson();
      setNewIntroCard({
        frysian: "",
        dutch: "",
        partOfSpeech: "",
        exampleSentence: "",
        exampleTranslation: "",
      });
    } catch (error) {
      console.error("Error adding intro card:", error);
    }
  }

  async function deleteIntroCard(cardId: string) {
    try {
      await fetch(`/api/admin/lessons/${lessonId}/intro-cards?id=${cardId}`, {
        method: "DELETE",
      });
      await fetchLesson();
    } catch (error) {
      console.error("Error deleting intro card:", error);
    }
  }

  async function addExercise() {
    const exerciseData: Record<string, any> = {
      type: newExercise.type,
      hint: newExercise.hint || undefined,
      explanation: newExercise.explanation || undefined,
    };

    switch (newExercise.type) {
      case "translation":
        exerciseData.question = newExercise.question;
        exerciseData.correctAnswer = newExercise.correctAnswer;
        exerciseData.acceptedAnswers = newExercise.acceptedAnswers
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
        if (exerciseData.acceptedAnswers.length === 0) {
          exerciseData.acceptedAnswers = [newExercise.correctAnswer];
        }
        exerciseData.direction = newExercise.direction;
        break;

      case "multiple-choice":
        exerciseData.question = newExercise.question;
        exerciseData.correctAnswer = newExercise.correctAnswer;
        exerciseData.options = newExercise.options
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean);
        exerciseData.direction = newExercise.direction;
        break;

      case "fill-in-blank":
        exerciseData.sentence = newExercise.sentence;
        exerciseData.blankIndex = newExercise.blankIndex;
        exerciseData.correctAnswer = newExercise.correctAnswer;
        exerciseData.acceptedAnswers = newExercise.acceptedAnswers
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
        if (exerciseData.acceptedAnswers.length === 0) {
          exerciseData.acceptedAnswers = [newExercise.correctAnswer];
        }
        exerciseData.wordBank = newExercise.wordBank
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        break;

      case "sentence-build":
        exerciseData.prompt = newExercise.prompt;
        exerciseData.correctOrder = newExercise.correctOrder
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        exerciseData.distractorWords = newExercise.distractorWords
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        break;
    }

    try {
      await fetch(`/api/admin/lessons/${lessonId}/exercises`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exerciseData),
      });
      await fetchLesson();
      // Reset form
      setNewExercise({
        type: "translation",
        question: "",
        correctAnswer: "",
        acceptedAnswers: "",
        hint: "",
        explanation: "",
        direction: "dutch-to-frysian",
        options: "",
        sentence: "",
        blankIndex: 0,
        wordBank: "",
        prompt: "",
        correctOrder: "",
        distractorWords: "",
      });
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  }

  async function deleteExercise(exerciseId: string) {
    try {
      await fetch(`/api/admin/lessons/${lessonId}/exercises?id=${exerciseId}`, {
        method: "DELETE",
      });
      await fetchLesson();
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Laden...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Les niet gevonden</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/admin" className="hover:text-blue-600">Admin</Link>
          <span>/</span>
          <Link href="/admin/lessons" className="hover:text-blue-600">Lessen</Link>
          <span>/</span>
          <span>{lesson.title}</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="text-gray-600">{lesson.skill_id} - Les {lesson.lesson_number}</p>
          </div>
          <div className="flex items-center gap-2">
            {lesson.is_published ? (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Gepubliceerd
              </span>
            ) : (
              <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                Concept
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b mb-6">
          {[
            { id: "info", label: "Informatie" },
            { id: "intro", label: `Introkaarten (${introCards.length})` },
            { id: "exercises", label: `Oefeningen (${exercises.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Tab */}
        {activeTab === "info" && (
          <Card className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveLesson();
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Beschrijving</Label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="topic">Onderwerp</Label>
                  <Input
                    id="topic"
                    value={lessonForm.topic}
                    onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Moeilijkheid</Label>
                  <Input
                    id="difficulty"
                    type="number"
                    min={1}
                    max={5}
                    value={lessonForm.difficulty}
                    onChange={(e) => setLessonForm({ ...lessonForm, difficulty: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedMinutes">Tijd (min)</Label>
                  <Input
                    id="estimatedMinutes"
                    type="number"
                    min={1}
                    value={lessonForm.estimatedMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, estimatedMinutes: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={lessonForm.isPublished}
                  onChange={(e) => setLessonForm({ ...lessonForm, isPublished: e.target.checked })}
                />
                <Label htmlFor="isPublished">Gepubliceerd</Label>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Opslaan..." : "Opslaan"}
              </Button>
            </form>
          </Card>
        )}

        {/* Intro Cards Tab */}
        {activeTab === "intro" && (
          <div className="space-y-6">
            {/* Add new intro card form */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Nieuwe Introkaart</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Fries woord</Label>
                  <Input
                    value={newIntroCard.frysian}
                    onChange={(e) => setNewIntroCard({ ...newIntroCard, frysian: e.target.value })}
                    placeholder="bijv. Goeie"
                  />
                </div>
                <div>
                  <Label>Nederlandse vertaling</Label>
                  <Input
                    value={newIntroCard.dutch}
                    onChange={(e) => setNewIntroCard({ ...newIntroCard, dutch: e.target.value })}
                    placeholder="bijv. Hallo"
                  />
                </div>
                <div>
                  <Label>Woordsoort</Label>
                  <Input
                    value={newIntroCard.partOfSpeech}
                    onChange={(e) => setNewIntroCard({ ...newIntroCard, partOfSpeech: e.target.value })}
                    placeholder="bijv. zelfstandig naamwoord"
                  />
                </div>
                <div>
                  <Label>Voorbeeldzin (Fries)</Label>
                  <Input
                    value={newIntroCard.exampleSentence}
                    onChange={(e) => setNewIntroCard({ ...newIntroCard, exampleSentence: e.target.value })}
                    placeholder="bijv. Goeie, hoe giet it?"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Vertaling voorbeeldzin</Label>
                  <Input
                    value={newIntroCard.exampleTranslation}
                    onChange={(e) => setNewIntroCard({ ...newIntroCard, exampleTranslation: e.target.value })}
                    placeholder="bijv. Hallo, hoe gaat het?"
                  />
                </div>
              </div>
              <Button
                className="mt-4"
                onClick={addIntroCard}
                disabled={!newIntroCard.frysian || !newIntroCard.dutch}
              >
                + Toevoegen
              </Button>
            </Card>

            {/* Existing intro cards */}
            <div className="space-y-3">
              {introCards.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                  Nog geen introkaarten. Voeg er hierboven een toe.
                </Card>
              ) : (
                introCards.sort((a, b) => a.order - b.order).map((card, index) => (
                  <Card key={card.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl font-bold text-blue-600">{card.vocabulary?.frysian}</span>
                          <span className="text-gray-400">=</span>
                          <span className="text-lg">{card.vocabulary?.dutch}</span>
                          {card.vocabulary?.part_of_speech && (
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                              {card.vocabulary.part_of_speech}
                            </span>
                          )}
                        </div>
                        {card.vocabulary?.example_sentence && (
                          <p className="text-sm text-gray-600">
                            "{card.vocabulary.example_sentence}"
                            {card.vocabulary?.example_translation && (
                              <span className="text-gray-400"> — {card.vocabulary.example_translation}</span>
                            )}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => deleteIntroCard(card.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Exercises Tab */}
        {activeTab === "exercises" && (
          <div className="space-y-6">
            {/* Add new exercise form */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Nieuwe Oefening</h3>
              
              <div className="mb-4">
                <Label>Type oefening</Label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newExercise.type}
                  onChange={(e) => setNewExercise({ ...newExercise, type: e.target.value })}
                >
                  <option value="translation">Vertaling</option>
                  <option value="multiple-choice">Meerkeuze</option>
                  <option value="fill-in-blank">Invullen</option>
                  <option value="sentence-build">Zin bouwen</option>
                </select>
              </div>

              {/* Translation exercise fields */}
              {newExercise.type === "translation" && (
                <div className="space-y-4">
                  <div>
                    <Label>Richting</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newExercise.direction}
                      onChange={(e) => setNewExercise({ ...newExercise, direction: e.target.value })}
                    >
                      <option value="dutch-to-frysian">Nederlands → Fries</option>
                      <option value="frysian-to-dutch">Fries → Nederlands</option>
                    </select>
                  </div>
                  <div>
                    <Label>Vraag (te vertalen woord/zin)</Label>
                    <Input
                      value={newExercise.question}
                      onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
                      placeholder="bijv. goedemiddag"
                    />
                  </div>
                  <div>
                    <Label>Correct antwoord</Label>
                    <Input
                      value={newExercise.correctAnswer}
                      onChange={(e) => setNewExercise({ ...newExercise, correctAnswer: e.target.value })}
                      placeholder="bijv. Goeiemiddei"
                    />
                  </div>
                  <div>
                    <Label>Alternatieve antwoorden (komma-gescheiden)</Label>
                    <Input
                      value={newExercise.acceptedAnswers}
                      onChange={(e) => setNewExercise({ ...newExercise, acceptedAnswers: e.target.value })}
                      placeholder="bijv. Goeiemiddei, Goeie middei"
                    />
                  </div>
                </div>
              )}

              {/* Multiple choice exercise fields */}
              {newExercise.type === "multiple-choice" && (
                <div className="space-y-4">
                  <div>
                    <Label>Richting</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newExercise.direction}
                      onChange={(e) => setNewExercise({ ...newExercise, direction: e.target.value })}
                    >
                      <option value="dutch-to-frysian">Nederlands → Fries</option>
                      <option value="frysian-to-dutch">Fries → Nederlands</option>
                    </select>
                  </div>
                  <div>
                    <Label>Vraag</Label>
                    <Input
                      value={newExercise.question}
                      onChange={(e) => setNewExercise({ ...newExercise, question: e.target.value })}
                      placeholder="Wat is de Friese vertaling van 'hallo'?"
                    />
                  </div>
                  <div>
                    <Label>Correct antwoord</Label>
                    <Input
                      value={newExercise.correctAnswer}
                      onChange={(e) => setNewExercise({ ...newExercise, correctAnswer: e.target.value })}
                      placeholder="Goeie"
                    />
                  </div>
                  <div>
                    <Label>Alle opties (komma-gescheiden, inclusief correct antwoord)</Label>
                    <Input
                      value={newExercise.options}
                      onChange={(e) => setNewExercise({ ...newExercise, options: e.target.value })}
                      placeholder="Goeie, Goeiemoarn, Goeiejûn, Goeiemiddei"
                    />
                  </div>
                </div>
              )}

              {/* Fill in blank exercise fields */}
              {newExercise.type === "fill-in-blank" && (
                <div className="space-y-4">
                  <div>
                    <Label>Zin (gebruik ___ voor de lege plek)</Label>
                    <Input
                      value={newExercise.sentence}
                      onChange={(e) => setNewExercise({ ...newExercise, sentence: e.target.value })}
                      placeholder="Ik ___ nei skoalle. (ga)"
                    />
                  </div>
                  <div>
                    <Label>Index van lege plek (0 = eerste woord)</Label>
                    <Input
                      type="number"
                      min={0}
                      value={newExercise.blankIndex}
                      onChange={(e) => setNewExercise({ ...newExercise, blankIndex: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label>Correct antwoord</Label>
                    <Input
                      value={newExercise.correctAnswer}
                      onChange={(e) => setNewExercise({ ...newExercise, correctAnswer: e.target.value })}
                      placeholder="gean"
                    />
                  </div>
                  <div>
                    <Label>Woordenbank (komma-gescheiden)</Label>
                    <Input
                      value={newExercise.wordBank}
                      onChange={(e) => setNewExercise({ ...newExercise, wordBank: e.target.value })}
                      placeholder="gean, rin, sit, stean"
                    />
                  </div>
                </div>
              )}

              {/* Sentence build exercise fields */}
              {newExercise.type === "sentence-build" && (
                <div className="space-y-4">
                  <div>
                    <Label>Opdracht (te vertalen zin)</Label>
                    <Input
                      value={newExercise.prompt}
                      onChange={(e) => setNewExercise({ ...newExercise, prompt: e.target.value })}
                      placeholder="Ik ga naar school"
                    />
                  </div>
                  <div>
                    <Label>Correcte volgorde (komma-gescheiden woorden)</Label>
                    <Input
                      value={newExercise.correctOrder}
                      onChange={(e) => setNewExercise({ ...newExercise, correctOrder: e.target.value })}
                      placeholder="Ik, gean, nei, skoalle"
                    />
                  </div>
                  <div>
                    <Label>Afleidingswoorden (komma-gescheiden)</Label>
                    <Input
                      value={newExercise.distractorWords}
                      onChange={(e) => setNewExercise({ ...newExercise, distractorWords: e.target.value })}
                      placeholder="hy, sy, wurk"
                    />
                  </div>
                </div>
              )}

              {/* Common fields */}
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Hint (optioneel)</Label>
                  <Input
                    value={newExercise.hint}
                    onChange={(e) => setNewExercise({ ...newExercise, hint: e.target.value })}
                    placeholder="Een kleine tip voor de gebruiker"
                  />
                </div>
                <div>
                  <Label>Uitleg (optioneel)</Label>
                  <Input
                    value={newExercise.explanation}
                    onChange={(e) => setNewExercise({ ...newExercise, explanation: e.target.value })}
                    placeholder="Uitleg na het antwoord"
                  />
                </div>
              </div>

              <Button className="mt-4" onClick={addExercise}>
                + Toevoegen
              </Button>
            </Card>

            {/* Existing exercises */}
            <div className="space-y-3">
              {exercises.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                  Nog geen oefeningen. Voeg er hierboven een toe.
                </Card>
              ) : (
                exercises.sort((a, b) => a.order - b.order).map((ex, index) => (
                  <Card key={ex.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                            ex.type === "translation" ? "bg-blue-100 text-blue-800" :
                            ex.type === "multiple-choice" ? "bg-green-100 text-green-800" :
                            ex.type === "fill-in-blank" ? "bg-yellow-100 text-yellow-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {ex.type === "translation" ? "Vertaling" :
                             ex.type === "multiple-choice" ? "Meerkeuze" :
                             ex.type === "fill-in-blank" ? "Invullen" :
                             "Zin bouwen"}
                          </span>
                        </div>
                        <p className="font-medium">
                          {ex.data.question || ex.data.sentence || ex.data.prompt}
                        </p>
                        <p className="text-sm text-gray-600">
                          Antwoord: {ex.data.correctAnswer || ex.data.correctOrder?.join(" ")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                        onClick={() => deleteExercise(ex.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

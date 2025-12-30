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
  const [generating, setGenerating] = useState(false);
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

  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editExerciseForm, setEditExerciseForm] = useState({
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

  const [editingIntroCard, setEditingIntroCard] = useState<IntroCard | null>(null);
  const [editIntroCardForm, setEditIntroCardForm] = useState({
    frysian: "",
    dutch: "",
    partOfSpeech: "",
    exampleSentence: "",
    exampleTranslation: "",
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

  async function generateWithAI() {
    if (!lesson) return;
    
    const topic = lessonForm.topic || lessonForm.title || "algemene woordenschat";
    
    if (!confirm(`AI-content genereren voor deze les over "${topic}"? Dit voegt nieuwe vocabulaire en oefeningen toe.`)) {
      return;
    }
    
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          skillTitle: lesson.skill_id,
          lessonNumber: lesson.lesson_number,
          difficulty: lessonForm.difficulty,
          vocabularyCount: 5,
          exerciseCount: 8,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate");
      }

      // Add generated vocabulary as intro cards
      for (let i = 0; i < data.content.vocabulary.length; i++) {
        const vocab = data.content.vocabulary[i];
        await fetch(`/api/admin/lessons/${lessonId}/intro-cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vocabulary: {
              id: `${lessonId}-ai-vocab-${Date.now()}-${i}`,
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

      // Add generated exercises
      for (let i = 0; i < data.content.exercises.length; i++) {
        const exercise = data.content.exercises[i];
        await fetch(`/api/admin/lessons/${lessonId}/exercises`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: `${lessonId}-ai-ex-${Date.now()}-${i}`,
            ...exercise,
          }),
        });
      }

      await fetchLesson();
      alert("AI-content succesvol gegenereerd!");
    } catch (error: any) {
      console.error("Error generating content:", error);
      alert(`Fout bij genereren: ${error.message}`);
    } finally {
      setGenerating(false);
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

  function startEditIntroCard(card: IntroCard) {
    setEditingIntroCard(card);
    setEditIntroCardForm({
      frysian: card.vocabulary?.frysian || "",
      dutch: card.vocabulary?.dutch || "",
      partOfSpeech: card.vocabulary?.part_of_speech || "",
      exampleSentence: card.vocabulary?.example_sentence || card.example_sentence || "",
      exampleTranslation: card.vocabulary?.example_translation || card.example_translation || "",
    });
  }

  function cancelEditIntroCard() {
    setEditingIntroCard(null);
    setEditIntroCardForm({
      frysian: "",
      dutch: "",
      partOfSpeech: "",
      exampleSentence: "",
      exampleTranslation: "",
    });
  }

  async function updateIntroCard() {
    if (!editingIntroCard) return;

    try {
      await fetch(`/api/admin/lessons/${lessonId}/intro-cards`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingIntroCard.id,
          vocabulary: {
            id: editingIntroCard.vocabulary_id,
            frysian: editIntroCardForm.frysian,
            dutch: editIntroCardForm.dutch,
            partOfSpeech: editIntroCardForm.partOfSpeech || null,
            exampleSentence: editIntroCardForm.exampleSentence || null,
            exampleTranslation: editIntroCardForm.exampleTranslation || null,
          },
          exampleSentence: editIntroCardForm.exampleSentence || null,
          exampleTranslation: editIntroCardForm.exampleTranslation || null,
        }),
      });
      await fetchLesson();
      cancelEditIntroCard();
    } catch (error) {
      console.error("Error updating intro card:", error);
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

  function startEditExercise(exercise: Exercise) {
    setEditingExercise(exercise);
    const data = exercise.data;
    setEditExerciseForm({
      type: exercise.type,
      question: data.question || "",
      correctAnswer: data.correctAnswer || "",
      acceptedAnswers: Array.isArray(data.acceptedAnswers) ? data.acceptedAnswers.join(", ") : "",
      hint: data.hint || "",
      explanation: data.explanation || "",
      direction: data.direction || "dutch-to-frysian",
      options: Array.isArray(data.options) ? data.options.join(", ") : "",
      sentence: data.sentence || "",
      blankIndex: data.blankIndex || 0,
      wordBank: Array.isArray(data.wordBank) ? data.wordBank.join(", ") : "",
      prompt: data.prompt || "",
      correctOrder: Array.isArray(data.correctOrder) ? data.correctOrder.join(", ") : "",
      distractorWords: Array.isArray(data.distractorWords) ? data.distractorWords.join(", ") : "",
    });
  }

  function cancelEditExercise() {
    setEditingExercise(null);
    setEditExerciseForm({
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
  }

  async function updateExercise() {
    if (!editingExercise) return;

    const exerciseData: Record<string, any> = {
      id: editingExercise.id,
      type: editExerciseForm.type,
      order: editingExercise.order,
      hint: editExerciseForm.hint || undefined,
      explanation: editExerciseForm.explanation || undefined,
    };

    switch (editExerciseForm.type) {
      case "translation":
        exerciseData.question = editExerciseForm.question;
        exerciseData.correctAnswer = editExerciseForm.correctAnswer;
        exerciseData.acceptedAnswers = editExerciseForm.acceptedAnswers
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
        if (exerciseData.acceptedAnswers.length === 0) {
          exerciseData.acceptedAnswers = [editExerciseForm.correctAnswer];
        }
        exerciseData.direction = editExerciseForm.direction;
        break;

      case "multiple-choice":
        exerciseData.question = editExerciseForm.question;
        exerciseData.correctAnswer = editExerciseForm.correctAnswer;
        exerciseData.options = editExerciseForm.options
          .split(",")
          .map((o) => o.trim())
          .filter(Boolean);
        exerciseData.direction = editExerciseForm.direction;
        break;

      case "fill-in-blank":
        exerciseData.sentence = editExerciseForm.sentence;
        exerciseData.blankIndex = editExerciseForm.blankIndex;
        exerciseData.correctAnswer = editExerciseForm.correctAnswer;
        exerciseData.acceptedAnswers = editExerciseForm.acceptedAnswers
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean);
        if (exerciseData.acceptedAnswers.length === 0) {
          exerciseData.acceptedAnswers = [editExerciseForm.correctAnswer];
        }
        exerciseData.wordBank = editExerciseForm.wordBank
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        break;

      case "sentence-build":
        exerciseData.prompt = editExerciseForm.prompt;
        exerciseData.correctOrder = editExerciseForm.correctOrder
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        exerciseData.distractorWords = editExerciseForm.distractorWords
          .split(",")
          .map((w) => w.trim())
          .filter(Boolean);
        break;
    }

    try {
      await fetch(`/api/admin/lessons/${lessonId}/exercises`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exerciseData),
      });
      await fetchLesson();
      cancelEditExercise();
    } catch (error) {
      console.error("Error updating exercise:", error);
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
            <Button
              onClick={generateWithAI}
              disabled={generating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {generating ? (
                <>
                  <span className="animate-spin mr-2">⚙️</span>
                  Genereren...
                </>
              ) : (
                <>🤖 AI Genereren</>
              )}
            </Button>
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
                    {editingIntroCard?.id === card.id ? (
                      /* Edit form for this intro card */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-blue-600">Introkaart bewerken</h4>
                          <Button size="sm" variant="outline" onClick={cancelEditIntroCard}>
                            Annuleren
                          </Button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Fries woord</Label>
                            <Input
                              value={editIntroCardForm.frysian}
                              onChange={(e) => setEditIntroCardForm({ ...editIntroCardForm, frysian: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Nederlandse vertaling</Label>
                            <Input
                              value={editIntroCardForm.dutch}
                              onChange={(e) => setEditIntroCardForm({ ...editIntroCardForm, dutch: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Woordsoort</Label>
                            <Input
                              value={editIntroCardForm.partOfSpeech}
                              onChange={(e) => setEditIntroCardForm({ ...editIntroCardForm, partOfSpeech: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Voorbeeldzin (Fries)</Label>
                            <Input
                              value={editIntroCardForm.exampleSentence}
                              onChange={(e) => setEditIntroCardForm({ ...editIntroCardForm, exampleSentence: e.target.value })}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Vertaling voorbeeldzin</Label>
                            <Input
                              value={editIntroCardForm.exampleTranslation}
                              onChange={(e) => setEditIntroCardForm({ ...editIntroCardForm, exampleTranslation: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={updateIntroCard}>Opslaan</Button>
                          <Button variant="outline" onClick={cancelEditIntroCard}>Annuleren</Button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode */
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
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditIntroCard(card)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => deleteIntroCard(card.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
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
                    {editingExercise?.id === ex.id ? (
                      /* Edit form for this exercise */
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-purple-600">Oefening bewerken</h4>
                          <Button size="sm" variant="outline" onClick={cancelEditExercise}>
                            Annuleren
                          </Button>
                        </div>

                        <div className="mb-4">
                          <Label>Type oefening</Label>
                          <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={editExerciseForm.type}
                            onChange={(e) => setEditExerciseForm({ ...editExerciseForm, type: e.target.value })}
                          >
                            <option value="translation">Vertaling</option>
                            <option value="multiple-choice">Meerkeuze</option>
                            <option value="fill-in-blank">Invullen</option>
                            <option value="sentence-build">Zin bouwen</option>
                          </select>
                        </div>

                        {/* Translation fields */}
                        {editExerciseForm.type === "translation" && (
                          <div className="space-y-4">
                            <div>
                              <Label>Richting</Label>
                              <select
                                className="w-full px-3 py-2 border rounded-md"
                                value={editExerciseForm.direction}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, direction: e.target.value })}
                              >
                                <option value="dutch-to-frysian">Nederlands → Fries</option>
                                <option value="frysian-to-dutch">Fries → Nederlands</option>
                              </select>
                            </div>
                            <div>
                              <Label>Vraag</Label>
                              <Input
                                value={editExerciseForm.question}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, question: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Correct antwoord</Label>
                              <Input
                                value={editExerciseForm.correctAnswer}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, correctAnswer: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Alternatieve antwoorden (komma-gescheiden)</Label>
                              <Input
                                value={editExerciseForm.acceptedAnswers}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, acceptedAnswers: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Multiple choice fields */}
                        {editExerciseForm.type === "multiple-choice" && (
                          <div className="space-y-4">
                            <div>
                              <Label>Richting</Label>
                              <select
                                className="w-full px-3 py-2 border rounded-md"
                                value={editExerciseForm.direction}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, direction: e.target.value })}
                              >
                                <option value="dutch-to-frysian">Nederlands → Fries</option>
                                <option value="frysian-to-dutch">Fries → Nederlands</option>
                              </select>
                            </div>
                            <div>
                              <Label>Vraag</Label>
                              <Input
                                value={editExerciseForm.question}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, question: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Correct antwoord</Label>
                              <Input
                                value={editExerciseForm.correctAnswer}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, correctAnswer: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Alle opties (komma-gescheiden)</Label>
                              <Input
                                value={editExerciseForm.options}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, options: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Fill in blank fields */}
                        {editExerciseForm.type === "fill-in-blank" && (
                          <div className="space-y-4">
                            <div>
                              <Label>Zin (gebruik ___ voor de lege plek)</Label>
                              <Input
                                value={editExerciseForm.sentence}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, sentence: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Index van lege plek</Label>
                              <Input
                                type="number"
                                min={0}
                                value={editExerciseForm.blankIndex}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, blankIndex: parseInt(e.target.value) })}
                              />
                            </div>
                            <div>
                              <Label>Correct antwoord</Label>
                              <Input
                                value={editExerciseForm.correctAnswer}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, correctAnswer: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Woordenbank (komma-gescheiden)</Label>
                              <Input
                                value={editExerciseForm.wordBank}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, wordBank: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Sentence build fields */}
                        {editExerciseForm.type === "sentence-build" && (
                          <div className="space-y-4">
                            <div>
                              <Label>Opdracht (te vertalen zin)</Label>
                              <Input
                                value={editExerciseForm.prompt}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, prompt: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Correcte volgorde (komma-gescheiden)</Label>
                              <Input
                                value={editExerciseForm.correctOrder}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, correctOrder: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Afleidingswoorden (komma-gescheiden)</Label>
                              <Input
                                value={editExerciseForm.distractorWords}
                                onChange={(e) => setEditExerciseForm({ ...editExerciseForm, distractorWords: e.target.value })}
                              />
                            </div>
                          </div>
                        )}

                        {/* Common fields */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Hint (optioneel)</Label>
                            <Input
                              value={editExerciseForm.hint}
                              onChange={(e) => setEditExerciseForm({ ...editExerciseForm, hint: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label>Uitleg (optioneel)</Label>
                            <Input
                              value={editExerciseForm.explanation}
                              onChange={(e) => setEditExerciseForm({ ...editExerciseForm, explanation: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={updateExercise}>Opslaan</Button>
                          <Button variant="outline" onClick={cancelEditExercise}>Annuleren</Button>
                        </div>
                      </div>
                    ) : (
                      /* Display mode */
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
                          {ex.data.hint && (
                            <p className="text-xs text-gray-500 mt-1">💡 {ex.data.hint}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditExercise(ex)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => deleteExercise(ex.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    )}
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

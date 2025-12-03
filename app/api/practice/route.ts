import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import path from "path";

interface VocabularyItem {
  id: string;
  frysian: string;
  dutch: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
}

interface Exercise {
  type: string;
  id: string;
  [key: string]: any;
}

// Get all vocabulary from completed lessons
async function getAllVocabulary(completedLessons: string[]): Promise<Map<string, VocabularyItem>> {
  const vocabMap = new Map<string, VocabularyItem>();
  const lessonsDir = path.join(process.cwd(), "data/lessons");

  for (const lessonId of completedLessons) {
    try {
      const lessonPath = path.join(lessonsDir, `${lessonId}.json`);
      if (fs.existsSync(lessonPath)) {
        const lessonData = JSON.parse(fs.readFileSync(lessonPath, "utf-8"));
        for (const intro of lessonData.introCards || []) {
          if (intro.vocabulary) {
            vocabMap.set(intro.vocabulary.frysian.toLowerCase(), intro.vocabulary);
          }
        }
      }
    } catch (error) {
      console.error(`Error loading lesson ${lessonId}:`, error);
    }
  }

  return vocabMap;
}

// Generate exercises for weak words
function generatePracticeExercises(
  weakWordsData: Array<{ word_id: string; strength: number; incorrect_count: number }>,
  allVocab: Map<string, VocabularyItem>
): Exercise[] {
  const exercises: Exercise[] = [];
  const vocabList = Array.from(allVocab.values());
  
  // Sort by strength (weakest first) and incorrect count
  const sortedWeakWords = [...weakWordsData].sort((a, b) => {
    if (a.strength !== b.strength) return a.strength - b.strength;
    return b.incorrect_count - a.incorrect_count;
  });

  // Take top 6 weak words (or all if less than 6)
  const targetWords = sortedWeakWords.slice(0, 6);
  let exerciseId = 0;

  for (const weakWord of targetWords) {
    const vocab = allVocab.get(weakWord.word_id.toLowerCase()) || 
                  vocabList.find(v => v.frysian.toLowerCase() === weakWord.word_id.toLowerCase());
    
    if (!vocab) continue;

    // Generate 2 exercises per weak word
    
    // Exercise 1: Translation Dutch -> Frisian
    exercises.push({
      type: "translation",
      id: `practice-trans-${exerciseId++}`,
      question: vocab.dutch,
      correctAnswer: vocab.frysian,
      acceptedAnswers: [vocab.frysian],
      hint: vocab.partOfSpeech ? `Dit is een ${vocab.partOfSpeech}` : undefined,
      explanation: `'${vocab.frysian}' betekent '${vocab.dutch}' in het Fries`,
      direction: "dutch-to-frysian",
      vocabularyId: vocab.id,
    });

    // Exercise 2: Translation Frisian -> Dutch (reverse)
    exercises.push({
      type: "translation",
      id: `practice-trans-rev-${exerciseId++}`,
      question: vocab.frysian,
      correctAnswer: vocab.dutch,
      acceptedAnswers: [vocab.dutch],
      hint: vocab.partOfSpeech ? `Dit is een ${vocab.partOfSpeech}` : undefined,
      explanation: `'${vocab.frysian}' betekent '${vocab.dutch}' in het Nederlands`,
      direction: "frysian-to-dutch",
      vocabularyId: vocab.id,
    });

    // Exercise 3: Multiple choice (if we have enough vocab for options)
    if (vocabList.length >= 4) {
      const otherVocab = vocabList.filter(v => v.frysian !== vocab.frysian);
      const shuffled = otherVocab.sort(() => Math.random() - 0.5);
      const distractors = shuffled.slice(0, 3).map(v => v.frysian);
      const options = [vocab.frysian, ...distractors].sort(() => Math.random() - 0.5);

      exercises.push({
        type: "multiple-choice",
        id: `practice-mc-${exerciseId++}`,
        question: `Hoe zeg je '${vocab.dutch}' in het Fries?`,
        correctAnswer: vocab.frysian,
        options,
        hint: vocab.partOfSpeech ? `Het is een ${vocab.partOfSpeech}` : undefined,
        explanation: `'${vocab.frysian}' betekent '${vocab.dutch}'`,
        direction: "dutch-to-frysian",
        vocabularyId: vocab.id,
      });
    }
  }

  // Shuffle exercises
  return exercises.sort(() => Math.random() - 0.5);
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Get user's completed lessons
    const { data: progressData } = await supabase
      .from("user_progress")
      .select("completed_lessons")
      .eq("user_id", user.id)
      .single();

    const completedLessons = (progressData as any)?.completed_lessons || [];

    if (completedLessons.length === 0) {
      return NextResponse.json({ 
        error: "Nog geen lessen voltooid",
        hasWeakWords: false,
        exercises: [],
      });
    }

    // Get all vocabulary from completed lessons
    const allVocab = await getAllVocabulary(completedLessons);

    interface WeakWordData {
  word_id: string;
  strength: number;
  incorrect_count: number;
  correct_count: number;
}

// Get weak words:
    // - Strength < 4 (not yet mastered)
    // - OR strength = 4 but incorrect_count > correct_count (still struggling)
    // Words with strength >= 4 and more correct than incorrect are considered mastered
    const { data: weakWordsData } = await supabase
      .from("word_progress")
      .select("word_id, strength, incorrect_count, correct_count")
      .eq("user_id", user.id)
      .lt("strength", 4)  // Only words with strength < 4 are weak
      .order("strength", { ascending: true })
      .order("incorrect_count", { ascending: false })
      .limit(10);

    // If no weak words tracked yet, pick random words from completed lessons
    let wordsToReview: WeakWordData[] = (weakWordsData as WeakWordData[]) || [];
    
    if (wordsToReview.length === 0 && allVocab.size > 0) {
      // No tracked weak words, but user has completed lessons
      // Create "due for review" words from vocabulary
      const vocabArray = Array.from(allVocab.values());
      const shuffled = vocabArray.sort(() => Math.random() - 0.5);
      wordsToReview = shuffled.slice(0, 6).map(v => ({
        word_id: v.frysian,
        strength: 2,
        incorrect_count: 0,
        correct_count: 0,
      }));
    }

    if (wordsToReview.length === 0) {
      return NextResponse.json({
        hasWeakWords: false,
        exercises: [],
        message: "Geen zwakke woorden gevonden. Je doet het geweldig!",
      });
    }

    // Generate practice exercises
    const exercises = generatePracticeExercises(wordsToReview, allVocab);

    return NextResponse.json({
      hasWeakWords: true,
      weakWordCount: wordsToReview.length,
      exercises,
      vocabulary: Array.from(allVocab.values()).filter(v => 
        wordsToReview.some(w => w.word_id.toLowerCase() === v.frysian.toLowerCase())
      ),
    });
  } catch (error) {
    console.error("Error fetching practice data:", error);
    return NextResponse.json(
      { error: "Fout bij ophalen oefendata" },
      { status: 500 }
    );
  }
}

// Update word progress after practice
export async function POST(request: Request) {
  try {
    const { wordResults } = await request.json();
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Niet ingelogd" }, { status: 401 });
    }

    // Update each word's progress
    for (const result of wordResults) {
      const { wordId, correct } = result;

      const { data: existingProgress } = await supabase
        .from("word_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("word_id", wordId)
        .single();

      if (existingProgress) {
        const currentStrength = (existingProgress as any).strength || 1;
        const newStrength = correct 
          ? Math.min(5, currentStrength + 1)
          : Math.max(1, currentStrength - 1);

        // @ts-ignore - Supabase types not fully configured
        await supabase
          .from("word_progress")
          // @ts-ignore
          .update({
            strength: newStrength,
            correct_count: ((existingProgress as any).correct_count || 0) + (correct ? 1 : 0),
            incorrect_count: ((existingProgress as any).incorrect_count || 0) + (correct ? 0 : 1),
            last_practiced: new Date().toISOString(),
          })
          .eq("id", (existingProgress as any).id);
      } else {
        await supabase
          .from("word_progress")
          .insert({
            user_id: user.id,
            word_id: wordId,
            strength: correct ? 2 : 1,
            correct_count: correct ? 1 : 0,
            incorrect_count: correct ? 0 : 1,
            last_practiced: new Date().toISOString(),
          } as any);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating practice progress:", error);
    return NextResponse.json(
      { error: "Fout bij opslaan voortgang" },
      { status: 500 }
    );
  }
}

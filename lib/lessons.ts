import { createClient } from "@/lib/supabase/server";
import type { Skill, Lesson, Exercise, Vocabulary, IntroCard } from "@/types/content";

export interface DbSkill {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  icon: string;
  order: number;
  difficulty: number;
  prerequisites: string[];
  color: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbLesson {
  id: string;
  skill_id: string;
  lesson_number: number;
  title: string;
  description: string | null;
  topic: string | null;
  difficulty: number;
  estimated_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbVocabulary {
  id: string;
  frysian: string;
  dutch: string;
  part_of_speech: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  audio_url: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbIntroCard {
  id: string;
  lesson_id: string;
  vocabulary_id: string;
  order: number;
  example_sentence: string | null;
  example_translation: string | null;
  created_at: string;
  vocabulary?: DbVocabulary;
}

export interface DbExercise {
  id: string;
  lesson_id: string;
  type: string;
  order: number;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Convert DB skill to app Skill format
export function dbSkillToSkill(dbSkill: DbSkill, lessons: { id: string; title: string; description: string; topic: string }[]): Skill {
  return {
    id: dbSkill.id,
    title: dbSkill.title,
    description: dbSkill.description,
    longDescription: dbSkill.long_description || undefined,
    icon: dbSkill.icon,
    order: dbSkill.order,
    difficulty: dbSkill.difficulty,
    lessons: lessons,
    prerequisites: dbSkill.prerequisites,
    color: dbSkill.color,
  };
}

// Convert DB vocabulary to app Vocabulary format
export function dbVocabToVocab(dbVocab: DbVocabulary): Vocabulary {
  return {
    id: dbVocab.id,
    frysian: dbVocab.frysian,
    dutch: dbVocab.dutch,
    partOfSpeech: dbVocab.part_of_speech || undefined,
    exampleSentence: dbVocab.example_sentence || undefined,
    exampleTranslation: dbVocab.example_translation || undefined,
    audioUrl: dbVocab.audio_url || undefined,
    imageUrl: dbVocab.image_url || undefined,
  };
}

// Convert DB intro card to app IntroCard format
export function dbIntroCardToIntroCard(dbIntroCard: DbIntroCard): IntroCard {
  return {
    id: dbIntroCard.id,
    vocabulary: dbIntroCard.vocabulary ? dbVocabToVocab(dbIntroCard.vocabulary) : {} as Vocabulary,
    exampleSentence: dbIntroCard.example_sentence || undefined,
  };
}

// Convert DB exercise to app Exercise format
export function dbExerciseToExercise(dbExercise: DbExercise): Exercise {
  const base = {
    id: dbExercise.id,
    type: dbExercise.type as Exercise['type'],
    ...dbExercise.data,
  };
  return base as Exercise;
}

// Convert DB lesson with relations to full Lesson
export function dbLessonToLesson(
  dbLesson: DbLesson,
  introCards: DbIntroCard[],
  exercises: DbExercise[]
): Lesson {
  return {
    id: dbLesson.id,
    skillId: dbLesson.skill_id,
    lessonNumber: dbLesson.lesson_number,
    title: dbLesson.title,
    description: dbLesson.description || undefined,
    topic: dbLesson.topic || undefined,
    introCards: introCards.map(dbIntroCardToIntroCard),
    exercises: exercises.map(dbExerciseToExercise),
    targetVocabulary: introCards.map(ic => ic.vocabulary_id),
    reviewVocabulary: [],
  };
}

// Get all published skills with their lessons
export async function getPublishedSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  
  const { data: skills, error: skillsError } = await supabase
    .from('skills')
    .select('*')
    .eq('is_published', true)
    .order('order');
  
  if (skillsError || !skills) {
    console.error('Error fetching skills:', skillsError);
    return [];
  }
  
  const result: Skill[] = [];
  
  for (const skill of skills) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, description, topic')
      .eq('skill_id', skill.id)
      .eq('is_published', true)
      .order('lesson_number');
    
    result.push(dbSkillToSkill(skill, lessons?.map(l => ({
      id: l.id,
      title: l.title,
      description: l.description || '',
      topic: l.topic || '',
    })) || []));
  }
  
  return result;
}

// Get a single lesson with all its content
export async function getLesson(lessonId: string): Promise<Lesson | null> {
  const supabase = await createClient();
  
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  
  if (lessonError || !lesson) {
    return null;
  }
  
  // Get intro cards with vocabulary
  const { data: introCards } = await supabase
    .from('intro_cards')
    .select(`
      *,
      vocabulary:vocabulary_id (*)
    `)
    .eq('lesson_id', lessonId)
    .order('order');
  
  // Get exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order');
  
  return dbLessonToLesson(
    lesson,
    (introCards || []) as unknown as DbIntroCard[],
    exercises || []
  );
}

// Check if lessons exist in database
export async function hasDbLessons(): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('lessons')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);
  
  return (count || 0) > 0;
}

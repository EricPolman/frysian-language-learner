// Content types for lessons, vocabulary, and exercises

export type ExerciseType = "translation" | "fill-in-blank" | "multiple-choice" | "sentence-build";

export interface Vocabulary {
  id: string;
  frysian: string;
  dutch: string;
  audioUrl?: string;
  imageUrl?: string;
  partOfSpeech?: string;
  exampleSentence?: string;
  exampleTranslation?: string; // Dutch translation of the example sentence
}

export interface TranslationExercise {
  type: "translation";
  id: string;
  question: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  hint?: string;
  explanation?: string;
  direction: "frysian-to-dutch" | "dutch-to-frysian";
}

export interface FillInBlankExercise {
  type: "fill-in-blank";
  id: string;
  sentence: string;
  blankIndex: number;
  correctAnswer: string;
  acceptedAnswers: string[];
  wordBank?: string[];
  hint?: string;
  explanation?: string;
}

export interface MultipleChoiceExercise {
  type: "multiple-choice";
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  hint?: string;
  explanation?: string;
  direction: "frysian-to-dutch" | "dutch-to-frysian";
}

export interface SentenceBuildExercise {
  type: "sentence-build";
  id: string;
  prompt: string;
  correctOrder: string[];
  distractorWords: string[];
  hint?: string;
  explanation?: string;
}

export type Exercise =
  | TranslationExercise
  | FillInBlankExercise
  | MultipleChoiceExercise
  | SentenceBuildExercise;

export interface IntroCard {
  id: string;
  vocabulary: Vocabulary;
  exampleSentence?: string;
}

export interface Lesson {
  id: string;
  skillId: string;
  lessonNumber: number;
  title: string;
  description?: string;
  topic?: string;
  introCards: IntroCard[];
  exercises: Exercise[];
  targetVocabulary: string[]; // IDs of vocabulary items
  reviewVocabulary: string[]; // IDs of vocabulary to review
}

export interface LessonInfo {
  id: string;
  title: string;
  description: string;
  topic: string;
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon?: string;
  order: number;
  lessons: LessonInfo[] | string[]; // Lesson info objects or IDs for backward compatibility
  prerequisites: string[]; // Skill IDs that must be completed first
  color?: string;
}

export interface SkillTree {
  skills: Skill[];
  totalLessons: number;
}

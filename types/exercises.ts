// Exercise state and interaction types

import type { Exercise } from "./content";

export interface ExerciseAttempt {
  exerciseId: string;
  attemptNumber: 1 | 2;
  userAnswer: string | string[];
  isCorrect: boolean;
  timestamp: Date;
}

export interface ExerciseResult {
  exercise: Exercise;
  attempts: ExerciseAttempt[];
  finallyCorrect: boolean;
  xpEarned: number;
  completed: boolean;
}

export interface LessonState {
  lessonId: string;
  currentExerciseIndex: number;
  exerciseResults: ExerciseResult[];
  totalXP: number;
  startedAt: Date;
  completedAt?: Date;
  isPerfect: boolean; // All correct on first try
}

export interface AnswerValidationResult {
  isCorrect: boolean;
  normalizedAnswer: string;
  feedback?: string;
  explanation?: string;
}

export type ExerciseStatus = "not-started" | "in-progress" | "completed";

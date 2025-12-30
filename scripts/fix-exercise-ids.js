#!/usr/bin/env node

/**
 * This script fixes exercise IDs in all lesson JSON files
 * by prefixing them with the lesson ID to make them globally unique.
 * 
 * Example: "trans-1" in animals-3.json becomes "animals-3-trans-1"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lessonsDir = path.join(__dirname, '../data/lessons');

// Get all JSON files in the lessons directory
const lessonFiles = fs.readdirSync(lessonsDir).filter(f => f.endsWith('.json'));

let totalExercisesFixed = 0;
let totalVocabularyFixed = 0;

lessonFiles.forEach(file => {
  const filePath = path.join(lessonsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const lesson = JSON.parse(content);
  
  const lessonId = lesson.id;
  let modified = false;
  
  // Fix exercise IDs
  if (lesson.exercises && Array.isArray(lesson.exercises)) {
    lesson.exercises.forEach(exercise => {
      // Only fix if ID doesn't already start with the lesson ID
      if (exercise.id && !exercise.id.startsWith(lessonId + '-')) {
        const oldId = exercise.id;
        exercise.id = `${lessonId}-${exercise.id}`;
        console.log(`  Exercise: ${oldId} -> ${exercise.id}`);
        totalExercisesFixed++;
        modified = true;
      }
    });
  }
  
  // Fix vocabulary IDs in introCards to be more unique
  if (lesson.introCards && Array.isArray(lesson.introCards)) {
    lesson.introCards.forEach(card => {
      // Fix intro card IDs if needed (already has lesson id prefix, but check)
      if (card.id && !card.id.startsWith(`intro-${lessonId}`)) {
        const oldId = card.id;
        card.id = `intro-${lessonId}-${card.id.replace('intro-', '')}`;
        console.log(`  IntroCard: ${oldId} -> ${card.id}`);
        modified = true;
      }
      
      // Fix vocabulary IDs - prefix with lesson ID
      if (card.vocabulary && card.vocabulary.id) {
        const oldVocabId = card.vocabulary.id;
        // Only fix if not already prefixed
        if (!card.vocabulary.id.startsWith(lessonId + '-')) {
          card.vocabulary.id = `${lessonId}-${card.vocabulary.id}`;
          console.log(`  Vocabulary: ${oldVocabId} -> ${card.vocabulary.id}`);
          totalVocabularyFixed++;
          modified = true;
        }
      }
    });
  }
  
  if (modified) {
    console.log(`Fixed: ${file}`);
    fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2) + '\n', 'utf8');
  }
});

console.log(`\nDone! Fixed ${totalExercisesFixed} exercise IDs and ${totalVocabularyFixed} vocabulary IDs.`);

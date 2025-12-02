#!/usr/bin/env node

/**
 * Content Generation Script
 * Generates Frysian-Dutch lesson content using OpenAI API
 * 
 * Usage: node scripts/generate-content.js <skill-id> <lesson-number>
 * Example: node scripts/generate-content.js basics-1 1
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Skill definitions from the spec
const SKILLS = {
  'basics-1': {
    title: 'Basics 1',
    description: 'Essential phrases and greetings',
    topics: ['greetings', 'yes/no', 'thank you', 'please', 'basic courtesy'],
    difficulty: 1,
  },
  'basics-2': {
    title: 'Basics 2',
    description: 'Personal pronouns, to be, to have',
    topics: ['I am', 'you are', 'he/she is', 'basic sentence structure'],
    difficulty: 2,
  },
  'numbers': {
    title: 'Numbers',
    description: 'Counting and basic math',
    topics: ['1-10', '11-20', '21-100', 'ordinal numbers'],
    difficulty: 1,
  },
  'family': {
    title: 'Family',
    description: 'Family members and relationships',
    topics: ['parents', 'siblings', 'extended family', 'my family'],
    difficulty: 2,
  },
  'colors': {
    title: 'Colors & Shapes',
    description: 'Descriptive vocabulary',
    topics: ['common colors', 'basic shapes', 'describing objects'],
    difficulty: 1,
  },
  'food': {
    title: 'Food & Drink',
    description: 'Everyday vocabulary',
    topics: ['meals', 'fruits/vegetables', 'drinks', 'at the restaurant'],
    difficulty: 2,
  },
  'animals': {
    title: 'Animals',
    description: 'Common animals and pets',
    topics: ['pets', 'farm animals', 'wild animals'],
    difficulty: 1,
  },
};

async function generateVocabulary(skill, lessonNumber) {
  const skillInfo = SKILLS[skill];
  
  const prompt = `You are a Frysian (West Frisian) language expert. Generate 5 vocabulary items for a lesson about "${skillInfo.topics[lessonNumber - 1] || skillInfo.topics[0]}".

Requirements:
- Provide accurate Frysian words with Dutch translations
- Include English translations for reference
- Add example sentences in Frysian
- Mark part of speech (noun, verb, adjective, etc.)

Return a JSON array of vocabulary items with this structure under the key "vocabularyItems":
[
  {
    "id": "unique-id",
    "frysian": "word in Frysian",
    "dutch": "Dutch translation",
    "english": "English translation",
    "partOfSpeech": "noun|verb|adjective|etc",
    "exampleSentence": "Example sentence in Frysian"
  }
]

Make sure the Frysian is accurate and appropriate for beginners learning from Dutch.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.vocabulary || parsed;
}

async function generateExercises(vocabulary, skill, lessonNumber) {
  const skillInfo = SKILLS[skill];
  
  const prompt = `You are creating exercises for a Frysian language learning app. Generate 10 exercises (mix of types) using ONLY this vocabulary that the student has just learned:

${JSON.stringify(vocabulary, null, 2)}

IMPORTANT: 
- For sentence-build exercises, the distractorWords MUST ONLY come from the vocabulary list above
- Do NOT use any words that are not in the vocabulary list provided
- Use variations (different cases, similar words) from the vocabulary list only

Create exercises of these types:
1. Translation (Dutch → Frysian): 3 exercises
2. Fill-in-the-blank: 3 exercises
3. Multiple choice: 2 exercises
4. Sentence building: 2 exercises

Return a JSON array with this structure:
[
  {
    "type": "translation",
    "id": "unique-id",
    "question": "Dutch sentence",
    "correctAnswer": "Frysian translation",
    "acceptedAnswers": ["alternative1", "alternative2"],
    "hint": "helpful hint",
    "explanation": "grammar explanation",
    "direction": "dutch-to-frysian"
  },
  {
    "type": "fill-in-blank",
    "id": "unique-id",
    "sentence": "Ik ha in ___",
    "blankIndex": 3,
    "correctAnswer": "hûs",
    "acceptedAnswers": ["hûs", "Hûs"],
    "wordBank": ["hûs", "kat", "auto", "boek"],
    "hint": "word for house",
    "explanation": "hûs means house"
  },
  {
    "type": "multiple-choice",
    "id": "unique-id",
    "question": "Hallo",
    "correctAnswer": "Goeie",
    "options": ["Goeie", "Oant sjen", "Dankewol", "Graach dien"],
    "hint": "Common greeting",
    "explanation": "Goeie means hello in Frysian",
    "direction": "dutch-to-frysian"
  },
  {
    "type": "sentence-build",
    "id": "unique-id",
    "prompt": "Say 'I have a house' in Frysian",
    "correctOrder": ["Ik", "ha", "in", "hûs"],
    "distractorWords": ["bin", "ien", "de"],
    "hint": "word order hint"
  }
]

Make exercises progressively more challenging. Use simple sentences for beginners.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  return parsed.exercises || parsed;
}

async function generateLesson(skill, lessonNumber) {
  console.log(`\n🎯 Generating lesson ${lessonNumber} for skill: ${skill}`);
  
  const skillInfo = SKILLS[skill];
  if (!skillInfo) {
    throw new Error(`Unknown skill: ${skill}`);
  }

  // Generate vocabulary
  console.log('📚 Generating vocabulary...');
  const vocabularyResponse = await generateVocabulary(skill, lessonNumber);
  const vocabulary = vocabularyResponse.vocabularyItems || vocabularyResponse;
  console.log(`✅ Generated ${vocabulary.length} vocabulary items`);

  // Generate exercises
  console.log('✏️ Generating exercises...');
  const exercises = await generateExercises(vocabulary, skill, lessonNumber);
  console.log(`✅ Generated ${exercises.length} exercises`);

  // Create intro cards
  const introCards = vocabulary.map((word, index) => ({
    id: `intro-${skill}-${lessonNumber}-${index}`,
    vocabulary: word,
    exampleSentence: word.exampleSentence,
  }));

  // Build lesson object
  const lesson = {
    id: `${skill}-${lessonNumber}`,
    skillId: skill,
    lessonNumber,
    title: `${skillInfo.title} - Lesson ${lessonNumber}`,
    description: `Learn about ${skillInfo.topics[lessonNumber - 1] || skillInfo.topics[0]}`,
    introCards,
    exercises,
    targetVocabulary: vocabulary.map(v => v.id),
    reviewVocabulary: [],
  };

  return lesson;
}

async function saveLesson(lesson) {
  const lessonsDir = path.join(__dirname, '../data/lessons');
  
  // Ensure directory exists
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const filePath = path.join(lessonsDir, `${lesson.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2));
  
  console.log(`\n💾 Saved lesson to: ${filePath}`);
}

async function generateSkillTree() {
  const skillTree = {
    skills: Object.entries(SKILLS).map(([id, info], index) => ({
      id,
      title: info.title,
      description: info.description,
      icon: '📚',
      order: index,
      lessons: Array.from({ length: 4 }, (_, i) => `${id}-${i + 1}`),
      prerequisites: index > 0 ? [Object.keys(SKILLS)[index - 1]] : [],
      color: '#3b82f6',
    })),
    totalLessons: Object.keys(SKILLS).length * 4,
  };

  const filePath = path.join(__dirname, '../data/skills.json');
  fs.writeFileSync(filePath, JSON.stringify(skillTree, null, 2));
  
  console.log(`\n🌳 Saved skill tree to: ${filePath}`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === '--init') {
    console.log('🚀 Initializing skill tree...');
    await generateSkillTree();
    console.log('✅ Skill tree initialized!');
    return;
  }

  if (args.length < 2) {
    console.log('Usage: node scripts/generate-content.js <skill-id> <lesson-number>');
    console.log('       node scripts/generate-content.js --init (to create skill tree)');
    console.log('\nAvailable skills:', Object.keys(SKILLS).join(', '));
    process.exit(1);
  }

  const [skill, lessonNumber] = args;
  
  try {
    const lesson = await generateLesson(skill, parseInt(lessonNumber));
    await saveLesson(lesson);
    console.log('\n✨ Lesson generation complete!');
  } catch (error) {
    console.error('❌ Error generating lesson:', error.message);
    process.exit(1);
  }
}

main();

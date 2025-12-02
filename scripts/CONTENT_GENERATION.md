# Content Generation Guide

This guide explains how to generate lesson content for the Frysian Learning App.

## Prerequisites

1. Get an OpenAI API key from https://platform.openai.com/
2. Add it to your `.env.local` file:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Quick Start

### 1. Initialize the Skill Tree

First, generate the skill tree structure:

```bash
npm run generate:init
```

This creates `data/skills.json` with all the skills and their structure.

### 2. Generate Lessons

Generate individual lessons using:

```bash
npm run generate:lesson <skill-id> <lesson-number>
```

**Examples:**

```bash
# Generate Basics 1, Lesson 1
npm run generate:lesson basics-1 1

# Generate Numbers, Lesson 2
npm run generate:lesson numbers 2

# Generate Food, Lesson 3
npm run generate:lesson food 3
```

### 3. Generate Multiple Lessons

To quickly generate the first lesson for each skill:

```bash
npm run generate:lesson basics-1 1
npm run generate:lesson basics-2 1
npm run generate:lesson numbers 1
npm run generate:lesson family 1
npm run generate:lesson colors 1
npm run generate:lesson food 1
npm run generate:lesson animals 1
```

## Available Skills

- `basics-1` - Essential phrases and greetings
- `basics-2` - Personal pronouns, to be, to have
- `numbers` - Counting and basic math
- `family` - Family members and relationships
- `colors` - Colors and shapes
- `food` - Food and drink vocabulary
- `animals` - Common animals and pets

Each skill typically has 4 lessons.

## Generated Content Structure

Each lesson includes:

### Vocabulary (5 items)
- Frysian word
- Dutch translation
- English translation
- Part of speech
- Example sentence

### Exercises (10 total)
- **Translation** (3): Dutch → Frysian translation exercises
- **Fill-in-the-Blank** (3): Complete sentences with word bank
- **Picture Matching** (2): Match words to images
- **Sentence Building** (2): Arrange words to form sentences

## Output Files

Lessons are saved to:
```
data/lessons/<skill-id>-<lesson-number>.json
```

Example: `data/lessons/basics-1-1.json`

## Tips

1. **Review Generated Content**: Always review AI-generated content for accuracy
2. **Edit as Needed**: You can manually edit the JSON files
3. **Incremental Generation**: Generate a few lessons, test them, then generate more
4. **Cost Awareness**: Each lesson generation costs ~$0.01-0.02 in OpenAI credits

## Troubleshooting

### "OPENAI_API_KEY is not set"
- Make sure you have `.env.local` file with your API key
- Check that the key starts with `sk-`

### "Unknown skill: xyz"
- Check the list of available skills above
- Skills are case-sensitive, use lowercase

### "Failed to generate"
- Check your internet connection
- Verify your OpenAI API key is valid and has credits
- Try again, sometimes the API has temporary issues

## Next Steps

After generating lessons:

1. **Review Content** - Check vocabulary and exercises for accuracy
2. **Add Images** - Add images to `public/images/vocabulary/` for picture matching
3. **Test in App** - Run `npm run dev` and test the lessons
4. **Iterate** - Regenerate or manually edit as needed

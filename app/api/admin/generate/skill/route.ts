import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return profile?.is_admin === true;
}

// POST /api/admin/generate/skill - Generate a complete skill with lessons
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    theme, // e.g., "Animals", "Food", "Travel"
    lessonCount = 4,
    difficulty = 1,
    vocabularyPerLesson = 5,
    exercisesPerLesson = 8,
  } = body;

  if (!theme) {
    return NextResponse.json({ error: "Theme is required" }, { status: 400 });
  }

  try {
    const systemPrompt = `Je bent een expert in het Fries (Frysk) en ontwerpt complete taalcursussen. Je genereert gestructureerde vaardigheidsmodules met meerdere lessen.

Belangrijke regels:
- Alle Friese woorden moeten correct gespeld zijn
- Lessen bouwen logisch op elkaar voort
- Begin met de meest essentiële woorden, dan meer specifieke
- Elke les heeft een duidelijk subthema
- Moeilijkheidsniveau: ${difficulty} (1=beginner, 5=gevorderd)`;

    const userPrompt = `Ontwerp een complete vaardigheid over het thema "${theme}" met ${lessonCount} lessen.

Genereer een JSON object met:
1. Skill metadata (titel, beschrijving, icoon emoji)
2. ${lessonCount} lessen, elk met:
   - Subthema dat past bij het hoofdthema
   - ${vocabularyPerLesson} vocabulaire items
   - ${exercisesPerLesson} gevarieerde oefeningen

JSON structuur:
{
  "skill": {
    "id": "${theme.toLowerCase().replace(/\s+/g, "-")}",
    "title": "Nederlandse titel",
    "description": "Korte beschrijving",
    "longDescription": "Uitgebreide beschrijving van wat je leert",
    "icon": "🎯",
    "color": "#hexcolor"
  },
  "lessons": [
    {
      "lessonNumber": 1,
      "title": "Lestitel",
      "description": "Wat je leert in deze les",
      "topic": "Specifiek subthema",
      "vocabulary": [
        {
          "frysian": "...",
          "dutch": "...",
          "partOfSpeech": "noun|verb|adjective|adverb|phrase",
          "exampleSentence": "Friese voorbeeldzin",
          "exampleTranslation": "Nederlandse vertaling"
        }
      ],
      "exercises": [
        {
          "type": "translation|multiple-choice|fill-in-blank|sentence-build",
          ...exercise specific fields
        }
      ]
    }
  ]
}

Exercise types en hun velden:
- translation: question, correctAnswer, acceptedAnswers[], direction (dutch-to-frysian/frysian-to-dutch), hint?, explanation?
- multiple-choice: question, correctAnswer, options[], direction
- fill-in-blank: sentence, blankIndex, correctAnswer, acceptedAnswers[], wordBank[]
- sentence-build: prompt, correctOrder[], distractorWords[]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      return NextResponse.json(
        { error: "No content generated" },
        { status: 500 }
      );
    }

    const generatedContent = JSON.parse(content);

    return NextResponse.json({
      success: true,
      content: generatedContent,
      usage: completion.usage,
    });
  } catch (error) {
    console.error("Error generating skill:", error);
    return NextResponse.json(
      { error: "Failed to generate skill" },
      { status: 500 }
    );
  }
}

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

// POST /api/admin/generate/lesson - Generate lesson content with AI
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    topic,
    skillTitle,
    lessonNumber,
    difficulty = 1,
    vocabularyCount = 5,
    exerciseCount = 8,
    targetLanguage = "dutch", // "dutch" or "english"
  } = body;

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  try {
    const systemPrompt = `Je bent een expert in het Fries (Frysk) en helpt bij het maken van taalcursussen. Je genereert lesinhoud voor een Friestalige app.

Belangrijke regels:
- Alle Friese woorden moeten correct gespeld zijn
- Gebruik eenvoudige, veelvoorkomende woorden voor beginnerslessen (moeilijkheid 1-2)
- Gebruik meer geavanceerde woorden voor hogere moeilijkheidsniveaus (3-5)
- Voorbeeldzinnen moeten grammaticaal correct zijn
- Geef altijd de Nederlandse vertaling

Moeilijkheidsniveau: ${difficulty} (1=beginner, 5=gevorderd)

Genereer lesinhoud in het volgende JSON-formaat:`;

    const userPrompt = `Genereer een complete les over "${topic}" voor ${skillTitle || "Fries leren"}, les ${lessonNumber || 1}.

Maak:
1. ${vocabularyCount} Friese woorden met:
   - frysian: het Friese woord
   - dutch: Nederlandse vertaling
   - partOfSpeech: woordsoort (noun, verb, adjective, adverb, phrase, etc.)
   - exampleSentence: voorbeeldzin in het Fries
   - exampleTranslation: vertaling van de voorbeeldzin

2. ${exerciseCount} oefeningen verdeeld over deze types:
   - translation: vertaaloefeningen (Nederlands naar Fries of andersom)
   - multiple-choice: meerkeuzevragen
   - fill-in-blank: invuloefeningen
   - sentence-build: zinsbouwoefeningen

Geef het antwoord als een JSON object met deze structuur:
{
  "title": "Lestitel",
  "description": "Korte beschrijving van wat de leerling leert",
  "vocabulary": [
    {
      "frysian": "...",
      "dutch": "...",
      "partOfSpeech": "...",
      "exampleSentence": "...",
      "exampleTranslation": "..."
    }
  ],
  "exercises": [
    {
      "type": "translation",
      "question": "...",
      "correctAnswer": "...",
      "acceptedAnswers": ["...", "..."],
      "direction": "dutch-to-frysian",
      "hint": "...",
      "explanation": "..."
    },
    {
      "type": "multiple-choice",
      "question": "...",
      "correctAnswer": "...",
      "options": ["...", "...", "...", "..."],
      "direction": "dutch-to-frysian"
    },
    {
      "type": "fill-in-blank",
      "sentence": "Ik ___ nei de winkel.",
      "blankIndex": 1,
      "correctAnswer": "gean",
      "acceptedAnswers": ["gean"],
      "wordBank": ["gean", "rin", "fytse"]
    },
    {
      "type": "sentence-build",
      "prompt": "Vertaal: Ik ga naar huis",
      "correctOrder": ["Ik", "gean", "nei", "hûs"],
      "distractorWords": ["de", "in"]
    }
  ]
}`;

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
    console.error("Error generating lesson content:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

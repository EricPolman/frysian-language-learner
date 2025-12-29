import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    // Get user's level for personalized coaching
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, total_xp")
      .eq("id", user.id)
      .single();

    const userLevel = profile?.level || 1;

    // Build system prompt for Frysian language coach
    const systemPrompt = `You are a friendly and supportive Frysian (West Frisian / Frysk) language coach. Your role is to help learners practice Frysian through natural conversation while providing gentle corrections and encouragement.

Guidelines:
- Respond primarily in Frysian, but use Dutch when explaining complex grammar or corrections
- The user is currently at level ${userLevel}
- Keep your responses conversational and encouraging
- When the user makes a mistake, gently correct it and explain why
- Occasionally ask simple questions to keep the conversation flowing
- Use simple vocabulary and sentence structures for beginners (levels 1-3)
- Gradually increase complexity for intermediate learners (levels 4-6)
- Provide cultural context and interesting facts about Frisian culture when relevant
- If the user seems stuck, offer helpful prompts or vocabulary suggestions
- Always maintain a positive, patient tone
- Correct mistakes in grammar and vocabulary

Remember: The goal is to make learning Frysian fun and engaging through authentic conversation practice!`;

    // Build messages array for OpenAI
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...(conversationHistory || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message },
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, ik koe net reagearje. Besykje it opnij.";

    // Save conversation to database
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      user_message: message,
      ai_response: aiResponse,
    });

    return NextResponse.json({
      response: aiResponse,
      success: true,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ messages: messages || [] });

  } catch (error) {
    console.error("Get chat history error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check for admin authorization - only eric@ericpolman.com can generate
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.email !== 'eric@ericpolman.com') {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 403 });
    }

    const { topic, level, newsUrl } = await request.json();

    // Validate level
    if (!['beginner', 'intermediate', 'advanced'].includes(level)) {
      return NextResponse.json({ error: "Invalid level" }, { status: 400 });
    }

    // Build the prompt for generating blog content
    const systemPrompt = `Jo binne in ekspert yn it meitsjen fan boeiende ynhâld foar Frysk learlingen. Jo taak is it skriuwen fan deilikse blogberjochten yn it Frysk dy't learlingen helpe harren wurdskatkennisse en kulturele kennis te ferbetterjen.

Maak blogberjochten dy't:
- Folslein yn it Frysk skreaun binne
- Kultueel relevant binne foar Fryslân en Nederlân
- Ynteressante wurdskat markearje mei útlis yn it Nederlânsk en Ingelsk
- Passend binne foar it spesifisearre momintnivo
- Boeiend en ynformativ binne

Format jo antwurd as in jildich JSON-objekt mei dizze eksakte struktuer:
{
  "title": "Fryske titel",
  "title_fy": "Fryske titel (selde as title)",
  "content": "Folsleine blogpost ynhâld yn it Frysk, ferskate alinea's",
  "summary": "Koarte gearfetting yn it Frysk",
  "level": "beginner/intermediate/advanced",
  "vocabulary": [
    {
      "word_fy": "Frysk wurd",
      "word_nl": "Nederlânske oersetting",
      "word_en": "Ingelske oersetting",
      "explanation": "Koarte útlis oer gebrûk of kontekst (yn it Nederlânsk)"
    }
  ],
  "source_url": "URL as basearre op nijs (opsjoneel)",
  "source_name": "Boarnenamme (opsjoneel)"
}

Rjochtlinen per nivo:
- Beginner: 5-8 wurdskatwurden, ienfâldige konsepten, koarte alinea's,basale Fryske sinnen
- Intermediate: 8-12 wurdskatwurden, kompleksere ûnderwerpen, kulturele djipte, natuerlike Fryske taal
- Advanced: 12-15 wurdskatwurden, sophistisearre ûnderwerpen, idiomatyske útdrukkingen, avansearre grammatika`;

    let userPrompt = `Create a ${level} level blog post about: ${topic}`;
    
    if (newsUrl) {
      userPrompt += `\n\nThis should be based on or inspired by news from: ${newsUrl}`;
    }

    userPrompt += `\n\nMake it engaging and educational for Frisian language learners. Focus on practical vocabulary and cultural insights.`;

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    const blogData = JSON.parse(aiResponse);

    // Validate the response structure
    if (!blogData.title || !blogData.content || !blogData.vocabulary) {
      throw new Error("Invalid response structure from AI");
    }

    // Insert the blog post into the database
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: blogData.title,
        title_fy: blogData.title_fy || blogData.title,
        content: blogData.content,
        summary: blogData.summary,
        level: level,
        vocabulary: blogData.vocabulary,
        source_url: newsUrl || blogData.source_url || null,
        source_name: blogData.source_name || null,
        published_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting blog post:', insertError);
      return NextResponse.json(
        { error: 'Failed to save blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: newPost
    });

  } catch (error) {
    console.error("Blog generation API error:", error);
    return NextResponse.json(
      { error: "Failed to generate blog post" },
      { status: 500 }
    );
  }
}

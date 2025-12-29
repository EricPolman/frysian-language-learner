import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// List of diverse topics for daily blog generation (in Frisian)
const DAILY_TOPICS = [
  'Tradisjonele Fryske keuken en streekrjochten',
  'De skiednis fan it skeatsenriden yn Fryslân',
  'Fermeare Fryske skriuwers en dichters',
  'Fryske folklore en leginden',
  'Modern libjen yn Fryske stêden',
  'Fryske natoer en natoerreservaten',
  'Tradisjonele Fryske sporten lykas fierljeppen',
  'Fryske muzyk en folksliedjes',
  'De Fryske taal en har dialekten',
  'Fryske arsjitektuer en tradisjonele huzen',
  'Seizoensfestivals yn Fryslân',
  'Fryske maritime skiednis',
  'Fermeare Fryske histoaryske figuren',
  'Fryske keunst en hânwurk',
  'Deistich libjen fan Fryske boeren',
  'De Waadsee en har belang',
  'Tradisjonele Fryske klean',
  'Moderne Fryske bedriuwen en ynnovaasje',
  'Frysk ûnderwiis en taalbeheining',
  'Fryske spreukwurden en siswizen',
];

// Rotate difficulty levels
const DIFFICULTY_ROTATION = ['beginner', 'intermediate', 'advanced'] as const;

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Check if we already have a post for today
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('published_date', today)
      .single();

    if (existingPost) {
      return NextResponse.json({
        message: 'Blog post already exists for today',
        postId: existingPost.id,
      });
    }

    // Select a topic based on day of year (ensures variety)
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        1000 /
        60 /
        60 /
        24
    );
    const topicIndex = dayOfYear % DAILY_TOPICS.length;
    const topic = DAILY_TOPICS[topicIndex];

    // Rotate difficulty level (beginner on Mon/Thu, intermediate on Tue/Fri, advanced on Wed/Sat/Sun)
    const dayOfWeek = new Date().getDay();
    let level: 'beginner' | 'intermediate' | 'advanced';
    if ([1, 4].includes(dayOfWeek)) {
      level = 'beginner';
    } else if ([2, 5].includes(dayOfWeek)) {
      level = 'intermediate';
    } else {
      level = 'advanced';
    }

    // Generate the blog post
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
  "source_name": "Frysk Leare Deistich"
}

Rjochtlinen per nivo:
- Beginner: 5-8 wurdskatwurden, ienfâldige konsepten, koarte alinea's, basale Fryske sinnen
- Intermediate: 8-12 wurdskatwurden, kompleksere ûnderwerpen, kulturele djipte, natuerlike Fryske taal
- Advanced: 12-15 wurdskatwurden, sophistisearre ûnderwerpen, idiomatyske útdrukkingen, avansearre grammatika`;

    const userPrompt = `Skriuw in ${level} nivo blogberjocht oer: ${topic}

Meitsje it boeiend en edukatyf foar Fryske taal learders. Fokus op praktyske wurdskat en kulturele ynsjoggen. Foegje ynteressante feiten ta en meitsje it aktueel en relevant.`;

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const blogData = JSON.parse(aiResponse);

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
        source_name: blogData.source_name || 'Frysk Leare Deistich',
        published_date: today,
      })
      .select('*')
      .single();

    if (insertError) {
      console.error('Error inserting blog post:', insertError);
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        title: newPost.title,
        level: newPost.level,
        topic: topic,
      },
      message: `Daily blog post generated successfully for ${today}`,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate daily blog post',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

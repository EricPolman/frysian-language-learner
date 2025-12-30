import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Check if user is admin
async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();
  
  return profile?.is_admin === true;
}

interface RouteParams {
  params: Promise<{ lessonId: string }>;
}

// POST /api/admin/lessons/[lessonId]/intro-cards - Add intro cards to a lesson
export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  // Handle single intro card or array
  const introCards = Array.isArray(body) ? body : [body];
  
  // Get current max order
  const { data: existing } = await supabase
    .from('intro_cards')
    .select('order')
    .eq('lesson_id', lessonId)
    .order('order', { ascending: false })
    .limit(1);
  
  let currentOrder = existing?.[0]?.order ?? -1;
  
  const results = [];
  
  for (const card of introCards) {
    currentOrder++;
    
    // First, ensure vocabulary exists
    const vocabData = {
      id: card.vocabulary.id || `vocab-${Date.now()}-${currentOrder}`,
      frysian: card.vocabulary.frysian,
      dutch: card.vocabulary.dutch,
      part_of_speech: card.vocabulary.partOfSpeech || null,
      example_sentence: card.vocabulary.exampleSentence || null,
      example_translation: card.vocabulary.exampleTranslation || null,
      audio_url: card.vocabulary.audioUrl || null,
      image_url: card.vocabulary.imageUrl || null,
    };
    
    // Upsert vocabulary
    const { data: vocab, error: vocabError } = await supabase
      .from('vocabulary')
      .upsert(vocabData, { onConflict: 'id' })
      .select()
      .single();
    
    if (vocabError) {
      return NextResponse.json({ error: vocabError.message }, { status: 500 });
    }
    
    // Insert intro card
    const { data: introCard, error: cardError } = await supabase
      .from('intro_cards')
      .insert({
        id: card.id || `intro-${lessonId}-${currentOrder}`,
        lesson_id: lessonId,
        vocabulary_id: vocab.id,
        order: card.order ?? currentOrder,
        example_sentence: card.exampleSentence || null,
        example_translation: card.exampleTranslation || null,
      })
      .select(`
        *,
        vocabulary:vocabulary_id (*)
      `)
      .single();
    
    if (cardError) {
      return NextResponse.json({ error: cardError.message }, { status: 500 });
    }
    
    results.push(introCard);
  }

  return NextResponse.json({ introCards: results }, { status: 201 });
}

// PUT /api/admin/lessons/[lessonId]/intro-cards - Update intro cards (bulk)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  const introCards = Array.isArray(body) ? body : [body];
  const results = [];
  
  for (const card of introCards) {
    // Update vocabulary if provided
    if (card.vocabulary) {
      const vocabUpdate: Record<string, any> = {};
      if (card.vocabulary.frysian) vocabUpdate.frysian = card.vocabulary.frysian;
      if (card.vocabulary.dutch) vocabUpdate.dutch = card.vocabulary.dutch;
      if (card.vocabulary.partOfSpeech !== undefined) vocabUpdate.part_of_speech = card.vocabulary.partOfSpeech;
      if (card.vocabulary.exampleSentence !== undefined) vocabUpdate.example_sentence = card.vocabulary.exampleSentence;
      if (card.vocabulary.exampleTranslation !== undefined) vocabUpdate.example_translation = card.vocabulary.exampleTranslation;
      
      if (Object.keys(vocabUpdate).length > 0) {
        await supabase
          .from('vocabulary')
          .update(vocabUpdate)
          .eq('id', card.vocabulary.id);
      }
    }
    
    // Update intro card
    const cardUpdate: Record<string, any> = {};
    if (card.order !== undefined) cardUpdate.order = card.order;
    if (card.exampleSentence !== undefined) cardUpdate.example_sentence = card.exampleSentence;
    if (card.exampleTranslation !== undefined) cardUpdate.example_translation = card.exampleTranslation;
    
    const { data, error } = await supabase
      .from('intro_cards')
      .update(cardUpdate)
      .eq('id', card.id)
      .eq('lesson_id', lessonId)
      .select(`
        *,
        vocabulary:vocabulary_id (*)
      `)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    results.push(data);
  }

  return NextResponse.json({ introCards: results });
}

// DELETE /api/admin/lessons/[lessonId]/intro-cards - Delete intro cards
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('id');
  
  let query = supabase
    .from('intro_cards')
    .delete()
    .eq('lesson_id', lessonId);
  
  if (cardId) {
    query = query.eq('id', cardId);
  }
  
  const { error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

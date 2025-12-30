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

// GET /api/admin/lessons - Get all lessons (including unpublished)
export async function GET(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const skillId = searchParams.get('skillId');
  
  let query = supabase
    .from('lessons')
    .select(`
      *,
      skill:skills(id, title)
    `)
    .order('skill_id')
    .order('lesson_number');
  
  if (skillId) {
    query = query.eq('skill_id', skillId);
  }
  
  const { data: lessons, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lessons });
}

// POST /api/admin/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const body = await request.json();
  
  // Generate lesson ID if not provided
  const lessonId = body.id || `${body.skillId}-${body.lessonNumber}`;
  
  const { data: lesson, error } = await supabase
    .from('lessons')
    .insert({
      id: lessonId,
      skill_id: body.skillId,
      lesson_number: body.lessonNumber,
      title: body.title,
      description: body.description,
      topic: body.topic,
      difficulty: body.difficulty || 1,
      estimated_minutes: body.estimatedMinutes || 10,
      is_published: body.isPublished || false,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lesson }, { status: 201 });
}

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

// GET /api/admin/lessons/[lessonId] - Get a single lesson with all content
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  
  // Get lesson
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();
  
  if (lessonError) {
    return NextResponse.json({ error: lessonError.message }, { status: 404 });
  }

  // Get intro cards with vocabulary
  const { data: introCards } = await supabase
    .from('intro_cards')
    .select(`
      *,
      vocabulary:vocabulary_id (*)
    `)
    .eq('lesson_id', lessonId)
    .order('order');

  // Get exercises
  const { data: exercises } = await supabase
    .from('exercises')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order');

  return NextResponse.json({
    lesson,
    introCards: introCards || [],
    exercises: exercises || [],
  });
}

// PUT /api/admin/lessons/[lessonId] - Update a lesson
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  const { data: lesson, error } = await supabase
    .from('lessons')
    .update({
      title: body.title,
      description: body.description,
      topic: body.topic,
      difficulty: body.difficulty,
      estimated_minutes: body.estimatedMinutes,
      is_published: body.isPublished,
    })
    .eq('id', lessonId)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lesson });
}

// DELETE /api/admin/lessons/[lessonId] - Delete a lesson
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', lessonId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

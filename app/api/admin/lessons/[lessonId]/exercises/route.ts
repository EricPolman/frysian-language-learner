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

// POST /api/admin/lessons/[lessonId]/exercises - Add exercises to a lesson
export async function POST(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  // Handle single exercise or array
  const exercises = Array.isArray(body) ? body : [body];
  
  // Get current max order
  const { data: existing } = await supabase
    .from('exercises')
    .select('order')
    .eq('lesson_id', lessonId)
    .order('order', { ascending: false })
    .limit(1);
  
  let currentOrder = existing?.[0]?.order ?? -1;
  
  const exercisesToInsert = exercises.map((ex) => {
    currentOrder++;
    const { id, type, ...exerciseData } = ex;
    return {
      id: id || `${lessonId}-ex-${Date.now()}-${currentOrder}`,
      lesson_id: lessonId,
      type: type,
      order: ex.order ?? currentOrder,
      data: exerciseData,
    };
  });
  
  const { data: insertedExercises, error } = await supabase
    .from('exercises')
    .insert(exercisesToInsert)
    .select();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exercises: insertedExercises }, { status: 201 });
}

// PUT /api/admin/lessons/[lessonId]/exercises - Update exercises (bulk)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  const exercises = Array.isArray(body) ? body : [body];
  const results = [];
  
  for (const ex of exercises) {
    const { id, type, order, ...exerciseData } = ex;
    
    const { data, error } = await supabase
      .from('exercises')
      .update({
        type: type,
        order: order,
        data: exerciseData,
      })
      .eq('id', id)
      .eq('lesson_id', lessonId)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    results.push(data);
  }

  return NextResponse.json({ exercises: results });
}

// DELETE /api/admin/lessons/[lessonId]/exercises - Delete exercises
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { lessonId } = await params;
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const exerciseId = searchParams.get('id');
  
  let query = supabase
    .from('exercises')
    .delete()
    .eq('lesson_id', lessonId);
  
  if (exerciseId) {
    query = query.eq('id', exerciseId);
  }
  
  const { error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

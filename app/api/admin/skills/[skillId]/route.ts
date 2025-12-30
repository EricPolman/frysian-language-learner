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
  params: Promise<{ skillId: string }>;
}

// GET /api/admin/skills/[skillId] - Get a single skill
export async function GET(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { skillId } = await params;
  const supabase = await createClient();
  
  const { data: skill, error } = await supabase
    .from('skills')
    .select(`
      *,
      lessons (
        id,
        title,
        description,
        topic,
        lesson_number,
        difficulty,
        estimated_minutes,
        is_published
      )
    `)
    .eq('id', skillId)
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ skill });
}

// PUT /api/admin/skills/[skillId] - Update a skill
export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { skillId } = await params;
  const supabase = await createClient();
  const body = await request.json();
  
  const { data: skill, error } = await supabase
    .from('skills')
    .update({
      title: body.title,
      description: body.description,
      long_description: body.longDescription,
      icon: body.icon,
      order: body.order,
      difficulty: body.difficulty,
      prerequisites: body.prerequisites,
      color: body.color,
      is_published: body.isPublished,
    })
    .eq('id', skillId)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skill });
}

// DELETE /api/admin/skills/[skillId] - Delete a skill
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { skillId } = await params;
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', skillId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

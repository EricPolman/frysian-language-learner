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

// GET /api/admin/skills - Get all skills (including unpublished)
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  
  const { data: skills, error } = await supabase
    .from('skills')
    .select(`
      *,
      lessons (
        id,
        title,
        description,
        topic,
        lesson_number,
        is_published
      )
    `)
    .order('order');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skills });
}

// POST /api/admin/skills - Create a new skill
export async function POST(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  const body = await request.json();
  
  const { data: skill, error } = await supabase
    .from('skills')
    .insert({
      id: body.id,
      title: body.title,
      description: body.description,
      long_description: body.longDescription,
      icon: body.icon || '📚',
      order: body.order || 0,
      difficulty: body.difficulty || 1,
      prerequisites: body.prerequisites || [],
      color: body.color || '#3b82f6',
      is_published: body.isPublished || false,
    })
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ skill }, { status: 201 });
}

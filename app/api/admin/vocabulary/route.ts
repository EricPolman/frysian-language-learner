import { NextResponse } from "next/server";
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

// GET /api/admin/vocabulary - Get all vocabulary
export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createClient();
  
  const { data: vocabulary, error } = await supabase
    .from('vocabulary')
    .select('*')
    .order('frysian');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ vocabulary });
}

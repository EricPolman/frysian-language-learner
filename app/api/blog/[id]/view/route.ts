import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Record the view (upsert to handle duplicate views)
    const { error } = await supabase
      .from('blog_post_views')
      .upsert(
        { blog_post_id: id, user_id: user.id },
        { onConflict: 'blog_post_id,user_id' }
      );

    if (error) {
      console.error('Error recording blog post view:', error);
      return NextResponse.json(
        { error: 'Failed to record view' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in blog post view API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

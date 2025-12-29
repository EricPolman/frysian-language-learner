import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/app/login/actions";

export async function PATCH(request: Request) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { dailyGoalXp, audioEnabled, notificationsEnabled } = body;

    const supabase = await createClient();

    // Build update object with only provided fields
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (dailyGoalXp !== undefined) {
      updates.daily_goal_xp = dailyGoalXp;
    }
    if (audioEnabled !== undefined) {
      updates.audio_enabled = audioEnabled;
    }
    if (notificationsEnabled !== undefined) {
      updates.notifications_enabled = notificationsEnabled;
    }

    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("daily_goal_xp, audio_enabled, notifications_enabled")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      dailyGoalXp: profile.daily_goal_xp,
      audioEnabled: profile.audio_enabled,
      notificationsEnabled: profile.notifications_enabled,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

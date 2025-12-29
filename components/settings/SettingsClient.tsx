"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/shared/Header";
import { MobileNav } from "@/components/shared/MobileNav";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  userId: string;
}

export function SettingsClient({ userId }: SettingsClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    dailyGoalXp: 50,
    audioEnabled: true,
    notificationsEnabled: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success("Settings saved!");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const dailyGoalOptions = [20, 50, 100, 200, 500];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-gray-500">Loading settings...</p>
          </div>
        </main>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-24 max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your learning preferences</p>
        </div>

        <div className="space-y-6">
          {/* Daily Goal */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🎯 Daily Goal
            </h2>
            <div className="space-y-4">
              <Label htmlFor="daily-goal" className="text-base">
                Daily XP Target
              </Label>
              <p className="text-sm text-gray-600">
                Set a daily XP goal to help you stay motivated
              </p>
              <div className="grid grid-cols-5 gap-2">
                {dailyGoalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setSettings({ ...settings, dailyGoalXp: goal })}
                    className={`
                      py-3 px-2 rounded-lg font-semibold text-sm transition-all
                      ${
                        settings.dailyGoalXp === goal
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {goal}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Current goal: <span className="font-semibold">{settings.dailyGoalXp} XP</span> per day
              </p>
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🔊 Audio
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="audio-enabled" className="text-base">
                    Enable Audio
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Play pronunciation audio in lessons
                  </p>
                </div>
                <button
                  id="audio-enabled"
                  onClick={() =>
                    setSettings({ ...settings, audioEnabled: !settings.audioEnabled })
                  }
                  className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                    ${settings.audioEnabled ? "bg-blue-600" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                      ${settings.audioEnabled ? "translate-x-7" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              🔔 Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications-enabled" className="text-base">
                    Enable Notifications
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Get reminders to practice daily
                  </p>
                </div>
                <button
                  id="notifications-enabled"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      notificationsEnabled: !settings.notificationsEnabled,
                    })
                  }
                  className={`
                    relative inline-flex h-8 w-14 items-center rounded-full transition-colors
                    ${settings.notificationsEnabled ? "bg-blue-600" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                      ${settings.notificationsEnabled ? "translate-x-7" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>

          {/* Account Actions */}
          <Card className="p-6 border-red-200">
            <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              ⚠️ Account
            </h2>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  if (confirm("Are you sure you want to sign out?")) {
                    window.location.href = "/login";
                  }
                }}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <MobileNav />
    </div>
  );
}

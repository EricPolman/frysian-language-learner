import { getUser } from "@/app/login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function AdminPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  
  if (!(profile as any)?.is_admin) {
    redirect("/learn");
  }
  
  // Get stats - these tables might not exist yet
  let skillCount = 0;
  let lessonCount = 0;
  let exerciseCount = 0;
  let vocabCount = 0;
  
  try {
    const { count } = await supabase
      .from("skills")
      .select("*", { count: "exact", head: true });
    skillCount = count || 0;
  } catch (e) {}
  
  try {
    const { count } = await supabase
      .from("lessons")
      .select("*", { count: "exact", head: true });
    lessonCount = count || 0;
  } catch (e) {}
  
  try {
    const { count } = await supabase
      .from("exercises")
      .select("*", { count: "exact", head: true });
    exerciseCount = count || 0;
  } catch (e) {}
  
  try {
    const { count } = await supabase
      .from("vocabulary")
      .select("*", { count: "exact", head: true });
    vocabCount = count || 0;
  } catch (e) {}

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Beheerdersdashboard</h1>
            <p className="text-gray-600 mt-1">Beheer lessen, vaardigheden en inhoud</p>
          </div>
          <Link href="/learn">
            <Button variant="outline">← Terug naar App</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{skillCount || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Vaardigheden</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{lessonCount || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Lessen</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{exerciseCount || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Oefeningen</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600">{vocabCount || 0}</div>
            <div className="text-sm text-gray-600 mt-1">Woorden</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🌳</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Vaardigheden Beheren</h2>
                <p className="text-gray-600 mb-4">
                  Maak, bewerk en organiseer vaardigheden in de leerboom.
                </p>
                <Link href="/admin/skills">
                  <Button>Vaardigheden Bekijken →</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📚</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Lessen Beheren</h2>
                <p className="text-gray-600 mb-4">
                  Maak lessen met introkaarten en oefeningen.
                </p>
                <Link href="/admin/lessons">
                  <Button>Lessen Bekijken →</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📝</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Woordenlijst</h2>
                <p className="text-gray-600 mb-4">
                  Bekijk en beheer alle vocabulaire woorden.
                </p>
                <Link href="/admin/vocabulary">
                  <Button variant="outline">Woorden Bekijken →</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🤖</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">AI Content Generator</h2>
                <p className="text-gray-600 mb-4">
                  Genereer complete vaardigheden en lessen met AI.
                </p>
                <Link href="/admin/generate">
                  <Button className="bg-purple-600 hover:bg-purple-700">✨ Genereren →</Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="text-4xl">📥</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">JSON Importeren</h2>
                <p className="text-gray-600 mb-4">
                  Importeer bestaande lessen uit JSON-bestanden.
                </p>
                <Link href="/admin/import">
                  <Button variant="outline">Importeren →</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatbotClient } from "@/components/chat/ChatbotClient";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back button */}
        <Link
          href="/learn"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 text-sm font-medium"
        >
          ← Terug naar Leren
        </Link>

        <Card className="shadow-xl overflow-hidden">
          <ChatbotClient />
        </Card>

        {/* Info section */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-3">🎯 Hoe gebruik je deze chat?</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Schrijf in het Fries</strong> - probeer zoveel mogelijk Fries te gebruiken</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Krijg correcties</strong> - de AI helpt je met grammatica en uitspraak</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Oefen natuurlijk</strong> - praat over alledaagse onderwerpen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Leer cultuur</strong> - ontdek interessante feiten over Friesland</span>
            </li>
          </ul>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Voorbeeld:</strong> Probeer te beginnen met: &quot;Goeie, hoe giet it?&quot; of &quot;Hoe hjit jo?&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

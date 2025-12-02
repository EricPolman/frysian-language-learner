import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<{ xp?: string }>;
}

export default async function LessonResultsPage({
  params,
  searchParams,
}: Props) {
  const { lessonId } = await params;
  const { xp } = await searchParams;
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const xpEarned = parseInt(xp || "0");

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success animation */}
          <div className="text-8xl mb-6 animate-bounce">🎉</div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Les Voltooid!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Goed gedaan! Je hebt deze les afgerond.
          </p>

          {/* Stats */}
          <Card className="p-8 mb-8">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <div className="text-5xl font-bold text-yellow-500 mb-2">
                  +{xpEarned} XP
                </div>
                <div className="text-gray-600">Ervaringspunten Verdiend</div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="space-y-4">
            <Link href="/learn">
              <Button size="lg" className="w-full">
                Ga Verder met Leren
              </Button>
            </Link>
            <Link href={`/learn/lesson/${lessonId}`}>
              <Button variant="outline" size="lg" className="w-full">
                Oefen Opnieuw
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

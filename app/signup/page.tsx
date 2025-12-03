import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../login/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="text-3xl"><img src="/Frisian_flag.png" alt="Frysk Leare Logo" className="w-8" /></div>
            <span className="text-2xl font-bold text-gray-900">
              Frysk Leare
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Maak je Account
          </h1>
          <p className="text-gray-600 mt-2">
            Begin vandaag met Fries leren — het is gratis!
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card className="p-6">
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Weergavenaam</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Jouw naam"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mailadres</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jouw.email@voorbeeld.nl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500">
                Minimaal 6 tekens
              </p>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 rounded" required />
              <span className="text-gray-600">
                Ik ga akkoord met de{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Gebruiksvoorwaarden
                </Link>{" "}
                en{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:underline"
                >
                  Privacybeleid
                </Link>
              </span>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Account Aanmaken
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Heb je al een account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Inloggen
            </Link>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Wat je krijgt:</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Onbeperkte toegang tot alle lessen</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Volg je voortgang op alle apparaten</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Gepersonaliseerde leerervaring</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

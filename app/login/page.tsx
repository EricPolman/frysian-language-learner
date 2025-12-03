import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error;

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="text-3xl"><img src="/Frisian_flag.png" alt="Frysk Leare Logo"  className="w-8" /></div>
            <span className="text-2xl font-bold text-gray-900">
              Frysk Leare
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Welkom Terug
          </h1>
          <p className="text-gray-600 mt-2">
            Log in om verder te gaan met leren
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Card className="p-6">
          <form action={login} className="space-y-4">
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
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-600">Onthoud mij</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Wachtwoord vergeten?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Inloggen
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Nog geen account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Registreren
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Door in te loggen ga je akkoord met onze Gebruiksvoorwaarden en Privacybeleid
        </p>
      </div>
    </div>
  );
}

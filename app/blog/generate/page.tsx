'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function GenerateBlogPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [newsUrl, setNewsUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'eric@ericpolman.com') {
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
    }
    
    checkAuth();
  }, []);

  const handleGenerate = async () => {
    if (!topic) {
      setError('Voer alsjeblieft een onderwerp in');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          level,
          newsUrl: newsUrl || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Kon geen blogbericht genereren');
      }

      const data = await response.json();
      setResult(data.post);
    } catch (err) {
      console.error('Error generating blog post:', err);
      setError('Kon geen blogbericht genereren. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    'Traditionele Friese keuken en recepten',
    'De geschiedenis van schaatsen in Friesland',
    'Beroemde Friese schrijvers en dichters',
    'Friese festivals en vieringen',
    'Modern leven in Friese steden',
    'Friese natuur en natuurgebieden',
    'Traditionele Friese sporten zoals fierljeppen',
    'Friese muziek en volksliedjes',
    'De Friese taal en haar dialecten',
    'Friese architectuur en windmolens'
  ];

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Geen Toegang</h1>
            <p className="text-gray-700 mb-6">
              Je hebt geen toestemming om blogberichten te genereren.
            </p>
            <Button onClick={() => router.push('/blog')}>
              Terug naar Blog
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              ← Blog
            </Button>
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Genereer Blogbericht
          </h1>
          <p className="text-gray-600 text-lg">
            Maak een nieuw AI-gegenereerd blogbericht over de Friese taal en cultuur
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="topic" className="text-lg font-semibold mb-2 block">
                Onderwerp
              </Label>
              <Input
                id="topic"
                placeholder="bijv. Friese wintertraditiesn"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-gray-500 mt-2">
                Beschrijf waar het blogbericht over moet gaan
              </p>
            </div>

            <div>
              <Label className="text-lg font-semibold mb-2 block">
                Niveau
              </Label>
              <div className="flex gap-3">
                <Button
                  variant={level === 'beginner' ? 'default' : 'outline'}
                  onClick={() => setLevel('beginner')}
                  className="flex-1"
                >
                  Beginner
                </Button>
                <Button
                  variant={level === 'intermediate' ? 'default' : 'outline'}
                  onClick={() => setLevel('intermediate')}
                  className="flex-1"
                >
                  Gemiddeld
                </Button>
                <Button
                  variant={level === 'advanced' ? 'default' : 'outline'}
                  onClick={() => setLevel('advanced')}
                  className="flex-1"
                >
                  Gevorderd
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="newsUrl" className="text-lg font-semibold mb-2 block">
                Nieuwsbron URL (Optioneel)
              </Label>
              <Input
                id="newsUrl"
                placeholder="https://voorbeeld.nl/artikel"
                value={newsUrl}
                onChange={(e) => setNewsUrl(e.target.value)}
                type="url"
              />
              <p className="text-sm text-gray-500 mt-2">
                Link naar een nieuwsartikel om het blogbericht op te baseren
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full"
              size="lg"
            >
              {loading ? 'Genereren...' : 'Genereer Blogbericht'}
            </Button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-4">Voorgestelde Onderwerpen</h3>
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map((suggestedTopic, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setTopic(suggestedTopic)}
                className="text-sm"
              >
                {suggestedTopic}
              </Button>
            ))}
          </div>
        </Card>

        {result && (
          <Card className="p-8 bg-green-50 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-green-900">
                ✅ Blogbericht Gegenereerd!
              </h3>
              <Link href={`/blog/${result.id}`}>
                <Button>Bekijk Bericht</Button>
              </Link>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Titel:</strong> {result.title}
              </p>
              <p className="text-gray-700">
                <strong>Niveau:</strong> {result.level === 'beginner' ? 'Beginner' : result.level === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
              </p>
              <p className="text-gray-700">
                <strong>Woorden:</strong> {result.vocabulary?.length || 0}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { BlogPostLevel } from "@/types/blog";

async function getLatestBlogPosts() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }

  return posts || [];
}

function getLevelBadgeColor(level: BlogPostLevel): string {
  switch (level) {
    case 'beginner':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'advanced':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return '';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default async function Home() {
  const latestPosts = await getLatestBlogPosts();
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              Leer Fries vanuit het Nederlands
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Leer Fries met
            <span className="text-blue-600"> Interactieve Lessen</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Leer West-Fries door middel van speelse oefeningen, interactieve lessen
            en slimme herhaling. Perfect voor Nederlandstaligen!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Gratis Beginnen
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Meer Informatie
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Mobiel-vriendelijk</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Voortgang Bijhouden</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Waarom bij ons leren?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Onze bewezen methode combineert interactieve oefeningen, gamificatie en
            slimme algoritmes om je te helpen Fries te leren.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold mb-2">Interactieve Oefeningen</h4>
            <p className="text-gray-600">
              Oefen met vertalingen, invuloefeningen, plaatjes koppelen
              en zinnen bouwen.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🌳</div>
            <h4 className="text-xl font-bold mb-2">Vaardigheidsboom</h4>
            <p className="text-gray-600">
              Werk door gestructureerde lessen van basis tot gevorderd.
              Ontgrendel nieuwe vaardigheden terwijl je leert.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h4 className="text-xl font-bold mb-2">Gamificatie</h4>
            <p className="text-gray-600">
              Verdien XP, level omhoog en vier je prestaties. Blijf gemotiveerd
              met voortgang bijhouden.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold mb-2">Mobiel-Eerst</h4>
            <p className="text-gray-600">
              Leer overal, altijd. Werkt perfect op je telefoon, tablet of
              desktop.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔄</div>
            <h4 className="text-xl font-bold mb-2">Slimme Herhaling</h4>
            <p className="text-gray-600">
              Slim herhalingssysteem zorgt dat je onthoudt wat je leert. Oefen
              moeilijke woorden op het juiste moment.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💾</div>
            <h4 className="text-xl font-bold mb-2">Voortgang Opslaan</h4>
            <p className="text-gray-600">
              Je voortgang wordt opgeslagen op al je apparaten. Ga verder waar je
              gebleven was.
            </p>
          </Card>
        </div>
      </section>

      {/* Blog Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            📚 Friese Taal Blog
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dagelijkse berichten om je Friese woordenschat en culturele kennis uit te breiden
          </p>
        </div>

        {latestPosts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
              {latestPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link href={`/blog/${post.id}`}>
                    <div className="p-6">
                      {/* Level Badge */}
                      <div className="mb-3">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getLevelBadgeColor(post.level)}`}>
                          {post.level === 'beginner' ? 'Beginner' : post.level === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {post.title}
                      </h4>
                      
                      {/* Frisian Title */}
                      <p className="text-sm text-blue-600 mb-3 italic">
                        {post.title_fy}
                      </p>

                      {/* Summary */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.summary}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.published_date)}</span>
                        <span>{(post.vocabulary as any[])?.length || 0} woorden</span>
                      </div>

                      {/* Read More Link */}
                      <div className="mt-4 pt-4 border-t">
                        <span className="text-blue-600 font-semibold text-sm hover:underline">
                          Lees meer →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blog">
                <Button variant="outline" size="lg">
                  Bekijk Alle Berichten →
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <p className="text-gray-600">Nog geen blogberichten beschikbaar. Kom later terug!</p>
          </Card>
        )}
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hoe Het Werkt
            </h3>
            <p className="text-lg text-gray-600">
              Begin met Fries leren in drie eenvoudige stappen
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">Maak een Account</h4>
              <p className="text-gray-600">
                Meld je gratis aan en begin direct met je leerreis.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">Voltooi Lessen</h4>
              <p className="text-gray-600">
                Werk door interactieve oefeningen en ontgrendel nieuwe vaardigheden.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2">Volg je Voortgang</h4>
              <p className="text-gray-600">
                Zie je level stijgen en vier je prestaties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Klaar om te Beginnen?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Sluit je aan bij duizenden leerlingen die Fries leren. Het is gratis!
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Nu Beginnen →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl"><img src="/Frisian_flag.png" alt="Frysk Leare Logo" className="w-8" /></div>
              <span className="font-bold text-gray-900">Frysk Leare</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 Frysk Leare. Leer West-Fries vanuit het Nederlands.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

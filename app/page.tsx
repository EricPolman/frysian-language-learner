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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-white">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block animate-fade-in">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300">
                Leer Fries vanuit het Nederlands
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Leer Fries met
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Interactieve Lessen
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Leer Fries door middel van speelse oefeningen, interactieve lessen
              en slimme herhaling. Perfect voor Nederlandstaligen!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center gap-2">
                    Nu Beginnen
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:border-blue-600">
                  Meer Informatie
                </Button>
              </Link>
            </div>

            <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-xl">🎯</span>
                </div>
                <span className="font-semibold text-gray-900">Interactief Leren</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-xl">📱</span>
                </div>
                <span className="font-semibold text-gray-900">Mobiel-vriendelijk</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 text-xl">📊</span>
                </div>
                <span className="font-semibold text-gray-900">Voortgang Bijhouden</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-blue-200 bg-gradient-to-br from-white to-blue-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Interactieve Oefeningen</h3>
              <p className="text-gray-600 leading-relaxed">
                Oefen met vertalingen, invuloefeningen, plaatjes koppelen
                en zinnen bouwen.
              </p>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-purple-200 bg-gradient-to-br from-white to-purple-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🌳</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Vaardigheidsboom</h3>
              <p className="text-gray-600 leading-relaxed">
                Werk door gestructureerde lessen van basis tot gevorderd.
                Ontgrendel nieuwe vaardigheden terwijl je leert.
              </p>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-yellow-200 bg-gradient-to-br from-white to-yellow-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🏆</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Gamificatie</h3>
              <p className="text-gray-600 leading-relaxed">
                Verdien XP, level omhoog en vier je prestaties. Blijf gemotiveerd
                met voortgang bijhouden.
              </p>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-green-200 bg-gradient-to-br from-white to-green-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📱</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Mobiel-Eerst</h3>
              <p className="text-gray-600 leading-relaxed">
                Leer overal, altijd. Werkt perfect op je telefoon, tablet of
                desktop.
              </p>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-pink-200 bg-gradient-to-br from-white to-pink-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">🔄</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Slimme Herhaling</h3>
              <p className="text-gray-600 leading-relaxed">
                Slim herhalingssysteem zorgt dat je onthoudt wat je leert. Oefen
                moeilijke woorden op het juiste moment.
              </p>
            </Card>

            <Card className="group p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">💾</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Voortgang Opslaan</h3>
              <p className="text-gray-600 leading-relaxed">
                Je voortgang wordt opgeslagen op al je apparaten. Ga verder waar je
                gebleven was.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-white via-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-purple-600 tracking-wider uppercase">Blog</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              📚 Friese Taal Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dagelijkse berichten om je Friese woordenschat en culturele kennis uit te breiden
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                {latestPosts.map((post) => (
                  <Card key={post.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-blue-300 bg-white">
                    <Link href={`/blog/${post.id}`}>
                      <div className="p-8">
                        {/* Level Badge */}
                        <div className="mb-4">
                          <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full border-2 transition-all duration-300 ${getLevelBadgeColor(post.level)}`}>
                            {post.level === 'beginner' ? '🌱 Beginner' : post.level === 'intermediate' ? '🌿 Gemiddeld' : '🌳 Gevorderd'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                          {post.title}
                        </h3>
                        
                        {/* Frisian Title */}
                        <p className="text-base text-blue-600 mb-4 italic font-medium">
                          {post.title_fy}
                        </p>

                        {/* Summary */}
                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                          {post.summary}
                        </p>

                        {/* Metadata */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(post.published_date)}
                          </span>
                          <span className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="text-purple-700 font-semibold">{(post.vocabulary as any[])?.length || 0}</span>
                          </span>
                        </div>

                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all duration-300">
                          <span>Lees meer</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 hover:shadow-xl">
                    <span className="flex items-center gap-2">
                      Bekijk Alle Berichten
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <Card className="p-12 text-center max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-50 border-2">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-600 text-lg">Nog geen blogberichten beschikbaar. Kom later terug!</p>
            </Card>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="text-sm font-semibold text-blue-200 tracking-wider uppercase">Zo Simpel</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Hoe Het Werkt
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Begin met Fries leren in drie eenvoudige stappen
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-white text-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center text-3xl font-extrabold mx-auto shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-white/20">
                  1
                </div>
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Maak een Account</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Meld je aan en begin direct met je leerreis.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-white text-purple-600 rounded-2xl w-20 h-20 flex items-center justify-center text-3xl font-extrabold mx-auto shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-white/20">
                  2
                </div>
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Voltooi Lessen</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Werk door interactieve oefeningen en ontgrendel nieuwe vaardigheden.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="bg-white text-blue-600 rounded-2xl w-20 h-20 flex items-center justify-center text-3xl font-extrabold mx-auto shadow-2xl shadow-black/20 group-hover:scale-110 transition-all duration-300 group-hover:shadow-white/20">
                  3
                </div>
                <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Volg je Voortgang</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Zie je level stijgen en vier je prestaties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="relative max-w-5xl mx-auto text-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 md:p-16 text-white overflow-hidden shadow-2xl">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-block mb-6">
                <span className="bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold border border-white/30">
                  Start vandaag
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Klaar om te beginnen?
              </h2>
              
              <Link href="/signup">
                <Button size="lg" className="text-lg px-12 py-7 bg-white text-blue-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 font-bold">
                  <span className="flex items-center gap-2">
                    Frysk Leare
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                <img src="/Frisian_flag.png" alt="Frysk Leare Logo" className="w-10 h-10 rounded-lg shadow-md" />
              </div>
              <div>
                <span className="font-bold text-xl text-gray-900 block">Frysk Leare</span>
                <span className="text-sm text-gray-500">Leer Fries met plezier</span>
              </div>
            </div>
            <div className="text-gray-600 text-sm text-center md:text-right">
              <p className="font-medium">© 2025 Frysk Leare</p>
              <p className="text-gray-500">Leer Fries vanuit het Nederlands</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogPostLevel } from "@/types/blog";

async function getBlogPosts() {
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('published_date', { ascending: false })
    .limit(20);

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
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              ← Terug naar Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Friese taal Blog
              </h1>
              <p className="text-gray-600">
                Dagelijkse berichten om je Friese woordenschat en culturele kennis uit te breiden
              </p>
            </div>
            
            <Link href="/blog/generate">
              <Button variant="outline">
                ✨ Nieuw Bericht
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {posts.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600">Nog geen blogberichten beschikbaar. Kom later terug!</p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
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
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    
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
        )}

        {/* Filter Options (Future Enhancement) */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2">Binnenkort</h3>
          <p className="text-sm text-gray-600">
            Filter op niveau, zoek op onderwerp, en bewaar je favoriete berichten!
          </p>
        </div>
      </div>
    </div>
  );
}

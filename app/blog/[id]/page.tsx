'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPost, BlogPostLevel } from '@/types/blog';

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

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`/api/blog/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }

        const data = await response.json();
        setPost(data.post);

        // Record view
        await fetch(`/api/blog/${params.id}/view`, {
          method: 'POST'
        });
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Bericht laden...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">{error || 'Bericht niet gevonden'}</p>
            <Button onClick={() => router.push('/blog')}>
              Terug naar Blog
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => router.push('/blog')}
        >
          ← Terug naar Blog
        </Button>

        {/* Main Article */}
        <article>
          <Card className="p-8 mb-6">
            {/* Level Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full border ${getLevelBadgeColor(post.level)}`}>
                {post.level === 'beginner' ? 'Beginner' : post.level === 'intermediate' ? 'Gemiddeld' : 'Gevorderd'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {post.title}
            </h1>

            {/* Frisian Title (only if different) */}
            {post.title !== post.title_fy && (
              <h2 className="text-2xl text-blue-600 mb-4 italic">
                {post.title_fy}
              </h2>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
              <span>📅 {formatDate(post.published_date)}</span>
              {post.source_name && (
                <span>📰 {post.source_name}</span>
              )}
              <span>📚 {post.vocabulary.length} woorden</span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Source Link */}
            {post.source_url && (
              <div className="mt-6 pt-6 border-t">
                <a 
                  href={post.source_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Lees originele bron →
                </a>
              </div>
            )}
          </Card>

          {/* Vocabulary Section */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              📖 Woordenschat uit dit bericht
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              {post.vocabulary.map((item, index) => (
                <Card key={index} className="p-4 bg-blue-50 border-blue-200">
                  <div className="mb-2">
                    <span className="text-lg font-bold text-blue-900">
                      {item.word_fy}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 min-w-[60px]">🇳🇱 Dutch:</span>
                      <span className="text-gray-900 font-medium">{item.word_nl}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-gray-600 min-w-[60px]">🇬🇧 English:</span>
                      <span className="text-gray-900 font-medium">{item.word_en}</span>
                    </div>
                  </div>

                  {item.explanation && (
                    <p className="mt-3 text-sm text-gray-700 italic border-t border-blue-300 pt-3">
                      {item.explanation}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </article>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => router.push('/blog')}
            size="lg"
          >
            Meer Blogberichten
          </Button>
        </div>
      </div>
    </div>
  );
}

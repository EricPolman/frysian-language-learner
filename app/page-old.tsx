import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-blue-600">🇳🇱</div>
          <h1 className="text-xl font-bold text-gray-900">Frysian Learning</h1>
        </div>
        <nav className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="inline-block">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              Learn Frysian from Dutch
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Master Frysian with
            <span className="text-blue-600"> Interactive Lessons</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn West Frisian through gamified exercises, interactive lessons,
            and spaced repetition. Perfect for Dutch speakers!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Learning Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Mobile-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Learn with Us?
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our proven method combines interactive exercises, gamification, and
            smart algorithms to help you master Frysian.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-xl font-bold mb-2">Interactive Exercises</h4>
            <p className="text-gray-600">
              Practice with translation, fill-in-the-blank, picture matching,
              and sentence building exercises.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🌳</div>
            <h4 className="text-xl font-bold mb-2">Skill Tree</h4>
            <p className="text-gray-600">
              Progress through structured lessons from basics to advanced
              topics. Unlock new skills as you learn.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🏆</div>
            <h4 className="text-xl font-bold mb-2">Gamification</h4>
            <p className="text-gray-600">
              Earn XP, level up, and celebrate your achievements. Stay motivated
              with progress tracking.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📱</div>
            <h4 className="text-xl font-bold mb-2">Mobile-First</h4>
            <p className="text-gray-600">
              Learn anywhere, anytime. Works perfectly on your phone, tablet, or
              desktop.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔄</div>
            <h4 className="text-xl font-bold mb-2">Spaced Repetition</h4>
            <p className="text-gray-600">
              Smart review system ensures you remember what you learn. Practice
              weak words at the right time.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💾</div>
            <h4 className="text-xl font-bold mb-2">Progress Tracking</h4>
            <p className="text-gray-600">
              Your progress is saved across devices. Pick up exactly where you
              left off.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <p className="text-lg text-gray-600">
              Start learning Frysian in three simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-bold mb-2">Create Account</h4>
              <p className="text-gray-600">
                Sign up for free and start your learning journey immediately.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-bold mb-2">Complete Lessons</h4>
              <p className="text-gray-600">
                Work through interactive exercises and unlock new skills.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-bold mb-2">Track Progress</h4>
              <p className="text-gray-600">
                Watch your level increase and celebrate your achievements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of learners mastering Frysian. It's free!
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Now →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🇳🇱</div>
              <span className="font-bold text-gray-900">Frysian Learning</span>
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 Frysian Learning. Learn West Frisian from Dutch.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

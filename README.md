# Frysian Learning App

A mobile-friendly web application for learning Frysian (West Frisian) from Dutch, built with Next.js. Features gamified lessons, interactive exercises, and progress tracking.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand + TanStack Query
- **Backend**: Supabase (PostgreSQL + Auth)
- **PWA**: next-pwa for offline support

## 📋 Features

- 🎯 4 Exercise Types: Translation, Fill-in-blank, Picture match, Sentence building
- 🌳 Skill Tree: Duolingo-style progression system
- 🏆 Gamification: XP, levels, celebrations
- 📱 Mobile-First: Responsive design with PWA support
- 💾 Progress Tracking: Save progress across devices
- 🔄 Spaced Repetition: Smart review scheduling

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frysian-duolingo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials and API keys.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frysian-duolingo/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── exercises/       # Exercise type components
│   ├── lesson/          # Lesson flow components
│   ├── skill-tree/      # Skill tree components
│   ├── animations/      # Animations
│   └── ui/              # shadcn/ui components
├── lib/                 # Utilities
│   ├── supabase/        # Supabase clients
│   ├── content/         # Content management
│   ├── exercises/       # Exercise logic
│   ├── progress/        # Progress tracking
│   └── stores/          # Zustand stores
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
├── data/                # Lesson content (JSON)
├── public/              # Static assets
└── scripts/             # Build scripts
```

## 📝 Next Steps

See the [Project Specification](./specs/project-spec.md) for detailed information about:
- Learning experience design
- Content structure
- Technical architecture
- Implementation roadmap

## 🤝 Contributing

This is an active development project. Contributions welcome!

## 📄 License

[Your License]


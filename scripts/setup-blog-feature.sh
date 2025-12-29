#!/bin/bash

# Blog Feature Setup Script
# This script helps set up the blog feature for the Frisian Language Learner app

echo "🚀 Setting up Blog Feature for Frisian Language Learner"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Step 1: Checking Supabase connection..."
echo ""

# Check if user has Supabase CLI installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo ""
    read -p "Press Enter after installing Supabase CLI, or Ctrl+C to exit..."
fi

echo "📊 Step 2: Running database migration..."
echo ""
echo "Choose migration method:"
echo "1) Run migration locally (requires Supabase CLI setup)"
echo "2) I'll run it manually in Supabase dashboard"
echo ""
read -p "Enter choice (1 or 2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "Running migration..."
    supabase migration up
    if [ $? -eq 0 ]; then
        echo "✅ Migration completed successfully"
    else
        echo "❌ Migration failed. Please check the error above."
        echo "   You can also run the migration manually in Supabase dashboard:"
        echo "   File: supabase/migrations/20251229_add_blog_posts.sql"
        exit 1
    fi
else
    echo ""
    echo "📝 Manual migration steps:"
    echo "1. Go to your Supabase dashboard"
    echo "2. Navigate to SQL Editor"
    echo "3. Run the SQL from: supabase/migrations/20251229_add_blog_posts.sql"
    echo ""
    read -p "Press Enter after running the migration manually..."
fi

echo ""
echo "🔧 Step 3: Regenerating TypeScript types..."
echo ""

# Ask for project ID
read -p "Enter your Supabase project ID: " project_id

if [ -z "$project_id" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

echo "Generating types..."
npx supabase gen types typescript --project-id "$project_id" > ./lib/supabase/types.ts

if [ $? -eq 0 ]; then
    echo "✅ TypeScript types regenerated successfully"
else
    echo "❌ Failed to generate types. Please check your project ID and try again."
    exit 1
fi

echo ""
echo "✅ Blog feature setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Make sure OPENAI_API_KEY is set in your .env.local file"
echo "2. Visit /blog/generate to create your first blog post"
echo "3. Check out BLOG_FEATURE.md for full documentation"
echo ""
echo "Happy blogging! 📰"

-- Migration: Add chat_messages table
-- Created: 2025-12-29

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own chat messages
CREATE POLICY "Users can view their own chat messages"
    ON public.chat_messages
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can only insert their own chat messages
CREATE POLICY "Users can insert their own chat messages"
    ON public.chat_messages
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own chat messages
CREATE POLICY "Users can delete their own chat messages"
    ON public.chat_messages
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.chat_messages TO authenticated;
GRANT SELECT ON public.chat_messages TO anon;

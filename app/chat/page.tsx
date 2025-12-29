import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatbotClient } from "@/components/chat/ChatbotClient";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ChatPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch chat history
  const { data: chatHistory } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50);

  // Convert chat history to messages format
  const initialMessages = chatHistory?.flatMap((msg) => [
    { role: "user" as const, content: msg.user_message, timestamp: msg.created_at },
    { role: "assistant" as const, content: msg.ai_response, timestamp: msg.created_at },
  ]) || [];

  return (
    <div className="h-screen overflow-hidden bg-white">
      <ChatbotClient initialMessages={initialMessages} />
    </div>
  );
}

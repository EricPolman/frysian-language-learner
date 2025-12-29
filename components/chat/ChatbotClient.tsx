"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface ChatbotProps {
  initialMessages?: Message[];
}

export function ChatbotClient({ initialMessages = [] }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message only if no initial messages and not yet initialized
    if (!isInitialized && initialMessages.length === 0 && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hoi! Ik ben je Friese taalcoach. Laten we beginnen met een gesprek! Hoe giet it mei dy? 👋",
        },
      ]);
    }
    setIsInitialized(true);
  }, [initialMessages.length, isInitialized]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();

      if (data.success && data.response) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, er is iets misgegaan. Probeer het opnieuw. 😔",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Compact Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
              💬
            </div>
            <div>
              <h1 className="text-lg font-bold">Fries Oefenen</h1>
              <p className="text-xs opacity-90">AI Taalcoach</p>
            </div>
          </div>
          <a href="/dashboard" className="text-white/80 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        </div>
      </div>

      {/* Messages Container - Scrollable */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md px-4">
              <div className="text-5xl sm:text-6xl mb-4">💬</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Begin met praten!</h3>
              <p className="text-sm sm:text-base text-gray-600">Stuur een bericht in het Fries om te beginnen met je gesprek.</p>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => {
          const showAvatar = index === 0 || messages[index - 1].role !== message.role;
          const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.role !== message.role;
          
          return (
            <div
              key={index}
              className={`flex gap-2 sm:gap-3 items-start ${message.role === "user" ? "flex-row-reverse" : "flex-row"} animate-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${showAvatar ? "visible" : "invisible"}`}>
                {message.role === "assistant" ? (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                    🤖
                  </div>
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                    👤
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"} max-w-[80%] sm:max-w-[75%] md:max-w-[65%]`}>
                <div
                  className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                      : "bg-white text-gray-900 border border-gray-200"
                  } ${message.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
                >
                  <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">{message.content}</p>
                </div>
                
                {/* Timestamp */}
                {isLastInGroup && message.timestamp && (
                  <span className="text-xs text-gray-400 mt-1 px-2">
                    {formatTime(message.timestamp)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex gap-2 sm:gap-3 items-start animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex-shrink-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md text-sm sm:text-base">
                🤖
              </div>
            </div>
            <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-lg">
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <Input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Schrijf in het Fries..."
              disabled={isLoading}
              className="w-full text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
          </div>
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

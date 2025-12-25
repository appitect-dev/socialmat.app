"use client";

import { useState, useEffect, useRef } from "react";
import { useDashboardTheme } from "@/components/dashboard-theme";
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Edit2,
  Clock,
  MessageSquare,
  Lightbulb,
  FileText,
  Calendar,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export default function AIContentPage() {
  const { palette, isDark } = useDashboardTheme();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { icon: <Lightbulb className="w-4 h-4" />, text: "Navrhni 5 nápadů na Reels", prompt: "Navrhni mi 5 nápadů na Instagram Reels pro můj obsah. Chci něco, co zaujme a zvýší engagement." },
    { icon: <FileText className="w-4 h-4" />, text: "Napiš virální hook", prompt: "Napiš mi 3 silné hooky, které zastaví scroll na Instagramu. Potřebuji něco, co lidi přiměje číst dál." },
    { icon: <Calendar className="w-4 h-4" />, text: "Vytvoř content plán", prompt: "Vytvoř mi content plán na celý měsíc pro Instagram. Zahrň různé formáty a témata pro udržení engagement." },
    { icon: <Zap className="w-4 h-4" />, text: "Optimalizuj caption", prompt: "Pomoz mi napsat perfektní caption pro Instagram post. Potřebuji hook, hodnotu a silné CTA." },
  ];

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSessions = async () => {
    try {
      const response = await fetch("/api/ai/sessions");
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await fetch("/api/ai/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nová konverzace", messages: [] }),
      });
      const data = await response.json();
      setSessions([data.session, ...sessions]);
      setCurrentSession(data.session);
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await fetch(`/api/ai/sessions/${sessionId}`, { method: "DELETE" });
      setSessions(sessions.filter((s) => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/ai/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await response.json();
      setSessions(sessions.map((s) => (s.id === sessionId ? data.session : s)));
      if (currentSession?.id === sessionId) {
        setCurrentSession(data.session);
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const sendMessage = async (messageText?: string) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    // Vytvoř novou session pokud neexistuje
    if (!currentSession) {
      await createNewSession();
      // Počkej na vytvoření session
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    // Aktualizuj UI okamžitě
    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    const updatedSession = {
      ...currentSession!,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
    };
    setCurrentSession(updatedSession);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Zavolej AI API
      const response = await fetch("/api/ai/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          conversationHistory: updatedMessages,
          sessionId: currentSession?.id,
        }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: data.message,
        timestamp: data.timestamp,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      const finalSession = {
        ...updatedSession,
        messages: finalMessages,
      };

      setCurrentSession(finalSession);

      // Ulož do databáze
      await fetch(`/api/ai/sessions/${currentSession?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: finalMessages }),
      });

      // Aktualizuj title podle první zprávy
      if (updatedMessages.length === 1) {
        const autoTitle = message.slice(0, 50) + (message.length > 50 ? "..." : "");
        await updateSessionTitle(currentSession!.id, autoTitle);
      }

      loadSessions();
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className={`relative min-h-screen flex ${
        isDark ? "bg-black text-white" : palette.page
      }`}
    >
      {!isDark && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px",
          }}
        />
      )}

      {/* Sidebar - Historie konverzací */}
      {showSidebar && (
        <div
          className={`w-80 border-r flex-shrink-0 flex flex-col ${
            isDark ? "bg-black/40 border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <div className="p-4 border-b border-white/10">
            <button
              onClick={createNewSession}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                isDark
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                  : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white"
              }`}
            >
              <Plus className="w-5 h-5" />
              Nová konverzace
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sessions.length === 0 ? (
              <div className={`text-center py-8 ${isDark ? "text-white/50" : "text-slate-400"}`}>
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Žádné konverzace</p>
                <p className="text-xs mt-1">Začni novou konverzaci</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setCurrentSession(session)}
                  className={`group p-3 rounded-lg cursor-pointer transition-all ${
                    currentSession?.id === session.id
                      ? isDark
                        ? "bg-white/10 border border-white/20"
                        : "bg-indigo-50 border border-indigo-200"
                      : isDark
                      ? "hover:bg-white/5 border border-transparent"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-semibold mb-1 truncate ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {session.title}
                      </h3>
                      <div className={`flex items-center gap-2 text-xs ${isDark ? "text-white/50" : "text-slate-500"}`}>
                        <Clock className="w-3 h-3" />
                        {new Date(session.updatedAt).toLocaleDateString("cs-CZ")}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-all ${
                        isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-slate-200 text-slate-500"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div
          className={`p-6 border-b ${
            isDark ? "bg-black/40 border-white/10" : "bg-white border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isDark ? "bg-violet-500/10" : "bg-indigo-100"}`}>
                <Sparkles className={`w-6 h-6 ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  AI Brainstorming
                </h1>
                <p className={isDark ? "text-white/60" : "text-slate-600"}>
                  Tvůj osobní AI asistent pro tvorbu obsahu
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {!currentSession ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className={`inline-flex p-6 rounded-2xl mb-6 ${isDark ? "bg-violet-500/10" : "bg-indigo-100"}`}>
                  <Sparkles className={`w-16 h-16 ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
                </div>
                <h2 className={`text-3xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                  Ahoj! Jsem tvůj AI asistent 👋
                </h2>
                <p className={`text-lg ${isDark ? "text-white/70" : "text-slate-600"}`}>
                  Pomůžu ti s nápady na obsah, psaním captionů, content plánem a mnohem víc
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      createNewSession().then(() => {
                        setTimeout(() => sendMessage(prompt.prompt), 200);
                      });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10"
                        : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isDark ? "bg-violet-500/20 text-violet-400" : "bg-indigo-100 text-indigo-600"}`}>
                        {prompt.icon}
                      </div>
                      <span className={`font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                        {prompt.text}
                      </span>
                    </div>
                    <p className={`text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                      {prompt.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {currentSession.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-violet-500/20" : "bg-indigo-100"}`}>
                      <Sparkles className={`w-5 h-5 ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? isDark
                          ? "bg-violet-600 text-white"
                          : "bg-indigo-600 text-white"
                        : isDark
                        ? "bg-white/10 text-white"
                        : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div
                      className={`text-xs mt-2 ${
                        message.role === "user"
                          ? "text-white/70"
                          : isDark
                          ? "text-white/50"
                          : "text-slate-500"
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString("cs-CZ", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
                      <span className="font-semibold">👤</span>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? "bg-violet-500/20" : "bg-indigo-100"}`}>
                    <Sparkles className={`w-5 h-5 ${isDark ? "text-violet-400" : "text-indigo-600"}`} />
                  </div>
                  <div className={`p-4 rounded-2xl ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                    <div className="flex gap-2">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-violet-400" : "bg-indigo-600"}`} style={{ animationDelay: "0ms" }} />
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-violet-400" : "bg-indigo-600"}`} style={{ animationDelay: "150ms" }} />
                      <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? "bg-violet-400" : "bg-indigo-600"}`} style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        {currentSession && (
          <div
            className={`p-6 border-t ${
              isDark ? "bg-black/40 border-white/10" : "bg-white border-slate-200"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <div className={`flex gap-3 p-3 rounded-xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"}`}>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Napiš svou zprávu nebo otázku..."
                  rows={1}
                  className={`flex-1 bg-transparent border-none outline-none resize-none ${
                    isDark ? "text-white placeholder:text-white/50" : "text-slate-900 placeholder:text-slate-400"
                  }`}
                  style={{ minHeight: "24px", maxHeight: "120px" }}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`p-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDark
                      ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white"
                      : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 text-white"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className={`text-xs mt-2 text-center ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Enter = odeslat • Shift + Enter = nový řádek
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import WelcomeCard from "./components/WelcomeCard";
import EscalationBanner from "./components/EscalationBanner";
import InputArea from "./components/InputArea";

function generateSessionId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [startedAt] = useState(() => new Date());
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || inputValue).trim();
    if (!trimmed || isTyping) return;

    setInputValue("");
    setError(null);

    const userMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const history = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const BASE_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          history,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      setIsTyping(false);

      const aiMessage = {
        id: data.messageId || `ai_${Date.now()}`,
        role: "assistant",
        content: data.reply,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (data.escalated) {
        setEscalated(true);
      }
    } catch (err) {
      setIsTyping(false);
      setError(err.message || "Failed to connect to server. Make sure the backend is running.");

      const errorMessage = {
        id: `err_${Date.now()}`,
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your connection and try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  }, [inputValue, isTyping, messages, sessionId]);

  const handleQuickAction = useCallback((message) => {
    sendMessage(message);
  }, [sendMessage]);

  const handleClose = useCallback(() => {
    setMessages([]);
    setEscalated(false);
    setError(null);
    setSearchOpen(false);
    setSearchQuery("");
    setInputValue("");
  }, []);

  const handleFileAttach = useCallback((fileName) => {
    sendMessage(`[PDF attached: ${fileName}]`);
  }, [sendMessage]);

  const filteredMessages = searchQuery
    ? messages.filter((m) =>
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const isFirstMessage = messages.length === 0;

  return (
    <>
      {/* Minimized widget */}
      {minimized && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setMinimized(false)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-2xl shadow-xl hover:scale-110 transition-transform"
            title="Open chat"
          >
            🤖
          </button>
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {messages.filter((m) => m.role === "user").length}
            </span>
          )}
        </div>
      )}

      {/* Main chat */}
      {!minimized && (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
          <Sidebar
            sessionId={sessionId}
            startedAt={startedAt}
            escalated={escalated}
          />

          <main className="flex-1 flex flex-col min-w-0 bg-white">
            <Navbar
              escalated={escalated}
              onClose={handleClose}
              onMinimize={() => setMinimized(true)}
              onSearchToggle={() => setSearchOpen((v) => !v)}
              searchOpen={searchOpen}
            />

            {/* Search bar */}
            {searchOpen && (
              <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50 flex items-center gap-2 animate-fade-in-up">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-slate-400 flex-shrink-0">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
                {searchQuery && (
                  <span className="text-xs text-slate-400">
                    {filteredMessages.length} result{filteredMessages.length !== 1 ? "s" : ""}
                  </span>
                )}
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-lg leading-none ml-1"
                >
                  ×
                </button>
              </div>
            )}

            <EscalationBanner show={escalated} />

            {error && (
              <div className="mx-4 mt-2 animate-fade-in-up">
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 flex items-center gap-3">
                  <span className="text-red-500 text-sm">⚠️</span>
                  <p className="text-red-600 text-xs flex-1">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto"
              style={{ background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)" }}
            >
              {isFirstMessage ? (
                <WelcomeCard onQuickAction={handleQuickAction} />
              ) : (
                <div className="py-4 space-y-1">
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-slate-200/70 text-slate-500 text-xs font-medium px-3 py-1 rounded-full">
                      Today
                    </div>
                  </div>

                  {searchQuery && filteredMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 opacity-40">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <p className="text-sm">No messages match &ldquo;{searchQuery}&rdquo;</p>
                    </div>
                  ) : (
                    filteredMessages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={
                          searchQuery
                            ? { ...msg, highlight: searchQuery }
                            : msg
                        }
                        escalated={escalated && msg.role === "assistant"}
                      />
                    ))
                  )}

                  {!searchQuery && isTyping && <TypingIndicator />}

                  <div ref={messagesEndRef} className="h-2" />
                </div>
              )}
            </div>

            <InputArea
              value={inputValue}
              onChange={setInputValue}
              onSend={() => sendMessage()}
              onFileAttach={handleFileAttach}
              disabled={isTyping}
            />
          </main>
        </div>
      )}
    </>
  );
}

function Navbar({ escalated, onClose, onMinimize, onSearchToggle, searchOpen }) {
  return (
    <header className="flex items-center justify-between px-5 py-3.5 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-400">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-electric-500 to-electric-700 flex items-center justify-center text-base shadow-sm shadow-blue-500/20">
            🤖
          </div>
          <div>
            <h2 className="text-slate-800 font-semibold text-sm leading-tight">Customer Support</h2>
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${escalated ? "bg-orange-400" : "bg-emerald-400"}`} />
              <span className={`text-xs font-medium ${escalated ? "text-orange-500" : "text-emerald-500"}`}>
                {escalated ? "Transferring to agent" : "Aria is online"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearchToggle}
          className={`nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${searchOpen ? "text-blue-500 bg-blue-50" : "text-slate-400"}`}
          title="Search messages"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
        <button
          onClick={onMinimize}
          className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-400"
          title="Minimize"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={onClose}
          className="nav-icon-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400"
          title="Close chat"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}

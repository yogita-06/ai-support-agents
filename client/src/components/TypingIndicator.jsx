import React from "react";

export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-fade-in-up px-4 py-1">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-500 to-electric-700 flex items-center justify-center text-sm shadow-md flex-shrink-0 mb-0.5">
        🤖
      </div>

      {/* Bubble */}
      <div className="message-bubble-ai px-4 py-3 flex items-center gap-1.5">
        <div
          className="w-2 h-2 bg-slate-400 rounded-full"
          style={{ animation: "bounceDot 1.4s infinite ease-in-out 0s" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full"
          style={{ animation: "bounceDot 1.4s infinite ease-in-out 0.2s" }}
        />
        <div
          className="w-2 h-2 bg-slate-400 rounded-full"
          style={{ animation: "bounceDot 1.4s infinite ease-in-out 0.4s" }}
        />
      </div>
    </div>
  );
}

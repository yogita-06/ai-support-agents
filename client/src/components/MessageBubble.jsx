import React from "react";

function formatTime(isoString) {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message, escalated }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-1 animate-fade-in-up">
        <div className="flex flex-col items-end max-w-[75%]">
          <div className="message-bubble-user px-4 py-3">
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap text-shadow-sm">
              {message.content}
            </p>
          </div>
          <span className="text-slate-400 text-[11px] mt-1 px-1">{formatTime(message.timestamp)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 px-4 py-1 animate-fade-in-up">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-500 to-electric-700 flex items-center justify-center text-sm shadow-md flex-shrink-0 mb-4">
        🤖
      </div>

      <div className="flex flex-col max-w-[75%]">
        {escalated && (
          <span className="text-xs text-orange-400 font-medium mb-1 flex items-center gap-1">
            <span>🔴</span> Aria — Transferring to Human Agent
          </span>
        )}
        {!escalated && (
          <span className="text-xs text-slate-400 font-medium mb-1">Aria</span>
        )}
        <div className="message-bubble-ai px-4 py-3">
          <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span className="text-slate-400 text-[11px] mt-1 px-1">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

import React from "react";

const features = [
  { icon: "⚡", label: "Instant Replies", desc: "Responses in < 1 second" },
  { icon: "🔒", label: "Secure Chat", desc: "End-to-end encrypted" },
  { icon: "🌙", label: "24/7 Available", desc: "Always here to help" },
];

export default function Sidebar({ sessionId, startedAt, escalated }) {
  const statusColor = escalated ? "text-orange-400" : "text-emerald-400";
  const statusLabel = escalated ? "Escalated" : "Active";
  const statusBg = escalated ? "bg-orange-400/20 border-orange-400/30" : "bg-emerald-400/20 border-emerald-400/30";

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <aside className="sidebar-bg flex flex-col h-full w-[280px] min-w-[280px] border-r border-white/[0.06]">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-electric-700 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
            🤖
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">SupportAI</h1>
            <p className="text-slate-400 text-xs font-medium">Help Center</p>
          </div>
        </div>
      </div>

      {/* AI Status */}
      <div className="px-5 mb-5">
        <div className={`glass-card px-4 py-3 flex items-center gap-3 ${escalated ? "border-orange-500/20" : "border-emerald-500/20"}`}
          style={{ background: escalated ? "rgba(249,115,22,0.07)" : "rgba(52,211,153,0.07)" }}>
          <div className="relative flex-shrink-0">
            <div className={`w-2.5 h-2.5 rounded-full ${escalated ? "bg-orange-400" : "bg-emerald-400"} pulse-glow`} />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              {escalated ? "Human Agent" : "AI Online"}
            </p>
            <p className={`text-xs font-medium ${escalated ? "text-orange-300" : "text-emerald-300"}`}>
              {escalated ? "Connecting..." : "Ready to help"}
            </p>
          </div>
        </div>
      </div>

      {/* Session Info Card */}
      <div className="px-5 mb-5">
        <div className="glass-card px-4 py-4 space-y-3">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2">Session Info</p>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs">Session ID</span>
            <span className="text-slate-300 text-xs font-mono font-medium bg-white/5 px-2 py-0.5 rounded-md">
              {sessionId}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs">Started</span>
            <span className="text-slate-300 text-xs font-medium">{formatTime(startedAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-xs">Status</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusBg} ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-5 mb-5 flex-1">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Features</p>
        <div className="space-y-1">
          {features.map((f) => (
            <div key={f.label}
              className="sidebar-feature-item flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-default">
              <span className="text-lg w-7 text-center flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-white text-sm font-medium leading-tight">{f.label}</p>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/[0.06] mb-4" />

      {/* Powered by badge */}
      <div className="px-5 pb-6">
        <div className="glass-card px-4 py-3 text-center">
          <p className="text-slate-500 text-xs mb-1">Powered by</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs">
              ⚡
            </div>
            <span className="text-slate-300 text-sm font-semibold">Groq LLaMA</span>
          </div>
          <p className="text-slate-600 text-xs mt-1">llama-3.3-70b-versatile</p>
        </div>
      </div>
    </aside>
  );
}

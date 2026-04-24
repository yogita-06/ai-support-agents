import React from "react";

const quickActions = [
  { icon: "🛍️", label: "Order Status", message: "I need help checking my order status" },
  { icon: "💳", label: "Billing Issue", message: "I have a billing issue I need help with" },
  { icon: "🔧", label: "Technical Support", message: "I need technical support" },
];

export default function WelcomeCard({ onQuickAction }) {
  return (
    <div className="flex items-center justify-center h-full px-6">
      <div className="text-center max-w-md w-full animate-fade-in-up">
        {/* Robot icon */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-electric-500 via-blue-500 to-electric-700 flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-blue-500/30">
            🤖
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-glow" />
          </div>
        </div>

        {/* Greeting */}
        <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
          Hello! I'm{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-500 to-blue-600">
            Aria
          </span>
        </h2>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          Your AI Support Assistant — here to help you 24/7.
          <br />
          What can I help you with today?
        </p>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onQuickAction(action.message)}
              className="quick-action-btn flex items-center gap-2.5 px-5 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-electric-400 hover:bg-blue-50 group transition-colors"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-slate-700 text-sm font-semibold group-hover:text-electric-600 whitespace-nowrap">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-slate-400 text-xs mt-8 flex items-center justify-center gap-2">
          <span className="inline-block w-8 h-px bg-slate-200" />
          or type your question below
          <span className="inline-block w-8 h-px bg-slate-200" />
        </p>
      </div>
    </div>
  );
}

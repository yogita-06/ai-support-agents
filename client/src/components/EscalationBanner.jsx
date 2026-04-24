import React, { useState, useEffect } from "react";

export default function EscalationBanner({ show }) {
  const [waitTime, setWaitTime] = useState(2);

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setWaitTime((prev) => (prev > 0 ? prev - 0.5 : 0));
    }, 30000);
    return () => clearInterval(interval);
  }, [show]);

  if (!show) return null;

  return (
    <div className="animate-slide-down overflow-hidden">
      <div className="mx-4 mt-3 mb-1 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500/90 to-red-500/90 backdrop-blur-sm border border-orange-400/30 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-sm">🔴</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">
                Connecting you to a human agent
              </p>
              <p className="text-orange-100 text-xs mt-0.5">
                Average wait time:{" "}
                <span className="font-bold">
                  {waitTime > 0 ? `~${waitTime} min${waitTime !== 1 ? "s" : ""}` : "any moment now"}
                </span>
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-white/60 rounded-full"
                    style={{ animation: `bounceDot 1.4s infinite ease-in-out ${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

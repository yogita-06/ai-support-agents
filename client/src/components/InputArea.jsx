import React, { useRef, useEffect } from "react";

export default function InputArea({ value, onChange, onSend, onFileAttach, disabled }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileAttach?.(file.name);
    }
    e.target.value = "";
  };

  return (
    <div className="border-t border-slate-100 bg-white px-4 py-3">
      <div className="flex items-end gap-3">
        {/* Hidden PDF file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Paperclip — triggers PDF upload */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors mb-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach PDF"
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>

        {/* Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Type your message..."
            className="input-field w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 bg-slate-50 leading-relaxed disabled:opacity-60"
            style={{ minHeight: "42px", maxHeight: "120px" }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="send-btn flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-0.5"
          title="Send message"
          type="button"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="text-slate-400 text-[11px] text-center mt-2.5 leading-none">
        Press <kbd className="font-semibold bg-slate-100 rounded px-1 py-0.5 text-slate-500">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="font-semibold bg-slate-100 rounded px-1 py-0.5 text-slate-500">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          800: "#1e2d4a",
          900: "#0F172A",
          950: "#080f1d",
        },
        electric: {
          400: "#60a5fa",
          500: "#3B82F6",
          600: "#2563eb",
          700: "#1D4ED8",
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.35s ease-out forwards",
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out",
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-down": "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.4" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(31, 38, 135, 0.25)",
        message: "0 2px 8px rgba(0,0,0,0.08)",
        "message-user": "0 2px 12px rgba(59, 130, 246, 0.35)",
      },
    },
  },
  plugins: [],
};

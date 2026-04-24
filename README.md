<div align="center">

# 🤖 SupportAI — AI Customer Support Agent

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

**A production-ready AI customer support chat agent powered by Groq's LLaMA 3.3-70B, with auto-escalation detection, real-time email alerts, and a polished Intercom-style UI.**

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI-Powered Chat** | Driven by Groq's LLaMA-3.3-70B — sub-second responses |
| ⌨️ **Typing Indicator** | Animated dots show when the AI is generating a reply |
| 🔴 **Auto Escalation Detection** | 16 trigger keywords instantly route to human agents |
| 📧 **Email Alerts** | Nodemailer + Gmail SMTP fires once per escalation event |
| 💬 **Intercom-Style UI** | Clean sidebar, message bubbles, quick-action cards |
| ⚡ **Quick Action Buttons** | One-click prompts on the welcome screen |
| 🕓 **Conversation History** | Last 10 messages sent as context on every request |
| 📱 **Mobile Responsive** | Fluid layout works on any screen size |
| 🔔 **Toast Notifications** | Red banner for errors, orange banner for escalations |
| 🔍 **Message Search** | Search bar filters messages live by keyword |
| 📎 **PDF Attach** | Attach a PDF and send its name as a chat message |
| 🔕 **Minimize / Close** | Collapse to a floating bubble or reset to welcome screen |

---

## 🖥️ Tech Stack

### Frontend
- **[React 18](https://react.dev)** — Component-based UI
- **[Vite 5](https://vitejs.dev)** — Lightning-fast dev server & build tool
- **[Tailwind CSS 3.4](https://tailwindcss.com)** — Utility-first styling
- Custom keyframe animations (fade-in, slide-up, typing pulse)

### Backend
- **[Node.js](https://nodejs.org)** — JavaScript runtime
- **[Express.js](https://expressjs.com)** — REST API server
- **[dotenv](https://github.com/motdotla/dotenv)** — Environment variable management

### AI & Integrations
- **[Groq API](https://groq.com)** — Ultra-fast LLM inference
- **[LLaMA-3.3-70B-Versatile](https://groq.com/models)** — The underlying language model
- **[Nodemailer](https://nodemailer.com)** — Email delivery via Gmail SMTP

---

## 📁 Project Structure

```
ai-agents/
│
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EscalationBanner.jsx   # Orange alert strip on escalation
│   │   │   ├── InputArea.jsx          # Textarea + paperclip + send button
│   │   │   ├── MessageBubble.jsx      # Individual chat message
│   │   │   ├── Sidebar.jsx            # Left panel — session info & status
│   │   │   ├── TypingIndicator.jsx    # Animated "AI is typing" dots
│   │   │   └── WelcomeCard.jsx        # First-load quick-action screen
│   │   ├── App.jsx                    # Root — state, Navbar, layout
│   │   ├── index.css                  # Tailwind directives + custom CSS
│   │   └── main.jsx                   # React DOM entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js                 # Dev server (port 3000) + API proxy
│
├── server/                        # Express backend
│   ├── index.js                       # API routes, Groq client, email logic
│   ├── .env                           # Your secrets (never commit this)
│   ├── .env.example                   # Template for environment variables
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org) **v18 or higher**
- [npm](https://www.npmjs.com) **v9 or higher**
- A **Groq API key** (free) — [console.groq.com](https://console.groq.com)
- A **Gmail App Password** — see [step 4](#4-gmail-app-password) below

---

### 1. Clone the Repository

```bash
git clone https://github.com/yogita-06/ai-agents.git
cd ai-agents
```

### 2. Install Dependencies

Install both the server and client packages:

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Configure Environment Variables

Copy the example file and fill in your credentials:

```bash
cd server
cp .env.example .env
```

Open `server/.env` and set the values:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
NODE_ENV=development

EMAIL_USER=jhayogita06@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

### 4. Get Your Groq API Key

1. Visit [console.groq.com](https://console.groq.com) and sign up (it's free)
2. Go to **API Keys → Create API Key**
3. Copy the key and paste it as `GROQ_API_KEY` in your `.env`

> Groq offers a generous free tier with very fast inference — no credit card required.

---

### 5. Get a Gmail App Password

> **Why App Password?** Google blocks regular passwords for third-party apps. App Passwords are account-specific tokens that bypass this safely.

1. Enable **2-Factor Authentication** on your Google account
   - `myaccount.google.com → Security → 2-Step Verification`
2. Generate an App Password
   - `myaccount.google.com/apppasswords`
   - App name: `SupportAI` → click **Create**
3. Copy the 16-character password (spaces are optional)
4. Paste it as `EMAIL_PASS` in your `.env`

---

### 6. Run the Project

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# → Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# → App running on http://localhost:3000
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser. 🎉

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|:---:|
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) | ✅ Yes |
| `PORT` | Port for the Express server (default: `5000`) | ❌ Optional |
| `NODE_ENV` | `development` or `production` | ❌ Optional |
| `EMAIL_USER` | Gmail address that sends escalation alerts | ⚠️ Email only |
| `EMAIL_PASS` | 16-character Gmail App Password | ⚠️ Email only |

> The app runs fully without email credentials — escalation still works in the UI, the email step is simply skipped with a console warning.

---

## 💡 How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        SUPPORTAI FLOW                           │
└─────────────────────────────────────────────────────────────────┘

  👤 User types a message
        │
        ▼
  ┌───────────────┐
  │  React Client │  Sends { message, sessionId, history[] }
  │  (port 3000)  │  via POST /api/chat
  └───────┬───────┘
          │
          ▼
  ┌───────────────────────────────────────┐
  │         Express Server (port 5000)    │
  │                                       │
  │  1. Validate & trim input             │
  │  2. Run detectEscalation()            │
  │     → checks 16 trigger keywords     │
  │  3. Build message array with history  │
  └───────────────┬───────────────────────┘
                  │
                  ▼
  ┌───────────────────────┐
  │      Groq API         │
  │  LLaMA-3.3-70B        │  ← System prompt defines Aria's personality
  │  (LLM inference)      │
  └──────────┬────────────┘
             │  reply text
             ▼
  ┌──────────────────────────────────────────┐
  │  Escalation detected?                    │
  │                                          │
  │  YES → Append 🔴 message to reply        │
  │      → Check escalatedSessions Set       │
  │          First time? → sendEmail()  ───► Gmail SMTP
  │          Already sent? → skip            │
  │                                          │
  │  NO  → Return reply as-is                │
  └──────────────────────┬───────────────────┘
                         │
                         ▼
  ┌───────────────┐
  │  React Client │  Renders MessageBubble, updates UI state,
  │               │  shows EscalationBanner if escalated === true
  └───────────────┘
```

---

## 🎯 Use Cases

SupportAI is designed to drop into any customer-facing workflow:

- 🛒 **E-commerce stores** — Handle order tracking, returns, and refund requests
- 💻 **SaaS companies** — Answer product questions and route billing issues
- 🏥 **Healthcare clinics** — Appointment inquiries and FAQ deflection
- 🎓 **Educational institutes** — Admission questions and course guidance
- 🏠 **Real estate agencies** — Property queries and lead qualification

---

## 📸 Screenshots

> _Add your screenshots here by replacing the placeholders below._

| Welcome Screen | Active Chat | Escalation Alert |
|:---:|:---:|:---:|
| ![Welcome](docs/screenshots/welcome.png) | ![Chat](docs/screenshots/chat.png) | ![Escalation](docs/screenshots/escalation.png) |

---

## 🛠️ Customization

### Change the AI Personality

Edit the `SYSTEM_PROMPT` constant in `server/index.js`:

```js
const SYSTEM_PROMPT = `You are a friendly assistant named Nova for Acme Corp.
- Respond in a casual, upbeat tone
- Keep answers under 3 sentences
- Always offer to connect customers with a specialist`;
```

Restart the server — the new personality applies to all new sessions immediately.

---

### Add or Remove Escalation Keywords

Find the `ESCALATION_KEYWORDS` array in `server/index.js` and edit freely:

```js
const ESCALATION_KEYWORDS = [
  "human", "agent", "urgent", "frustrated",
  "complaint", "refund", "cancel", "not working",
  // ✏️ Add your own keywords below
  "overcharged", "scam", "lawsuit", "chargeback",
];
```

---

### Change the Alert Email Recipient

By default the alert goes to `EMAIL_USER` (sender = recipient). To send to a different address, update `sendEscalationEmail` in `server/index.js`:

```js
await mailer.sendMail({
  from: `"SupportAI Alert" <${process.env.EMAIL_USER}>`,
  to: "your-support-team@company.com",   // ← change this
  ...
});
```

---

## 📄 License

This project is licensed under the **MIT License** — you're free to use, modify, and distribute it for personal or commercial purposes.

```
MIT License

Copyright (c) 2026 Yogita Jha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🙋‍♀️ Author

<div align="center">

**Yogita Jha**

[![GitHub](https://img.shields.io/badge/GitHub-yogita--06-181717?style=for-the-badge&logo=github)](https://github.com/yogita-06)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Yogita_Jha-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/yogita-jha)
[![Email](https://img.shields.io/badge/Email-jhayogita06%40gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jhayogita06@gmail.com)

_If this project helped you, consider giving it a ⭐ on GitHub!_

</div>

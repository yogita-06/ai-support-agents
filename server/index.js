require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("crypto").webcrypto
  ? (() => {
      const { randomUUID } = require("crypto");
      return { v4: randomUUID };
    })()
  : { v4: () => Math.random().toString(36).slice(2) };

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Nodemailer setup ---
const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Track which sessions have already triggered an escalation email
const escalatedSessions = new Set();

async function sendEscalationEmail({ sessionId, customerMessage, timestamp }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER / EMAIL_PASS not set — skipping escalation email.");
    return;
  }

  const formattedTime = new Date(timestamp).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "full",
    timeStyle: "short",
  });

  await mailer.sendMail({
    from: `"SupportAI Alert" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "🔴 New Escalation Alert — Customer Needs Help!",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#ef4444,#dc2626);padding:24px 28px;">
          <h2 style="margin:0;color:#fff;font-size:20px;">🔴 Escalation Alert</h2>
          <p style="margin:6px 0 0;color:#fecaca;font-size:13px;">A customer requires immediate human assistance</p>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:140px;">
                <span style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;">Session ID</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                <code style="background:#f8fafc;padding:2px 8px;border-radius:4px;font-size:13px;color:#1e293b;">${sessionId}</code>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;">Timestamp</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${formattedTime}</td>
            </tr>
          </table>

          <div style="margin-top:20px;">
            <p style="font-size:12px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.05em;margin:0 0 8px;">Customer's Last Message</p>
            <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px 16px;border-radius:0 8px 8px 0;">
              <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;">${customerMessage}</p>
            </div>
          </div>

          <div style="margin-top:24px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;font-size:13px;color:#92400e;">
              ⚡ <strong>Action required:</strong> Please respond to this customer immediately.
            </p>
          </div>
        </div>
        <div style="background:#f8fafc;padding:14px 28px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">Sent automatically by SupportAI · Do not reply to this email</p>
        </div>
      </div>
    `,
  });

  console.log(`📧 Escalation email sent for session ${sessionId}`);
}

const ESCALATION_KEYWORDS = [
  "human",
  "agent",
  "urgent",
  "frustrated",
  "complaint",
  "refund",
  "cancel",
  "not working",
  "broken",
  "angry",
  "speak to someone",
  "real person",
  "manager",
  "supervisor",
  "terrible",
  "awful",
  "disgusting",
  "unacceptable",
];

const SYSTEM_PROMPT = `You are a professional, empathetic AI customer support agent for a SaaS company called SupportAI. Your name is Aria.

Guidelines:
- Keep responses concise (2-3 sentences max)
- Be warm, professional, and solution-focused
- Use a friendly but professional tone
- If the customer is frustrated or needs human help, acknowledge their concern warmly and inform them a human agent will assist shortly
- For order/billing questions, ask for their order ID or account email to look up details
- For technical issues, ask clarifying questions to better diagnose the problem
- Always end with a helpful follow-up question or offer further assistance`;

function detectEscalation(message) {
  const lower = message.toLowerCase();
  return ESCALATION_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function generateMessageId() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// Conversation history store (in-memory, keyed by sessionId)
const sessions = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId, history = [] } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmedMessage = message.trim();
    const escalated = detectEscalation(trimmedMessage);

    // Build conversation history for context
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...history.slice(-10).map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: trimmedMessage },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 256,
      top_p: 0.9,
    });

    let reply = chatCompletion.choices[0]?.message?.content || "I apologize, I'm having trouble responding right now. Please try again.";

    // If escalation detected, append escalation message
    if (escalated) {
      reply = `${reply}\n\n🔴 I can see this needs immediate attention. I'm connecting you with a human agent who will join shortly to assist you further.`;
    }

    const responseTimestamp = new Date().toISOString();

    // Send email alert once per session on first escalation
    if (escalated && sessionId && !escalatedSessions.has(sessionId)) {
      escalatedSessions.add(sessionId);
      sendEscalationEmail({
        sessionId,
        customerMessage: trimmedMessage,
        timestamp: responseTimestamp,
      }).catch((err) => console.error("❌ Failed to send escalation email:", err.message));
    }

    return res.json({
      reply,
      escalated,
      timestamp: responseTimestamp,
      messageId: generateMessageId(),
      sessionId: sessionId || generateMessageId(),
    });
  } catch (error) {
    console.error("Chat API Error:", error?.message || error);

    if (error?.status === 401) {
      return res.status(401).json({ error: "Invalid API key. Please check your GROQ_API_KEY." });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment and try again." });
    }

    return res.status(500).json({
      error: "An unexpected error occurred. Please try again.",
      details: process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), service: "SupportAI Backend" });
});

app.listen(PORT, () => {
  console.log(`\n🚀 SupportAI Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});

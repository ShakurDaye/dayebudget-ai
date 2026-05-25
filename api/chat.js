export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return res.status(500).json({ 
      content: "AI is not configured yet. Please add your GROQ_API_KEY to Vercel environment variables." 
    });
  }

  // Fraud/scam topic filter
  const bannedTopics = ["fraud","scam","identity theft","fake","illegal","money laundering","hack","steal","counterfeit","cheat","embezzle","forgery","fake document","evade","tax evasion"];
  const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
  const isBanned = bannedTopics.some(t => lastUserMsg.includes(t));

  if (isBanned) {
    return res.json({ 
      content: "I can't help with fraud, scams, or illegal financial activity. 🚫\n\nI can help you build a legal budget, save money legitimately, pay down debt, and protect yourself FROM scams. What would you like help with?" 
    });
  }

  const systemPrompt = `You are DayeBudget AI, a friendly, knowledgeable, and honest personal finance assistant for the DayeBudget AI app. 

Your role: Help users budget smarter, save more, pay off debt, understand bills, and learn personal finance basics.

Guidelines:
- Give practical, realistic advice with real numbers and strategies
- Be encouraging but honest — don't sugarcoat bad financial habits
- Use emojis occasionally to be friendly
- Keep responses concise (2-4 paragraphs)
- NEVER help with fraud, scams, identity theft, or illegal activity
- Always end investment-related advice with: "⚠️ AI advice is educational only — not professional financial advice."

${context ? `User's financial context: ${context}` : ""}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-10), // last 10 messages for context
        ],
        max_tokens: 700,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq API error:", err);
      return res.status(500).json({ content: "AI service temporarily unavailable. Please try again in a moment." });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
    
    return res.json({ content });

  } catch (error) {
    console.error("Chat API error:", error);
    return res.status(500).json({ 
      content: "Connection issue — please try again.\n\nQuick tip while you wait: The foundation of any good budget is knowing your income vs. your total monthly expenses. Try listing them both out! 💡" 
    });
  }
}

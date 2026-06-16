export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { messages, bizName, bizContent } = req.body || {};
  if (!messages) return res.status(400).json({ error: "Messages are required" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Server configuration error" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        system: `You are a friendly AI assistant for ${bizName || "this business"}. Business info: ${bizContent || "A local business"}. Keep replies short (2-3 sentences max), helpful, warm, and conversational. Always offer to help with booking, services, or questions.`,
        messages,
      }),
    });
    const data = await r.json();
    if (data?.content?.[0]?.text) return res.status(200).json({ reply: data.content[0].text });
    throw new Error(data?.error?.message || "Claude API error");
  } catch (err) {
    return res.status(500).json({ error: err.message || "Chat error" });
  }
}

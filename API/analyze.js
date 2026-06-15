export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { url, bizName } = req.body || {};
  if (!url) return res.status(400).json({ error: "URL is required" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Server configuration error" });

  let pageText = "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ShockWaveBot/1.0)" },
    });
    clearTimeout(timeout);
    const html = await response.text();
    pageText = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000);
  } catch (err) {
    return res.status(400).json({ error: "Could not fetch that website. Check the URL or try another." });
  }

  if (!pageText || pageText.length < 80) {
    return res.status(400).json({ error: "Website returned too little content. Try another URL." });
  }

  async function callClaude(system, messages, maxTokens = 500) {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });
    const data = await r.json();
    if (data?.content?.[0]?.text) return data.content[0].text;
    throw new Error(data?.error?.message || "Claude API error");
  }

  let summary, extractedName;
  try {
    summary = await callClaude(
      "You are a business analyst. Extract key business info from website text. Return a concise 150-word summary covering: business name, services offered, location, unique selling points, and tone.",
      [{ role: "user", content: `Website text: ${pageText}\n\nExtract the business name and write a 150-word summary.` }],
      400
    );
    const nameMatch = summary.match(/(?:business(?::\s*|\s+)name)?(?::\s*|\s+called[\s:]+|(?:^|\n))([A-Z][^\n,.]{2,40}) is/im);
    extractedName = nameMatch ? nameMatch[1].trim() : bizName || "Your Business";
    if (!extractedName || extractedName.length < 2) extractedName = bizName || "Your Business";
  } catch (err) {
    return res.status(500).json({ error: "Failed to analyze the website. Please try again." });
  }

  let welcomeMessage;
  try {
    welcomeMessage = await callClaude(
      `You are a friendly AI assistant for ${extractedName}. Business info: ${summary}. Keep replies short (2-3 sentences max), helpful, warm, and conversational.`,
      [{ role: "user", content: "Generate a short, friendly welcome message for a new website visitor. Under 30 words. Be warm and specific to the business." }],
      100
    );
  } catch {
    welcomeMessage = `Hi there! Welcome to ${extractedName}. How can I help you today?`;
  }

  return res.status(200).json({ bizName: extractedName, bizContent: summary, welcomeMessage });
}

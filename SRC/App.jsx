import { useState, useRef, useEffect } from "react";

const S = {
  app: { minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", fontFamily: "'Inter', sans-serif", color: "#111" },
  topBar: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%", maxWidth: "900px", marginBottom: "40px", flexWrap: "wrap", gap: "16px" },
  logoWrap: { display: "flex", alignItems: "center", gap: "8px" },
  logoBolt: { fontSize: "28px", color: "#FF6200" },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "30px", letterSpacing: "3px", color: "#111" },
  logoAccent: { color: "#FF6200" },
  headlineBlock: { textAlign: "right" },
  headline: { fontSize: "20px", fontWeight: "800", color: "#111", marginBottom: "4px" },
  headlineSub: { fontSize: "14px", color: "#666" },
  headlineBizName: { fontWeight: "700", color: "#111" },
  tagline: { fontSize: "12px", letterSpacing: "3px", color: "#999", textTransform: "uppercase", marginBottom: "32px", textAlign: "center" },
  card: { background: "#fff", border: "1px solid #E5E5E5", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", marginBottom: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" },
  label: { fontSize: "11px", letterSpacing: "2px", color: "#FF6200", textTransform: "uppercase", fontWeight: "700", display: "block", marginBottom: "14px" },
  input: { width: "100%", background: "#FAFAFA", border: "1px solid #DDD", borderRadius: "10px", padding: "14px 16px", color: "#111", fontSize: "14px", outline: "none", marginBottom: "12px", fontFamily: "inherit" },
  btn: { width: "100%", background: "#FF6200", border: "none", borderRadius: "10px", padding: "16px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" },
  btnDisabled: { opacity: 0.4, cursor: "not-allowed" },
  status: { fontSize: "13px", color: "#FF6200", textAlign: "center", marginTop: "12px", minHeight: "20px" },
  sectionTitle: { fontSize: "11px", letterSpacing: "2px", color: "#FF6200", textTransform: "uppercase", fontWeight: "700", textAlign: "center", marginBottom: "16px" },
  bizInfoBox: { background: "#FAFAFA", border: "1px solid #EEE", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#666", lineHeight: "1.6", marginBottom: "16px", maxHeight: "80px", overflow: "hidden" },
  phoneWrap: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  phone: { width: "300px", height: "580px", background: "#111", borderRadius: "40px", border: "8px solid #1a1a1a", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.18)" },
  phoneHeader: { background: "linear-gradient(135deg, #111, #FF6200)", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #222" },
  phoneAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#fff", color: "#FF6200", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", flexShrink: 0 },
  phoneBizName: { fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 },
  phoneBizSub: { fontSize: "11px", color: "#ffd9b8", margin: 0 },
  phoneDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", marginLeft: "auto" },
  chatArea: { flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px", background: "#fff" },
  msgBot: { background: "#F3F3F3", borderRadius: "12px 12px 12px 4px", padding: "10px 12px", fontSize: "13px", color: "#111", maxWidth: "85%", alignSelf: "flex-start", lineHeight: "1.5" },
  msgUser: { background: "#FF6200", borderRadius: "12px 12px 4px 12px", padding: "10px 12px", fontSize: "13px", color: "#fff", maxWidth: "85%", alignSelf: "flex-end", lineHeight: "1.5" },
  msgTime: { fontSize: "10px", color: "#999", marginTop: "2px" },
  phoneInputRow: { display: "flex", padding: "10px", gap: "8px", borderTop: "1px solid #eee", background: "#fff" },
  phoneInput: { flex: 1, background: "#F3F3F3", border: "1px solid #ddd", borderRadius: "20px", padding: "10px 14px", color: "#111", fontSize: "13px", outline: "none", fontFamily: "inherit" },
  sendBtn: { width: "36px", height: "36px", borderRadius: "50%", background: "#FF6200", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  poweredBy: { fontSize: "10px", color: "#bbb", textAlign: "center", padding: "6px", letterSpacing: "1px", background: "#fff" },
  resetBtn: { background: "transparent", border: "1px solid #DDD", borderRadius: "10px", padding: "12px 24px", color: "#666", fontSize: "13px", cursor: "pointer", marginTop: "8px", width: "100%", maxWidth: "420px" },
  ctaBox: { textAlign: "center", maxWidth: "360px", marginBottom: "16px" },
  ctaBtn: { display: "inline-block", background: "#FF6200", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: "50px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.5px", marginBottom: "16px" },
  footer: { marginTop: "40px", fontSize: "12px", color: "#bbb", letterSpacing: "1px", textTransform: "uppercase" },
};

const MAX_MESSAGES = 15; // cost control — caps Claude API calls per demo session
const LINK_LIFETIME_HOURS = 24; // demo link expires this many hours after first use

export default function MockMeAI() {
  const [step, setStep] = useState("input");
  const [url, setUrl] = useState("");
  const [bizName, setBizName] = useState("");
  const [bizContent, setBizContent] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [expired, setExpired] = useState(false);
  const chatRef = useRef(null);

  // Build a unique storage key per demo link so expiration tracking doesn't
  // collide across different prospects using the same deployed app.
  const linkKey = (() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get("url") || "";
    const n = params.get("name") || "";
    return `mockmeai_first_open_${u}_${n}`;
  })();

  // On load: check link params for auto-scrape, and check expiration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramUrl = params.get("url");
    const paramName = params.get("name");

    if (!paramUrl) return; // no params — show normal input screen

    // Check expiration — first time this exact link was opened
    const firstOpen = localStorage.getItem(linkKey);
    const now = Date.now();
    if (firstOpen) {
      const elapsedHours = (now - parseInt(firstOpen, 10)) / (1000 * 60 * 60);
      if (elapsedHours > LINK_LIFETIME_HOURS) {
        setExpired(true);
        return;
      }
    } else {
      localStorage.setItem(linkKey, String(now));
    }

    // Auto-load the demo for this business
    setUrl(decodeURIComponent(paramUrl));
    if (paramName) setBizName(decodeURIComponent(paramName.replace(/\+/g, " ")));
    autoScrape(decodeURIComponent(paramUrl), paramName ? decodeURIComponent(paramName.replace(/\+/g, " ")) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

  // Same scrape logic as handleScrape, but callable directly with explicit args
  // for the auto-load-from-URL case (state may not have updated yet).
  const autoScrape = async (scrapeUrl, scrapeName) => {
    if (!scrapeUrl.trim()) return;
    setStep("scraping");
    const statusSteps = ["Scanning your website...", "Analyzing business information...", "Building your AI chatbot..."];
    let i = 0;
    setStatusMsg(statusSteps[0]);
    const timer = setInterval(() => { i = (i + 1) % statusSteps.length; setStatusMsg(statusSteps[i]); }, 1800);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: scrapeUrl.trim(), bizName: scrapeName }),
      });
      clearInterval(timer);
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to analyze website"); }
      const data = await res.json();
      setBizContent(data.bizContent);
      setBizName(data.bizName);
      setMessages([{ role: "bot", text: data.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setStatusMsg("");
      setStep("demo");
    } catch (err) {
      clearInterval(timer);
      setStatusMsg(`Error: ${err.message}. Try a different URL.`);
      setStep("input");
    }
  };

  const handleScrape = async () => {
    if (!url.trim()) return;
    setStep("scraping");
    const statusSteps = ["Scanning your website...", "Analyzing business information...", "Building your AI chatbot..."];
    let i = 0;
    setStatusMsg(statusSteps[0]);
    const timer = setInterval(() => { i = (i + 1) % statusSteps.length; setStatusMsg(statusSteps[i]); }, 1800);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), bizName }),
      });
      clearInterval(timer);
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Failed to analyze website"); }
      const data = await res.json();
      setBizContent(data.bizContent);
      setBizName(data.bizName);
      setMessages([{ role: "bot", text: data.welcomeMessage, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
      setStatusMsg("");
      setStep("demo");
    } catch (err) {
      clearInterval(timer);
      setStatusMsg(`Error: ${err.message}. Try a different URL.`);
      setStep("input");
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isTyping) return;
    const userMessageCount = messages.filter((m) => m.role === "user").length;
    if (userMessageCount >= MAX_MESSAGES) return; // cap reached — input is disabled in UI
    const userMsg = userInput.trim();
    setUserInput("");
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessages = [...messages, { role: "user", text: userMsg, time: now }];
    setMessages(newMessages);
    setIsTyping(true);
    try {
      const history = newMessages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, bizName, bizContent }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "Sorry, I had trouble with that. Please try again.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I had a little trouble there. Could you try again?", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }
    setIsTyping(false);
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const handleReset = () => { setStep("input"); setUrl(""); setBizName(""); setBizContent(""); setMessages([]); setStatusMsg(""); setUserInput(""); };

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const capReached = userMessageCount >= MAX_MESSAGES;

  if (expired) {
    return (
      <div style={S.app}>
        <div style={S.logoWrap}>
          <span style={S.logoBolt}>⚡</span>
          <span style={S.logo}>MOCK<span style={S.logoAccent}>ME</span>AI</span>
        </div>
        <div style={{ ...S.card, textAlign: "center", marginTop: "40px" }}>
          <p style={{ fontSize: "16px", fontWeight: "700", color: "#111", marginBottom: "10px" }}>This Demo Link Has Expired</p>
          <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>Demo links are active for {LINK_LIFETIME_HOURS} hours. Want a fresh one?</p>
          <a href="https://shockwaveagency.com#contact" style={S.ctaBtn}>Get a New Demo ⚡</a>
        </div>
      </div>
    );
  }

  return (
    <div style={S.app}>

      {/* Top bar — logo left, personalized headline right */}
      <div style={S.topBar}>
        <div style={S.logoWrap}>
          <span style={S.logoBolt}>⚡</span>
          <span style={S.logo}>MOCK<span style={S.logoAccent}>ME</span>AI</span>
        </div>
        <div style={S.headlineBlock}>
          <div style={S.headline}>Never Miss a Call or Lead Again!</div>
          <div style={S.headlineSub}>
            {step === "demo" && bizName
              ? <span style={S.headlineBizName}>{bizName}</span>
              : "Your Business"} | Personalized Demo
          </div>
        </div>
      </div>

      <p style={S.tagline}>See your AI employee live in seconds</p>

      {step === "input" && (
        <div style={S.card}>
          <span style={S.label}>Enter the client's website URL</span>
          <input style={S.input} type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScrape()} />
          <input style={S.input} type="text" placeholder="Business name (optional)" value={bizName} onChange={(e) => setBizName(e.target.value)} />
          <button style={{ ...S.btn, ...(!url.trim() ? S.btnDisabled : {}) }} onClick={handleScrape} disabled={!url.trim()}>Build Their AI Employee Demo →</button>
          {statusMsg && <p style={S.status}>{statusMsg}</p>}
        </div>
      )}

      {step === "scraping" && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#111", marginBottom: "8px" }}>Building your AI employee...</p>
          <p style={S.status}>{statusMsg}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
            {[0, 1, 2].map((i) => (<div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6200", opacity: 0.4 + i * 0.3 }} />))}
          </div>
        </div>
      )}

      {step === "demo" && (
        <>
          <div style={{ ...S.card, maxWidth: "360px" }}>
            <span style={S.label}>Business detected</span>
            <div style={S.bizInfoBox}>{bizContent}</div>
          </div>
          <p style={S.sectionTitle}>This Is Your New AI Employee</p>
          <div style={S.phoneWrap}>
            <div style={S.phone}>
              <div style={S.phoneHeader}>
                <div style={S.phoneAvatar}>{bizName.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={S.phoneBizName}>{bizName}</p>
                  <p style={S.phoneBizSub}>AI Employee Demo</p>
                </div>
                <div style={S.phoneDot} />
              </div>
              <div style={S.chatArea} ref={chatRef}>
                {messages.map((msg, i) => (
                  <div key={i}>
                    <div style={msg.role === "bot" ? S.msgBot : S.msgUser}>{msg.text}</div>
                    <div style={{ ...S.msgTime, textAlign: msg.role === "user" ? "right" : "left" }}>{msg.time}</div>
                  </div>
                ))}
                {isTyping && <div style={S.msgBot}><span style={{ color: "#FF6200" }}>● ● ●</span></div>}
              </div>
              <div style={S.phoneInputRow}>
                <input
                  style={S.phoneInput}
                  placeholder={capReached ? "Demo limit reached" : "Type a message..."}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={capReached}
                />
                <button style={{ ...S.sendBtn, ...(capReached ? S.btnDisabled : {}) }} onClick={handleSend} disabled={capReached}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                </button>
              </div>
              <div style={S.poweredBy}>Powered by ShockWave Agency</div>
            </div>
          </div>
          {capReached && (
            <div style={{ ...S.ctaBox, background: "#FFF7F0", border: "1px solid #FFD9B8", borderRadius: "12px", padding: "20px", maxWidth: "320px" }}>
              <p style={{ color: "#111", fontSize: "14px", fontWeight: "700", marginBottom: "10px" }}>That's the demo! 🎉</p>
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "14px" }}>You've seen what your AI employee can do. Ready to put one to work for {bizName || "your business"}?</p>
              <a href="https://shockwaveagency.com#contact" style={S.ctaBtn}>Claim Your Free Trial ⚡</a>
            </div>
          )}
          {!capReached && (
            <div style={S.ctaBox}>
              <p style={{ color: "#111", fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>Ready for the real thing for YOUR business? ⚡</p>
              <a href="https://shockwaveagency.com#contact" style={S.ctaBtn}>Claim Your Free Trial ⚡</a>
            </div>
          )}
          <button style={S.resetBtn} onClick={handleReset}>← Try Another Website</button>
        </>
      )}

      <p style={S.footer}>ShockWave Agency · ShockWaveAgency.com</p>
    </div>
  );
}

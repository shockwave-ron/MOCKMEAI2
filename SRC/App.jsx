import { useState, useRef, useEffect } from "react";

const S = {
  app: { minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", fontFamily: "'Inter', sans-serif", color: "#fff" },
  logo: { fontFamily: "'Bebas Neue', sans-serif", fontSize: "42px", letterSpacing: "4px", color: "#fff", marginBottom: "4px" },
  logoAccent: { color: "#FF6200" },
  tagline: { fontSize: "12px", letterSpacing: "3px", color: "#888", textTransform: "uppercase", marginBottom: "40px" },
  card: { background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", marginBottom: "20px" },
  label: { fontSize: "11px", letterSpacing: "2px", color: "#FF6200", textTransform: "uppercase", fontWeight: "700", display: "block", marginBottom: "14px" },
  input: { width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "10px", padding: "14px 16px", color: "#fff", fontSize: "14px", outline: "none", marginBottom: "12px", fontFamily: "inherit" },
  btn: { width: "100%", background: "#FF6200", border: "none", borderRadius: "10px", padding: "16px", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "0.5px" },
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  status: { fontSize: "13px", color: "#FF6200", textAlign: "center", marginTop: "12px", minHeight: "20px" },
  sectionTitle: { fontSize: "11px", letterSpacing: "2px", color: "#FF6200", textTransform: "uppercase", fontWeight: "700", textAlign: "center", marginBottom: "16px" },
  bizInfoBox: { background: "#0a0a0a", border: "1px solid #1E1E1E", borderRadius: "8px", padding: "12px 14px", fontSize: "13px", color: "#888", lineHeight: "1.6", marginBottom: "16px", maxHeight: "80px", overflow: "hidden" },
  phoneWrap: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  phone: { width: "300px", height: "580px", background: "#1a1a1a", borderRadius: "40px", border: "8px solid #333", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" },
  phoneHeader: { background: "#111", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #222" },
  phoneAvatar: { width: "36px", height: "36px", borderRadius: "50%", background: "#FF6200", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "700", flexShrink: 0 },
  phoneBizName: { fontSize: "14px", fontWeight: "600", color: "#fff", margin: 0 },
  phoneBizSub: { fontSize: "11px", color: "#FF6200", margin: 0 },
  phoneDot: { width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", marginLeft: "auto" },
  chatArea: { flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" },
  msgBot: { background: "#222", borderRadius: "12px 12px 12px 4px", padding: "10px 12px", fontSize: "13px", color: "#fff", maxWidth: "85%", alignSelf: "flex-start", lineHeight: "1.5" },
  msgUser: { background: "#FF6200", borderRadius: "12px 12px 4px 12px", padding: "10px 12px", fontSize: "13px", color: "#fff", maxWidth: "85%", alignSelf: "flex-end", lineHeight: "1.5" },
  msgTime: { fontSize: "10px", color: "#555", marginTop: "2px" },
  phoneInputRow: { display: "flex", padding: "10px", gap: "8px", borderTop: "1px solid #222", background: "#111" },
  phoneInput: { flex: 1, background: "#222", border: "1px solid #333", borderRadius: "20px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none", fontFamily: "inherit" },
  sendBtn: { width: "36px", height: "36px", borderRadius: "50%", background: "#FF6200", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  poweredBy: { fontSize: "10px", color: "#333", textAlign: "center", padding: "6px", letterSpacing: "1px" },
  resetBtn: { background: "transparent", border: "1px solid #2A2A2A", borderRadius: "10px", padding: "12px 24px", color: "#888", fontSize: "13px", cursor: "pointer", marginTop: "8px", width: "100%", maxWidth: "420px" },
  ctaBox: { textAlign: "center", maxWidth: "360px", marginBottom: "16px" },
  ctaBtn: { display: "inline-block", background: "#FF6200", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: "50px", fontWeight: "700", fontSize: "14px", letterSpacing: "0.5px", marginBottom: "16px" },
  footer: { marginTop: "40px", fontSize: "12px", color: "#333", letterSpacing: "1px", textTransform: "uppercase" },
};

export default function MockMeAI() {
  const [step, setStep] = useState("input");
  const [url, setUrl] = useState("");
  const [bizName, setBizName] = useState("");
  const [bizContent, setBizContent] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isTyping]);

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

  return (
    <div style={S.app}>
      <div style={S.logo}>MOCK<span style={S.logoAccent}>ME</span>AI</div>
      <p style={S.tagline}>See your bot live in seconds</p>

      {step === "input" && (
        <div style={S.card}>
          <span style={S.label}>Enter any business website URL</span>
          <input style={S.input} type="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScrape()} />
          <input style={S.input} type="text" placeholder="Business name (optional)" value={bizName} onChange={(e) => setBizName(e.target.value)} />
          <button style={{ ...S.btn, ...(!url.trim() ? S.btnDisabled : {}) }} onClick={handleScrape} disabled={!url.trim()}>Build My AI Chatbot Demo →</button>
          {statusMsg && <p style={S.status}>{statusMsg}</p>}
        </div>
      )}

      {step === "scraping" && (
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#fff", marginBottom: "8px" }}>Building your AI chatbot...</p>
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
          <p style={S.sectionTitle}>Your AI chatbot is live</p>
          <div style={S.phoneWrap}>
            <div style={S.phone}>
              <div style={S.phoneHeader}>
                <div style={S.phoneAvatar}>{bizName.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={S.phoneBizName}>{bizName}</p>
                  <p style={S.phoneBizSub}>AI Assistant</p>
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
                <input style={S.phoneInput} placeholder="Type a message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={handleKeyDown} />
                <button style={S.sendBtn} onClick={handleSend}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
                </button>
              </div>
              <div style={S.poweredBy}>Powered by MockMeAI · ShockWave Agency</div>
            </div>
          </div>
          <div style={S.ctaBox}>
            <p style={{ color: "#fff", fontSize: "15px", fontWeight: "600", marginBottom: "12px" }}>Ready for the real thing for YOUR business? ⚡</p>
            <a href="https://shockwaveagency.com#contact" style={S.ctaBtn}>Claim Your Free Trial ⚡</a>
          </div>
          <button style={S.resetBtn} onClick={handleReset}>← Try Another Website</button>
        </>
      )}

      <p style={S.footer}>ShockWave Agency · ShockWaveAgency.com</p>
    </div>
  );
}

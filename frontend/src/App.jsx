import { useState, useEffect, useRef } from "react";
import { sendMessageToAI, fetchHistory } from "./api";
import ThemeToggle from "./ThemeToggle";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("sessionId") || Date.now().toString();
  });

  useEffect(() => {
    localStorage.setItem("sessionId", sessionId);
    loadHistory();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await fetchHistory(sessionId);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.error("History error:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageToAI(input, sessionId);

      const aiMessage = {
        role: "ai",
        content: res.data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ Error getting response." },
      ]);
    }

    setLoading(false);
  };


  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };


  const clearChat = () => {
    const newSession = Date.now().toString();
    setSessionId(newSession);
    localStorage.setItem("sessionId", newSession);
    setMessages([]);
  };

  return (
    <div
      className={
        darkMode
          ? "bg-dark text-white min-vh-100 d-flex flex-column"
          : "bg-light text-dark min-vh-100 d-flex flex-column"
      }
    >
     
      <div className="container-fluid py-3 border-bottom d-flex justify-content-between align-items-center">
        <h4 className="m-0">MURA AI Chatbot</h4>

        <div className="d-flex gap-2">
          <button onClick={clearChat} className="btn btn-danger">
            Clear Chat 🔄
          </button>
          <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        </div>
      </div>

   
      <div className="container flex-grow-1 overflow-auto py-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${
              msg.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            <div
              className={
                msg.role === "user"
                  ? "bg-primary text-white p-3 rounded"
                  : darkMode
                  ? "bg-secondary text-white p-3 rounded"
                  : "bg-white text-dark p-3 rounded shadow"
              }
              style={{ maxWidth: "60%" }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-muted">AI is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>


      <div className="container-fluid p-3 border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="btn btn-primary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

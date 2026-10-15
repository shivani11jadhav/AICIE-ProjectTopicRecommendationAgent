import React, { useState, useRef, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import { sendChatMessage } from "../services/api.js";
import Spinner from "../components/ui/Spinner.jsx";
import { difficultyColor } from "../utils/helpers.js";

const SUGGESTED_QUESTIONS = [
  "Can I build this using React and Node.js?",
  "Suggest a simpler version for a beginner.",
  "What should I implement first?",
  "How can I make this project more original?",
  "Explain the architecture in simple language.",
  "What are the biggest technical challenges?",
  "How should I structure my database?",
  "What testing framework should I use?",
];

function ChatBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
          isUser ? "bg-primary-600 text-white" : "bg-slate-200 text-slate-600"
        }`}
      >
        {isUser ? "You" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary-600 text-white rounded-tr-sm"
            : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedProject, preferences, recommendations } = useAppContext();

  const project =
    selectedProject?.id === id
      ? selectedProject
      : recommendations.find((r) => r.id === id);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: project
        ? `Hi! I'm your AI project mentor for **${project.title}**.\n\nI know the full details of this project and your profile. Ask me anything — tech choices, implementation steps, architecture, how to simplify it, or how to make it stand out. What would you like to explore?`
        : "Hi! I'm your AI project mentor. Ask me anything about your selected project.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const msgText = (text || input).trim();
    if (!msgText || loading) return;

    setInput("");
    setError("");

    const userMsg = { role: "user", content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build history excluding the initial greeting
      const history = messages.slice(1).concat(userMsg).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await sendChatMessage(
        msgText,
        project || { title: "Selected project" },
        preferences || {},
        history.slice(0, -1) // current message is separate
      );

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    } catch (err) {
      setError(err.message);
      // Remove the optimistic user message if the call failed
      setMessages((prev) => prev.slice(0, -1));
      setInput(msgText);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  if (!project) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 mb-4">No project selected. Please go back to your results.</p>
        <Link to="/results" className="btn-primary">← Back to Results</Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="page-container max-w-3xl flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
        {/* Header */}
        <div className="card p-4 mb-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-semibold text-slate-900 truncate">{project.title}</h1>
              <span className={`badge ${difficultyColor(project.difficulty)}`}>{project.difficulty}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{project.shortDescription}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to={`/project/${id}`} className="btn-secondary text-xs py-1.5 px-3">
              📋 Details
            </Link>
            <Link to="/results" className="btn-ghost text-xs py-1.5 px-3">
              ← Back
            </Link>
          </div>
        </div>

        {/* Suggested questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-xs text-slate-500 mb-2 font-medium">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 5).map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="text-xs px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto card p-4 space-y-4 mb-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                AI
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 shadow-sm">
                <Spinner size="sm" />
                <span className="text-sm text-slate-500">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-3">
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error} — <button onClick={() => setError("")} className="underline">dismiss</button>
            </p>
          </div>
        )}

        {/* Input */}
        <div className="card p-3 flex gap-2 items-end">
          <textarea
            ref={inputRef}
            className="flex-1 resize-none outline-none text-sm text-slate-800 placeholder:text-slate-400 max-h-32 min-h-[40px]"
            placeholder="Ask anything about this project… (Enter to send, Shift+Enter for new line)"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-primary text-sm py-2 px-4 shrink-0"
            aria-label="Send message"
          >
            {loading ? <Spinner size="sm" /> : "Send ↑"}
          </button>
        </div>

        {/* More suggested questions */}
        {messages.length > 2 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.slice(5).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mt-2">
          AI responses are informational only. Always review advice critically.
        </p>
      </div>
    </div>
  );
}

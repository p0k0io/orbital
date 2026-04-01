"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Loader2, Check, Sparkles, RotateCcw } from "lucide-react";
import Ajv from "ajv";

const ajv = new Ajv({ strict: false });

function extractJson(text) {
  if (!text) return null;
  return text.replace(/```json/gi, "").replace(/```/g, "").trim();
}

function isValidJsonSchema(text) {
  try {
    const cleaned = extractJson(text);
    const parsed = JSON.parse(cleaned);
    if (parsed.type !== "object" || !parsed.properties) return false;
    ajv.compile(parsed);
    return true;
  } catch {
    return false;
  }
}

const INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Hola 👋 Soy tu asistente IA.\n\nDescríbeme el endpoint que necesitas y generaré el JSON Schema por ti. Por ejemplo:\n\n\"Necesito un webhook para recibir pedidos con nombre, email y productos\"",
  },
];

export default function IaAssistant({ open, onClose, onImplement }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);
  const inputRef                 = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  if (!open) return null;

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput("");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message || "❌ Error en la respuesta" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error conectando con la IA. Inténtalo de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const canImplement =
    lastMessage?.role === "assistant" && isValidJsonSchema(lastMessage.content);

  return (
    // z-[60] — encima del modal principal (z-50) y su backdrop
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">

      <div className="w-full max-w-[420px] h-[580px] flex flex-col bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden">

        {/* Gradient top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-white via-blue-500 to-blue-800 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white via-blue-500 to-blue-800 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">IA Assistant</p>
              <p className="text-[10px] text-neutral-500">Generador de JSON Schema</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Nueva conversación"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            const isLast = i === messages.length - 1;
            const showImplement = canImplement && isLast && !isUser;

            return (
              <div key={i} className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isUser
                    ? "bg-gradient-to-br from-white via-blue-500 to-blue-800"
                    : "bg-neutral-800 border border-neutral-700"
                }`}>
                  {isUser
                    ? <User size={11} className="text-white" />
                    : <Bot size={11} className="text-cyan-400" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                  isUser
                    ? "bg-gradient-to-br from-blue-500 to-blue-800 text-white rounded-tr-sm"
                    : "bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-tl-sm"
                }`}>
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
                    {msg.content}
                  </pre>

                  {showImplement && (
                    <div className="mt-3 pt-3 border-t border-neutral-700">
                      <button
                        onClick={() => onImplement(extractJson(msg.content))}
                        className="flex items-center gap-1.5 w-full justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 text-xs font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-green-500/20"
                      >
                        <Check size={12} />
                        Implementar en el formulario
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-neutral-800 border border-neutral-700 shrink-0">
                <Bot size={11} className="text-cyan-400" />
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-neutral-400" />
                <span className="text-xs text-neutral-400">Pensando…</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-neutral-800 shrink-0">
          {canImplement && (
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-green-400 font-medium">
              <Check size={10} />
              Schema válido listo para implementar
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Describe el endpoint que necesitas…"
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-white via-blue-500 to-blue-800 flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-30 shadow-lg shadow-violet-500/20"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

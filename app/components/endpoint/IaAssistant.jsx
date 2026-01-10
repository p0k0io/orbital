"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, X, Loader2, Check } from "lucide-react";
import Ajv from "ajv";

const ajv = new Ajv({ strict: false });

/**
 * Elimina bloques ```json ``` y devuelve JSON limpio
 */
function extractJson(text) {
  if (!text) return null;

  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Valida que el texto contenga un JSON Schema válido
 */
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

export default function IaAssistant({ open, onClose, onImplement }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola 👋 Soy tu asistente IA. ¿En qué puedo ayudarte?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!open) return null;

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
        {
          role: "assistant",
          content: data.message || "❌ Error en la respuesta",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error conectando con la IA" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const canImplement =
    lastMessage?.role === "assistant" &&
    isValidJsonSchema(lastMessage.content);

  return (
    <div className="fixed left-4 top-1/5 z-50 h-4/6 w-[380px] rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Bot className="text-cyan-400" size={18} />
          IA Assistant
        </div>

        <button onClick={onClose} className="text-white/40 hover:text-white">
          <X size={18} />
        </button>
      </div>

      {/* Chat */}
      <div className="flex h-[calc(100%-120px)] flex-col gap-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 ${
                msg.role === "user"
                  ? "bg-cyan-500 text-black"
                  : "bg-neutral-800 text-white"
              }`}
            >
              <div className="mb-1 flex items-center gap-1 text-xs opacity-70">
                {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                {msg.role === "user" ? "Tú" : "IA"}
              </div>

              <pre className="whitespace-pre-wrap font-mono text-xs">
                {msg.content}
              </pre>

              {canImplement && i === messages.length - 1 && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() =>
                      onImplement(extractJson(msg.content))
                    }
                    className="flex items-center gap-2 rounded-lg bg-green-500 px-3 py-1 text-xs font-semibold text-black hover:bg-green-400"
                  >
                    <Check size={14} />
                    Implementar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-xl bg-neutral-800 px-3 py-2 text-white">
              <Loader2 className="animate-spin" size={14} />
              Pensando…
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Escribe tu mensaje…"
            className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="rounded-xl bg-cyan-500 p-2 text-black hover:bg-cyan-400 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

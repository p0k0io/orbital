"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Copy, Check, Key } from "lucide-react";

export default function CreateApiKeyPopup({ open, onClose }) {
  const { user } = useUser();

  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  /* ---------------- CREATE API KEY ---------------- */
  const handleCreateKey = async () => {
    if (!keyName || !user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/create/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: keyName,
        }),
      });

      if (!res.ok) {
        throw new Error("Error creando API Key");
      }

      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (err) {
      console.error(err);
      setError("No se pudo generar la API Key");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- COPY LOGIC ---------------- */
 const handleCopy = async () => {
  if (!apiKey) return;

  // Clipboard API (HTTPS o localhost)
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    } catch (err) {
      console.warn("Clipboard API falló, usando fallback");
    }
  }

  // Fallback (HTTP / VPS)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = apiKey;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    document.execCommand("copy");
    document.body.removeChild(textarea);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("No se pudo copiar la API Key", err);
  }
};

  /* ---------------- RESET / CLOSE ---------------- */
  const handleClose = () => {
    setKeyName("");
    setApiKey(null);
    setCopied(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="border-b border-white/10 px-6 py-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Key size={18} />
            Generar API Key
          </h2>
        </header>

        {/* Content */}
        <div className="space-y-6 p-6">
          {!apiKey ? (
            <>
              <div className="space-y-2">
                <label className="text-sm text-white/70">
                  Nombre de la API Key
                </label>
                <input
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="Ej: Producción, Backend"
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
            </>
          ) : (
            <>
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="mb-2 text-xs text-white/60">
                  Guarda esta API Key, no se mostrará de nuevo
                </p>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-black/40 px-4 py-3 font-mono text-sm text-white">
                  <span className="truncate select-all">{apiKey}</span>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-white/60 hover:text-white transition"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-6 py-5">
          <button
            onClick={handleClose}
            className="rounded-xl bg-gray-600 px-5 py-2.5 text-sm text-white hover:bg-gray-700 transition"
          >
            Cerrar
          </button>

          {!apiKey && (
            <button
              onClick={handleCreateKey}
              disabled={loading || !keyName}
              className="rounded-xl bg-slate-700 px-5 py-2.5 text-sm text-white hover:bg-slate-600 transition disabled:opacity-50"
            >
              {loading ? "Generando..." : "Generar"}
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

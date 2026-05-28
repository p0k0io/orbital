"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Copy, Check, Key, X, AlertTriangle, Loader2 } from "lucide-react";
import ToastNotification from "../ToastNotification";
import { useRouter } from "next/navigation";

export default function CreateApiKeyPopup({ open, onClose, onCreated }) {
  const { user } = useUser();
  const router = useRouter();

  const [keyName, setKeyName] = useState("");
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

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
        body: JSON.stringify({ userId: user.id, name: keyName }),
      });

      if (!res.ok) {
        setToast({ type: "error", text: "Operation failed" });
      }

      const data = await res.json();
      setApiKey(data.apiKey);
      setToast({ type: "success", text: "API Key created successfully" });
    } catch (err) {
      console.error(err);
      setError("Could not generate the API Key");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- COPY LOGIC ---------------- */
  const handleCopy = async () => {
    if (!apiKey) return;

    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API failed, using fallback");
      }
    }

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
      console.error("Could not copy the API Key", err);
    }
  };

  /* ---------------- RESET / CLOSE ---------------- */
  const handleClose = () => {
    setKeyName("");
    setApiKey(null);
    setCopied(false);
    setError(null);
    router.refresh();
    onCreated?.();
    onClose();
  };

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-md">
        {/* Modal */}
        <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/20 p-2 text-blue-400">
                <Key size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Generate API Key
                </h2>
                <p className="text-xs text-white/50">
                  Create a new API key for your account
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          {/* Content */}
          <div className="flex flex-col gap-5 p-6">

            {!apiKey ? (
              <>
                {/* Key name input */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50">
                    <Key size={13} />
                    Key name
                  </label>
                  <input
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder="e.g. Production, Backend, Mobile"
                    className={inputClass}
                  />
                </div>

                {/* Warning banner */}
                <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  <p className="text-xs leading-relaxed text-yellow-300">
                    <span className="font-semibold">Important:</span> Your API key will only be shown once immediately after creation. Make sure to copy and store it in a safe place — you won&apos;t be able to retrieve it again.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Warning banner (post-creation) */}
                <div className="flex items-start gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  <p className="text-xs leading-relaxed text-yellow-300">
                    <span className="font-semibold">This is the only time your key will be shown.</span> Copy it now and store it securely — it cannot be recovered once you close this window.
                  </p>
                </div>

                {/* Key display */}
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Check size={16} className="text-green-400" />
                    <p className="text-sm font-medium text-green-400">
                      API Key generated successfully
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                    <span className="truncate font-mono text-sm text-white/80 select-all">
                      {apiKey}
                    </span>

                    <button
                      onClick={handleCopy}
                      className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
                    >
                      {copied ? (
                        <>
                          <Check size={14} />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          Copy
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
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {apiKey ? "Close" : "Cancel"}
            </button>

            {!apiKey && (
              <button
                onClick={handleCreateKey}
                disabled={loading || !keyName}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key size={15} />
                    Generate Key
                  </>
                )}
              </button>
            )}
          </footer>
        </div>
      </div>

      {toast && (
        <ToastNotification
          type={toast.type}
          text={toast.text}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

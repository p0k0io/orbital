"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Send,
  CheckCircle,
  Loader,
  Plus,
  Trash2,
  FlaskConical,
  Key,
  FileUp,
  Tag,
  Webhook,
} from "lucide-react";

export default function TestModal({ isOpen, onClose, endpointId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [webhookResponse, setWebhookResponse] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [metaRows, setMetaRows] = useState([{ key: "", value: "" }]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const apiUrl = "https://orbital-ocr.com/backend";

  const handleSaveApiKey = () => {
    if (!apiKey) { setError("Introduce una API Key válida."); return; }
    setApiKeySaved(true);
    setError("");
  };

  const addMetaRow = () => setMetaRows((r) => [...r, { key: "", value: "" }]);
  const removeMetaRow = (i) => setMetaRows((r) => r.filter((_, idx) => idx !== i));
  const updateMetaRow = (i, field, val) =>
    setMetaRows((r) => r.map((row, idx) => (idx === i ? { ...row, [field]: val } : row)));

  const buildMetadata = () => {
    const obj = {};
    metaRows.forEach(({ key, value }) => { if (key.trim()) obj[key.trim()] = value; });
    return Object.keys(obj).length ? obj : null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSend = async () => {
    if (!file) { setError("Select a file first."); return; }
    if (!apiKeySaved) { setError("Save your API Key before sending."); return; }

    setLoading(true);
    setError("");
    setSuccess("");
    setWebhookResponse("");
    setRequestId("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const meta = buildMetadata();
      if (meta) formData.append("metadata", JSON.stringify(meta));

      const res = await fetch(`${apiUrl}/${endpointId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: formData,
      });

      if (res.status === 401) throw new Error("Unauthorized: revisa tu API Key");
      if (res.status !== 202) {
        const text = await res.text();
        throw new Error(`Error sending file: ${text}`);
      }

      const data = await res.json();
      setSuccess(data.message || "File sent successfully.");
      setRequestId(data.request_id || "");
      setFile(null);
      setWebhookResponse("Esperando respuesta...");
    } catch (err) {
      setError(err.message || "Error desconocido");
      setWebhookResponse("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requestId) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/get/test-endpoint`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request_id: requestId }),
        });
        const data = await res.json();
        if (!data.pending) {
          setWebhookResponse(JSON.stringify(data, null, 2));
          clearInterval(interval);
        } else {
          setWebhookResponse("Procesando... esperando resultado");
        }
      } catch {
        setWebhookResponse("Error consultando la base de datos");
        clearInterval(interval);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [requestId]);

  if (!isOpen) return null;

  const metaPreview = buildMetadata();

  return (
    /* Overlay: solo blur + oscuridad en el fondo */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Modal: completamente opaco, sin ninguna transparencia */}
      <div className="relative flex w-[900px] max-w-[95vw] max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl">

        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-950 px-6 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <FlaskConical size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-white">Test Endpoint</h2>
              <p className="text-xs text-zinc-400 font-mono">{endpointId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 p-2 text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">

            {/* API Key */}
            <SectionBlock icon={Key} title="API Key">
              <div className="flex gap-3">
                <input
                  type="password"
                  placeholder="sk-••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setApiKeySaved(false); }}
                  className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 font-mono text-sm text-white placeholder-zinc-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
                >
                  {apiKeySaved
                    ? <><CheckCircle size={14} className="text-green-400" /><span className="text-green-400">Saved</span></>
                    : "Save"
                  }
                </button>
              </div>
              {apiKeySaved && (
                <p className="mt-2 flex items-center gap-2 text-xs text-green-400">
                  <CheckCircle size={12} /> API Key active for the session
                </p>
              )}
            </SectionBlock>

            {/* File */}
            <SectionBlock icon={FileUp} title="File">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`
                  relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 transition
                  ${file || dragOver
                    ? "border-blue-500 bg-blue-950"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-500"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <>
                    <div className="rounded-xl bg-blue-600 p-3 text-white">
                      <CheckCircle size={20} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">{file.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl bg-zinc-700 p-3 text-zinc-400">
                      <Upload size={20} />
                    </div>
                    <p className="text-sm text-zinc-500">Drag a file or click to select</p>
                  </>
                )}
              </div>
            </SectionBlock>

            {/* Divider */}
            <div className="h-px bg-zinc-800" />

            {/* Metadata */}
            <SectionBlock icon={Tag} title="Metadata" optional>
              <div className="grid grid-cols-[1fr_1fr_32px] gap-2 px-1 mb-2">
                {["Key", "Value", ""].map((h, i) => (
                  <p key={i} className="text-[10px] uppercase tracking-widest text-zinc-600">{h}</p>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                {metaRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
                    <input
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500 transition"
                      placeholder="user_id"
                      value={row.key}
                      onChange={(e) => updateMetaRow(i, "key", e.target.value)}
                    />
                    <input
                      className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 font-mono text-xs text-white placeholder-zinc-600 outline-none focus:border-blue-500 transition"
                      placeholder="valor"
                      value={row.value}
                      onChange={(e) => updateMetaRow(i, "value", e.target.value)}
                    />
                    <button
                      onClick={() => removeMetaRow(i)}
                      disabled={metaRows.length === 1}
                      className="flex items-center justify-center rounded-lg p-1.5 text-zinc-600 transition hover:bg-red-950 hover:text-red-400 disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addMetaRow}
                className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:bg-zinc-700 hover:text-white"
              >
                <Plus size={13} /> Add Field
              </button>

              {metaPreview && (
                <div className="mt-4 overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950">
                  <div className="border-b border-zinc-700 px-4 py-2">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-600">Preview JSON</p>
                  </div>
                  <pre className="overflow-x-auto px-4 py-3 font-mono text-xs leading-5 text-zinc-400">
                    {JSON.stringify(metaPreview, null, 2)}
                  </pre>
                </div>
              )}
            </SectionBlock>

            {/* Error / Success */}
            {error && (
              <div className="flex items-center gap-3 rounded-xl border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-start gap-3 rounded-xl border border-green-800 bg-green-950 px-4 py-3">
                <CheckCircle size={15} className="mt-0.5 shrink-0 text-green-400" />
                <div>
                  <p className="text-sm text-green-400">{success}</p>
                  {requestId && (
                    <p className="mt-1 font-mono text-xs text-green-700">{requestId}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Webhook response */}
          <aside className="flex w-64 shrink-0 flex-col gap-4 overflow-hidden border-l border-zinc-700 bg-zinc-950 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400">
                  <Webhook size={14} />
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Response
                </p>
              </div>
              {loading && (
                <span className="flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-500">
                  <Loader size={9} className="animate-spin" /> processing
                </span>
              )}
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-zinc-700 bg-zinc-900 p-4">
              {webhookResponse ? (
                <pre className="whitespace-pre-wrap break-all font-mono text-xs leading-5 text-zinc-300">
                  {webhookResponse}
                </pre>
              ) : (
                <p className="font-mono text-xs text-zinc-700">
                  {loading ? "Waiting for response..." : "Waiting for submission..."}
                </p>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-zinc-700 bg-zinc-950 px-6 py-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
          >
            Close
          </button>

          <button
            onClick={handleSend}
            disabled={loading || !apiKeySaved}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading
              ? <><Loader size={15} className="animate-spin" /> Sending...</>
              : <><Send size={15} /> Send</>
            }
          </button>
        </footer>
      </div>
    </div>
  );
}

function SectionBlock({ icon: Icon, title, optional, children }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="rounded-lg bg-zinc-800 p-1.5 text-zinc-400">
          <Icon size={14} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</p>
        {optional && (
          <span className="ml-auto rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-600">
            opcional
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

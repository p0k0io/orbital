"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Send, CheckCircle, Loader, Plus, Trash2 } from "lucide-react";

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
  const apiUrl = "http://localhost:8000";

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
    if (!file) { setError("Selecciona un archivo primero."); return; }
    if (!apiKeySaved) { setError("Guarda tu API Key antes de enviar."); return; }

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
        throw new Error(`Error al enviar el archivo: ${text}`);
      }

      const data = await res.json();
      setSuccess(data.message || "Archivo enviado correctamente.");
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-[880px] max-w-[95vw] max-h-[90vh] rounded-2xl bg-slate-900 border border-blue-800/40 shadow-2xl flex flex-col overflow-hidden">

        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-800/30">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)] ${loading ? "animate-pulse" : ""}`} />
            <span className="text-sm font-semibold text-blue-100 tracking-wide">Test Endpoint</span>
            <span className="font-mono text-[10px] text-blue-500 bg-blue-900/60 px-2 py-0.5 rounded-full border border-blue-800/40">
              v1
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-blue-600 hover:text-blue-200 hover:bg-blue-800/50 p-1.5 rounded-lg transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 border-r border-blue-800/30">

            {/* Endpoint */}
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-blue-500 mb-2">Endpoint</p>
              <div className="flex items-center gap-2 bg-blue-900/40 border border-blue-800/40 rounded-lg px-3 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-blue-400" />
                <span className="font-mono text-[11px] text-blue-400 break-all">
                  {apiUrl}/<span className="text-blue-200">{endpointId}</span>
                </span>
              </div>
            </div>

            {/* API Key */}
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-blue-500 mb-2">API Key</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk-••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setApiKeySaved(false); }}
                  className="flex-1 bg-blue-900/40 border border-blue-800/40 rounded-lg px-3 py-2 text-xs text-blue-100 placeholder-blue-800 font-mono outline-none focus:border-blue-500 focus:bg-blue-900/70 transition-all"
                />
                <button
                  onClick={handleSaveApiKey}
                  className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-600 active:bg-blue-800 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all flex-shrink-0"
                >
                  {apiKeySaved ? <><CheckCircle size={12} /> Saved</> : "Guardar"}
                </button>
              </div>
              {apiKeySaved && (
                <p className="mt-1.5 text-[11px] text-blue-400 flex items-center gap-1">
                  <CheckCircle size={11} /> API Key activa
                </p>
              )}
            </div>

            {/* File */}
            <div>
              <p className="text-[10px] font-medium tracking-widest uppercase text-blue-500 mb-2">Archivo</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all
                  ${file
                    ? "border-blue-400/50 bg-blue-800/20"
                    : dragOver
                    ? "border-blue-500 bg-blue-800/30"
                    : "border-blue-800/50 bg-blue-900/20 hover:border-blue-700 hover:bg-blue-900/30"
                  }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle size={14} className="text-blue-300" />
                    <span className="text-xs text-blue-200 font-medium">{file.name}</span>
                    <span className="text-[11px] text-blue-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={18} className="text-blue-700" />
                    <span className="text-xs text-blue-600">Arrastra o haz clic para seleccionar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-blue-800/30" />

            {/* Metadata */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-medium tracking-widest uppercase text-blue-500">Metadata</p>
                <span className="text-[10px] text-blue-700">opcional</span>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[1fr_1fr_28px] gap-2 mb-1.5 px-1">
                <span className="text-[10px] text-blue-600 tracking-wider uppercase">Key</span>
                <span className="text-[10px] text-blue-600 tracking-wider uppercase">Value</span>
                <span />
              </div>

              <div className="space-y-2">
                {metaRows.map((row, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center">
                    <input
                      className="bg-blue-900/40 border border-blue-800/40 rounded-lg px-3 py-2 text-xs text-blue-100 placeholder-blue-800 font-mono outline-none focus:border-blue-500 transition-all"
                      placeholder="user_id"
                      value={row.key}
                      onChange={(e) => updateMetaRow(i, "key", e.target.value)}
                    />
                    <input
                      className="bg-blue-900/40 border border-blue-800/40 rounded-lg px-3 py-2 text-xs text-blue-100 placeholder-blue-800 font-mono outline-none focus:border-blue-500 transition-all"
                      placeholder="valor"
                      value={row.value}
                      onChange={(e) => updateMetaRow(i, "value", e.target.value)}
                    />
                    <button
                      onClick={() => removeMetaRow(i)}
                      disabled={metaRows.length === 1}
                      className="flex items-center justify-center text-blue-800 hover:text-red-400 hover:bg-red-400/10 rounded-lg p-1.5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addMetaRow}
                className="mt-2.5 flex items-center gap-1.5 text-blue-500 hover:text-blue-300 text-xs transition-all"
              >
                <Plus size={13} /> Añadir campo
              </button>

              {/* JSON Preview */}
              {metaPreview && (
                <div className="mt-3">
                  <p className="text-[10px] font-medium tracking-widest uppercase text-blue-600 mb-1.5">Preview JSON</p>
                  <div className="bg-blue-950 border border-blue-800/30 rounded-lg px-3 py-2.5 font-mono text-[11px] leading-relaxed">
                    <span className="text-blue-700">{"{ "}</span>
                    {Object.entries(metaPreview).map(([k, v], i, arr) => (
                      <span key={k}>
                        <span className="text-blue-300">"{k}"</span>
                        <span className="text-blue-600">: </span>
                        <span className="text-blue-200">"{v}"</span>
                        {i < arr.length - 1 && <span className="text-blue-600">, </span>}
                      </span>
                    ))}
                    <span className="text-blue-700">{" }"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error / Success */}
            {error && (
              <div className="text-xs text-red-300 bg-red-950/60 border border-red-800/40 rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}
            {success && (
              <div className="text-xs text-blue-200 bg-blue-800/20 border border-blue-600/30 rounded-lg px-3 py-2.5 flex items-start gap-2">
                <CheckCircle size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span>{success}</span>
                  {requestId && (
                    <p className="font-mono text-blue-500 text-[10px] mt-0.5">{requestId}</p>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={onClose}
                className="text-blue-400 hover:text-blue-200 bg-blue-900/40 hover:bg-blue-800/50 border border-blue-800/40 text-xs font-medium px-4 py-2 rounded-lg transition-all"
              >
                Cerrar
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !apiKeySaved}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2 rounded-lg transition-all"
              >
                {loading
                  ? <><Loader size={13} className="animate-spin" /> Enviando...</>
                  : <><Send size={13} /> Enviar</>
                }
              </button>
            </div>

          </div>

          {/* RIGHT — Webhook response */}
          <div className="w-72 flex-shrink-0 flex flex-col p-5 gap-3 bg-blue-950/50">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-widest uppercase text-blue-500">Webhook response</p>
              {loading && (
                <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-800/30 border border-blue-700/30 px-2 py-0.5 rounded-full font-mono">
                  <Loader size={9} className="animate-spin" /> procesando
                </span>
              )}
            </div>
            <div className="flex-1 bg-blue-950 border border-blue-800/30 rounded-xl p-3.5 overflow-auto font-mono text-[11px] text-blue-400 leading-relaxed whitespace-pre-wrap break-all min-h-[200px]">
              {webhookResponse || (
                <span className="text-blue-800">
                  {loading ? "Esperando respuesta..." : "Esperando envío..."}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-800/60 to-transparent" />

      </div>
    </div>
  );
}

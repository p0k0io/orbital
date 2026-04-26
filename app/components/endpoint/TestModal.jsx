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
  const apiUrl = "http://87.106.125.227:8000";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="relative w-[880px] max-w-[95vw] max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: "#141414",
          border: "0.5px solid #2a2a2a",
          borderRadius: "14px",
        }}
      >
        {/* Top accent */}
        <div style={{ height: "2px", background: "#378ADD" }} />

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "0.5px solid #232323" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={loading ? "animate-pulse" : ""}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#378ADD", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#e0e0e0" }}>Test endpoint</span>
            <span
              style={{
                fontFamily: "monospace", fontSize: 10, color: "#555",
                background: "#1e1e1e", border: "0.5px solid #2e2e2e",
                padding: "2px 8px", borderRadius: 20,
              }}
            >
              v1
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#555", padding: "4px 6px", borderRadius: 6, fontSize: 15, lineHeight: 1,
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* LEFT */}
          <div
            className="flex-1 overflow-y-auto p-5 flex flex-col gap-5"
            style={{ borderRight: "0.5px solid #232323" }}
          >
            {/* Endpoint */}
            <div>
              <p style={labelStyle}>Endpoint</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#1a1a1a", border: "0.5px solid #2a2a2a", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#378ADD", flexShrink: 0 }} />
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#555" }}>
                  {apiUrl}/<span style={{ color: "#aaa" }}>{endpointId}</span>
                </span>
              </div>
            </div>

            {/* API Key */}
            <div>
              <p style={labelStyle}>API Key</p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder="sk-••••••••••••••••"
                  value={apiKey}
                  onChange={(e) => { setApiKey(e.target.value); setApiKeySaved(false); }}
                  style={inputStyle}
                />
                <button onClick={handleSaveApiKey} style={btnPrimaryStyle}>
                  {apiKeySaved ? <><CheckCircle size={12} /> Guardada</> : "Guardar"}
                </button>
              </div>
              {apiKeySaved && (
                <p style={{ marginTop: 5, fontSize: 11, color: "#378ADD", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle size={11} /> API Key activa
                </p>
              )}
            </div>

            {/* File */}
            <div>
              <p style={labelStyle}>Archivo</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `1.5px dashed ${file ? "#378ADD" : dragOver ? "#378ADD" : "#2a2a2a"}`,
                  background: file || dragOver ? "#1a1a1a" : "#141414",
                  borderRadius: 10, padding: 20, textAlign: "center", cursor: "pointer",
                  transition: "border-color 0.15s, background 0.15s",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    <CheckCircle size={13} style={{ color: "#378ADD" }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#ccc" }}>{file.name}</span>
                    <span style={{ fontSize: 11, color: "#444" }}>({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <Upload size={17} style={{ color: "#333" }} />
                    <span style={{ fontSize: 12, color: "#333" }}>Arrastra o haz clic para seleccionar</span>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: "0.5px", background: "#1e1e1e" }} />

            {/* Metadata */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ ...labelStyle, marginBottom: 0 }}>Metadata</p>
                <span style={{ fontSize: 10, color: "#333" }}>opcional</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 8, marginBottom: 5, padding: "0 2px" }}>
                {["Key", "Value", ""].map((h, i) => (
                  <span key={i} style={{ fontSize: 10, letterSpacing: "0.07em", textTransform: "uppercase", color: "#383838" }}>{h}</span>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {metaRows.map((row, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 8, alignItems: "center" }}>
                    <input
                      style={metaInputStyle}
                      placeholder="user_id"
                      value={row.key}
                      onChange={(e) => updateMetaRow(i, "key", e.target.value)}
                    />
                    <input
                      style={metaInputStyle}
                      placeholder="valor"
                      value={row.value}
                      onChange={(e) => updateMetaRow(i, "value", e.target.value)}
                    />
                    <button
                      onClick={() => removeMetaRow(i)}
                      disabled={metaRows.length === 1}
                      style={{
                        background: "none", border: "none", cursor: metaRows.length === 1 ? "not-allowed" : "pointer",
                        color: "#383838", padding: 5, borderRadius: 6,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        opacity: metaRows.length === 1 ? 0.2 : 1,
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addMetaRow}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#378ADD", background: "none", border: "none", cursor: "pointer", padding: "2px 0", marginTop: 8 }}
              >
                <Plus size={13} /> Añadir campo
              </button>

              {metaPreview && (
                <div style={{ marginTop: 10 }}>
                  <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.07em", color: "#383838", marginBottom: 5 }}>
                    Preview JSON
                  </p>

                  <div
                    style={{
                      background: "#0e0e0e",
                      border: "0.5px solid #232323",
                      borderRadius: 8,
                      padding: "10px 12px",
                      fontFamily: "monospace",
                      fontSize: 11,
                      lineHeight: 1.7,
                      color: "#444"
                    }}
                  >
                    <span style={{ color: "#444" }}>{"{ "}</span>

                    {Object.entries(metaPreview).map(([k, v], i, arr) => (
                      <span key={k}>
                        <span style={{ color: "#378ADD" }}>{`"${k}"`}</span>
                        <span style={{ color: "#444" }}>: </span>
                        <span style={{ color: "#aaa" }}>{`"${v}"`}</span>

                        {i < arr.length - 1 && <span style={{ color: "#444" }}>, </span>}
                      </span>
                    ))}

                    <span style={{ color: "#444" }}>{" }"}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error / Success */}
            {error && (
              <div style={{ fontSize: 12, color: "#E24B4A", background: "#1a0909", border: "0.5px solid #4a1515", borderRadius: 8, padding: "10px 12px" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ fontSize: 12, color: "#639922", background: "#111a09", border: "0.5px solid #27500A", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 7 }}>
                <CheckCircle size={13} style={{ color: "#639922", flexShrink: 0, marginTop: 1 }} />
                <div>
                  <span>{success}</span>
                  {requestId && <p style={{ fontFamily: "monospace", fontSize: 10, color: "#3B6D11", marginTop: 3 }}>{requestId}</p>}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", paddingTop: 4 }}>
              <button onClick={onClose} style={btnCancelStyle}>Cerrar</button>
              <button
                onClick={handleSend}
                disabled={loading || !apiKeySaved}
                style={{ ...btnPrimaryStyle, opacity: loading || !apiKeySaved ? 0.35 : 1, cursor: loading || !apiKeySaved ? "not-allowed" : "pointer" }}
              >
                {loading
                  ? <><Loader size={13} className="animate-spin" /> Enviando...</>
                  : <><Send size={13} /> Enviar</>
                }
              </button>
            </div>
          </div>

          {/* RIGHT — Webhook response */}
          <div style={{ width: 255, flexShrink: 0, padding: 18, background: "#0e0e0e", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={labelStyle}>Webhook response</p>
              {loading && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#555", background: "#141414", border: "0.5px solid #2a2a2a", padding: "2px 8px", borderRadius: 20, fontFamily: "monospace" }}>
                  <Loader size={9} className="animate-spin" /> procesando
                </span>
              )}
            </div>
            <div style={{ flex: 1, minHeight: 180, background: "#141414", border: "0.5px solid #232323", borderRadius: 8, padding: 12, fontFamily: "monospace", fontSize: 11, lineHeight: 1.7, color: "#555", whiteSpace: "pre-wrap", wordBreak: "break-all", overflow: "auto" }}>
              {webhookResponse || (
                <span style={{ color: "#2a2a2a" }}>
                  {loading ? "Esperando respuesta..." : "Esperando envío..."}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* Bottom accent */}
        <div style={{ height: "0.5px", background: "#1e1e1e" }} />
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: 10, fontWeight: 500, letterSpacing: "0.09em",
  textTransform: "uppercase", color: "#444", marginBottom: 6,
};

const inputStyle = {
  flex: 1, background: "#1a1a1a", border: "0.5px solid #2e2e2e",
  borderRadius: 8, padding: "8px 12px", fontSize: 12,
  fontFamily: "monospace", color: "#d0d0d0", outline: "none",
};

const metaInputStyle = {
  background: "#1a1a1a", border: "0.5px solid #2e2e2e",
  borderRadius: 8, padding: "7px 10px", fontSize: 12,
  fontFamily: "monospace", color: "#ccc", outline: "none",
};

const btnPrimaryStyle = {
  display: "flex", alignItems: "center", gap: 6,
  background: "#378ADD", color: "#fff", border: "none", cursor: "pointer",
  fontSize: 12, fontWeight: 500, padding: "8px 14px", borderRadius: 8,
  flexShrink: 0,
};

const btnCancelStyle = {
  fontSize: 12, fontWeight: 500, padding: "8px 14px",
  borderRadius: 8, cursor: "pointer",
  background: "none", border: "0.5px solid #2e2e2e", color: "#555",
};

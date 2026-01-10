"use client";

import { useState } from "react";
import { X, Upload, Send, CheckCircle, Loader, Zap } from "lucide-react";

export default function TestModal({ isOpen, onClose, endpointId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [webhookResponse, setWebhookResponse] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [requestId, setRequestId] = useState("");
  const apiUrl = "http://51.77.150.113:8000"; // Base URL para los endpoints

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    if (!apiKey) {
      setError("Introduce una API Key válida.");
      return;
    }
    setApiKeySaved(true);
    setError("");
  };

  const handleSend = async () => {
    if (!file) {
      setError("Selecciona un archivo primero.");
      return;
    }

    if (!apiKeySaved) {
      setError("Guarda tu API Key antes de enviar.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setWebhookResponse("");

    try {
      // Crear FormData
      const formData = new FormData();
      formData.append("file", file);

      // Enviar POST con Authorization
      const res = await fetch(`${apiUrl}/${endpointId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`, // Header obligatorio
        },
        body: formData, // FormData asegura multipart/form-data
      });

      if (res.status === 401) {
        throw new Error("Unauthorized: revisa tu API Key");
      }

      if (res.status !== 202) {
        const text = await res.text();
        throw new Error(`Error al enviar el archivo: ${text}`);
      }

      const data = await res.json();
      setSuccess(data.message || "Archivo enviado correctamente.");
      setRequestId(data.request_id || "");
      setFile(null);

      // Simulación de webhook
      setWebhookResponse("Esperando respuesta del webhook...");
      setTimeout(() => {
        setWebhookResponse(
          JSON.stringify(
            {
              request_id: data.request_id,
              status: "ok",
              info: "Procesamiento completado (simulado)",
            },
            null,
            2
          )
        );
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setWebhookResponse("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-[820px] rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900 to-neutral-800 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">Test Endpoint</h1>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-white/60 hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 flex gap-6">
          {/* IZQUIERDA: API Key, archivo, botones */}
          <div className="flex-1 space-y-4">
            {/* Endpoint */}
            <div className="rounded-lg border border-white/10 bg-black/30 p-4">
              <p className="mb-2 text-xs text-white/60">Endpoint</p>
              <p className="break-all font-mono text-xs text-white">
                {apiUrl}/{endpointId}
              </p>
            </div>

            {/* API Key */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Introduce tu API Key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setApiKeySaved(false);
                }}
                className="flex-1 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-blue-500 focus:ring focus:ring-blue-500/30 transition"
              />
              <button
                onClick={handleSaveApiKey}
                className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition"
              >
                <span>Guardar</span>
                {apiKeySaved && <CheckCircle size={16} className="text-green-400" />}
              </button>
            </div>

            {/* Selector de archivo */}
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 text-sm font-medium transition-colors duration-200
                ${
                  file
                    ? "border-green-500 bg-green-100/10 text-green-400 hover:bg-green-200/20"
                    : "border-dashed border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                }`}
            >
              <Upload size={18} />
              <span>{file ? file.name : "Seleccionar archivo"}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {success && (
              <p className="flex items-center gap-1 text-sm text-green-400">
                <CheckCircle size={16} /> {success} {requestId && `(request_id: ${requestId})`}
              </p>
            )}

            {/* Botones */}
            <div className="mt-4 flex justify-center gap-2 relative">
              {/* Icono central de webhook */}
              {!loading && !success && (
                <Zap
                  size={32}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-400 animate-bounce"
                />
              )}

              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition"
              >
                Cerrar
              </button>

              <button
                onClick={handleSend}
                disabled={loading || !apiKeySaved}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <Send size={16} />
                {loading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>

          {/* DERECHA: respuesta del webhook */}
          <div className="w-80 rounded-xl border border-white/20 bg-black/20 p-4 overflow-auto">
            <p className="text-xs text-white/60 mb-2 flex items-center gap-1">
              {loading && <Loader size={14} className="animate-spin text-white/70" />}
              Respuesta del webhook:
            </p>
            <pre className="text-xs text-white font-mono break-words">
              {webhookResponse || (loading ? "Esperando respuesta del webhook..." : "Esperando envío...")}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Brain, Sparkles, X, Link2, FileJson, Globe, Loader2, Copy, Check } from "lucide-react";
import IaAssistant from "./IaAssistant";

export default function CreateApiKeyPopup({ open, onClose }) {
  const { user } = useUser();

  const [keyName, setKeyName]     = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [callbackURL, setCallbackURL] = useState("");
  const [createdUrl, setCreatedUrl]   = useState("");
  const [loading, setLoading]         = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");
  const [iaOpen, setIaOpen]           = useState(false);
  const [copied, setCopied]           = useState(false);

  if (!open) return null;

  const resetState = () => {
    setKeyName(""); setJsonSchema(""); setCallbackURL("");
    setCreatedUrl(""); setErrorMsg(""); setCopied(false);
  };

  const handleCancel = () => { resetState(); onClose(); };

  const handleImplementSchema = (schema) => {
    setJsonSchema(schema);
    setIaOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    setErrorMsg("");
    if (!keyName.trim())     return setErrorMsg("El nombre no puede estar vacío.");
    if (!jsonSchema.trim())  return setErrorMsg("El JSON Schema no puede estar vacío.");
    if (!callbackURL.trim()) return setErrorMsg("La callback URL no puede estar vacía.");

    let parsedSchema;
    try { parsedSchema = JSON.parse(jsonSchema); }
    catch { return setErrorMsg("El JSON Schema no es válido. Revisa la sintaxis."); }

    if (!user?.id) return setErrorMsg("Usuario no encontrado.");

    setLoading(true);
    try {
      const response = await fetch("/api/create/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: keyName.trim(),
          payloadJson: JSON.stringify({ schema: parsedSchema, callbackURL: callbackURL.trim() }),
        }),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      setCreatedUrl(data.url);
    } catch {
      setErrorMsg("Error creando el endpoint. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full rounded-xl border border-neutral-700 bg-neutral-800/80 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all";
  const labelCls = "flex items-center gap-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5";

  return (
    <>
      {/* Backdrop — z-50 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">

        {/* Modal */}
        <div className="relative w-full max-w-[500px] bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden">

          {/* Gradient top bar */}
          <div className="h-1 w-full bg-gradient-to-r  from-white via-blue-500 to-blue-800" />

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white via-blue-500 to-blue-800 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20">
                <Brain size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Crear Endpoint</h2>
                <p className="text-[11px] text-neutral-400">Configura tu webhook personalizado</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* Form body */}
          <div className="px-5 py-4 space-y-4">

            {/* Nombre */}
            <div>
              <label className={labelCls}>
                <Link2 size={10} /> Nombre del endpoint
              </label>
              <input
                className={inputCls}
                placeholder="mi-endpoint-produccion"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>

            {/* JSON Schema */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={labelCls}>
                  <FileJson size={10} /> JSON Schema
                </label>
                <button
                  onClick={() => setIaOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Sparkles size={10} />
                  Generar con IA
                </button>
              </div>
              <textarea
                className={`${inputCls} h-32 resize-none font-mono text-xs`}
                placeholder={`{\n  "type": "object",\n  "properties": {}\n}`}
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
              />
            </div>

            {/* Callback URL */}
            <div>
              <label className={labelCls}>
                <Globe size={10} /> Callback URL
              </label>
              <input
                className={inputCls}
                placeholder="https://miweb.com/webhook"
                value={callbackURL}
                onChange={(e) => setCallbackURL(e.target.value)}
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 px-3.5 py-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                <p className="text-xs text-red-400">{errorMsg}</p>
              </div>
            )}

            {/* Success */}
            {createdUrl && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3.5 space-y-2">
                <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5">
                  <Check size={12} /> Endpoint generado correctamente
                </p>
                <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2">
                  <p className="flex-1 break-all font-mono text-xs text-green-300 truncate">
                    {createdUrl}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 text-green-400 hover:text-green-300 transition-colors"
                    title="Copiar URL"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-800 bg-neutral-900/50">
            <button
              onClick={handleCancel}
              className="text-xs text-neutral-400 hover:text-white font-medium px-3 py-2 rounded-xl hover:bg-neutral-800 transition-all"
            >
              Cancelar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIaOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r  from-blue-500 to-blue-800 hover:opacity-90 px-4 py-2 text-xs font-semibold text-white transition-all shadow-lg shadow-violet-500/20"
              >
                <Sparkles size={12} />
                IA Assistant
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-neutral-100 px-5 py-2 text-xs font-bold text-neutral-900 transition-all disabled:opacity-40 shadow-sm"
              >
                {loading ? (
                  <><Loader2 size={12} className="animate-spin" /> Creando…</>
                ) : "Crear endpoint"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IaAssistant — z-[60], siempre encima del modal */}
      <IaAssistant
        open={iaOpen}
        onClose={() => setIaOpen(false)}
        onImplement={handleImplementSchema}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Brain,
  Sparkles,
  X,
  Loader2,
  Copy,
  Check,
  FolderPlus,
  FileJson,
  Globe,
} from "lucide-react";

import IaAssistant from "./IaAssistant";

export default function CreateApiKeyPopup({ open, onClose }) {
  const { user } = useUser();

  const [keyName, setKeyName] = useState("");
  const [jsonSchema, setJsonSchema] = useState("");
  const [callbackURL, setCallbackURL] = useState("");
  const [createdUrl, setCreatedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [iaOpen, setIaOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const resetState = () => {
    setKeyName("");
    setJsonSchema("");
    setCallbackURL("");
    setCreatedUrl("");
    setErrorMsg("");
    setCopied(false);
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleImplementSchema = (schema) => {
    setJsonSchema(schema);
    setIaOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleConfirm = async () => {
    setErrorMsg("");

    if (!keyName.trim()) {
      return setErrorMsg("El nombre no puede estar vacío.");
    }

    if (!jsonSchema.trim()) {
      return setErrorMsg("El JSON Schema no puede estar vacío.");
    }

    if (!callbackURL.trim()) {
      return setErrorMsg("La callback URL no puede estar vacía.");
    }

    let parsedSchema;

    try {
      parsedSchema = JSON.parse(jsonSchema);
    } catch {
      return setErrorMsg(
        "El JSON Schema no es válido. Revisa la sintaxis."
      );
    }

    if (!user?.id) {
      return setErrorMsg("Usuario no encontrado.");
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create/endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          name: keyName.trim(),
          payloadJson: JSON.stringify({
            schema: parsedSchema,
            callbackURL: callbackURL.trim(),
          }),
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setCreatedUrl(data.url);
    } catch {
      setErrorMsg(
        "Error creando el endpoint. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20";

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-md">
        {/* Modal */}
        <div className="glass-card relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 bg-black/30 px-6 py-5 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/20 p-2 text-blue-400">
                <FolderPlus size={20} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Crear endpoint
                </h2>

                <p className="text-xs text-white/50">
                  Configura un nuevo endpoint webhook
                </p>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </header>

          {/* Content */}
          <div className="flex flex-col gap-6 p-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50">
                <FolderPlus size={13} />
                Nombre del endpoint
              </label>

              <input
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="mi-endpoint-produccion"
                className={inputClass}
              />
            </div>

            {/* JSON Schema */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50">
                  <FileJson size={13} />
                  JSON Schema
                </label>

                <button
                  onClick={() => setIaOpen(true)}
                  className="
                    flex items-center gap-1.5 rounded-lg
                    border border-blue-500/20 bg-blue-500/10
                    px-3 py-1.5 text-xs font-medium text-blue-400
                    transition hover:bg-blue-500/20
                  "
                >
                  <Sparkles size={13} />
                  Generar con IA
                </button>
              </div>

              <textarea
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
                placeholder={`{\n  "type": "object"\n}`}
                className="
                  h-52 w-full resize-none rounded-xl
                  border border-white/15 bg-black/30
                  p-4 font-mono text-sm text-white
                  placeholder-white/30 outline-none
                  transition-all
                  focus:border-blue-400/50
                  focus:ring-2 focus:ring-blue-400/20
                "
              />
            </div>

            {/* Callback URL */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/50">
                <Globe size={13} />
                Callback URL
              </label>

              <input
                value={callbackURL}
                onChange={(e) => setCallbackURL(e.target.value)}
                placeholder="https://miweb.com/webhook"
                className={inputClass}
              />
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Success */}
            {createdUrl && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Check size={16} className="text-green-400" />

                  <p className="text-sm font-medium text-green-400">
                    Endpoint generado correctamente
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <span className="truncate font-mono text-sm text-white/80">
                    {createdUrl}
                  </span>

                  <button
                    onClick={handleCopy}
                    className="
                      flex shrink-0 items-center gap-1.5
                      rounded-lg bg-white/5 px-3 py-2
                      text-sm text-white/70 transition
                      hover:bg-white/10 hover:text-white
                    "
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-6 py-5">
            <button
              onClick={handleCancel}
              className="
                rounded-xl border border-white/10
                bg-white/5 px-5 py-2.5 text-sm text-white/70
                transition hover:bg-white/10 hover:text-white
              "
            >
              Cancelar
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIaOpen(true)}
                className="
                  flex items-center gap-2 rounded-xl
                  border border-purple-500/20 bg-purple-500/10
                  px-5 py-2.5 text-sm text-purple-300
                  transition hover:bg-purple-500/20
                "
              >
                <Brain size={15} />
                IA Assistant
              </button>

              <button
                onClick={handleConfirm}
                disabled={loading}
                className="
                  flex items-center gap-2 rounded-xl
                  bg-blue-600 px-5 py-2.5 text-sm
                  font-medium text-white transition
                  hover:bg-blue-700 disabled:opacity-50
                "
              >
                {loading ? (
                  <>
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                    Creando...
                  </>
                ) : (
                  <>
                    <FolderPlus size={15} />
                    Crear endpoint
                  </>
                )}
              </button>
            </div>
          </footer>

          {/* IA Assistant */}
          {iaOpen && (
            <div className="absolute right-full top-0 mr-6">
              <IaAssistant
                open={iaOpen}
                onClose={() => setIaOpen(false)}
                onImplement={handleImplementSchema}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
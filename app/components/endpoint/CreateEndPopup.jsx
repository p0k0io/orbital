"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Brain, Sparkles, X } from "lucide-react";
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

  if (!open) return null;

  const resetState = () => {
    setKeyName("");
    setJsonSchema("");
    setCallbackURL("");
    setCreatedUrl("");
    setErrorMsg("");
  };

  const handleCancel = () => {
    resetState();
    onClose();
  };

  const handleImplementSchema = (schema) => {
    setJsonSchema(schema);
    setIaOpen(false);
  };

  const handleConfirm = async () => {
    setErrorMsg("");

    if (!keyName.trim())
      return setErrorMsg("El nombre no puede estar vacío.");
    if (!jsonSchema.trim())
      return setErrorMsg("El JSON Schema no puede estar vacío.");
    if (!callbackURL.trim())
      return setErrorMsg("La callback URL no puede estar vacía.");

    let parsedSchema;
    try {
      parsedSchema = JSON.parse(jsonSchema);
    } catch {
      return setErrorMsg("El JSON Schema no es válido.");
    }

    if (!user?.id) return setErrorMsg("Usuario no encontrado.");

    setLoading(true);

    try {
      const response = await fetch("/api/create/endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          name: keyName.trim(),
          payloadJson: JSON.stringify({
            schema: parsedSchema,
            callbackURL: callbackURL.trim(),
          }),
        }),
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setCreatedUrl(data.url);
    } catch {
      setErrorMsg("Error creando el endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="relative w-[520px] space-y-5 rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Brain className="text-blue-400" size={20} />
              Create Endpoint
            </h1>

            <button
              onClick={handleCancel}
              className="text-white/40 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <div className="space-y-4 text-sm text-white/80">
            <div>
              <label className="mb-1 block font-medium text-white">
                Endpoint name
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-cyan-400"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-white">
                JSON Schema
              </label>
              <textarea
                className="h-40 w-full resize-none rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 font-mono text-xs outline-none focus:border-cyan-400"
                placeholder={`{\n  "type": "object",\n  "properties": {}\n}`}
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium text-white">
                Callback URL
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 outline-none focus:border-cyan-400"
                placeholder="https://miweb.com/webhook"
                value={callbackURL}
                onChange={(e) => setCallbackURL(e.target.value)}
              />
            </div>

            {errorMsg && (
              <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {errorMsg}
              </p>
            )}

            {createdUrl && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3">
                <p className="mb-1 text-xs text-green-300">
                  Endpoint generado:
                </p>
                <p className="break-all font-mono text-xs text-green-200">
                  {createdUrl}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handleCancel}
                className="rounded-xl bg-neutral-700 px-4 py-2 text-xs text-white hover:bg-neutral-600"
              >
                Cancelar
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => setIaOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                >
                  <Sparkles size={14} />
                  IA Assistant
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="rounded-xl bg-blue-400 px-4 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-40"
                >
                  {loading ? "Creando…" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IA ASSISTANT */}
      <IaAssistant
        open={iaOpen}
        onClose={() => setIaOpen(false)}
        onImplement={handleImplementSchema}
      />
    </>
  );
}

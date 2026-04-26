"use client";

import {
  FolderOpen,
  Pencil,
  Save,
  XCircle,
  Trash,
  FlaskConical,
  Link as LinkIcon,
  Clock,
  Hash,
  Eye, EyeOff, RefreshCw,
  Webhook
} from "lucide-react";
import { useState, useEffect } from "react";
import WebhookStats from "./WebhookStats";
import TestModal from "./TestModal";

import ConfirmActionModal from "../ConfirmActionModal";


export default function EndpointDetails({ selectedCard, handleClose, refresh }) {
   const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);


  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [jsonValue, setJsonValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!selectedCard) return;

    setIsEditing(false);
    setError("");
    setSuccessMsg("");

    setJsonValue(
      JSON.stringify(
        typeof selectedCard.info === "string"
          ? JSON.parse(selectedCard.info)
          : selectedCard.info,
        null,
        2
      )
    );
    console.log("Cargado selectedCard en detalles:", selectedCard);
  }, [selectedCard]);

   const handleRegenerate = async () => {
    try {
      setLoading(true);
      await fetch(`/api/edit/webhook_secret`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCard.id }),
      });
      // aquí normalmente refrescas datos o vuelves a pedir la card
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setIsEditing(false);
    setError("");
    setSuccessMsg("");
    setJsonValue(
      JSON.stringify(
        typeof selectedCard.info === "string"
          ? JSON.parse(selectedCard.info)
          : selectedCard.info,
        null,
        2
      )
    );
  };

  const testEndpoint = () => {
    console.log("Probando endpoint:", selectedCard.id);
    // Aquí puedes abrir un modal o redirigir a una página de prueba
    setIsTestModalOpen(true, selectedCard.id);


  };

  const saveChanges = async () => {
    setError("");
    setSuccessMsg("");

    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonValue);
    } catch {
      setError("El JSON es inválido.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/edit/endpoint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedCard.id, info: parsedJson }),
      });

      if (!res.ok) throw new Error(await res.text());

      setSuccessMsg("JSON actualizado correctamente.");
      setIsEditing(false);
    } catch {
      setError("Error al guardar el JSON.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCard) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/delete/endpoint", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCard.id,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      setConfirmOpen(false);

      if (refresh) await refresh(); // refresca lista en el padre
      handleClose();               // cierra detalles
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (!selectedCard) return null;

  return (
    <div className="glass-card relative flex min-h-[60vh] w-full max-w-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-xl">
      {/* Header */}
      <TestModal
      isOpen={isTestModalOpen}
      endpointId={selectedCard.id}
      onClose={() => setIsTestModalOpen(false)}
    />
      <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-black/30 px-6 py-5 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <div className="rounded-xl bg-blue-500/20 p-2 text-blue-400">
            <FolderOpen size={22} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white">
              {selectedCard.name}
            </h2>
            <p className="text-xs text-white/60">Detalles del endpoint</p>
          </div>
        </div>

        {/* Top right actions with tooltip */}
       <div className="flex shrink-0 items-center gap-2">
          <ActionButton
            icon={FlaskConical}
            label="Probar"
            onClick={testEndpoint}
          />

          {!isEditing && (
            <ActionButton
              icon={Pencil}
              label="Edit info"
              onClick={startEditing}
            />
          )}

          <ActionButton
            icon={Trash}
            label="Eliminar"
            danger
            onClick={() => setConfirmOpen(true)}
          />
        </div>

      </header>

      {/* Content */}
      <div className="grid flex-1 grid-cols-1 gap-8 overflow-hidden p-8 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="flex h-full flex-col gap-6 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5">
          <InfoItem icon={Hash} label="ID" value={selectedCard.id} mono />
          <InfoItem
            icon={Clock}
            label="Creado"
            value={new Date(selectedCard.created_at).toLocaleString()}
          />
          <InfoItem
            icon={LinkIcon}
            label="Request URL"
            value={`http://87.106.125.227:8000/${selectedCard.id}`}
            mono
          />

           <InfoItem
      icon={Webhook}
      label="Secret Webhook"
      mono
      value={
        <div className="flex items-center gap-2">
          <span className="select-all">
            {visible
              ? selectedCard.secret_webhook
              : "••••••••••••••••••••••"}
          </span>

          <button
            onClick={() => setVisible(!visible)}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Mostrar / ocultar"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="text-muted-foreground hover:text-foreground transition disabled:opacity-50"
            aria-label="Regenerar secret"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      }
    />
        </aside>

        {/* JSON */}
        <section className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <div className="shrink-0 border-b border-white/10 px-5 py-4">
            <p className="text-sm font-semibold text-white">JSON del endpoint</p>
          </div>

          <div className="relative flex-1 overflow-hidden p-5">
            {isEditing ? (
              <textarea
                value={jsonValue}
                onChange={(e) => setJsonValue(e.target.value)}
                className="absolute inset-0 h-full w-full resize-none overflow-auto rounded-lg border border-white/20 bg-black/30 p-5 font-mono text-xs leading-5 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <pre className="absolute inset-0 overflow-auto whitespace-pre-wrap rounded-lg bg-black/30 p-5 font-mono text-xs text-white/80">
                {jsonValue}
              </pre>
            )}
          </div>
        </section>
      </div>

      {/* Feedback */}
      {(error || successMsg) && (
        <div className="px-8 pb-3">
          {error && <p className="text-sm text-red-400">{error}</p>}
          {successMsg && <p className="text-sm text-green-400">{successMsg}</p>}
        </div>
      )}
      
      <div className="p-10">

      
      

      <WebhookStats endpointId={selectedCard.id} />


     </div>

      {/* Footer */}
      <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-8 py-5">
        <button
          onClick={handleClose}
          className="rounded-xl bg-gray-600 px-5 py-2.5 text-sm text-white hover:bg-gray-700 transition"
        >
          Cerrar
        </button>

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={cancelEditing}
              className="flex items-center gap-2 rounded-xl bg-gray-500 px-5 py-2.5 text-sm text-white hover:bg-gray-600 transition"
            >
              <XCircle size={16} />
              Cancelar
            </button>

            <button
              onClick={saveChanges}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        )}
      </footer>
      <ConfirmActionModal
        open={confirmOpen}
        message="¿Seguro que quieres eliminar este endpoint? Esta acción no se puede deshacer."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
    
  );
}

function TooltipButton({ children, label, onClick, className }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className={`flex items-center justify-center rounded-xl px-3 py-2 transition ${className}`}
      >
        {children}
      </button>
      <span className="pointer-events-none absolute right-1/2 top-full z-20 mt-2 w-max translate-x-1/2 rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, mono }) {
  const isReactNode = typeof value === "object";

  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-white/10 p-2 text-white/70">
        <Icon size={14} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs uppercase tracking-wide text-white/50">
          {label}
        </p>

        {isReactNode ? (
          <div className={`break-all text-sm text-white ${mono ? "font-mono text-xs" : ""}`}>
            {value}
          </div>
        ) : (
          <p className={`break-all text-sm text-white ${mono ? "font-mono text-xs" : ""}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex items-center justify-center h-10
        overflow-hidden rounded-xl border px-3 py-2
        text-sm font-medium transition-all duration-300 ease-out
        ${danger
          ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        }
        w-10 hover:w-28
      `}
    >
      {/* Icono */}
      <Icon
        size={16}
        className="
          absolute left-1/2 -translate-x-1/2
          transition-all duration-300
          group-hover:left-4 group-hover:translate-x-0
        "
      />

      {/* Texto */}
      <span
        className="
          absolute left-10
          whitespace-nowrap opacity-0
          transition-all duration-300
          group-hover:opacity-100
        "
      >
        {label}
      </span>
    </button>
  );
}





"use client";

import { AlertTriangle, Check, X } from "lucide-react";

export default function ConfirmActionModal({
  open,
  message,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;
  console.log("ConfirmActionModal:", ConfirmActionModal);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/15 bg-neutral-900 shadow-2xl">
        
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <div className="rounded-xl bg-red-500/20 p-2 text-red-400">
            <AlertTriangle size={18} />
          </div>

          <h2 className="text-lg font-semibold text-white">
            Confirmar acción
          </h2>
        </header>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-sm text-white/80 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <footer className="flex justify-end gap-3 border-t border-white/10 bg-black/30 px-6 py-5">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 rounded-xl bg-gray-600 px-4 py-2.5 text-sm text-white hover:bg-gray-700 transition"
          >
            <X size={16} />
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-60"
          >
            <Check size={16} />
            {loading ? "Procesando..." : "Confirmar"}
          </button>
        </footer>
      </div>
    </div>
  );
}
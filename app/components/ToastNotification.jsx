"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

export default function ToastNotification({
  type = "success", // "success" | "error"
  text,
  duration = 4000,
  onClose,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed top-6 left-6 z-50 animate-in slide-in-from-top-5 fade-in">
      <div className="flex items-start gap-3 max-w-sm rounded-2xl border border-white/15 bg-neutral-900 px-5 py-4 shadow-2xl">

        {/* Icon */}
        <div
          className={`rounded-xl p-2 ${
            isSuccess
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {isSuccess ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-sm text-white/90">{text}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="text-white/50 hover:text-white transition"
        >
          <X size={16} />
        </button>

      </div>
    </div>
  );
}
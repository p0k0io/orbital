"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className={`flex flex-col items-center gap-6 max-w-sm w-full text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: "2.5s" }} />
          <div className="absolute w-20 h-20 rounded-full bg-blue-500/10" />
          <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-800/60 flex items-center justify-center shadow-xl shadow-blue-500/10">
            <CheckCircle2 size={28} className="text-blue-400" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Pago completado</p>
          <h1 className="text-2xl font-bold text-white">¡Créditos añadidos!</h1>
          <p className="text-sm text-blue-300/50 leading-relaxed">
            Tu compra se procesó correctamente.<br />Los créditos ya están disponibles en tu cuenta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full">
          <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            Ir al dashboard <ArrowRight size={14} />
          </Link>
          <Link href="/billing" className="flex-1 flex items-center justify-center gap-2 bg-blue-950/80 border border-blue-900/50 hover:bg-blue-900/40 text-blue-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
            <CreditCard size={14} /> Facturación
          </Link>
        </div>

      </div>
    </div>
  );
}

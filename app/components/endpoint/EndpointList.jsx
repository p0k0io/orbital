"use client";

import { Plus } from "lucide-react";

export default function EndpointList({
  endpoints,
  loading,
  errorMsg,
  handleSelect,
  openCreateModal,
  selectedCard
}) {
  return (
    <div className="glass-card p-4 rounded-xl flex flex-col gap-4">

      <button
        onClick={openCreateModal}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 rounded-xl text-white shadow-md"
      >
        Crear nuevo endpoint
      </button>

      {loading && <p className="text-white/60">Cargando...</p>}
      {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}

      <div className="space-y-3">
        {endpoints.map((endpoint) => (
          <div
            key={endpoint.id}
            onClick={() => handleSelect(endpoint)}
            className={`
              p-4 bg-white/10 hover:bg-white/20 rounded-xl 
              cursor-pointer border border-white/20 transition-all
              ${selectedCard?.id === endpoint.id ? "bg-white/30" : ""}
            `}
          >
            <h2 className="text-white text-lg font-semibold">{endpoint.name}</h2>
            <p className="text-white/60 text-sm">/{endpoint.id}</p>
          </div>
        ))}

        {endpoints.length === 0 && !loading && (
          <p className="text-white/40 text-sm">No endpoints.</p>
        )}
      </div>
    </div>
  );
}

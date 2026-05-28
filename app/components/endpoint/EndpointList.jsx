"use client";

import { Plus, Layers, FolderOpen, Hash } from "lucide-react";

export default function EndpointList({
  endpoints,
  loading,
  errorMsg,
  handleSelect,
  openCreateModal,
  selectedCard,
}) {
  return (
    <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-xl">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/30 px-5 py-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-500/20 p-2 text-blue-400">
              <FolderOpen size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Endpoints
              </h2>
              <p className="text-xs text-white/50">
                Manage your endpoints and view details or test them.
              </p>
            </div>
          </div>

          {/* Create button */}
          <button
            onClick={openCreateModal}
            className="
              group flex items-center gap-2 rounded-xl
              border border-blue-500/20 bg-blue-500/10
              px-4 py-2 text-sm font-medium text-blue-400
              transition-all duration-200
              hover:bg-blue-500/20 hover:text-blue-300
            "
          >
            <Plus
              size={16}
              className="transition-transform group-hover:rotate-90"
            />
            New
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-blue-400" />
            <span className="text-sm text-white/60">
              Cargando endpoints...
            </span>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-400">{errorMsg}</p>
          </div>
        )}

        {/* List */}
        {!loading && (
          <div className="flex flex-col gap-2">
            {endpoints.map((endpoint) => {
              const isSelected = selectedCard?.id === endpoint.id;

              return (
                <button
                  key={endpoint.id}
                  onClick={() => handleSelect(endpoint)}
                  className={`
                    group relative overflow-hidden rounded-xl border p-4 text-left
                    transition-all duration-200
                    ${
                      isSelected
                        ? "border-blue-500/30 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }
                  `}
                >
                  {/* Glow */}
                  <div
                    className={`
                      absolute inset-0 opacity-0 transition-opacity duration-300
                      ${
                        isSelected
                          ? "bg-blue-500/5 opacity-100"
                          : "group-hover:opacity-100 bg-white/[0.03]"
                      }
                    `}
                  />

                  <div className="relative flex items-start gap-3">
                    <div
                      className={`
                        rounded-lg p-2 transition-colors
                        ${
                          isSelected
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-white/10 text-white/60 group-hover:text-white/80"
                        }
                      `}
                    >
                      <Hash size={14} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        className={`
                          truncate text-sm font-semibold
                          ${
                            isSelected
                              ? "text-white"
                              : "text-white/80 group-hover:text-white"
                          }
                        `}
                      >
                        {endpoint.name}
                      </h3>

                      <p
                        className={`
                          mt-1 truncate font-mono text-xs
                          ${
                            isSelected
                              ? "text-blue-300/70"
                              : "text-white/40 group-hover:text-white/50"
                          }
                        `}
                      >
                        /{endpoint.id}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Empty state */}
            {endpoints.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-14 text-center">
                <div className="rounded-2xl bg-white/5 p-4 text-white/20">
                  <Layers size={28} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-white/70">
                  No hay endpoints
                </h3>

                <p className="mt-1 text-xs text-white/40">
                  Crea tu primer endpoint para empezar.
                </p>

                <button
                  onClick={openCreateModal}
                  className="
                    mt-5 flex items-center gap-2 rounded-xl
                    border border-blue-500/20 bg-blue-500/10
                    px-4 py-2 text-sm font-medium text-blue-400
                    transition hover:bg-blue-500/20
                  "
                >
                  <Plus size={15} />
                  Crear endpoint
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
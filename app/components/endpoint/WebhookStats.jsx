"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Activity,
  Clock,
} from "lucide-react";

const PREVIEW_SIZE = 5;
const FULL_PAGE_SIZE = 15;

export default function WebhookStats({ endpointId }) {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState({ success: 0, failed: 0 });
  const [averages, setAverages] = useState({
    avgUsage: 0,
    avgResponseTime: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!endpointId) return;
    fetchLogs();
    fetchAverages();
  }, [endpointId, page, expanded]);

  /* =======================
      FETCH LOGS
  ======================= */
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    const limit = expanded ? FULL_PAGE_SIZE : PREVIEW_SIZE;

    try {
      const res = await fetch("/api/get/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint_id: endpointId,
          page,
          limit,
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setLogs(data.webhooks);
      setTotal(data.total);
      setStats(data.stats);
    } catch {
      setError("No se pudieron cargar los logs");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
      FETCH AVERAGES
  ======================= */
 const fetchAverages = async () => {
  try {
    const res = await fetch("/api/get/webhook/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint_id: endpointId,
      }),
    });

    if (!res.ok) throw new Error();

    const data = await res.json();

    setAverages({
      avgUsage: data.avg_credit_use ?? 0,
      avgResponseTime: data.avg_response_time_ms ?? 0,
    });
  } catch {
    // fail silencioso
  }

  };

  const totalPages = Math.ceil(
    total / (expanded ? FULL_PAGE_SIZE : PREVIEW_SIZE)
  );

  const successPercent =
    total > 0 ? (stats.success / total) * 100 : 0;
  const failedPercent =
    total > 0 ? (stats.failed / total) * 100 : 0;

  return (
    <section className="space-y-6">
      {/* ===== Averages ===== */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Average usage */}
        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
            <Activity size={14} />
            Media de consumo
          </div>

          <div className="text-2xl font-semibold text-white">
            {averages.avgUsage.toFixed(2)}
          </div>

          <p className="mt-1 text-xs text-white/40">
            Créditos consumidos por petición
          </p>
        </div>

        {/* Average response time */}
        <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
            <Clock size={14} />
            Tiempo medio de respuesta
          </div>

          <div className="text-2xl font-semibold text-white">
            {averages.avgResponseTime} ms
          </div>

          <p className="mt-1 text-xs text-white/40">
            Promedio de latencia del webhook
          </p>
        </div>
      </div>

      {/* ===== Success vs Failed ===== */}
      <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
        <div className="mb-2 flex justify-between text-xs text-white/70">
          <span>Success</span>
          <span>Failed</span>
        </div>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-neutral-700">
          <div
            className="absolute left-0 top-0 h-full bg-green-500"
            style={{ width: `${successPercent}%` }}
          />
          <div
            className="absolute right-0 top-0 h-full bg-red-500"
            style={{ width: `${failedPercent}%` }}
          />
        </div>

        <div className="mt-3 flex gap-6 text-xs text-white/70">
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-green-400" />
            {stats.success} success
          </span>
          <span className="flex items-center gap-1">
            <XCircle size={14} className="text-red-400" />
            {stats.failed} failed
          </span>
        </div>
      </div>

      {/* ===== Logs ===== */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold text-white">
            Requests al Webhook
          </h3>

          <button
            onClick={() => {
              setExpanded(!expanded);
              setPage(1);
            }}
            className="flex items-center gap-1 text-xs text-white/60 hover:text-white"
          >
            {expanded ? <EyeOff size={14} /> : <Eye size={14} />}
            {expanded ? "Cerrar" : "Ver todo"}
          </button>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-white/60">Cargando…</div>
        ) : error ? (
          <div className="p-5 text-sm text-red-400">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-5 text-sm text-white/60">
            No hay peticiones registradas
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {logs.map((log) => (
              <div
                key={log.id_webhook}
                className="flex items-center justify-between px-5 py-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle size={14} className="text-green-400" />
                  ) : (
                    <XCircle size={14} className="text-red-400" />
                  )}

                  <span className="font-mono text-white">
                    {log.http_status}
                  </span>

                  <span className="text-white/50">
                    {new Date(log.received_at).toLocaleString()}
                  </span>
                </div>

                <span className="text-white/50">
                  Retry: {log.retry_count}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ===== Pagination ===== */}
        {expanded && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 rounded-md bg-neutral-700 px-3 py-1 text-xs text-white disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>

            <span className="text-xs text-white/60">
              Página {page} de {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-md bg-neutral-700 px-3 py-1 text-xs text-white disabled:opacity-40"
            >
              Siguiente
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

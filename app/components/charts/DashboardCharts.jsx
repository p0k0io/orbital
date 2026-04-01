"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Activity, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ── constants ──────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  completed: {
    label: "Completada",
    color: "#4ade80",
    bg: "bg-green-500/15",
    text: "text-green-400",
    border: "border-green-500/30",
    icon: CheckCircle2,
    bar: "#4ade80",
  },
  failed: {
    label: "Fallida",
    color: "#f87171",
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/30",
    icon: XCircle,
    bar: "#f87171",
  },
  processing: {
    label: "Pendiente",
    color: "#fbbf24",
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
    icon: Clock,
    bar: "#fbbf24",
  },
};

const PIE_COLORS = ["#818cf8", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#34d399"];

/* ── custom tooltip ─────────────────────────────────────────────────────────── */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-xs font-bold text-white">{payload[0].name}</p>
      <p className="text-xs text-neutral-400 mt-0.5">
        {payload[0].value} requests
      </p>
    </div>
  );
}

/* ── custom legend ──────────────────────────────────────────────────────────── */

function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-3">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-neutral-400">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── stat card ──────────────────────────────────────────────────────────────── */

function StatCard({ label, value, color, icon: Icon, pct }) {
  return (
    <div className="flex-1 min-w-0 bg-neutral-800/60 border border-neutral-700/50 rounded-2xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold truncate">{label}</p>
        <p className="text-xl font-bold text-white leading-tight">{value}</p>
      </div>
      {pct !== undefined && (
        <span className="ml-auto text-xs font-semibold shrink-0" style={{ color }}>
          {pct.toFixed(1)}%
        </span>
      )}
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────────────────── */

export default function DashboardCharts({ userId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage]         = useState(1);
  const pageSize = 20;

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setRequests(data.requests || []);
      } catch {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const successDistribution = useMemo(() => {
    const counts = { completed: 0, failed: 0, processing: 0 };
    requests.forEach((r) => { if (r.status in counts) counts[r.status]++ });
    return Object.entries(counts).map(([key, value]) => ({
      key, value, ...STATUS_CONFIG[key],
    }));
  }, [requests]);

  const endpointDistribution = useMemo(() => {
    const map = {};
    requests.forEach((r) => {
      const name = r.endpoint?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [requests]);

  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));
  const paginated  = requests.slice((page - 1) * pageSize, page * pageSize);
  const displayed  = expanded ? paginated : paginated.slice(0, 5);

  /* ── loading / empty ── */
  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-neutral-500">
      <div className="w-4 h-4 rounded-full border-2 border-neutral-600 border-t-violet-500 animate-spin" />
      <span className="text-sm">Cargando dashboard…</span>
    </div>
  );

  if (!requests.length) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-500">
      <Activity size={32} className="opacity-30" />
      <p className="text-sm">No hay requests registradas</p>
    </div>
  );

  const total = requests.length;

  return (
    <div className="flex flex-col gap-5 p-4">

      {/* ── stat pills row ── */}
      <div className="flex flex-wrap gap-3">
        <StatCard
          label="Total"
          value={total}
          color="#818cf8"
          icon={TrendingUp}
        />
        {successDistribution.map(({ key, label, color, icon, value }) => (
          <StatCard
            key={key}
            label={label}
            value={value}
            color={color}
            icon={icon}
            pct={total ? (value / total) * 100 : 0}
          />
        ))}
      </div>

      {/* ── distribution bar ── */}
      <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500" />
          <h2 className="text-sm font-bold text-white">Distribución de Estados</h2>
          <span className="ml-auto text-xs text-neutral-500">{total} total</span>
        </div>

        {/* Segmented bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-neutral-900">
          {successDistribution.map(({ key, value, bar }) => {
            const pct = total ? (value / total) * 100 : 0;
            if (!pct) return null;
            return (
              <div
                key={key}
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: bar }}
                title={`${STATUS_CONFIG[key].label}: ${value}`}
              />
            );
          })}
        </div>

        {/* Legend row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          {successDistribution.map(({ key, label, color, value, icon: Icon }) => {
            const pct = total ? (value / total) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-neutral-400">
                  {label}
                  <span className="ml-1.5 font-bold" style={{ color }}>{pct.toFixed(1)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── history + pie ── */}
      <div className="flex flex-col lg:flex-row gap-5">

        {/* History table */}
        <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-5 flex-1 flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-green-400 to-emerald-500" />
            <h2 className="text-sm font-bold text-white">Histórico de Requests</h2>
          </div>

          <div className="flex flex-col gap-1.5">
            {displayed.map((req) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.processing;
              const Icon = cfg.icon;
              return (
                <div
                  key={req.id_request}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-700/40 hover:border-neutral-600/60 hover:bg-neutral-900 transition-all group"
                >
                  {/* Status badge */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shrink-0 ${cfg.bg} ${cfg.border}`}>
                    <Icon size={11} className={cfg.text} />
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.text}`}>
                      {req.status}
                    </span>
                  </div>

                  {/* Endpoint name */}
                  <span className="text-sm text-neutral-200 flex-1 truncate font-medium">
                    {req.endpoint?.name || "Unknown"}
                  </span>

                  {/* Timestamp */}
                  <span className="text-[11px] text-neutral-500 shrink-0 tabular-nums">
                    {new Date(req.timestamp).toLocaleString("es-ES", {
                      day: "2-digit", month: "2-digit",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Expand / collapse */}
          {paginated.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors py-1"
            >
              {expanded ? <><ChevronUp size={13} /> Ver menos</> : <><ChevronDown size={13} /> Ver {paginated.length - 5} más</>}
            </button>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-700/60 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={12} /> Anterior
              </button>
              <span className="text-xs text-neutral-500 tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-neutral-700/60 text-xs text-neutral-300 hover:bg-neutral-700 disabled:opacity-30 transition-all"
              >
                Siguiente <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="bg-neutral-800/60 border border-neutral-700/50 rounded-2xl p-5 lg:w-[380px] shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-indigo-400 to-violet-500" />
            <h2 className="text-sm font-bold text-white">Requests por Endpoint</h2>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={endpointDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={110}
                paddingAngle={3}
                stroke="none"
              >
                {endpointDistribution.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    opacity={0.9}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Center label overlay hint */}
          <p className="text-center text-[11px] text-neutral-600 mt-1">
            {endpointDistribution.length} endpoint{endpointDistribution.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

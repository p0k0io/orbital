"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight,
  Activity, CheckCircle2, XCircle, Clock, TrendingUp,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

/* ── constants ──────────────────────────────────────────────────────────────── */

const STATUS_CONFIG = {
  completed: {
    label: "Completed",
    color: "#60a5fa",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    icon: CheckCircle2,
    bar: "#3b82f6",
  },
  failed: {
    label: "Failed",
    color: "#f87171",
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    icon: XCircle,
    bar: "#ef4444",
  },
  processing: {
    label: "Pending",
    color: "#818cf8",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
    icon: Clock,
    bar: "#6366f1",
  },
};

const PIE_COLORS = ["#3b82f6", "#6366f1", "#60a5fa", "#818cf8", "#93c5fd", "#a5b4fc"];

/* ── custom tooltip ─────────────────────────────────────────────────────────── */

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#171717",
        border: "1px solid rgba(255,255,255,.1)",
      }}
      className="rounded-xl px-3.5 py-2.5 shadow-2xl"
    >
      <p className="text-xs font-bold text-white">{payload[0].name}</p>
      <p className="text-xs mt-0.5 text-white/50">
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
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-white/40">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── section heading ────────────────────────────────────────────────────────── */

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div
        className="w-1 h-4 rounded-full"
        style={{ background: "linear-gradient(180deg, #60a5fa, #3b82f6)" }}
      />
      <h2 className="text-sm font-semibold text-white">{children}</h2>
    </div>
  );
}

/* ── card ───────────────────────────────────────────────────────────────────── */

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      {children}
    </div>
  );
}

/* ── stat card ──────────────────────────────────────────────────────────────── */

function StatCard({ label, value, color, icon: Icon, pct }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl px-4 py-3.5 flex items-center gap-3"
      style={{
        background: "#141414",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        <Icon size={15} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold truncate text-white/30">
          {label}
        </p>
        <p className="text-xl font-black text-white leading-tight">{value}</p>
      </div>
      {pct !== undefined && (
        <span className="ml-auto text-xs font-bold shrink-0" style={{ color }}>
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
    requests.forEach((r) => { if (r.status in counts) counts[r.status]++; });
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

  /* ── loading ── */
  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-white/30">
      <div
        className="w-4 h-4 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(255,255,255,.1)", borderTopColor: "#3b82f6" }}
      />
      <span className="text-sm">Loading dashboard…</span>
    </div>
  );

  /* ── empty ── */
  if (!requests.length) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/25">
      <Activity size={32} />
      <p className="text-sm">No requests recorded yet</p>
    </div>
  );

  const total = requests.length;

  return (
    <div className="flex flex-col gap-4 p-4">

      {/* ── stat row ── */}
      <div className="flex flex-wrap gap-3">
        <StatCard label="Total" value={total} color="#3b82f6" icon={TrendingUp} />
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
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-1 h-4 rounded-full"
            style={{ background: "linear-gradient(180deg, #60a5fa, #6366f1)" }}
          />
          <h2 className="text-sm font-semibold text-white">Status Distribution</h2>
          <span className="ml-auto text-xs text-white/30 tabular-nums">{total} total</span>
        </div>

        <div
          className="w-full h-1.5 rounded-full overflow-hidden flex gap-px"
          style={{ background: "rgba(255,255,255,.04)" }}
        >
          {successDistribution.map(({ key, value, bar }) => {
            const pct = total ? (value / total) * 100 : 0;
            if (!pct) return null;
            return (
              <div
                key={key}
                className="h-full transition-all duration-700"
                style={{ width: `${pct}%`, background: bar }}
                title={`${STATUS_CONFIG[key].label}: ${value}`}
              />
            );
          })}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
          {successDistribution.map(({ key, label, color, value }) => {
            const pct = total ? (value / total) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-white/40">
                  {label}
                  <span className="ml-1.5 font-semibold" style={{ color }}>{pct.toFixed(1)}%</span>
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── history + pie ── */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* History table */}
        <Card className="flex-1 flex flex-col gap-3 min-w-0">
          <SectionHeading>Request History</SectionHeading>

          <div className="flex flex-col gap-1">
            {displayed.map((req) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.processing;
              const Icon = cfg.icon;
              return (
                <div
                  key={req.id_request}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  style={{
                    background: "rgba(255,255,255,.03)",
                    border: "1px solid rgba(255,255,255,.06)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(59,130,246,.06)";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,.15)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,.06)";
                  }}
                >
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shrink-0 ${cfg.bg} ${cfg.border}`}>
                    <Icon size={11} className={cfg.text} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text}`}>
                      {req.status}
                    </span>
                  </div>

                  <span className="text-sm flex-1 truncate font-medium text-white/75">
                    {req.endpoint?.name || "Unknown"}
                  </span>

                  <span className="text-[11px] shrink-0 tabular-nums text-white/25">
                    {new Date(req.timestamp).toLocaleString("en-US", {
                      day: "2-digit", month: "2-digit",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          {paginated.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1.5 text-xs py-1 text-white/30 hover:text-white/60 transition-colors"
            >
              {expanded
                ? <><ChevronUp size={13} /> Show less</>
                : <><ChevronDown size={13} /> Show {paginated.length - 5} more</>
              }
            </button>
          )}

          {totalPages > 1 && (
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-colors disabled:opacity-30 text-white/60 hover:text-white"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                <ChevronLeft size={12} /> Previous
              </button>
              <span className="text-xs tabular-nums text-white/30">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs transition-colors disabled:opacity-30 text-white/60 hover:text-white"
                style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}
              >
                Next <ChevronRight size={12} />
              </button>
            </div>
          )}
        </Card>

        {/* Pie chart */}
        <Card className="lg:w-[380px] shrink-0">
          <SectionHeading>Requests by Endpoint</SectionHeading>

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

          <p className="text-center text-[11px] mt-1 text-white/20 tracking-widest uppercase">
            {endpointDistribution.length} endpoint{endpointDistribution.length !== 1 ? "s" : ""}
          </p>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* ================= CONSTANTS ================= */
const COLORS = ["#82ca9d", "#ff6b6b", "#ffc658", "#ffd46b"];
const PIECOLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const statusStyles = {
  completed: "bg-green-400 text-white font-medium",
  failed: "bg-red-400 text-white font-medium",
  processing: "bg-yellow-400 text-white font-medium",
};

/* ================= COMPONENT ================= */
export default function DashboardCharts({ userId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  /* ================= FETCH ================= */
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Fetch failed");
        }

        const data = await res.json();
        console.log("📊 Raw requests data:", data.requests);

        setRequests(data.requests || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  /* ================= DERIVED DATA ================= */
  const successDistribution = useMemo(() => {
    const completed = requests.filter((r) => r.status === "completed").length;
    const failed = requests.filter((r) => r.status === "failed").length;
    const processing = requests.filter((r) => r.status === "processing").length;

    return [
      { name: "Completadas", value: completed },
      { name: "Fallidas", value: failed },
      { name: "Pendientes", value: processing },
    ];
  }, [requests]);

  const endpointDistribution = useMemo(() => {
    const map = {};
    requests.forEach((r) => {
      const name = r.endpoint?.name || "Unknown";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [requests]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.max(1, Math.ceil(requests.length / pageSize));
  const paginated = requests.slice((page - 1) * pageSize, page * pageSize);
  const displayed = expanded ? paginated : paginated.slice(0, 5);

  /* ================= RENDER ================= */
  if (loading) return <p className="text-white/70 p-4">Cargando dashboard...</p>;
  if (!requests.length) return <p className="text-white/70 p-4">No hay requests</p>;

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* ===== STATUS DISTRIBUTION BAR ===== */}
      <div className="glass-card p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg">
        <h2 className="text-white text-xl font-semibold mb-3">Distribución de Estados</h2>
        <div className="w-full h-6 rounded-full overflow-hidden flex bg-white/20">
          {successDistribution.map((item) => {
            const percentage = requests.length
              ? (item.value / requests.length) * 100
              : 0;
            return (
              <div
                key={item.name}
                className="h-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                    item.name === "Completadas"
                      ? "#7dd97d"
                      : item.name === "Fallidas"
                      ? "#ff8b8b"
                      : "#ffd46b",
                }}
                title={`${item.name}: ${item.value}`}
              />
            );
          })}
        </div>

        <div className="flex justify-around mt-3">
          {successDistribution.map((item) => {
            const percentage = requests.length
              ? (item.value / requests.length) * 100
              : 0;
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      item.name === "Completadas"
                        ? "#7dd97d"
                        : item.name === "Fallidas"
                        ? "#ff8b8b"
                        : "#ffd46b",
                  }}
                />
                <span className="text-white text-sm font-medium">
                  {item.name} ({percentage.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== HISTORICO + PIE ===== */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* ===== HISTORY ===== */}
        <div className="glass-card p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg flex-1 flex flex-col gap-4">
          <h2 className="text-white text-xl font-semibold">Histórico de Requests</h2>
          <div className="flex flex-col gap-3">
            {displayed.map((req) => (
              <div
                key={req.id_request}
                className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition"
              >
                <div
                  className={`px-1 py-1 rounded-md w-28 text-center ${
                    statusStyles[req.status] || "bg-gray-400 text-white"
                  }`}
                >
                  {req.status?.toUpperCase()}
                </div>
                <span className="text-white flex-1 ml-4 font-medium">
                  {req.endpoint?.name || "Unknown"}
                </span>
                <span className="text-white/60 text-sm">
                  {new Date(req.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {paginated.length > 5 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center mt-2 text-white/80 hover:text-white"
            >
              {expanded ? (
                <>
                  Ver menos <FaChevronUp className="ml-2" />
                </>
              ) : (
                <>
                  Ver más <FaChevronDown className="ml-2" />
                </>
              )}
            </button>
          )}

          <div className="flex justify-between mt-4 items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500/80 rounded-xl text-white disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-white/60">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-500/80 rounded-xl text-white disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        {/* ===== PIE CHART ===== */}
        <div className="glass-card p-4 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg flex-1">
          <h2 className="text-white text-xl font-semibold mb-2">Requests por Endpoint</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={endpointDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {endpointDistribution.map((_, index) => (
                  <Cell key={index} fill={PIECOLORS[index % PIECOLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

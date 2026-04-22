"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Check, Minus, Rocket, BookOpen, Zap, ChevronRight,
  FileText, AlignLeft, Layers, TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────
   PRICING LOGIC

   Unit: credits
   Base rate: €0.00675 per 1,000 credits (no discount)

   Discount multipliers per plan:
     Free     × 1.00  (no discount)
     Starter  × 0.70  (−30%)
     Mid      × 0.50  (−50%)
     Business × 0.30  (−70%)

   Verification – Business, 100K docs × 1,000 credits/doc:
     totalCredits = 100,000,000
     included     = 50,000,000
     excess       = 50,000,000  →  50,000 K
     excessCost   = 50,000 × €0.00675 × 0.30  = €101.25
     base         = €64.99
     TOTAL        ≈ €166  ✓  (~€160 target)
───────────────────────────────────────── */
const BASE_RATE_PER_1K = 0.00675;

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    badge: null,
    highlight: false,
    color: "rgba(255,255,255,.04)",
    borderColor: "rgba(255,255,255,.08)",
    desc: "Explore and prototype with zero commitment.",
    bullets: [
      "150K credits included",
      "1 API Key",
      "3 Endpoints",
    ],
    iafunctions: false,
    support: "Community",
    cta: "Start for free",
    ctaHref: "/sign-up",
    includedCredits: 0,
    discountMult: 1.0,
  },
  {
    id: "starter",
    name: "Starter",
    price: 6.99,
    badge: null,
    highlight: false,
    color: "rgba(255,255,255,.04)",
    borderColor: "rgba(255,255,255,.1)",
    desc: "For production projects with moderate volume.",
    bullets: [
      "Unlimited requests",
      "Unlimited API Keys",
      "10 Endpoints",
      "2 M credits included",
      "−30% discount on excess credits",
      "IA Functions included",
    ],
    iafunctions: false,
    support: "Email",
    cta: "Start with Starter",
    ctaHref: "/sign-up?plan=starter",
    includedCredits: 2_000_000,
    discountMult: 0.70,
  },
  {
    id: "mid",
    name: "Mid",
    price: 16.99,
    badge: "Most popular",
    highlight: true,
    color: "rgba(37,99,235,.13)",
    borderColor: "rgba(59,130,246,.35)",
    desc: "For teams with high volume and advanced features.",
    bullets: [
      "Unlimited requests",
      "Unlimited API Keys",
      "Unlimited Endpoints",
      "10 M credits included",
      "−50% discount on excess credits",
      "IA Functions included",
    ],
    iafunctions: true,
    support: "Priority",
    cta: "Start with Mid",
    ctaHref: "/sign-up?plan=mid",
    includedCredits: 10_000_000,
    discountMult: 0.50,
  },
  {
    id: "business",
    name: "Business",
    price: 64.99,
    badge: null,
    highlight: false,
    color: "rgba(255,255,255,.04)",
    borderColor: "rgba(255,255,255,.1)",
    desc: "For enterprises with massive volumes and dedicated support.",
    bullets: [
      "Unlimited requests",
      "Unlimited API Keys",
      "Unlimited Endpoints",
      "50 M credits included",
      "−70% discount on excess credits",
      "IA Functions included",
    ],
    iafunctions: true,
    support: "Dedicated + SLA 99.9%",
    cta: "Contact sales",
    ctaHref: "mailto:hello@orbital.com",
    includedCredits: 50_000_000,
    discountMult: 0.30,
  },
];

function calcTotal(plan, totalCredits) {
  const excessCredits = Math.max(0, totalCredits - plan.includedCredits);
  const excessCost    = (excessCredits / 1000) * BASE_RATE_PER_1K * plan.discountMult;
  const total         = plan.price + excessCost;
  return { excessCredits, excessCost, total };
}

const COMPARE_ROWS = [
  { label: "API Keys",           key: "apikeys"     },
  { label: "Endpoints",         key: "endpoints"   },
  { label: "Included credits",  key: "pages"       },
  { label: "IA Functions",      key: "iafunctions" },
  { label: "Excess discount",   key: "discount"    },
  { label: "Support",           key: "support"     },
];

const COMPARE_DATA = {
  free:     { apikeys: "1",         endpoints: "3",         pages: "—",    iafunctions: false, discount: "—",    support: "Community"      },
  starter:  { apikeys: "Unlimited", endpoints: "10",        pages: "2 M",  iafunctions: false, discount: "−30%", support: "Email"           },
  mid:      { apikeys: "Unlimited", endpoints: "Unlimited", pages: "10 M", iafunctions: true,  discount: "−50%", support: "Priority"        },
  business: { apikeys: "Unlimited", endpoints: "Unlimited", pages: "50 M", iafunctions: true,  discount: "−70%", support: "Dedicated + SLA" },
};

function buildVolumeRow(label, credits) {
  const vals = {};
  PLANS.forEach(p => {
    const { total } = calcTotal(p, credits);
    vals[p.id] = `€${total.toFixed(2)}`;
  });
  return { vol: label, credits, ...vals };
}

const VOLUME_ROWS = [
  buildVolumeRow("1 M credits",   1_000_000),
  buildVolumeRow("5 M credits",   5_000_000),
  buildVolumeRow("10 M credits", 10_000_000),
];

const DOC_DENSITIES = [
  { id: "small",  label: "Small",  sublabel: "600 credits / doc",   credits: 600,  Icon: FileText  },
  { id: "medium", label: "Medium", sublabel: "1,000 credits / doc", credits: 1000, Icon: AlignLeft },
  { id: "large",  label: "Large",  sublabel: "2,000 credits / doc", credits: 2000, Icon: Layers    },
];

/* ── STARFIELD ── */
function Starfield() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.1,
      a: Math.random() * Math.PI * 2,
      speed: 0.004 + Math.random() * 0.006,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.speed;
        const alpha = 0.1 + 0.45 * Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,215,255,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

function GridOverlay() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: "linear-gradient(rgba(59,130,246,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,.022) 1px,transparent 1px)",
      backgroundSize: "72px 72px",
    }} />
  );
}

function Label({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
        fontSize: 10, letterSpacing: "0.22em", fontWeight: 500, color: "rgba(96,165,250,.75)",
      }}
    >
      <span style={{ width: 20, height: 1, background: "rgba(59,130,246,.5)", display: "inline-block" }} />
      {children}
      <span style={{ width: 20, height: 1, background: "rgba(59,130,246,.5)", display: "inline-block" }} />
    </motion.span>
  );
}

function Cell({ val, highlight }) {
  const bg = highlight ? "rgba(37,99,235,.06)" : "transparent";
  if (val === true)
    return (
      <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: "50%", background: "rgba(37,99,235,.25)", border: "1px solid rgba(59,130,246,.4)" }}>
          <Check style={{ width: 12, height: 12, color: "#60a5fa" }} />
        </span>
      </div>
    );
  if (val === false)
    return (
      <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
        <Minus style={{ width: 16, height: 16, color: "rgba(255,255,255,.2)" }} />
      </div>
    );
  return (
    <div style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center", background: bg }}>
      <span style={{ textAlign: "center", fontSize: 13, color: highlight ? "#93c5fd" : "rgba(255,255,255,.65)" }}>{val}</span>
    </div>
  );
}

function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      style={{
        borderRadius: 12, overflow: "hidden",
        border: "1px solid rgba(255,255,255,.08)",
        background: open ? "rgba(37,99,235,.07)" : "rgba(255,255,255,.025)",
        transition: "background 0.3s",
      }}
    >
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", textAlign: "left", gap: 16, background: "none", border: "none", cursor: "pointer" }}>
        <span style={{ fontWeight: 500, fontSize: 14, color: "rgba(255,255,255,.8)" }}>{q}</span>
        <ChevronRight style={{ width: 16, height: 16, flexShrink: 0, color: "rgba(255,255,255,.35)", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s" }} />
      </button>
      <div style={{ overflow: "hidden", maxHeight: open ? 220 : 0, transition: "max-height 0.3s" }}>
        <p style={{ padding: "0 24px 20px", fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,.45)", margin: 0 }}>{a}</p>
      </div>
    </motion.div>
  );
}

/* ── COST CALCULATOR ── */
function CostCalculator() {
  const [docCount, setDocCount] = useState(10000);
  const [density,  setDensity]  = useState("medium");

  const selectedDensity = DOC_DENSITIES.find(d => d.id === density);
  const totalCredits    = docCount * selectedDensity.credits;

  const results = useMemo(() =>
    PLANS.map(plan => {
      const { excessCredits, excessCost, total } = calcTotal(plan, totalCredits);
      return { ...plan, excessCredits, excessCost, total };
    }),
    [totalCredits]
  );

  const cheapest = results.reduce((a, b) => a.total < b.total ? a : b);

  const fmtC = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K`;
    return n.toLocaleString();
  };

  const MIN_DOCS = 100;
  const MAX_DOCS = 200_000;
  const pct = ((docCount - MIN_DOCS) / (MAX_DOCS - MIN_DOCS) * 100).toFixed(2);

  return (
    <section style={{ position: "relative", padding: "80px 16px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", pointerEvents: "none", width: 700, height: 400, background: "radial-gradient(ellipse,rgba(99,102,241,.07),transparent 70%)", filter: "blur(40px)" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 48 }}>
        <Label>COST CALCULATOR</Label>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontWeight: 900, letterSpacing: "-0.025em", fontSize: "clamp(28px,4vw,48px)", margin: "0 0 12px" }}
        >
          Estimate your monthly cost
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .1 }}
          style={{ fontSize: 16, color: "rgba(255,255,255,.38)", fontWeight: 300, margin: 0 }}
        >
          Adjust document count and density to see a realistic cost estimate across all plans.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{
          borderRadius: 24, border: "1px solid rgba(255,255,255,.1)",
          background: "rgba(255,255,255,.03)", backdropFilter: "blur(20px)",
          padding: "36px 36px 28px",
        }}
      >
        <style>{`
          .orbital-slider{width:100%;height:6px;border-radius:3px;appearance:none;-webkit-appearance:none;cursor:pointer;outline:none;}
          .orbital-slider::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#3b82f6);border:2px solid rgba(255,255,255,.35);box-shadow:0 0 14px rgba(59,130,246,.7);cursor:pointer;}
          .orbital-slider::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#3b82f6);border:2px solid rgba(255,255,255,.35);cursor:pointer;}
        `}</style>

        {/* Controls row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 36 }}>

          {/* Density */}
          <div>
            <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,.4)", fontWeight: 600, margin: "0 0 14px", textTransform: "uppercase" }}>
              Document density
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {DOC_DENSITIES.map(d => {
                const active = density === d.id;
                const { Icon } = d;
                return (
                  <button key={d.id} onClick={() => setDensity(d.id)} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "13px 16px",
                    borderRadius: 12,
                    border: `1px solid ${active ? "rgba(59,130,246,.55)" : "rgba(255,255,255,.07)"}`,
                    background: active ? "rgba(37,99,235,.18)" : "rgba(255,255,255,.025)",
                    cursor: "pointer", textAlign: "left",
                    boxShadow: active ? "0 0 18px rgba(37,99,235,.2)" : "none",
                    transition: "all 0.2s",
                  }}>
                    <span style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                      background: active ? "rgba(37,99,235,.35)" : "rgba(255,255,255,.06)",
                      border: `1px solid ${active ? "rgba(59,130,246,.4)" : "rgba(255,255,255,.08)"}`,
                    }}>
                      <Icon style={{ width: 16, height: 16, color: active ? "#93c5fd" : "rgba(255,255,255,.4)" }} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14, color: active ? "#93c5fd" : "rgba(255,255,255,.8)", margin: 0 }}>{d.label}</p>
                      <p style={{ fontSize: 11, color: "rgba(255,255,255,.32)", margin: "2px 0 0" }}>{d.sublabel}</p>
                    </div>
                    {active && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", boxShadow: "0 0 8px #3b82f6", flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slider */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
              <p style={{ fontSize: 11, letterSpacing: "0.15em", color: "rgba(255,255,255,.4)", fontWeight: 600, margin: 0, textTransform: "uppercase" }}>
                Documents / month
              </p>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 38, fontWeight: 900, color: "white", letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {docCount.toLocaleString()}
                </span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.3)", marginLeft: 6 }}>docs</span>
              </div>
            </div>

            {/* Credit pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18, alignSelf: "flex-end",
              padding: "5px 12px", borderRadius: 999,
              background: "rgba(37,99,235,.12)", border: "1px solid rgba(59,130,246,.2)",
            }}>
              <TrendingUp style={{ width: 12, height: 12, color: "#60a5fa" }} />
              <span style={{ fontSize: 12, color: "rgba(147,197,253,.9)" }}>
                {fmtC(totalCredits)} total credits
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.22)" }}>
                ({docCount.toLocaleString()} × {selectedDensity.credits.toLocaleString()})
              </span>
            </div>

            <input
              type="range"
              className="orbital-slider"
              min={MIN_DOCS} max={MAX_DOCS} step={100}
              value={docCount}
              onChange={e => setDocCount(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right,#3b82f6 0%,#3b82f6 ${pct}%,rgba(255,255,255,.1) ${pct}%,rgba(255,255,255,.1) 100%)`,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)" }}>100</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,.2)" }}>200,000</span>
            </div>

            {/* Quick-select */}
            <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
              {[1000, 5000, 10000, 50000, 100000].map(v => (
                <button key={v} onClick={() => setDocCount(v)} style={{
                  padding: "4px 12px", borderRadius: 999, fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                  border: `1px solid ${docCount === v ? "rgba(59,130,246,.5)" : "rgba(255,255,255,.1)"}`,
                  background: docCount === v ? "rgba(37,99,235,.25)" : "rgba(255,255,255,.04)",
                  color: docCount === v ? "#93c5fd" : "rgba(255,255,255,.4)",
                  fontWeight: docCount === v ? 700 : 400,
                }}>
                  {v.toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12,
          paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.07)",
        }}>
          {results.map(plan => {
            const isBest = plan.id === cheapest.id;
            return (
              <div key={plan.id} style={{
                position: "relative", borderRadius: 16, padding: "20px 18px",
                border: `1px solid ${isBest ? "rgba(59,130,246,.55)" : plan.highlight ? "rgba(59,130,246,.2)" : "rgba(255,255,255,.07)"}`,
                background: isBest ? "rgba(37,99,235,.2)" : plan.highlight ? "rgba(37,99,235,.08)" : "rgba(255,255,255,.03)",
                boxShadow: isBest ? "0 0 32px rgba(37,99,235,.28)" : "none",
                transition: "all 0.3s",
              }}>
                {isBest && (
                  <span style={{
                    position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg,#3b82f6,#6366f1)",
                    color: "white", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em",
                    padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap", textTransform: "uppercase",
                  }}>
                    Best value
                  </span>
                )}

                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: plan.highlight ? "#60a5fa" : "rgba(255,255,255,.38)", textTransform: "uppercase", margin: "0 0 8px" }}>
                  {plan.name}
                </p>
                <p style={{ fontSize: 28, fontWeight: 900, color: isBest ? "#93c5fd" : "white", letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>
                  €{plan.total.toFixed(2)}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,.25)", margin: "3px 0 14px" }}>/month est.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>Base plan</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>€{plan.price.toFixed(2)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>Included</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600 }}>{fmtC(plan.includedCredits)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)" }}>Excess cost</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: plan.excessCost > 0 ? "rgba(252,165,165,.85)" : "rgba(134,239,172,.85)" }}>
                      {plan.excessCost > 0 ? `+€${plan.excessCost.toFixed(2)}` : "Within limit"}
                    </span>
                  </div>
                  {plan.excessCredits > 0 && (
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,.2)", margin: "2px 0 0", lineHeight: 1.5 }}>
                      {fmtC(plan.excessCredits)} excess @ €{(BASE_RATE_PER_1K * plan.discountMult).toFixed(5)}/1K
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "rgba(255,255,255,.18)" }}>
          * Estimates are indicative. Included credits reset monthly. Excess billed at each plan's discounted rate (base €0.00675 / 1K credits).
        </p>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function PricingPage() {

  return (
    <div style={{ position: "relative", color: "white", minHeight: "100vh", overflowX: "hidden", fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      <Starfield />
      <GridOverlay />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", borderRadius: "50%", width: 600, height: 400, top: -120, left: -100, background: "radial-gradient(ellipse,#172554,transparent 70%)", filter: "blur(72px)", opacity: 0.6 }} />
        <div style={{ position: "absolute", borderRadius: "50%", width: 500, height: 340, top: "55%", right: -80, background: "radial-gradient(ellipse,#0c4a6e,transparent 70%)", filter: "blur(72px)", opacity: 0.5 }} />
      </div>

      <div style={{ position: "relative", zIndex: 10 }}>

        {/* ── HERO ── */}
        <section style={{ paddingTop: 144, paddingBottom: 80, textAlign: "center", paddingLeft: 24, paddingRight: 24 }}>
          <Label>PRICING</Label>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}
            style={{ fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 20, fontSize: "clamp(40px,7vw,80px)" }}
          >
            Simple and{" "}
            <span style={{ display: "inline-block", background: "linear-gradient(130deg,#93c5fd 0%,#3b82f6 45%,#6366f1 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              predictable.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .1 }}
            style={{ maxWidth: 520, margin: "0 auto 0", lineHeight: 1.7, fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,.42)", fontWeight: 300 }}
          >
            A flat monthly base plan + pay-per-credit beyond the included allowance.
            No surprises, no lock-in.
          </motion.p>
        </section>

        {/* ── PLAN CARDS ── */}
        <section style={{ padding: "0 16px 112px", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 20 }}>
            {PLANS.map((plan, i) => {
              const displayPrice = plan.price === 0 ? 0 : plan.price.toFixed(2);
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    position: "relative", display: "flex", flexDirection: "column", borderRadius: 16, padding: 28,
                    background: plan.color, border: `1px solid ${plan.borderColor}`, backdropFilter: "blur(16px)",
                    boxShadow: plan.highlight ? "0 0 52px rgba(37,99,235,.22),0 0 0 1px rgba(59,130,246,.12)" : undefined,
                  }}
                >
                  {plan.badge && (
                    <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 16px", borderRadius: 9999, fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", background: "linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow: "0 4px 16px rgba(37,99,235,.6)", color: "white" }}>
                        <Zap style={{ width: 12, height: 12 }} /> {plan.badge}
                      </span>
                    </div>
                  )}

                  <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", marginBottom: 16, textTransform: "uppercase", color: plan.highlight ? "#93c5fd" : "rgba(255,255,255,.4)" }}>
                    {plan.name}
                  </p>

                  <div style={{ marginBottom: 4, display: "flex", alignItems: "flex-end", gap: 4 }}>
                    {displayPrice === 0 ? (
                      <span style={{ fontSize: 36, fontWeight: 900, color: "white", letterSpacing: "-0.04em" }}>Free</span>
                    ) : (
                      <>
                        <span style={{ fontWeight: 900, color: "white", fontSize: 52, letterSpacing: "-0.04em", lineHeight: 1 }}>€{displayPrice}</span>
                        <span style={{ color: "rgba(255,255,255,.35)", fontSize: 13, marginBottom: 8 }}>/mo</span>
                      </>
                    )}
                  </div>

                  <p style={{ fontSize: 12, marginBottom: 24, lineHeight: 1.6, color: "rgba(255,255,255,.38)" }}>{plan.desc}</p>

                  <ul style={{ flex: 1, listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {plan.bullets.map((b, bi) => (
                      <li key={bi} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <Check style={{ width: 14, height: 14, marginTop: 2, flexShrink: 0, color: plan.highlight ? "#60a5fa" : "rgba(96,165,250,.7)" }} />
                        <span style={{ fontSize: 13, color: b.includes("−") ? "#86efac" : "rgba(255,255,255,.65)" }}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <button style={{
                    width: "100%", padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer",
                    border: "none", transition: "all 0.3s",
                    ...(plan.highlight
                      ? { background: "linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow: "0 4px 24px rgba(37,99,235,.5)", color: "white" }
                      : { background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.72)" }
                    ),
                  }}>
                    {plan.highlight && <Rocket style={{ width: 16, height: 16 }} />}
                    {plan.cta}
                    {!plan.highlight && <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── COST CALCULATOR ── */}
        <CostCalculator />

        {/* ── COMPARISON TABLE ── */}
        <section style={{ position: "relative", padding: "80px 16px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)", pointerEvents: "none", width: 600, height: 300, background: "radial-gradient(ellipse,rgba(29,78,216,.07),transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 56 }}>
            <Label>COMPARE PLANS</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontWeight: 900, letterSpacing: "-0.025em", fontSize: "clamp(28px,4vw,48px)", margin: 0 }}
            >
              Everything included in each plan
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.025)", backdropFilter: "blur(16px)" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ padding: 20 }} />
              {PLANS.map(p => (
                <div key={p.id} style={{ padding: 20, textAlign: "center", background: p.highlight ? "rgba(37,99,235,.12)" : "transparent" }}>
                  <p style={{ fontWeight: 700, color: "white", fontSize: 14, margin: "0 0 2px" }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,.32)", margin: 0 }}>{p.price === 0 ? "Free" : `€${p.price}/mo`}</p>
                </div>
              ))}
            </div>
            {COMPARE_ROWS.map(row => (
              <div key={row.key} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,.52)" }}>{row.label}</span>
                </div>
                {PLANS.map(p => <Cell key={p.id} val={COMPARE_DATA[p.id][row.key]} highlight={p.highlight} />)}
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── VOLUME TABLE ── */}
        <section style={{ position: "relative", padding: "20px 16px 80px", maxWidth: 960, margin: "0 auto" }}>
          <div style={{ position: "relative", zIndex: 10, textAlign: "center", marginBottom: 48 }}>
            <Label>VOLUME PRICING</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontWeight: 900, letterSpacing: "-0.025em", fontSize: "clamp(28px,4vw,48px)", margin: "0 0 12px" }}
            >
              Real cost by volume
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .1 }}
              style={{ fontSize: 16, color: "rgba(255,255,255,.38)", fontWeight: 300, margin: 0 }}
            >
              Estimated total including base plan + excess billed at each plan's discounted rate.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.025)", backdropFilter: "blur(16px)" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ padding: 20 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,.3)", letterSpacing: "0.12em" }}>VOLUME</span>
              </div>
              {PLANS.map(p => (
                <div key={p.id} style={{ padding: 20, textAlign: "center", background: p.highlight ? "rgba(37,99,235,.12)" : "transparent" }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: "white", margin: 0 }}>{p.name}</p>
                </div>
              ))}
            </div>
            {VOLUME_ROWS.map(row => (
              <div key={row.vol} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: 500, fontSize: 13, color: "rgba(255,255,255,.65)" }}>{row.vol}</span>
                </div>
                {PLANS.map(p => (
                  <div key={p.id} style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center", background: p.highlight ? "rgba(37,99,235,.06)" : "transparent" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: p.highlight ? "#93c5fd" : "rgba(255,255,255,.62)" }}>{row[p.id]}</span>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: "rgba(255,255,255,.22)" }}>
            * Credits included in the plan are not billed. Excess charged at each plan's discounted rate (base: €0.00675 per 1K credits).
          </p>
        </section>

        {/* ── FAQ ── */}
        <section style={{ position: "relative", padding: "40px 16px 80px", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <Label>FAQ</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontWeight: 900, letterSpacing: "-0.025em", fontSize: "clamp(28px,4vw,44px)", margin: 0 }}
            >
              Frequently asked questions
            </motion.h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { q: 'What counts as a "page"?', a: "One page equals one side of a PDF document or one individual image. A 10-page PDF counts as 10 processed pages. Credits consumed depend on the document density tier you select." },
              { q: "Do included credits expire?", a: "Credits included in your monthly plan refresh each cycle and don't roll over. Credits purchased separately never expire." },
              { q: "Can I change plans at any time?", a: "Yes. Upgrades apply immediately on a pro-rated basis. Downgrades take effect at the start of your next billing cycle." },
              { q: "What are IA Functions?", a: "Intelligent transformations applied on extracted JSON: summaries, classifications, entity extraction, and custom logic. Available from the Mid plan onwards." },
              { q: "Is there a minimum commitment?", a: "No. All plans are billed monthly and can be cancelled at any time. There are no annual contracts or lock-in periods." },
              { q: "How is the excess rate calculated?", a: "The base rate is €0.00675 per 1,000 credits. Starter gets −30%, Mid gets −50%, Business gets −70% off that rate. The Free plan pays the full base rate." },
            ].map((item, i) => <FaqItem key={i} q={item.q} a={item.a} delay={i * 0.08} />)}
          </div>
        </section>

        {/* ── FOOTER CTA ── */}
        <section style={{ position: "relative", padding: "120px 24px", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ borderRadius: "50%", width: 500, height: 500, background: "radial-gradient(circle,rgba(29,78,216,.1) 0%,transparent 65%)", filter: "blur(20px)" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            {[160, 240, 320].map((r, i) => (
              <motion.div key={i} style={{ position: "absolute", borderRadius: "50%", width: r * 2, height: r * 2, border: "1px solid rgba(59,130,246,0.07)" }}
                animate={{ rotate: 360 }} transition={{ duration: 30 + i * 12, repeat: Infinity, ease: "linear" }} />
            ))}
          </div>
          <div style={{ position: "relative", zIndex: 10, maxWidth: 560, margin: "0 auto" }}>
            <Label>GET STARTED TODAY</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 20, fontSize: "clamp(32px,5vw,60px)" }}
            >
              Ready to orbit?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: .1 }}
              style={{ marginBottom: 48, fontSize: 17, color: "rgba(255,255,255,.38)", fontWeight: 300 }}
            >
              100 free requests. No credit card. Cancel anytime.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .18 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}
            >
              <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 40px", borderRadius: 9999, fontWeight: 700, color: "white", background: "linear-gradient(135deg,#3b82f6,#2563eb)", boxShadow: "0 8px 40px rgba(37,99,235,.6),inset 0 0 0 1px rgba(147,197,253,.2)", fontSize: 16, border: "none", cursor: "pointer" }}>
                <Rocket style={{ width: 20, height: 20 }} /> Start for free
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 32px", borderRadius: 9999, fontWeight: 500, fontSize: 16, cursor: "pointer", border: "1px solid rgba(255,255,255,.13)", background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.55)" }}>
                <BookOpen style={{ width: 16, height: 16 }} /> View Docs
              </button>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, BookOpen, Code2, Clock, ChevronRight,
  Check, ExternalLink, Users, Receipt, Scale,
  Workflow, Layers, TrendingUp, Home, Globe, Box,
  Building2, GitBranch, Server, FileCode, Zap,
} from "lucide-react";

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
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 0.9,
      a: Math.random() * Math.PI * 2, speed: 0.003 + Math.random() * 0.004,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a += s.speed;
        const alpha = 0.06 + 0.28 * Math.abs(Math.sin(s.a));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,205,240,${alpha})`;
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
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: "linear-gradient(rgba(71,85,105,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(71,85,105,.06) 1px,transparent 1px)",
      backgroundSize: "72px 72px",
    }} />
  );
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const CATEGORIES = ["All", "HR", "Finance", "Legal", "No-Code", "Data Pipelines"];

const IMPLEMENTATIONS = [
  {
    id: "hr-recruitment",
    category: "HR",
    difficulty: "Beginner",
    time: "30 min",
    stack: ["Node.js", "Express"],
    StackIcons: [Server, GitBranch],
    Icon: Users,
    title: "HR Recruitment Pipeline",
    subtitle: "Auto-parse incoming CVs into a normalized candidate schema",
    description: "Build a fully automated pipeline that watches a shared inbox or Google Drive folder, extracts structured candidate data from uploaded CVs, and seeds your ATS or database automatically. Includes deduplication logic and Slack notifications.",
    outcomes: [
      "Parse CVs from 20+ formats into a unified schema",
      "Auto-tag candidates by skills and experience level",
      "Push structured data to Greenhouse, Lever, or any ATS",
      "Slack notification on each successful parse",
    ],
    featured: true,
  },
  {
    id: "invoice-sync",
    category: "Finance",
    difficulty: "Intermediate",
    time: "45 min",
    stack: ["FastAPI", "PostgreSQL"],
    StackIcons: [Zap, Building2],
    Icon: Receipt,
    title: "E-commerce Invoice Sync",
    subtitle: "Extract and normalize invoices into your accounting system",
    description: "Receive supplier invoices via email attachment or upload portal, extract line items, totals, VAT, and vendor details, then push structured records to QuickBooks, Xero, or your ERP. Handles multi-currency and multi-language invoices.",
    outcomes: [
      "Extract line items, totals, and VAT from any invoice format",
      "Multi-currency normalization",
      "Auto-match to existing vendor records",
      "Push to QuickBooks or Xero via their APIs",
    ],
    featured: true,
  },
  {
    id: "legal-contracts",
    category: "Legal",
    difficulty: "Intermediate",
    time: "1 hour",
    stack: ["Django", "Celery"],
    StackIcons: [Code2, Layers],
    Icon: Scale,
    title: "Legal Contract Analysis",
    subtitle: "Extract parties, dates, and key clauses from contracts",
    description: "Upload contracts in PDF or DOCX format. Orbital extracts parties, effective dates, termination clauses, payment terms, and jurisdiction. Results are stored in a searchable database with expiration alerts.",
    outcomes: [
      "Identify all parties and signatories automatically",
      "Extract key dates and trigger calendar reminders",
      "Flag non-standard clauses for legal review",
      "Full-text search across extracted contract data",
    ],
    featured: false,
  },
  {
    id: "n8n-nocode",
    category: "No-Code",
    difficulty: "Beginner",
    time: "15 min",
    stack: ["n8n"],
    StackIcons: [Workflow],
    Icon: Workflow,
    title: "No-Code Document Pipeline",
    subtitle: "Connect Orbital to 400+ apps without writing code",
    description: "Use the pre-built n8n workflow template to connect Orbital to any trigger (email, Google Drive, Dropbox, webhook) and route the extracted JSON to any destination (Airtable, Google Sheets, Notion, Slack, and more).",
    outcomes: [
      "Import one JSON template, go live in 15 minutes",
      "Connect to 400+ apps natively via n8n",
      "Visual workflow editor — no code required",
      "Built-in error handling and retry logic",
    ],
    featured: true,
  },
  {
    id: "make-automation",
    category: "No-Code",
    difficulty: "Beginner",
    time: "20 min",
    stack: ["Make"],
    StackIcons: [Layers],
    Icon: Layers,
    title: "Make Scenario Automation",
    subtitle: "Trigger Orbital from any Make-connected source",
    description: "A ready-to-import Make scenario that listens for file uploads, forwards them to Orbital, and routes the structured JSON to your preferred destination. Includes error handling branches and Slack/email notifications.",
    outcomes: [
      "Ready-to-import scenario blueprint",
      "Connect 5,000+ Make-compatible apps",
      "Automatic retry on webhook failure",
      "Error notification via Slack or email",
    ],
    featured: false,
  },
  {
    id: "financial-ocr",
    category: "Finance",
    difficulty: "Intermediate",
    time: "1 hour",
    stack: ["Laravel", "Horizon"],
    StackIcons: [FileCode, Zap],
    Icon: TrendingUp,
    title: "Financial Document OCR",
    subtitle: "Extract KPIs from bank statements and balance sheets",
    description: "Process bank statements, P&L reports, and balance sheets uploaded by clients. Extract key financial metrics, normalize them into a standard schema, and push to your analytics platform or BI tool.",
    outcomes: [
      "Extract revenue, EBITDA, and cash flow figures",
      "Multi-period comparison normalization",
      "Push to Tableau, Power BI, or Looker",
      "Automated anomaly flagging on extracted values",
    ],
    featured: false,
  },
  {
    id: "real-estate",
    category: "Data Pipelines",
    difficulty: "Intermediate",
    time: "45 min",
    stack: ["Express.js", "MongoDB"],
    StackIcons: [GitBranch, Building2],
    Icon: Home,
    title: "Real Estate Listing Parser",
    subtitle: "Normalize property listings from PDFs and brochures",
    description: "Extract property details, pricing, square footage, amenities, and agent info from uploaded listing PDFs. Push structured data to your CRM or listings database in real time.",
    outcomes: [
      "Extract 30+ property attributes per listing",
      "Geocode addresses and enrich with mapping data",
      "Auto-match to existing property records",
      "Push to Salesforce CRM or custom database",
    ],
    featured: false,
  },
];

/* ─────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const cfg = {
    Beginner:     { color: "rgba(140,180,150,.85)", bg: "rgba(50,75,55,.2)",  border: "rgba(70,110,80,.3)"  },
    Intermediate: { color: "rgba(190,160,90,.85)",  bg: "rgba(75,65,30,.2)",  border: "rgba(110,90,40,.3)"  },
    Advanced:     { color: "rgba(190,110,100,.85)", bg: "rgba(75,35,35,.2)",  border: "rgba(110,50,50,.3)"  },
  }[level] ?? { color: "rgba(148,163,184,.7)", bg: "rgba(71,85,105,.2)", border: "rgba(100,116,139,.3)" };
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 8px",
      borderRadius: 999, color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      textTransform: "uppercase",
    }}>{level}</span>
  );
}

function ImplementationCard({ impl, featured }) {
  const [expanded, setExpanded] = useState(false);
  const CardIcon = impl.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{
        borderRadius: 16, overflow: "hidden",
        border: `1px solid ${featured ? "rgba(100,116,139,.45)" : "rgba(71,85,105,.28)"}`,
        background: featured ? "rgba(255,255,255,.035)" : "rgba(255,255,255,.02)",
        transition: "border-color 0.2s",
      }}
    >
      <div style={{ padding: "22px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,.04)", border: "1px solid rgba(71,85,105,.3)",
            }}>
              <CardIcon style={{ width: 16, height: 16, color: "rgba(148,163,184,.6)" }} />
            </div>
            <div>
              {featured && (
                <span style={{
                  display: "inline-block", marginBottom: 3, fontSize: 9, fontWeight: 700,
                  letterSpacing: "0.12em", padding: "1px 7px", borderRadius: 999,
                  background: "rgba(71,85,105,.25)", color: "rgba(148,163,184,.6)",
                  border: "1px solid rgba(71,85,105,.4)", textTransform: "uppercase",
                }}>Featured</span>
              )}
              <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(203,213,225,.85)", margin: 0, letterSpacing: "-0.01em", lineHeight: 1.2 }}>{impl.title}</p>
            </div>
          </div>
          <DifficultyBadge level={impl.difficulty} />
        </div>

        <p style={{ fontSize: 13, color: "rgba(100,116,139,.7)", margin: "0 0 12px", lineHeight: 1.6 }}>{impl.subtitle}</p>

        {/* Meta */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(100,116,139,.55)" }}>
            <Clock style={{ width: 11, height: 11 }} />{impl.time}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(100,116,139,.55)" }}>
            <Code2 style={{ width: 11, height: 11 }} />{impl.stack.join(" · ")}
          </span>
        </div>

        {/* Expandable */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <p style={{ fontSize: 13, color: "rgba(148,163,184,.55)", lineHeight: 1.7, margin: "0 0 14px" }}>{impl.description}</p>
              <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,.025)", border: "1px solid rgba(71,85,105,.22)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(100,116,139,.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>What you'll build</p>
                {impl.outcomes.map((o, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                    <Check style={{ width: 12, height: 12, color: "rgba(140,180,150,.7)", flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 12, color: "rgba(100,116,139,.65)", lineHeight: 1.5 }}>{o}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setExpanded(!expanded)} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
            borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: "rgba(255,255,255,.04)", border: "1px solid rgba(71,85,105,.3)",
            color: "rgba(148,163,184,.65)", transition: "all 0.15s",
          }}>
            {expanded ? "Show less" : "View details"}
            <ChevronRight style={{ width: 11, height: 11, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          <a href={`/docs/implementations/${impl.id}`} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
            borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: "transparent", border: "1px solid rgba(71,85,105,.22)",
            color: "rgba(100,116,139,.6)", textDecoration: "none", transition: "all 0.15s",
          }}>
            Full guide <ExternalLink style={{ width: 10, height: 10 }} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function ImplementationsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? IMPLEMENTATIONS
    : IMPLEMENTATIONS.filter(i => i.category === activeCategory);

  const featured = filtered.filter(i => i.featured);
  const rest     = filtered.filter(i => !i.featured);

  return (
    <div style={{
      position: "relative", color: "white", minHeight: "100vh",
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      background: "#050c18",
    }}>
      <Starfield />
      <GridOverlay />

      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", borderRadius: "50%", width: 480, height: 280, top: -60, left: -80, background: "radial-gradient(ellipse,rgba(15,30,60,.9),transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", borderRadius: "50%", width: 380, height: 240, top: "45%", right: -60, background: "radial-gradient(ellipse,rgba(10,20,50,.8),transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1060, margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* ── HERO ── */}
        <div style={{ marginTop: "50px", textAlign: "center", marginBottom: 56 }}>
          <motion.span
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 18,
              fontSize: 10, letterSpacing: "0.2em", fontWeight: 600, color: "rgba(148,163,184,.55)",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 16, height: 1, background: "rgba(148,163,184,.25)", display: "inline-block" }} />
            IMPLEMENTATIONS
            <span style={{ width: 16, height: 1, background: "rgba(148,163,184,.25)", display: "inline-block" }} />
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}
            style={{ fontSize: "clamp(32px,5vw,58px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 16px", lineHeight: 1.1, color: "rgba(226,232,240,.95)" }}
          >
            Build something{" "}
            <span style={{ display: "inline-block", background: "linear-gradient(130deg,rgba(148,163,184,.9),rgba(203,213,225,.95) 50%,rgba(226,232,240,.8))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              real.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .1 }}
            style={{ maxWidth: 520, margin: "0 auto 32px", fontSize: 16, color: "rgba(148,163,184,.55)", lineHeight: 1.75, fontWeight: 300 }}
          >
            Step-by-step guides for the most common Orbital integration patterns. Pick your stack, follow the guide, ship to production.
          </motion.p>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .14 }}
            style={{
              display: "inline-flex", gap: 28, padding: "13px 28px", borderRadius: 999,
              border: "1px solid rgba(71,85,105,.28)", background: "rgba(255,255,255,.02)",
            }}
          >
            {[
              { value: `${IMPLEMENTATIONS.length}`, label: "Guides"     },
              { value: "7",                          label: "Stacks"     },
              { value: "5",                          label: "Categories" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: "rgba(203,213,225,.85)", margin: 0, letterSpacing: "-0.03em" }}>{s.value}</p>
                <p style={{ fontSize: 10, color: "rgba(100,116,139,.6)", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── CATEGORY FILTER ── */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 36, justifyContent: "center" }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: "7px 16px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: isActive ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.025)",
                border: `1px solid ${isActive ? "rgba(100,116,139,.45)" : "rgba(71,85,105,.25)"}`,
                color: isActive ? "rgba(203,213,225,.85)" : "rgba(100,116,139,.6)",
                transition: "all 0.15s",
              }}>
                {cat}
              </button>
            );
          })}
        </div>

        {/* ── FEATURED ── */}
        {featured.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(100,116,139,.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
              Featured guides
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
              <AnimatePresence>
                {featured.map(impl => (
                  <ImplementationCard key={impl.id} impl={impl} featured />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── REST ── */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(100,116,139,.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>
                All guides
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 12 }}>
              <AnimatePresence>
                {rest.map(impl => (
                  <ImplementationCard key={impl.id} impl={impl} featured={false} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── BACK TO DOCS ── */}
        <div style={{
          marginTop: 64, textAlign: "center", padding: "32px 28px", borderRadius: 16,
          background: "rgba(255,255,255,.02)", border: "1px solid rgba(71,85,105,.25)",
        }}>
          <p style={{ fontSize: 15, color: "rgba(148,163,184,.5)", margin: "0 0 14px", fontWeight: 300 }}>
            Ready to integrate? Start from the API reference.
          </p>
          <a href="/docs" style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 24px", borderRadius: 999, fontSize: 13, fontWeight: 700,
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(71,85,105,.35)",
            color: "rgba(203,213,225,.75)", textDecoration: "none",
            transition: "all 0.15s",
          }}>
            <BookOpen style={{ width: 14, height: 14 }} />
            Back to Docs
            <ArrowRight style={{ width: 13, height: 13 }} />
          </a>
        </div>

      </div>
    </div>
  );
}

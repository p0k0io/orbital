"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Clock, Code2, Check, ChevronRight,
  Copy, CheckCheck, BookOpen, Users, Receipt, Scale,
  Workflow, Layers, TrendingUp, Home, GitBranch,
  Server, FileCode, Zap, Building2, ExternalLink,
} from "lucide-react";

/* ─────────────────────────────────────────
   STARFIELD + GRID (same as ImplementationsPage)
───────────────────────────────────────── */
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
   DATA — mirrors IMPLEMENTATIONS from ImplementationsPage
   Each entry adds: steps, schema, prerequisites
───────────────────────────────────────── */
const IMPLEMENTATIONS = {
  "hr-recruitment": {
    id: "hr-recruitment",
    category: "HR",
    difficulty: "Beginner",
    time: "30 min",
    stack: ["Node.js", "Express"],
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
    prerequisites: ["Orbital API key", "Node.js 18+", "Express 4.x", "ATS developer credentials"],
    tags: ["Node.js", "Express", "HR", "Webhooks", "ATS"],
    steps: [
      {
        title: "Create the file watcher endpoint",
        description: "Set up an Express route that accepts multipart file uploads from your email listener or Google Drive webhook. This is the entry point for all incoming CVs.",
        code: {
          lang: "JavaScript",
          body: `const express = require('express');
const multer  = require('multer');
const upload  = multer({ storage: multer.memoryStorage() });

app.post('/ingest/cv', upload.single('file'), async (req, res) => {
  const result = await extractCV(req.file.buffer);
  await seedATS(result.data);
  res.json({ status: 'ok', candidateId: result.data.id });
});`,
        },
      },
      {
        title: "Call the Orbital /extract endpoint",
        description: "Forward the CV buffer to Orbital with your candidate schema. Any field Orbital can't find will return null — never a hallucinated value.",
        code: {
          lang: "JavaScript",
          body: `const axios = require('axios');

async function extractCV(fileBuffer) {
  const form = new FormData();
  form.append('file', fileBuffer, 'cv.pdf');
  form.append('schema', JSON.stringify(CV_SCHEMA));

  const { data } = await axios.post(
    'https://api.orbital.dev/v1/extract',
    form,
    { headers: { Authorization: \`Bearer \${process.env.ORBITAL_KEY}\` } }
  );
  return data;
}`,
        },
      },
      {
        title: "Validate and deduplicate",
        description: "Check the response against your expected schema using Zod or Joi. Before inserting, query your DB by email to avoid duplicate candidates.",
        code: null,
      },
      {
        title: "Push to ATS and notify Slack",
        description: "Map normalized fields to your ATS API (Greenhouse, Lever, or custom). On success, fire a Slack webhook with the candidate name and role.",
        code: null,
      },
    ],
    schema: `{
  "nombre":       "string | null",
  "email":        "string | null",
  "telefono":     "string | null",
  "experiencia":  "number | null",  // years
  "habilidades":  "string[] | null",
  "educacion": {
    "titulo":     "string | null",
    "institucion":"string | null"
  },
  "idiomas":      "string[] | null"
}`,
    prev: null,
    next: { id: "invoice-sync", title: "E-commerce Invoice Sync" },
  },

  "invoice-sync": {
    id: "invoice-sync",
    category: "Finance",
    difficulty: "Intermediate",
    time: "45 min",
    stack: ["FastAPI", "PostgreSQL"],
    Icon: Receipt,
    title: "E-commerce Invoice Sync",
    subtitle: "Extract and normalize invoices into your accounting system",
    description: "Receive supplier invoices via email attachment or upload portal, extract line items, totals, VAT, and vendor details, then push structured records to QuickBooks, Xero, or your ERP. Handles multi-currency and multi-language invoices.",
    outcomes: [
      "Extract line items, totals, and VAT from any invoice format",
      "Multi-currency normalization with automatic FX rates",
      "Auto-match to existing vendor records",
      "Push to QuickBooks or Xero via their APIs",
    ],
    prerequisites: ["Orbital API key", "Python 3.11+ with FastAPI", "PostgreSQL 14+", "QuickBooks or Xero developer account"],
    tags: ["FastAPI", "PostgreSQL", "Finance", "OCR", "Webhooks"],
    steps: [
      {
        title: "Set up your webhook endpoint",
        description: "Create a FastAPI route that receives file uploads from your invoice portal or email listener. This is where Orbital will deliver extracted JSON.",
        code: {
          lang: "Python",
          body: `from fastapi import FastAPI, UploadFile
from services.orbital import extract_invoice

app = FastAPI()

@app.post("/ingest/invoice")
async def ingest(file: UploadFile):
    content = await file.read()
    result  = await extract_invoice(content)
    await push_to_accounting(result["data"])
    return {"status": "ok"}`,
        },
      },
      {
        title: "Call the Orbital /extract endpoint",
        description: "Forward the document to Orbital with your schema definition. Specify exactly which fields you need — Orbital returns null for any field it can't find, never a hallucinated value.",
        code: {
          lang: "Python",
          body: `import httpx, os

INVOICE_SCHEMA = { ... }  # see schema section below

async def extract_invoice(file_bytes: bytes):
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.orbital.dev/v1/extract",
            headers={"Authorization": f"Bearer {os.environ['ORBITAL_KEY']}"},
            files={"file": file_bytes},
            json={"schema": INVOICE_SCHEMA},
        )
    return r.json()`,
        },
      },
      {
        title: "Validate and store",
        description: "Use Pydantic to validate the response against your expected schema. Store both the raw extraction and validated record in PostgreSQL for full auditability.",
        code: null,
      },
      {
        title: "Push to QuickBooks or Xero",
        description: "Map normalized fields to the QuickBooks Bills API or Xero Invoice API. Handle duplicates by matching on vendor name + invoice number.",
        code: null,
      },
    ],
    schema: `{
  "numeroFactura":  "string | null",
  "fecha":          "ISO date | null",
  "proveedor": {
    "nombre":       "string | null",
    "cif":          "string | null"
  },
  "lineas": [{
    "descripcion":  "string | null",
    "cantidad":     "number | null",
    "precioUnitario":"number | null"
  }],
  "subtotal":       "number | null",
  "iva":            "number | null",
  "total":          "number | null",
  "moneda":         "string | null"
}`,
    prev: { id: "hr-recruitment", title: "HR Recruitment Pipeline" },
    next: { id: "legal-contracts", title: "Legal Contract Analysis" },
  },

  "legal-contracts": {
    id: "legal-contracts",
    category: "Legal",
    difficulty: "Intermediate",
    time: "1 hour",
    stack: ["Django", "Celery"],
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
    prerequisites: ["Orbital API key", "Python 3.11+ with Django", "Celery + Redis", "PostgreSQL 14+"],
    tags: ["Django", "Celery", "Legal", "PDF", "Contracts"],
    steps: [
      {
        title: "Create the upload view",
        description: "Add a Django view that accepts PDF/DOCX uploads and enqueues a Celery task for async processing. This prevents timeouts on large documents.",
        code: {
          lang: "Python",
          body: `from django.views import View
from .tasks import process_contract

class ContractUploadView(View):
    def post(self, request):
        file   = request.FILES["contract"]
        job_id = process_contract.delay(file.read())
        return JsonResponse({"jobId": str(job_id)})`,
        },
      },
      {
        title: "Process async with Celery",
        description: "The Celery task calls Orbital and stores the result. Long contracts may take a few seconds — async processing keeps your API snappy.",
        code: {
          lang: "Python",
          body: `from celery import shared_task
from .services import orbital_extract, save_contract

@shared_task
def process_contract(file_bytes: bytes):
    result = orbital_extract(file_bytes, CONTRACT_SCHEMA)
    save_contract(result["data"])`,
        },
      },
      {
        title: "Store and index the extraction",
        description: "Save the structured contract data to PostgreSQL. Add a GIN index on the jsonb column to enable full-text search across all extracted clauses.",
        code: null,
      },
      {
        title: "Set expiration alerts",
        description: "After storing, check for termination and renewal dates in the extracted data. Schedule Django Q or Celery beat tasks to send email/Slack alerts 30 days before.",
        code: null,
      },
    ],
    schema: `{
  "partes": [{
    "nombre":       "string | null",
    "tipo":         "string | null",  // 'cliente' | 'proveedor'
    "cif":          "string | null"
  }],
  "fechaFirma":     "ISO date | null",
  "fechaVigencia":  "ISO date | null",
  "fechaVencimiento":"ISO date | null",
  "jurisdiccion":   "string | null",
  "clausulas": {
    "terminacion":  "string | null",
    "pagos":        "string | null",
    "penalizaciones":"string | null"
  }
}`,
    prev: { id: "invoice-sync", title: "E-commerce Invoice Sync" },
    next: { id: "n8n-nocode", title: "No-Code Document Pipeline" },
  },
};

/* ─────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────── */
const DIFF_CFG = {
  Beginner:     { color: "rgba(140,180,150,.85)", bg: "rgba(50,75,55,.2)",  border: "rgba(70,110,80,.3)"  },
  Intermediate: { color: "rgba(190,160,90,.85)",  bg: "rgba(75,65,30,.2)",  border: "rgba(110,90,40,.3)"  },
  Advanced:     { color: "rgba(190,110,100,.85)", bg: "rgba(75,35,35,.2)",  border: "rgba(110,50,50,.3)"  },
};

function Badge({ children, style = {} }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 9px",
      borderRadius: 999, textTransform: "uppercase", ...style,
    }}>
      {children}
    </span>
  );
}

function DifficultyBadge({ level }) {
  const cfg = DIFF_CFG[level] ?? { color: "rgba(148,163,184,.7)", bg: "rgba(71,85,105,.2)", border: "rgba(100,116,139,.3)" };
  return <Badge style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>{level}</Badge>;
}

function CodeBlock({ lang, body }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      borderRadius: 10, border: "1px solid rgba(71,85,105,.25)",
      background: "rgba(0,0,0,.25)", overflow: "hidden", marginTop: 12,
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "7px 14px", borderBottom: "1px solid rgba(71,85,105,.2)",
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "rgba(100,116,139,.45)", textTransform: "uppercase" }}>
          {lang}
        </span>
        <button onClick={copy} style={{
          display: "flex", alignItems: "center", gap: 4, fontSize: 10,
          color: copied ? "rgba(140,180,150,.8)" : "rgba(100,116,139,.45)",
          background: "transparent", border: "none", cursor: "pointer",
        }}>
          {copied ? <CheckCheck size={11} /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre style={{
        padding: "14px 16px", fontFamily: "monospace", fontSize: 11.5,
        lineHeight: 1.7, color: "rgba(148,163,184,.7)", overflowX: "auto", margin: 0,
      }}>
        {body}
      </pre>
    </div>
  );
}

/* ─────────────────────────────────────────
   PAGE COMPONENT
   Usage:  <ImplementationDetailPage id="invoice-sync" />
   Or with Next.js dynamic routing:
     params.id  →  pass as prop
───────────────────────────────────────── */
export default function ImplementationDetailPage({ id = "invoice-sync" }) {
  const impl = IMPLEMENTATIONS[id];

  // Fallback if id not found
  if (!impl) {
    return (
      <div style={{ background: "#050c18", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(148,163,184,.5)", fontFamily: "'DM Sans',sans-serif" }}>
        Implementation not found.
      </div>
    );
  }

  const PageIcon = impl.Icon;

  return (
    <div style={{
      position: "relative", color: "white", minHeight: "100vh",
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      background: "#050c18",
    }}>
      <Starfield />
      <GridOverlay />

      {/* Ambient glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", borderRadius: "50%", width: 480, height: 280, top: -60, left: -80, background: "radial-gradient(ellipse,rgba(15,30,60,.9),transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", borderRadius: "50%", width: 380, height: 240, top: "45%", right: -60, background: "radial-gradient(ellipse,rgba(10,20,50,.8),transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "72px 24px 96px" }}>

        {/* ── BREADCRUMB ── */}
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, fontSize: 11, color: "rgba(100,116,139,.5)", letterSpacing: ".04em" }}
        >
          <a href="/docs" style={{ color: "rgba(100,116,139,.5)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <BookOpen size={11} /> Docs
          </a>
          <ChevronRight size={10} style={{ opacity: 0.4 }} />
          <a href="/docs/implementations" style={{ color: "rgba(100,116,139,.5)", textDecoration: "none" }}>Implementations</a>
          <ChevronRight size={10} style={{ opacity: 0.4 }} />
          <span style={{ color: "rgba(148,163,184,.6)" }}>{impl.title}</span>
        </motion.div>

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .04 }} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <Badge style={{ color: "rgba(148,163,184,.7)", background: "rgba(71,85,105,.2)", border: "1px solid rgba(71,85,105,.3)" }}>
              {impl.category}
            </Badge>
            <DifficultyBadge level={impl.difficulty} />
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(100,116,139,.5)" }}>
              <Clock size={11} /> {impl.time}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(100,116,139,.5)" }}>
              <Code2 size={11} /> {impl.stack.join(" · ")}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,.04)", border: "1px solid rgba(71,85,105,.3)", flexShrink: 0, marginTop: 4,
            }}>
              <PageIcon size={18} style={{ color: "rgba(148,163,184,.55)" }} />
            </div>
            <div>
              <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.1, color: "rgba(226,232,240,.95)", margin: "0 0 8px" }}>
                {impl.title}
              </h1>
              <p style={{ fontSize: 15, color: "rgba(148,163,184,.5)", lineHeight: 1.7, fontWeight: 300, margin: 0, maxWidth: 560 }}>
                {impl.description}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── META BAR ── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .08 }}
          style={{
            display: "flex", gap: 0, marginBottom: 40,
            border: "1px solid rgba(71,85,105,.25)", borderRadius: 12,
            background: "rgba(255,255,255,.02)", overflow: "hidden",
          }}
        >
          {[
            { label: "Stack",        value: impl.stack.join(" · ") },
            { label: "Endpoint",     value: "POST /v1/extract" },
            { label: "Output",       value: "JSON schema" },
            { label: "Tiempo est.",  value: impl.time },
          ].map((m, i) => (
            <div key={m.label} style={{
              flex: 1, padding: "14px 18px", minWidth: 0,
              borderRight: i < 3 ? "1px solid rgba(71,85,105,.2)" : "none",
            }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 3px" }}>{m.label}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(203,213,225,.75)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.value}</p>
            </div>
          ))}
        </motion.div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 28, alignItems: "start" }}>

          {/* ── MAIN COLUMN ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .12 }}>

            {/* Outcomes */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 14px" }}>
                Lo que construirás
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {impl.outcomes.map((o, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px",
                    borderRadius: 10, background: "rgba(255,255,255,.02)", border: "1px solid rgba(71,85,105,.2)",
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", background: "rgba(50,75,55,.25)",
                      border: "1px solid rgba(70,110,80,.3)", display: "flex", alignItems: "center",
                      justifyContent: "center", flexShrink: 0, marginTop: 1,
                    }}>
                      <Check size={9} style={{ color: "rgba(140,180,150,.8)" }} />
                    </div>
                    <span style={{ fontSize: 12, color: "rgba(100,116,139,.65)", lineHeight: 1.5 }}>{o}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 20px" }}>
                Pasos
              </p>
              {impl.steps.map((step, i) => (
                <div key={i}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,.04)",
                        border: "1px solid rgba(71,85,105,.3)", display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 700, color: "rgba(100,116,139,.55)", flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      {i < impl.steps.length - 1 && (
                        <div style={{ width: 1, flex: 1, minHeight: 20, background: "rgba(71,85,105,.2)", margin: "4px 0" }} />
                      )}
                    </div>
                    <div style={{ flex: 1, paddingBottom: i < impl.steps.length - 1 ? 20 : 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(203,213,225,.8)", margin: "4px 0 5px" }}>{step.title}</p>
                      <p style={{ fontSize: 12, color: "rgba(100,116,139,.6)", lineHeight: 1.6, margin: 0 }}>{step.description}</p>
                      {step.code && <CodeBlock lang={step.code.lang} body={step.code.body} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Schema */}
            <div style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 14px" }}>
                Schema de ejemplo
              </p>
              <CodeBlock lang="JSON" body={impl.schema} />
            </div>

          </motion.div>

          {/* ── SIDEBAR ── */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .16 }} style={{ position: "sticky", top: 24 }}>

            {/* Prerequisites */}
            <div style={{ borderRadius: 12, border: "1px solid rgba(71,85,105,.25)", background: "rgba(255,255,255,.02)", padding: 18, marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 12px" }}>
                Prerequisitos
              </p>
              {impl.prerequisites.map((p, i) => (
                <div key={i} style={{
                  fontSize: 12, color: "rgba(100,116,139,.55)", marginBottom: 7,
                  paddingLeft: 10, borderLeft: "2px solid rgba(71,85,105,.3)", lineHeight: 1.5,
                }}>
                  {p}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ borderRadius: 12, border: "1px solid rgba(71,85,105,.25)", background: "rgba(255,255,255,.02)", padding: 18, marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(100,116,139,.4)", margin: "0 0 12px" }}>
                Tags
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {impl.tags.map(t => (
                  <span key={t} style={{
                    fontSize: 11, padding: "4px 10px", borderRadius: 999,
                    background: "rgba(255,255,255,.03)", border: "1px solid rgba(71,85,105,.22)",
                    color: "rgba(100,116,139,.55)",
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* API reference link */}
            <a href="/docs/api" style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "13px 16px", borderRadius: 12, border: "1px solid rgba(71,85,105,.25)",
              background: "rgba(255,255,255,.02)", textDecoration: "none", color: "rgba(148,163,184,.6)",
              fontSize: 12, fontWeight: 600,
            }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={13} /> API Reference
              </span>
              <ExternalLink size={11} style={{ opacity: 0.5 }} />
            </a>

          </motion.div>
        </div>

        {/* ── PREV / NEXT NAVIGATION ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", gap: 12,
          marginTop: 56, paddingTop: 32, borderTop: "1px solid rgba(71,85,105,.2)",
          flexWrap: "wrap",
        }}>
          {impl.prev ? (
            <a href={`/docs/implementations/${impl.prev.id}`} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
              borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid rgba(71,85,105,.3)",
              background: "rgba(255,255,255,.03)", color: "rgba(148,163,184,.6)", textDecoration: "none",
            }}>
              <ArrowLeft size={13} /> {impl.prev.title}
            </a>
          ) : <div />}

          {impl.next && (
            <a href={`/docs/implementations/${impl.next.id}`} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "10px 18px",
              borderRadius: 10, fontSize: 12, fontWeight: 600, border: "1px solid rgba(100,116,139,.4)",
              background: "rgba(255,255,255,.06)", color: "rgba(203,213,225,.75)", textDecoration: "none",
            }}>
              {impl.next.title} <ArrowRight size={13} />
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   NEXT.JS DYNAMIC ROUTE USAGE
   
   En app/docs/implementations/[id]/page.jsx:

   import ImplementationDetailPage from "@/components/ImplementationDetailPage";
   
   export default function Page({ params }) {
     return <ImplementationDetailPage id={params.id} />;
   }
───────────────────────────────────────── */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, ChevronRight, Terminal, Zap, Globe, Box,
  ArrowRight, BookOpen, Code2, Layers, AlertTriangle,
  CheckCircle, Clock, XCircle, Activity, ExternalLink,
  ShieldCheck, Webhook, Database, GitBranch, Workflow,
  Server, FileCode, Users, Receipt, Scale, Building2,
  Home, TrendingUp,
} from "lucide-react";

/* ─────────────────────────────────────────
   STARFIELD
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
      x: Math.random(), y: Math.random(),
      r: Math.random() * 0.9,
      a: Math.random() * Math.PI * 2,
      speed: 0.003 + Math.random() * 0.004,
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
   CODE SNIPPETS
───────────────────────────────────────── */
const SNIPPETS = {
  nodejs: {
    label: "Node.js",
    color: "#7da87b",
    Icon: Server,
    code: `import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const API_KEY  = process.env.ORBITAL_API_KEY;
const ENDPOINT = "https://api.orbital.io/cv/{endpoint_id}";

async function processDocument(filePath) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  try {
    const { data, status } = await axios.post(ENDPOINT, form, {
      headers: {
        Authorization: \`Bearer \${API_KEY}\`,
        ...form.getHeaders(),
      },
    });

    if (status !== 202) throw new Error(data.detail ?? "Unexpected status");

    console.log("Processing started →", data.request_id);
    return data.request_id;
  } catch (err) {
    console.error("Orbital error:", err.response?.data ?? err.message);
    throw err;
  }
}

// Webhook handler (Express example)
app.post("/webhook/orbital", (req, res) => {
  const { status, data, error } = req.body;
  if (status === "completed") {
    console.log("Extracted data:", data);
  } else {
    console.error("Processing failed:", error);
  }
  res.sendStatus(200);
});`,
  },
  express: {
    label: "Express.js",
    color: "#7da87b",
    Icon: GitBranch,
    code: `import express from "express";
import multer  from "multer";
import axios   from "axios";
import FormData from "form-data";

const app    = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

// ── Upload & forward to Orbital ──────────────────────
app.post("/process", upload.single("file"), async (req, res) => {
  const form = new FormData();
  form.append("file", req.file.buffer, {
    filename:    req.file.originalname,
    contentType: req.file.mimetype,
  });

  const { data } = await axios.post(
    \`https://api.orbital.io/cv/\${process.env.ENDPOINT_ID}\`,
    form,
    {
      headers: {
        Authorization: \`Bearer \${process.env.ORBITAL_API_KEY}\`,
        ...form.getHeaders(),
      },
    }
  );

  res.json({ request_id: data.request_id });
});

// ── Webhook receiver ─────────────────────────────────
app.post("/orbital/webhook", (req, res) => {
  const { status, data, error, request_id } = req.body;

  if (status === "completed") {
    db.saveResult(request_id, data);
  } else {
    logger.error({ request_id, error });
  }

  res.sendStatus(200); // Always acknowledge
});

app.listen(3000);`,
  },
  fastapi: {
    label: "FastAPI",
    color: "#5b9ea0",
    Icon: Zap,
    code: `from fastapi import FastAPI, UploadFile, BackgroundTasks, Request
from fastapi.responses import JSONResponse
import httpx, os

app     = FastAPI()
API_KEY = os.getenv("ORBITAL_API_KEY")
BASE    = "https://api.orbital.io"

# ── Submit document ───────────────────────────────────
@app.post("/process/{endpoint_id}")
async def process_document(endpoint_id: str, file: UploadFile):
    content = await file.read()

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE}/cv/{endpoint_id}",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files={"file": (file.filename, content, file.content_type)},
        )

    if resp.status_code != 202:
        return JSONResponse(status_code=resp.status_code, content=resp.json())

    return {"request_id": resp.json()["request_id"], "status": "processing"}


# ── Webhook receiver ──────────────────────────────────
@app.post("/orbital/webhook")
async def orbital_webhook(request: Request, tasks: BackgroundTasks):
    payload = await request.json()

    if payload["status"] == "completed":
        tasks.add_task(handle_result, payload["data"])
    else:
        tasks.add_task(handle_error, payload.get("error"))

    return {"ok": True}


async def handle_result(data: dict):
    print("Extracted:", data)

async def handle_error(error: str):
    print("Failed:", error)`,
  },
  django: {
    label: "Django",
    color: "rgba(255,255,255,.5)",
    Icon: Database,
    code: `# views.py
import requests, os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

API_KEY = os.getenv("ORBITAL_API_KEY")
BASE    = "https://api.orbital.io"

@require_POST
def process_document(request, endpoint_id):
    uploaded = request.FILES.get("file")
    if not uploaded:
        return JsonResponse({"error": "No file provided"}, status=422)

    resp = requests.post(
        f"{BASE}/cv/{endpoint_id}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        files={"file": (uploaded.name, uploaded.read(), uploaded.content_type)},
        timeout=30,
    )

    if resp.status_code != 202:
        return JsonResponse(resp.json(), status=resp.status_code)

    return JsonResponse({"request_id": resp.json()["request_id"]})


@csrf_exempt
@require_POST
def orbital_webhook(request):
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if payload.get("status") == "completed":
        save_result.delay(payload["data"])   # Celery task
    else:
        logger.error("Orbital failure: %s", payload.get("error"))

    return JsonResponse({"ok": True})`,
  },
  laravel: {
    label: "Laravel",
    color: "#c0614e",
    Icon: FileCode,
    code: `<?php
// routes/api.php
use App\\Http\\Controllers\\OrbitalController;
Route::post('/process/{endpointId}',  [OrbitalController::class, 'process']);
Route::post('/orbital/webhook',       [OrbitalController::class, 'webhook']);

// app/Http/Controllers/OrbitalController.php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;
use Illuminate\\Support\\Facades\\Log;

class OrbitalController extends Controller
{
    private string $apiKey;
    private string $base = 'https://api.orbital.io';

    public function __construct()
    {
        $this->apiKey = config('services.orbital.key');
    }

    public function process(Request $request, string $endpointId)
    {
        $request->validate(['file' => 'required|file']);

        $response = Http::withToken($this->apiKey)
            ->attach('file', fopen($request->file('file')->getRealPath(), 'r'),
                             $request->file('file')->getClientOriginalName())
            ->post("{$this->base}/cv/{$endpointId}");

        abort_unless($response->status() === 202, $response->status(),
                     $response->json('detail') ?? 'Orbital error');

        return response()->json(['request_id' => $response->json('request_id')]);
    }

    public function webhook(Request $request)
    {
        $payload = $request->json()->all();

        if ($payload['status'] === 'completed') {
            ProcessOrbitalResult::dispatch($payload['data']);
        } else {
            Log::error('Orbital failure', ['error' => $payload['error'] ?? '?']);
        }

        return response()->json(['ok' => true]);
    }
}`,
  },
  n8n: {
    label: "n8n",
    color: "#a06080",
    Icon: Workflow,
    code: `// ── n8n Workflow: Orbital Document Processing ────────
// Import this JSON in your n8n instance.
//
// Nodes:
//   1. Webhook Trigger  → receives file upload from your app
//   2. HTTP Request     → POSTs file to Orbital
//   3. IF               → checks 202 status
//   4. Set              → stores request_id in workflow data
//   5. Respond (200)    → acknowledges sender
//
// Webhook receiver (separate workflow):
//   1. Webhook Trigger  → /orbital-callback
//   2. IF               → payload.status === "completed"
//   3a. (Success) Airtable / Google Sheets / Postgres node
//   3b. (Failure) Slack / Email notification node

{
  "name": "Orbital — Process Document",
  "nodes": [
    {
      "name":       "Receive File",
      "type":       "n8n-nodes-base.webhook",
      "parameters": { "path": "process-doc", "responseMode": "lastNode" }
    },
    {
      "name": "Send to Orbital",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method":          "POST",
        "url":             "https://api.orbital.io/cv/{{$env.ENDPOINT_ID}}",
        "authentication":  "headerAuth",
        "headerAuthName":  "Authorization",
        "headerAuthValue": "Bearer {{$env.ORBITAL_API_KEY}}",
        "sendBody":        true,
        "bodyContentType": "multipart-form-data",
        "bodyParameters":  { "file": "={{ $binary.data }}" }
      }
    },
    {
      "name": "Check 202",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [{ "value1": "={{ $response.statusCode }}", "operation": "equal", "value2": 202 }]
        }
      }
    }
  ]
}`,
  },
  make: {
    label: "Make",
    color: "#7060a0",
    Icon: Layers,
    code: `// ── Make (Integromat) Scenario: Orbital Integration ──
//
// Recommended module chain:
//
// [Trigger]              → Webhook / Watch Files (Google Drive, Dropbox…)
// [HTTP] Make a Request  → POST to Orbital
// [Router]               → Branch on status code
//   ├─ 202 Accepted      → [Data Store] Save request_id + Set variable
//   └─ Other             → [Email] / [Slack] Send error notification
//
// Webhook Receiver scenario:
// [Webhook] Custom       → listens on /orbital-webhook
// [Router]               → Branch on payload.status
//   ├─ "completed"       → [Google Sheets] Add Row / [Airtable] Create Record
//   └─ "failed"          → [Slack] Post Message with error details
//
// ── HTTP Module config ────────────────────────────────
// URL:     https://api.orbital.io/cv/{{endpointId}}
// Method:  POST
// Headers: Authorization: Bearer {{orbitalApiKey}}
// Body type: multipart/form-data
// Fields:
//   Key:   file
//   Value: {{file}} (map from trigger module)
//
// ── Parse response ────────────────────────────────────
// After a 202:
//   {{body.request_id}}  → store in Data Store or pass downstream
//
// ── Webhook payload mapping ───────────────────────────
// {{body.status}}   → "completed" | "failed"
// {{body.data}}     → structured JSON (on success)
// {{body.error}}    → error description (on failure)`,
  },
};

const LANG_ORDER = ["nodejs", "express", "fastapi", "django", "laravel", "n8n", "make"];

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "overview",    label: "Overview",        icon: BookOpen      },
  { id: "quickstart", label: "Quick Start",      icon: Zap           },
  { id: "auth",       label: "Authentication",   icon: ShieldCheck   },
  { id: "flow",       label: "Async Flow",       icon: Activity      },
  { id: "output",     label: "Output Format",    icon: Code2         },
  { id: "errors",     label: "Error Reference",  icon: AlertTriangle },
  { id: "states",     label: "Request States",   icon: Layers        },
  { id: "sdks",       label: "SDK Examples",     icon: Terminal      },
  { id: "impls",      label: "Implementations",  icon: Box           },
];

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14,
      fontSize: 10, letterSpacing: "0.2em", fontWeight: 600,
      color: "rgba(148,163,184,.6)", textTransform: "uppercase",
    }}>
      <span style={{ width: 16, height: 1, background: "rgba(148,163,184,.3)", display: "inline-block" }} />
      {children}
      <span style={{ width: 16, height: 1, background: "rgba(148,163,184,.3)", display: "inline-block" }} />
    </span>
  );
}

function InfoBox({ type = "info", children }) {
  const cfg = {
    info:    { bg: "rgba(71,85,105,.25)",  border: "rgba(100,116,139,.35)", color: "rgba(186,200,220,.8)", Icon: BookOpen      },
    warn:    { bg: "rgba(92,76,50,.25)",   border: "rgba(120,100,60,.4)",   color: "rgba(210,180,100,.8)", Icon: AlertTriangle  },
    success: { bg: "rgba(50,80,65,.2)",    border: "rgba(70,110,85,.35)",   color: "rgba(140,190,160,.8)", Icon: CheckCircle    },
  }[type];
  return (
    <div style={{
      display: "flex", gap: 12, padding: "13px 16px", borderRadius: 10, margin: "14px 0",
      background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <cfg.Icon style={{ width: 15, height: 15, color: cfg.color, flexShrink: 0, marginTop: 2 }} />
      <p style={{ fontSize: 13, color: "rgba(203,213,225,.65)", lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

function CodeBlock({ code, lang = "" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      position: "relative", borderRadius: 12, overflow: "hidden",
      border: "1px solid rgba(71,85,105,.4)", margin: "12px 0",
      background: "rgba(2,8,18,.7)",
    }}>
      {lang && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 14px", background: "rgba(255,255,255,.03)",
          borderBottom: "1px solid rgba(71,85,105,.3)",
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "rgba(148,163,184,.5)", fontWeight: 600, textTransform: "uppercase" }}>{lang}</span>
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 5,
            background: copied ? "rgba(70,110,85,.2)" : "rgba(255,255,255,.04)",
            border: `1px solid ${copied ? "rgba(70,110,85,.4)" : "rgba(71,85,105,.3)"}`,
            color: copied ? "rgba(140,190,160,.9)" : "rgba(148,163,184,.5)", fontSize: 11, cursor: "pointer",
            transition: "all 0.2s",
          }}>
            {copied ? <Check style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre style={{
        margin: 0, padding: "16px 18px", fontSize: 12.5, lineHeight: 1.7,
        color: "rgba(203,213,225,.75)", overflowX: "auto",
        fontFamily: "'JetBrains Mono','Fira Code',monospace",
      }}>{code}</pre>
    </div>
  );
}

function StatusPill({ status }) {
  const cfg = {
    "202": { color: "rgba(140,190,160,.9)", bg: "rgba(50,80,65,.2)",    border: "rgba(70,110,85,.35)" },
    "401": { color: "rgba(200,130,120,.9)", bg: "rgba(80,40,40,.2)",    border: "rgba(110,60,60,.35)" },
    "403": { color: "rgba(200,130,120,.9)", bg: "rgba(80,40,40,.2)",    border: "rgba(110,60,60,.35)" },
    "404": { color: "rgba(200,170,100,.9)", bg: "rgba(80,65,30,.2)",    border: "rgba(110,90,40,.35)" },
    "422": { color: "rgba(200,170,100,.9)", bg: "rgba(80,65,30,.2)",    border: "rgba(110,90,40,.35)" },
    "500": { color: "rgba(200,130,120,.9)", bg: "rgba(80,40,40,.2)",    border: "rgba(110,60,60,.35)" },
  }[status] ?? { color: "rgba(148,163,184,.7)", bg: "rgba(71,85,105,.2)", border: "rgba(100,116,139,.3)" };
  return (
    <span style={{
      fontFamily: "monospace", fontSize: 12, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>{status}</span>
  );
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7,
      background: copied ? "rgba(70,110,85,.2)" : "rgba(255,255,255,.04)",
      border: `1px solid ${copied ? "rgba(70,110,85,.4)" : "rgba(71,85,105,.3)"}`,
      color: copied ? "rgba(140,190,160,.9)" : "rgba(148,163,184,.5)", fontSize: 11, cursor: "pointer",
      transition: "all 0.2s",
    }}>
      {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}

/* ─────────────────────────────────────────
   SDK EXAMPLES
───────────────────────────────────────── */
function SdkExamples() {
  const [active, setActive] = useState("nodejs");
  const snip = SNIPPETS[active];

  return (
    <div>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 4, padding: "5px",
        borderRadius: "12px 12px 0 0",
        background: "rgba(255,255,255,.02)",
        border: "1px solid rgba(71,85,105,.35)",
        borderBottom: "none",
      }}>
        {LANG_ORDER.map(key => {
          const s = SNIPPETS[key];
          const isActive = active === key;
          const IconComp = s.Icon;
          return (
            <button key={key} onClick={() => setActive(key)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 13px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.18s", border: "none",
              background: isActive ? "rgba(255,255,255,.06)" : "transparent",
              color: isActive ? "rgba(203,213,225,.85)" : "rgba(148,163,184,.45)",
              boxShadow: isActive ? `inset 0 -2px 0 ${s.color}` : "none",
            }}>
              <IconComp style={{ width: 13, height: 13, color: isActive ? s.color : "rgba(148,163,184,.35)" }} />
              {s.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            borderRadius: "0 0 12px 12px", overflow: "hidden",
            border: "1px solid rgba(71,85,105,.35)",
            borderTop: `1px solid ${snip.color}44`,
            background: "rgba(2,8,18,.7)",
          }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "9px 16px", background: "rgba(255,255,255,.02)",
            borderBottom: "1px solid rgba(71,85,105,.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <snip.Icon style={{ width: 14, height: 14, color: snip.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(203,213,225,.65)" }}>{snip.label}</span>
            </div>
            <CopyButton code={snip.code} />
          </div>
          <pre style={{
            margin: 0, padding: "18px 22px", fontSize: 12.5, lineHeight: 1.75,
            color: "rgba(203,213,225,.75)", overflowX: "auto",
            fontFamily: "'JetBrains Mono','Fira Code',monospace", maxHeight: 460,
          }}>{snip.code}</pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   IMPLEMENTATIONS PREVIEW CARD
───────────────────────────────────────── */
const IMPL_PREVIEWS = [
  { Icon: Users,     title: "HR Recruitment Pipeline",     desc: "Auto-parse CVs into a normalized candidate schema and seed your ATS." },
  { Icon: Receipt,   title: "Invoice Sync",                desc: "Extract line items and totals from invoices, push to your ERP." },
  { Icon: Scale,     title: "Legal Contract Analysis",     desc: "Extract parties, dates, and key clauses into a searchable database." },
  { Icon: Workflow,  title: "No-Code Pipeline (n8n/Make)", desc: "Connect Orbital to 400+ apps without writing a single line of code." },
  { Icon: TrendingUp,title: "Financial Document OCR",      desc: "Normalize bank statements and balance sheets into your BI stack." },
  { Icon: Home,      title: "Real Estate Listing Parser",  desc: "Extract property details from PDFs and push to your CRM." },
];

function ImplementationsCard() {
  return (
    <div style={{
      borderRadius: 18, overflow: "hidden",
      border: "1px solid rgba(71,85,105,.4)",
      background: "rgba(255,255,255,.02)",
      padding: 28,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <SectionLabel>REAL-WORLD USE CASES</SectionLabel>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "rgba(226,232,240,.9)", margin: 0, letterSpacing: "-0.02em" }}>
            What teams build with Orbital
          </h3>
          <p style={{ fontSize: 13, color: "rgba(148,163,184,.5)", margin: "6px 0 0", fontWeight: 300 }}>
            Step-by-step implementation guides on the Implementations page.
          </p>
        </div>
        <a href="/implementations" style={{
          display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 999,
          background: "rgba(255,255,255,.06)", border: "1px solid rgba(71,85,105,.4)",
          color: "rgba(203,213,225,.7)", fontSize: 12, fontWeight: 600, textDecoration: "none",
          whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
        }}>
          Browse all <ArrowRight style={{ width: 13, height: 13 }} />
        </a>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
        {IMPL_PREVIEWS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: "14px 16px", borderRadius: 12,
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(71,85,105,.3)",
            }}
          >
            <item.Icon style={{ width: 16, height: 16, color: "rgba(148,163,184,.5)", marginBottom: 8 }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(203,213,225,.8)", margin: "0 0 4px" }}>{item.title}</p>
            <p style={{ fontSize: 11, color: "rgba(148,163,184,.45)", margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ERROR TABLES
───────────────────────────────────────── */
const SYNC_ERRORS = [
  { code: "401", type: "Unauthorized",         action: "Verify API Key validity. Regenerate if compromised." },
  { code: "403", type: "Forbidden",            action: "Check endpoint permissions for your key." },
  { code: "404", type: "Not Found",            action: "Validate endpoint_id exists before retrying." },
  { code: "422", type: "Unprocessable Entity", action: "Exactly one file must be attached as multipart/form-data." },
  { code: "500", type: "Internal Server Error",action: "Show generic message. Retry manually after a delay." },
];

const ASYNC_ERRORS = [
  { scenario: "Processing failure", detect: 'payload.status === "failed"',   action: "Display retry option. Log error with request_id." },
  { scenario: "Webhook timeout",    detect: "No callback after X minutes",   action: "Use a cron job to mark the request as failed." },
  { scenario: "Webhook rejected",   detect: "Your server returned 4xx/5xx",  action: "Ensure idempotency. Don't rate-limit Orbital's IPs." },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div style={{
      position: "relative", color: "white", minHeight: "100vh",
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      background: "#050c18",
    }}>
      <Starfield />
      <GridOverlay />

      {/* Aurora — muted */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", borderRadius: "50%", width: 480, height: 280, top: -60, left: -80, background: "radial-gradient(ellipse,rgba(15,30,60,.9),transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", borderRadius: "50%", width: 380, height: 240, bottom: "20%", right: -60, background: "radial-gradient(ellipse,rgba(10,25,55,.8),transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", minHeight: "100vh" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 252, flexShrink: 0, position: "sticky", top: 0, height: "100vh",
          overflowY: "auto", padding: "28px 16px",
          borderRight: "1px solid rgba(71,85,105,.25)",
          background: "rgba(5,12,24,.92)", backdropFilter: "blur(16px)",
        }}>
          {/* Brand */}
          <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid rgba(71,85,105,.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,.06)", border: "1px solid rgba(71,85,105,.4)",
              }}>
                <Globe style={{ width: 14, height: 14, color: "rgba(148,163,184,.7)" }} />
              </div>
              <span style={{ fontSize: 15, fontWeight: 800, color: "rgba(226,232,240,.9)", letterSpacing: "-0.02em" }}>Orbital</span>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "1px 7px",
                borderRadius: 999, color: "rgba(148,163,184,.6)",
                background: "rgba(71,85,105,.2)", border: "1px solid rgba(71,85,105,.35)",
              }}>DOCS</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(100,116,139,.7)", margin: 0, letterSpacing: "0.04em" }}>API Reference v1.0</p>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {NAV_SECTIONS.map(s => {
              const isActive = activeSection === s.id;
              return (
                <button key={s.id} onClick={() => scrollTo(s.id)} style={{
                  display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
                  borderRadius: 9, cursor: "pointer", textAlign: "left",
                  background: isActive ? "rgba(255,255,255,.05)" : "transparent",
                  border: `1px solid ${isActive ? "rgba(71,85,105,.4)" : "transparent"}`,
                  color: isActive ? "rgba(203,213,225,.85)" : "rgba(100,116,139,.7)",
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  transition: "all 0.15s",
                }}>
                  <s.icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                  {s.label}
                  {isActive && <ChevronRight style={{ width: 11, height: 11, marginLeft: "auto", opacity: 0.5 }} />}
                </button>
              );
            })}
          </nav>

          {/* Implementations link */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid rgba(71,85,105,.2)" }}>
            <a href="/implementations" style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10,
              background: "rgba(255,255,255,.03)", border: "1px solid rgba(71,85,105,.3)",
              color: "rgba(148,163,184,.65)", fontSize: 12, fontWeight: 600, textDecoration: "none",
              transition: "all 0.15s",
            }}>
              <Box style={{ width: 13, height: 13 }} />
              Implementations
              <ExternalLink style={{ width: 10, height: 10, marginLeft: "auto", opacity: 0.45 }} />
            </a>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: "48px 52px 80px", maxWidth: 800, margin: "100px auto" }}>

{/* OVERVIEW */}
<section id="overview" style={{ scrollMarginTop: 32, marginBottom: 60 }}>
  <SectionLabel>INTRODUCTION</SectionLabel>

  <motion.h1
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      fontSize: "clamp(30px,4vw,48px)",
      fontWeight: 900,
      letterSpacing: "-0.03em",
      margin: "0 0 14px",
      lineHeight: 1.1,
      color: "rgba(226,232,240,.95)",
    }}
  >
    Orbital{" "}
    <span
      style={{
        display: "inline-block",
        background:
          "linear-gradient(130deg,rgba(148,163,184,.9),rgba(203,213,225,.95) 50%,rgba(226,232,240,.8))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      API Docs
    </span>
  </motion.h1>

  <p
    style={{
      fontSize: 16,
      color: "rgba(148,163,184,.65)",
      lineHeight: 1.8,
      margin: "0 0 18px",
      fontWeight: 300,
    }}
  >
    Orbital normalizes documents — CVs, invoices, contracts — into clean, structured JSON. Send a file, receive a webhook. That&apos;s the entire mental model.
  </p>

  <InfoBox type="info">
    <strong style={{ color: "rgba(203,213,225,.9)" }}>Key rule:</strong> A{" "}
    <code
      style={{
        background: "rgba(255,255,255,.06)",
        padding: "1px 5px",
        borderRadius: 4,
        fontSize: 12,
      }}
    >
      202 Accepted
    </code>{" "}
    response never means &quot;success&quot; — it means processing has started. The final result always arrives via your configured webhook.
  </InfoBox>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      marginTop: 20,
    }}
  >
    {[
      {
        Icon: Zap,
        title: "Async by default",
        desc: "Fire-and-forget architecture. Your users aren&apos;t waiting.",
      },
      {
        Icon: Code2,
        title: "Schema-first",
        desc: "You define the output JSON structure. Orbital fills it in.",
      },
      {
        Icon: ShieldCheck,
        title: "Resilient delivery",
        desc: "Built-in retries ensure webhook failures don&apos;t lose data.",
      },
    ].map((c, i) => (
      <div
        key={i}
        style={{
          padding: "16px 18px",
          borderRadius: 12,
          background: "rgba(255,255,255,.025)",
          border: "1px solid rgba(71,85,105,.28)",
        }}
      >
        <c.Icon
          style={{
            width: 16,
            height: 16,
            color: "rgba(148,163,184,.5)",
            marginBottom: 8,
          }}
        />
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(203,213,225,.8)",
            margin: "0 0 4px",
          }}
        >
          {c.title}
        </p>
        <p
          style={{
            fontSize: 12,
            color: "rgba(100,116,139,.7)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          {c.desc}
        </p>
      </div>
    ))}
  </div>
</section>

{/* QUICKSTART */}
<section id="quickstart" style={{ scrollMarginTop: 32, marginBottom: 60 }}>
  <SectionLabel>QUICK START</SectionLabel>

  <h2
    style={{
      fontSize: 26,
      fontWeight: 800,
      letterSpacing: "-0.02em",
      margin: "0 0 16px",
      color: "rgba(226,232,240,.9)",
    }}
  >
    Up and running in 3 steps
  </h2>

  {[
    {
      n: "01",
      title: "Create an API Key",
      desc: "Dashboard → API Keys → Generate new key. Store it securely — it&apos;s shown only once.",
    },
    {
      n: "02",
      title: "Create an Endpoint",
      desc: "Dashboard → Endpoints → New endpoint. Define your output JSON schema and set your webhook URL.",
    },
    {
      n: "03",
      title: "Send your first document",
      desc: "POST a file to your endpoint URL. Receive 202 immediately, then structured JSON arrives at the webhook.",
    },
  ].map((step, i) => (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      style={{
        display: "flex",
        gap: 18,
        padding: "18px 22px",
        marginBottom: 10,
        borderRadius: 12,
        background: "rgba(255,255,255,.025)",
        border: "1px solid rgba(71,85,105,.28)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 900,
          color: "rgba(100,116,139,.6)",
          fontFamily: "monospace",
          minWidth: 22,
          paddingTop: 2,
          letterSpacing: "0.08em",
        }}
      >
        {step.n}
      </span>
      <div>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "rgba(203,213,225,.85)",
            margin: "0 0 4px",
          }}
        >
          {step.title}
        </p>
        <p
          style={{
            fontSize: 13,
            color: "rgba(100,116,139,.7)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  ))}


            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(100,116,139,.6)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Phase 2 — Async (webhook)</p>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid rgba(71,85,105,.28)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.4fr", padding: "9px 14px", background: "rgba(255,255,255,.03)", borderBottom: "1px solid rgba(71,85,105,.2)" }}>
                {["Scenario", "Detection", "Suggested response"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "rgba(100,116,139,.55)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {ASYNC_ERRORS.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.4fr", padding: "11px 14px", borderBottom: i < ASYNC_ERRORS.length - 1 ? "1px solid rgba(71,85,105,.15)" : "none", background: i % 2 === 1 ? "rgba(255,255,255,.015)" : "transparent" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,.65)" }}>{row.scenario}</span>
                  <code style={{ fontSize: 11, color: "rgba(200,170,100,.8)", background: "rgba(80,65,30,.15)", padding: "2px 6px", borderRadius: 4, alignSelf: "start" }}>{row.detect}</code>
                  <span style={{ fontSize: 12, color: "rgba(100,116,139,.6)", lineHeight: 1.55 }}>{row.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* STATES */}
          <section id="states" style={{ scrollMarginTop: 32, marginBottom: 60 }}>
            <SectionLabel>REQUEST LIFECYCLE</SectionLabel>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 12px", color: "rgba(226,232,240,.9)" }}>Request states</h2>
            <p style={{ fontSize: 14, color: "rgba(148,163,184,.6)", lineHeight: 1.7, margin: "0 0 18px" }}>
              Model your UI state machine against these five phases. Each maps to a distinct user experience.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 8 }}>
              {[
                { state: "idle",       Icon: Clock,       desc: "Awaiting upload.",         ui: "Show form."           },
                { state: "loading",    Icon: Activity,    desc: "Sending to Orbital.",      ui: "Brief spinner."       },
                { state: "processing", Icon: Zap,         desc: "Awaiting webhook.",        ui: "Persistent message."  },
                { state: "succeeded",  Icon: CheckCircle, desc: "Result received.",         ui: "Render data."         },
                { state: "failed",     Icon: XCircle,     desc: "Error in any phase.",      ui: "Show retry."          },
              ].map(({ state, Icon, desc, ui }) => (
                <div key={state} style={{
                  padding: "14px", borderRadius: 12,
                  background: "rgba(255,255,255,.025)", border: "1px solid rgba(71,85,105,.28)",
                  textAlign: "center",
                }}>
                  <Icon style={{ width: 18, height: 18, color: "rgba(148,163,184,.5)", margin: "0 auto 7px" }} />
                  <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(203,213,225,.7)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>{state}</p>
                  <p style={{ fontSize: 11, color: "rgba(100,116,139,.6)", margin: "0 0 4px", lineHeight: 1.45 }}>{desc}</p>
                  <p style={{ fontSize: 10, color: "rgba(71,85,105,.7)", margin: 0 }}>{ui}</p>
                </div>
              ))}
            </div>

            <CodeBlock lang="TypeScript" code={`type RequestStatus = "idle" | "loading" | "processing" | "succeeded" | "failed";

interface ApiRequestState {
  status:    RequestStatus;
  requestId: string | null;
  data:      Record<string, unknown> | null;
  error:     string | null;
}

const initialState: ApiRequestState = {
  status: "idle", requestId: null, data: null, error: null,
};`} />
          </section>

          {/* SDK EXAMPLES */}
          <section id="sdks" style={{ scrollMarginTop: 32, marginBottom: 60 }}>
            <SectionLabel>CODE EXAMPLES</SectionLabel>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px", color: "rgba(226,232,240,.9)" }}>Integration examples</h2>
            <p style={{ fontSize: 14, color: "rgba(148,163,184,.6)", lineHeight: 1.7, margin: "0 0 18px" }}>
              Each example covers the document submission and the webhook receiver.
            </p>
            <SdkExamples />
          </section>

          {/* IMPLEMENTATIONS */}
          <section id="impls" style={{ scrollMarginTop: 32 }}>
            <SectionLabel>IMPLEMENTATIONS</SectionLabel>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px", color: "rgba(226,232,240,.9)" }}>Real-world use cases</h2>
            <p style={{ fontSize: 14, color: "rgba(148,163,184,.6)", lineHeight: 1.7, margin: "0 0 18px" }}>
              Full step-by-step guides from schema design to production deployment.
            </p>
            <ImplementationsCard />
          </section>

        </main>
      </div>
    </div>
  );
}

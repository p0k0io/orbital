"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Check, ChevronRight, Terminal, Zap, Globe, Box,
  ArrowRight, BookOpen, Code2, Layers, AlertTriangle,
  CheckCircle, Clock, XCircle, Activity, ExternalLink,
  ShieldCheck, Webhook, Database, GitBranch, Workflow,
  Server, FileCode, Users, Receipt, Scale, Building2,
  Home, TrendingUp, Menu, X, Cpu, Upload, Key,
  FileJson, HelpCircle, Braces,
} from "lucide-react";

async function copyToClipboard(text) {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch { }
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand("copy"); } finally { document.body.removeChild(ta); }
}

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
      backgroundImage:
        "linear-gradient(rgba(71,85,105,.06) 1px,transparent 1px)," +
        "linear-gradient(90deg,rgba(71,85,105,.06) 1px,transparent 1px)",
      backgroundSize: "72px 72px",
    }} />
  );
}

const C = {
  accent:       "rgb(96, 165, 250)",
  accentLight:  "rgba(96, 165, 250, .12)",
  accentBorder: "rgba(96, 165, 250, .35)",
  surface:      "rgba(255,255,255,.025)",
  surfaceHov:   "rgba(255,255,255,.045)",
  border:       "rgba(71,85,105,.3)",
  borderSoft:   "rgba(71,85,105,.18)",
  text:         "rgba(226,232,240,.92)",
  textMid:      "rgba(148,163,184,.7)",
  textSoft:     "rgba(100,116,139,.65)",
  mono:         "'JetBrains Mono','Fira Code',monospace",
};

const NAV = [
  { group: "Getting started", items: [
    { id: "overview",   label: "Overview",       Icon: BookOpen    },
    { id: "quickstart", label: "Quick start",    Icon: Zap         },
    { id: "auth",       label: "Authentication", Icon: ShieldCheck },
  ]},
  { group: "Core concepts", items: [
    { id: "flow",    label: "Async flow",    Icon: Activity  },
    { id: "schema",  label: "Schema builder",Icon: Braces    },
    { id: "webhook", label: "Webhooks",      Icon: Webhook   },
    { id: "output",  label: "Output format", Icon: Code2     },
  ]},
  { group: "Reference", items: [
    { id: "states", label: "Request states",  Icon: Layers        },
    { id: "errors", label: "Error reference", Icon: AlertTriangle },
    { id: "sdks",   label: "SDK examples",    Icon: Terminal      },
    { id: "impls",  label: "Implementations", Icon: Box           },
  ]},
];

const ALL_SECTION_IDS = NAV.flatMap(g => g.items.map(i => i.id));

const UPLOAD_SNIPPETS = {
  nodejs: {
    label: "Node.js", Icon: Server, color: "#7da87b",
    code: `import FormData from "form-data";
import fs       from "fs";
import axios    from "axios";

const API_KEY  = process.env.ORBITAL_API_KEY;
const ENDPOINT = \`https://api.orbital.io/cv/\${process.env.ENDPOINT_ID}\`;

async function processDocument(filePath, metadata = {}) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));

  if (Object.keys(metadata).length)
    form.append("metadata", JSON.stringify(metadata));

  const { data } = await axios.post(ENDPOINT, form, {
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
      ...form.getHeaders(),
    },
  });

  console.log("Processing started →", data.request_id);
  return data.request_id;
}`,
  },
  python: {
    label: "Python", Icon: Terminal, color: "#5b9ea0",
    code: `import httpx, os, json

API_KEY  = os.getenv("ORBITAL_API_KEY")
BASE_URL = "https://api.orbital.io"

async def process_document(endpoint_id: str, file_path: str,
                            metadata: dict = {}) -> str:
    async with httpx.AsyncClient() as client:
        with open(file_path, "rb") as f:
            files    = {"file": (os.path.basename(file_path), f)}
            data     = {"metadata": json.dumps(metadata)} if metadata else {}
            headers  = {"Authorization": f"Bearer {API_KEY}"}

            resp = await client.post(
                f"{BASE_URL}/cv/{endpoint_id}",
                headers=headers,
                files=files,
                data=data,
            )

    resp.raise_for_status()
    payload = resp.json()
    print("Processing started →", payload["request_id"])
    return payload["request_id"]`,
  },
  fastapi: {
    label: "FastAPI", Icon: Zap, color: "#5b9ea0",
    code: `from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import httpx, os, json

app     = FastAPI()
API_KEY = os.getenv("ORBITAL_API_KEY")
BASE    = "https://api.orbital.io"

@app.post("/process/{endpoint_id}")
async def process_document(
    endpoint_id: str,
    file: UploadFile,
    metadata: str = Form(default="{}")
):
    content  = await file.read()
    meta     = json.loads(metadata)

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{BASE}/cv/{endpoint_id}",
            headers={"Authorization": f"Bearer {API_KEY}"},
            files={"file": (file.filename, content, file.content_type)},
            data={"metadata": json.dumps(meta)} if meta else {},
        )

    if resp.status_code != 202:
        return JSONResponse(status_code=resp.status_code, content=resp.json())

    return {"request_id": resp.json()["request_id"], "status": "processing"}`,
  },
  django: {
    label: "Django", Icon: Database, color: "rgba(255,255,255,.5)",
    code: `# views.py
import requests, os, json
from django.http import JsonResponse
from django.views.decorators.http import require_POST

API_KEY = os.getenv("ORBITAL_API_KEY")
BASE    = "https://api.orbital.io"

@require_POST
def process_document(request, endpoint_id):
    uploaded = request.FILES.get("file")
    if not uploaded:
        return JsonResponse({"error": "No file provided"}, status=422)

    metadata = {}
    if meta_str := request.POST.get("metadata"):
        try:
            metadata = json.loads(meta_str)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid metadata JSON"}, status=422)

    resp = requests.post(
        f"{BASE}/cv/{endpoint_id}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        files={"file": (uploaded.name, uploaded.read(), uploaded.content_type)},
        data={"metadata": json.dumps(metadata)} if metadata else {},
        timeout=30,
    )

    if resp.status_code != 202:
        return JsonResponse(resp.json(), status=resp.status_code)

    return JsonResponse({"request_id": resp.json()["request_id"]})`,
  },
  laravel: {
    label: "Laravel", Icon: FileCode, color: "#c0614e",
    code: `<?php
// app/Http/Controllers/OrbitalController.php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;

class OrbitalController extends Controller
{
    private string $base = 'https://api.orbital.io';

    public function process(Request $request, string $endpointId)
    {
        $request->validate(['file' => 'required|file']);

        $metadata = $request->input('metadata', '{}');

        $response = Http::withToken(config('services.orbital.key'))
            ->attach(
                'file',
                fopen($request->file('file')->getRealPath(), 'r'),
                $request->file('file')->getClientOriginalName()
            )
            ->post("{$this->base}/cv/{$endpointId}", [
                'metadata' => $metadata,
            ]);

        abort_unless(
            $response->status() === 202,
            $response->status(),
            $response->json('detail') ?? 'Orbital error'
        );

        return response()->json([
            'request_id' => $response->json('request_id'),
        ]);
    }
}`,
  },
  reactnative: {
    label: "React Native", Icon: Globe, color: "#61dafb",
    code: `// receiptService.js
const API_URL    = process.env.EXPO_PUBLIC_ORBITAL_API_URL;
const ENDPOINT   = process.env.EXPO_PUBLIC_ENDPOINT_ID;

export const orbitalService = {
  async uploadDocument(imageAsset, token, metadata = {}) {
    const formData = new FormData();

    formData.append("file", {
      uri:  imageAsset.uri,
      type: imageAsset.type  ?? "image/jpeg",
      name: imageAsset.filename ?? "document.jpg",
    });

    if (Object.keys(metadata).length)
      formData.append("metadata", JSON.stringify(metadata));

    const res = await fetch(\`\${API_URL}/\${ENDPOINT}\`, {
      method:  "POST",
      headers: { Authorization: \`Bearer \${token}\` },
      body:    formData,
    });

    if (res.status === 401) throw new Error("Session expired. Please log in again.");
    if (res.status !== 202) {
      const text = await res.text();
      throw new Error(\`Upload failed: \${text}\`);
    }

    return res.json();
  },
};`,
  },
};

const WEBHOOK_SNIPPETS = {
  fastapi: {
    label: "FastAPI", Icon: Zap, color: "#5b9ea0",
    code: `from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
import os, logging

logger         = logging.getLogger(__name__)
WEBHOOK_SECRET = os.getenv("ORBITAL_WEBHOOK_SECRET")

@app.post("/orbital/webhook")
async def orbital_webhook(request: Request, tasks: BackgroundTasks,
                          db: Session = Depends(get_db)):
    payload = await request.json()

    secret = payload.get("secret_webhook") or payload.get("webhook_secret")
    if secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")

    metadata   = payload.get("metadata", {})
    request_id = payload.get("request_id")

    if payload["status"] == "completed":
        data = payload.get("data", {})
        tasks.add_task(handle_success, data, metadata, request_id, db)
    else:
        error = payload.get("error", "Unknown error")
        logger.error("Orbital failed [%s]: %s", request_id, error)
        tasks.add_task(handle_failure, request_id, error, db)

    return {"message": "Webhook received successfully"}`,
  },
  django: {
    label: "Django", Icon: Database, color: "rgba(255,255,255,.5)",
    code: `# views.py
import json, os, logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

logger         = logging.getLogger(__name__)
WEBHOOK_SECRET = os.getenv("ORBITAL_WEBHOOK_SECRET")

@csrf_exempt
@require_POST
def orbital_webhook(request):
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    secret = payload.get("secret_webhook") or payload.get("webhook_secret")
    if secret != WEBHOOK_SECRET:
        return JsonResponse({"error": "Invalid webhook secret"}, status=401)

    metadata   = payload.get("metadata", {})
    request_id = payload.get("request_id")

    if payload.get("status") == "completed":
        data    = payload.get("data", {})
        user_id = metadata.get("user_id")
        process_orbital_result.delay(user_id, data, request_id)
    else:
        error = payload.get("error", "Unknown error")
        logger.error("Orbital failed [%s]: %s", request_id, error)
        mark_request_failed.delay(request_id, error)

    return JsonResponse({"message": "Webhook received successfully"})`,
  },
  nodejs: {
    label: "Node.js / Express", Icon: Server, color: "#7da87b",
    code: `import express from "express";
const router = express.Router();
const WEBHOOK_SECRET = process.env.ORBITAL_WEBHOOK_SECRET;

router.post("/orbital/webhook", express.json(), async (req, res) => {
  const { status, data, error, metadata, secret_webhook,
          webhook_secret, request_id } = req.body;

  const secret = secret_webhook ?? webhook_secret;
  if (secret !== WEBHOOK_SECRET) {
    return res.status(401).json({ error: "Invalid webhook secret" });
  }

  try {
    if (status === "completed") {
      const userId = metadata?.user_id;
      await db.results.create({
        requestId: request_id,
        userId,
        data,
        processedAt: new Date(),
      });
      logger.info({ requestId: request_id, userId }, "Result saved");
    } else {
      await db.requests.update(
        { status: "failed", error },
        { where: { requestId: request_id } }
      );
      logger.error({ requestId: request_id, error }, "Processing failed");
    }
  } catch (err) {
    logger.error({ err }, "Error handling webhook");
  }

  res.sendStatus(200);
});

export default router;`,
  },
  laravel: {
    label: "Laravel", Icon: FileCode, color: "#c0614e",
    code: `<?php
// app/Http/Controllers/OrbitalController.php
namespace App\\Http\\Controllers;

use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Log;
use App\\Jobs\\ProcessOrbitalResult;
use App\\Jobs\\HandleOrbitalFailure;

class OrbitalController extends Controller
{
    public function webhook(Request $request)
    {
        $payload = $request->json()->all();

        $secret = $payload['secret_webhook'] ?? $payload['webhook_secret'] ?? null;
        if ($secret !== config('services.orbital.webhook_secret')) {
            return response()->json(['error' => 'Invalid webhook secret'], 401);
        }

        $requestId = $payload['request_id'] ?? null;
        $metadata  = $payload['metadata']   ?? [];

        if ($payload['status'] === 'completed') {
            ProcessOrbitalResult::dispatch(
                $payload['data'],
                $metadata,
                $requestId
            );
        } else {
            $error = $payload['error'] ?? 'Unknown error';
            Log::error('Orbital processing failed', [
                'request_id' => $requestId,
                'error'      => $error,
            ]);
            HandleOrbitalFailure::dispatch($requestId, $error);
        }

        return response()->json(['message' => 'Webhook received successfully']);
    }
}`,
  },
  go: {
    label: "Go", Icon: Terminal, color: "#79d4fd",
    code: `package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"
)

type WebhookPayload struct {
    Status        string                 \`json:"status"\`
    RequestID     string                 \`json:"request_id"\`
    SecretWebhook string                 \`json:"secret_webhook"\`
    WebhookSecret string                 \`json:"webhook_secret"\`
    Data          map[string]interface{} \`json:"data"\`
    Error         string                 \`json:"error"\`
    Metadata      map[string]interface{} \`json:"metadata"\`
}

func orbitalWebhookHandler(w http.ResponseWriter, r *http.Request) {
    var payload WebhookPayload
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        http.Error(w, "invalid JSON", http.StatusBadRequest)
        return
    }

    secret := payload.SecretWebhook
    if secret == "" { secret = payload.WebhookSecret }
    if secret != os.Getenv("ORBITAL_WEBHOOK_SECRET") {
        http.Error(w, "invalid webhook secret", http.StatusUnauthorized)
        return
    }

    if payload.Status == "completed" {
        go saveResult(payload.RequestID, payload.Data, payload.Metadata)
    } else {
        log.Printf("Orbital failed [%s]: %s", payload.RequestID, payload.Error)
    }

    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"message":"ok"}\`))
}`,
  },
};

const UPLOAD_ORDER  = ["nodejs","python","fastapi","django","laravel","reactnative"];
const WEBHOOK_ORDER = ["fastapi","django","nodejs","laravel","go"];

const SCHEMA_EXAMPLES = [
  {
    title: "Simple flat object",
    desc:  "A flat schema with scalar types. Good for receipts, simple forms, or any document with clearly delimited fields.",
    code: `{
  "schema": {
    "type": "object",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["title", "date", "total_amount"],
    "properties": {
      "title":        { "type": "string"  },
      "date":         { "type": "string"  },
      "total_amount": { "type": "number"  },
      "paid":         { "type": "boolean" }
    }
  },
  "callbackURL": "https://your-api.com/webhook"
}`,
  },
  {
    title: "Enum field",
    desc:  "Constrain a string field to a fixed set of allowed values. Orbital picks the closest match from the document.",
    code: `{
  "schema": {
    "type": "object",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "required": ["status"],
    "properties": {
      "reference": { "type": "string" },
      "status": {
        "type": "string",
        "enum": ["pending", "paid", "overdue", "cancelled"]
      }
    }
  },
  "callbackURL": "https://your-api.com/webhook"
}`,
  },
  {
    title: "Array of items",
    desc:  "Extract a repeating list from the document — e.g. line items, work experiences, or skills.",
    code: `{
  "schema": {
    "type": "object",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "quantity":    { "type": "number" },
            "unit_price":  { "type": "number" }
          }
        }
      }
    }
  },
  "callbackURL": "https://your-api.com/webhook"
}`,
  },
  {
    title: "Nested object",
    desc:  "Group related fields into a sub-object. Useful for addresses, contact details, or party information in contracts.",
    code: `{
  "schema": {
    "type": "object",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
      "issuer": {
        "type": "object",
        "properties": {
          "name":    { "type": "string" },
          "address": { "type": "string" },
          "tax_id":  { "type": "string" }
        }
      },
      "recipient": {
        "type": "object",
        "properties": {
          "name":    { "type": "string" },
          "address": { "type": "string" }
        }
      }
    }
  },
  "callbackURL": "https://your-api.com/webhook"
}`,
  },
];

const IMPLS = [
  { Icon: Users,      title: "HR recruitment pipeline",   desc: "Parse CVs into a normalized candidate schema and seed your ATS automatically." },
  { Icon: Receipt,    title: "Invoice sync",               desc: "Extract line items and totals from invoices, push to your ERP or accounting system." },
  { Icon: Scale,      title: "Legal contract analysis",   desc: "Extract parties, dates, and key clauses into a searchable structured database." },
  { Icon: TrendingUp, title: "Financial document OCR",    desc: "Normalize bank statements and balance sheets and push to your BI stack." },
  { Icon: Home,       title: "Real estate listing parser", desc: "Extract property details from PDFs and push to your CRM." },
  { Icon: Workflow,   title: "No-code pipeline",           desc: "Connect Orbital to 400+ apps via n8n or Make without writing backend code." },
];

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <span style={{ width: 20, height: 1, background: C.accentBorder, display: "inline-block" }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.2em", fontWeight: 600,
        color: C.accent, textTransform: "uppercase",
      }}>{children}</span>
    </div>
  );
}

function InfoBox({ type = "info", children }) {
  const cfg = {
    info:    { bg: "rgba(71,85,105,.2)",  border: "rgba(100,116,139,.3)", color: "rgba(186,200,220,.8)", icon: "ℹ" },
    warn:    { bg: "rgba(92,76,50,.2)",   border: "rgba(120,100,60,.35)", color: "rgba(210,180,100,.8)", icon: "⚠" },
    success: { bg: "rgba(29,158,117,.1)", border: "rgba(29,158,117,.3)",  color: "rgba(140,190,160,.9)", icon: "✓" },
  }[type];
  return (
    <div style={{
      display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10, margin: "14px 0",
      background: cfg.bg, border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ color: cfg.color, flexShrink: 0, fontSize: 13, marginTop: 1 }}>{cfg.icon}</span>
      <p style={{ fontSize: 13, color: "rgba(203,213,225,.65)", lineHeight: 1.65, margin: 0 }}>{children}</p>
    </div>
  );
}

/* FIX 2 & 3: StatusPill — inline-flex + fit-content so it never stretches */
function StatusPill({ code }) {
  const colors = {
    "202": { bg: "rgba(29,158,117,.12)",  border: "rgba(29,158,117,.35)",  text: "rgba(140,190,160,.95)" },
    "401": { bg: "rgba(80,40,40,.2)",     border: "rgba(110,60,60,.35)",   text: "rgba(200,130,120,.9)"  },
    "403": { bg: "rgba(80,40,40,.2)",     border: "rgba(110,60,60,.35)",   text: "rgba(200,130,120,.9)"  },
    "404": { bg: "rgba(80,65,30,.2)",     border: "rgba(110,90,40,.35)",   text: "rgba(200,170,100,.9)"  },
    "422": { bg: "rgba(80,65,30,.2)",     border: "rgba(110,90,40,.35)",   text: "rgba(200,170,100,.9)"  },
    "500": { bg: "rgba(80,40,40,.2)",     border: "rgba(110,60,60,.35)",   text: "rgba(200,130,120,.9)"  },
  }[code] ?? { bg: C.surface, border: C.border, text: C.textMid };
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      width: "fit-content",
      fontFamily: C.mono, fontSize: 12, fontWeight: 700,
      padding: "2px 8px", borderRadius: 5,
      background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text,
      whiteSpace: "nowrap",
    }}>{code}</span>
  );
}

function CodeBlock({ code, lang = "" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{
      position: "relative", borderRadius: 12, overflow: "hidden",
      border: `1px solid ${C.border}`, margin: "12px 0",
      background: "rgba(2,8,18,.7)",
    }}>
      {lang && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "7px 14px", background: "rgba(255,255,255,.03)",
          borderBottom: `1px solid ${C.borderSoft}`,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", color: C.textSoft, fontWeight: 600, textTransform: "uppercase" }}>{lang}</span>
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 5,
            background: copied ? "rgba(29,158,117,.12)" : "rgba(255,255,255,.04)",
            border: `1px solid ${copied ? C.accentBorder : C.border}`,
            color: copied ? "rgba(140,190,160,.9)" : C.textSoft,
            fontSize: 11, cursor: "pointer", transition: "all 0.2s",
          }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre style={{
        margin: 0, padding: "16px 18px", fontSize: 12.5, lineHeight: 1.7,
        color: "rgba(203,213,225,.78)", overflowX: "auto",
        fontFamily: C.mono,
      }}>{code}</pre>
    </div>
  );
}

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{
      display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 6,
      background: copied ? "rgba(29,158,117,.12)" : "rgba(255,255,255,.04)",
      border: `1px solid ${copied ? C.accentBorder : C.border}`,
      color: copied ? "rgba(140,190,160,.9)" : C.textSoft,
      fontSize: 11, cursor: "pointer", transition: "all 0.2s",
    }}>
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}

function TabbedCode({ snippets, order }) {
  const [active, setActive] = useState(order[0]);
  const snip = snippets[active];

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 3, padding: 5,
        borderRadius: "12px 12px 0 0",
        background: "rgba(255,255,255,.02)",
        border: `1px solid ${C.border}`, borderBottom: "none",
      }}>
        {order.map(key => {
          const s = snippets[key];
          const isActive = active === key;
          return (
            <button key={key} onClick={() => setActive(key)} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s", border: "none",
              background: isActive ? "rgba(255,255,255,.06)" : "transparent",
              color: isActive ? C.text : C.textSoft,
              boxShadow: isActive ? `inset 0 -2px 0 ${s.color}` : "none",
            }}>
              <s.Icon size={12} style={{ color: isActive ? s.color : C.textSoft }} />
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
          transition={{ duration: 0.14 }}
          style={{
            borderRadius: "0 0 12px 12px", overflow: "hidden",
            border: `1px solid ${C.border}`,
            borderTop: `1px solid ${snip.color}44`,
            background: "rgba(2,8,18,.7)",
          }}
        >
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 14px", background: "rgba(255,255,255,.02)",
            borderBottom: `1px solid ${C.borderSoft}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <snip.Icon size={13} style={{ color: snip.color }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(203,213,225,.6)" }}>{snip.label}</span>
            </div>
            <CopyButton code={snip.code} />
          </div>
          <pre style={{
            margin: 0, padding: "16px 20px", fontSize: 12.5, lineHeight: 1.75,
            color: "rgba(203,213,225,.78)", overflowX: "auto",
            fontFamily: C.mono, maxHeight: 480,
          }}>{snip.code}</pre>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SchemaExamples() {
  const [active, setActive] = useState(0);
  const ex = SCHEMA_EXAMPLES[active];
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {SCHEMA_EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 13px", borderRadius: 999, fontSize: 12, fontWeight: 500,
            cursor: "pointer", transition: "all 0.15s",
            background: active === i ? C.accentLight : C.surface,
            color: active === i ? C.accent : C.textMid,
            border: `1px solid ${active === i ? C.accentBorder : C.border}`,
          }}>
            {e.title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }}>
          <p style={{ fontSize: 13, color: C.textMid, lineHeight: 1.6, margin: "0 0 6px" }}>{ex.desc}</p>
          <CodeBlock code={ex.code} lang="JSON Schema draft-07" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FlowDiagram() {
  const steps = [
    { Icon: Upload,  label: "Upload",      note: "POST file + metadata" },
    { Icon: Clock,   label: "202 Accepted",note: "request_id returned"  },
    { Icon: Cpu,     label: "Processing",  note: "Orbital extracts data"},
    { Icon: Webhook, label: "Webhook",     note: "result or error"      },
  ];
  return (
    <div style={{ display: "flex", alignItems: "stretch", flexWrap: "wrap", gap: 4, margin: "20px 0" }}>
      {steps.map(({ Icon, label, note }, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 100 }}>
          <div style={{
            flex: 1, padding: "14px 10px", borderRadius: 12, textAlign: "center",
            background: C.surface, border: `1px solid ${C.border}`,
          }}>
            <Icon size={18} style={{ color: C.textMid, marginBottom: 7 }} />
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(203,213,225,.8)", margin: "0 0 3px" }}>{label}</p>
            <p style={{ fontSize: 10, color: C.textSoft, margin: 0, lineHeight: 1.4 }}>{note}</p>
          </div>
          {i < steps.length - 1 && (
            <ArrowRight size={13} style={{ color: C.textSoft, flexShrink: 0, margin: "0 4px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

function NavContent({ activeSection, onNavigate }) {
  return (
    <>
      <div style={{ marginBottom: 24, paddingBottom: 18, borderBottom: `1px solid ${C.borderSoft}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: C.surface, border: `1px solid ${C.border}`,
          }}>
            <Globe size={14} style={{ color: C.textMid }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>Orbital</span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", padding: "1px 7px",
            borderRadius: 999, color: C.textSoft, background: C.surface, border: `1px solid ${C.border}`,
          }}>DOCS</span>
        </div>
        <p style={{ fontSize: 11, color: C.textSoft, margin: 0, letterSpacing: "0.04em" }}>API Reference v1.0</p>
      </div>

      {NAV.map(group => (
        <div key={group.group} style={{ marginBottom: 16 }}>
          <p style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: C.textSoft, textTransform: "uppercase", margin: "0 0 4px 11px",
          }}>
            {group.group}
          </p>
          {group.items.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button key={id} onClick={() => onNavigate(id)} style={{
                display: "flex", alignItems: "center", gap: 9, padding: "7px 11px",
                borderRadius: 9, cursor: "pointer", textAlign: "left", width: "100%",
                background: isActive ? C.accentLight : "transparent",
                border: `1px solid ${isActive ? C.accentBorder : "transparent"}`,
                color: isActive ? C.accent : C.textMid,
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                transition: "all 0.14s",
              }}>
                <Icon size={13} style={{ flexShrink: 0 }} />
                {label}
                {isActive && <ChevronRight size={11} style={{ marginLeft: "auto", opacity: 0.5 }} />}
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

function MobileNavModal({ activeSection, onNavigate, open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)" }}
          />
          <motion.div
            key="drawer"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
              background: "rgba(5,12,24,.97)", backdropFilter: "blur(20px)",
              borderTop: `1px solid ${C.border}`, borderRadius: "20px 20px 0 0",
              padding: "20px 20px 40px", maxHeight: "82vh", overflowY: "auto",
            }}
          >
            <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 20px" }} />
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 8,
                background: C.surface, border: `1px solid ${C.border}`,
                color: C.textMid, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <X size={14} />
            </button>
            <NavContent
              activeSection={activeSection}
              onNavigate={(id) => { onNavigate(id); onClose(); }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  /* FIX 1: Scroll spy on the window/document, not a nested div,
     so the scrollbar appears on the far right of the browser chrome */
  useEffect(() => {
    const handler = () => {
      let current = "overview";
      ALL_SECTION_IDS.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const h2 = {
    fontSize: "clamp(20px,2.5vw,26px)", fontWeight: 800,
    letterSpacing: "-0.02em", margin: "0 0 12px", color: C.text,
  };
  const lead = {
    fontSize: 14, color: C.textMid, lineHeight: 1.75, margin: "0 0 20px",
  };
  const inlineCode = {
    fontFamily: C.mono, fontSize: 12,
    background: "rgba(255,255,255,.06)", padding: "1px 5px", borderRadius: 4,
  };

  return (
    <div style={{
      position: "relative", color: "white", minHeight: "100vh",
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      background: "#050c18",
    }}>
      <Starfield />
      <GridOverlay />

      {/* Aurora */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", borderRadius: "50%", width: 480, height: 280, top: -60, left: -80, background: "radial-gradient(ellipse,rgba(15,30,60,.9),transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", borderRadius: "50%", width: 380, height: 240, bottom: "20%", right: -60, background: "radial-gradient(ellipse,rgba(10,25,55,.8),transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <MobileNavModal
        activeSection={activeSection}
        onNavigate={scrollTo}
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="mobile-nav-fab"
        style={{
          position: "fixed", bottom: 24, left: 20, zIndex: 80,
          display: "none",
          alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999,
          background: "rgba(5,12,24,.92)", backdropFilter: "blur(16px)",
          border: `1px solid ${C.border}`, color: "rgba(203,213,225,.8)",
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          boxShadow: "0 4px 24px rgba(0,0,0,.5)", transition: "all 0.2s",
        }}
      >
        <Menu size={15} /> Navigation
      </button>

      {/* FIX 1: Custom scrollbar styles + media queries */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-nav-fab  { display: flex !important; }
          .main-content    { padding: 32px 20px 100px !important; }
        }
        @media (min-width: 769px) { .mobile-nav-fab { display: none !important; } }

        /* FIX 1: Style the page-level scrollbar (right edge of browser) */
        html {
          scrollbar-width: thin;
          scrollbar-color: rgba(71,85,105,.4) transparent;
        }
        html::-webkit-scrollbar { width: 5px; }
        html::-webkit-scrollbar-track { background: transparent; }
        html::-webkit-scrollbar-thumb {
          background: rgba(71,85,105,.4);
          border-radius: 3px;
        }
        html::-webkit-scrollbar-thumb:hover { background: rgba(96,165,250,.35); }

        pre::-webkit-scrollbar { height: 4px; }
        pre::-webkit-scrollbar-track { background: transparent; }
        pre::-webkit-scrollbar-thumb { background: rgba(71,85,105,.4); border-radius: 2px; }
      `}</style>

      {/* FIX 1: layout is now position:relative, not a scroll container.
          The page scrolls naturally via the html/body, putting the scrollbar
          on the far right of the viewport. */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", minHeight: "100vh" }}>

        {/* DESKTOP SIDEBAR — sticky to viewport top */}
        <aside
          className="desktop-sidebar"
          style={{
            width: 252, flexShrink: 0,
            position: "sticky", top: 0, alignSelf: "flex-start",
            height: "100vh", overflowY: "auto",
            padding: "28px 14px",
            borderRight: `1px solid ${C.borderSoft}`,
            background: "rgba(5,12,24,.92)", backdropFilter: "blur(16px)",
          }}
        >
          <NavContent activeSection={activeSection} onNavigate={scrollTo} />
        </aside>

        {/* MAIN — natural document flow, no overflow:auto */}
        <main
          className="main-content"
          style={{
            flex: 1,
            padding: "130px 56px 80px",
            maxWidth: 840,
            margin: "0 auto",
          }}
        >

          {/* ── OVERVIEW ── */}
          <section id="overview" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Introduction</SectionLabel>
            <motion.h1
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: "clamp(30px,4vw,48px)", fontWeight: 900,
                letterSpacing: "-0.03em", margin: "0 0 14px", lineHeight: 1.1, color: C.text,
              }}
            >
              Orbital{" "}
              <span style={{
                background: "linear-gradient(130deg,rgba(148,163,184,.9),rgba(226,232,240,.95) 50%,rgba(203,213,225,.8))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>API Docs</span>
            </motion.h1>
            <p style={{ ...lead, fontSize: 16 }}>
              Orbital transforms unstructured documents — CVs, invoices, contracts, receipts — into clean structured JSON defined by your own schema. Upload a file, get a webhook. That&apos;s the entire mental model.
            </p>
            <InfoBox type="info">
              <strong style={{ color: "rgba(203,213,225,.9)" }}>Key rule:</strong>{" "}
              A <code style={inlineCode}>202 Accepted</code> response never means success — it means processing has started. The final result always arrives via your configured webhook.
            </InfoBox>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 12, marginTop: 22 }}>
              {[
                { Icon: Zap,         title: "Async by default",    desc: "Fire-and-forget. Your users are never blocked waiting for processing." },
                { Icon: FileJson,    title: "Schema-first",         desc: "You define the JSON output structure. Orbital fills it from the document." },
                { Icon: ShieldCheck, title: "Resilient delivery",  desc: "Built-in retries so webhook failures never lose data." },
                { Icon: FileCode,    title: "Wide format support",  desc: "PDF, Word, ODT, JPG, PNG and more — one consistent API." },
              ].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  style={{ padding: "16px 18px", borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
                  <c.Icon size={16} style={{ color: C.textMid, marginBottom: 8 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(203,213,225,.8)", margin: "0 0 5px" }}>{c.title}</p>
                  <p style={{ fontSize: 12, color: C.textSoft, margin: 0, lineHeight: 1.55 }}>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── QUICK START ── */}
          <section id="quickstart" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Quick start</SectionLabel>
            <h2 style={h2}>Up and running in 3 steps</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { n: "01", title: "Generate an API key",       body: "Dashboard → API Keys → Generate new key. Store it immediately — it's shown only once." },
                { n: "02", title: "Create an endpoint",        body: "Dashboard → Endpoints → New endpoint. Define your JSON schema, set your callback URL, and copy the auto-generated webhook secret. Each endpoint handles one document type." },
                { n: "03", title: "Submit your first document",body: "POST a file to your endpoint URL. Receive 202 immediately with a request_id. Structured JSON arrives at your webhook once processing completes." },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: "flex", gap: 18, padding: "16px 20px", borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 900, color: C.textSoft, fontFamily: C.mono, minWidth: 22, paddingTop: 2, letterSpacing: "0.08em" }}>{s.n}</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "rgba(203,213,225,.85)", margin: "0 0 4px" }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: C.textSoft, margin: 0, lineHeight: 1.6 }}>{s.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <CodeBlock lang="HTTP Request" code={`POST /cv/{endpoint_id} HTTP/1.1
Host:          api.orbital.io
Authorization: Bearer YOUR_API_KEY
Content-Type:  multipart/form-data

[file]     document.pdf
[metadata] {"user_id": "usr_123"}`} />
            <CodeBlock lang="202 Accepted response" code={`{
  "request_id": "req_a1b2c3d4e5f6",
  "message":    "File received. Processing started."
}`} />
          </section>

          {/* ── AUTH ── */}
          <section id="auth" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Authentication</SectionLabel>
            <h2 style={h2}>API key</h2>
            <p style={lead}>
              All requests require your API key as a Bearer token in the{" "}
              <code style={inlineCode}>Authorization</code> header.
            </p>
            <CodeBlock lang="Header" code={`Authorization: Bearer orbital_sk_live_xxxxxxxxxxxx`} />
            <InfoBox type="warn">
              Never expose your API key in client-side code. All requests to Orbital must originate from your backend. If a key is compromised, regenerate it immediately from the dashboard.
            </InfoBox>

            <h2 style={{ ...h2, marginTop: 32 }}>Webhook secret</h2>
            <p style={lead}>
              Each endpoint has an auto-generated webhook secret. Use it to verify that incoming webhook calls are genuinely from Orbital — compare the{" "}
              <code style={inlineCode}>secret_webhook</code> field in every payload against your stored value.
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 12, padding: "11px 16px",
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, margin: "14px 0",
            }}>
              <Key size={15} style={{ color: C.textSoft, flexShrink: 0 }} />
              <code style={{ fontFamily: C.mono, fontSize: 12, color: C.textMid }}>
                orbital-b727637d-6446-4585-8867-9ae7336b01d4
              </code>
            </div>
            <CodeBlock lang="Python — webhook secret validation" code={`WEBHOOK_SECRET = os.getenv("ORBITAL_WEBHOOK_SECRET")

@app.post("/webhook")
async def receive_webhook(payload: dict):
    secret = payload.get("secret_webhook") or payload.get("webhook_secret")
    if secret != WEBHOOK_SECRET:
        raise HTTPException(status_code=401, detail="Invalid webhook secret")
    # safe to process`} />
          </section>

          {/* ── ASYNC FLOW ── */}
          <section id="flow" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Core concepts</SectionLabel>
            <h2 style={h2}>Async processing flow</h2>
            <p style={lead}>
              Orbital uses a two-phase model. Your upload returns immediately; the extracted data arrives via webhook once processing completes.
            </p>
            <FlowDiagram />
            <InfoBox type="info">
              Design your UI around the <strong>processing</strong> state — not just <em>loading</em>. After the upload resolves, show a persistent &quot;Processing your document…&quot; indicator until the webhook fires.
            </InfoBox>
          </section>

          {/* ── SCHEMA BUILDER ── */}
          <section id="schema" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Core concepts</SectionLabel>
            <h2 style={h2}>Schema builder</h2>
            <p style={lead}>
              The schema tells Orbital exactly what to extract and in what shape. It follows{" "}
              <strong style={{ color: C.textMid }}>JSON Schema draft-07</strong> — every standard keyword is supported. Both the schema and the webhook callback URL are defined together when creating or updating an endpoint.
            </p>
            <InfoBox type="success">
              The dashboard includes an AI assistant that generates a schema from a plain-language description. You can also write or paste JSON Schema directly.
            </InfoBox>

            <h2 style={{ ...h2, fontSize: 18, marginTop: 28 }}>Supported field types</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 8, margin: "12px 0 20px" }}>
              {[
                { type: "string",  desc: "Plain text, names, identifiers" },
                { type: "number",  desc: "Integers and decimals" },
                { type: "boolean", desc: "true / false flags" },
                { type: "array",   desc: "Lists of typed items" },
                { type: "object",  desc: "Nested sub-objects" },
                { type: "enum",    desc: "Constrained string values" },
              ].map(f => (
                <div key={f.type} style={{ padding: "11px 13px", borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
                  <code style={{ fontFamily: C.mono, fontSize: 12, color: C.accent, display: "block", marginBottom: 4 }}>{f.type}</code>
                  <p style={{ fontSize: 11, color: C.textSoft, margin: 0, lineHeight: 1.4 }}>{f.desc}</p>
                </div>
              ))}
            </div>

            <InfoBox type="info">
              When Orbital cannot find a field&apos;s value in the document, that field is returned as{" "}
              <code style={inlineCode}>null</code> — it is never omitted or thrown as an error.
            </InfoBox>

            <h2 style={{ ...h2, fontSize: 18, marginTop: 28 }}>Schema examples</h2>
            <p style={{ fontSize: 13, color: C.textMid, margin: "0 0 4px" }}>
              Select a pattern below to see the corresponding schema definition.
            </p>
            <SchemaExamples />

            <InfoBox type="warn">
              Each endpoint handles exactly one document type. Create separate endpoints for CVs, invoices, contracts, etc.
            </InfoBox>
          </section>

          {/* ── WEBHOOKS ── */}
          <section id="webhook" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Core concepts</SectionLabel>
            <h2 style={h2}>Webhooks</h2>
            <p style={lead}>
              Orbital POSTs to your <code style={inlineCode}>callbackURL</code> once processing completes or fails. Always respond with{" "}
              <code style={inlineCode}>200 OK</code> — any other status triggers a retry.
            </p>

            <CodeBlock lang="Webhook payload — completed" code={`{
  "status":         "completed",
  "request_id":     "req_a1b2c3d4e5f6",
  "secret_webhook": "orbital-b727637d-6446-4585-8867-9ae7336b01d4",
  "data": {
    // fields matching your schema
  },
  "metadata": {
    // your original metadata, passed through unchanged
    "user_id": "usr_123"
  }
}`} />
            <CodeBlock lang="Webhook payload — failed" code={`{
  "status":         "failed",
  "request_id":     "req_a1b2c3d4e5f6",
  "secret_webhook": "orbital-b727637d-6446-4585-8867-9ae7336b01d4",
  "error":          "Could not extract required fields from document.",
  "metadata": {
    "user_id": "usr_123"
  }
}`} />

            <InfoBox type="info">
              The <code style={inlineCode}>metadata</code> object you send at upload time is passed through unchanged in every webhook — use it to route results back to the right user, record, or context in your system.
            </InfoBox>

            <h2 style={{ ...h2, fontSize: 18, marginTop: 28 }}>Webhook receiver examples</h2>
            <TabbedCode snippets={WEBHOOK_SNIPPETS} order={WEBHOOK_ORDER} />
          </section>

          {/* ── OUTPUT FORMAT ── */}
          <section id="output" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Core concepts</SectionLabel>
            <h2 style={h2}>Output format</h2>
            <p style={lead}>
              The <code style={inlineCode}>data</code> field in the webhook payload mirrors your schema exactly. Unextracted fields will be present as{" "}
              <code style={inlineCode}>null</code>.
            </p>
            <CodeBlock lang="TypeScript — typed webhook payload" code={`interface OrbitalWebhookPayload<T = Record<string, unknown>> {
  status:         "completed" | "failed";
  request_id:     string;
  secret_webhook: string;
  data?:          T;           // present only when status === "completed"
  error?:         string;      // present only when status === "failed"
  metadata:       Record<string, unknown>;
}`} />
          </section>

          {/* ── STATES ── */}
          <section id="states" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Reference</SectionLabel>
            <h2 style={h2}>Request states</h2>
            <p style={lead}>Model your UI state machine against these five phases. Each maps to a distinct user experience.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, marginBottom: 20 }}>
              {[
                { state: "idle",       Icon: Clock,        desc: "Awaiting file selection.", ui: "Show upload form."      },
                { state: "loading",    Icon: Activity,     desc: "Sending to Orbital.",      ui: "Brief spinner."         },
                { state: "processing", Icon: Cpu,          desc: "Awaiting webhook.",         ui: "Persistent indicator."  },
                { state: "succeeded",  Icon: CheckCircle,  desc: "Result received.",          ui: "Render extracted data." },
                { state: "failed",     Icon: XCircle,      desc: "Error in any phase.",       ui: "Show retry option."     },
              ].map(({ state, Icon, desc, ui }) => (
                <div key={state} style={{ padding: 14, borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, textAlign: "center" }}>
                  <Icon size={18} style={{ color: C.textMid, margin: "0 auto 7px" }} />
                  <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(203,213,225,.7)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px" }}>{state}</p>
                  <p style={{ fontSize: 11, color: C.textSoft, margin: "0 0 4px", lineHeight: 1.45 }}>{desc}</p>
                  <p style={{ fontSize: 10, color: C.textSoft, margin: 0, opacity: 0.65 }}>{ui}</p>
                </div>
              ))}
            </div>
            <CodeBlock lang="TypeScript" code={`type RequestStatus =
  | "idle"
  | "loading"
  | "processing"
  | "succeeded"
  | "failed";

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

          {/* ── ERRORS ── */}
          <section id="errors" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Reference</SectionLabel>
            <h2 style={h2}>Error reference</h2>

            <p style={{ fontSize: 12, fontWeight: 700, color: C.textSoft, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
              Phase 1 — synchronous (upload response)
            </p>
            {/* FIX 2: Grid columns — give code column a fixed narrow width, don't stretch it */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 1.6fr", padding: "8px 14px", background: "rgba(255,255,255,.03)", borderBottom: `1px solid ${C.borderSoft}` }}>
                {["Code", "Meaning", "Action"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.textSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {[
                { code: "401", meaning: "Unauthorized",         action: "Verify API key validity. Regenerate if compromised." },
                { code: "403", meaning: "Forbidden",            action: "Check the key has access to this endpoint." },
                { code: "404", meaning: "Not found",            action: "Confirm endpoint_id exists in your dashboard." },
                { code: "422", meaning: "Unprocessable entity", action: "Attach exactly one file as multipart/form-data." },
                { code: "500", meaning: "Server error",         action: "Retry after a delay. Log request_id if available." },
              ].map((row, i, arr) => (
                <div key={row.code} style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 1.6fr",
                  padding: "10px 14px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none",
                  background: i % 2 === 1 ? "rgba(255,255,255,.015)" : "transparent",
                  alignItems: "center",
                  gap: 12,
                }}>
                  {/* StatusPill is inline-flex fit-content — won't stretch */}
                  <div><StatusPill code={row.code} /></div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,.65)" }}>{row.meaning}</span>
                  <span style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.55 }}>{row.action}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 12, fontWeight: 700, color: C.textSoft, letterSpacing: "0.1em", textTransform: "uppercase", margin: "28px 0 8px" }}>
              Phase 2 — async (webhook)
            </p>
            {/* FIX 3: Detection column — inline-block fit-content code badge */}
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr", padding: "8px 14px", background: "rgba(255,255,255,.03)", borderBottom: `1px solid ${C.borderSoft}` }}>
                {["Scenario", "Detection", "Action"].map(h => (
                  <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.textSoft, letterSpacing: "0.1em", textTransform: "uppercase" }}>{h}</span>
                ))}
              </div>
              {[
                { scenario: "Processing failure", detect: 'payload.status === "failed"',  action: "Surface retry. Log error with request_id." },
                { scenario: "Webhook timeout",    detect: "No callback after N minutes",  action: "Use a cron job to mark stale requests as failed." },
                { scenario: "Webhook rejected",   detect: "Your server returned 4xx/5xx", action: "Ensure idempotency. Always return 200 OK." },
              ].map((row, i, arr) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr 1.4fr 1.4fr",
                  padding: "10px 14px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.borderSoft}` : "none",
                  background: i % 2 === 1 ? "rgba(255,255,255,.015)" : "transparent",
                  alignItems: "center",
                  gap: 12,
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(148,163,184,.65)" }}>{row.scenario}</span>
                  {/* FIX 3: inline-block + width:fit-content so it doesn't stretch across column */}
                  <code style={{
                    display: "inline-block",
                    width: "fit-content",
                    fontSize: 11,
                    color: "rgba(200,170,100,.8)",
                    background: "rgba(80,65,30,.15)",
                    padding: "2px 7px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    fontFamily: C.mono,
                  }}>{row.detect}</code>
                  <span style={{ fontSize: 12, color: C.textSoft, lineHeight: 1.55 }}>{row.action}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── SDK EXAMPLES ── */}
          <section id="sdks" style={{ scrollMarginTop: 32, marginBottom: 64 }}>
            <SectionLabel>Reference</SectionLabel>
            <h2 style={h2}>SDK examples</h2>
            <p style={lead}>Upload snippets for every major runtime. Each example handles the file upload, optional metadata, and error states.</p>
            <TabbedCode snippets={UPLOAD_SNIPPETS} order={UPLOAD_ORDER} />
          </section>

          {/* ── IMPLEMENTATIONS ── */}
          <section id="impls" style={{ scrollMarginTop: 32 }}>
            <SectionLabel>Reference</SectionLabel>
            <h2 style={h2}>Implementations</h2>
            <p style={lead}>Common integration patterns built on top of Orbital. Click any card to explore how to implement it.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
              {IMPLS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  style={{ padding: "16px 18px", borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.18s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfaceHov}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}
                >
                  <item.Icon size={16} style={{ color: C.textMid, marginBottom: 8 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(203,213,225,.8)", margin: "0 0 5px" }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: C.textSoft, margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
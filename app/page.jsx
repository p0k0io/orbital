"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Code2, Send, Webhook,
  FileText, Sparkles, Zap, Shield,
  HeartPulse, Briefcase, DollarSign,
  Rocket, BookOpen, ArrowRight, ChevronRight
} from "lucide-react";
import Link from "next/link";

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const ORBITS = [
  { r: 130, d: 18, dots: 2, size: 5 },
  { r: 195, d: 28, dots: 3, size: 4 },
  { r: 268, d: 40, dots: 3, size: 3.5 },
  { r: 350, d: 56, dots: 4, size: 3 },
];

const STEPS = [
  { icon: Code2,   n: "01", title: "Create an Endpoint",   desc: "Define your JSON schema once. Orbital adapts to any structure you need — no rigid templates, no lock-in." },
  { icon: Send,    n: "02", title: "Send Any File",         desc: "POST a PDF, image, spreadsheet or text file. No preprocessing required on your end." },
  { icon: Webhook, n: "03", title: "Receive via Webhook",   desc: "Structured JSON lands at your endpoint in real-time. No polling. No delays. Just data." },
];

const FEATURES = [
  { icon: FileText,  title: "Any File, Any Format",    desc: "PDFs, images, spreadsheets, scans, text — Orbital handles them all with multimodal AI." },
  { icon: Sparkles,  title: "Custom Schema Control",   desc: "You define the exact JSON structure. Orbital adapts intelligently, every time." },
  { icon: Zap,       title: "Instant Webhook Delivery",desc: "Processed JSON is pushed directly to your endpoint in real-time." },
  { icon: Shield,    title: "Enterprise-Grade Security",desc: "End-to-end encryption, SOC 2 compliant, zero data retention by default." },
];

const USE_CASES = [
  { icon: FileText,   title: "Legal Automation",     desc: "Extract key clauses and entities from contracts into structured JSON. Accelerate review and integrate with case management systems." },
  { icon: HeartPulse, title: "Medical Imaging",      desc: "Convert scans and X-rays to annotated JSON. Enable AI-driven diagnostics and seamless EHR integration." },
  { icon: Briefcase,  title: "HR Resume Parsing",    desc: "Transform CVs into standardized schemas. Speed up screening and enhance ATS compatibility." },
  { icon: DollarSign, title: "Invoice Extraction",   desc: "Pull structured data from invoices and receipts. Automate accounting and reduce processing time by 80%." },
];

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
    const stars = Array.from({ length: 150 }, () => ({
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
        const alpha = 0.15 + 0.55 * Math.abs(Math.sin(s.a));
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
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ─────────────────────────────────────────
   ORBIT SYSTEM
───────────────────────────────────────── */
function OrbitSystem() {
  return (
    <div className="mt-16 absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Pulsing core */}
      <motion.div
        className="absolute w-24 h-24 rounded-full z-10"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,.55) 0%, rgba(37,99,235,.18) 55%, transparent 72%)" }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[22%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(147,197,253,.95), rgba(96,165,250,.5))" }} />
      </motion.div>

      {ORBITS.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: o.r * 2, height: o.r * 2,
            border: "1px solid rgba(59,130,246,0.11)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: o.d, repeat: Infinity, ease: "linear" }}
        >
          {/* Conic sweep accent */}
          <div className="absolute inset-0 rounded-full" style={{
            background: "conic-gradient(from 0deg, rgba(59,130,246,.35) 0%, transparent 25%)",
            borderRadius: "50%",
          }} />
          {Array.from({ length: o.dots }).map((_, j) => {
            const angle = (360 / o.dots) * j;
            return (
              <span key={j}
                className="absolute rounded-full"
                style={{
                  width: o.size, height: o.size,
                  top: "50%", left: "50%",
                  marginTop: -o.size / 2, marginLeft: -o.size / 2,
                  background: "#60a5fa",
                  boxShadow: `0 0 ${o.size * 4}px #3b82f6, 0 0 ${o.size}px #1d4ed8`,
                  transform: `rotate(${angle}deg) translateX(${o.r}px) rotate(-${angle}deg)`,
                }}
              />
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function Label({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 mb-5 text-[10px] tracking-[0.22em] font-medium"
      style={{ color: "rgba(96,165,250,.75)" }}
    >
      <span className="w-5 h-px bg-blue-500/50" />
      {children}
      <span className="w-5 h-px bg-blue-500/50" />
    </motion.span>
  );
}

/* ─────────────────────────────────────────
   GRID NOISE TEXTURE (CSS-based)
───────────────────────────────────────── */
function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "linear-gradient(rgba(59,130,246,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.025) 1px, transparent 1px)",
      backgroundSize: "72px 72px",
    }} />
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function Home() {
  return (
    <div className="relative  text-white min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>

      {/* ══════════════════════════════
          HERO
      ══════════════════════════════ */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Starfield />
        <GridOverlay />

        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { w: 700, h: 450, top: -160, left: -160, color: "#172554", delay: "0s" },
            { w: 550, h: 380, top: "55%", right: -100, color: "#0c4a6e", delay: "-5s" },
            { w: 450, h: 320, bottom: -80, left: "35%", color: "#1e3a5f", delay: "-10s" },
          ].map((b, i) => (
            <div key={i}
              className="absolute rounded-full"
              style={{
                width: b.w, height: b.h,
                top: b.top, left: b.left, right: b.right, bottom: b.bottom,
                background: `radial-gradient(ellipse, ${b.color}, transparent 70%)`,
                filter: "blur(72px)", opacity: 0.75,
                animation: `auroraFloat 14s ease-in-out infinite`,
                animationDelay: b.delay,
              }}
            />
          ))}
        </div>

        {/* Scan line */}
        <div className="absolute left-0 right-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(59,130,246,.28), transparent)",
            animation: "scanLine 9s linear infinite",
          }}
        />

        <OrbitSystem />

        {/* Hero content */}
        <div className="mt-16 relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .9 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 mb-8 rounded-full"
            style={{
              border: "1px solid rgba(59,130,246,.3)",
              background: "rgba(59,130,246,.07)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"
              style={{ boxShadow: "0 0 8px #60a5fa" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(147,197,253,.9)", fontWeight: 500 }}>
              ORBITAL API — NOW IN BETA
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, delay: .12 }}
            className="font-black leading-[1.05] tracking-tight"
            style={{ fontSize: "clamp(48px, 8vw, 88px)", letterSpacing: "-0.03em" }}
          >
            Any File In.
            <br />
            <span style={{
              background: "linear-gradient(130deg, #93c5fd 0%, #3b82f6 45%, #6366f1 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Custom JSON Out.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, delay: .22 }}
            className="mt-6 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,.45)", fontWeight: 300 }}
          >
            Orbital transforms any file into structured JSON using your own schema — 
            lightning-fast, infinitely flexible, enterprise-ready.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .9, delay: .32 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Link href="/dashboard">
              <button className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 28px rgba(37,99,235,.55), inset 0 0 0 1px rgba(147,197,253,.18)",
                  fontSize: 15,
                }}>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Rocket className="w-4 h-4" />
                Get API Key — Free
              </button>
            </Link>
            <Link href="/dashboard/docs">
              <button className="flex items-center gap-2.5 px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(255,255,255,.12)",
                  background: "rgba(255,255,255,.04)",
                  backdropFilter: "blur(8px)",
                  color: "rgba(255,255,255,.65)",
                  fontSize: 15,
                }}>
                <BookOpen className="w-4 h-4" />
                View Docs
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: .5 }}
            className="mt-14 flex items-center justify-center gap-8 flex-wrap"
          >
            {[["99.9%", "Uptime SLA"], ["<200ms", "Avg. Latency"], ["40+", "File Formats"]].map(([val, lbl], i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && <div className="w-px h-6" style={{ background: "rgba(255,255,255,.08)" }} />}
                <div className="text-center">
                  <div className="font-bold text-white text-lg tracking-tight">{val}</div>
                  <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,.3)", marginTop: 2 }}>{lbl.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          HOW IT WORKS
      ══════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <GridOverlay />

        {/* Horizontal glow line */}
        <div className="absolute top-1/2 left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,.12), transparent)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Label>HOW IT WORKS</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.025em" }}
            >
              From File to JSON in Three Steps
            </motion.h2>
          </div>

          {/* Steps — connected by a line */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[52px] left-[16.5%] right-[16.5%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,.25) 20%, rgba(59,130,246,.25) 80%, transparent)" }} />

            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.14 }}
                  className="group relative rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(255,255,255,.07)",
                    background: "rgba(255,255,255,.025)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Step number bubble */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(37,99,235,.2)",
                        border: "1px solid rgba(59,130,246,.35)",
                      }}>
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="font-black text-4xl"
                      style={{ color: "rgba(59,130,246,.12)", letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
                      {s.n}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-3" style={{ letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,.45)", lineHeight: 1.7 }}>{s.desc}</p>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at 30% 30%, rgba(59,130,246,.06), transparent 60%)" }} />
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-14 flex justify-center"
          >
            <Link href="/dashboard">
              <button className="group flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  boxShadow: "0 4px 28px rgba(37,99,235,.45), inset 0 0 0 1px rgba(147,197,253,.18)",
                  fontSize: 15,
                }}>
                <span className="absolute inset-0 opacity-0" />
                Start Building Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          FEATURES
      ══════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Left glow */}
        <div className="absolute left-0 top-1/3 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(29,78,216,.1), transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Label>POWERFUL FEATURES</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.025em" }}
            >
              Built for Modern Workflows
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: .15 }}
              className="mt-5 max-w-xl mx-auto"
              style={{ fontSize: 17, color: "rgba(255,255,255,.4)", fontWeight: 300 }}
            >
              Orbital combines cutting-edge AI with a developer-first API.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative flex items-start gap-6 p-8 rounded-2xl transition-all duration-500 hover:-translate-y-1"
                  style={{
                    border: "1px solid rgba(255,255,255,.06)",
                    background: "rgba(255,255,255,.02)",
                  }}
                >
                  {/* Icon */}
                  <div className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, rgba(37,99,235,.25), rgba(29,78,216,.15))",
                      border: "1px solid rgba(59,130,246,.28)",
                    }}>
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-lg mb-2" style={{ letterSpacing: "-0.01em" }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,.42)", lineHeight: 1.7 }}>{f.desc}</p>
                  </div>

                  {/* Accent corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: "radial-gradient(circle, rgba(59,130,246,.15), transparent 70%)", transform: "translate(30%, -30%)" }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          MIDPAGE CTA BANNER
      ══════════════════════════════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(90deg, rgba(29,78,216,.08), rgba(37,99,235,.12), rgba(29,78,216,.08))" }} />
        <div className="absolute inset-0"
          style={{ border: "1px solid rgba(59,130,246,.1)", margin: "0 24px" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(96,165,250,.6)", fontWeight: 500 }}
            className="mb-6"
          >
            READY TO START?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-black tracking-tight mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-0.025em" }}
          >
            Turn Any File into JSON — Start Free
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: .1 }}
            className="mb-10"
            style={{ fontSize: 16, color: "rgba(255,255,255,.38)", fontWeight: 300 }}
          >
            No credit card required. 1,000 free requests per month. Cancel anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: .18 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/dashboard/apikey">
              <button className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb, #1d4ed8)",
                  boxShadow: "0 6px 36px rgba(37,99,235,.6), inset 0 0 0 1px rgba(147,197,253,.2)",
                  fontSize: 16,
                }}>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/12 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Rocket className="w-5 h-5" />
                Get Started Free
              </button>
            </Link>
            <Link href="/dashboard/docs">
              <button className="flex items-center gap-2.5 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(255,255,255,.15)",
                  background: "rgba(255,255,255,.05)",
                  color: "rgba(255,255,255,.6)",
                  fontSize: 16,
                }}>
                <BookOpen className="w-4 h-4" />
                Explore Docs
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════
          USE CASES
      ══════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Right glow */}
        <div className="absolute right-0 top-1/3 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(29,78,216,.09), transparent 70%)", filter: "blur(40px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <Label>REAL-WORLD APPLICATIONS</Label>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.025em" }}
            >
              Unlock New Possibilities
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: .12 }}
              className="mt-5 max-w-xl mx-auto"
              style={{ fontSize: 17, color: "rgba(255,255,255,.4)", fontWeight: 300 }}
            >
              See how Orbital transforms unstructured files into actionable data across industries.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {USE_CASES.map((u, i) => {
              const Icon = u.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 44 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="group relative flex flex-col p-7 rounded-2xl transition-all duration-500 hover:-translate-y-2 cursor-default"
                  style={{
                    border: "1px solid rgba(255,255,255,.07)",
                    background: "rgba(255,255,255,.025)",
                  }}
                >
                  {/* Icon with mini orbit */}
                  <div className="relative mb-7 inline-block">
                    <motion.div
                      className="absolute inset-[-14px] rounded-full"
                      style={{ border: "1px solid rgba(59,130,246,.14)" }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 22 + i * 4, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="absolute rounded-full bg-blue-400"
                        style={{ width: 5, height: 5, top: "50%", left: "50%", marginTop: -2.5, marginLeft: -2.5,
                          boxShadow: "0 0 10px #60a5fa", transform: "translateX(28px)" }} />
                    </motion.div>
                    <div className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(37,99,235,.2), rgba(29,78,216,.12))",
                        border: "1px solid rgba(59,130,246,.3)",
                      }}>
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>

                  <h3 className="font-bold text-white mb-3" style={{ fontSize: 16, letterSpacing: "-0.01em" }}>{u.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,.38)", lineHeight: 1.75 }}>{u.desc}</p>

                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "radial-gradient(circle at 20% 20%, rgba(59,130,246,.07), transparent 65%)" }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          FOOTER CTA
      ══════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <Starfield />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(29,78,216,.12) 0%, transparent 65%)",
              filter: "blur(20px)",
            }} />
        </div>

        {/* Partial orbit rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[180, 260, 350].map((r, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{ width: r * 2, height: r * 2, border: "1px solid rgba(59,130,246,0.06)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30 + i * 12, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <Label>GET STARTED TODAY</Label>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-black tracking-tight mb-6"
            style={{ fontSize: "clamp(36px, 5.5vw, 64px)", letterSpacing: "-0.03em" }}
          >
            Ready to Orbit?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: .1 }}
            className="mb-12"
            style={{ fontSize: 18, color: "rgba(255,255,255,.38)", fontWeight: 300 }}
          >
            Join hundreds of teams already transforming their document workflows with Orbital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: .18 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/dashboard/apikey">
              <button className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  boxShadow: "0 8px 40px rgba(37,99,235,.65), inset 0 0 0 1px rgba(147,197,253,.22)",
                  fontSize: 16,
                }}>
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <Rocket className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-[-2px]" />
                Start for Free
              </button>
            </Link>
            <Link href="/dashboard/docs">
              <button className="flex items-center gap-2.5 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid rgba(255,255,255,.13)",
                  background: "rgba(255,255,255,.04)",
                  color: "rgba(255,255,255,.55)",
                  fontSize: 16,
                }}>
                <BookOpen className="w-4 h-4" />
                Read the Docs
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Global keyframes */}
      <style>{`
        @keyframes auroraFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(24px,-18px) scale(1.04); }
          66% { transform: translate(-18px,22px) scale(0.96); }
        }
        @keyframes scanLine {
          0%   { top: -1px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

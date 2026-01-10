"use client";

import { motion } from "framer-motion";
import { div } from "framer-motion/client";
import { Code2, Send, Webhook } from "lucide-react";
import { 
  FileText, 
  Sparkles, 
  Zap, 
  Shield, 
  Globe, 
  Boxes 
} from "lucide-react";
import { Rocket, BookOpen } from "lucide-react";

import { 

  HeartPulse, 
  Briefcase, 
  DollarSign 
} from "lucide-react";

export default function Home() {
  const orbits = [
    { r: 210, d: 28 },
    { r: 260, d: 36 },
    { r: 320, d: 48 },
    { r: 380, d: 62 },
  ];

  const useCases = [
    {
      icon: FileText,
      title: "Legal Document Automation",
      desc: "In legal firms, extract key clauses and entities from contracts and filings into custom JSON. Accelerates review processes, minimizes manual errors, and integrates seamlessly with case management systems.",
    },
    {
      icon: HeartPulse,
      title: "Medical Image Processing",
      desc: "For healthcare providers, convert scans and X-rays to structured JSON with annotations. Enables quick AI-driven diagnostics, improves patient data integration, and supports telemedicine workflows.",
    },
    {
      icon: Briefcase,
      title: "HR Resume Parsing",
      desc: "In recruitment, transform CVs and resumes from PDFs or images into standardized JSON schemas. Speeds up candidate screening, automates data entry, and enhances ATS compatibility.",
    },
    {
      icon: DollarSign,
      title: "Invoice & Delivery Note Extraction",
      desc: "For finance and e-commerce, pull details from invoices, albaranes, and receipts into JSON. Streamlines accounting, automates inventory updates, and reduces processing time by 80%.",
    },
  ];

  const features = [
    {
      icon: FileText,
      title: "Any File, Any Format",
      desc: "PDFs, images, spreadsheets, scans, audio — Orbital understands them all with state-of-the-art multimodal AI.",
    },
    {
      icon: Sparkles,
      title: "Custom Schema Control",
      desc: "You define the exact JSON structure. Orbital adapts intelligently to your needs, no rigid templates.",
    },
    {
      icon: Zap,
      title: "Instant Webhook Delivery",
      desc: "Processed JSON is pushed directly to your endpoint in real-time. No polling, no delays.",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      desc: "End-to-end encryption, SOC 2 compliant, zero data retention. Your files and schemas stay private.",
    },
  ];

      const steps = [
    {
      title: "Create a Custom Endpoint",
      desc: "Define your endpoint with the JSON structure you need. Orbital adapts to your schema.",
      icon: Code2,
    },
    {
      title: "Send Requests",
      desc: "Send any type of file to your endpoint. No preprocessing required.",
      icon: Send,
    },
    {
      title: "Receive via Webhook",
      desc: "Orbital processes the file and sends structured JSON directly to your webhook.",
      icon: Webhook,
    },
  ];

  return (
    <div>
    <section className="relative h-[85vh] overflow-hidden flex items-center justify-center">
      {/* ORBIT SYSTEM */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {orbits.map((orbit, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{
              duration: orbit.d,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: orbit.r * 2,
              height: orbit.r * 2,
            }}
          >
            {/* ORBIT RING */}
            <div className="absolute inset-0 rounded-full border border-white/15" />

            {/* ORBITING BALLS */}
            {[...Array(3)].map((_, j) => {
              const offset = (360 / 3) * j;
              return (
                <motion.span
                  key={j}
                  className="absolute w-2 h-2 rounded-full
                             bg-blue-500 shadow-[0_0_18px_#3b82f6]"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `rotate(${offset}deg) translateX(${orbit.r}px)`,
                  }}
                />
              );
            })}
          </motion.div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5
                        rounded-full border border-blue-500/40
                        bg-blue-500/10 backdrop-blur">
          <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xs tracking-widest text-blue-400">
            ORBITAL AI API
          </span>
        </div>

        <h1 className="text-white font-extrabold tracking-tight
                       text-4xl md:text-6xl leading-tight">
          Any File In.
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-blue-600
                           bg-clip-text text-transparent">
            Custom JSON Out.
          </span>
        </h1>

        <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl mx-auto">
          Orbital transforms any file into structured JSON using your own schema.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <button className="px-7 py-3 rounded-full bg-blue-600 text-white
                             hover:bg-blue-500 transition shadow-lg
                             shadow-blue-600/30">
            Get API Key
          </button>
          <button className="px-7 py-3 rounded-full border border-white/20
                             text-white/80 hover:bg-white/5 transition">
            Docs
          </button>
        </div>
      </div>
    </section>

<section className="relative py-24 overflow-hidden">
      {/* FLOW BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[70%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-blue-500
                       shadow-[0_0_16px_#3b82f6]"
            style={{
              left: `${20 + i * 8}%`,
              top: `${45 + (i % 3) * 5}%`,
            }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 text-xs tracking-widest text-blue-400"
          >
            HOW IT WORKS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-white font-extrabold tracking-tight
                       text-3xl md:text-5xl"
          >
            From File to JSON in Three Steps
          </motion.h2>
        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="relative rounded-2xl border border-white/15
                           bg-white/5 backdrop-blur px-8 py-10"
              >
                {/* STEP INDEX */}
                <div className="absolute -top-4 left-6 px-3 py-1 rounded-full
                                bg-blue-500/20 border border-blue-500/40
                                text-xs text-blue-400">
                  STEP {i + 1}
                </div>

                {/* ICON */}
                <div className="mb-6 inline-flex items-center justify-center
                                w-12 h-12 rounded-xl
                                bg-blue-500/15 border border-blue-500/30">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>

                {/* MINI ORBIT */}
                <motion.div
                  className="absolute -right-6 -top-6 w-20 h-20 rounded-full
                             border border-white/10"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 18 + i * 6,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full bg-blue-500
                               shadow-[0_0_12px_#3b82f6]"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: "translateX(38px)",
                    }}
                  />
                </motion.div>

                <h3 className="text-white text-xl font-semibold mb-3">
                  {step.title}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 flex justify-center"
        >
          <button
            className="px-10 py-4 rounded-full bg-blue-600 text-white
                       font-medium hover:bg-blue-500 transition
                       shadow-lg shadow-blue-600/30"
          >
            Comienza Ahora
          </button>
        </motion.div>
      </div>
    </section>
    <section className="relative py-28 overflow-hidden">
      {/* FUTURISTIC BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* SUBTLE GRID */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        
        {/* FLOATING ORBS */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-blue-400/40 blur-md"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${30 + (i % 4) * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 text-xs tracking-widest text-blue-300"
          >
            POWERFUL FEATURES
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white font-extrabold tracking-tight text-3xl md:text-5xl"
          >
            Built for Modern Workflows
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg text-white/60 max-w-2xl mx-auto"
          >
            Orbital combines cutting-edge AI with developer-first design.
          </motion.p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl border border-white/10
                           bg-white/5 backdrop-blur-sm p-8
                           hover:border-blue-500/40 hover:bg-white/8
                           transition-all duration-500"
              >
                {/* ORBITING ICON CONTAINER */}
                <div className="relative mb-8 inline-block">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/15"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="absolute w-2 h-2 rounded-full bg-blue-400
                                 shadow-[0_0_14px_#60a5fa]"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translateX(36px)",
                      }}
                    />
                  </motion.div>

                  {/* MAIN ICON */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl
                                  bg-gradient-to-br from-blue-500/20 to-blue-600/30
                                  border border-blue-500/30">
                    <Icon className="w-8 h-8 text-blue-300 group-hover:text-blue-200 transition-colors" />
                  </div>
                </div>

                <h3 className="text-white text-xl font-semibold mb-3">
                  {feature.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
      {/* BOTÓN PRINCIPAL - GRANDE Y POTENTE */}
      <motion.a
        href="#get-api-key" // cambia por tu link real
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="group relative inline-flex items-center gap-4 px-10 py-5 
                   rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600
                   text-white font-bold text-xl shadow-2xl
                   shadow-blue-600/50 overflow-hidden
                   transition-all duration-300"
      >
        {/* EFECTO ORBITAL BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
                        translate-x-[-100%] group-hover:translate-x-[100%]
                        transition-transform duration-1000" />

        <Rocket className="w-8 h-8 group-hover:rotate-12 transition-transform duration-300" />
        
        <span className="relative z-10">
          Turn Any File into JSON – Start Free
        </span>

        {/* MINI ORBITA ANIMADA */}
        <motion.div
          className="absolute -right-4 -top-4 w-20 h-20 rounded-full border border-white/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute w-2 h-2 rounded-full bg-white/60 shadow-[0_0_12px_#fff]
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          translate-x-9" />
        </motion.div>
      </motion.a>

      {/* BOTÓN SECUNDARIO - DOCS */}
      <motion.a
        href="#docs" // cambia por tu link real
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl
                   border border-white/30 bg-white/5 backdrop-blur-sm
                   text-white/90 font-medium text-lg
                   hover:border-blue-400/60 hover:bg-white/10
                   transition-all duration-300"
      >
        <BookOpen className="w-6 h-6" />
        Explore Documentation
      </motion.a>
    </div>

    <section className="relative py-28 overflow-hidden">
      {/* FUTURISTIC BACKGROUND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* SUBTLE GRID */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent" />
        
        {/* FLOATING ORBS */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full bg-blue-400/40 blur-md"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${30 + (i % 4) * 15}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 8 + i * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block mb-4 text-xs tracking-widest text-blue-300"
          >
            REAL-WORLD APPLICATIONS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white font-extrabold tracking-tight text-3xl md:text-5xl"
          >
            Unlock New Possibilities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-lg text-white/60 max-w-2xl mx-auto"
          >
            See how Orbital transforms unstructured files into actionable data across industries.
          </motion.p>
        </div>

        {/* USE CASES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, i) => {
            const Icon = useCase.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl border border-white/10
                           bg-white/5 backdrop-blur-sm p-8
                           hover:border-blue-500/40 hover:bg-white/8
                           transition-all duration-500"
              >
                {/* ORBITING ICON CONTAINER */}
                <div className="relative mb-8 inline-block">
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/15"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div
                      className="absolute w-2 h-2 rounded-full bg-blue-400
                                 shadow-[0_0_14px_#60a5fa]"
                      style={{
                        left: "50%",
                        top: "50%",
                        transform: "translateX(36px)",
                      }}
                    />
                  </motion.div>

                  {/* MAIN ICON */}
                  <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl
                                  bg-gradient-to-br from-blue-500/20 to-blue-600/30
                                  border border-blue-500/30">
                    <Icon className="w-8 h-8 text-blue-300 group-hover:text-blue-200 transition-colors" />
                  </div>
                </div>

                <h3 className="text-white text-xl font-semibold mb-3">
                  {useCase.title}
                </h3>

                <p className="text-white/60 text-sm leading-relaxed">
                  {useCase.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
    
    </div>

    
    
  );
}

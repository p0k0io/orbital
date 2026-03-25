"use client";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";

// ─── Nav links ───────────────────────────────────────────────────────────────
const PUBLIC_NAV = [
  { href: "/#features", label: "Features" },
  { href: "/pricing",   label: "Pricing"  },
  { href: "/docs",      label: "Docs"     },
];

const DASHBOARD_NAV = [
  { href: "/dashboard",            label: "Overview"   },
  { href: "/dashboard/playground", label: "Playground" },
  { href: "/dashboard/usage",      label: "Usage"      },
  { href: "/dashboard/docs",       label: "Docs"       },
  { href: "/dashboard/apikey",     label: "API Key"    },
  { href: "/dashboard/budget",     label: "Budget"     },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <>
      {/* ── Desktop / main bar ────────────────────────────────────────────── */}
      <header
        className={`
          w-[calc(100%-64px)] max-w-3xl mx-auto mt-8
          fixed top-0 left-1/2 -translate-x-1/2 z-50
          flex items-center justify-between
          px-6 py-2.5 rounded-full
          bg-white/10 backdrop-blur-md border border-white/20
          shadow-lg transition-all duration-300
          ${scrolled ? "bg-white/15 shadow-black/40" : ""}
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* ── Signed-out nav (public) */}
        <SignedOut>
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-white/70 text-sm font-medium rounded-full
                           hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>
        </SignedOut>

        {/* ── Signed-in nav (dashboard) */}
        <SignedIn>
          <nav className="hidden md:flex items-center gap-0.5">
            {DASHBOARD_NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 text-white/70 text-sm font-medium rounded-full
                           hover:text-white hover:bg-white/10 transition-all duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>
        </SignedIn>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <SignedOut>
            {/* Mobile: hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {open ? <XIcon /> : <MenuIcon />}
            </button>

            <SignInButton>
              <button className="hidden md:inline-flex px-4 py-1.5 bg-white/20 border border-white/30
                                 rounded-full text-white text-sm font-medium
                                 hover:bg-white/30 transition-all duration-150">
                Iniciar sesión
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {/* Mobile: hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Toggle menu"
            >
              {open ? <XIcon /> : <MenuIcon />}
            </button>

            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </SignedIn>
        </div>
      </header>

      {/* ── Mobile dropdown ──────────────────────────────────────────────── */}
      <div
        className={`
          fixed top-[72px] left-1/2 -translate-x-1/2 z-40
          w-[calc(100%-48px)] max-w-sm
          rounded-2xl bg-slate-900/90 backdrop-blur-xl
          border border-white/15 shadow-xl
          overflow-hidden transition-all duration-300 ease-out
          ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
      >
        <SignedOut>
          <MobileLinks links={PUBLIC_NAV} onClose={() => setOpen(false)} />
          <div className="px-4 pb-4 pt-2 border-t border-white/10">
            <SignInButton>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2.5 rounded-xl bg-white/20 border border-white/25
                           text-white text-sm font-medium hover:bg-white/30 transition"
              >
                Iniciar sesión
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <MobileLinks links={DASHBOARD_NAV} onClose={() => setOpen(false)} />
        </SignedIn>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}

function MobileLinks({
  links,
  onClose,
}: {
  links: { href: string; label: string }[];
  onClose: () => void;
}) {
  return (
    <nav className="flex flex-col p-3 gap-0.5">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-white/75 text-sm font-medium
                     hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6"  x2="6"  y2="18" />
    <line x1="6"  y1="6"  x2="18" y2="18" />
  </svg>
);

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gradient-radial from-black to-slate-800 min-h-screen flex flex-col">
          <Navbar />
          <main className="w-full flex-1">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

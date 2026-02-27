"use client";

import { useState, useEffect } from "react";
import KoreLogo from "@/components/KoreLogo";
import SocialProof from "@/components/SocialProof";

interface HeroSectionProps {
  email: string;
  name: string;
  status: "idle" | "loading" | "success" | "error";
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function HeroSection({ email, name, status, setEmail, setName, onSubmit }: HeroSectionProps) {
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setNavVisible(window.scrollY > 500);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ===== STICKY NAV ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 py-3 transition-all duration-300 ${
          navVisible
            ? "translate-y-0 bg-[var(--bg)] shadow-[0_2px_20px_rgba(0,0,0,0.08)]"
            : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 no-underline">
            <KoreLogo size={30} gradientId="navGrad" />
            <span className="gradient-text font-black text-base tracking-widest">KORE</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#features" className="hidden sm:inline text-[var(--text-muted)] text-sm font-medium no-underline hover:text-[var(--text-main)] transition-colors">
              Fonctionnalites
            </a>
            <a href="#pricing" className="hidden sm:inline text-[var(--text-muted)] text-sm font-medium no-underline hover:text-[var(--text-main)] transition-colors">
              Tarifs
            </a>
            <a
              href="#download"
              className="px-5 py-2 rounded-full bg-[var(--accent)] text-white text-sm font-bold no-underline
                hover:-translate-y-0.5 hover:shadow-[0_4px_15px_var(--accent-glow)] transition-all duration-200"
            >
              S&apos;inscrire
            </a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header id="main-content" className="relative z-[2] min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
        {/* Logo pill */}
        <div className="hero-fade inline-flex items-center gap-4 mb-8 px-6 py-2.5 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-[10px] shadow-neu-out hover:scale-105 hover:shadow-neu-in transition-all duration-300 cursor-default">
          <KoreLogo size={50} gradientId="heroGrad" />
          <span className="gradient-text font-black text-2xl tracking-widest">KORE</span>
        </div>

        {/* Title */}
        <h1 className="hero-fade text-[clamp(2.5rem,8vw,5rem)] font-black leading-[1.1] tracking-tight mb-5">
          <span className="shimmer-text">SCULPT YOUR BODY.</span>
          <span className="text-[var(--accent)] animate-[blink_0.7s_step-end_infinite]">|</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-fade text-lg sm:text-xl text-[var(--text-muted)] max-w-[600px] mb-8 font-light">
          Suis tes programmes, enregistre tes performances et progresse
          seance apres seance. Simple, rapide, offline.
        </p>

        {/* Stats row */}
        <div className="hero-fade grid grid-cols-3 gap-6 sm:gap-10 mb-10 max-w-lg mx-auto w-full">
          {[
            { value: "100%", label: "Offline" },
            { value: "0\u20AC", label: "Pour commencer" },
            { value: "<1s", label: "Chargement" },
          ].map((stat) => (
            <div key={stat.label} className="bg-[var(--bg)] rounded-[20px] shadow-neu-out py-5 px-3 text-center">
              <div className="text-2xl sm:text-3xl font-black text-[var(--accent)]" style={{ textShadow: "0 0 20px var(--accent-glow)" }}>
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA button */}
        <a
          href="#download"
          className="hero-fade btn-liquid text-white px-10 py-4 rounded-full font-extrabold text-lg uppercase tracking-widest no-underline"
        >
          Rejoindre la beta
        </a>

        <SocialProof />

        {/* Hero inline form */}
        <form
          onSubmit={onSubmit}
          className="hero-fade mt-8 space-y-3 w-full max-w-sm mx-auto"
          aria-label="Formulaire d'inscription rapide"
        >
          <div className="bg-[var(--bg)] rounded-full shadow-neu-out p-2.5">
            <label htmlFor="hero-name" className="sr-only">Prénom (optionnel)</label>
            <input
              id="hero-name"
              type="text"
              placeholder="Ton prénom (optionnel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-none py-2.5 px-5 rounded-full shadow-neu-in
                text-[var(--text-main)] font-inherit text-sm outline-none
                placeholder:text-[var(--text-muted)] placeholder:opacity-60"
            />
          </div>

          <div className="bg-[var(--bg)] rounded-full shadow-neu-out p-2.5">
            <label htmlFor="hero-email" className="sr-only">Adresse email</label>
            <input
              id="hero-email"
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-transparent border-none py-2.5 px-5 rounded-full shadow-neu-in
                text-[var(--text-main)] font-inherit text-sm outline-none
                placeholder:text-[var(--text-muted)] placeholder:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full btn-liquid text-white py-3.5 rounded-full font-extrabold text-sm
              uppercase tracking-widest border-none cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Inscription..." : "S\u2019inscrire \u00E0 la beta"}
          </button>

          {status === "success" && (
            <p role="alert" className="text-[var(--success)] text-xs font-semibold text-center">
              Inscription r\u00E9ussie ! V\u00E9rifie ta boite mail.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-[var(--danger)] text-xs font-semibold text-center">
              Une erreur est survenue. R\u00E9essaie.
            </p>
          )}
        </form>
      </header>
    </>
  );
}

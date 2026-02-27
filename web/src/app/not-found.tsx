import Link from "next/link";
import KoreLogo from "@/components/KoreLogo";

export default function NotFound() {
  return (
    <>
      {/* Skip link — navigation clavier */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:bg-[var(--accent)] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Aller au contenu principal
      </a>
      <main id="main-content" className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="inline-flex items-center gap-3 mb-8 px-6 py-2.5 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur-[10px] shadow-neu-out">
        <KoreLogo size={36} gradientId="notFoundGrad" />
        <span className="gradient-text font-black text-lg tracking-widest">KORE</span>
      </div>

      <div className="bg-[var(--bg)] rounded-[30px] shadow-neu-out p-10 sm:p-14 max-w-md w-full">
        <p className="text-8xl font-black gradient-text mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
          Page introuvable
        </h1>
        <p className="text-[var(--text-muted)] text-base font-light mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>

        <Link
          href="/"
          className="inline-block btn-liquid text-white px-8 py-3.5 rounded-full
            font-extrabold text-sm uppercase tracking-widest no-underline"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
      </main>
    </>
  );
}

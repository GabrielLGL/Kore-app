"use client";

interface SubscribeSectionProps {
  email: string;
  name: string;
  status: "idle" | "loading" | "success" | "error";
  setEmail: (value: string) => void;
  setName: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubscribeSection({ email, name, status, setEmail, setName, onSubmit }: SubscribeSectionProps) {
  return (
    <section id="download" className="relative z-[2] py-20 sm:py-28 px-6">
      <div className="max-w-[600px] mx-auto text-center">
        <h2 className="reveal text-3xl sm:text-4xl font-black tracking-tight mb-4">
          Pret a progresser ?
        </h2>
        <p className="reveal text-[var(--text-muted)] text-lg mb-10 font-light">
          Inscris-toi pour etre informe du lancement et recevoir un acces anticipe.
        </p>

        <form onSubmit={onSubmit} className="reveal space-y-4 max-w-md mx-auto" aria-label="Formulaire d'inscription">
          {/* Name input */}
          <div className="bg-[var(--bg)] rounded-full shadow-neu-out p-2.5">
            <label htmlFor="subscribe-name" className="sr-only">Prenom (optionnel)</label>
            <input
              id="subscribe-name"
              type="text"
              placeholder="Ton prenom (optionnel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-none py-3 px-6 rounded-full shadow-neu-in
                text-[var(--text-main)] font-inherit text-base outline-none
                placeholder:text-[var(--text-muted)] placeholder:opacity-60"
            />
          </div>

          {/* Email input */}
          <div className="bg-[var(--bg)] rounded-full shadow-neu-out p-2.5">
            <label htmlFor="subscribe-email" className="sr-only">Adresse email</label>
            <input
              id="subscribe-email"
              type="email"
              placeholder="Ton email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
              className="w-full bg-transparent border-none py-3 px-6 rounded-full shadow-neu-in
                text-[var(--text-main)] font-inherit text-base outline-none
                placeholder:text-[var(--text-muted)] placeholder:opacity-60"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            aria-busy={status === "loading"}
            aria-disabled={status === "loading"}
            tabIndex={status === "loading" ? -1 : 0}
            className="w-full btn-liquid text-white py-4 rounded-full font-extrabold text-base
              uppercase tracking-widest border-none cursor-pointer
              aria-disabled:opacity-50 aria-disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Inscription..." : "S\u2019inscrire"}
          </button>

          {status === "success" && (
            <p role="alert" className="text-[var(--success)] text-sm font-semibold">
              Inscription reussie ! Verifie ta boite mail.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="text-[var(--danger)] text-sm font-semibold">
              Une erreur est survenue. Reessaie.
            </p>
          )}
        </form>

        <p className="reveal text-[var(--text-muted)] text-xs mt-8 opacity-80">
          Pas de spam. Desabonnement en un clic.{" "}
          <a href="/privacy" className="underline hover:text-[var(--accent)] transition-colors">
            Politique de confidentialite
          </a>
        </p>
      </div>
    </section>
  );
}

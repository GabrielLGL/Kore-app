import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Kore — Ton coach muscu dans ta poche",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='5 5 90 90'><defs><linearGradient id='g' x1='0' y1='100%25' x2='100%25' y2='0'><stop offset='0%25' stop-color='%236c5ce7'/><stop offset='100%25' stop-color='%2300cec9'/></linearGradient></defs><g stroke='url(%23g)' stroke-width='14' stroke-linecap='round' fill='none'><line x1='30' y1='15' x2='30' y2='85'/><line x1='30' y1='50' x2='75' y2='15'/><line x1='30' y1='50' x2='75' y2='85'/></g><g fill='%231a1a2e' stroke='url(%23g)' stroke-width='5'><circle cx='30' cy='15' r='10'/><circle cx='30' cy='85' r='10'/><circle cx='30' cy='50' r='13'/><circle cx='75' cy='15' r='11'/><circle cx='75' cy='85' r='11'/></g></svg>",
  },
  description:
    "Suis tes programmes, enregistre tes performances et progresse seance apres seance. Application de musculation 100% offline, rapide et intuitive.",
  keywords: [
    "musculation",
    "fitness",
    "programme musculation",
    "suivi entrainement",
    "gym tracker",
    "Kore",
  ],
  openGraph: {
    title: "Kore — Ton coach muscu dans ta poche",
    description:
      "Suis tes programmes, enregistre tes performances et progresse seance apres seance.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className={outfit.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('kore-theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.className} antialiased`}>{children}</body>
    </html>
  );
}

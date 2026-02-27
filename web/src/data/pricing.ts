export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export const PRICING: PricingPlan[] = [
  {
    name: "Gratuit",
    price: "0\u20AC",
    period: "",
    features: [
      "3 programmes",
      "Suivi des performances",
      "Historique 30 jours",
      "Mode offline",
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "2,50\u20AC",
    period: "/mois",
    features: [
      "Programmes illimites",
      "Suivi des performances",
      "Historique illimite",
      "Mode offline",
      "Statistiques avancees",
      "Export de donnees",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 7 jours",
    highlighted: true,
  },
  {
    name: "Pro Annuel",
    price: "19.99\u20AC",
    period: "/an",
    features: [
      "Tout le plan Pro",
      "2 mois offerts",
      "Acces aux nouveautes en avant-premiere",
    ],
    cta: "Economiser 33%",
    highlighted: false,
  },
];

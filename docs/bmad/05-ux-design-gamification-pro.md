# UX Design — Gamification Pro (Badges) — 2026-02-26

## Écran BadgesScreen

### Layout
- Header natif : "Mes Badges" + compteur "12/50 🏅" (colors.primary)
- ScrollView vertical
- Sections par catégorie : label uppercase colors.textSecondary + séparateur
- Grille 3 colonnes avec BadgeCard

### BadgeCard
- Taille : ~100px × 90px, borderRadius.md
- Débloqué : fond colors.card, emoji couleur, titre colors.text
- Verrouillé : fond colors.card, opacity 0.35, titre colors.textSecondary
- Emoji 32px centré, titre en dessous fontSize.xs

## BottomSheet Célébration badge
- Emoji 48px centré
- Titre : "Nouveau badge !"
- Sous-titre : nom du badge (bold)
- Description : message motivant
- Bouton "Super !" (Button primary)
- Haptic onSuccess à l'ouverture
- Si plusieurs badges : afficher le plus rare (index le plus élevé)
- S'ouvre après le BottomSheet milestones (S09)

## Entrée HomeScreen
- Ligne touchable dans la card gamification existante
- Texte "🏅 Mes Badges" + compteur "12/50 →"
- Button variant ghost ou TouchableOpacity avec colors.textSecondary

## Navigation
- HomeScreen → BadgesScreen (Native Stack push)
- Header avec ← retour natif
- Pas de tab bar

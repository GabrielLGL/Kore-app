<!-- v1.0 — 2026-03-06 -->
# Rapport — Deep Testing Android — Groupe A — 20260306-0100

## Objectif
Plan de test manuel exhaustif pour l'app Kore sur 5+ appareils Android. Ce document est un **guide de test**, pas du code à écrire. Il décrit chaque scénario à tester manuellement sur chaque appareil.

## Matrice d'appareils cibles

| # | Appareil type | Écran | Android | RAM | Priorité |
|---|---------------|-------|---------|-----|----------|
| 1 | Petit budget | 5.0-5.5" HD | Android 10-11 | 2-3 GB | Haute |
| 2 | Milieu de gamme | 6.1-6.4" FHD+ | Android 12-13 | 4-6 GB | Haute |
| 3 | Flagship récent | 6.5-6.8" QHD+ | Android 14-15 | 8-12 GB | Haute |
| 4 | Tablette | 10-11" | Android 13+ | 4-8 GB | Moyenne |
| 5 | Ancien appareil | 5.5" HD | Android 9 (min SDK) | 2 GB | Moyenne |
| 6 | Pliable (bonus) | Variable | Android 14+ | 8+ GB | Basse |

### Émulateurs recommandés (Android Studio)
```
Pixel 4a       — API 30 (Android 11) — 5.81" — 6 GB RAM
Pixel 6        — API 33 (Android 13) — 6.4"  — 8 GB RAM
Pixel 8 Pro    — API 34 (Android 14) — 6.7"  — 12 GB RAM
Galaxy Tab S8  — API 33 (Android 13) — 11.0" — tablette
Pixel 3a       — API 28 (Android 9)  — 5.6"  — 4 GB RAM (ancien)
Pixel Fold     — API 34 (Android 14) — pliable (bonus)
```

---

## Plan de test par fonctionnalité

### T1 — Onboarding
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T1.1 | Premier lancement | Installer et ouvrir l'app | OnboardingScreen s'affiche |
| T1.2 | Saisie nom | Entrer un nom + valider | Passe à l'écran suivant |
| T1.3 | Sélection niveau | Choisir Débutant/Intermédiaire/Avancé | Enregistré en DB |
| T1.4 | Sélection objectif | Choisir objectif | Enregistré en DB |
| T1.5 | Fin onboarding | Terminer le flux | Navigation vers HomeScreen |
| T1.6 | Re-lancement | Fermer + rouvrir l'app | HomeScreen directement (pas onboarding) |

### T2 — HomeScreen (Dashboard)
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T2.1 | Affichage XP/niveau | Observer la barre XP | Niveau + barre de progression visibles |
| T2.2 | Streak | Vérifier l'indicateur streak | Nombre de jours correct |
| T2.3 | KPIs | Vérifier les statistiques globales | Séances, tonnage, PRs affichés |
| T2.4 | Navigation cards | Taper chaque card de navigation | Navigation vers le bon écran |
| T2.5 | Phrase motivationnelle | Observer le texte | Phrase cohérente affichée |
| T2.6 | Activité hebdo | Vérifier le graphique semaine | Points d'activité visibles |
| T2.7 | Coach Marks | Premier lancement après onboarding | Tutorial overlay s'affiche |
| T2.8 | Haptics | Taper une card | Retour haptique ressenti |

### T3 — Programmes
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T3.1 | Liste vide | Aucun programme créé | Message "aucun programme" |
| T3.2 | Créer programme | Bouton + → saisir nom | Programme créé, visible dans la liste |
| T3.3 | Détail programme | Taper un programme | ProgramDetailScreen avec sessions |
| T3.4 | Ajouter session | Dans détail → ajouter session | Session ajoutée à la liste |
| T3.5 | Dupliquer programme | Action dupliquer | Copie complète (sessions + exercices + supersets) |
| T3.6 | Supprimer programme | Action supprimer → AlertDialog | Confirmation → suppression |
| T3.7 | Renommer | Modifier le nom | Nom mis à jour |

### T4 — Sessions & Exercices
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T4.1 | Détail session | Ouvrir une session | Liste d'exercices |
| T4.2 | Ajouter exercice | Bouton + → catalogue | Exercice ajouté |
| T4.3 | Réordonner | Drag & drop exercices | Ordre mis à jour |
| T4.4 | Superset/Circuit | Long-press → sélection → lier | Groupement visuel |
| T4.5 | Supprimer exercice | Swipe ou menu → supprimer | Confirmation → suppression |
| T4.6 | Catalogue exercices | ExerciseCatalogScreen | Liste complète, filtres muscle/équipement |
| T4.7 | Créer exercice custom | CreateExerciseScreen | Exercice créé avec nom/muscles/équipement |
| T4.8 | Recherche exercice | Barre de recherche | Résultats filtrés |
| T4.9 | Filtres ChipSelector | Sélectionner muscle/équipement | Liste filtrée |

### T5 — Workout (Séance en cours)
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T5.1 | Lancer workout | Depuis session → bouton démarrer | WorkoutScreen, timer démarre |
| T5.2 | Saisie série | Entrer reps + poids → valider | Série enregistrée, ligne ajoutée |
| T5.3 | Clavier numérique | Taper dans champ poids/reps | `keyboardType="numeric"` respecté |
| T5.4 | Rest Timer | Valider une série | Timer de repos se lance |
| T5.5 | Navigation exercices | Scroller entre exercices | FlatList fluide |
| T5.6 | Supersets | Exercices groupés | Header "Superset (N)", timer entre rounds |
| T5.7 | Abandonner workout | Bouton retour → confirmation | AlertDialog, abandon possible |
| T5.8 | Terminer workout | Bouton terminer | WorkoutSummarySheet s'affiche |
| T5.9 | Summary | Vérifier le récap | Tonnage, XP gagnés, PRs, durée |
| T5.10 | Célébrations | Après summary → milestones/badges | Animations de célébration |
| T5.11 | Keyboard handling | Clavier ouvert + scroll | Pas de chevauchement (softwareKeyboardLayoutMode: pan) |
| T5.12 | Bouton retour Android | Appuyer retour hardware pendant workout | Confirmation d'abandon |

### T6 — Statistiques
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T6.1 | Stats hub | Ouvrir Stats | Cards vers sous-écrans |
| T6.2 | Durée | StatsDurationScreen | Graphiques de durée |
| T6.3 | Volume | StatsVolumeScreen | Tonnage par période |
| T6.4 | Calendrier | StatsCalendarScreen | Vue calendrier avec jours d'entraînement |
| T6.5 | Par exercice | StatsExercisesScreen | Progression par exercice |
| T6.6 | Mensurations | StatsMeasurementsScreen | Historique poids/tour de taille/etc |
| T6.7 | Historique séance | HistoryDetailScreen | Détail d'une séance passée |
| T6.8 | Historique exercice | ExerciseHistoryScreen | Progression d'un exercice |
| T6.9 | Graphiques charts | ChartsScreen | Graphiques lisibles |

### T7 — Gamification
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T7.1 | Badges screen | Ouvrir BadgesScreen | Tous les badges listés (débloqués + verrouillés) |
| T7.2 | XP après workout | Terminer un workout | XP augmentent sur Home |
| T7.3 | Level up | Atteindre XP suffisant | Animation de montée de niveau |
| T7.4 | Streak calcul | Entraînement jour après jour | Streak incrémente |
| T7.5 | Badge unlock | Remplir condition de badge | BadgeCelebration s'affiche |

### T8 — Assistant IA
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T8.1 | Sans clé API | Ouvrir AssistantScreen | Message demandant la clé ou mode algo interne |
| T8.2 | Avec clé API | Configurer clé Gemini | Génération de programme |
| T8.3 | Preview | AssistantPreviewScreen | Programme proposé visible |
| T8.4 | Accepter plan | Valider le plan généré | Programme créé en DB |
| T8.5 | Mode session | Assistant en mode session | Génère une session pour un programme existant |

### T9 — Réglages
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T9.1 | Thème dark/light | Toggle theme | Couleurs changent immédiatement |
| T9.2 | Langue FR/EN | Changer langue | Tous les textes traduits |
| T9.3 | Nom utilisateur | Modifier nom | Sauvegardé en DB |
| T9.4 | Rappels | Configurer rappels | Notifications programmées |
| T9.5 | Export données | Exporter | Fichier JSON créé + share |
| T9.6 | Import données | Importer fichier JSON | Données restaurées |
| T9.7 | Suppression RGPD | Supprimer toutes les données | Tout effacé, retour onboarding |
| T9.8 | Clé API | Sauvegarder/supprimer | expo-secure-store |

### T10 — Tests transversaux
| ID | Scénario | Action | Résultat attendu |
|----|----------|--------|------------------|
| T10.1 | Rotation écran | Tourner l'appareil | `orientation: portrait` verrouillé |
| T10.2 | Split screen | Mode multi-fenêtres Android | App utilisable ou graceful handling |
| T10.3 | Background/foreground | Basculer vers autre app et revenir | État préservé |
| T10.4 | Kill + restart | Force close → rouvrir | Données persistées (WatermelonDB) |
| T10.5 | Mémoire faible | Simuler low memory | Pas de crash |
| T10.6 | Bouton retour Android | Double-tap retour sur Home | Toast "Appuyez à nouveau" → exit |
| T10.7 | Navigation profonde | Home → Program → Session → Workout → retour | Navigation cohérente |
| T10.8 | Offline complet | Mode avion | App 100% fonctionnelle |
| T10.9 | Police système grande | Accessibilité → grande police | Textes lisibles, pas de coupure |
| T10.10 | Mode sombre système | Changer thème système Android | App respecte son propre toggle |
| T10.11 | Notifications | Rappels d'entraînement | Notification reçue à l'heure |
| T10.12 | Performances scroll | Longue liste d'exercices/historique | FlatList fluide, pas de lag |
| T10.13 | StatusBar | Vérifier couleur status bar | Cohérente avec le thème |
| T10.14 | Haptics | Vérifier vibrations | Feedback sur boutons/delete/success |

---

## Checklist par appareil

Pour **chaque appareil**, copier cette checklist :

```markdown
## Appareil : [Nom] — Android [version] — [taille écran]

### Résultats
| Section | Passé | Échoué | Notes |
|---------|-------|--------|-------|
| T1 Onboarding | /6 | | |
| T2 Home | /8 | | |
| T3 Programmes | /7 | | |
| T4 Sessions | /9 | | |
| T5 Workout | /12 | | |
| T6 Stats | /9 | | |
| T7 Gamification | /5 | | |
| T8 Assistant | /5 | | |
| T9 Réglages | /8 | | |
| T10 Transversaux | /14 | | |
| **TOTAL** | **/83** | | |

### Bugs trouvés
| ID Test | Sévérité | Description | Screenshot |
|---------|----------|-------------|------------|
| | | | |
```

---

## Points d'attention spécifiques par appareil

### Petit écran (5.0")
- [ ] Cards HomeScreen pas tronquées
- [ ] WorkoutExerciseCard lisible
- [ ] Clavier ne cache pas les inputs
- [ ] BottomSheet pas coupé en bas
- [ ] AlertDialog entièrement visible

### Grand écran / Tablette (10"+)
- [ ] Pas d'espaces vides excessifs
- [ ] Textes pas trop petits
- [ ] Touch targets assez grands
- [ ] Graphiques stats lisibles

### Ancien Android (API 28-30)
- [ ] Pas de crash au lancement
- [ ] WatermelonDB/JSI fonctionne
- [ ] Haptics dégradation gracieuse
- [ ] Notifications fonctionnelles
- [ ] expo-secure-store compatible

### Flagship (Android 14-15)
- [ ] New Architecture / Fabric stable
- [ ] Pas de warning deprecation visible
- [ ] Predictive back gesture compatible
- [ ] Edge-to-edge display correct

---

## Processus de test recommandé

### Préparation
1. Build de dev : `npx expo run:android` ou EAS build preview
2. Installer sur chaque appareil/émulateur
3. Effacer les données app entre chaque test complet

### Exécution (par appareil, ~45-60 min)
1. Fresh install → Onboarding (T1)
2. Explorer Home (T2)
3. Créer un programme complet (T3 + T4)
4. Faire un workout complet (T5)
5. Vérifier stats (T6)
6. Vérifier gamification (T7)
7. Tester assistant (T8)
8. Réglages (T9)
9. Tests transversaux (T10)

### Après chaque appareil
- Noter tous les bugs avec sévérité (Critique/Majeur/Mineur/Cosmétique)
- Screenshots des bugs visuels
- Consigner les performances (lag, temps de chargement)

## Statut
⏳ En attente

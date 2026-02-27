# Hero rotating text — 20260227-0410-A

## Statut : DONE ✓

## Fichier modifié
`web/src/components/sections/HeroSection.tsx`

## Changements appliqués

### 1. Constante module-level
```tsx
const WORDS = ["BODY.", "LEGACY.", "STRENGTH.", "GAINS.", "POTENTIAL.", "PHYSIQUE."];
```
Hors composant → pas de re-création à chaque render.

### 2. State ajouté
```tsx
const [wordIdx, setWordIdx] = useState(0);
const [wordVisible, setWordVisible] = useState(true);
```

### 3. useEffect de cycling (avec cleanup)
```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setWordVisible(false);
    const swap = setTimeout(() => {
      setWordIdx((i) => (i + 1) % WORDS.length);
      setWordVisible(true);
    }, 300);
    return () => clearTimeout(swap);
  }, 2800);
  return () => clearInterval(timer);
}, []);
```
- Interval de 2800ms → fade out (300ms) → swap mot → fade in
- Cleanup `clearInterval` + `clearTimeout` interne

### 4. JSX du titre
```tsx
<h1 ...>
  <span className="shimmer-text">SCULPT YOUR </span>
  <span
    className="shimmer-text transition-opacity duration-300"
    style={{ opacity: wordVisible ? 1 : 0 }}
  >
    {WORDS[wordIdx]}
  </span>
  <span className="text-[var(--accent)] animate-[blink_0.7s_step-end_infinite]">|</span>
</h1>
```

## Vérification TypeScript
```
npx tsc --noEmit → exit code 0 ✓
```

## Comportement attendu
- "SCULPT YOUR BODY." → fade out 300ms → "SCULPT YOUR LEGACY." → fade in
- Cycle toutes les 2800ms sur 6 mots
- Le curseur `|` continue de clignoter indépendamment
- Pas de memory leak (cleanup des deux timers)

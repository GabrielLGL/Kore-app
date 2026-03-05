/**
 * animationMap — Mapping animationKey → URL WebP animé de démonstration (Supabase Storage)
 *
 * Source    : free-exercise-db (https://github.com/yuhonas/free-exercise-db)
 *             Licence CC0 — 873 exercices, 2 images JPG par exercice (départ + arrivée)
 * Format    : WebP animé 2 frames (1fps, loop infini) — généré via ffmpeg-static
 * Hébergement : Supabase Storage (bucket public "exercise-animations")
 *   https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/
 *
 * Régénérer : node scripts/build-exercise-animations.mjs > mobile/src/model/utils/animationMap.ts 2>scripts/build-log.txt
 *
 * Fallback  : undefined → ExerciseInfoSheet affiche l'icône barbell
 * Cache     : expo-image cachePolicy="memory-disk" → offline après premier chargement
 */
export const ANIMATION_MAP: Record<string, string | undefined> = {
  // ── Pectoraux ──────────────────────────────────────────────────────────────
  bench_press_barbell:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/bench_press_barbell.webp',
  bench_press_dumbbell:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/bench_press_dumbbell.webp',
  incline_bench_press:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/incline_bench_press.webp',
  push_ups:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/push_ups.webp',
  cable_flyes:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/cable_flyes.webp',
  dips_chest:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/dips_chest.webp',

  // ── Dos ────────────────────────────────────────────────────────────────────
  pull_ups:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/pull_ups.webp',
  barbell_row:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/barbell_row.webp',
  lat_pulldown:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/lat_pulldown.webp',
  deadlift:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/deadlift.webp',
  seated_cable_row:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/seated_cable_row.webp',

  // ── Jambes ─────────────────────────────────────────────────────────────────
  back_squat:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/back_squat.webp',
  leg_press:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/leg_press.webp',
  leg_extension:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/leg_extension.webp',
  dumbbell_lunges:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/dumbbell_lunges.webp',
  bulgarian_split_squat: undefined, // non trouvé dans free-exercise-db
  romanian_deadlift:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/romanian_deadlift.webp',
  lying_leg_curl:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/lying_leg_curl.webp',
  barbell_hip_thrust:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/barbell_hip_thrust.webp',

  // ── Épaules ────────────────────────────────────────────────────────────────
  overhead_press:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/overhead_press.webp',
  lateral_raises:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/lateral_raises.webp',
  face_pull:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/face_pull.webp',

  // ── Biceps ─────────────────────────────────────────────────────────────────
  dumbbell_curl:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/dumbbell_curl.webp',
  ez_bar_curl:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/ez_bar_curl.webp',
  hammer_curl:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/hammer_curl.webp',

  // ── Triceps ────────────────────────────────────────────────────────────────
  triceps_pushdown:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/triceps_pushdown.webp',
  skull_crushers:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/skull_crushers.webp',

  // ── Abdominaux ─────────────────────────────────────────────────────────────
  crunch:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/crunch.webp',
  plank:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/plank.webp',
  leg_raises:
    'https://tcuchypwztvghiywhobo.supabase.co/storage/v1/object/public/exercise-animations/leg_raises.webp',
}

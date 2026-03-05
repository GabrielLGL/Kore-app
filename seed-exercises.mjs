#!/usr/bin/env node
/**
 * seed-exercises.mjs
 *
 * Pipeline : exercisedb.dev (open-source, no API key) → Supabase Storage + DB
 *
 * Ce script :
 *   1. Fetch tous les exercices depuis exercisedb.dev (~1300 exercices)
 *   2. Pour chaque exercice :
 *      a. Skip si le GIF existe déjà dans Storage (idempotent)
 *      b. Download le GIF depuis exercisedb.dev
 *      c. Upload dans Supabase Storage bucket "exercise-gifs"
 *      d. Upsert les métadonnées dans la table "exercises"
 *   3. Traitement par batch de 5, délai 300ms entre chaque batch
 *
 * Usage:
 *   node seed-exercises.mjs
 *
 * Prérequis :
 *   - npm install (à la racine)
 *   - .env.local avec SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   - Table "exercises" créée (scripts/migrations/001-exercises-schema.sql)
 *   - Bucket "exercise-gifs" créé dans Supabase Storage (public)
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local from repo root ─────────────────────────────────────────
const repoRoot = join(fileURLToPath(import.meta.url), '..')
const envPath = join(repoRoot, '.env.local')
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
  console.log('[env] Loaded .env.local')
}

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://tcuchypwztvghiywhobo.supabase.co'
// Fallback : accepte les deux noms de variable
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY (ou SUPABASE_SERVICE_KEY) requis dans .env.local')
  process.exit(1)
}

const BUCKET = 'exercise-gifs'
// free-exercise-db (GitHub, sans API key) — même source que build-exercise-animations.mjs
const FREE_EXERCISE_DB_URL =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json'
const FREE_EXERCISE_IMG_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises'
const BATCH_SIZE = 5
const BATCH_DELAY_MS = 300

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Helpers ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Vérifie si un fichier existe déjà dans Supabase Storage.
 * @param {string} storagePath
 * @returns {Promise<boolean>}
 */
async function imageExistsInStorage(storagePath) {
  const filename = storagePath.split('/').at(-1)
  const folder = storagePath.split('/').slice(0, -1).join('/') || ''
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(folder, { search: filename })
  if (error) return false
  return (data ?? []).some((f) => f.name === filename)
}

/**
 * Download une image depuis une URL et retourne le Buffer.
 * @param {string} url
 * @returns {Promise<Buffer>}
 */
async function downloadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Upload une image dans Supabase Storage et retourne l'URL publique.
 * @param {string} storagePath
 * @param {Buffer} buffer
 * @returns {Promise<string>}
 */
async function uploadImage(storagePath, buffer) {
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })
  if (error) throw new Error(`Storage upload: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

/**
 * Upsert les métadonnées d'un exercice dans la table exercises.
 * Structure free-exercise-db : primaryMuscles[], secondaryMuscles[], category, equipment, images[].
 * @param {object} exercise
 * @param {string} imageUrl
 */
async function upsertExercise(exercise, imageUrl) {
  const { error } = await supabase.from('exercises').upsert(
    {
      id: exercise.id,
      name: exercise.name,
      body_part: exercise.category ?? 'other',
      equipment: exercise.equipment ?? 'body only',
      target: exercise.primaryMuscles?.[0] ?? 'other',
      secondary_muscles: exercise.secondaryMuscles ?? [],
      instructions: exercise.instructions ?? [],
      gif_url: imageUrl,
      gif_original_url: exercise.images?.[0]
        ? `${FREE_EXERCISE_IMG_BASE}/${exercise.images[0]}`
        : null,
    },
    { onConflict: 'id' }
  )
  if (error) throw new Error(`DB upsert: ${error.message}`)
}

/**
 * Traite un exercice : check Storage → download → upload → upsert DB.
 * @param {object} exercise
 * @param {number} index
 * @param {number} total
 */
async function processExercise(exercise, index, total) {
  const label = `[${index}/${total}] ${exercise.name}`
  const storagePath = `${exercise.id}.jpg`

  try {
    // 1. Skip si déjà uploadé (idempotent)
    const exists = await imageExistsInStorage(storagePath)
    if (exists) {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath)
      await upsertExercise(exercise, data.publicUrl)
      console.log(`${label} ⏭ déjà en Storage (metadata mis à jour)`)
      return
    }

    // 2. Récupérer la première image disponible
    if (!exercise.images || exercise.images.length === 0) {
      console.log(`${label} ⚠ pas d'image → skipped`)
      return
    }
    const imageUrl = `${FREE_EXERCISE_IMG_BASE}/${exercise.images[0]}`
    const buffer = await downloadImage(imageUrl)

    // 3. Upload dans Storage
    const publicUrl = await uploadImage(storagePath, buffer)

    // 4. Upsert dans la table exercises
    await upsertExercise(exercise, publicUrl)

    console.log(`${label} ✅`)
  } catch (err) {
    console.error(`${label} ❌ ${err.message}`)
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('[info] Fetching free-exercise-db dataset (GitHub)...')
  const res = await fetch(FREE_EXERCISE_DB_URL)
  if (!res.ok) {
    console.error(`[fatal] free-exercise-db fetch failed: ${res.status}`)
    process.exit(1)
  }

  const exercises = await res.json()
  const total = exercises.length
  console.log(`[info] ${total} exercices à traiter`)
  console.log(`[info] Batch size: ${BATCH_SIZE}, délai: ${BATCH_DELAY_MS}ms`)
  console.log('')

  let done = 0
  for (let i = 0; i < exercises.length; i += BATCH_SIZE) {
    const batch = exercises.slice(i, i + BATCH_SIZE)
    await Promise.all(
      batch.map((ex, j) => processExercise(ex, i + j + 1, total))
    )
    done += batch.length
    if (done < total) await sleep(BATCH_DELAY_MS)
  }

  console.log('')
  console.log(`[done] ${total} exercices traités`)
  console.log('[done] Vérifier dans Supabase Dashboard :')
  console.log(`       Storage → exercise-gifs → fichiers .jpg`)
  console.log(`       Table Editor → exercises → ${total} lignes`)
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(1)
})

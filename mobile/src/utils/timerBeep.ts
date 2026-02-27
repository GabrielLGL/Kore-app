import { Audio } from 'expo-av'

// Table base64 standard
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/**
 * Encode un Uint8Array en base64 (implémentation pure JS, sans btoa).
 * Nécessaire car btoa sur Hermes peut être instable avec des bytes > 127.
 */
function uint8ToBase64(bytes: Uint8Array): string {
  let out = ''
  const n = bytes.length
  for (let i = 0; i < n; i += 3) {
    const b0 = bytes[i]
    const b1 = i + 1 < n ? bytes[i + 1] : 0
    const b2 = i + 2 < n ? bytes[i + 2] : 0
    out += B64[b0 >> 2]
    out += B64[((b0 & 3) << 4) | (b1 >> 4)]
    out += i + 1 < n ? B64[((b1 & 15) << 2) | (b2 >> 6)] : '='
    out += i + 2 < n ? B64[b2 & 63] : '='
  }
  return out
}

/**
 * Génère un buffer WAV PCM 8-bit mono 8000Hz contenant un bip 440Hz de 0.3s.
 * Fade-in et fade-out de 10% pour éviter les claquements.
 */
function buildBeepWav(): Uint8Array {
  const sampleRate = 8000
  const numSamples = 2400 // 0.3s à 8000Hz
  const freq = 440
  const total = 44 + numSamples
  const buf = new Uint8Array(total)

  const setU32LE = (off: number, v: number) => {
    buf[off] = v & 0xff
    buf[off + 1] = (v >> 8) & 0xff
    buf[off + 2] = (v >> 16) & 0xff
    buf[off + 3] = (v >> 24) & 0xff
  }
  const setU16LE = (off: number, v: number) => {
    buf[off] = v & 0xff
    buf[off + 1] = (v >> 8) & 0xff
  }

  // RIFF chunk
  buf[0] = 82; buf[1] = 73; buf[2] = 70; buf[3] = 70  // "RIFF"
  setU32LE(4, total - 8)
  buf[8] = 87; buf[9] = 65; buf[10] = 86; buf[11] = 69  // "WAVE"

  // fmt sub-chunk
  buf[12] = 102; buf[13] = 109; buf[14] = 116; buf[15] = 32  // "fmt "
  setU32LE(16, 16)   // chunk size
  setU16LE(20, 1)    // PCM
  setU16LE(22, 1)    // mono
  setU32LE(24, sampleRate)
  setU32LE(28, sampleRate)  // byteRate = sampleRate * channels * bitsPerSample/8
  setU16LE(32, 1)    // blockAlign
  setU16LE(34, 8)    // bitsPerSample

  // data sub-chunk
  buf[36] = 100; buf[37] = 97; buf[38] = 116; buf[39] = 97  // "data"
  setU32LE(40, numSamples)

  // Samples : sinus 440Hz avec fade-in/out
  const fadeLen = Math.floor(numSamples * 0.1)
  const TWO_PI_FREQ_OVER_SR = (2 * Math.PI * freq) / sampleRate
  for (let i = 0; i < numSamples; i++) {
    let amp = 100
    if (i < fadeLen) amp = 100 * (i / fadeLen)
    else if (i > numSamples - fadeLen) amp = 100 * ((numSamples - i) / fadeLen)
    const raw = Math.round(Math.sin(TWO_PI_FREQ_OVER_SR * i) * amp) + 128
    buf[44 + i] = raw < 0 ? 0 : raw > 255 ? 255 : raw
  }

  return buf
}

let _cachedDataUri: string | null = null

/**
 * Retourne la data URI du beep (générée une fois, mise en cache en mémoire).
 * Format : data:audio/wav;base64,...
 */
function getBeepDataUri(): string {
  if (!_cachedDataUri) {
    _cachedDataUri = 'data:audio/wav;base64,' + uint8ToBase64(buildBeepWav())
  }
  return _cachedDataUri
}

/**
 * Crée et retourne un Audio.Sound prêt à jouer (beep 440Hz, 0.3s).
 * Le WAV est généré en mémoire — aucun fichier ni réseau requis.
 *
 * @example
 * const sound = await createBeepSound()
 * await sound.playAsync()
 * // Décharger dans le cleanup :
 * sound.unloadAsync()
 */
export async function createBeepSound(): Promise<Audio.Sound> {
  const { sound } = await Audio.Sound.createAsync({ uri: getBeepDataUri() })
  return sound
}

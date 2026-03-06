import { database } from '../model'

const API_KEY_STORE_KEY = 'kore_ai_api_key'

/**
 * Lazy-loaded SecureStore module.
 * Returns null when the native module is unavailable (e.g. Expo Go).
 * If a native call fails at runtime, the store is permanently disabled.
 */
let _secureStore: typeof import('expo-secure-store') | null = null
let _checked = false
let _disabled = false

function getSecureStore(): typeof import('expo-secure-store') | null {
  if (_disabled) return null
  if (_checked) return _secureStore
  _checked = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _secureStore = require('expo-secure-store') as typeof import('expo-secure-store')
  } catch {
    if (__DEV__) console.warn('[secureKeyStore] expo-secure-store unavailable — falling back to no-op')
    _secureStore = null
  }
  return _secureStore
}

/** Mark store as permanently disabled after a native call failure. */
function disableStore(): void {
  _disabled = true
  _secureStore = null
  if (__DEV__) console.warn('[secureKeyStore] native call failed — store disabled for this session')
}

/** Read the API key from secure storage. Returns null if not set or module unavailable. */
export async function getApiKey(): Promise<string | null> {
  try {
    const store = getSecureStore()
    if (!store) return null
    return await store.getItemAsync(API_KEY_STORE_KEY)
  } catch {
    disableStore()
    return null
  }
}

/** Save the API key to secure storage. No-op if module unavailable. */
export async function setApiKey(key: string): Promise<void> {
  try {
    const store = getSecureStore()
    if (!store) return
    await store.setItemAsync(API_KEY_STORE_KEY, key)
  } catch {
    disableStore()
  }
}

/** Delete the API key from secure storage. No-op if module unavailable. */
export async function deleteApiKey(): Promise<void> {
  try {
    const store = getSecureStore()
    if (!store) return
    await store.deleteItemAsync(API_KEY_STORE_KEY)
  } catch {
    disableStore()
  }
}

/**
 * One-time migration: if the User row still has an ai_api_key in SQLite,
 * move it to secure storage and clear the SQLite field.
 * Note: ai_api_key was removed from the model/schema in v32 but the column
 * remains in SQLite — we access it via _raw for backward compat.
 */
export async function migrateKeyFromDB(): Promise<void> {
  try {
    const users = await database.get('users').query().fetch()
    const user = users[0]
    if (!user) return

    const rawKey = (user._raw as Record<string, unknown>)['ai_api_key'] as string | null
    if (!rawKey) return

    // Already migrated?
    const existing = await getApiKey()
    if (!existing) {
      await setApiKey(rawKey)
    }

    // Clear the plain-text key from SQLite
    await database.write(async () => {
      await user.update(() => {
        ;(user._raw as Record<string, unknown>)['ai_api_key'] = null
      })
    })
  } catch {
    // Non-blocking: migration failure is not critical
    if (__DEV__) console.warn('[secureKeyStore] migration failed')
  }
}

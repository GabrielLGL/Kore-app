import { Platform } from 'react-native'

const CHANNEL_ID = 'rest-timer'

// Lazy-load expo-notifications to avoid crashing when the native module
// (ExpoPushTokenManager) is unavailable (e.g. Expo Go, missing native build).
function getNotifications() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('expo-notifications') as typeof import('expo-notifications')
  } catch {
    return null
  }
}

export async function setupNotificationChannel(): Promise<void> {
  const Notifications = getNotifications()
  if (!Notifications || Platform.OS !== 'android') return
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Minuteur de repos',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 400, 200, 400],
  })
}

export async function requestNotificationPermission(): Promise<boolean> {
  const Notifications = getNotifications()
  if (!Notifications) return false

  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true

  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

export async function scheduleRestEndNotification(
  durationSeconds: number
): Promise<string | null> {
  const Notifications = getNotifications()
  if (!Notifications) return null

  try {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Repos terminé !',
        body: 'Prêt pour la prochaine série ?',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: durationSeconds,
      },
    })
    return identifier
  } catch {
    return null
  }
}

export async function cancelNotification(identifier: string): Promise<void> {
  const Notifications = getNotifications()
  if (!Notifications) return
  await Notifications.cancelScheduledNotificationAsync(identifier)
}

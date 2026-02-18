import {
  setupNotificationChannel,
  requestNotificationPermission,
  scheduleRestEndNotification,
  cancelNotification,
} from '../notificationService'

jest.mock('expo-notifications', () => ({
  AndroidImportance: { HIGH: 5 },
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval' },
  setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'undetermined' }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  scheduleNotificationAsync: jest.fn().mockResolvedValue('notif-id-123'),
  cancelScheduledNotificationAsync: jest.fn().mockResolvedValue(undefined),
}))

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}))

import * as Notifications from 'expo-notifications'

describe('notificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('setupNotificationChannel', () => {
    it('creates android channel with correct config', async () => {
      await setupNotificationChannel()

      expect(Notifications.setNotificationChannelAsync).toHaveBeenCalledWith(
        'rest-timer',
        expect.objectContaining({
          name: 'Minuteur de repos',
          importance: 5,
        })
      )
    })
  })

  describe('requestNotificationPermission', () => {
    it('returns true when permission already granted', async () => {
      ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      })

      const result = await requestNotificationPermission()

      expect(result).toBe(true)
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled()
    })

    it('requests permission when not granted and returns true on approval', async () => {
      ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'undetermined',
      })
      ;(Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'granted',
      })

      const result = await requestNotificationPermission()

      expect(result).toBe(true)
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled()
    })

    it('returns false when permission denied', async () => {
      ;(Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'undetermined',
      })
      ;(Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({
        status: 'denied',
      })

      const result = await requestNotificationPermission()

      expect(result).toBe(false)
    })
  })

  describe('scheduleRestEndNotification', () => {
    it('schedules notification and returns identifier', async () => {
      const id = await scheduleRestEndNotification(90)

      expect(id).toBe('notif-id-123')
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            title: 'Repos terminé !',
          }),
          trigger: expect.objectContaining({
            seconds: 90,
          }),
        })
      )
    })

    it('returns null when scheduling fails', async () => {
      ;(Notifications.scheduleNotificationAsync as jest.Mock).mockRejectedValueOnce(
        new Error('scheduling error')
      )

      const id = await scheduleRestEndNotification(60)

      expect(id).toBeNull()
    })
  })

  describe('cancelNotification', () => {
    it('cancels notification by identifier', async () => {
      await cancelNotification('notif-id-123')

      expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith(
        'notif-id-123'
      )
    })
  })
})

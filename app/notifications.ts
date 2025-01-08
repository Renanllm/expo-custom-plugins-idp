import notifee from '@notifee/react-native'

class NotificationService {
  private static instance: NotificationService
  private categories = [
    {
      id: 'CountNotification',
      actions: [
        {
          id: 'CountNotification.add',
          title: '+',
          foreground: true,
        },
        {
          id: 'CountNotification.remove',
          title: '-',
          foreground: true,
        },
      ],
    },
    {
      id: 'CarouselNotification',
      actions: [
        {
          id: 'CarouselNotification.next',
          title: '-->',
          foreground: true,
        },
        {
          id: 'CarouselNotification.previous',
          title: '<--',
          foreground: true,
        },
      ],
    },
  ]

  private constructor() {
    this.setNotificationCategories()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private async setNotificationCategories(): Promise<void> {
    await notifee.setNotificationCategories(this.categories)
  }
}

export default NotificationService.getInstance()

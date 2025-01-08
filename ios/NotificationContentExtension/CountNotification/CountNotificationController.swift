import UIKit
import UserNotifications
import UserNotificationsUI
import SwiftUI

class CountNotificationViewController:NSObject, NotificationControllerProtocol {
  typealias NotificationViewType = CountNotificationView
  
  var hostingView: UIHostingController<AnyView>!
  var countNotificationViewModel: CountNotificationViewModel?
  var notificationContent: UNMutableNotificationContent?
  
  static var instance: CountNotificationViewController?
  
  static func getInstance() -> CountNotificationViewController {
    if instance == nil {
      instance = CountNotificationViewController()
      return instance!
    }
    
    return instance!
  }
  
  func didReceive(_ notification: UNNotification) {
    self.notificationContent = (notification.request.content.mutableCopy() as? UNMutableNotificationContent)
    
    if let notificationContent = notificationContent {
      self.countNotificationViewModel = CountNotificationViewModel(count: 0)
      let countNotificationView = CountNotificationView(viewModel: self.countNotificationViewModel!)
      hostingView = UIHostingController(rootView: AnyView(countNotificationView))
    }
  }
  
  func didReceive(_ response: UNNotificationResponse, completionHandler completion: @escaping (UNNotificationContentExtensionResponseOption) -> Void) {
    if response.actionIdentifier == "CountNotification.add" {
      self.countNotificationViewModel?.add()
      completion(UNNotificationContentExtensionResponseOption.doNotDismiss)
    } else if response.actionIdentifier == "CountNotification.remove" {
      self.countNotificationViewModel?.remove()
      completion(UNNotificationContentExtensionResponseOption.doNotDismiss)
    } else {
      completion(UNNotificationContentExtensionResponseOption.dismissAndForwardAction)
    }
  }
}


import UIKit
import UserNotifications
import UserNotificationsUI
import SwiftUI

class NotificationViewController: UIViewController, UNNotificationContentExtension {
  var notificationContent: UNMutableNotificationContent?
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any required interface initialization here.
  }
  
  func didReceive(_ notification: UNNotification) {
    self.notificationContent = (notification.request.content.mutableCopy() as? UNMutableNotificationContent)
    var controller: (any NotificationControllerProtocol)? = nil
    controller = CountNotificationViewController.getInstance()
    controller?.didReceive(notification)
    buildHostingView(controller: controller)
  }
  
  func didReceive(_ response: UNNotificationResponse, completionHandler completion: @escaping (UNNotificationContentExtensionResponseOption) -> Void) {
    CountNotificationViewController.getInstance().didReceive(response, completionHandler: completion)
  }
  
  private func buildHostingView(controller: (any NotificationControllerProtocol)?) {
    if controller != nil {
      let hostingView: UIHostingController = controller!.hostingView
      self.view.addSubview(hostingView.view)
      hostingView.view.translatesAutoresizingMaskIntoConstraints = false
      
      hostingView.view.topAnchor.constraint(equalTo: view.topAnchor).isActive = true
      hostingView.view.bottomAnchor.constraint(equalTo: view.bottomAnchor).isActive = true
      hostingView.view.leadingAnchor.constraint(equalTo: view.leadingAnchor).isActive = true
      hostingView.view.trailingAnchor.constraint(equalTo: view.trailingAnchor).isActive = true
    }
  }
}

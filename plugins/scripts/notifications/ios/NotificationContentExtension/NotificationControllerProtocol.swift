import Foundation
import UserNotificationsUI
import SwiftUI

protocol NotificationControllerProtocol: UNNotificationContentExtension {
  var hostingView: UIHostingController<AnyView>! { get }
}

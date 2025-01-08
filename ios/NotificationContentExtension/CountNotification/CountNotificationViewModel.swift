import Foundation

class CountNotificationViewModel: ObservableObject {
  @Published var count = 0
  
  init(count: Int = 0) {
    self.count = count
  }
  
  func add() {
    count = count + 1
  }
  
  func remove() {
    count = count - 1
  }
}
import SwiftUI

struct CountNotificationView: View {
  @ObservedObject private var viewModel: CountNotificationViewModel

  init(viewModel: CountNotificationViewModel) {
    self.viewModel = viewModel
  }

  var body: some View {
    VStack {
      Text("\(viewModel.count)")
        .font(.largeTitle)
        .fontWeight(.bold)
        .foregroundColor(.black)
        .padding()
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.white)
  }
}

import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import notifee from '@notifee/react-native'

export default function Index() {

  const onDisplayNotification = async () => {
    await notifee.requestPermission()
    await notifee.displayNotification({
      title: 'Count Notification',
      ios: {
        categoryId: 'CountNotification',
      }
    })
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Display Count Notification" onPress={onDisplayNotification} />
    </View>
  );
}

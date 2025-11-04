import { Tabs } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Tabs>
        <Tabs.Screen name="index" options={{ headerShown: false }} />
        <Tabs.Screen name="Settings" options={{ headerShown: false }} />
      </Tabs>
    </PaperProvider>
  )
}
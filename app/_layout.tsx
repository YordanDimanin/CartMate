import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar backgroundColor="#25292E" barStyle="light-content" />
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor: "#25292E" },
            animation: "slide_from_right", // ✅ smoother than slide for dark themes
            gestureEnabled: true,
            animationDuration: 250, // subtle fade effect during pop
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="[id]"
            options={{
              title: "",
              headerStyle: {
                backgroundColor: "#25292E",
              },
              headerTintColor: "#3DA35D",
              headerShadowVisible: false,
              contentStyle: { backgroundColor: "#25292E" },
              animation: "slide_from_right", // ✅ keeps both screens visible longer
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

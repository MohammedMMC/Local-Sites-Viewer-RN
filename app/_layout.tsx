import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary
        },
        headerTitleAlign: "center",
        headerTintColor: Colors.background,
        navigationBarColor: Colors.primary,
        statusBarBackgroundColor: Colors.primary,
        headerTitleStyle: {
          fontWeight: 700
        },
        title: "Local Sites Viewer",
      }}>
        <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

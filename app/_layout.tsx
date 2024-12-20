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
        navigationBarColor: Colors.primaryDarker,
        statusBarBackgroundColor: Colors.primaryDarker,
        headerTitleStyle: {
          fontWeight: 700
        },
        title: "Local Sites Viewer",
      }}>
    </Stack>
  );
}

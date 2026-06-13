import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { LanguageProvider } from "@/src/i18n/LanguageContext";
import { ThemeProvider as AppThemeProvider } from "@/src/theme/ThemeContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  return (
    <LanguageProvider>
      <AppThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" />
        </Stack>

        <StatusBar style="light" />
      </AppThemeProvider>
    </LanguageProvider>
  );
}
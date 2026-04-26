import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import { initDb } from "@/lib/db";
import * as SQLite from "expo-sqlite";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect((): void => {
    initDb()
      .then(async (db: SQLite.SQLiteDatabase) => {
        const version = await db.getFirstAsync("PRAGMA user_version;");
        const tables = await db.getAllAsync(`
          SELECT name
          FROM sqlite_master
          WHERE type = 'table'
            AND name IN ('sessions', 'exercises', 'exercise_logs', 'exercise_series');
        `);
        console.log("DB version:", version);
        console.log("Tables:", tables);
      })
      .catch((error: unknown): void => {
        console.error("DB init error", error);
      });
  }, []);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

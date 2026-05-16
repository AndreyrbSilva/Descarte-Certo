import * as SecureStore from "expo-secure-store";

export type ThemePreference = "system" | "light" | "dark";

export async function saveThemePreference(theme: ThemePreference) {
  await SecureStore.setItemAsync("themePreference", theme);
}

export async function loadThemePreference(): Promise<ThemePreference> {
  const saved = await SecureStore.getItemAsync("themePreference");
  if (saved === "light" || saved === "dark" || saved === "system") return saved;
  return "system";
}

import { useColorScheme } from "react-native";

export function useSplashColors() {
  const isDark = useColorScheme() === "dark";
  return {
    bgColor:         isDark ? "#1a1a1a"  : "#ffffff",
    explosionColor:  isDark ? "#4ed37e"  : "#86efac",
    titleGreenColor: isDark ? "#082010"  : "#0a3018",
    titleDarkColor:  "#111827",
    taglineColor:    isDark ? "#9ca3af"  : "#6b7280",
    ballColor:       isDark ? "#4ade80"  : "#86efac",
  };
}

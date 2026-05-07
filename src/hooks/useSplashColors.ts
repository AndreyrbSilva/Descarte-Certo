import { useTheme } from "../context/ThemeContext";

export function useSplashColors() {
  const { isDark } = useTheme();
  return {
    bgColor:         isDark ? "#1a1a1a"  : "#ffffff",
    explosionColor:  isDark ? "#4ed37e"  : "#86efac",
    titleGreenColor: isDark ? "#082010"  : "#0a3018",
    titleDarkColor:  isDark ? "#111827" : "#f8fafc",
    taglineColor:    isDark ? "#9ca3af"  : "#6b7280",
    ballColor:       isDark ? "#4ade80"  : "#86efac",
  };
}

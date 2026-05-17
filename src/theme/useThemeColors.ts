import { useTheme } from "../context/ThemeContext";

export function useThemeColors() {
  const { isDark } = useTheme();
  return {
    cardBg:       isDark ? "#242424" : "#ffffff",
    inputBg:      isDark ? "#2d2d2d" : "#f8fafc",
    inputBorder:  isDark ? "#3d3d3d" : "#e2e8f0",
    labelColor:   isDark ? "#9ca3af" : "#6b7280",
    textColor:    isDark ? "#f1f5f9" : "#111827",
    subTextColor: isDark ? "#6b7280" : "#9ca3af",
    iconColor:    isDark ? "#4b5563" : "#94a3b8",
    dividerColor: isDark ? "#2d2d2d" : "#f1f5f9",
  };
}

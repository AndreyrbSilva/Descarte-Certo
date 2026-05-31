import { useTheme } from "../context/ThemeContext";

export function useRegisterColors() {
  const { isDark } = useTheme();
  return {
    cardBg:       isDark ? "#1e293b" : "#ffffff",
    inputBg:      isDark ? "#0f172a" : "#f8fafc",
    inputBorder:  isDark ? "#334155" : "#e2e8f0",
    labelColor:   isDark ? "#cbd5e1" : "#475569",
    textColor:    isDark ? "#f1f5f9" : "#1e293b",
    subTextColor: isDark ? "#94a3b8" : "#64748b",
    iconColor:    isDark ? "#64748b" : "#94a3b8",
    dividerColor: isDark ? "#334155" : "#e2e8f0",
  };
}

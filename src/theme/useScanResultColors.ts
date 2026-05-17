import { useTheme } from "../context/ThemeContext";

export function useScanResultColors() {
  const { isDark: dark } = useTheme();
  return {
    cardBg:       dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    iconBg:       dark ? "#052e16" : "#dcfce7",
    dividerColor: dark ? "#334155" : "#e2e8f0",
  };
}

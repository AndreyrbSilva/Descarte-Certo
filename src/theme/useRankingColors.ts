import { useTheme } from "../context/ThemeContext";

export function useRankingColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:           dark ? "#0f172a" : "#f8fafc",
    cardBg:       dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    dividerColor: dark ? "#334155" : "#e2e8f0",
    iconBg:       dark ? "#162418" : "#dcfce7",
    tabBg:        dark ? "#1e293b" : "#ffffff",
    tabActive:    "#22c55e",
    tabInactive:  dark ? "#475569" : "#94a3b8",
    gold:         "#f59e0b",
    silver:       "#94a3b8",
    bronze:       "#b45309",
    podiumBg:     dark ? "#162418" : "#f0fdf4",
    statusBar:    dark ? "light-content" : "dark-content" as any,
  };
}

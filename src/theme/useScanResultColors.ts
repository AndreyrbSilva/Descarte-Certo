import { useTheme } from "../context/ThemeContext";

export function useScanResultColors() {
  const { isDark: dark } = useTheme();
  return {
    cardBg:          dark ? "#1e293b" : "#ffffff",
    textColor:       dark ? "#f1f5f9" : "#1e293b",
    subTextColor:    dark ? "#94a3b8" : "#64748b",
    iconBg:          dark ? "#052e16" : "#dcfce7",
    dividerColor:    dark ? "#334155" : "#e2e8f0",
    // Streak section
    streakBg:        dark ? "#1a1a2e" : "#fff7ed",
    streakIconBg:    dark ? "#431407" : "#fed7aa",
    streakBarBg:     dark ? "#374151" : "#e5e7eb",
    // XP / Level section
    xpBg:            dark ? "#0f1729" : "#f0fdf4",
    xpBarBg:         dark ? "#374151" : "#d1fae5",
    xpBarFill:       "#22c55e",
    // Bin / Disposal section
    binBg:           dark ? "#1a1a2e" : "#f8fafc",
    // Curiosity section
    curiosityBg:     dark ? "#0c1a2e" : "#eff6ff",
    curiosityIconBg: dark ? "#1e3a5f" : "#dbeafe",
    curiosityAccent: dark ? "#60a5fa" : "#3b82f6",
  };
}

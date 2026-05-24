import { useTheme } from "../context/ThemeContext";

export function useAdminColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:           dark ? "#0f172a" : "#f1f5f9",
    cardBg:       dark ? "#1e293b" : "#ffffff",
    headerBg:     dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    labelColor:   dark ? "#cbd5e1" : "#475569",
    dividerColor: dark ? "#334155" : "#e2e8f0",
    inputBg:      dark ? "#0f172a" : "#f8fafc",
    inputBorder:  dark ? "#334155" : "#e2e8f0",
    chipBg:       dark ? "#0f172a" : "#f1f5f9",
    rowHover:     dark ? "#243047" : "#f8fafc",
    statusBar:    dark ? ("light-content" as const) : ("dark-content" as const),

    // stat card accents
    statGreen:  "#22c55e",
    statOrange: "#f97316",
    statBlue:   "#3b82f6",
    statRed:    "#ef4444",

    // badge roles
    badgeStudent: { bg: "#dbeafe", text: "#1d4ed8" },
    badgeTeacher: { bg: "#fef9c3", text: "#a16207" },
    badgeAdmin:   { bg: "#fee2e2", text: "#b91c1c" },
  };
}

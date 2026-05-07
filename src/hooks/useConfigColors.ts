import { useColorScheme } from "react-native";

export function useConfigColors() {
  const dark = useColorScheme() === "dark";
  return {
    bg:           dark ? "#0f172a" : "#f8fafc",
    cardBg:       dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    dividerColor: dark ? "#334155" : "#e2e8f0",
    sectionLabel: dark ? "#475569" : "#94a3b8",
    dangerColor:  "#ef4444",
    statusBar:    dark ? "light-content" : "dark-content" as any,
  };
}

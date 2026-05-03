import { useColorScheme } from "react-native";

export function useProfileColors() {
  const dark = useColorScheme() === "dark";
  return {
    bg:           dark ? "#0f172a" : "#f8fafc",
    chipBg: dark ? "#1e293b" : "#f1f5f9",
    cardBg:       dark ? "#1e293b" : "#ffffff",
    textColor:    dark ? "#f1f5f9" : "#1e293b",
    subTextColor: dark ? "#94a3b8" : "#64748b",
    labelColor:   dark ? "#cbd5e1" : "#475569",
    dividerColor: dark ? "#334155" : "#e2e8f0",
    statCardA:    "#f97316",
    statCardB:    "#3b82f6",
    iconBg:       dark ? "#052e16" : "#dcfce7",
  };
}

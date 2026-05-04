import { useColorScheme } from "react-native";

export function useTabColors() {
  const dark = useColorScheme() === "dark";
  return {
    tabBg:    dark ? "#1e293b" : "#f1f5f9",
    border:   dark ? "#334155" : "#cbd5e1",
    active:  "#22c55e",
    inactive: dark ? "#64748b" : "#94a3b8",
  };
}

import { useColorScheme } from "react-native";

export function useTabColors() {
  const dark = useColorScheme() === "dark";
  return {
    tabBg:   dark ? "#0f172a" : "#ffffff",
    border:  dark ? "#1e293b" : "#e2e8f0",
    active:  "#22c55e",
    inactive: dark ? "#475569" : "#94a3b8",
  };
}

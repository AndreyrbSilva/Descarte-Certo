import { useTheme } from "../context/ThemeContext";

export function useTabColors() {
  const { isDark: dark } = useTheme();
  return {
    tabBg:    dark ? "#1e293b" : "#f1f5f9",
    border:   dark ? "#334155" : "#cbd5e1",
    active:   "#22c55e",
    inactive: dark ? "#64748b" : "#94a3b8",
  };
}

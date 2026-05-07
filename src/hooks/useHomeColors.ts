import { useTheme } from "../context/ThemeContext";

export function useHomeColors() {
  const { isDark: dark } = useTheme();
  return {
    bg:            dark ? "#0f172a" : "#f8fafc",
    cardBg:        dark ? "#1e293b" : "#ffffff",
    textColor:     dark ? "#f1f5f9" : "#1e293b",
    subTextColor:  dark ? "#94a3b8" : "#64748b",
    dividerColor:  dark ? "#334155" : "#e2e8f0",
    iconBg:        dark ? "#162418" : "#dcfce7",
    progressTrack: dark ? "#334155" : "#e2e8f0",
    statusBar:     dark ? "light-content" : "dark-content" as any,
    factIcon:      "#ffffff",
    factContent:   "#ffffff",
    factIconBg:    dark ? "#1e293b" : "#e2e8f0",
    factBg:        "#4b7ee7",
    factSubText:   "#ffffff",
  };
}
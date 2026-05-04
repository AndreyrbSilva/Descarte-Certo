import { useColorScheme } from "react-native";

export function useHomeColors() {
  const dark = useColorScheme() === "dark";
  return {
    bg:            dark ? "#0f172a" : "#f8fafc",
    cardBg:        dark ? "#1e293b" : "#ffffff",
    textColor:     dark ? "#f1f5f9" : "#1e293b",
    subTextColor:  dark ? "#94a3b8" : "#64748b",
    dividerColor:  dark ? "#334155" : "#e2e8f0",
    iconBg:        dark ? "#162418" : "#dcfce7",
    progressTrack: dark ? "#334155" : "#e2e8f0",
    statusBar:     dark ? "light-content" : "dark-content" as any,
    factIcon:      dark ? "#ffffff" : "#ffffff",
    factContent:   dark ? "#ffffff" : "#ffffff",
    factIconBg:    dark ? "#1e293b" : "#e2e8f0",
    factBg:        dark ? "#4b7ee7" : "#4b7ee7",
    factSubText:   dark ? "#ffffff" : "#ffffff",
  };
}
